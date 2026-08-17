import { WeixinApiError } from './weixin-api.mjs';
import { createWeixinBridgeStatus, WeixinHarnessBridge } from './weixin-bridge.mjs';

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      return;
    }
    const finish = () => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    };
    const timer = setTimeout(finish, ms);
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export function createWeixinRuntimeStatus() {
  return {
    startedAt: null,
    ready: false,
    weixinConnectionState: 'idle',
    harnessReachable: false,
    lastCheckedAt: null,
    lastError: null,
    ...createWeixinBridgeStatus(),
  };
}

export class WeixinRuntime {
  #api;
  #config;
  #token;
  #harness;
  #state;
  #logger;
  #replyTimeoutMs;
  #maxMessageChars;
  #status = createWeixinRuntimeStatus();
  #bridge = null;
  #abortController = null;
  #monitor = null;
  #starting = null;

  constructor({
    api,
    config,
    token,
    harness,
    state,
    logger = console,
    replyTimeoutMs = 600_000,
    maxMessageChars = 4_000,
  }) {
    if (!api || !config || !token || !harness || !state) {
      throw new TypeError('WeixinRuntime requires API, account, token, Harness, and state');
    }
    this.#api = api;
    this.#config = config;
    this.#token = token;
    this.#harness = harness;
    this.#state = state;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#maxMessageChars = maxMessageChars;
  }

  get status() {
    return structuredClone(this.#status);
  }

  async start() {
    if (this.#status.ready && this.#monitor) return this.status;
    if (this.#starting) return this.#starting;
    this.#starting = this.#start().finally(() => {
      this.#starting = null;
    });
    return this.#starting;
  }

  async #start() {
    await this.stop();
    this.#status.startedAt = new Date().toISOString();
    this.#status.weixinConnectionState = 'connecting';
    this.#status.lastError = null;
    try {
      await this.#harness.ensureRunning();
      this.#status.harnessReachable = true;
      await this.#api.notifyStart({
        baseUrl: this.#config.baseUrl,
        token: this.#token,
      });
      this.#bridge = new WeixinHarnessBridge({
        api: this.#api,
        baseUrl: this.#config.baseUrl,
        token: this.#token,
        ownerUserId: this.#config.ownerUserId,
        harness: this.#harness,
        state: this.#state,
        status: this.#status,
        logger: this.#logger,
        replyTimeoutMs: this.#replyTimeoutMs,
        maxMessageChars: this.#maxMessageChars,
      });
      this.#abortController = new AbortController();
      this.#status.ready = true;
      this.#status.weixinConnectionState = 'connected';
      this.#status.lastCheckedAt = Date.now();
      const signal = this.#abortController.signal;
      this.#monitor = this.#runMonitor(signal).catch((error) => {
        if (signal.aborted) return;
        this.#status.ready = false;
        this.#status.weixinConnectionState = 'failed';
        this.#status.lastError = error?.message ?? String(error);
        this.#logger.error?.(`[dsh-weixin] account ${this.#config.botId} monitor stopped:`, error);
      });
      return this.status;
    } catch (error) {
      this.#status.ready = false;
      this.#status.weixinConnectionState = 'failed';
      this.#status.lastError = error?.message ?? String(error);
      throw error;
    }
  }

  async #runMonitor(signal) {
    let consecutiveFailures = 0;
    while (!signal.aborted) {
      try {
        const response = await this.#api.getUpdates({
          baseUrl: this.#config.baseUrl,
          token: this.#token,
          getUpdatesBuf: this.#state.getUpdatesBuf(),
          signal,
        });
        if (signal.aborted) return;
        const rejected = (response?.ret !== undefined && response.ret !== 0)
          || (response?.errcode !== undefined && response.errcode !== 0);
        if (rejected) {
          const code = response.errcode ?? response.ret;
          throw new WeixinApiError(
            code === -14 ? 'stale-token' : 'updates-rejected',
            code === -14 ? '微信登录凭据已失效，请移除账号后重新扫码。' : '微信消息同步请求被拒绝。',
          );
        }
        consecutiveFailures = 0;
        this.#status.ready = true;
        this.#status.weixinConnectionState = 'connected';
        this.#status.lastCheckedAt = Date.now();
        this.#status.lastError = null;

        for (const message of response?.msgs ?? []) {
          await this.#bridge.accept(message);
        }
        if (typeof response?.get_updates_buf === 'string' && response.get_updates_buf) {
          await this.#state.setGetUpdatesBuf(response.get_updates_buf);
        }
      } catch (error) {
        if (signal.aborted) return;
        consecutiveFailures += 1;
        this.#status.lastError = error?.message ?? String(error);
        this.#logger.warn?.(
          `[dsh-weixin] account ${this.#config.botId} poll failed (${consecutiveFailures}/3):`,
          error,
        );
        if (error instanceof WeixinApiError && error.code === 'stale-token') throw error;
        if (consecutiveFailures >= 3) throw error;
        await delay(Math.min(2_000 * (2 ** (consecutiveFailures - 1)), 10_000), signal);
      }
    }
  }

  async stop() {
    const monitor = this.#monitor;
    const bridge = this.#bridge;
    const wasStarted = Boolean(this.#abortController || monitor || this.#status.ready);
    this.#abortController?.abort();
    this.#abortController = null;
    this.#monitor = null;
    await monitor?.catch(() => undefined);
    await bridge?.waitForIdle();
    this.#bridge = null;
    if (wasStarted) {
      try {
        await this.#api.notifyStop({
          baseUrl: this.#config.baseUrl,
          token: this.#token,
          signal: AbortSignal.timeout(10_000),
        });
      } catch (error) {
        this.#logger.warn?.(`[dsh-weixin] account ${this.#config.botId} stop notification failed:`, error);
      }
    }
    this.#status.ready = false;
    this.#status.weixinConnectionState = 'idle';
    return this.status;
  }
}
