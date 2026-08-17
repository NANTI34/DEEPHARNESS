import {
  extractWeixinText,
  splitWeixinText,
  weixinMessageId,
} from './weixin-api.mjs';

const HELP_TEXT = [
  '微信已连接 DeepSeek Harness。',
  '',
  '直接发送文字或带文字识别结果的语音即可继续当前会话。',
  '/new  开启一个全新会话',
  '/status  检查连接状态',
  '/help  显示本帮助',
].join('\n');

function conversationKey(userId) {
  return `p2p:${userId}`;
}

export function createWeixinBridgeStatus() {
  return {
    messagesReceived: 0,
    messagesReplied: 0,
    messagesRejected: 0,
    lastMessageAt: null,
    lastReplyAt: null,
    lastRejectedAt: null,
    lastError: null,
  };
}

export class WeixinHarnessBridge {
  #api;
  #baseUrl;
  #token;
  #ownerUserId;
  #harness;
  #state;
  #status;
  #logger;
  #replyTimeoutMs;
  #maxMessageChars;
  #queues = new Map();

  constructor({
    api,
    baseUrl,
    token,
    ownerUserId,
    harness,
    state,
    status = createWeixinBridgeStatus(),
    logger = console,
    replyTimeoutMs = 600_000,
    maxMessageChars = 4_000,
  }) {
    if (!api || typeof api.sendText !== 'function') throw new TypeError('Weixin API is required');
    if (!baseUrl || !token || !ownerUserId) throw new TypeError('Weixin account credentials are required');
    if (!harness || !state) throw new TypeError('Harness client and state store are required');
    this.#api = api;
    this.#baseUrl = baseUrl;
    this.#token = token;
    this.#ownerUserId = ownerUserId;
    this.#harness = harness;
    this.#state = state;
    this.#status = status;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#maxMessageChars = maxMessageChars;
  }

  get status() {
    return structuredClone(this.#status);
  }

  accept(message) {
    const sender = typeof message?.from_user_id === 'string' ? message.from_user_id : '';
    const previous = this.#queues.get(sender) ?? Promise.resolve();
    const current = previous
      .catch(() => undefined)
      .then(() => this.#process(message))
      .finally(() => {
        if (this.#queues.get(sender) === current) this.#queues.delete(sender);
      });
    this.#queues.set(sender, current);
    return current;
  }

  async waitForIdle() {
    await Promise.allSettled([...this.#queues.values()]);
  }

  async #process(message) {
    if (message?.message_type === 2) return;
    const messageId = weixinMessageId(message);
    const sender = typeof message?.from_user_id === 'string' ? message.from_user_id : '';
    if (!messageId || !sender) return;
    if (this.#state.hasSeen(messageId)) return;

    this.#status.messagesReceived += 1;
    this.#status.lastMessageAt = new Date().toISOString();
    if (sender !== this.#ownerUserId) {
      this.#status.messagesRejected += 1;
      this.#status.lastRejectedAt = new Date().toISOString();
      return;
    }

    const contextToken = typeof message.context_token === 'string' ? message.context_token : undefined;
    const runId = typeof message.run_id === 'string' ? message.run_id : undefined;
    const text = extractWeixinText(message);
    try {
      if (!text) {
        await this.#send(sender, '目前仅支持文字消息，以及微信已转成文字的语音消息。', contextToken, runId);
        await this.#state.markSeen(messageId);
        return;
      }

      const command = text.trim().toLowerCase();
      if (command === '/help') {
        await this.#send(sender, HELP_TEXT, contextToken, runId);
        await this.#state.markSeen(messageId);
        return;
      }
      if (command === '/status') {
        await this.#harness.ensureRunning();
        await this.#send(sender, '微信与 DeepSeek Harness 连接正常。', contextToken, runId);
        await this.#state.markSeen(messageId);
        return;
      }
      if (command === '/new') {
        await this.#state.clearSession(conversationKey(sender));
        await this.#send(sender, '已开启新会话。请发送你的问题。', contextToken, runId);
        await this.#state.markSeen(messageId);
        return;
      }

      const key = conversationKey(sender);
      let sessionId = this.#state.sessionFor(key);
      if (!sessionId || !(await this.#harness.sessionExists(sessionId))) {
        sessionId = await this.#harness.createSession();
        await this.#state.setSession(key, sessionId);
      }
      const answer = await this.#harness.ask(sessionId, text, { timeoutMs: this.#replyTimeoutMs });
      await this.#send(sender, answer, contextToken, runId);
      await this.#state.markSeen(messageId);
      this.#status.messagesReplied += 1;
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
    } catch (error) {
      this.#status.lastError = error?.message ?? String(error);
      this.#logger.error?.('[dsh-weixin] failed to process an inbound message:', error);
      try {
        await this.#send(sender, '消息处理失败，请稍后重试。', contextToken, runId);
        await this.#state.markSeen(messageId);
      } catch (sendError) {
        this.#logger.error?.('[dsh-weixin] failed to send the safe error reply:', sendError);
      }
    }
  }

  async #send(toUserId, text, contextToken, runId) {
    for (const chunk of splitWeixinText(text, this.#maxMessageChars)) {
      await this.#api.sendText({
        baseUrl: this.#baseUrl,
        token: this.#token,
        toUserId,
        text: chunk,
        contextToken,
        runId,
      });
    }
  }
}
