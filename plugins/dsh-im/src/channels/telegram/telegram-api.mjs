const DEFAULT_BASE_URL = 'https://api.telegram.org/';

function cleanString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function requestSignal(signal, timeoutMs) {
  const timeout = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

export function validTelegramToken(value) {
  return typeof value === 'string' && /^\d{5,20}:[A-Za-z0-9_-]{20,}$/.test(value.trim());
}

export class TelegramApi {
  #token;
  #fetch;
  #baseUrl;

  constructor({ token, fetchImpl = fetch, baseUrl = DEFAULT_BASE_URL }) {
    if (!validTelegramToken(token)) throw new TypeError('Telegram Bot Token is invalid');
    if (typeof fetchImpl !== 'function') throw new TypeError('TelegramApi requires fetch');
    this.#token = token.trim();
    this.#fetch = fetchImpl;
    this.#baseUrl = new URL(baseUrl);
  }

  async getMe(options = {}) {
    return this.#call('getMe', {}, options);
  }

  async getWebhookInfo(options = {}) {
    return this.#call('getWebhookInfo', {}, options);
  }

  async getUpdates({ offset, timeout = 25, signal } = {}) {
    const payload = {
      timeout,
      limit: 100,
      allowed_updates: ['message'],
      ...(Number.isSafeInteger(offset) ? { offset } : {}),
    };
    return this.#call('getUpdates', payload, {
      signal,
      timeoutMs: Math.max(10_000, (timeout + 10) * 1_000),
    });
  }

  async sendMessage({ chatId, text, replyToMessageId, messageThreadId, signal }) {
    return this.#call('sendMessage', {
      chat_id: chatId,
      text,
      link_preview_options: { is_disabled: true },
      ...(replyToMessageId ? {
        reply_parameters: { message_id: replyToMessageId, allow_sending_without_reply: true },
      } : {}),
      ...(messageThreadId ? { message_thread_id: messageThreadId } : {}),
    }, { signal });
  }

  async editMessageText({ chatId, messageId, text, signal }) {
    return this.#call('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      link_preview_options: { is_disabled: true },
    }, { signal });
  }

  async sendChatAction({ chatId, messageThreadId, signal }) {
    return this.#call('sendChatAction', {
      chat_id: chatId,
      action: 'typing',
      ...(messageThreadId ? { message_thread_id: messageThreadId } : {}),
    }, { signal });
  }

  async #call(method, payload, { signal, timeoutMs = 15_000 } = {}) {
    const url = new URL(this.#baseUrl);
    url.pathname = `${url.pathname.replace(/\/$/, '')}/bot${this.#token}/${method}`;
    let response;
    try {
      response = await this.#fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: requestSignal(signal, timeoutMs),
        redirect: 'error',
      });
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError') throw error;
      throw new Error(`Telegram ${method} transport failed`);
    }
    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(`Telegram ${method} returned invalid JSON`);
    }
    if (!response.ok || body?.ok !== true) {
      const description = cleanString(body?.description);
      const error = new Error(description ?? `Telegram ${method} failed`);
      error.code = Number.isInteger(body?.error_code) ? `telegram-${body.error_code}` : 'telegram-api-error';
      throw error;
    }
    return body.result;
  }
}

export async function inspectTelegramToken(token, options = {}) {
  const api = new TelegramApi({ token, ...options });
  const bot = await api.getMe();
  if (!bot?.id || bot?.is_bot !== true) throw new Error('Telegram token does not belong to a bot');
  return {
    platformId: String(bot.id),
    name: cleanString([bot.first_name, bot.last_name].filter(Boolean).join(' ')) ?? 'Telegram机器人',
    username: cleanString(bot.username),
  };
}
