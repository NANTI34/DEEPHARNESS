import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyFeishuApp } from '../../../src/channels/feishu/feishu-app.mjs';

function response(body, ok = true, status = 200) {
  return { ok, status, async json() { return body; } };
}

test('verifyFeishuApp validates credentials and returns a safe bot identity', async () => {
  const requests = [];
  const result = await verifyFeishuApp({
    appId: 'cli_test',
    appSecret: 'never-return-this',
    fetchImpl: async (url, options) => {
      requests.push({ url: String(url), options });
      if (requests.length === 1) {
        return response({ code: 0, tenant_access_token: 'tenant-token' });
      }
      return response({
        code: 0,
        bot: { app_name: '北汇星河助手', open_id: 'ou_bot', activate_status: 1 },
      });
    },
  });

  assert.deepEqual(result, {
    appId: 'cli_test',
    name: '北汇星河助手',
    openId: 'ou_bot',
    activated: 1,
  });
  assert.equal('appSecret' in result, false);
  assert.match(requests[0].options.body, /never-return-this/);
  assert.equal(requests[1].options.headers.authorization, 'Bearer tenant-token');
});

test('verifyFeishuApp rejects invalid credentials before reading bot info', async () => {
  let calls = 0;
  await assert.rejects(verifyFeishuApp({
    appId: 'cli_bad',
    appSecret: 'bad',
    fetchImpl: async () => {
      calls += 1;
      return response({ code: 10003, msg: 'invalid app secret' });
    },
  }), /invalid app secret/);
  assert.equal(calls, 1);
});
