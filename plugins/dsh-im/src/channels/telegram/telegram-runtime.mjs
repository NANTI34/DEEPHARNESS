import { createEditableMessageStream, splitMessageText } from '../shared/editable-message-stream.mjs';
import { TelegramApi } from './telegram-api.mjs';
import { createTelegramBridgeStatus, TelegramHarnessBridge } from './telegram-bridge.mjs';

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mentionedUsername(message, username) {
  if (!username || typeof message?.text !== 'string' || !Array.isArray(message.entities)) return false;
  return message.entities.some((entity) => {
    if (entity?.type !== 'mention' || !Number.isInteger(entity.offset) || !Number.isInteger(entity.length)) {
      return false;
    }
    return message.text.slice(entity.offset, entity.offset + entity.length).toLowerCase()
      === `@${username.toLowerCase()}`;
  });
}

function withoutBotMention(text, username) {
  if (!username || typeof text !== 'string') return text;
  return text.replace(new RegExp(`@${escaped(username)}\\b`, 'ig'), '').trim();
}

export function normalizeTelegramUpdate(update, { botId, username }) {
  const message = update?.message;
  const chatId = message?.chat?.id;
  const senderId = message?.from?.id;
  const messageId = message?.message_id;
  if (!Number.isSafeInteger(update?.update_id) || chatId === undefined || senderId === undefined
    || !Number.isSafeInteger(messageId)) return null;
  if (!['private', 'group', 'supergroup'].includes(message.chat?.type)) return null;
  const direct = message.chat.type === 'private';
  const addressed = direct
    || String(message.reply_to_message?.from?.id ?? '') === String(botId)
    || mentionedUsername(message, username);
  return {
    messageId: String(update.update_id),
    senderId: String(senderId),
    senderIsBot: message.from?.is_bot === true,
    kind: direct ? 'direct' : 'group',
    conversationId: String(chatId),
    content: withoutBotMention(message.text ?? message.caption ?? '', username),
    addressed,
    replyTarget: {
      chatId,
      replyToMessageId: messageId,
      messageThreadId: Number.isSafeInteger(message.message_thread_id)
        ? message.message_thread_id : undefined,
    },
  };
}

class TelegramBotClient {
  #api;
  #signal;

  constructor({ api, signal }) {
    this.#api = api;
    this.#signal = signal;
  }

  async sendText(target, text) {
    const chunks = splitMessageText(text, 4_000);
    let result = null;
    for (const [index, chunk] of chunks.entries()) {
      result = await this.#api.sendMessage({
        chatId: target.chatId,
        text: chunk,
        replyToMessageId: index === 0 ? target.replyToMessageId : undefined,
        messageThreadId: target.messageThreadId,
        signal: this.#signal,
      });
    }
    return result;
  }

  sendTyping(target) {
    return this.#api.sendChatAction({
      chatId: target.chatId,
      messageThreadId: target.messageThreadId,
      signal: this.#signal,
    });
  }

  async openStream(target) {
    const stream = createEditableMessageStream({
      limit: 4_000,
      create: async (text) => {
        const message = await this.#api.sendMessage({
          chatId: target.chatId,
          text,
          replyToMessageId: target.replyToMessageId,
          messageThreadId: target.messageThreadId,
          signal: this.#signal,
        });
        return message.message_id;
      },
      edit: (messageId, text) => this.#api.editMessageText({
        chatId: target.chatId,
        messageId,
        text,
        signal: this.#signal,
      }),
      sendRemainder: (text) => this.#api.sendMessage({
        chatId: target.chatId,
        text,
        messageThreadId: target.messageThreadId,
        signal: this.#signal,
      }),
    });
    return stream.start();
  }
}

export function createTelegramRuntimeStatus() {
  return {
    startedAt: null,
    ready: false,
    connectionState: 'idle',
    harnessReachable: false,
    lastCheckedAt: null,
    lastConnectedAt: null,
    lastError: null,
    ...createTelegramBridgeStatus(),
  };
}

export class TelegramRuntime {
  #config;
  #token;
  #harness;
  #state;
  #logger;
  #replyTimeoutMs;
  #createApi;
  #status = createTelegramRuntimeStatus();
  #api = null;
  #bridge = null;
  #abortController = null;
  #pollTask = null;
  #starting = null;

  constructor({
    config,
    token,
    harness,
    state,
    logger = console,
    replyTimeoutMs = 600_000,
    createApi = (options) => new TelegramApi(options),
  }) {
    if (!config || !token || !harness || !state) {
      throw new TypeError('TelegramRuntime requires config, token, Harness, and state');
    }
    this.#config = config;
    this.#token = token;
    this.#harness = harness;
    this.#state = state;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#createApi = createApi;
  }

  get status() {
    return structuredClone(this.#status);
  }

  async start() {
    if (this.#status.ready && this.#pollTask) return this.status;
    if (this.#starting) return this.#starting;
    this.#starting = this.#start().finally(() => {
      this.#starting = null;
    });
    return this.#starting;
  }

  async #start() {
    await this.stop();
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
      const bot = await api.getMe({ signal: controller.signal });
      if (String(bot?.id ?? '') !== this.#config.platformId || bot?.is_bot !== true) {
        throw new Error('Telegram token identity does not match the saved bot');
      }
      const webhook = await api.getWebhookInfo({ signal: controller.signal });
      if (typeof webhook?.url === 'string' && webhook.url) {
        const error = new Error('该 Telegram 机器人已配置 Webhook，请先在原服务中移除 Webhook 后重试。');
        error.code = 'webhook-configured';
        throw error;
      }
      const client = new TelegramBotClient({ api, signal: controller.signal });
      this.#bridge = new TelegramHarnessBridge({
        bot: client,
        harness: this.#harness,
        state: this.#state,
        status: this.#status,
        logger: this.#logger,
        replyTimeoutMs: this.#replyTimeoutMs,
      });

      let cursor = this.#state.cursor();
      if (cursor === null) {
        const latest = await api.getUpdates({ offset: -1, timeout: 0, signal: controller.signal });
        cursor = latest.length > 0 ? latest.at(-1).update_id + 1 : 0;
        await this.#state.setCursor(cursor);
      }
      const now = Date.now();
      this.#status.ready = true;
      this.#status.connectionState = 'connected';
      this.#status.lastCheckedAt = now;
      this.#status.lastConnectedAt = now;
      this.#pollTask = this.#poll(cursor, controller.signal);
      this.#pollTask.catch((error) => {
        if (controller.signal.aborted) return;
        this.#status.ready = false;
        this.#status.connectionState = 'failed';
        this.#status.lastError = error?.message ?? String(error);
        this.#logger.error?.(`[dsh-im:telegram] bot ${this.#config.botId} polling stopped:`, error);
      });
      return this.status;
    } catch (error) {
      this.#status.ready = false;
      this.#status.connectionState = 'failed';
      this.#status.lastError = error?.message ?? String(error);
      await this.stop();
      throw error;
    }
  }

  async #poll(initialCursor, signal) {
    let cursor = initialCursor;
    while (!signal.aborted) {
      const updates = await this.#api.getUpdates({ offset: cursor, timeout: 25, signal });
      this.#status.lastCheckedAt = Date.now();
      for (const update of updates) {
        if (signal.aborted) return;
        const message = normalizeTelegramUpdate(update, {
          botId: this.#config.platformId,
          username: this.#config.username,
        });
        if (message) await this.#bridge.accept(message);
        cursor = update.update_id + 1;
        await this.#state.setCursor(cursor);
      }
    }
  }

  async stop() {
    const pollTask = this.#pollTask;
    const bridge = this.#bridge;
    this.#abortController?.abort();
    this.#abortController = null;
    this.#pollTask = null;
    this.#api = null;
    this.#bridge = null;
    await Promise.race([
      pollTask?.catch(() => undefined) ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
    await Promise.race([
      bridge?.waitForIdle() ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
    this.#status.ready = false;
    this.#status.connectionState = 'idle';
    return this.status;
  }
}
