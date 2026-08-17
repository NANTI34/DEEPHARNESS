import { randomUUID } from 'node:crypto';

import {
  normalizeWeixinApiBaseUrl,
  WEIXIN_QR_BASE_URL,
  WeixinApiError,
} from './weixin-api.mjs';
import { deriveWeixinBotIdentity, maskWeixinAccountId } from './config-store.mjs';

const ACTIVE_ATTEMPT_STATES = new Set([
  'starting',
  'pending',
  'scanned',
  'needs_verification',
  'connecting',
]);
const TERMINAL_ATTEMPT_STATES = new Set(['connected', 'expired', 'failed', 'cancelled']);
const QR_TTL_MS = 5 * 60_000;

function cleanString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function abortError() {
  return new DOMException('Provisioning was cancelled', 'AbortError');
}

function apiBaseFromServer(value, fallback) {
  const raw = cleanString(value);
  if (!raw) return normalizeWeixinApiBaseUrl(fallback);
  return normalizeWeixinApiBaseUrl(raw.includes('://') ? raw : `https://${raw}`);
}

function publicAttempt(record) {
  if (!record) return null;
  return {
    attemptId: record.id,
    status: record.state,
    ...(record.verificationUrl ? { verificationUrl: record.verificationUrl } : {}),
    ...(record.expiresAt ? { expiresAt: record.expiresAt } : {}),
    pollIntervalMs: 1_000,
    ...(record.state === 'needs_verification' ? { verificationRequired: true } : {}),
    ...(record.botId ? { botId: record.botId } : {}),
    ...(record.alreadyConnected ? { alreadyConnected: true } : {}),
    ...(record.error ? { error: structuredClone(record.error) } : {}),
  };
}

function safeAccountError(code, message) {
  return Object.freeze({ code, message });
}

export class WeixinController {
  #api;
  #credentials;
  #configStore;
  #createRuntime;
  #deleteState;
  #logger;
  #runtimes = new Map();
  #errors = new Map();
  #attempts = new Map();
  #activeAttemptId = null;
  #transitions = new Map();
  #revision = 0;
  #closed = false;

  constructor({
    api,
    credentials,
    configStore,
    createRuntime,
    deleteState = async () => {},
    logger = console,
  }) {
    if (!api || typeof api.beginLogin !== 'function' || typeof api.pollLogin !== 'function') {
      throw new TypeError('WeixinController requires a Weixin API client');
    }
    if (!credentials
      || typeof credentials.resolve !== 'function'
      || typeof credentials.set !== 'function'
      || typeof credentials.unset !== 'function') {
      throw new TypeError('WeixinController requires the DSH credential provider');
    }
    if (!configStore
      || typeof configStore.list !== 'function'
      || typeof configStore.save !== 'function'
      || typeof configStore.remove !== 'function') {
      throw new TypeError('WeixinController requires a config store');
    }
    if (typeof createRuntime !== 'function') throw new TypeError('createRuntime is required');
    this.#api = api;
    this.#credentials = credentials;
    this.#configStore = configStore;
    this.#createRuntime = createRuntime;
    this.#deleteState = deleteState;
    this.#logger = logger;
  }

  async initialize() {
    if (this.#closed) return this.status();
    for (const config of this.#configStore.list()) {
      const current = this.#runtimes.get(config.botId);
      if (current?.status?.ready === true) continue;
      await this.#withBotTransition(config.botId, async () => {
        const latest = this.#configStore.get(config.botId);
        if (!latest || this.#closed) return;
        try {
          const token = await this.#resolveToken(latest.tokenRef);
          if (!token) {
            this.#errors.set(
              latest.botId,
              safeAccountError('missing-token', '登录凭据缺失，请移除账号后重新扫码。'),
            );
            return;
          }
          await this.#startRuntime(latest, token);
          this.#errors.delete(latest.botId);
        } catch (error) {
          this.#errors.set(
            latest.botId,
            safeAccountError('connection-failed', '微信连接未就绪，插件会自动重试。'),
          );
          this.#logger.warn?.(`[dsh-weixin] account ${latest.botId} failed to initialize:`, error);
        } finally {
          this.#touch();
        }
      });
    }
    return this.status();
  }

  async startProvisioning() {
    if (this.#closed) throw new Error('dsh-weixin controller is closed');
    if (this.#activeAttemptId) await this.cancelProvisioning(this.#activeAttemptId);

    const record = {
      id: randomUUID(),
      state: 'starting',
      createdAt: Date.now(),
      expiresAt: Date.now() + QR_TTL_MS,
      controller: new AbortController(),
      pendingVerifyCode: null,
      verifyResolve: null,
      currentBaseUrl: WEIXIN_QR_BASE_URL,
      error: null,
      botId: null,
      task: null,
    };
    this.#attempts.set(record.id, record);
    this.#activeAttemptId = record.id;
    this.#touch();

    try {
      const localTokens = (await Promise.all(
        this.#configStore.list().slice(-10).map(async (config) => this.#resolveToken(config.tokenRef)),
      )).filter(Boolean);
      const login = await this.#api.beginLogin({
        localTokens,
        signal: record.controller.signal,
      });
      this.#assertAttemptActive(record);
      record.qrcode = login.qrcode;
      record.verificationUrl = login.qrcodeUrl;
      record.state = 'pending';
      record.expiresAt = Date.now() + QR_TTL_MS;
      this.#touch();
      record.task = this.#runProvisioning(record);
      return publicAttempt(record);
    } catch (error) {
      if (record.controller.signal.aborted) {
        record.state = 'cancelled';
        record.error = safeAccountError('cancelled', '扫码绑定已取消。');
      } else {
        record.state = 'failed';
        record.error = safeAccountError(
          error instanceof WeixinApiError ? error.code : 'qr-start-failed',
          error instanceof WeixinApiError ? error.message : '无法生成微信二维码，请稍后重试。',
        );
      }
      if (this.#activeAttemptId === record.id) this.#activeAttemptId = null;
      this.#touch();
      throw error;
    }
  }

  registrationStatus(attemptId) {
    return publicAttempt(this.#attempts.get(attemptId));
  }

  async submitVerification(attemptId, verifyCode) {
    const record = this.#attempts.get(attemptId);
    if (!record || record.state !== 'needs_verification') {
      throw new Error('The provisioning attempt is not waiting for a verification code');
    }
    const code = cleanString(verifyCode);
    if (!code || !/^\d{4,8}$/.test(code)) {
      throw new TypeError('Verification code must contain 4 to 8 digits');
    }
    record.pendingVerifyCode = code;
    record.state = 'scanned';
    record.verifyResolve?.();
    record.verifyResolve = null;
    this.#touch();
    return publicAttempt(record);
  }

  async cancelProvisioning(attemptId) {
    const record = this.#attempts.get(attemptId);
    if (!record) return null;
    if (!TERMINAL_ATTEMPT_STATES.has(record.state)) {
      record.controller.abort();
      record.verifyResolve?.();
      record.verifyResolve = null;
      await record.task?.catch(() => undefined);
      if (!TERMINAL_ATTEMPT_STATES.has(record.state)) record.state = 'cancelled';
      record.error ??= safeAccountError('cancelled', '扫码绑定已取消。');
    }
    if (this.#activeAttemptId === record.id) this.#activeAttemptId = null;
    this.#touch();
    return publicAttempt(record);
  }

  async reconnectBot(botId) {
    const config = this.#configStore.get(botId);
    if (!config) throw new Error('Unknown Weixin account');
    await this.#withBotTransition(botId, async () => {
      const token = await this.#resolveToken(config.tokenRef);
      if (!token) throw new Error('The Weixin token is missing');
      try {
        await this.#startRuntime(config, token);
        this.#errors.delete(botId);
      } catch (error) {
        this.#errors.set(botId, safeAccountError('connection-failed', '微信连接仍未就绪，请稍后重试。'));
        throw error;
      } finally {
        this.#touch();
      }
    });
    return this.status();
  }

  async deleteBot(botId) {
    const config = this.#configStore.get(botId);
    if (!config) throw new Error('Unknown Weixin account');
    await this.#withBotTransition(botId, async () => {
      const previousToken = await this.#credentials.resolve(config.tokenRef).catch(() => undefined);
      await this.#stopRuntime(botId);
      try {
        await this.#credentials.unset(config.tokenRef);
        await this.#configStore.remove(botId);
      } catch (error) {
        if (previousToken?.value) {
          await this.#credentials.set(config.tokenRef, previousToken.value).catch(() => undefined);
          await this.#startRuntime(config, previousToken.value).catch(() => undefined);
        }
        throw new Error('Unable to remove the Weixin account safely.', { cause: error });
      }
      try {
        await this.#deleteState({ botId, config });
      } catch (error) {
        this.#logger.warn?.(`[dsh-weixin] account ${botId} state cleanup failed:`, error);
      }
      this.#errors.delete(botId);
      this.#touch();
    });
    return this.status();
  }

  status() {
    const accounts = this.#configStore.list().map((config) => {
      const runtimeStatus = this.#runtimes.get(config.botId)?.status ?? null;
      const connected = runtimeStatus?.ready === true
        && runtimeStatus.weixinConnectionState === 'connected'
        && runtimeStatus.harnessReachable === true;
      const state = connected
        ? 'connected'
        : runtimeStatus?.weixinConnectionState === 'connecting'
          ? 'connecting'
          : this.#errors.has(config.botId) || runtimeStatus?.weixinConnectionState === 'failed'
            ? 'error'
            : 'offline';
      const error = this.#errors.get(config.botId) ?? (state === 'error'
        ? safeAccountError('connection-failed', '微信连接未就绪，插件会自动重试。')
        : null);
      return {
        botId: config.botId,
        state,
        connected,
        configured: true,
        bot: {
          name: '微信机器人',
          accountIdMasked: maskWeixinAccountId(config.accountId),
        },
        health: {
          status: connected ? 'healthy' : state === 'error' ? 'error' : 'offline',
          summary: connected
            ? '微信消息长轮询运行正常'
            : state === 'error'
              ? '微信连接未就绪，插件会自动重试'
              : '微信连接当前离线',
          lastCheckedAt: runtimeStatus?.lastCheckedAt ?? null,
        },
        stats: {
          messagesReceived: runtimeStatus?.messagesReceived ?? 0,
          messagesReplied: runtimeStatus?.messagesReplied ?? 0,
        },
        error: error ? structuredClone(error) : null,
      };
    });
    const connectedCount = accounts.filter((account) => account.connected).length;
    const active = this.#activeAttemptId ? this.#attempts.get(this.#activeAttemptId) : null;
    return {
      schemaVersion: 1,
      revision: this.#revision,
      state: active && ACTIVE_ATTEMPT_STATES.has(active.state)
        ? 'provisioning'
        : accounts.length === 0
          ? 'disconnected'
          : connectedCount === accounts.length
            ? 'connected'
            : connectedCount > 0
              ? 'degraded'
              : 'offline',
      bots: accounts,
      totals: { configured: accounts.length, connected: connectedCount },
      ...(active && ACTIVE_ATTEMPT_STATES.has(active.state)
        ? { provisioning: publicAttempt(active) }
        : {}),
    };
  }

  async close() {
    if (this.#closed) return;
    this.#closed = true;
    if (this.#activeAttemptId) await this.cancelProvisioning(this.#activeAttemptId);
    await Promise.allSettled([...this.#runtimes.keys()].map((botId) => this.#stopRuntime(botId)));
  }

  async #runProvisioning(record) {
    try {
      while (!record.controller.signal.aborted && Date.now() < record.expiresAt) {
        if (record.state === 'needs_verification' && !record.pendingVerifyCode) {
          await new Promise((resolve) => {
            record.verifyResolve = resolve;
            if (record.controller.signal.aborted) resolve();
          });
          record.verifyResolve = null;
          this.#assertAttemptActive(record);
        }

        const response = await this.#api.pollLogin({
          qrcode: record.qrcode,
          baseUrl: record.currentBaseUrl,
          verifyCode: record.pendingVerifyCode,
          signal: record.controller.signal,
        });
        this.#assertAttemptActive(record);
        if (response.status === 'wait') {
          record.state = 'pending';
        } else if (response.status === 'scaned') {
          record.pendingVerifyCode = null;
          record.state = 'scanned';
        } else if (response.status === 'need_verifycode') {
          record.pendingVerifyCode = null;
          record.state = 'needs_verification';
        } else if (response.status === 'verify_code_blocked') {
          record.state = 'failed';
          record.error = safeAccountError('verification-blocked', '配对码多次错误，请重新生成二维码。');
          break;
        } else if (response.status === 'expired') {
          record.state = 'expired';
          record.error = safeAccountError('expired', '二维码已过期，请重新生成。');
          break;
        } else if (response.status === 'scaned_but_redirect') {
          record.currentBaseUrl = apiBaseFromServer(response.redirect_host, record.currentBaseUrl);
          record.state = 'scanned';
        } else if (response.status === 'binded_redirect') {
          const existing = this.#configStore.list().find(
            (config) => this.#runtimes.get(config.botId)?.status?.ready === true,
          ) ?? this.#configStore.list()[0];
          if (!existing) {
            record.state = 'failed';
            record.error = safeAccountError('already-bound', '该微信账号已绑定，但本机没有可恢复的凭据。');
          } else {
            record.state = 'connected';
            record.botId = existing.botId;
            record.alreadyConnected = true;
          }
          break;
        } else if (response.status === 'confirmed') {
          const token = cleanString(response.bot_token);
          const accountId = cleanString(response.ilink_bot_id);
          const ownerUserId = cleanString(response.ilink_user_id);
          if (!token || !accountId || !ownerUserId) {
            throw new WeixinApiError('incomplete-login', '微信授权成功，但返回的账号凭据不完整。');
          }
          record.state = 'connecting';
          this.#touch();
          const baseUrl = apiBaseFromServer(response.baseurl, record.currentBaseUrl);
          record.botId = await this.#activateAccount(record, {
            token,
            accountId,
            ownerUserId,
            baseUrl,
          });
          record.state = 'connected';
          record.error = null;
          break;
        }
        this.#touch();
      }
      if (!record.controller.signal.aborted && Date.now() >= record.expiresAt
        && !TERMINAL_ATTEMPT_STATES.has(record.state)) {
        record.state = 'expired';
        record.error = safeAccountError('expired', '二维码已过期，请重新生成。');
      }
    } catch (error) {
      if (record.controller.signal.aborted || error?.name === 'AbortError') {
        record.state = 'cancelled';
        record.error = safeAccountError('cancelled', '扫码绑定已取消。');
      } else {
        record.state = 'failed';
        record.error = safeAccountError(
          error instanceof WeixinApiError ? error.code : 'activation-failed',
          error instanceof WeixinApiError
            ? error.message
            : '微信已授权，但无法保存凭据或启动消息连接。',
        );
        this.#logger.error?.('[dsh-weixin] provisioning failed:', error);
      }
    } finally {
      record.pendingVerifyCode = null;
      record.verifyResolve?.();
      record.verifyResolve = null;
      if (this.#activeAttemptId === record.id) this.#activeAttemptId = null;
      this.#touch();
      this.#pruneAttempts();
    }
  }

  async #activateAccount(record, { token, accountId, ownerUserId, baseUrl }) {
    const identity = deriveWeixinBotIdentity(accountId);
    const previousConfig = this.#configStore.getByAccountId(accountId);
    const config = {
      botId: identity.botId,
      accountId,
      tokenRef: identity.tokenRef,
      ownerUserId,
      baseUrl,
      createdAt: previousConfig?.createdAt ?? new Date().toISOString(),
      connectedAt: new Date().toISOString(),
    };
    const previousToken = await this.#credentials.resolve(identity.tokenRef).catch(() => undefined);

    return this.#withBotTransition(identity.botId, async () => {
      await this.#credentials.set(identity.tokenRef, token);
      try {
        this.#assertAttemptActive(record);
        await this.#configStore.save(config);
        this.#assertAttemptActive(record);
        await this.#startRuntime(config, token);
        this.#assertAttemptActive(record);
        this.#errors.delete(identity.botId);
        this.#touch();
        return identity.botId;
      } catch (error) {
        await this.#stopRuntime(identity.botId);
        if (previousConfig) await this.#configStore.save(previousConfig).catch(() => undefined);
        else if (this.#configStore.get(identity.botId)) {
          await this.#configStore.remove(identity.botId).catch(() => undefined);
        }
        await this.#restoreCredential(identity.tokenRef, previousToken);
        if (previousConfig && previousToken?.value) {
          await this.#startRuntime(previousConfig, previousToken.value).catch(() => undefined);
        }
        throw error;
      }
    });
  }

  async #startRuntime(config, token) {
    await this.#stopRuntime(config.botId);
    const runtime = await this.#createRuntime({ botId: config.botId, config, token });
    if (!runtime || typeof runtime.start !== 'function' || typeof runtime.stop !== 'function') {
      throw new TypeError('createRuntime returned an invalid Weixin runtime');
    }
    try {
      await runtime.start();
      this.#runtimes.set(config.botId, runtime);
    } catch (error) {
      await runtime.stop().catch(() => undefined);
      throw error;
    }
  }

  async #stopRuntime(botId) {
    const runtime = this.#runtimes.get(botId);
    this.#runtimes.delete(botId);
    await runtime?.stop().catch((error) => {
      this.#logger.warn?.(`[dsh-weixin] account ${botId} failed to stop cleanly:`, error);
    });
  }

  async #resolveToken(ref) {
    const result = await this.#credentials.resolve(ref).catch(() => undefined);
    return cleanString(result?.value);
  }

  async #restoreCredential(ref, previous) {
    try {
      if (previous?.value) await this.#credentials.set(ref, previous.value);
      else await this.#credentials.unset(ref);
    } catch (error) {
      this.#logger.error?.(`[dsh-weixin] failed to restore credential ${ref}:`, error);
    }
  }

  #assertAttemptActive(record) {
    if (record.controller.signal.aborted || this.#activeAttemptId !== record.id) throw abortError();
  }

  #withBotTransition(botId, operation) {
    const previous = this.#transitions.get(botId) ?? Promise.resolve();
    const current = previous.catch(() => undefined).then(operation);
    const settled = current.finally(() => {
      if (this.#transitions.get(botId) === settled) this.#transitions.delete(botId);
    });
    this.#transitions.set(botId, settled);
    return settled;
  }

  #pruneAttempts() {
    for (const [id, record] of this.#attempts) {
      if (id !== this.#activeAttemptId && TERMINAL_ATTEMPT_STATES.has(record.state)
        && this.#attempts.size > 16) {
        this.#attempts.delete(id);
      }
    }
  }

  #touch() {
    this.#revision += 1;
  }
}
