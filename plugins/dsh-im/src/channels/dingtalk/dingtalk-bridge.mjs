import {
  normalizeDingtalkSessionWebhook,
  splitDingtalkText,
} from './dingtalk-api.mjs';
import { createDingTalkCardStream } from './dingtalk-card-stream.mjs';

const CARD_INITIAL_TEXT = '已连接 DeepSeek Harness，正在思考…';
const CARD_ERROR_TEXT = '消息处理失败，请稍后重试。';

const HELP_TEXT = [
  '钉钉机器人已连接 DeepSeek Harness。',
  '',
  '直接发送文字即可继续当前会话。',
  '/new  开启一个全新会话',
  '/status  检查连接状态',
  '/help  显示本帮助',
].join('\n');

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function senderStaffId(message) {
  return nonEmptyString(message?.senderStaffId) ?? nonEmptyString(message?.senderId);
}

function conversationKey(message, sender) {
  if (String(message?.conversationType) === '2') {
    const conversationId = nonEmptyString(message?.conversationId);
    if (!conversationId) throw new Error('DingTalk group message has no conversation id');
    return `group:${conversationId}`;
  }
  return `p2p:${sender}`;
}

function cardTarget(message, sender) {
  if (String(message?.conversationType) === '2') {
    return { type: 'group', openConversationId: nonEmptyString(message?.conversationId) };
  }
  return { type: 'user', userId: sender };
}

function progressText(update) {
  if (update?.type === 'text' && nonEmptyString(update.text)) return update.text;
  if (update?.type === 'tool') {
    if (update.name === 'web_search') return '_正在搜索网络并整理信息…_';
    return `_正在使用 ${nonEmptyString(update.name) ?? '工具'}…_`;
  }
  return `_${nonEmptyString(update?.text) ?? '正在处理…'}_`;
}

function ensureStats(status) {
  status.stats ??= {};
  for (const key of ['messagesReceived', 'messagesReplied', 'messagesRejected', 'messagesIgnored']) {
    status[key] ??= 0;
    status.stats[key] = status[key];
  }
  status.pendingSenders ??= [];
}

function increment(status, key) {
  status[key] = (status[key] ?? 0) + 1;
  status.stats ??= {};
  status.stats[key] = status[key];
}

export function createDingtalkBridgeStatus({ pendingSenders = [] } = {}) {
  return {
    messagesReceived: 0,
    messagesReplied: 0,
    messagesRejected: 0,
    messagesIgnored: 0,
    lastMessageAt: null,
    lastReplyAt: null,
    lastRejectedAt: null,
    lastError: null,
    pendingSenders: structuredClone(pendingSenders),
    stats: {
      messagesReceived: 0,
      messagesReplied: 0,
      messagesRejected: 0,
      messagesIgnored: 0,
    },
  };
}

export class DingtalkHarnessBridge {
  #api;
  #clientId;
  #clientSecret;
  #harness;
  #state;
  #status;
  #logger;
  #replyTimeoutMs;
  #maxMessageChars;
  #signal;
  #queues = new Map();
  #acceptedMessageIds = new Set();

  constructor({
    api,
    clientId,
    clientSecret,
    harness,
    state,
    status = createDingtalkBridgeStatus(),
    logger = console,
    replyTimeoutMs = 600_000,
    maxMessageChars = 4_000,
    signal,
  }) {
    if (!api || typeof api.sendText !== 'function') throw new TypeError('DingTalk API is required');
    if (!nonEmptyString(clientId) || !nonEmptyString(clientSecret)) {
      throw new TypeError('DingTalk app credentials are required');
    }
    if (!harness || !state) throw new TypeError('Harness client and state store are required');
    this.#api = api;
    this.#clientId = clientId.trim();
    this.#clientSecret = clientSecret.trim();
    this.#harness = harness;
    this.#state = state;
    this.#status = status;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#maxMessageChars = maxMessageChars;
    this.#signal = signal;
    ensureStats(this.#status);
    this.#refreshPendingSenders();
  }

  get status() {
    this.#refreshPendingSenders();
    return structuredClone(this.#status);
  }

  accept(message) {
    if (this.#signal?.aborted) return Promise.resolve();
    const messageId = nonEmptyString(message?.msgId);
    const sender = senderStaffId(message);
    if (!messageId || !sender || this.#state.hasSeen(messageId)
      || this.#acceptedMessageIds.has(messageId)) return Promise.resolve();
    this.#acceptedMessageIds.add(messageId);

    let key;
    try {
      key = conversationKey(message, sender);
    } catch {
      this.#acceptedMessageIds.delete(messageId);
      increment(this.#status, 'messagesRejected');
      this.#status.lastRejectedAt = new Date().toISOString();
      return Promise.resolve();
    }
    const previous = this.#queues.get(key) ?? Promise.resolve();
    const current = previous
      .catch(() => undefined)
      .then(() => this.#process(message, messageId, sender, key))
      .finally(() => {
        this.#acceptedMessageIds.delete(messageId);
        if (this.#queues.get(key) === current) this.#queues.delete(key);
      });
    this.#queues.set(key, current);
    return current;
  }

  async waitForIdle() {
    await Promise.allSettled([...this.#queues.values()]);
  }

  async #process(message, messageId, sender, key) {
    this.#signal?.throwIfAborted();
    if (this.#state.hasSeen(messageId)) return;
    await this.#state.markSeen(messageId);
    increment(this.#status, 'messagesReceived');
    this.#status.lastMessageAt = new Date().toISOString();

    if (String(message.conversationType) === '2' && message.isInAtList !== true) {
      increment(this.#status, 'messagesIgnored');
      return;
    }

    let sessionWebhook;
    try {
      sessionWebhook = normalizeDingtalkSessionWebhook(message.sessionWebhook);
    } catch {
      increment(this.#status, 'messagesRejected');
      this.#status.lastRejectedAt = new Date().toISOString();
      this.#status.lastError = '钉钉消息没有安全的回复地址。';
      return;
    }

    const text = message?.msgtype === 'text' ? nonEmptyString(message?.text?.content) : null;
    let cardStream = null;
    let cardStarted = false;
    try {
      if (!text) {
        await this.#send(sessionWebhook, '目前仅支持文字消息。');
        return;
      }

      const command = text.toLowerCase();
      if (command === '/help') {
        await this.#send(sessionWebhook, HELP_TEXT);
        return;
      }
      if (command === '/status') {
        await this.#harness.ensureRunning({ signal: this.#signal });
        await this.#send(sessionWebhook, '钉钉机器人与 DeepSeek Harness 连接正常。');
        return;
      }
      if (command === '/new') {
        await this.#state.clearSession(key);
        await this.#send(sessionWebhook, '已开启新会话。请发送你的问题。');
        return;
      }

      let sessionId = this.#state.sessionFor(key);
      if (!sessionId || !(await this.#harness.sessionExists(sessionId, { signal: this.#signal }))) {
        sessionId = await this.#harness.createSession({ signal: this.#signal });
        await this.#state.setSession(key, sessionId);
      }
      if (typeof this.#api.createAiCard === 'function'
        && typeof this.#api.updateAiCard === 'function'
        && typeof this.#api.finishAiCard === 'function') {
        cardStream = createDingTalkCardStream({
          api: this.#api,
          clientId: this.#clientId,
          clientSecret: this.#clientSecret,
          target: cardTarget(message, sender),
          signal: this.#signal,
          logger: this.#logger,
        });
        cardStarted = await cardStream.start(CARD_INITIAL_TEXT);
      }
      const answer = await this.#harness.ask(sessionId, text, {
        timeoutMs: this.#replyTimeoutMs,
        signal: this.#signal,
        onUpdate: cardStarted
          ? (update) => cardStream.push(progressText(update))
          : undefined,
      });
      const streamed = cardStarted && await cardStream.finish(answer);
      if (!streamed) await this.#send(sessionWebhook, answer);
      increment(this.#status, 'messagesReplied');
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
    } catch {
      if (this.#signal?.aborted) return;
      this.#status.lastError = '钉钉消息处理失败。';
      this.#logger.error?.('[dsh-dingtalk] failed to process an inbound message');
      try {
        const streamed = cardStarted && await cardStream.finish(CARD_ERROR_TEXT);
        if (!streamed) await this.#send(sessionWebhook, CARD_ERROR_TEXT);
      } catch {
        this.#logger.error?.('[dsh-dingtalk] failed to send the safe error reply');
      }
    }
  }

  #refreshPendingSenders() {
    if (typeof this.#state.pendingSenders === 'function') {
      this.#status.pendingSenders = this.#state.pendingSenders();
    }
  }

  async #send(sessionWebhook, text) {
    for (const chunk of splitDingtalkText(text, this.#maxMessageChars)) {
      this.#signal?.throwIfAborted();
      await this.#api.sendText({
        clientId: this.#clientId,
        clientSecret: this.#clientSecret,
        sessionWebhook,
        text: chunk,
        signal: this.#signal,
      });
    }
  }
}

export const DingTalkHarnessBridge = DingtalkHarnessBridge;
export const createDingTalkBridgeStatus = createDingtalkBridgeStatus;
