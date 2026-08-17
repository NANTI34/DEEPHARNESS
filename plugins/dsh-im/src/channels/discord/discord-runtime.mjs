import { createEditableMessageStream, splitMessageText } from '../shared/editable-message-stream.mjs';
import { DiscordApi } from './discord-api.mjs';
import { createDiscordBridgeStatus, DiscordHarnessBridge } from './discord-bridge.mjs';

const DISCORD_GATEWAY_INTENTS = (1 << 0) | (1 << 9) | (1 << 12);
const RECONNECT_DELAYS_MS = Object.freeze([1_000, 3_000, 5_000, 10_000, 30_000]);

function socketUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'wss:') throw new Error('Discord returned an insecure Gateway URL');
  url.searchParams.set('v', '10');
  url.searchParams.set('encoding', 'json');
  return url.href;
}

function addSocketListener(socket, event, listener) {
  if (typeof socket.addEventListener === 'function') socket.addEventListener(event, listener);
  else if (typeof socket.on === 'function') socket.on(event, listener);
  else throw new TypeError('Discord WebSocket does not support events');
}

function eventData(event) {
  if (typeof event === 'string') return event;
  if (typeof event?.data === 'string') return event.data;
  if (Buffer.isBuffer(event)) return event.toString('utf8');
  if (Buffer.isBuffer(event?.data)) return event.data.toString('utf8');
  return null;
}

function gatewayCloseError(code) {
  if (code === 4004) {
    const error = new Error('Discord Bot Token 无效，请重新填写。');
    error.code = 'discord-401';
    return error;
  }
  if (code === 4013 || code === 4014) {
    const error = new Error('Discord Gateway Intents 配置不正确，请检查 Developer Portal 的 Bot 设置。');
    error.code = 'discord-intents';
    return error;
  }
  const error = new Error(`Discord Gateway closed (${code || 'unknown'})`);
  error.code = 'discord-gateway-closed';
  return error;
}

function stripBotMention(text, botId) {
  if (typeof text !== 'string') return '';
  return text.replace(new RegExp(`<@!?${botId}>`, 'g'), '').trim();
}

export function normalizeDiscordMessage(message, botId) {
  if (!message?.id || !message?.channel_id || !message?.author?.id) return null;
  const direct = !message.guild_id;
  const addressed = direct
    || message.mentions?.some((mention) => String(mention?.id) === String(botId));
  return {
    messageId: String(message.id),
    senderId: String(message.author.id),
    senderIsBot: message.author.bot === true,
    kind: direct ? 'direct' : 'group',
    conversationId: String(message.channel_id),
    content: stripBotMention(message.content ?? '', botId),
    addressed,
    replyTarget: {
      channelId: String(message.channel_id),
      replyToMessageId: String(message.id),
    },
  };
}

class DiscordBotClient {
  #api;
  #signal;

  constructor({ api, signal }) {
    this.#api = api;
    this.#signal = signal;
  }

  async sendText(target, text) {
    const chunks = splitMessageText(text, 1_900);
    let result = null;
    for (const [index, chunk] of chunks.entries()) {
      result = await this.#api.createMessage({
        channelId: target.channelId,
        content: chunk,
        replyToMessageId: index === 0 ? target.replyToMessageId : undefined,
        signal: this.#signal,
      });
    }
    return result;
  }

  sendTyping(target) {
    return this.#api.sendTyping({ channelId: target.channelId, signal: this.#signal });
  }

  async openStream(target) {
    const stream = createEditableMessageStream({
      limit: 1_900,
      create: async (content) => {
        const message = await this.#api.createMessage({
          channelId: target.channelId,
          content,
          replyToMessageId: target.replyToMessageId,
          signal: this.#signal,
        });
        return message.id;
      },
      edit: (messageId, content) => this.#api.editMessage({
        channelId: target.channelId,
        messageId,
        content,
        signal: this.#signal,
      }),
      sendRemainder: (content) => this.#api.createMessage({
        channelId: target.channelId,
        content,
        signal: this.#signal,
      }),
    });
    return stream.start();
  }
}

export function createDiscordRuntimeStatus() {
  return {
    startedAt: null,
    ready: false,
    connectionState: 'idle',
    harnessReachable: false,
    lastCheckedAt: null,
    lastConnectedAt: null,
    lastError: null,
    ...createDiscordBridgeStatus(),
  };
}

export class DiscordRuntime {
  #config;
  #token;
  #harness;
  #state;
  #logger;
  #replyTimeoutMs;
  #connectTimeoutMs;
  #createApi;
  #createWebSocket;
  #random;
  #status = createDiscordRuntimeStatus();
  #api = null;
  #bridge = null;
  #abortController = null;
  #socket = null;
  #gatewayUrl = null;
  #resumeUrl = null;
  #sessionId = null;
  #sequence = null;
  #heartbeatTimer = null;
  #heartbeatAcked = true;
  #reconnectTimer = null;
  #reconnectAttempt = 0;
  #generation = 0;
  #stopped = true;
  #starting = null;

  constructor({
    config,
    token,
    harness,
    state,
    logger = console,
    replyTimeoutMs = 600_000,
    connectTimeoutMs = 20_000,
    createApi = (options) => new DiscordApi(options),
    createWebSocket = (url) => new WebSocket(url),
    random = Math.random,
  }) {
    if (!config || !token || !harness || !state) {
      throw new TypeError('DiscordRuntime requires config, token, Harness, and state');
    }
    if (typeof createWebSocket !== 'function') throw new TypeError('DiscordRuntime requires WebSocket');
    this.#config = config;
    this.#token = token;
    this.#harness = harness;
    this.#state = state;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#connectTimeoutMs = connectTimeoutMs;
    this.#createApi = createApi;
    this.#createWebSocket = createWebSocket;
    this.#random = random;
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
    this.#sessionId = null;
    this.#resumeUrl = null;
    this.#sequence = null;
    this.#reconnectAttempt = 0;
    this.#status.startedAt = new Date().toISOString();
    this.#status.connectionState = 'connecting';
    this.#status.lastError = null;
    await this.#harness.ensureRunning();
    this.#status.harnessReachable = true;
    const controller = new AbortController();
    this.#abortController = controller;
    const api = this.#createApi({ token: this.#token });
    this.#api = api;
    try {
      const [bot, gateway] = await Promise.all([
        api.getCurrentUser({ signal: controller.signal }),
        api.getGatewayBot({ signal: controller.signal }),
      ]);
      if (String(bot?.id ?? '') !== this.#config.platformId || bot?.bot !== true) {
        throw new Error('Discord token identity does not match the saved bot');
      }
      this.#gatewayUrl = gateway?.url;
      const client = new DiscordBotClient({ api, signal: controller.signal });
      this.#bridge = new DiscordHarnessBridge({
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
          this.#openSocket(false),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('Discord Gateway did not become ready in time')), this.#connectTimeoutMs);
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

  #openSocket(resume) {
    if (this.#stopped) return Promise.reject(new Error('Discord runtime is stopped'));
    const generation = ++this.#generation;
    const url = socketUrl(resume && this.#resumeUrl ? this.#resumeUrl : this.#gatewayUrl);
    const socket = this.#createWebSocket(url);
    this.#socket = socket;
    let settled = false;
    return new Promise((resolve, reject) => {
      const markReady = () => {
        if (settled || generation !== this.#generation) return;
        settled = true;
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
          this.#logger.warn?.('[dsh-im:discord] ignored malformed Gateway JSON');
          return;
        }
        if (Number.isSafeInteger(packet.s)) this.#sequence = packet.s;
        if (packet.op === 10) {
          this.#startHeartbeat(packet.d?.heartbeat_interval, socket, generation);
          if (resume && this.#sessionId) {
            this.#sendGateway(socket, {
              op: 6,
              d: { token: this.#token, session_id: this.#sessionId, seq: this.#sequence },
            });
          } else {
            this.#sendGateway(socket, {
              op: 2,
              d: {
                token: this.#token,
                intents: DISCORD_GATEWAY_INTENTS,
                properties: {
                  os: process.platform,
                  browser: 'dsh-im',
                  device: 'dsh-im',
                },
              },
            });
          }
          return;
        }
        if (packet.op === 11) {
          this.#heartbeatAcked = true;
          this.#status.lastCheckedAt = Date.now();
          return;
        }
        if (packet.op === 1) {
          this.#heartbeat(socket);
          return;
        }
        if (packet.op === 7) {
          socket.close(4000, 'Reconnect requested');
          return;
        }
        if (packet.op === 9) {
          if (packet.d !== true) {
            this.#sessionId = null;
            this.#resumeUrl = null;
            this.#sequence = null;
          }
          socket.close(4000, 'Invalid session');
          return;
        }
        if (packet.op !== 0) return;
        if (packet.t === 'READY') {
          this.#sessionId = packet.d?.session_id ?? null;
          this.#resumeUrl = packet.d?.resume_gateway_url ?? null;
          markReady();
        } else if (packet.t === 'RESUMED') {
          markReady();
        } else if (packet.t === 'MESSAGE_CREATE') {
          const message = normalizeDiscordMessage(packet.d, this.#config.platformId);
          if (message) void this.#bridge?.accept(message);
        }
      });
      addSocketListener(socket, 'close', (event = {}) => {
        if (generation !== this.#generation) return;
        this.#clearHeartbeat();
        if (this.#socket === socket) this.#socket = null;
        if (this.#stopped) {
          if (!settled) reject(new DOMException('Stopped', 'AbortError'));
          return;
        }
        const error = gatewayCloseError(Number(event.code) || 0);
        this.#status.ready = false;
        this.#status.connectionState = 'connecting';
        this.#status.lastError = error.message;
        if (!settled) {
          settled = true;
          reject(error);
        }
        if (error.code === 'discord-401' || error.code === 'discord-intents') {
          this.#status.connectionState = 'failed';
          return;
        }
        this.#scheduleReconnect();
      });
      addSocketListener(socket, 'error', () => {
        if (generation !== this.#generation || this.#stopped) return;
        this.#status.lastError = 'Discord Gateway WebSocket error';
      });
    });
  }

  #sendGateway(socket, payload) {
    if (socket.readyState !== 1) return;
    socket.send(JSON.stringify(payload));
  }

  #startHeartbeat(interval, socket, generation) {
    this.#clearHeartbeat();
    if (!Number.isFinite(interval) || interval < 1_000) {
      socket.close(4000, 'Invalid heartbeat interval');
      return;
    }
    this.#heartbeatAcked = true;
    const schedule = (delay) => {
      this.#heartbeatTimer = setTimeout(() => {
        if (this.#stopped || generation !== this.#generation || this.#socket !== socket) return;
        if (!this.#heartbeatAcked) {
          socket.close(4000, 'Heartbeat was not acknowledged');
          return;
        }
        this.#heartbeat(socket);
        schedule(interval);
      }, delay);
      this.#heartbeatTimer?.unref?.();
    };
    schedule(Math.floor(interval * this.#random()));
  }

  #heartbeat(socket) {
    this.#heartbeatAcked = false;
    this.#sendGateway(socket, { op: 1, d: this.#sequence });
  }

  #clearHeartbeat() {
    if (this.#heartbeatTimer !== null) clearTimeout(this.#heartbeatTimer);
    this.#heartbeatTimer = null;
    this.#heartbeatAcked = true;
  }

  #scheduleReconnect() {
    if (this.#stopped || this.#reconnectTimer !== null) return;
    const delay = RECONNECT_DELAYS_MS[Math.min(this.#reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)];
    this.#reconnectAttempt += 1;
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null;
      void this.#openSocket(Boolean(this.#sessionId)).catch((error) => {
        if (this.#stopped) return;
        this.#logger.warn?.('[dsh-im:discord] Gateway reconnect failed:', error);
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
    this.#clearHeartbeat();
    const socket = this.#socket;
    const bridge = this.#bridge;
    this.#socket = null;
    this.#bridge = null;
    this.#api = null;
    try {
      if (socket && socket.readyState < 2) socket.close(1000, 'Plugin stopped');
    } catch (error) {
      this.#logger.warn?.(`[dsh-im:discord] bot ${this.#config.botId} failed to close Gateway:`, error);
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
