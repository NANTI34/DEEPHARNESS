import { randomBytes, randomUUID } from 'node:crypto';

export const WEIXIN_QR_BASE_URL = 'https://ilinkai.weixin.qq.com/';
export const WEIXIN_PROTOCOL_VERSION = '2.4.6';
export const DEFAULT_BOT_TYPE = '3';

const ILINK_APP_ID = 'bot';
const ILINK_CLIENT_VERSION = (2 << 16) | (4 << 8) | 6;
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_LONG_POLL_TIMEOUT_MS = 35_000;
const LOGIN_STATUSES = new Set([
  'wait',
  'scaned',
  'confirmed',
  'expired',
  'scaned_but_redirect',
  'need_verifycode',
  'verify_code_blocked',
  'binded_redirect',
]);

export class WeixinApiError extends Error {
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = 'WeixinApiError';
    this.code = code;
    this.status = options.status;
  }
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function isWeixinHost(hostname) {
  const normalized = hostname.toLowerCase().replace(/\.$/, '');
  return normalized === 'weixin.qq.com' || normalized.endsWith('.weixin.qq.com');
}

export function normalizeWeixinApiBaseUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new WeixinApiError('invalid-base-url', '微信服务返回了无效的连接地址。');
  }
  if (url.protocol !== 'https:' || !isWeixinHost(url.hostname)
    || (url.port !== '' && url.port !== '443')) {
    throw new WeixinApiError('untrusted-base-url', '微信服务返回了不受信任的连接地址。');
  }
  url.username = '';
  url.password = '';
  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.toString();
}

export function normalizeWeixinQrUrl(value) {
  const text = nonEmptyString(value);
  if (!text) throw new WeixinApiError('invalid-qr', '微信服务没有返回扫码地址。');
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new WeixinApiError('invalid-qr', '微信服务返回了无效的扫码地址。');
  }
  if (url.protocol !== 'https:' || !isWeixinHost(url.hostname)) {
    throw new WeixinApiError('untrusted-qr', '微信服务返回了不受信任的扫码地址。');
  }
  return url.toString();
}

function commonHeaders() {
  return {
    'iLink-App-Id': ILINK_APP_ID,
    'iLink-App-ClientVersion': String(ILINK_CLIENT_VERSION),
  };
}

function authenticatedHeaders(token) {
  const headers = {
    ...commonHeaders(),
    'content-type': 'application/json',
    AuthorizationType: 'ilink_bot_token',
    'X-WECHAT-UIN': Buffer.from(String(randomBytes(4).readUInt32BE(0)), 'utf8').toString('base64'),
  };
  if (nonEmptyString(token)) headers.Authorization = `Bearer ${token.trim()}`;
  return headers;
}

function baseInfo() {
  return {
    channel_version: WEIXIN_PROTOCOL_VERSION,
    bot_agent: 'DeepSeekHarness/0.4.0',
  };
}

function abortError(signal) {
  if (signal?.reason instanceof Error) return signal.reason;
  return new DOMException('The operation was aborted', 'AbortError');
}

async function requestJson(fetchImpl, {
  method,
  baseUrl,
  endpoint,
  body,
  token,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  signal,
  authenticated = true,
}) {
  const trustedBase = normalizeWeixinApiBaseUrl(baseUrl);
  const url = new URL(endpoint, trustedBase);
  if (!isWeixinHost(url.hostname)) {
    throw new WeixinApiError('untrusted-endpoint', '拒绝访问不受信任的微信服务地址。');
  }

  const controller = new AbortController();
  let timedOut = false;
  const onAbort = () => controller.abort(signal?.reason);
  if (signal?.aborted) throw abortError(signal);
  signal?.addEventListener('abort', onAbort, { once: true });
  const timer = timeoutMs > 0 ? setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs) : null;

  try {
    const response = await fetchImpl(url, {
      method,
      headers: authenticated ? authenticatedHeaders(token) : commonHeaders(),
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new WeixinApiError(
        'http-error',
        `微信服务请求失败（HTTP ${response.status}）。`,
        { status: response.status },
      );
    }
    try {
      return await response.json();
    } catch (error) {
      throw new WeixinApiError('invalid-response', '微信服务返回了无法解析的响应。', { cause: error });
    }
  } catch (error) {
    if (signal?.aborted) throw abortError(signal);
    if (timedOut) {
      throw new WeixinApiError('timeout', '微信服务请求超时。', { cause: error });
    }
    if (error instanceof WeixinApiError) throw error;
    throw new WeixinApiError('network-error', '暂时无法访问微信服务。', { cause: error });
  } finally {
    if (timer) clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

function validateLoginResponse(value) {
  if (!value || typeof value !== 'object' || !LOGIN_STATUSES.has(value.status)) {
    throw new WeixinApiError('invalid-login-status', '微信服务返回了无法识别的扫码状态。');
  }
  return value;
}

export function createWeixinApi({ fetchImpl = fetch } = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');

  return Object.freeze({
    async beginLogin({ localTokens = [], botType = DEFAULT_BOT_TYPE, signal } = {}) {
      const tokens = [...new Set(localTokens.map(nonEmptyString).filter(Boolean))].slice(-10);
      const response = await requestJson(fetchImpl, {
        method: 'POST',
        baseUrl: WEIXIN_QR_BASE_URL,
        endpoint: `ilink/bot/get_bot_qrcode?bot_type=${encodeURIComponent(botType)}`,
        body: { local_token_list: tokens },
        timeoutMs: 10_000,
        signal,
      });
      const qrcode = nonEmptyString(response?.qrcode);
      if (!qrcode) throw new WeixinApiError('invalid-qr', '微信服务没有返回二维码令牌。');
      return {
        qrcode,
        qrcodeUrl: normalizeWeixinQrUrl(response.qrcode_img_content),
      };
    },

    async pollLogin({ qrcode, baseUrl = WEIXIN_QR_BASE_URL, verifyCode, signal }) {
      const qr = nonEmptyString(qrcode);
      if (!qr) throw new TypeError('qrcode is required');
      let endpoint = `ilink/bot/get_qrcode_status?qrcode=${encodeURIComponent(qr)}`;
      if (nonEmptyString(verifyCode)) endpoint += `&verify_code=${encodeURIComponent(verifyCode.trim())}`;
      const response = await requestJson(fetchImpl, {
        method: 'GET',
        baseUrl,
        endpoint,
        timeoutMs: DEFAULT_LONG_POLL_TIMEOUT_MS,
        signal,
        authenticated: false,
      });
      return validateLoginResponse(response);
    },

    async getUpdates({ baseUrl, token, getUpdatesBuf = '', timeoutMs, signal }) {
      try {
        return await requestJson(fetchImpl, {
          method: 'POST',
          baseUrl,
          endpoint: 'ilink/bot/getupdates',
          body: { get_updates_buf: getUpdatesBuf, base_info: baseInfo() },
          token,
          timeoutMs: timeoutMs ?? DEFAULT_LONG_POLL_TIMEOUT_MS,
          signal,
        });
      } catch (error) {
        if (error instanceof WeixinApiError && error.code === 'timeout') {
          return { ret: 0, msgs: [], get_updates_buf: getUpdatesBuf };
        }
        throw error;
      }
    },

    async sendText({ baseUrl, token, toUserId, text, contextToken, runId, signal }) {
      const recipient = nonEmptyString(toUserId);
      const content = nonEmptyString(text);
      if (!recipient || !content) throw new TypeError('toUserId and text are required');
      const response = await requestJson(fetchImpl, {
        method: 'POST',
        baseUrl,
        endpoint: 'ilink/bot/sendmessage',
        token,
        signal,
        body: {
          msg: {
            from_user_id: '',
            to_user_id: recipient,
            client_id: `dsh-weixin-${randomUUID()}`,
            message_type: 2,
            message_state: 2,
            item_list: [{ type: 1, text_item: { text: content } }],
            ...(nonEmptyString(contextToken) ? { context_token: contextToken.trim() } : {}),
            ...(nonEmptyString(runId) ? { run_id: runId.trim() } : {}),
          },
          base_info: baseInfo(),
        },
      });
      if (response?.ret !== undefined && response.ret !== 0) {
        throw new WeixinApiError('send-rejected', '微信服务拒绝了回复消息。');
      }
      return true;
    },

    async notifyStart({ baseUrl, token, signal }) {
      const response = await requestJson(fetchImpl, {
        method: 'POST',
        baseUrl,
        endpoint: 'ilink/bot/msg/notifystart',
        token,
        signal,
        timeoutMs: 10_000,
        body: { base_info: baseInfo() },
      });
      if (response?.ret !== undefined && response.ret !== 0) {
        throw new WeixinApiError('start-rejected', '微信账号连接启动失败。');
      }
      return response;
    },

    async notifyStop({ baseUrl, token, signal }) {
      return requestJson(fetchImpl, {
        method: 'POST',
        baseUrl,
        endpoint: 'ilink/bot/msg/notifystop',
        token,
        signal,
        timeoutMs: 10_000,
        body: { base_info: baseInfo() },
      });
    },
  });
}

export function extractWeixinText(message) {
  for (const item of message?.item_list ?? []) {
    if (item?.type === 1 && typeof item.text_item?.text === 'string') {
      const text = item.text_item.text.trim();
      if (text) return text;
    }
    if (item?.type === 3 && typeof item.voice_item?.text === 'string') {
      const text = item.voice_item.text.trim();
      if (text) return text;
    }
  }
  return null;
}

export function weixinMessageId(message) {
  if (message?.message_id !== undefined && message.message_id !== null) {
    return String(message.message_id);
  }
  return nonEmptyString(message?.client_id);
}

export function splitWeixinText(text, maxChars = 4_000) {
  if (text.length <= maxChars) return [text];
  const chunks = [];
  let remaining = text;
  while (remaining.length > maxChars) {
    let splitAt = remaining.lastIndexOf('\n', maxChars);
    if (splitAt < Math.floor(maxChars * 0.6)) splitAt = maxChars;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).replace(/^\n+/, '');
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}
