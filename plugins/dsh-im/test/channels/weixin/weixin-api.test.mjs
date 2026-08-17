import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createWeixinApi,
  extractWeixinText,
  normalizeWeixinApiBaseUrl,
  splitWeixinText,
  WeixinApiError,
} from '../../../src/channels/weixin/weixin-api.mjs';

function jsonResponse(value, init) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

test('QR login uses the Tencent iLink headers and keeps local tokens out of the URL', async () => {
  const calls = [];
  const api = createWeixinApi({
    fetchImpl: async (url, init) => {
      calls.push({ url: url.toString(), init });
      return jsonResponse({
        qrcode: 'private-qr-token',
        qrcode_img_content: 'https://liteapp.weixin.qq.com/q/example',
      });
    },
  });

  const login = await api.beginLogin({ localTokens: [' token-a ', 'token-a', 'token-b'] });

  assert.deepEqual(login, {
    qrcode: 'private-qr-token',
    qrcodeUrl: 'https://liteapp.weixin.qq.com/q/example',
  });
  assert.match(calls[0].url, /ilink\/bot\/get_bot_qrcode\?bot_type=3$/);
  assert.doesNotMatch(calls[0].url, /token-a|token-b/);
  assert.equal(calls[0].init.headers['iLink-App-Id'], 'bot');
  assert.equal(calls[0].init.headers['iLink-App-ClientVersion'], String((2 << 16) | (4 << 8) | 6));
  assert.equal(calls[0].init.headers.Authorization, undefined);
  assert.deepEqual(JSON.parse(calls[0].init.body), { local_token_list: ['token-a', 'token-b'] });
});

test('login polling submits a verification code only to an approved Weixin host', async () => {
  const calls = [];
  const api = createWeixinApi({
    fetchImpl: async (url, init) => {
      calls.push({ url: url.toString(), init });
      return jsonResponse({ status: 'scaned' });
    },
  });

  const status = await api.pollLogin({
    qrcode: 'secret-qr',
    baseUrl: 'https://shard.ilinkai.weixin.qq.com',
    verifyCode: '123456',
  });

  assert.equal(status.status, 'scaned');
  assert.match(calls[0].url, /qrcode=secret-qr&verify_code=123456$/);
  assert.equal(calls[0].init.method, 'GET');
  assert.equal(calls[0].init.headers.AuthorizationType, undefined);

  await assert.rejects(
    api.pollLogin({ qrcode: 'secret', baseUrl: 'https://attacker.test' }),
    (error) => error instanceof WeixinApiError && error.code === 'untrusted-base-url',
  );
  assert.equal(calls.length, 1);
});

test('sendText emits the iLink message envelope without reflecting the token in its body', async () => {
  const calls = [];
  const api = createWeixinApi({
    fetchImpl: async (url, init) => {
      calls.push({ url: url.toString(), init });
      return jsonResponse({ ret: 0 });
    },
  });
  await api.sendText({
    baseUrl: 'https://ilinkai.weixin.qq.com',
    token: 'host-only-token',
    toUserId: 'wx-user',
    text: 'Harness reply',
    contextToken: 'message-context',
    runId: 'run-1',
  });

  assert.equal(calls[0].init.headers.Authorization, 'Bearer host-only-token');
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.msg.to_user_id, 'wx-user');
  assert.equal(body.msg.context_token, 'message-context');
  assert.equal(body.msg.item_list[0].text_item.text, 'Harness reply');
  assert.equal(body.base_info.channel_version, '2.4.6');
  assert.equal(body.base_info.bot_agent, 'DeepSeekHarness/0.4.0');
  assert.doesNotMatch(calls[0].init.body, /host-only-token/);
});

test('getUpdates converts its own long-poll timeout into an empty successful poll', async () => {
  const api = createWeixinApi({
    fetchImpl: async (_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    }),
  });
  const result = await api.getUpdates({
    baseUrl: 'https://ilinkai.weixin.qq.com',
    token: 'token',
    getUpdatesBuf: 'cursor',
    timeoutMs: 2,
  });
  assert.deepEqual(result, { ret: 0, msgs: [], get_updates_buf: 'cursor' });
});

test('Weixin URL, inbound text, and reply chunk helpers enforce their narrow formats', () => {
  assert.equal(
    normalizeWeixinApiBaseUrl('https://ilinkai.weixin.qq.com/path'),
    'https://ilinkai.weixin.qq.com/path/',
  );
  assert.throws(() => normalizeWeixinApiBaseUrl('https://ilinkai.weixin.qq.com:444/'));
  assert.equal(extractWeixinText({ item_list: [{ type: 1, text_item: { text: ' 你好 ' } }] }), '你好');
  assert.equal(extractWeixinText({ item_list: [{ type: 3, voice_item: { text: '语音转写' } }] }), '语音转写');
  assert.deepEqual(splitWeixinText('abcdefgh', 5), ['abcde', 'fgh']);
});
