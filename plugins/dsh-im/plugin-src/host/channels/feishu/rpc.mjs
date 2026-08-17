import QRCode from 'qrcode';
import { resolveRpcAuthority } from '../../rpc-authority.mjs';
import {
  FEISHU_ENDPOINTS,
  FEISHU_RPC_CHANNEL,
} from '../../../client/channels/feishu/api.js';

export { FEISHU_ENDPOINTS, FEISHU_RPC_CHANNEL };
export const FEISHU_MULTI_ENDPOINTS = Object.freeze({
  reconnectBot: 'bot.reconnect',
  disconnectBot: 'bot.disconnect',
  deleteBot: 'bot.delete',
});
export const FEISHU_RPC_ENDPOINTS = Object.freeze([
  ...new Set([...Object.values(FEISHU_ENDPOINTS), ...Object.values(FEISHU_MULTI_ENDPOINTS)]),
]);

const REGISTRATION_STATES = new Set([
  'idle', 'starting', 'qr_ready', 'polling', 'slow_down',
  'domain_switched', 'saving', 'succeeded', 'expired', 'cancelled', 'error',
]);
const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

const PUBLIC_ERROR_MESSAGES = Object.freeze({
  abort: 'Registration was cancelled.',
  access_denied: 'Registration was denied.',
  expired_token: 'The registration QR code expired.',
  invalid_credentials: 'Feishu returned invalid app credentials.',
  credentials_callback_failed: 'Unable to activate the Feishu connection.',
  registration_failed: 'Unable to register the Feishu app.',
  connection_failed: 'The bot was created, but its connection could not be started.',
  credential_removal_failed: 'Unable to remove the Feishu credentials.',
  state_cleanup_failed: 'Unable to remove the bot session data. Please retry.',
  deletion_pending: 'Bot deletion is incomplete. Retry removal to finish cleanup.',
  missing_credentials: 'The bot credentials are missing. Delete it and scan again.',
});

const POLL_STATUS_BY_REGISTRATION = Object.freeze({
  idle: 'pending', starting: 'pending', qr_ready: 'pending', polling: 'pending',
  slow_down: 'pending', domain_switched: 'pending', saving: 'connecting',
  succeeded: 'connected', expired: 'expired', cancelled: 'failed', error: 'failed',
});

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOnlyKeys(value, allowed) {
  return isPlainObject(value)
    && Reflect.ownKeys(value).every((key) => typeof key === 'string' && allowed.has(key));
}

function finiteNumber(value) {
  return Number.isFinite(value) ? value : undefined;
}

function safeOpaqueId(value) {
  return typeof value === 'string' && SAFE_ID.test(value);
}

function validCredential(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function publicError(error) {
  if (!error || typeof error !== 'object') return null;
  const code = typeof error.code === 'string' && Object.hasOwn(PUBLIC_ERROR_MESSAGES, error.code)
    ? error.code
    : 'registration_failed';
  return { code, message: PUBLIC_ERROR_MESSAGES[code] };
}

function publicRegistration(registration) {
  if (!registration || typeof registration !== 'object') return { state: 'idle', attempt: 0 };
  const state = REGISTRATION_STATES.has(registration.state) ? registration.state : 'error';
  const attempt = safeOpaqueId(registration.attempt)
    ? registration.attempt
    : (finiteNumber(registration.attempt) ?? 0);
  const result = { state, attempt };
  const updatedAt = finiteNumber(registration.updatedAt);
  const expiresAt = finiteNumber(registration.expiresAt);
  const remainingSeconds = finiteNumber(registration.remainingSeconds);
  const pollIntervalSeconds = finiteNumber(registration.pollIntervalSeconds);
  if (updatedAt !== undefined) result.updatedAt = updatedAt;
  if (typeof registration.qrCodeUrl === 'string' && registration.qrCodeUrl.length > 0) {
    result.qrCodeUrl = registration.qrCodeUrl;
  }
  if (expiresAt !== undefined) result.expiresAt = expiresAt;
  if (remainingSeconds !== undefined) result.remainingSeconds = remainingSeconds;
  if (pollIntervalSeconds !== undefined) result.pollIntervalSeconds = pollIntervalSeconds;
  if (safeOpaqueId(registration.botId)) result.botId = registration.botId;
  const error = publicError(registration.error);
  if (error) result.error = error;
  return result;
}

function connectionFacts(connection) {
  const source = connection && typeof connection === 'object' ? connection : {};
  const connected = source.connected === true
    || (source.ready === true
      && source.feishuLongConnectionState === 'connected'
      && source.harnessReachable === true);
  return {
    connected,
    ready: source.ready === true,
    harnessReachable: source.harnessReachable === true,
  };
}

function publicBot(bot) {
  const source = bot && typeof bot === 'object' ? bot : {};
  const result = {
    name: typeof source.name === 'string' && source.name.length > 0 ? source.name : '飞书机器人',
  };
  if (typeof source.avatarUrl === 'string') result.avatarUrl = source.avatarUrl;
  if (typeof source.appIdMasked === 'string') result.appIdMasked = source.appIdMasked;
  if (typeof source.tenantName === 'string') result.tenantName = source.tenantName;
  if (source.domain === 'feishu' || source.domain === 'lark') result.domain = source.domain;
  if (typeof source.activated === 'boolean' || typeof source.activated === 'number') {
    result.activated = source.activated;
  }
  return result;
}

function publicHealth(status, connected) {
  if (connected) return { status: 'healthy', summary: '长连接运行正常', lastCheckedAt: Date.now() };
  if (status?.configured === true) {
    return { status: 'offline', summary: '机器人尚未连接', lastCheckedAt: Date.now() };
  }
  return { status: 'offline', summary: '尚未接入飞书机器人', lastCheckedAt: Date.now() };
}

function connectionState(status, registration, connected) {
  if (connected) return 'connected';
  if (status?.phase === 'error' || registration.state === 'error') return 'error';
  if (status?.phase === 'connecting' || registration.state === 'saving') return 'connecting';
  if (status?.phase === 'registering'
    || ['starting', 'qr_ready', 'polling', 'slow_down', 'domain_switched'].includes(registration.state)) {
    return 'provisioning';
  }
  return 'disconnected';
}

async function qrCodeDataUrl(verificationUrl) {
  return QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: 'M', margin: 1, width: 320, type: 'image/png',
  });
}

async function publicProvisioning(registration, encodeQr) {
  if (!registration.qrCodeUrl) return undefined;
  return {
    attemptId: String(registration.attempt),
    verificationUrl: registration.qrCodeUrl,
    qrCodeDataUrl: await encodeQr(registration.qrCodeUrl),
    expiresAt: registration.expiresAt ?? Date.now() + (5 * 60_000),
    pollIntervalMs: Math.max(800, Math.min(10_000, (registration.pollIntervalSeconds ?? 1.8) * 1000)),
  };
}

function publicBotEntry(entry) {
  const source = entry && typeof entry === 'object' ? entry : {};
  if (!safeOpaqueId(source.botId)) return null;
  const facts = connectionFacts(source.connection);
  const connected = source.connected === true || facts.connected;
  const registration = { state: 'idle' };
  const result = {
    botId: source.botId,
    state: connectionState(source, registration, connected),
    connected,
    configured: source.configured === true,
    bot: publicBot(source.bot),
    health: publicHealth(source, connected),
  };
  const error = publicError(source.error);
  if (error) result.error = error;
  return result;
}

/** Exact redacted browser contract consumed by the Feishu settings client. */
export async function toPublicFeishuStatus(status, { encodeQr = qrCodeDataUrl } = {}) {
  const source = status && typeof status === 'object' ? status : {};
  const registration = publicRegistration(source.registration);
  const facts = connectionFacts(source.connection);
  const connected = source.connected === true || facts.connected;
  const provisioning = await publicProvisioning(registration, encodeQr);
  const error = publicError(source.error) ?? registration.error ?? null;
  const bots = Array.isArray(source.bots)
    ? source.bots.map(publicBotEntry).filter(Boolean)
    : [];
  const snapshot = {
    schemaVersion: source.schemaVersion === 2 ? 2 : 1,
    revision: Number.isSafeInteger(source.revision) && source.revision >= 0 ? source.revision : 0,
    state: connectionState(source, registration, connected),
    connected,
    configured: source.configured === true,
    bot: publicBot(source.bot),
    health: publicHealth(source, connected),
    bots,
    totals: {
      configured: bots.length || (source.configured === true ? 1 : 0),
      connected: bots.length ? bots.filter((bot) => bot.connected).length : (connected ? 1 : 0),
    },
  };
  if (provisioning) snapshot.provisioning = provisioning;
  if (error) snapshot.error = error;
  return snapshot;
}

function badRequest(message) {
  return { ok: false, error: { code: 'bad-request', message, details: { issues: [] } } };
}

function cancelled() {
  return { ok: false, error: { code: 'cancelled', message: 'The Feishu request was cancelled.', details: {} } };
}

function internalFailure() {
  return { ok: false, error: { code: 'internal', message: 'The Feishu integration operation failed.', details: {} } };
}

function validPayload(endpoint, payload) {
  if (endpoint === FEISHU_ENDPOINTS.status) {
    return hasOnlyKeys(payload, new Set()) ? null : 'This endpoint accepts an empty payload only.';
  }
  if (endpoint === FEISHU_ENDPOINTS.testConnection) {
    return hasOnlyKeys(payload, new Set()) ? null : 'This endpoint accepts an empty payload only.';
  }
  if (endpoint === FEISHU_ENDPOINTS.beginProvisioning) {
    if (!hasOnlyKeys(payload, new Set(['locale', 'replaceAttemptId']))) {
      return 'Provisioning accepts locale and replaceAttemptId only.';
    }
    if (payload.locale !== undefined && payload.locale !== 'zh-CN') return 'The provisioning locale must be zh-CN.';
    if (payload.replaceAttemptId !== undefined && !safeOpaqueId(payload.replaceAttemptId)) {
      return 'replaceAttemptId must be a valid opaque id.';
    }
    return null;
  }
  if (endpoint === FEISHU_ENDPOINTS.bindCredentials) {
    return hasOnlyKeys(payload, new Set(['appId', 'appSecret']))
      && validCredential(payload.appId, 256)
      && validCredential(payload.appSecret, 1024)
      ? null
      : 'Credential binding requires App ID and App Secret.';
  }
  if (endpoint === FEISHU_ENDPOINTS.pollProvisioning
    || endpoint === FEISHU_ENDPOINTS.cancelProvisioning) {
    return hasOnlyKeys(payload, new Set(['attemptId'])) && safeOpaqueId(payload.attemptId)
      ? null
      : 'A single valid attemptId is required.';
  }
  if (endpoint === FEISHU_ENDPOINTS.disconnect) {
    return hasOnlyKeys(payload, new Set(['removeCredentials'])) && payload.removeCredentials === true
      ? null
      : 'Disconnect requires removeCredentials=true.';
  }
  if (endpoint === FEISHU_MULTI_ENDPOINTS.reconnectBot
    || endpoint === FEISHU_MULTI_ENDPOINTS.disconnectBot) {
    return hasOnlyKeys(payload, new Set(['botId'])) && safeOpaqueId(payload.botId)
      ? null
      : 'A single valid botId is required.';
  }
  if (endpoint === FEISHU_MULTI_ENDPOINTS.deleteBot) {
    return hasOnlyKeys(payload, new Set(['botId', 'confirm']))
      && safeOpaqueId(payload.botId) && payload.confirm === true
      ? null
      : 'Deleting a bot requires a valid botId and confirm=true.';
  }
  return 'Unknown Feishu endpoint.';
}

function abortableDelay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new Error('aborted'));
      return;
    }
    const timer = setTimeout(done, milliseconds);
    timer.unref?.();
    function done() {
      signal?.removeEventListener('abort', aborted);
      resolve();
    }
    function aborted() {
      clearTimeout(timer);
      reject(signal.reason ?? new Error('aborted'));
    }
    signal?.addEventListener('abort', aborted, { once: true });
  });
}

async function statusForRegistration(controller, attemptId) {
  if (typeof controller.registrationStatus === 'function') {
    return controller.registrationStatus(attemptId);
  }
  return controller.status();
}

async function waitForQr(controller, initial, attemptId, signal) {
  let current = initial;
  const deadline = Date.now() + 15_000;
  for (;;) {
    const registration = publicRegistration(current?.registration);
    if (registration.qrCodeUrl) return current;
    if (['error', 'expired', 'cancelled'].includes(registration.state)) {
      throw new Error('Provisioning stopped before the QR code was ready.');
    }
    if (Date.now() >= deadline) throw new Error('Provisioning QR code timed out.');
    await abortableDelay(50, signal);
    current = await statusForRegistration(controller, attemptId);
    if (!current) throw new Error('The provisioning attempt is no longer active.');
  }
}

function sameAttempt(status, attemptId) {
  return String(publicRegistration(status?.registration).attempt) === attemptId;
}

function pollStatus(status) {
  const registration = publicRegistration(status?.registration);
  if (registration.state === 'succeeded') {
    const connected = registration.botId
      && (status?.connected === true || connectionFacts(status?.connection).connected);
    return connected ? 'connected' : 'connecting';
  }
  return POLL_STATUS_BY_REGISTRATION[registration.state] ?? 'failed';
}

function assertController(controller) {
  if (!controller
    || typeof controller.status !== 'function'
    || typeof controller.startRegistration !== 'function'
    || typeof controller.cancelRegistration !== 'function'
    || typeof controller.disconnect !== 'function') {
    throw new TypeError('A Feishu controller with status/start/cancel/disconnect is required');
  }
}

/** DSH rc.6 handler: (endpoint, payload, signal) => Promise<RpcResult>. */
export function createFeishuRpcHandler(controller, { encodeQr = qrCodeDataUrl } = {}) {
  assertController(controller);
  const qrCache = new Map();
  const attemptQr = new Map();
  const cachedEncodeQr = (url) => {
    let encoded = qrCache.get(url);
    if (!encoded) {
      if (qrCache.size >= 32) qrCache.delete(qrCache.keys().next().value);
      encoded = Promise.resolve().then(() => encodeQr(url));
      qrCache.set(url, encoded);
    }
    return encoded;
  };

  return async (endpoint, payload, signal) => {
    if (signal?.aborted) return cancelled();
    if (!FEISHU_RPC_ENDPOINTS.includes(endpoint)) return badRequest('Unknown Feishu endpoint.');
    const payloadFailure = validPayload(endpoint, payload);
    if (payloadFailure) return badRequest(payloadFailure);

    try {
      let value;
      if (endpoint === FEISHU_ENDPOINTS.status) {
        value = await toPublicFeishuStatus(await controller.status(), { encodeQr: cachedEncodeQr });
      } else if (endpoint === FEISHU_ENDPOINTS.beginProvisioning) {
        if (payload.replaceAttemptId) {
          await controller.cancelRegistration(payload.replaceAttemptId);
        }
        const started = await controller.startRegistration({ locale: payload.locale });
        const attemptId = String(publicRegistration(started?.registration).attempt);
        const ready = await waitForQr(controller, started, attemptId, signal);
        value = (await toPublicFeishuStatus(ready, { encodeQr: cachedEncodeQr })).provisioning;
        if (!value) throw new Error('Provisioning did not produce a QR code.');
        attemptQr.set(attemptId, value.verificationUrl);
      } else if (endpoint === FEISHU_ENDPOINTS.pollProvisioning) {
        const current = await statusForRegistration(controller, payload.attemptId);
        if (!current || !sameAttempt(current, payload.attemptId)) {
          return badRequest('The provisioning attempt is no longer active.');
        }
        const registration = publicRegistration(current.registration);
        const connection = await toPublicFeishuStatus(current, { encodeQr: cachedEncodeQr });
        value = {
          status: pollStatus(current),
          ...(registration.botId ? { botId: registration.botId } : {}),
          ...(connection.provisioning ? { provisioning: connection.provisioning } : {}),
          ...(registration.botId && connection.connected ? { connection } : {}),
          ...(connection.error ? { message: connection.error.message } : {}),
        };
        if (['connected', 'expired', 'failed'].includes(value.status)) {
          const url = attemptQr.get(payload.attemptId);
          if (url) qrCache.delete(url);
          attemptQr.delete(payload.attemptId);
        }
      } else if (endpoint === FEISHU_ENDPOINTS.cancelProvisioning) {
        const current = await statusForRegistration(controller, payload.attemptId);
        if (!current || !sameAttempt(current, payload.attemptId)) {
          return badRequest('The provisioning attempt is no longer active.');
        }
        const multi = typeof controller.registrationStatus === 'function';
        const registration = publicRegistration(current.registration);
        if (!multi && registration.state === 'saving') await controller.disconnect();
        else await controller.cancelRegistration(payload.attemptId);
        const url = attemptQr.get(payload.attemptId);
        if (url) qrCache.delete(url);
        attemptQr.delete(payload.attemptId);
        value = { status: 'failed', message: 'Registration was cancelled.' };
      } else if (endpoint === FEISHU_ENDPOINTS.bindCredentials) {
        if (typeof controller.bindCredentials !== 'function') {
          throw new Error('Credential binding is unavailable');
        }
        value = await toPublicFeishuStatus(
          await controller.bindCredentials(payload),
          { encodeQr: cachedEncodeQr },
        );
      } else if (endpoint === FEISHU_ENDPOINTS.testConnection) {
        const current = await controller.status();
        const alreadyConnected = current?.connected === true
          || connectionFacts(current?.connection).connected;
        const checked = alreadyConnected || typeof controller.reconnect !== 'function'
          ? current
          : await controller.reconnect();
        value = await toPublicFeishuStatus(checked, { encodeQr: cachedEncodeQr });
      } else if (endpoint === FEISHU_ENDPOINTS.disconnect) {
        value = await toPublicFeishuStatus(await controller.disconnect(), { encodeQr: cachedEncodeQr });
      } else if (endpoint === FEISHU_MULTI_ENDPOINTS.reconnectBot) {
        if (typeof controller.reconnectBot !== 'function') throw new Error('Multi-bot reconnect is unavailable');
        value = await toPublicFeishuStatus(await controller.reconnectBot(payload.botId), { encodeQr: cachedEncodeQr });
      } else if (endpoint === FEISHU_MULTI_ENDPOINTS.disconnectBot) {
        if (typeof controller.disconnectBot !== 'function') throw new Error('Multi-bot disconnect is unavailable');
        value = await toPublicFeishuStatus(await controller.disconnectBot(payload.botId), { encodeQr: cachedEncodeQr });
      } else {
        if (typeof controller.deleteBot !== 'function') throw new Error('Multi-bot delete is unavailable');
        value = await toPublicFeishuStatus(await controller.deleteBot(payload.botId), { encodeQr: cachedEncodeQr });
      }
      if (signal?.aborted) return cancelled();
      return { ok: true, value };
    } catch {
      return signal?.aborted ? cancelled() : internalFailure();
    }
  };
}

/** Register the `/feishu` logical channel with its configured browser authority. */
export function installFeishuRpc(ctx, controller, options, authority) {
  if (!ctx?.connection?.rpc || typeof ctx.connection.rpc.handle !== 'function') {
    throw new TypeError('DSH Host Connection RPC is required');
  }
  return ctx.connection.rpc.handle(
    FEISHU_RPC_CHANNEL,
    createFeishuRpcHandler(controller, options),
    { authority: resolveRpcAuthority(authority) },
  );
}
