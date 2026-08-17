import assert from 'node:assert/strict';
import test from 'node:test';

import { QqController } from '../../../src/channels/qq/qq-controller.mjs';
import { QQ_ENDPOINTS, createQqRpcHandler } from '../../../plugin-src/host/channels/qq/rpc.mjs';

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

test('QQ QR success stores the secret off-config and starts a scanner-owned runtime', async () => {
  const qr = deferred();
  let callbacks;
  const values = new Map();
  const configs = [];
  let runtimeArgs;
  const controller = new QqController({
    qrAuth: {
      start(next) {
        callbacks = next;
        queueMicrotask(() => next.onQrDisplayed('https://q.qq.com/connect?task=opaque'));
        return () => {};
      },
    },
    credentials: {
      resolve: async (ref) => values.has(ref) ? { value: values.get(ref) } : undefined,
      set: async (ref, value) => values.set(ref, value),
      unset: async (ref) => values.delete(ref),
    },
    configStore: {
      list: () => [...configs],
      get: (id) => configs.find((value) => value.botId === id) ?? null,
      getByAppId: (id) => configs.find((value) => value.appId === id) ?? null,
      save: async (value) => { configs.splice(0, configs.length, value); },
      remove: async () => null,
    },
    createRuntime: async (args) => {
      runtimeArgs = args;
      return { status: { ready: true, qqConnectionState: 'connected', harnessReachable: true }, start: async () => {}, stop: async () => {} };
    },
  });
  const started = await controller.startProvisioning();
  assert.equal(started.status, 'pending');
  callbacks.onSuccess([{ appId: 'app-id', appSecret: 'private-secret', userOpenid: 'scanner-openid' }]);
  while (controller.registrationStatus(started.attemptId).status !== 'connected') await new Promise((resolve) => setImmediate(resolve));
  const status = controller.status();
  assert.equal(status.bots[0].connected, true);
  assert.equal(configs[0].ownerUserOpenid, 'scanner-openid');
  assert.equal(values.get(configs[0].secretRef), 'private-secret');
  assert.equal(runtimeArgs.appSecret, 'private-secret');
  assert.doesNotMatch(JSON.stringify(status), /private-secret|scanner-openid|secretRef/);
  qr.resolve();
});

test('QQ AppID and AppSecret binding stores the secret and accepts the platform visibility scope', async () => {
  const values = new Map();
  const configs = [];
  let runtimeArgs;
  const controller = new QqController({
    qrAuth: { start() { return () => {}; } },
    credentials: {
      resolve: async (ref) => values.has(ref) ? { value: values.get(ref) } : undefined,
      set: async (ref, value) => values.set(ref, value),
      unset: async (ref) => values.delete(ref),
    },
    configStore: {
      list: () => [...configs],
      get: (id) => configs.find((value) => value.botId === id) ?? null,
      getByAppId: (id) => configs.find((value) => value.appId === id) ?? null,
      save: async (value) => { configs.splice(0, configs.length, value); },
      remove: async () => null,
    },
    createRuntime: async (args) => {
      runtimeArgs = args;
      return {
        status: { ready: true, qqConnectionState: 'connected', harnessReachable: true },
        start: async () => {}, stop: async () => {},
      };
    },
  });

  const status = await controller.bindCredentials({ appId: 'manual-app', appSecret: 'manual-secret' });
  assert.equal(status.totals.connected, 1);
  assert.equal(configs[0].ownerUserOpenid, '*');
  assert.equal(values.get(configs[0].secretRef), 'manual-secret');
  assert.equal(runtimeArgs.appSecret, 'manual-secret');
  assert.doesNotMatch(JSON.stringify(status), /manual-secret|ownerUserOpenid|secretRef/);
  await controller.close();
});

test('QQ RPC turns the host-only QR URL into an image and strips credential fields', async () => {
  const handler = createQqRpcHandler({
    status: () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    startProvisioning: async () => ({
      attemptId: 'attempt_1', status: 'pending', verificationUrl: 'https://q.qq.com/opaque',
      appSecret: 'never-public', ownerUserOpenid: 'never-public', expiresAt: Date.now() + 1_000,
    }),
    registrationStatus: () => null,
    cancelProvisioning: async () => ({}),
    bindCredentials: async () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    reconnectBot: async () => ({}),
    deleteBot: async () => ({}),
  }, { encodeQr: async () => 'data:image/png;base64,YWJjZA==' });
  const result = await handler(QQ_ENDPOINTS.beginProvisioning, { locale: 'zh-CN' });
  assert.equal(result.ok, true);
  assert.equal(result.value.qrCodeDataUrl, 'data:image/png;base64,YWJjZA==');
  assert.doesNotMatch(JSON.stringify(result), /q\.qq\.com|never-public|ownerUserOpenid|appSecret/);
});

test('QQ credential RPC validates the pair and never returns AppSecret', async () => {
  let received;
  const handler = createQqRpcHandler({
    status: () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    startProvisioning: async () => ({}), registrationStatus: () => null,
    cancelProvisioning: async () => ({}), reconnectBot: async () => ({}), deleteBot: async () => ({}),
    bindCredentials: async (payload) => {
      received = payload;
      return { bots: [], totals: { configured: 0, connected: 0 }, appSecret: payload.appSecret };
    },
  });
  const result = await handler(QQ_ENDPOINTS.bindCredentials, {
    appId: 'manual-app', appSecret: 'manual-secret',
  });
  assert.equal(result.ok, true);
  assert.deepEqual(received, { appId: 'manual-app', appSecret: 'manual-secret' });
  assert.doesNotMatch(JSON.stringify(result), /manual-secret|appSecret/);
  assert.equal((await handler(QQ_ENDPOINTS.bindCredentials, { appId: 'manual-app' })).ok, false);
});
