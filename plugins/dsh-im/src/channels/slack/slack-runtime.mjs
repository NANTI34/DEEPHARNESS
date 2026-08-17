import { splitMessageText } from '../shared/editable-message-stream.mjs';
import { SlackApi } from './slack-api.mjs';
import { createSlackBridgeStatus, SlackHarnessBridge } from './slack-bridge.mjs';

const RECONNECT_DELAYS_MS = Object.freeze([1_000, 3_000, 5_000, 10_000, 30_000]);
const SLACK_MESSAGE_LIMIT = 38_000;
const SLACK_STREAM_CHUNK_LIMIT = 11_000;

function addSocketListener(socket, event, listener) {
  if (typeof socket.addEventListener === 'function') socket.addEventListener(event, listener);
  else if (typeof socket.on === 'function') socket.on(event, listener);
  else throw new TypeError('Slack WebSocket does not support events');
}

function eventData(event) {
  const value = event?.data ?? event;
  if (typeof value === 'string') return value;
  if (Buffer.isBuffer(value)) return value.toString('utf8');
  if (value instanceof ArrayBuffer) return Buffer.from(value).toString('utf8');
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString('utf8');
  }
  return null;
}

function socketUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'wss:') throw new Error('Slack returned an insecure Socket Mode URL');
  return url.href;
}

function decodeSlackText(value) {
  return typeof value === 'string' ? value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>') : '';
}

function stripBotMention(value, botUserId) {
  return decodeSlackText(value)
    .replace(new RegExp(`<@${botUserId}>`, 'gi'), '')
    .trim();
}

export function normalizeSlackEvent(payload, botUserId) {
  const event = payload?.event;
  if (!event || !payload?.event_id || !event.channel || !event.user || !event.ts) return null;
  const direct = event.type === 'message' && event.channel_type === 'im';
  const mentioned = event.type === 'app_mention';
  if (!direct && !mentioned) return null;
  if (event.subtype || event.bot_id || event.app_id) return null;
  const threadTs = String(event.thread_ts ?? event.ts);
  return {
    messageId: String(payload.event_id),
    senderId: String(event.user),
    senderIsBot: String(event.user) === String(botUserId),
    kind: direct ? 'direct' : 'group',
    conversationId: direct ? String(event.channel) : `${event.channel}:${threadTs}`,
    content: stripBotMention(event.text ?? '', botUserId),
    addressed: direct || mentioned,
    replyTarget: {
      channelId: String(event.channel),
      threadTs,
      recipientUserId: String(event.user),
      recipientTeamId: String(event.user_team ?? payload.team_id ?? ''),
    },
  };
}

function isToolProgress(text) {
  return typeof text === 'string' && /^正在使用.+…$/.test(text.trim());
}

async function appendInChunks(api, target, ts, text, signal) {
  if (!text) return;
  for (let offset = 0; offset < text.length; offset += SLACK_STREAM_CHUNK_LIMIT) {
    await api.appendStream({
      channelId: target.channelId,
      ts,
      markdownText: text.slice(offset, offset + SLACK_STREAM_CHUNK_LIMIT),
      signal,
    });
  }
}

async function createSlackMessageStream({ api, target, signal, logger }) {
  const started = await api.startStream({
    channelId: target.channelId,
    threadTs: target.threadTs,
    recipientTeamId: target.recipientTeamId || undefined,
    recipientUserId: target.recipientUserId || undefined,
    signal,
  });
  const ts = typeof started?.ts === 'string' ? started.ts : null;
  if (!ts) throw new Error('Slack did not return a streaming message timestamp');

  let appended = '';
  let pending = '';
  let timer = null;
  let inFlight = null;
  let broken = false;
  let closed = false;

  const appendLatest = async (text) => {
    const next = splitMessageText(text, SLACK_MESSAGE_LIMIT)[0] ?? '';
    if (!next || !next.startsWith(appended)) return;
    const delta = next.slice(appended.length);
    if (!delta) return;
    await appendInChunks(api, target, ts, delta, signal);
    appended = next;
  };

  const schedule = () => {
    if (closed || broken || timer !== null || inFlight || !pending) return;
    timer = setTimeout(() => {
      timer = null;
      const text = pending;
      pending = '';
      inFlight = appendLatest(text)
        .catch((error) => {
          broken = true;
          logger.warn?.('[dsh-im:slack] streaming append failed:', error);
        })
        .finally(() => {
          inFlight = null;
          schedule();
        });
    }, 350);
    timer?.unref?.();
  };

  return {
    update(text) {
      if (closed || broken || typeof text !== 'string' || !text.trim() || isToolProgress(text)) return;
      pending = text;
      schedule();
    },
    async finish(text) {
      if (closed) throw new Error('Slack message stream is already closed');
      closed = true;
      if (timer !== null) clearTimeout(timer);
      timer = null;
      pending = '';
      await inFlight?.catch(() => undefined);

      const chunks = splitMessageText(text, SLACK_MESSAGE_LIMIT);
      const first = chunks[0] ?? '处理完成。';
      if (!broken && first.startsWith(appended)) {
        await appendInChunks(api, target, ts, first.slice(appended.length), signal);
        await api.stopStream({ channelId: target.channelId, ts, signal });
      } else {
        await api.stopStream({ channelId: target.channelId, ts, signal }).catch(() => undefined);
        await api.updateMessage({ channelId: target.channelId, ts, text: first, signal });
      }
      for (const chunk of chunks.slice(1)) {
        await api.postMessage({
          channelId: target.channelId,
          threadTs: target.threadTs,
          text: chunk,
          signal,
        });
      }
    },
    cancel() {
      closed = true;
      pending = '';
      if (timer !== null) clearTimeout(timer);
      timer = null;
      void api.stopStream({ channelId: target.channelId, ts, signal }).catch(() => undefined);
    },
  };
}

class SlackBotClient {
  #api;
  #signal;
  #logger;

  constructor({ api, signal, logger }) {
    this.#api = api;
    this.#signal = signal;
    this.#logger = logger;
  }

  async sendText(target, text) {
    const chunks = splitMessageText(text, SLACK_MESSAGE_LIMIT);
    let result = null;
    for (const chunk of chunks) {
      result = await this.#api.postMessage({
        channelId: target.channelId,
        threadTs: target.threadTs,
        text: chunk,
        signal: this.#signal,
      });
    }
    return result;
  }

  openStream(target) {
    return createSlackMessageStream({
      api: this.#api,
      target,
      signal: this.#signal,
      logger: this.#logger,
    });
  }
}

export function createSlackRuntimeStatus() {
  return {
    startedAt: null,
    ready: false,
    connectionState: 'idle',
    harnessReachable: false,
    lastCheckedAt: null,
    lastConnectedAt: null,
    lastError: null,
    ...createSlackBridgeStatus(),
  };
}

export class SlackRuntime {
  #config;
  #botToken;
  #appToken;
  #harness;
  #state;
  #logger;
  #replyTimeoutMs;
  #connectTimeoutMs;
  #createApi;
  #createWebSocket;
  #status = createSlackRuntimeStatus();
  #api = null;
  #bridge = null;
  #abortController = null;
  #socket = null;
  #appId = null;
  #reconnectTimer = null;
  #reconnectAttempt = 0;
  #generation = 0;
  #stopped = true;
  #starting = null;

  constructor({
    config,
    botToken,
    appToken,
    harness,
    state,
    logger = console,
    replyTimeoutMs = 600_000,
    connectTimeoutMs = 20_000,
    createApi = (options) => new SlackApi(options),
    createWebSocket = (url) => new WebSocket(url),
  }) {
    if (!config || !botToken || !appToken || !harness || !state) {
      throw new TypeError('SlackRuntime requires config, both tokens, Harness, and state');
    }
    if (typeof createWebSocket !== 'function') throw new TypeError('SlackRuntime requires WebSocket');
    this.#config = config;
    this.#botToken = botToken;
    this.#appToken = appToken;
    this.#harness = harness;
    this.#state = state;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#connectTimeoutMs = connectTimeoutMs;
    this.#createApi = createApi;
    this.#createWebSocket = createWebSocket;
  }

  get status() {
    return structuredClone(this.#status);
  }

  async start() {
    if (this.#status.ready && this.#socket) return this.status;
    if (this.#starting) return this.#starting;
    this.#starting = this.#start().finally(() => {
      this.#starting = null;
    });
    return this.#starting;
  }

  async #start() {
    await this.stop();
    this.#stopped = false;
    this.#reconnectAttempt = 0;
    this.#status.startedAt = new Date().toISOString();
    this.#status.connectionState = 'connecting';
    this.#status.lastError = null;
    await this.#harness.ensureRunning();
    this.#status.harnessReachable = true;
    const controller = new AbortController();
    this.#abortController = controller;
    const api = this.#createApi({ botToken: this.#botToken, appToken: this.#appToken });
    this.#api = api;
    try {
      const identity = await api.authTest({ signal: controller.signal });
      if (`${identity?.team_id}:${identity?.user_id}` !== this.#config.platformId) {
        throw new Error('Slack Bot Token identity does not match the saved bot');
      }
      const client = new SlackBotClient({ api, signal: controller.signal, logger: this.#logger });
      this.#bridge = new SlackHarnessBridge({
        bot: client,
        harness: this.#harness,
        state: this.#state,
        status: this.#status,
        logger: this.#logger,
        replyTimeoutMs: this.#replyTimeoutMs,
      });
      let timer;
      try {
        await Promise.race([
          this.#connect(),
          new Promise((_, reject) => {
            timer = setTimeout(
              () => reject(new Error('Slack Socket Mode did not become ready in time')),
              this.#connectTimeoutMs,
            );
            timer?.unref?.();
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
      return this.status;
    } catch (error) {
      this.#status.ready = false;
      this.#status.connectionState = 'failed';
      this.#status.lastError = error?.message ?? String(error);
      await this.stop();
      throw error;
    }
  }

  async #connect() {
    if (this.#stopped) throw new Error('Slack runtime is stopped');
    const connection = await this.#api.openConnection({ signal: this.#abortController?.signal });
    return this.#openSocket(connection?.url);
  }

  #openSocket(value) {
    if (this.#stopped) return Promise.reject(new Error('Slack runtime is stopped'));
    const generation = ++this.#generation;
    const socket = this.#createWebSocket(socketUrl(value));
    this.#socket = socket;
    let settled = false;
    return new Promise((resolve, reject) => {
      const markReady = (packet) => {
        if (settled || generation !== this.#generation) return;
        settled = true;
        this.#appId = packet?.connection_info?.app_id ?? null;
        this.#reconnectAttempt = 0;
        const now = Date.now();
        this.#status.ready = true;
        this.#status.connectionState = 'connected';
        this.#status.lastCheckedAt = now;
        this.#status.lastConnectedAt = now;
        this.#status.lastError = null;
        resolve();
      };

      addSocketListener(socket, 'message', (event) => {
        if (generation !== this.#generation || this.#stopped) return;
        const raw = eventData(event);
        if (!raw) return;
        let packet;
        try {
          packet = JSON.parse(raw);
        } catch {
          this.#logger.warn?.('[dsh-im:slack] ignored malformed Socket Mode JSON');
          return;
        }
        if (packet.type === 'hello') {
          markReady(packet);
          return;
        }
        if (packet.envelope_id && socket.readyState === 1) {
          socket.send(JSON.stringify({ envelope_id: packet.envelope_id }));
          this.#status.lastCheckedAt = Date.now();
        }
        if (packet.type === 'disconnect') {
          socket.close(4000, 'Slack requested reconnect');
          return;
        }
        if (packet.type !== 'events_api' || packet.payload?.type !== 'event_callback') return;
        if (this.#appId && packet.payload.api_app_id
          && packet.payload.api_app_id !== this.#appId) return;
        const message = normalizeSlackEvent(packet.payload, this.#config.platformId.split(':')[1]);
        if (message) void this.#bridge?.accept(message);
      });

      addSocketListener(socket, 'close', (event = {}) => {
        if (generation !== this.#generation) return;
        if (this.#socket === socket) this.#socket = null;
        if (this.#stopped) {
          if (!settled) reject(new DOMException('Stopped', 'AbortError'));
          return;
        }
        const code = Number(event.code) || 0;
        const error = new Error(`Slack Socket Mode closed (${code || 'unknown'})`);
        this.#status.ready = false;
        this.#status.connectionState = 'connecting';
        this.#status.lastError = error.message;
        if (!settled) {
          settled = true;
          reject(error);
        }
        this.#scheduleReconnect();
      });

      addSocketListener(socket, 'error', () => {
        if (generation !== this.#generation || this.#stopped) return;
        this.#status.lastError = 'Slack Socket Mode WebSocket error';
      });
    });
  }

  #scheduleReconnect() {
    if (this.#stopped || this.#reconnectTimer !== null) return;
    const delay = RECONNECT_DELAYS_MS[Math.min(this.#reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)];
    this.#reconnectAttempt += 1;
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      void this.#connect().catch((error) => {
        if (this.#stopped) return;
        this.#logger.warn?.('[dsh-im:slack] Socket Mode reconnect failed:', error);
        this.#scheduleReconnect();
      });
    }, delay);
    this.#reconnectTimer?.unref?.();
  }

  async stop() {
    this.#stopped = true;
    this.#generation += 1;
    this.#abortController?.abort();
    this.#abortController = null;
    if (this.#reconnectTimer !== null) clearTimeout(this.#reconnectTimer);
    this.#reconnectTimer = null;
    const socket = this.#socket;
    const bridge = this.#bridge;
    this.#socket = null;
    this.#bridge = null;
    this.#api = null;
    this.#appId = null;
    try {
      if (socket && socket.readyState < 2) socket.close(1000, 'Plugin stopped');
    } catch (error) {
      this.#logger.warn?.(`[dsh-im:slack] bot ${this.#config.botId} failed to close Socket Mode:`, error);
    }
    await Promise.race([
      bridge?.waitForIdle() ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
    this.#status.ready = false;
    this.#status.connectionState = 'idle';
    return this.status;
  }
}
