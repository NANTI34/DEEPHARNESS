import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DINGTALK_ENDPOINTS,
  createDingtalkRpcHandler,
  installDingtalkRpc,
} from '../../../plugin-src/host/channels/dingtalk/rpc.mjs';

function controller(overrides = {}) {
  return {
    status: async () => ({ bots: [] }),
    startProvisioning: async () => ({
      attemptId: 'attempt_1',
      status: 'pending',
      verificationUrl: 'https://open-dev.dingtalk.com/registration',
      deviceCode: 'must-not-leak',
      secretRef: 'must-not-leak',
    }),
    registrationStatus: async () => ({ attemptId: 'attempt_1', status: 'pending' }),
    cancelProvisioning: async () => ({ attemptId: 'attempt_1', status: 'cancelled' }),
    bindCredentials: async () => ({ bots: [] }),
    reconnectBot: async () => ({ bots: [] }),
    deleteBot: async () => ({ bots: [] }),
    approveSender: async () => ({ bots: [] }),
    revokeSender: async () => ({ bots: [] }),
    ...overrides,
  };
}

test('RPC encodes QR on the Host and strips all credential material', async () => {
  const handler = createDingtalkRpcHandler(controller(), {
    encodeQr: async (url) => `data:image/png;base64,${Buffer.from(url).toString('base64')}`,
  });

  const result = await handler(DINGTALK_ENDPOINTS.beginProvisioning, { locale: 'zh-CN' });

  assert.equal(result.ok, true);
  assert.match(result.value.qrCodeDataUrl, /^data:image\/png;base64,/);
  assert.equal('verificationUrl' in result.value, false);
  assert.equal('deviceCode' in result.value, false);
  assert.equal('secretRef' in result.value, false);
});

test('status re-encodes an active QR without exposing its authorization URL', async () => {
  const handler = createDingtalkRpcHandler(controller({
    status: async () => ({
      bots: [],
      provisioning: {
        attemptId: 'attempt_1',
        status: 'pending',
        verificationUrl: 'https://open-dev.dingtalk.com/registration',
      },
    }),
  }), {
    encodeQr: async () => 'data:image/png;base64,AAAA',
  });

  const result = await handler(DINGTALK_ENDPOINTS.status, {});

  assert.equal(result.ok, true);
  assert.equal(result.value.provisioning.qrCodeDataUrl, 'data:image/png;base64,AAAA');
  assert.equal('verificationUrl' in result.value.provisioning, false);
});

test('RPC validates mutating requests before invoking the controller', async () => {
  let calls = 0;
  const handler = createDingtalkRpcHandler(controller({
    approveSender: async () => { calls += 1; },
  }));

  const rejected = await handler(DINGTALK_ENDPOINTS.approveSender, {
    botId: 'dt_abc', requestId: 'request_1', confirm: false,
  });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.error.code, 'bad-request');
  assert.equal(calls, 0);
});

test('credential RPC accepts Client ID fields while keeping Client Secret host-only', async () => {
  let received;
  const handler = createDingtalkRpcHandler(controller({
    bindCredentials: async (payload) => {
      received = payload;
      return { bots: [], clientSecret: payload.clientSecret };
    },
  }));

  const result = await handler(DINGTALK_ENDPOINTS.bindCredentials, {
    clientId: 'manual-client', clientSecret: 'manual-secret',
  });
  assert.equal(result.ok, true);
  assert.deepEqual(received, { clientId: 'manual-client', clientSecret: 'manual-secret' });
  assert.doesNotMatch(JSON.stringify(result), /manual-secret|clientSecret/);
  assert.equal((await handler(DINGTALK_ENDPOINTS.bindCredentials, { clientId: 'manual-client' })).ok, false);
});

test('RPC is registered for loopback clients only', () => {
  const registrations = [];
  const dispose = () => {};
  const ctx = {
    connection: {
      rpc: {
        handle: (...args) => {
          registrations.push(args);
          return dispose;
        },
      },
    },
  };

  assert.equal(installDingtalkRpc(ctx, controller()), dispose);
  assert.equal(registrations[0][0], '/dingtalk');
  assert.deepEqual(registrations[0][2], { authority: 'loopback' });
});
