const DEFAULT_BASE_URL = 'https://discord.com/api/v10/';

function cleanString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function requestSignal(signal, timeoutMs) {
  const timeout = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    timer?.unref?.();
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}

function snowflake(value, name) {
  const id = cleanString(value);
  if (!id || !/^\d{5,30}$/.test(id)) throw new TypeError(`Invalid Discord ${name}`);
  return id;
}

export function validDiscordToken(value) {
  return typeof value === 'string'
    && /^[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{4,}\.[A-Za-z0-9_-]{20,}$/.test(value.trim());
}

export class DiscordApi {
  #token;
  #fetch;
  #baseUrl;

  constructor({ token, fetchImpl = fetch, baseUrl = DEFAULT_BASE_URL }) {
    if (!validDiscordToken(token)) throw new TypeError('Discord Bot Token is invalid');
    if (typeof fetchImpl !== 'function') throw new TypeError('DiscordApi requires fetch');
    this.#token = token.trim();
    this.#fetch = fetchImpl;
    this.#baseUrl = new URL(baseUrl);
  }

  getCurrentUser(options = {}) {
    return this.#request('users/@me', { ...options, method: 'GET' });
  }

  getGatewayBot(options = {}) {
    return this.#request('gateway/bot', { ...options, method: 'GET' });
  }

  createMessage({ channelId, content, replyToMessageId, signal }) {
    return this.#request(`channels/${snowflake(channelId, 'channel id')}/messages`, {
      method: 'POST',
      signal,
      body: {
        content,
        allowed_mentions: { parse: [], replied_user: false },
        ...(replyToMessageId ? {
          message_reference: {
            message_id: snowflake(replyToMessageId, 'message id'),
            channel_id: snowflake(channelId, 'channel id'),
            fail_if_not_exists: false,
          },
        } : {}),
      },
    });
  }

  editMessage({ channelId, messageId, content, signal }) {
    return this.#request(
      `channels/${snowflake(channelId, 'channel id')}/messages/${snowflake(messageId, 'message id')}`,
      {
        method: 'PATCH',
        signal,
        body: { content, allowed_mentions: { parse: [], replied_user: false } },
      },
    );
  }

  sendTyping({ channelId, signal }) {
    return this.#request(`channels/${snowflake(channelId, 'channel id')}/typing`, {
      method: 'POST',
      signal,
      expectBody: false,
    });
  }

  async #request(path, {
    method,
    body,
    signal,
    timeoutMs = 15_000,
    expectBody = true,
    retry = true,
  }) {
    let response;
    try {
      response = await this.#fetch(new URL(path, this.#baseUrl), {
        method,
        headers: {
          authorization: `Bot ${this.#token}`,
          'content-type': 'application/json',
          'user-agent': 'DeepSeek-Harness-dsh-im (https://github.com/xmanrui/dsh-im, 0.4.0)',
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: requestSignal(signal, timeoutMs),
        redirect: 'error',
      });
    } catch (error) {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError') throw error;
      throw new Error(`Discord ${method} transport failed`);
    }

    let parsed = null;
    if (expectBody || response.status === 429 || !response.ok) {
      try {
        parsed = await response.json();
      } catch {
        if (expectBody) throw new Error(`Discord ${method} returned invalid JSON`);
      }
    }
    if (response.status === 429 && retry) {
      const retryAfterMs = Math.min(10_000, Math.max(50, Number(parsed?.retry_after) * 1_000 || 1_000));
      await delay(retryAfterMs, signal);
      return this.#request(path, { method, body, signal, timeoutMs, expectBody, retry: false });
    }
    if (!response.ok) {
      const error = new Error(cleanString(parsed?.message) ?? `Discord API failed with HTTP ${response.status}`);
      error.code = `discord-${response.status}`;
      throw error;
    }
    return expectBody ? parsed : null;
  }
}

export async function inspectDiscordToken(token, options = {}) {
  const api = new DiscordApi({ token, ...options });
  const bot = await api.getCurrentUser();
  if (!bot?.id || bot?.bot !== true) throw new Error('Discord token does not belong to a bot');
  return {
    platformId: String(bot.id),
    name: cleanString(bot.global_name) ?? cleanString(bot.username) ?? 'Discord机器人',
    username: cleanString(bot.username),
  };
}
