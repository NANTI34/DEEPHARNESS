import QRCode from 'qrcode';

import { resolveRpcAuthority } from '../../rpc-authority.mjs';

export const WHATSAPP_RPC_CHANNEL = '/whatsapp';
export const WHATSAPP_ENDPOINTS = Object.freeze({
  status: 'connection.status',
  beginProvisioning: 'provision.begin',
  pollProvisioning: 'provision.poll',
  cancelProvisioning: 'provision.cancel',
  reconnectBot: 'bot.reconnect',
  deleteBot: 'bot.delete',
});
export const WHATSAPP_RPC_ENDPOINTS = Object.freeze(Object.values(WHATSAPP_ENDPOINTS));

const FORBIDDEN_PUBLIC_KEYS = new Set(['qrValue', 'accountJid', 'authDirectory']);

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function exactKeys(value, allowed) {
  return isRecord(value) && Object.keys(value).every((key) => allowed.includes(key));
}

function validId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}

function payloadFailure(endpoint, payload) {
  if (!isRecord(payload)) return 'Payload must be an object.';
  if ([WHATSAPP_ENDPOINTS.status, WHATSAPP_ENDPOINTS.beginProvisioning].includes(endpoint)) {
    return exactKeys(payload, []) ? null : `${endpoint} does not accept fields.`;
  }
  if ([WHATSAPP_ENDPOINTS.pollProvisioning, WHATSAPP_ENDPOINTS.cancelProvisioning].includes(endpoint)) {
    return exactKeys(payload, ['attemptId']) && validId(payload.attemptId)
      ? null : `${endpoint} requires an attemptId.`;
  }
  if (endpoint === WHATSAPP_ENDPOINTS.reconnectBot) {
    return exactKeys(payload, ['botId']) && validId(payload.botId)
      ? null : 'bot.reconnect requires a botId.';
  }
  if (endpoint === WHATSAPP_ENDPOINTS.deleteBot) {
    return exactKeys(payload, ['botId', 'confirm']) && validId(payload.botId)
      && payload.confirm === true ? null : 'bot.delete requires a botId and confirm=true.';
  }
  return 'Unknown WhatsApp endpoint.';
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

async function qrDataUrl(value) {
  return QRCode.toDataURL(value, {
    type: 'image/png',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 320,
  });
}

async function encodeAttempt(value, encodeQr) {
  if (!value || typeof value.qrValue !== 'string') return sanitizePublic(value);
  return sanitizePublic({ ...value, qrCodeDataUrl: await encodeQr(value.qrValue) });
}

async function publicStatus(value, encodeQr) {
  const snapshot = structuredClone(value);
  if (snapshot?.provisioning) snapshot.provisioning = await encodeAttempt(snapshot.provisioning, encodeQr);
  return sanitizePublic(snapshot);
}

export function createWhatsappRpcHandler(controller, { encodeQr = qrDataUrl } = {}) {
  for (const method of ['status', 'startProvisioning', 'registrationStatus', 'cancelProvisioning', 'reconnectBot', 'deleteBot']) {
    if (typeof controller?.[method] !== 'function') {
      throw new TypeError(`A complete WhatsApp controller is required (${method})`);
    }
  }
  const qrCache = new Map();
  const cachedEncode = (value) => {
    let encoded = qrCache.get(value);
    if (!encoded) {
      if (qrCache.size >= 16) qrCache.delete(qrCache.keys().next().value);
      encoded = Promise.resolve().then(() => encodeQr(value));
      qrCache.set(value, encoded);
    }
    return encoded;
  };
  return async (endpoint, payload, signal) => {
    if (signal?.aborted) return { ok: false, error: { code: 'cancelled', message: 'The request was cancelled.' } };
    if (!WHATSAPP_RPC_ENDPOINTS.includes(endpoint)) {
      return { ok: false, error: { code: 'bad-request', message: 'Unknown WhatsApp endpoint.' } };
    }
    const invalid = payloadFailure(endpoint, payload);
    if (invalid) return { ok: false, error: { code: 'bad-request', message: invalid } };
    try {
      let value;
      if (endpoint === WHATSAPP_ENDPOINTS.status) {
        value = await publicStatus(await controller.status(), cachedEncode);
      } else if (endpoint === WHATSAPP_ENDPOINTS.beginProvisioning) {
        value = await encodeAttempt(await controller.startProvisioning(), cachedEncode);
      } else if (endpoint === WHATSAPP_ENDPOINTS.pollProvisioning) {
        const attempt = await controller.registrationStatus(payload.attemptId);
        if (!attempt) return { ok: false, error: { code: 'bad-request', message: 'The provisioning attempt no longer exists.' } };
        value = await encodeAttempt(attempt, cachedEncode);
      } else if (endpoint === WHATSAPP_ENDPOINTS.cancelProvisioning) {
        value = sanitizePublic(await controller.cancelProvisioning(payload.attemptId));
      } else if (endpoint === WHATSAPP_ENDPOINTS.reconnectBot) {
        value = await publicStatus(await controller.reconnectBot(payload.botId), cachedEncode);
      } else {
        value = await publicStatus(await controller.deleteBot(payload.botId), cachedEncode);
      }
      return signal?.aborted
        ? { ok: false, error: { code: 'cancelled', message: 'The request was cancelled.' } }
        : { ok: true, value };
    } catch {
      return signal?.aborted
        ? { ok: false, error: { code: 'cancelled', message: 'The request was cancelled.' } }
        : { ok: false, error: { code: 'whatsapp-operation-failed', message: 'WhatsApp 操作失败，请稍后重试。' } };
    }
  };
}

export function installWhatsappRpc(ctx, controller, options, authority) {
  if (!ctx?.connection?.rpc || typeof ctx.connection.rpc.handle !== 'function') {
    throw new TypeError('DSH Host Connection RPC is required');
  }
  return ctx.connection.rpc.handle(
    WHATSAPP_RPC_CHANNEL,
    createWhatsappRpcHandler(controller, options),
    { authority: resolveRpcAuthority(authority) },
  );
}
