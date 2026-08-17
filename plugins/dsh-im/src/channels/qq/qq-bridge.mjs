const HELP_TEXT = [
  'QQ 机器人已连接 DeepSeek Harness。',
  '',
  '直接发送文字即可继续当前会话。',
  '/new  开启一个全新会话',
  '/status  检查连接状态',
  '/help  显示本帮助',
].join('\n');

function conversationKey(message) {
  return `${message.kind}:${message.kind === 'group' ? message.groupOpenid : message.senderId}`;
}

function safeText(message) {
  return typeof message?.content === 'string' ? message.content.trim() : '';
}

export function createQqBridgeStatus() {
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

export class QqHarnessBridge {
  #bot;
  #ownerUserOpenid;
  #harness;
  #state;
  #status;
  #logger;
  #replyTimeoutMs;
  #queues = new Map();

  constructor({
    bot,
    ownerUserOpenid,
    harness,
    state,
    status = createQqBridgeStatus(),
    logger = console,
    replyTimeoutMs = 600_000,
  }) {
    if (!bot || typeof bot.sendText !== 'function') throw new TypeError('QQ bot client is required');
    if (!ownerUserOpenid) throw new TypeError('QQ scanner identity is required');
    if (!harness || !state) throw new TypeError('Harness client and state store are required');
    this.#bot = bot;
    this.#ownerUserOpenid = ownerUserOpenid;
    this.#harness = harness;
    this.#state = state;
    this.#status = status;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
  }

  get status() {
    return structuredClone(this.#status);
  }

  accept(message) {
    const key = conversationKey(message);
    const previous = this.#queues.get(key) ?? Promise.resolve();
    const current = previous
      .catch(() => undefined)
      .then(() => this.#process(message))
      .finally(() => {
        if (this.#queues.get(key) === current) this.#queues.delete(key);
      });
    this.#queues.set(key, current);
    return current;
  }

  async waitForIdle() {
    await Promise.allSettled([...this.#queues.values()]);
  }

  async #process(message) {
    const messageId = typeof message?.messageId === 'string' ? message.messageId : '';
    const sender = typeof message?.senderId === 'string' ? message.senderId : '';
    if (!messageId || !sender || message.senderIsBot === true) return;
    if (!['c2c', 'group'].includes(message.kind) || this.#state.hasSeen(messageId)) return;

    this.#status.messagesReceived += 1;
    this.#status.lastMessageAt = new Date().toISOString();
    if (this.#ownerUserOpenid !== '*' && sender !== this.#ownerUserOpenid) {
      this.#status.messagesRejected += 1;
      this.#status.lastRejectedAt = new Date().toISOString();
      return;
    }
    if (message.kind === 'group' && message.rawEventType !== 'GROUP_AT_MESSAGE_CREATE') return;

    const target = message.replyTarget;
    const text = safeText(message);
    try {
      if (!text) {
        await this.#bot.sendText(target, '目前仅支持文字消息。');
        await this.#state.markSeen(messageId);
        return;
      }
      const command = text.toLowerCase();
      if (command === '/help') {
        await this.#bot.sendText(target, HELP_TEXT);
        await this.#state.markSeen(messageId);
        return;
      }
      if (command === '/status') {
        await this.#harness.ensureRunning();
        await this.#bot.sendText(target, 'QQ 机器人与 DeepSeek Harness 连接正常。');
        await this.#state.markSeen(messageId);
        return;
      }
      const key = conversationKey(message);
      if (command === '/new') {
        await this.#state.clearSession(key);
        await this.#bot.sendText(target, '已开启新会话。请发送你的问题。');
        await this.#state.markSeen(messageId);
        return;
      }

      let sessionId = this.#state.sessionFor(key);
      if (!sessionId || !(await this.#harness.sessionExists(sessionId))) {
        sessionId = await this.#harness.createSession();
        await this.#state.setSession(key, sessionId);
      }

      let stream = null;
      let streamFinished = false;
      if (message.kind === 'c2c' && target?.msgId && typeof this.#bot.openStream === 'function') {
        try {
          stream = this.#bot.openStream({ target });
        } catch (error) {
          this.#logger.warn?.('[dsh-im:qq] unable to start a QQ stream; using a text reply:', error);
        }
      }
      const answer = await this.#harness.ask(sessionId, text, {
        timeoutMs: this.#replyTimeoutMs,
        onUpdate: stream ? async (update) => {
          const progress = update.type === 'text'
            ? update.text
            : update.type === 'tool'
              ? `正在使用${update.name}…`
              : update.text;
          if (progress) await stream.update(progress);
        } : undefined,
      });
      if (stream) {
        try {
          await stream.update(answer);
          await stream.complete();
          streamFinished = true;
        } catch (error) {
          stream.cancel?.();
          this.#logger.warn?.('[dsh-im:qq] QQ stream finalization failed; using a text reply:', error);
        }
      }
      if (!streamFinished) await this.#bot.sendText(target, answer);
      await this.#state.markSeen(messageId);
      this.#status.messagesReplied += 1;
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
    } catch (error) {
      this.#status.lastError = error?.message ?? String(error);
      this.#logger.error?.('[dsh-im:qq] failed to process an inbound message:', error);
      try {
        await this.#bot.sendText(target, '消息处理失败，请稍后重试。');
        await this.#state.markSeen(messageId);
      } catch (sendError) {
        this.#logger.error?.('[dsh-im:qq] failed to send the safe error reply:', sendError);
      }
    }
  }
}
