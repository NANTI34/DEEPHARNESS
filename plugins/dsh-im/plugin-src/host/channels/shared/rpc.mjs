import { resolveRpcAuthority } from '../../rpc-authority.mjs';

export const TOKEN_BOT_ENDPOINTS = Object.freeze({
  status: 'connection.status',
  bindCredentials: 'bot.bind-credentials',
  reconnectBot: 'bot.reconnect',
  deleteBot: 'bot.delete',
});

const ENDPOINTS = Object.freeze(Object.values(TOKEN_BOT_ENDPOINTS));
const FORBIDDEN_PUBLIC_KEYS = new Set([
  'token', 'botToken', 'tokenRef', 'platformId', 'secret', 'secretRef',
]);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactKeys(value, allowed) {
  return isRecord(value) && Object.keys(value).every((key) => allowed.includes(key));
}

function validId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}

function validToken(value) {
  return typeof value === 'string' && value.trim().length >= 20 && value.length <= 4_096;
}

function payloadFailure(endpoint, payload) {
  if (!isRecord(payload)) return 'Payload must be an object.';
  if (endpoint === TOKEN_BOT_ENDPOINTS.status) {
    return exactKeys(payload, []) ? null : 'connection.status does not accept fields.';
  }
  if (endpoint === TOKEN_BOT_ENDPOINTS.bindCredentials) {
    return exactKeys(payload, ['token']) && validToken(payload.token)
      ? null : 'bot.bind-credentials requires a Bot Token.';
  }
  if (endpoint === TOKEN_BOT_ENDPOINTS.reconnectBot) {
    return exactKeys(payload, ['botId']) && validId(payload.botId)
      ? null : 'bot.reconnect requires a botId.';
  }
  if (endpoint === TOKEN_BOT_ENDPOINTS.deleteBot) {
    return exactKeys(payload, ['botId', 'confirm']) && validId(payload.botId) && payload.confirm === true
      ? null : 'bot.delete requires a botId and confirm=true.';
  }
  return 'Unknown bot endpoint.';
}

function sanitizePublic(value) {
  if (Array.isArray(value)) return value.map(sanitizePublic);
  if (!isRecord(value)) return value;
  const safe = {};
  for (const [key, child] of Object.entries(value)) {
    if (!FORBIDDEN_PUBLIC_KEYS.has(key)) safe[key] = sanitizePublic(child);
  }
  return safe;
}

function operationError(channel, error) {
  if (error?.code === 'webhook-configured') {
    return { code: 'webhook-configured', message: error.message };
  }
  if (error?.code === 'telegram-401' || error?.code === 'discord-401') {
    return { code: 'invalid-token', message: `${channel} Bot Token 无效，请重新填写。` };
  }
  if (error?.code === 'discord-intents') {
    return { code: 'discord-intents', message: error.message };
  }
  return { code: `${channel.toLowerCase()}-operation-failed`, message: `${channel} 操作失败，请稍后重试。` };
}

export function createTokenBotRpcHandler(controller, { channel }) {
  for (const method of ['status', 'bindCredentials', 'reconnectBot', 'deleteBot']) {
    if (typeof controller?.[method] !== 'function') {
      throw new TypeError(`A complete ${channel} controller is required (${method})`);
    }
  }
  return async (endpoint, payload, signal) => {
    if (signal?.aborted) {
      return { ok: false, error: { code: 'cancelled', message: 'The request was cancelled.' } };
    }
    if (!ENDPOINTS.includes(endpoint)) {
      return { ok: false, error: { code: 'bad-request', message: `Unknown ${channel} endpoint.` } };
    }
    const invalid = payloadFailure(endpoint, payload);
    if (invalid) return { ok: false, error: { code: 'bad-request', message: invalid } };
    try {
      let value;
      if (endpoint === TOKEN_BOT_ENDPOINTS.status) value = await controller.status();
      else if (endpoint === TOKEN_BOT_ENDPOINTS.bindCredentials) {
        value = await controller.bindCredentials(payload);
      } else if (endpoint === TOKEN_BOT_ENDPOINTS.reconnectBot) {
        value = await controller.reconnectBot(payload.botId);
      } else {
        value = await controller.deleteBot(payload.botId);
      }
      return signal?.aborted
        ? { ok: false, error: { code: 'cancelled', message: 'The request was cancelled.' } }
        : { ok: true, value: sanitizePublic(value) };
    } catch (error) {
      return signal?.aborted
        ? { ok: false, error: { code: 'cancelled', message: 'The request was cancelled.' } }
        : { ok: false, error: operationError(channel, error) };
    }
  };
}

export function installTokenBotRpc(ctx, controller, { channel, rpcChannel, authority }) {
  if (!ctx?.connection?.rpc || typeof ctx.connection.rpc.handle !== 'function') {
    throw new TypeError('DSH Host Connection RPC is required');
  }
  return ctx.connection.rpc.handle(
    rpcChannel,
    createTokenBotRpcHandler(controller, { channel }),
    { authority: resolveRpcAuthority(authority) },
  );
}
