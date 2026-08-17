import { FeishuHarnessBridge } from './bridge.mjs';
import { VerifiedFeishuChannel } from './feishu-channel.mjs';

export function createBridgeStatus({ allowedSenderCount = 1 } = {}) {
  return {
    startedAt: null,
    ready: false,
    feishuLongConnectionState: 'idle',
    harnessReachable: false,
    messagesReceived: 0,
    messagesReplied: 0,
    messagesRejected: 0,
    reactionsAdded: 0,
    reactionsRemoved: 0,
    reactionErrors: 0,
    streamResponses: 0,
    streamUpdates: 0,
    streamFallbacks: 0,
    streamErrors: 0,
    lastMessageAt: null,
    lastReplyAt: null,
    lastRejectedAt: null,
    lastError: null,
    agentPreset: 'standard',
    authorizationMode: 'sender-open-id-allowlist',
    allowedSenderCount,
  };
}

/**
 * Owns one live Feishu long connection and the already-tested bridge stack.
 * The class intentionally receives the SDK and Harness dependencies so the
 * plugin can run it in-process while tests exercise the lifecycle without a
 * real Feishu tenant.
 */
export class FeishuRuntime {
  #lark;
  #appId;
  #appSecret;
  #domain;
  #ownerOpenIds;
  #harness;
  #state;
  #replyTimeoutMs;
  #connectTimeoutMs;
  #logger;
  #client = null;
  #bridge = null;
  #wsClient = null;
  #starting = null;
  #status;

  constructor({
    lark,
    appId,
    appSecret,
    domain = 'feishu',
    ownerOpenId,
    ownerOpenIds,
    harness,
    state,
    replyTimeoutMs = 600000,
    connectTimeoutMs = 15000,
    logger = console,
  }) {
    if (!lark) throw new Error('FeishuRuntime requires the Feishu SDK');
    if (!appId || !appSecret) throw new Error('FeishuRuntime requires app credentials');
    const allowedOwners = Array.isArray(ownerOpenIds) ? ownerOpenIds : [ownerOpenId];
    const normalizedOwners = [...new Set(allowedOwners.filter((value) => typeof value === 'string' && value))];
    if (normalizedOwners.length === 0) throw new Error('FeishuRuntime requires at least one owner open_id');
    if (!harness) throw new Error('FeishuRuntime requires a Harness client');
    if (!state) throw new Error('FeishuRuntime requires a state store');

    this.#lark = lark;
    this.#appId = appId;
    this.#appSecret = appSecret;
    this.#domain = domain;
    this.#ownerOpenIds = normalizedOwners;
    this.#harness = harness;
    this.#state = state;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#connectTimeoutMs = connectTimeoutMs;
    this.#logger = logger;
    this.#status = createBridgeStatus({ allowedSenderCount: normalizedOwners.length });
  }

  get status() {
    return structuredClone(this.#status);
  }

  async start() {
    if (this.#wsClient && this.#status.ready) return this.status;
    if (this.#starting) return this.#starting;

    this.#starting = this.#start().finally(() => {
      this.#starting = null;
    });
    return this.#starting;
  }

  async #start() {
    this.#status.startedAt = new Date().toISOString();
    this.#status.feishuLongConnectionState = 'connecting';
    this.#status.lastError = null;

    try {
      await this.#harness.ensureRunning();
      this.#status.harnessReachable = true;

      const sdkDomain = this.#domain === 'lark'
        ? this.#lark.Domain.Lark
        : this.#lark.Domain.Feishu;
      const larkConfig = {
        appId: this.#appId,
        appSecret: this.#appSecret,
        domain: sdkDomain,
      };
      this.#client = new this.#lark.Client(larkConfig);
      const channel = new VerifiedFeishuChannel({
        client: this.#client,
        initialText: '已连接 DeepSeek Harness，正在思考…',
      });
      this.#bridge = new FeishuHarnessBridge({
        client: this.#client,
        channel,
        harness: this.#harness,
        state: this.#state,
        status: this.#status,
        allowedSenderOpenIds: new Set(this.#ownerOpenIds),
        replyTimeoutMs: this.#replyTimeoutMs,
      });

      const dispatcher = new this.#lark.EventDispatcher({}).register({
        'im.message.receive_v1': (event) => {
          this.#bridge.accept(event);
          return {};
        },
        'im.message.reaction.created_v1': () => ({}),
        'im.message.reaction.deleted_v1': () => ({}),
      });

      let settleReady;
      let settleError;
      const ready = new Promise((resolve, reject) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          reject(new Error(`Feishu WebSocket handshake timed out after ${this.#connectTimeoutMs}ms`));
        }, this.#connectTimeoutMs);
        settleReady = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve();
        };
        settleError = (error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          reject(error);
        };
      });

      this.#wsClient = new this.#lark.WSClient({
        ...larkConfig,
        loggerLevel: this.#lark.LoggerLevel.info,
        handshakeTimeoutMs: 15000,
        onReady: () => {
          this.#status.feishuLongConnectionState = 'connected';
          this.#status.ready = true;
          this.#status.lastError = null;
          settleReady();
        },
        onError: (error) => {
          this.#status.feishuLongConnectionState = 'failed';
          this.#status.ready = false;
          this.#status.lastError = error?.message ?? String(error);
          this.#logger.error('[dsh-feishu] Feishu long connection failed:', this.#status.lastError);
          settleError(error);
        },
        onReconnecting: () => {
          this.#status.feishuLongConnectionState = 'reconnecting';
          this.#status.ready = false;
        },
        onReconnected: () => {
          this.#status.feishuLongConnectionState = 'connected';
          this.#status.ready = true;
          this.#status.lastError = null;
        },
      });
      await this.#wsClient.start({ eventDispatcher: dispatcher }).catch((error) => {
        settleError(error);
      });
      await ready;
      return this.status;
    } catch (error) {
      this.#status.ready = false;
      this.#status.feishuLongConnectionState = 'failed';
      this.#status.lastError = error?.message ?? String(error);
      await this.stop({ preserveError: true });
      throw error;
    }
  }

  async stop({ preserveError = false } = {}) {
    const error = preserveError ? this.#status.lastError : null;
    this.#status.ready = false;
    if (this.#wsClient) {
      this.#wsClient.close({ force: true });
      this.#wsClient = null;
    }
    if (this.#bridge) {
      await this.#bridge.waitForIdle();
      this.#bridge = null;
    }
    this.#client = null;
    this.#status.feishuLongConnectionState = preserveError ? 'failed' : 'idle';
    this.#status.lastError = error;
    return this.status;
  }
}
