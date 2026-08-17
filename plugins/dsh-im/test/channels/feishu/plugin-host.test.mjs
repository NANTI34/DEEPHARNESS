import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  FEISHU_APP_ID_REF,
  FEISHU_APP_SECRET_REF,
  FEISHU_ENDPOINTS,
  FEISHU_MULTI_ENDPOINTS,
  apply,
  createDshCredentialStore,
  createProductionController,
  createProvisioningBackedController,
} from '../../../plugin-src/host/channels/feishu/index.mjs';

const signal = () => new AbortController().signal;

function status(overrides = {}) {
  return {
    phase: 'unconfigured',
    connected: false,
    configured: false,
    bot: null,
    registration: { state: 'idle', attempt: 0, updatedAt: 100 },
    connection: {
      ready: false,
      feishuLongConnectionState: 'idle',
      harnessReachable: false,
    },
    error: null,
    ...overrides,
  };
}

async function rpcFixture(controller) {
  let registration;
  let disposed = false;
  const ctx = {
    connection: {
      rpc: {
        handle(channel, handler, options) {
          registration = { channel, handler, options };
          return async () => { disposed = true; };
        },
      },
    },
  };
  const dispose = await apply(ctx, { controller });
  return {
    dispose,
    get registration() { return registration; },
    get disposed() { return disposed; },
  };
}

test('Host plugin registers the real rc.6 Connection RPC shape as loopback-only', async () => {
  const controller = {
    status: async () => status(),
    startRegistration: async () => status(),
    cancelRegistration: async () => status(),
    disconnect: async () => status(),
  };
  const fx = await rpcFixture(controller);

  assert.equal(fx.registration.channel, '/feishu');
  assert.deepEqual(fx.registration.options, { authority: 'loopback' });
  const result = await fx.registration.handler(FEISHU_ENDPOINTS.status, {}, signal());
  assert.equal(result.ok, true);
  assert.equal(result.value.state, 'disconnected');
  assert.equal(result.value.connected, false);
  assert.equal(result.value.configured, false);
  assert.equal(result.value.bot.name, '飞书机器人');
  assert.equal(result.value.health.status, 'offline');
  assert.equal('registration' in result.value, false);

  await fx.dispose();
  assert.equal(fx.disposed, true);
});

test('Host exposes configured offline as a redacted capability fact', async () => {
  const secret = 'offline-secret-must-stay-host-only';
  const controller = {
    status: async () => status({
      phase: 'disconnected',
      configured: true,
      bot: { name: '北汇星河助手', appSecret: secret },
      credentials: { client_secret: secret },
      connection: {
        ready: false,
        feishuLongConnectionState: 'failed',
        harnessReachable: true,
        token: secret,
      },
    }),
    startRegistration: async () => status(),
    cancelRegistration: async () => status(),
    reconnect: async () => status({ configured: true }),
    disconnect: async () => status(),
  };
  const fx = await rpcFixture(controller);
  const result = await fx.registration.handler(FEISHU_ENDPOINTS.status, {}, signal());

  assert.equal(result.ok, true);
  assert.equal(result.value.state, 'disconnected');
  assert.equal(result.value.connected, false);
  assert.equal(result.value.configured, true);
  assert.equal(result.value.health.status, 'offline');
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
  assert.equal('credentials' in result.value, false);
});

test('RPC dispatch matches every endpoint in client/api.js', async () => {
  const calls = [];
  let current = status({
    phase: 'registering',
    registration: {
      state: 'qr_ready',
      attempt: 7,
      updatedAt: 100,
      qrCodeUrl: 'https://accounts.feishu.cn/device',
      expiresAt: Date.now() + 60_000,
    },
  });
  const controller = {
    status: async () => current,
    startRegistration: async () => { calls.push('begin'); return current; },
    cancelRegistration: async () => {
      calls.push('cancel');
      current = status({ registration: { state: 'cancelled', attempt: 7, updatedAt: 200 } });
      return current;
    },
    reconnect: async () => { calls.push('test'); return current; },
    bindCredentials: async ({ appId, appSecret }) => {
      calls.push(`bind:${appId}:${appSecret}`);
      return current;
    },
    disconnect: async () => { calls.push('disconnect'); return status(); },
  };
  const fx = await rpcFixture(controller);

  const begun = await fx.registration.handler(
    FEISHU_ENDPOINTS.beginProvisioning,
    { locale: 'zh-CN' },
    signal(),
  );
  assert.equal(begun.ok, true);
  assert.equal(begun.value.attemptId, '7');
  assert.match(begun.value.qrCodeDataUrl, /^data:image\/png;base64,/);

  const polled = await fx.registration.handler(
    FEISHU_ENDPOINTS.pollProvisioning,
    { attemptId: '7' },
    signal(),
  );
  assert.equal(polled.ok, true);
  assert.equal(polled.value.status, 'pending');

  const tested = await fx.registration.handler(FEISHU_ENDPOINTS.testConnection, {}, signal());
  assert.equal(tested.ok, true);

  const bound = await fx.registration.handler(
    FEISHU_ENDPOINTS.bindCredentials,
    { appId: 'cli_manual', appSecret: 'manual-private-secret' },
    signal(),
  );
  assert.equal(bound.ok, true);
  assert.doesNotMatch(JSON.stringify(bound), /manual-private-secret|appSecret/);

  const cancelled = await fx.registration.handler(
    FEISHU_ENDPOINTS.cancelProvisioning,
    { attemptId: '7' },
    signal(),
  );
  assert.equal(cancelled.ok, true);
  assert.equal(cancelled.value.status, 'failed');

  const disconnected = await fx.registration.handler(
    FEISHU_ENDPOINTS.disconnect,
    { removeCredentials: true },
    signal(),
  );
  assert.equal(disconnected.ok, true);
  assert.deepEqual(calls, [
    'begin', 'test', 'bind:cli_manual:manual-private-secret', 'cancel', 'disconnect',
  ]);

  const attemptedSecret = await fx.registration.handler(
    FEISHU_ENDPOINTS.beginProvisioning,
    { appSecret: 'must-not-cross-browser-boundary' },
    signal(),
  );
  assert.equal(attemptedSecret.ok, false);
  assert.equal(attemptedSecret.error.code, 'bad-request');
  assert.doesNotMatch(JSON.stringify(attemptedSecret), /must-not-cross-browser-boundary/);
});

test('connection.test does not restart an already healthy long connection', async () => {
  let reconnects = 0;
  const healthy = status({
    phase: 'connected',
    connected: true,
    configured: true,
    connection: {
      ready: true,
      feishuLongConnectionState: 'connected',
      harnessReachable: true,
    },
  });
  const controller = {
    status: async () => healthy,
    startRegistration: async () => healthy,
    cancelRegistration: async () => healthy,
    reconnect: async () => { reconnects += 1; return healthy; },
    disconnect: async () => status(),
  };
  const fx = await rpcFixture(controller);

  const result = await fx.registration.handler(FEISHU_ENDPOINTS.testConnection, {}, signal());

  assert.equal(result.ok, true);
  assert.equal(result.value.connected, true);
  assert.equal(reconnects, 0);
});

test('provision.begin waits through starting until onQRCodeReady is observable', async () => {
  let current = status({
    phase: 'registering',
    registration: { state: 'starting', attempt: 3, updatedAt: 100 },
  });
  const controller = {
    status: async () => current,
    startRegistration: async () => {
      setTimeout(() => {
        current = status({
          phase: 'registering',
          registration: {
            state: 'qr_ready',
            attempt: 3,
            updatedAt: 110,
            qrCodeUrl: 'https://accounts.feishu.cn/async-qr',
            expiresAt: Date.now() + 60_000,
          },
        });
      }, 5);
      return current;
    },
    cancelRegistration: async () => status(),
    disconnect: async () => status(),
  };
  const fx = await rpcFixture(controller);
  const begun = await fx.registration.handler(
    FEISHU_ENDPOINTS.beginProvisioning,
    { locale: 'zh-CN' },
    signal(),
  );

  assert.equal(begun.ok, true);
  assert.equal(begun.value.attemptId, '3');
  assert.equal(begun.value.verificationUrl, 'https://accounts.feishu.cn/async-qr');
  assert.match(begun.value.qrCodeDataUrl, /^data:image\/png;base64,/);
});

test('cancelling during credential activation tears down the eventual runtime', async () => {
  const calls = [];
  const current = status({
    phase: 'connecting',
    configured: true,
    registration: { state: 'saving', attempt: 11, updatedAt: 100 },
  });
  const controller = {
    status: async () => current,
    startRegistration: async () => current,
    cancelRegistration: async () => { calls.push('cancel-only'); return current; },
    disconnect: async () => { calls.push('disconnect'); return status(); },
  };
  const fx = await rpcFixture(controller);
  const result = await fx.registration.handler(
    FEISHU_ENDPOINTS.cancelProvisioning,
    { attemptId: '11' },
    signal(),
  );

  assert.equal(result.ok, true);
  assert.deepEqual(calls, ['disconnect']);
});

test('status returns qrCodeDataUrl while dropping all credential-shaped fields', async () => {
  const secret = 'sdk-super-secret-value';
  const controller = {
    status: async () => status({
      phase: 'registering',
      appSecret: secret,
      credentials: { client_secret: secret },
      registration: {
        state: 'qr_ready',
        attempt: 1,
        qrCodeUrl: 'https://accounts.feishu.cn/device',
        expiresAt: Date.now() + 60_000,
        client_secret: secret,
      },
      connection: {
        ready: true,
        connected: false,
        state: 'connecting',
        token: secret,
      },
    }),
    startRegistration: async () => status(),
    cancelRegistration: async () => status(),
    disconnect: async () => status(),
  };
  const fx = await rpcFixture(controller);
  const result = await fx.registration.handler(FEISHU_ENDPOINTS.status, {}, signal());

  assert.equal(result.ok, true);
  assert.equal(result.value.state, 'provisioning');
  assert.equal(result.value.provisioning.verificationUrl, 'https://accounts.feishu.cn/device');
  assert.match(result.value.provisioning.qrCodeDataUrl, /^data:image\/png;base64,/);
  assert.doesNotMatch(JSON.stringify(result), /sdk-super-secret-value|client_secret|credentials|token/);
});

test('polling a new QR stays pending when another bot is already connected', async () => {
  const current = status({
    schemaVersion: 2,
    phase: 'registering',
    connected: false,
    configured: true,
    registration: {
      state: 'qr_ready',
      attempt: 'reg_new_bot',
      qrCodeUrl: 'https://accounts.feishu.cn/new-bot',
      expiresAt: Date.now() + 60_000,
    },
    bots: [{
      botId: 'bot_existing',
      phase: 'connected',
      connected: true,
      configured: true,
      bot: { name: '现有机器人', appIdMasked: 'cli_old••••1234' },
      connection: {
        ready: true,
        feishuLongConnectionState: 'connected',
        harnessReachable: true,
      },
    }],
  });
  const controller = {
    status: async () => current,
    registrationStatus: async () => current,
    startRegistration: async () => current,
    cancelRegistration: async () => current,
    disconnect: async () => status(),
  };
  const fx = await rpcFixture(controller);
  const result = await fx.registration.handler(
    FEISHU_ENDPOINTS.pollProvisioning,
    { attemptId: 'reg_new_bot' },
    signal(),
  );

  assert.equal(result.ok, true);
  assert.equal(result.value.status, 'pending');
  assert.equal('botId' in result.value, false);
  assert.equal('connection' in result.value, false);
});

test('multi-bot RPC operations require a botId and never expose host-only fields', async () => {
  const calls = [];
  const multi = status({
    schemaVersion: 2,
    revision: 9,
    configured: true,
    bots: [{
      botId: 'bot_safe',
      phase: 'connected',
      connected: true,
      configured: true,
      secretRef: 'DSH_FEISHU_APP_SECRET_PRIVATE',
      ownerOpenIds: ['ou_private'],
      bot: {
        name: '安全机器人',
        appId: 'cli_raw_private',
        appIdMasked: 'cli_safe••••1234',
        domain: 'feishu',
      },
      connection: {
        ready: true,
        feishuLongConnectionState: 'connected',
        harnessReachable: true,
        token: 'private-token',
      },
    }],
  });
  const controller = {
    status: async () => multi,
    startRegistration: async () => multi,
    cancelRegistration: async () => multi,
    disconnect: async () => status(),
    reconnectBot: async (botId) => { calls.push(['reconnect', botId]); return multi; },
    disconnectBot: async (botId) => { calls.push(['disconnect', botId]); return multi; },
    deleteBot: async (botId) => { calls.push(['delete', botId]); return status({ schemaVersion: 2, bots: [] }); },
  };
  const fx = await rpcFixture(controller);

  for (const [endpoint, payload] of [
    [FEISHU_MULTI_ENDPOINTS.reconnectBot, { botId: 'bot_safe' }],
    [FEISHU_MULTI_ENDPOINTS.disconnectBot, { botId: 'bot_safe' }],
    [FEISHU_MULTI_ENDPOINTS.deleteBot, { botId: 'bot_safe', confirm: true }],
  ]) {
    const result = await fx.registration.handler(endpoint, payload, signal());
    assert.equal(result.ok, true);
    assert.doesNotMatch(JSON.stringify(result), /DSH_FEISHU_APP_SECRET|ou_private|cli_raw_private|private-token/);
  }
  assert.deepEqual(calls, [
    ['reconnect', 'bot_safe'],
    ['disconnect', 'bot_safe'],
    ['delete', 'bot_safe'],
  ]);

  const invalid = await fx.registration.handler(
    FEISHU_MULTI_ENDPOINTS.deleteBot,
    { botId: '../private', confirm: true },
    signal(),
  );
  assert.equal(invalid.ok, false);
  assert.equal(invalid.error.code, 'bad-request');
  assert.doesNotMatch(JSON.stringify(invalid), /\.\.\/private/);
});

test('dependency failures and AbortSignal use valid RpcResult error branches', async () => {
  const secret = 'should-never-be-reflected';
  const controller = {
    status: async () => { throw new Error(`SDK failed with ${secret}`); },
    startRegistration: async () => status(),
    cancelRegistration: async () => status(),
    disconnect: async () => status(),
  };
  const fx = await rpcFixture(controller);
  const failure = await fx.registration.handler(FEISHU_ENDPOINTS.status, {}, signal());
  assert.deepEqual(failure, {
    ok: false,
    error: {
      code: 'internal',
      message: 'The Feishu integration operation failed.',
      details: {},
    },
  });
  assert.doesNotMatch(JSON.stringify(failure), new RegExp(secret));

  const abort = new AbortController();
  abort.abort();
  const cancelled = await fx.registration.handler(FEISHU_ENDPOINTS.status, {}, abort.signal);
  assert.equal(cancelled.ok, false);
  assert.equal(cancelled.error.code, 'cancelled');

  const unknown = await fx.registration.handler('credentials.read', {}, signal());
  assert.equal(unknown.ok, false);
  assert.equal(unknown.error.code, 'bad-request');
});

test('provisioning callback stores credentials and connects before connected is visible', async () => {
  const secret = 'host-only-app-secret';
  let onCredentials;
  let registrationState = 'idle';
  let configured = false;
  let connectionStatus = {
    ready: false,
    feishuLongConnectionState: 'idle',
    harnessReachable: false,
  };
  const saved = [];
  const connectedWith = [];
  const controller = createProvisioningBackedController({
    createProvisioningManager(callbacks) {
      onCredentials = callbacks.onCredentials;
      return {
        start() { registrationState = 'qr_ready'; return this.status(); },
        status() {
          return {
            state: registrationState,
            attempt: 1,
            updatedAt: 100,
            ...(registrationState === 'qr_ready'
              ? { qrCodeUrl: 'https://accounts.feishu.cn/qr', expiresAt: Date.now() + 60_000 }
              : {}),
          };
        },
        cancel() { registrationState = 'cancelled'; return this.status(); },
      };
    },
    credentialStore: {
      async save(credentials) { saved.push(credentials); configured = true; },
      async clear() { configured = false; },
      async configured() { return configured; },
    },
    connectionManager: {
      async connect(credentials) {
        connectedWith.push(credentials);
        connectionStatus = {
          ready: true,
          feishuLongConnectionState: 'connected',
          harnessReachable: true,
        };
      },
      async disconnect() {
        connectionStatus = {
          ready: false,
          feishuLongConnectionState: 'idle',
          harnessReachable: false,
        };
      },
      status: () => connectionStatus,
    },
  });
  const fx = await rpcFixture(controller);

  const begun = await fx.registration.handler(
    FEISHU_ENDPOINTS.beginProvisioning,
    { locale: 'zh-CN' },
    signal(),
  );
  assert.equal(begun.ok, true);

  await onCredentials({
    client_id: 'cli_created',
    client_secret: secret,
    user_info: { open_id: 'ou_owner' },
  });
  registrationState = 'succeeded';
  const ready = await fx.registration.handler(FEISHU_ENDPOINTS.status, {}, signal());

  assert.equal(ready.ok, true);
  assert.equal(ready.value.state, 'connected');
  assert.equal(ready.value.connected, true);
  assert.equal(saved[0].appSecret, secret);
  assert.equal(connectedWith[0].appSecret, secret);
  assert.doesNotMatch(JSON.stringify(ready), new RegExp(secret));

  const disconnected = await fx.registration.handler(
    FEISHU_ENDPOINTS.disconnect,
    { removeCredentials: true },
    signal(),
  );
  assert.equal(disconnected.ok, true);
  assert.equal(disconnected.value.state, 'disconnected');
  assert.equal(configured, false);
});

test('DSH credential adapter stores refs off the browser plane and clears them', async () => {
  const values = new Map();
  const provider = {
    async resolve(ref) {
      return values.has(ref) ? { value: values.get(ref), source: 'file' } : undefined;
    },
    async describe(ref) {
      return { configured: values.has(ref), source: values.has(ref) ? 'file' : undefined, writable: true };
    },
    async set(ref, value) { values.set(ref, value); },
    async unset(ref) { values.delete(ref); },
  };
  const store = createDshCredentialStore(provider);

  await store.save({ appId: 'cli_created', appSecret: 'stored-secret' });
  assert.equal(values.get(FEISHU_APP_ID_REF), 'cli_created');
  assert.equal(values.get(FEISHU_APP_SECRET_REF), 'stored-secret');
  assert.equal(await store.configured(), true);

  await store.clear();
  assert.equal(values.size, 0);
  assert.equal(await store.configured(), false);
});

test('production assembly needs only ctx credentials and the active DSH webServer', async () => {
  const constructed = {};
  class FakeConfigStore {
    constructor(path) { constructed.configPath = path; }
    async load() { return this; }
  }
  class FakeStateStore {
    constructor(path) {
      constructed.statePath = path;
      (constructed.statePaths ??= []).push(path);
    }
    async load() { return this; }
  }
  class FakeHarness {
    constructor(options) { constructed.harness = options; }
    async ensureRunning() { constructed.harnessReadyChecks = (constructed.harnessReadyChecks ?? 0) + 1; }
    stopManagedProcess() { constructed.harnessStopped = true; }
  }
  class FakeRuntime {
    constructor(options) { constructed.runtime = options; }
  }
  class FakeController {
    constructor(options) { constructed.controller = options; }
    async initialize() { constructed.initialized = true; }
    status() { return { totals: { configured: 0, connected: 0 } }; }
    async close() { constructed.closed = true; }
  }
  const credentials = {};
  const production = await createProductionController({
    credentials,
    webServer: { port: 43123, host: '127.0.0.1' },
    logger: console,
  }, {
    dshHome: '/tmp/dsh-feishu-host-test',
    workspace: '/tmp/dsh-feishu-workspace',
  }, {
    lark: { registerApp: async () => ({}) },
    Controller: FakeController,
    ConfigStore: FakeConfigStore,
    StateStore: FakeStateStore,
    HarnessClient: FakeHarness,
    FeishuRuntime: FakeRuntime,
    verifyFeishuApp: async () => ({}),
  });

  assert.equal(constructed.initialized, undefined);
  await production.ready;
  assert.equal(constructed.initialized, true);
  assert.equal(constructed.harnessReadyChecks, 1);
  assert.equal(constructed.controller.credentials, credentials);
  assert.equal(String(constructed.harness.baseUrl), 'http://127.0.0.1:43123/');
  assert.equal(constructed.harness.autostart, false);
  assert.match(constructed.configPath, /integrations\/dsh-feishu\/config\.json$/);

  await constructed.controller.createRuntime({
    config: {
      appId: 'cli_created',
      domain: 'feishu',
      ownerOpenId: 'ou_owner',
    },
    appSecret: 'host-only',
  });
  assert.match(constructed.statePath, /integrations\/dsh-feishu\/state\.json$/);
  assert.equal(constructed.runtime.appSecret, 'host-only');
  await constructed.controller.createRuntime({
    botId: 'bot_alpha',
    config: {
      id: 'bot_alpha',
      appId: 'cli_alpha',
      secretRef: 'DSH_FEISHU_APP_SECRET_ALPHA',
      domain: 'feishu',
      ownerOpenIds: ['ou_alpha'],
    },
    appSecret: 'alpha-secret',
  });
  const alphaState = constructed.runtime.state;
  await constructed.controller.createRuntime({
    botId: 'bot_beta',
    config: {
      id: 'bot_beta',
      appId: 'cli_beta',
      secretRef: 'DSH_FEISHU_APP_SECRET_BETA',
      domain: 'feishu',
      ownerOpenIds: ['ou_beta'],
    },
    appSecret: 'beta-secret',
  });
  const betaState = constructed.runtime.state;
  assert.notEqual(alphaState, betaState);
  assert.ok(constructed.statePaths.some((path) => /bots\/bot_alpha\/state\.json$/.test(path)));
  assert.ok(constructed.statePaths.some((path) => /bots\/bot_beta\/state\.json$/.test(path)));
  await production.close();
  assert.equal(constructed.closed, true);
  assert.equal(constructed.harnessStopped, true);
});

test('a corrupt legacy state file cannot prevent a healthy v2 bot from starting', async () => {
  const dataDir = await mkdtemp(join(tmpdir(), 'dsh-feishu-production-state-isolation-'));
  await mkdir(dataDir, { recursive: true });
  await writeFile(join(dataDir, 'state.json'), '{corrupt legacy state');
  const legacy = {
    id: 'bot_legacy',
    appId: 'cli_legacy',
    secretRef: 'DSH_FEISHU_APP_SECRET',
    ownerOpenIds: ['ou_legacy'],
    domain: 'feishu',
    botName: '旧机器人',
  };
  const healthy = {
    id: 'bot_healthy',
    appId: 'cli_healthy',
    secretRef: 'DSH_FEISHU_APP_SECRET_HEALTHY',
    ownerOpenIds: ['ou_healthy'],
    domain: 'feishu',
    botName: '健康机器人',
  };
  await writeFile(join(dataDir, 'config.json'), JSON.stringify({ version: 2, bots: [legacy, healthy] }));
  const secrets = new Map([
    [legacy.secretRef, 'legacy-secret'],
    [healthy.secretRef, 'healthy-secret'],
  ]);
  class FakeRuntime {
    #status = { ready: false, feishuLongConnectionState: 'idle', harnessReachable: false };
    get status() { return structuredClone(this.#status); }
    async start() {
      this.#status = { ready: true, feishuLongConnectionState: 'connected', harnessReachable: true };
    }
    async stop() {
      this.#status = { ready: false, feishuLongConnectionState: 'idle', harnessReachable: false };
    }
  }
  class FakeHarness {
    async ensureRunning() {}
    stopManagedProcess() {}
  }
  const production = await createProductionController({
    credentials: {
      async resolve(ref) { return secrets.has(ref) ? { value: secrets.get(ref) } : undefined; },
      async set(ref, value) { secrets.set(ref, value); },
      async unset(ref) { secrets.delete(ref); },
    },
    webServer: { port: 43124 },
    logger: console,
  }, { dataDir, workspace: dataDir }, {
    lark: { registerApp: async () => ({}) },
    HarnessClient: FakeHarness,
    FeishuRuntime: FakeRuntime,
    verifyFeishuApp: async () => ({}),
  });

  await production.ready;
  const statusValue = production.controller.status();
  assert.equal(statusValue.bots.find((entry) => entry.botId === 'bot_legacy').phase, 'error');
  assert.equal(statusValue.bots.find((entry) => entry.botId === 'bot_healthy').connected, true);
  assert.equal(statusValue.totals.connected, 1);
  await production.close();
});
