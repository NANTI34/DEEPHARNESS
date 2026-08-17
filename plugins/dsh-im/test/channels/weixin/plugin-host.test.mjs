import assert from 'node:assert/strict';
import test from 'node:test';

import {
  WEIXIN_ENDPOINTS,
  apply,
  createWeixinRpcHandler,
} from '../../../plugin-src/host/channels/weixin/index.mjs';

function snapshot(overrides = {}) {
  return {
    schemaVersion: 1,
    revision: 1,
    state: 'disconnected',
    bots: [],
    totals: { configured: 0, connected: 0 },
    ...overrides,
  };
}

function controllerFixture() {
  const attempts = new Map();
  const controller = {
    status: () => snapshot(),
    startProvisioning: async () => {
      const value = {
        attemptId: 'attempt-1',
        status: 'pending',
        verificationUrl: 'https://liteapp.weixin.qq.com/q/test',
        expiresAt: Date.now() + 60_000,
        pollIntervalMs: 1_000,
      };
      attempts.set(value.attemptId, value);
      return value;
    },
    registrationStatus: (id) => attempts.get(id) ?? null,
    submitVerification: async (id) => ({ ...attempts.get(id), status: 'scanned' }),
    cancelProvisioning: async (id) => ({ ...attempts.get(id), status: 'cancelled' }),
    reconnectBot: async () => snapshot(),
    deleteBot: async () => snapshot(),
  };
  return controller;
}

test('Host plugin registers the Weixin RPC channel as loopback-only', async () => {
  let registration;
  const dispose = async () => {};
  const ctx = {
    connection: { rpc: { handle: (channel, handler, options) => {
      registration = { channel, handler, options };
      return dispose;
    } } },
  };
  const returned = await apply(ctx, { controller: controllerFixture() });
  assert.equal(returned, dispose);
  assert.equal(registration.channel, '/weixin');
  assert.deepEqual(registration.options, { authority: 'loopback' });
});

test('Host plugin opts the Weixin RPC channel into trusted Host authorities', async () => {
  let registration;
  const ctx = {
    connection: { rpc: { handle: (channel, handler, options) => {
      registration = { channel, handler, options };
      return async () => {};
    } } },
  };
  await apply(ctx, {
    controller: controllerFixture(),
    rpcAuthority: 'trusted-host',
  });
  assert.deepEqual(registration.options, { authority: 'trusted-host' });
});

test('RPC returns QR data and verification states without exposing secret-shaped fields', async () => {
  const controller = controllerFixture();
  const handler = createWeixinRpcHandler(controller, {
    encodeQr: async (url) => `data:image/png;base64,${Buffer.from(url).toString('base64')}`,
  });
  const signal = new AbortController().signal;

  const begun = await handler(WEIXIN_ENDPOINTS.beginProvisioning, {}, signal);
  assert.equal(begun.ok, true);
  assert.match(begun.value.qrCodeDataUrl, /^data:image\/png;base64,/);
  const verified = await handler(WEIXIN_ENDPOINTS.submitVerification, {
    attemptId: 'attempt-1', verifyCode: '123456',
  }, signal);
  assert.equal(verified.ok, true);
  assert.equal(verified.value.status, 'scanned');

  const secretAttempt = await handler(WEIXIN_ENDPOINTS.beginProvisioning, {
    bot_token: 'must-never-cross-the-browser-boundary',
  }, signal);
  assert.equal(secretAttempt.ok, false);
  assert.equal(secretAttempt.error.code, 'bad-request');
  assert.doesNotMatch(JSON.stringify(secretAttempt), /must-never-cross/);
});

test('RPC requires explicit confirmation before removing a Weixin account', async () => {
  const handler = createWeixinRpcHandler(controllerFixture());
  const result = await handler(WEIXIN_ENDPOINTS.deleteBot, {
    botId: 'wx_0123456789abcdef01234567',
    confirm: false,
  }, new AbortController().signal);
  assert.equal(result.ok, false);
  assert.equal(result.error.code, 'bad-request');
});
