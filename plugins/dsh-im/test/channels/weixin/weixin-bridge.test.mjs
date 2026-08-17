import assert from 'node:assert/strict';
import test from 'node:test';

import { createWeixinBridgeStatus, WeixinHarnessBridge } from '../../../src/channels/weixin/weixin-bridge.mjs';

function message(id, text, overrides = {}) {
  return {
    message_id: id,
    message_type: 1,
    from_user_id: 'owner-user',
    context_token: `context-${id}`,
    item_list: [{ type: 1, text_item: { text } }],
    ...overrides,
  };
}

function stateFixture() {
  const sessions = new Map();
  const seen = new Set();
  return {
    sessions,
    seen,
    state: {
      hasSeen: (id) => seen.has(id),
      markSeen: async (id) => seen.add(id),
      sessionFor: (key) => sessions.get(key) ?? null,
      setSession: async (key, sessionId) => sessions.set(key, sessionId),
      clearSession: async (key) => sessions.delete(key),
    },
  };
}

test('bridge maps the scanning Weixin user to one persistent Harness session and echoes context_token', async () => {
  const sent = [];
  const asked = [];
  const fixture = stateFixture();
  const status = createWeixinBridgeStatus();
  const bridge = new WeixinHarnessBridge({
    api: { sendText: async (request) => sent.push(request) },
    baseUrl: 'https://ilinkai.weixin.qq.com/',
    token: 'host-token',
    ownerUserId: 'owner-user',
    harness: {
      sessionExists: async (sessionId) => sessionId === 'session-1',
      createSession: async () => 'session-1',
      ask: async (sessionId, text) => {
        asked.push({ sessionId, text });
        return 'Harness 的回答';
      },
    },
    state: fixture.state,
    status,
  });

  await bridge.accept(message('1', '你好'));
  await bridge.accept(message('2', '继续'));

  assert.deepEqual(asked, [
    { sessionId: 'session-1', text: '你好' },
    { sessionId: 'session-1', text: '继续' },
  ]);
  assert.equal(fixture.sessions.get('p2p:owner-user'), 'session-1');
  assert.deepEqual(sent.map(({ toUserId, text, contextToken }) => ({ toUserId, text, contextToken })), [
    { toUserId: 'owner-user', text: 'Harness 的回答', contextToken: 'context-1' },
    { toUserId: 'owner-user', text: 'Harness 的回答', contextToken: 'context-2' },
  ]);
  assert.equal(status.messagesReceived, 2);
  assert.equal(status.messagesReplied, 2);
});

test('bridge rejects every user except the account owner returned by QR login', async () => {
  const fixture = stateFixture();
  let asked = 0;
  const status = createWeixinBridgeStatus();
  const bridge = new WeixinHarnessBridge({
    api: { sendText: async () => assert.fail('unauthorized users must not receive a reply') },
    baseUrl: 'https://ilinkai.weixin.qq.com/',
    token: 'host-token',
    ownerUserId: 'owner-user',
    harness: { ask: async () => { asked += 1; } },
    state: fixture.state,
    status,
  });

  await bridge.accept(message('unauthorized', '越权', { from_user_id: 'other-user' }));
  assert.equal(asked, 0);
  assert.equal(status.messagesRejected, 1);
});

test('bridge commands are local and internal failures return a generic message', async () => {
  const fixture = stateFixture();
  fixture.sessions.set('p2p:owner-user', 'old-session');
  const sent = [];
  const bridge = new WeixinHarnessBridge({
    api: { sendText: async (request) => sent.push(request.text) },
    baseUrl: 'https://ilinkai.weixin.qq.com/',
    token: 'host-token',
    ownerUserId: 'owner-user',
    harness: {
      ensureRunning: async () => true,
      sessionExists: async () => true,
      ask: async () => { throw new Error('private path /secret and token-shaped detail'); },
    },
    state: fixture.state,
    logger: { error() {} },
  });

  await bridge.accept(message('new', '/new'));
  assert.equal(fixture.sessions.has('p2p:owner-user'), false);
  await bridge.accept(message('failure', '触发失败'));
  assert.match(sent.at(-1), /消息处理失败/);
  assert.doesNotMatch(sent.at(-1), /private path|secret|token-shaped/);
});
