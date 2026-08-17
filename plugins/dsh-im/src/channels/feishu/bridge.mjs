import {
  conversationKey,
  extractText,
  isAllowedSender,
  isBotSender,
  splitText,
} from './message-utils.mjs';

const HELP_TEXT = [
  '北汇星河 AIOS 已连接 DeepSeek Harness。',
  '',
  '直接发送问题即可继续当前会话。',
  '/new  开启一个全新会话',
  '/status  检查连接状态',
  '/help  显示本帮助',
].join('\n');

export class FeishuHarnessBridge {
  #client;
  #channel;
  #harness;
  #state;
  #queues = new Map();
  #acceptedMessageIds = new Set();
  #status;
  #allowedSenderOpenIds;
  #replyTimeoutMs;

  constructor({
    client,
    channel,
    harness,
    state,
    status,
    allowedSenderOpenIds = new Set(),
    replyTimeoutMs = 600000,
  }) {
    this.#client = client;
    this.#channel = channel;
    this.#harness = harness;
    this.#state = state;
    this.#status = status;
    this.#allowedSenderOpenIds = allowedSenderOpenIds;
    this.#replyTimeoutMs = replyTimeoutMs;
  }

  accept(event) {
    const messageId = event?.message?.message_id;
    if (!messageId || isBotSender(event) || event?.message?.message_type !== 'text') return;
    if (!isAllowedSender(event, this.#allowedSenderOpenIds)) {
      this.#status.messagesRejected += 1;
      this.#status.lastRejectedAt = new Date().toISOString();
      console.warn('[bridge] ignored a message from a sender outside the allowlist');
      return;
    }
    if (this.#state.hasSeen(messageId) || this.#acceptedMessageIds.has(messageId)) return;
    this.#acceptedMessageIds.add(messageId);
    const processingReaction = this.#addReaction(messageId, 'OnIt');

    const key = conversationKey(event);
    const previous = this.#queues.get(key) ?? Promise.resolve();
    const task = previous
      .catch(() => undefined)
      .then(() => this.#handle(event, key))
      .then(() => this.#finishReaction(messageId, processingReaction, 'DONE'))
      .catch(async (error) => {
        console.error('[bridge] message handling failed:', error.message);
        this.#status.lastError = error.message;
        await this.#finishReaction(messageId, processingReaction, 'ERROR');
        await this.#send(
          event.message.chat_id,
          '处理失败，请稍后重试。如果问题持续，请在 DeepSeek Harness 的飞书插件页面检查连接状态。',
        ).catch(() => undefined);
      })
      .finally(() => {
        this.#acceptedMessageIds.delete(messageId);
        if (this.#queues.get(key) === task) this.#queues.delete(key);
      });
    this.#queues.set(key, task);
  }

  async waitForIdle() {
    await Promise.allSettled([...this.#queues.values()]);
  }

  async #handle(event, key) {
    const messageId = event.message.message_id;
    await this.#state.markSeen(messageId);
    this.#status.lastMessageAt = new Date().toISOString();
    this.#status.messagesReceived += 1;

    const text = extractText(event);
    if (!text) return;

    if (text === '/help') {
      await this.#send(event.message.chat_id, HELP_TEXT);
      return;
    }
    if (text === '/new') {
      await this.#state.clearSession(key);
      await this.#send(event.message.chat_id, '已开启全新 Harness 会话。');
      return;
    }
    if (text === '/status') {
      await this.#harness.ensureRunning();
      await this.#send(event.message.chat_id, '飞书机器人与 DeepSeek Harness 连接正常。');
      return;
    }

    let sessionId = this.#state.sessionFor(key);
    if (!sessionId || !(await this.#harness.sessionExists(sessionId))) {
      sessionId = await this.#harness.createSession();
      await this.#state.setSession(key, sessionId);
    }

    console.info(`[bridge] processing ${event.message.chat_type} message ${messageId} in ${sessionId}`);
    await this.#answerWithStream(event, sessionId, text);
    this.#status.messagesReplied += 1;
    this.#status.lastReplyAt = new Date().toISOString();
    this.#status.lastError = null;
  }

  async #answerWithStream(event, sessionId, text) {
    const chatId = event.message.chat_id;
    const messageId = event.message.message_id;
    if (!this.#channel?.stream) {
      const answer = await this.#harness.ask(sessionId, text, { timeoutMs: this.#replyTimeoutMs });
      for (const chunk of splitText(answer)) await this.#send(chatId, chunk);
      this.#status.streamFallbacks = (this.#status.streamFallbacks ?? 0) + 1;
      return;
    }

    let promptStarted = false;
    let completedAnswer = '';
    try {
      await this.#channel.stream(chatId, {
        markdown: async (controller) => {
          promptStarted = true;
          completedAnswer = await this.#harness.ask(sessionId, text, {
            timeoutMs: this.#replyTimeoutMs,
            onUpdate: async (update) => {
              await controller.setContent(this.#progressText(update));
              this.#status.streamUpdates = (this.#status.streamUpdates ?? 0) + 1;
            },
          });
          await controller.setContent(completedAnswer);
        },
      }, { replyTo: messageId });
      this.#status.streamResponses = (this.#status.streamResponses ?? 0) + 1;
    } catch (error) {
      this.#status.streamErrors = (this.#status.streamErrors ?? 0) + 1;
      if (completedAnswer) {
        console.warn('[bridge] native Feishu stream failed after generation; sending final text:', error.message);
        for (const chunk of splitText(completedAnswer)) await this.#send(chatId, chunk);
        this.#status.streamFallbacks = (this.#status.streamFallbacks ?? 0) + 1;
        return;
      }
      if (promptStarted) throw error;

      console.warn('[bridge] native Feishu stream unavailable; using text fallback:', error.message);
      const answer = await this.#harness.ask(sessionId, text, { timeoutMs: this.#replyTimeoutMs });
      for (const chunk of splitText(answer)) await this.#send(chatId, chunk);
      this.#status.streamFallbacks = (this.#status.streamFallbacks ?? 0) + 1;
    }
  }

  #progressText(update) {
    if (update.type === 'text' && update.text) return update.text;
    if (update.type === 'tool') {
      if (update.name === 'web_search') return '_正在搜索网络并整理信息…_';
      return `_正在使用 ${update.name || '工具'}…_`;
    }
    return `_${update.text || '正在处理…'}_`;
  }

  async #addReaction(messageId, emojiType) {
    if (!this.#channel?.addReaction) return null;
    try {
      const reactionId = await this.#channel.addReaction(messageId, emojiType);
      this.#status.reactionsAdded = (this.#status.reactionsAdded ?? 0) + 1;
      return reactionId;
    } catch (error) {
      this.#status.reactionErrors = (this.#status.reactionErrors ?? 0) + 1;
      console.warn(`[bridge] unable to add ${emojiType} reaction:`, error.message);
      return null;
    }
  }

  async #finishReaction(messageId, processingReaction, finalEmojiType) {
    const reactionId = await processingReaction;
    if (reactionId && this.#channel?.removeReaction) {
      try {
        await this.#channel.removeReaction(messageId, reactionId);
        this.#status.reactionsRemoved = (this.#status.reactionsRemoved ?? 0) + 1;
      } catch (error) {
        this.#status.reactionErrors = (this.#status.reactionErrors ?? 0) + 1;
        console.warn('[bridge] unable to remove processing reaction:', error.message);
      }
    }
    await this.#addReaction(messageId, finalEmojiType);
  }

  async #send(chatId, text) {
    const response = await this.#client.im.v1.message.create({
      params: { receive_id_type: 'chat_id' },
      data: {
        receive_id: chatId,
        msg_type: 'text',
        content: JSON.stringify({ text }),
      },
    });
    if (response?.code && response.code !== 0) {
      throw new Error(`Feishu send failed: ${response.msg || response.code}`);
    }
  }
}
