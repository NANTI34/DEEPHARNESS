import { generateReqId } from '@wecom/aibot-node-sdk';

const HELP_TEXT = [
  '企业微信机器人已连接 DeepSeek Harness。',
  '',
  '直接发送文字即可继续当前会话。',
  '/new  开启一个全新会话',
  '/status  检查连接状态',
  '/help  显示本帮助',
].join('\n');
const MAX_REPLY_BYTES = 18_000;

function bodyOf(frame) {
  return frame?.body && typeof frame.body === 'object' ? frame.body : {};
}

function conversationKey(frame) {
  const body = bodyOf(frame);
  return body.chattype === 'group' ? `group:${body.chatid}` : `direct:${body.from?.userid}`;
}

function messageText(frame) {
  const body = bodyOf(frame);
  if (body.msgtype === 'text') return typeof body.text?.content === 'string' ? body.text.content.trim() : '';
  if (body.msgtype === 'voice') return typeof body.voice?.content === 'string' ? body.voice.content.trim() : '';
  if (body.msgtype === 'mixed' && Array.isArray(body.mixed?.msg_item)) {
    return body.mixed.msg_item
      .filter((item) => item?.msgtype === 'text' && typeof item.text?.content === 'string')
      .map((item) => item.text.content)
      .join('\n')
      .trim();
  }
  return '';
}

function splitUtf8(text, maxBytes = MAX_REPLY_BYTES) {
  const source = String(text ?? '').trim();
  if (!source) return [];
  const chunks = [];
  let current = '';
  let bytes = 0;
  for (const character of source) {
    const size = Buffer.byteLength(character);
    if (current && bytes + size > maxBytes) {
      chunks.push(current);
      current = character;
      bytes = size;
    } else {
      current += character;
      bytes += size;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function progressText(update) {
  if (update?.type === 'text') return update.text;
  if (update?.type === 'tool') return `正在使用${update.name}…`;
  return update?.text;
}

export function createWecomBridgeStatus() {
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

export class WecomHarnessBridge {
  #client;
  #harness;
  #state;
  #status;
  #logger;
  #replyTimeoutMs;
  #generateReqId;
  #queues = new Map();

  constructor({
    client,
    harness,
    state,
    status = createWecomBridgeStatus(),
    logger = console,
    replyTimeoutMs = 600_000,
    generateStreamId = generateReqId,
  }) {
    if (!client || typeof client.replyStream !== 'function' || typeof client.sendMessage !== 'function') {
      throw new TypeError('Enterprise WeChat client is required');
    }
    if (!harness || !state) throw new TypeError('Harness client and state store are required');
    this.#client = client;
    this.#harness = harness;
    this.#state = state;
    this.#status = status;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#generateReqId = generateStreamId;
  }

  get status() {
    return structuredClone(this.#status);
  }

  accept(frame) {
    const key = conversationKey(frame);
    const previous = this.#queues.get(key) ?? Promise.resolve();
    const current = previous
      .catch(() => undefined)
      .then(() => this.#process(frame))
      .finally(() => {
        if (this.#queues.get(key) === current) this.#queues.delete(key);
      });
    this.#queues.set(key, current);
    return current;
  }

  async waitForIdle() {
    await Promise.allSettled([...this.#queues.values()]);
  }

  async #sendActive(chatId, text) {
    for (const chunk of splitUtf8(text)) {
      await this.#client.sendMessage(chatId, { msgtype: 'markdown', markdown: { content: chunk } });
    }
  }

  async #sendImmediate(frame, chatId, text) {
    const chunks = splitUtf8(text);
    if (chunks.length === 0) return;
    try {
      await this.#client.replyStream(frame, this.#generateReqId('stream'), chunks[0], true);
      for (const chunk of chunks.slice(1)) {
        await this.#client.sendMessage(chatId, { msgtype: 'markdown', markdown: { content: chunk } });
      }
    } catch {
      await this.#sendActive(chatId, text);
    }
  }

  async #process(frame) {
    const body = bodyOf(frame);
    const messageId = typeof body.msgid === 'string' ? body.msgid : '';
    const senderId = typeof body.from?.userid === 'string' ? body.from.userid : '';
    const chatId = body.chattype === 'group' ? body.chatid : senderId;
    if (!messageId || !senderId || !chatId || !['single', 'group'].includes(body.chattype)) return;
    if (this.#state.hasSeen(messageId)) return;

    this.#status.messagesReceived += 1;
    this.#status.lastMessageAt = new Date().toISOString();
    const text = messageText(frame);
    let streamId = null;
    let streamStarted = false;
    try {
      if (!text) {
        await this.#sendImmediate(frame, chatId, '目前支持文字、语音转写和图文混排中的文字消息。');
        await this.#state.markSeen(messageId);
        return;
      }
      const command = text.toLowerCase();
      if (command === '/help') {
        await this.#sendImmediate(frame, chatId, HELP_TEXT);
        await this.#state.markSeen(messageId);
        return;
      }
      if (command === '/status') {
        await this.#harness.ensureRunning();
        await this.#sendImmediate(frame, chatId, '企业微信机器人与 DeepSeek Harness 连接正常。');
        await this.#state.markSeen(messageId);
        return;
      }
      const key = conversationKey(frame);
      if (command === '/new') {
        await this.#state.clearSession(key);
        await this.#sendImmediate(frame, chatId, '已开启新会话。请发送你的问题。');
        await this.#state.markSeen(messageId);
        return;
      }

      let sessionId = this.#state.sessionFor(key);
      if (!sessionId || !(await this.#harness.sessionExists(sessionId))) {
        sessionId = await this.#harness.createSession();
        await this.#state.setSession(key, sessionId);
      }

      streamId = this.#generateReqId('stream');
      try {
        await this.#client.replyStream(frame, streamId, '正在思考中…', false);
        streamStarted = true;
      } catch (error) {
        this.#logger.warn?.('[dsh-im:wecom] unable to start a stream; using an active reply:', error);
      }

      const answer = await this.#harness.ask(sessionId, text, {
        timeoutMs: this.#replyTimeoutMs,
        onUpdate: streamStarted && typeof this.#client.replyStreamNonBlocking === 'function'
          ? async (update) => {
              const progress = splitUtf8(progressText(update))[0];
              if (progress) await this.#client.replyStreamNonBlocking(frame, streamId, progress, false);
            }
          : undefined,
      });

      const chunks = splitUtf8(answer || '任务已完成，但没有生成可显示的文本。');
      let finalSent = false;
      if (streamStarted && chunks.length > 0) {
        try {
          await this.#client.replyStream(frame, streamId, chunks[0], true);
          for (const chunk of chunks.slice(1)) {
            await this.#client.sendMessage(chatId, { msgtype: 'markdown', markdown: { content: chunk } });
          }
          finalSent = true;
        } catch (error) {
          this.#logger.warn?.('[dsh-im:wecom] stream finalization failed; using an active reply:', error);
        }
      }
      if (!finalSent) await this.#sendActive(chatId, answer);
      await this.#state.markSeen(messageId);
      this.#status.messagesReplied += 1;
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
    } catch (error) {
      this.#status.lastError = error?.message ?? String(error);
      this.#logger.error?.('[dsh-im:wecom] failed to process an inbound message');
      try {
        if (streamStarted && streamId) {
          await this.#client.replyStream(frame, streamId, '消息处理失败，请稍后重试。', true);
        } else {
          await this.#sendImmediate(frame, chatId, '消息处理失败，请稍后重试。');
        }
        await this.#state.markSeen(messageId);
      } catch {
        this.#logger.error?.('[dsh-im:wecom] failed to send the safe error reply');
      }
    }
  }
}
