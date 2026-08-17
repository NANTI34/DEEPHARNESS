function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function createTextBridgeStatus() {
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

export class TextHarnessBridge {
  #descriptor;
  #bot;
  #harness;
  #state;
  #status;
  #logger;
  #replyTimeoutMs;
  #queues = new Map();

  constructor({
    descriptor,
    bot,
    harness,
    state,
    status = createTextBridgeStatus(),
    logger = console,
    replyTimeoutMs = 600_000,
  }) {
    if (!descriptor?.key || !descriptor?.label) throw new TypeError('A channel descriptor is required');
    if (!bot || typeof bot.sendText !== 'function') throw new TypeError('A bot client is required');
    if (!harness || !state) throw new TypeError('Harness client and state store are required');
    this.#descriptor = descriptor;
    this.#bot = bot;
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
    const conversationId = cleanText(message?.conversationId);
    const kind = message?.kind === 'group' ? 'group' : 'direct';
    const key = `${kind}:${conversationId}`;
    const previous = this.#queues.get(key) ?? Promise.resolve();
    const current = previous
      .catch(() => undefined)
      .then(() => this.#process({ ...message, kind, conversationId }))
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
    const messageId = cleanText(message.messageId);
    const senderId = cleanText(message.senderId);
    if (!messageId || !senderId || !message.conversationId || message.senderIsBot === true) return;
    if (this.#state.hasSeen(messageId)) return;

    this.#status.messagesReceived += 1;
    this.#status.lastMessageAt = new Date().toISOString();
    if (message.kind === 'group' && message.addressed !== true) {
      this.#status.messagesRejected += 1;
      this.#status.lastRejectedAt = new Date().toISOString();
      return;
    }

    const target = message.replyTarget;
    const text = cleanText(message.content);
    try {
      if (!text) {
        await this.#bot.sendText(target, '目前仅支持文字消息。');
        await this.#state.markSeen(messageId);
        return;
      }
      const command = text.toLowerCase();
      if (command === '/help') {
        await this.#bot.sendText(target, [
          `${this.#descriptor.label}机器人已连接 DeepSeek Harness。`,
          '',
          '直接发送文字即可继续当前会话。',
          '/new  开启一个全新会话',
          '/status  检查连接状态',
          '/help  显示本帮助',
        ].join('\n'));
        await this.#state.markSeen(messageId);
        return;
      }
      if (command === '/status') {
        await this.#harness.ensureRunning();
        await this.#bot.sendText(target, `${this.#descriptor.label}机器人与 DeepSeek Harness 连接正常。`);
        await this.#state.markSeen(messageId);
        return;
      }
      const conversationKey = `${message.kind}:${message.conversationId}`;
      if (command === '/new') {
        await this.#state.clearSession(conversationKey);
        await this.#bot.sendText(target, '已开启新会话。请发送你的问题。');
        await this.#state.markSeen(messageId);
        return;
      }

      let sessionId = this.#state.sessionFor(conversationKey);
      if (!sessionId || !(await this.#harness.sessionExists(sessionId))) {
        sessionId = await this.#harness.createSession();
        await this.#state.setSession(conversationKey, sessionId);
      }

      await this.#bot.sendTyping?.(target).catch((error) => {
        this.#logger.warn?.(`[dsh-im:${this.#descriptor.key}] typing indicator failed:`, error);
      });
      let stream = null;
      let streamFinished = false;
      if (typeof this.#bot.openStream === 'function') {
        try {
          stream = await this.#bot.openStream(target);
        } catch (error) {
          this.#logger.warn?.(
            `[dsh-im:${this.#descriptor.key}] unable to start a streamed reply; using text:`,
            error,
          );
        }
      }
      const answer = await this.#harness.ask(sessionId, text, {
        timeoutMs: this.#replyTimeoutMs,
        onUpdate: stream ? async (update) => {
          const progress = update.type === 'text' ? update.text
            : update.type === 'tool' ? `正在使用${update.name}…` : update.text;
          if (progress) await stream.update(progress);
        } : undefined,
      });
      if (stream) {
        try {
          await stream.finish(answer);
          streamFinished = true;
        } catch (error) {
          stream.cancel?.();
          this.#logger.warn?.(
            `[dsh-im:${this.#descriptor.key}] streamed reply finalization failed; using text:`,
            error,
          );
        }
      }
      if (!streamFinished) await this.#bot.sendText(target, answer);
      await this.#state.markSeen(messageId);
      this.#status.messagesReplied += 1;
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
    } catch (error) {
      this.#status.lastError = error?.message ?? String(error);
      this.#logger.error?.(`[dsh-im:${this.#descriptor.key}] failed to process a message:`, error);
      try {
        await this.#bot.sendText(target, '消息处理失败，请稍后重试。');
        await this.#state.markSeen(messageId);
      } catch (sendError) {
        this.#logger.error?.(
          `[dsh-im:${this.#descriptor.key}] failed to send the safe error reply:`,
          sendError,
        );
      }
    }
  }
}
