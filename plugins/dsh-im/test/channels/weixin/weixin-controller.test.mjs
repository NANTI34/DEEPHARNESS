import assert from 'node:assert/strict';
import test from 'node:test';

import { WeixinController } from '../../../src/channels/weixin/weixin-controller.mjs';

const flush = () => new Promise((resolve) => setImmediate(resolve));

async function waitFor(read, predicate, attempts = 100) {
  for (let index = 0; index < attempts; index += 1) {
    const value = read();
    if (predicate(value)) return value;
    await flush();
  }
  throw new Error('condition was not reached');
}

function credentialsFixture() {
  const values = new Map();
  const calls = [];
  return {
    values,
    calls,
    provider: {
      resolve: async (ref) => values.has(ref)
        ? { configured: true, source: 'settings', value: values.get(ref) }
        : { configured: false },
      set: async (ref, value) => { calls.push(['set', ref]); values.set(ref, value); },
      unset: async (ref) => { calls.push(['unset', ref]); values.delete(ref); },
    },
  };
}

function configFixture() {
  const accounts = new Map();
  return {
    accounts,
    store: {
      list: () => [...accounts.values()].map((account) => structuredClone(account)),
      get: (botId) => accounts.has(botId) ? structuredClone(accounts.get(botId)) : null,
      getByAccountId: (accountId) => {
        const found = [...accounts.values()].find((account) => account.accountId === accountId);
        return found ? structuredClone(found) : null;
      },
      save: async (account) => { accounts.set(account.botId, structuredClone(account)); return account; },
      remove: async (botId) => accounts.delete(botId),
    },
  };
}

function runtimeFactory({ failStart = false } = {}) {
  const runtimes = [];
  const createRuntime = async ({ config, token }) => {
    let ready = false;
    const runtime = {
      config,
      token,
      get status() {
        return {
          ready,
          weixinConnectionState: ready ? 'connected' : 'idle',
          harnessReachable: ready,
          lastCheckedAt: ready ? 100 : null,
        };
      },
      async start() {
        if (failStart) throw new Error('runtime start failed with host-only detail');
        ready = true;
      },
      async stop() { ready = false; },
    };
    runtimes.push(runtime);
    return runtime;
  };
  return { runtimes, createRuntime };
}

test('confirmed QR login stores bot_token only in credentials and starts a redacted account', async () => {
  const credentials = credentialsFixture();
  const configs = configFixture();
  const runtimes = runtimeFactory();
  const controller = new WeixinController({
    api: {
      beginLogin: async ({ localTokens }) => {
        assert.deepEqual(localTokens, []);
        return { qrcode: 'qr-secret', qrcodeUrl: 'https://liteapp.weixin.qq.com/q/test' };
      },
      pollLogin: async () => ({
        status: 'confirmed',
        bot_token: 'private-bot-token',
        ilink_bot_id: 'account@im.bot',
        ilink_user_id: 'owner-user',
        baseurl: 'https://ilinkai.weixin.qq.com',
      }),
    },
    credentials: credentials.provider,
    configStore: configs.store,
    createRuntime: runtimes.createRuntime,
  });

  const begun = await controller.startProvisioning();
  const completed = await waitFor(
    () => controller.registrationStatus(begun.attemptId),
    (value) => value.status === 'connected',
  );

  assert.match(completed.botId, /^wx_[a-f0-9]{24}$/);
  assert.equal(credentials.values.size, 1);
  assert.equal([...credentials.values.values()][0], 'private-bot-token');
  const stored = [...configs.accounts.values()][0];
  assert.equal(stored.ownerUserId, 'owner-user');
  assert.equal('token' in stored, false);
  assert.equal(runtimes.runtimes[0].token, 'private-bot-token');
  const publicJson = JSON.stringify(controller.status());
  assert.doesNotMatch(publicJson, /private-bot-token|owner-user|account@im\.bot|tokenRef/);
  assert.equal(controller.status().totals.connected, 1);

  await controller.deleteBot(completed.botId);
  assert.equal(credentials.values.size, 0);
  assert.equal(configs.accounts.size, 0);
  await controller.close();
});

test('verification-code state pauses polling and resumes with the submitted digits', async () => {
  const credentials = credentialsFixture();
  const configs = configFixture();
  const runtimes = runtimeFactory();
  const verifyCodes = [];
  let polls = 0;
  const controller = new WeixinController({
    api: {
      beginLogin: async () => ({ qrcode: 'qr-secret', qrcodeUrl: 'https://liteapp.weixin.qq.com/q/test' }),
      pollLogin: async ({ verifyCode }) => {
        polls += 1;
        verifyCodes.push(verifyCode);
        if (polls === 1) return { status: 'need_verifycode' };
        return {
          status: 'confirmed',
          bot_token: 'token-after-code',
          ilink_bot_id: 'verify@im.bot',
          ilink_user_id: 'verify-owner',
          baseurl: 'https://ilinkai.weixin.qq.com',
        };
      },
    },
    credentials: credentials.provider,
    configStore: configs.store,
    createRuntime: runtimes.createRuntime,
  });

  const begun = await controller.startProvisioning();
  await waitFor(
    () => controller.registrationStatus(begun.attemptId),
    (value) => value.status === 'needs_verification',
  );
  assert.equal(polls, 1);
  await controller.submitVerification(begun.attemptId, '123456');
  await waitFor(
    () => controller.registrationStatus(begun.attemptId),
    (value) => value.status === 'connected',
  );
  assert.deepEqual(verifyCodes, [null, '123456']);
  await controller.close();
});

test('activation failure rolls credentials and non-secret config back', async () => {
  const credentials = credentialsFixture();
  const configs = configFixture();
  const runtimes = runtimeFactory({ failStart: true });
  const controller = new WeixinController({
    api: {
      beginLogin: async () => ({ qrcode: 'qr-secret', qrcodeUrl: 'https://liteapp.weixin.qq.com/q/test' }),
      pollLogin: async () => ({
        status: 'confirmed',
        bot_token: 'must-be-rolled-back',
        ilink_bot_id: 'rollback@im.bot',
        ilink_user_id: 'owner',
        baseurl: 'https://ilinkai.weixin.qq.com',
      }),
    },
    credentials: credentials.provider,
    configStore: configs.store,
    createRuntime: runtimes.createRuntime,
    logger: { error() {}, warn() {} },
  });
  const begun = await controller.startProvisioning();
  const failed = await waitFor(
    () => controller.registrationStatus(begun.attemptId),
    (value) => value.status === 'failed',
  );

  assert.equal(failed.error.code, 'activation-failed');
  assert.equal(credentials.values.size, 0);
  assert.equal(configs.accounts.size, 0);
  assert.doesNotMatch(JSON.stringify(failed), /must-be-rolled-back|host-only detail/);
  await controller.close();
});

test('cancelling an in-flight QR long poll is terminal and writes no credentials', async () => {
  const credentials = credentialsFixture();
  const configs = configFixture();
  const controller = new WeixinController({
    api: {
      beginLogin: async () => ({ qrcode: 'qr-secret', qrcodeUrl: 'https://liteapp.weixin.qq.com/q/test' }),
      pollLogin: async ({ signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      }),
    },
    credentials: credentials.provider,
    configStore: configs.store,
    createRuntime: runtimeFactory().createRuntime,
  });
  const begun = await controller.startProvisioning();
  const cancelled = await controller.cancelProvisioning(begun.attemptId);
  assert.equal(cancelled.status, 'cancelled');
  assert.equal(credentials.values.size, 0);
  assert.equal(configs.accounts.size, 0);
  await controller.close();
});
