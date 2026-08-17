import assert from 'node:assert/strict';
import test from 'node:test';

import { DingtalkRuntime } from '../../../src/channels/dingtalk/dingtalk-runtime.mjs';

async function eventually(predicate, timeoutMs = 1_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.fail('condition did not become true');
}

function stateFixture() {
  const sessions = new Map();
  const seen = new Set();
  const pending = new Map();
  return {
    hasSeen: (id) => seen.has(id),
    markSeen: async (id) => seen.add(id),
    sessionFor: (key) => sessions.get(key) ?? null,
    setSession: async (key, value) => sessions.set(key, value),
    clearSession: async (key) => sessions.delete(key),
    pendingSenders: () => [...pending.values()],
    pendingSender: (requestId) => pending.get(requestId) ?? null,
    recordPendingSender: async ({ staffId, displayName, lastSeenAt }) => {
      const entry = {
        requestId: `request-${staffId}`,
        staffId,
        displayName,
        requestedAt: lastSeenAt,
        lastSeenAt,
      };
      pending.set(entry.requestId, entry);
      return entry;
    },
    removePendingSenderByStaffId: async (staffId) => {
      const entry = [...pending.values()].find((value) => value.staffId === staffId);
      if (!entry) return false;
      pending.delete(entry.requestId);
      return true;
    },
  };
}

test('runtime owns one DWClient, waits for socket OPEN, acknowledges first, and disconnects on stop', async () => {
  const order = [];
  const state = stateFixture();
  await state.recordPendingSender({
    staffId: 'staff-approved',
    displayName: '已批准用户',
    lastSeenAt: '2026-08-15T01:00:00.000Z',
  });
  let callback;
  const client = {
    connected: false,
    socket: { readyState: 0 },
    registerCallbackListener(topic, listener) {
      order.push(['register', topic]);
      callback = listener;
    },
    async connect() {
      order.push(['connect']);
      setTimeout(() => {
        this.connected = true;
        this.socket.readyState = 1;
      }, 10);
    },
    socketCallBackResponse(messageId, body) {
      order.push(['ack', messageId, body]);
    },
    disconnect() {
      order.push(['disconnect']);
      this.connected = false;
      this.socket.readyState = 3;
    },
  };
  const runtime = new DingtalkRuntime({
    config: {
      clientId: 'ding-client',
      approvedSenders: [{ staffId: 'staff-approved' }],
    },
    clientSecret: 'host-secret',
    harness: {
      ensureRunning: async () => order.push(['harness-ready']),
      sessionExists: async () => true,
      createSession: async () => 'session-one',
      ask: async () => {
        order.push(['ask']);
        return 'Harness 回答';
      },
    },
    state,
    api: {
      sendText: async ({ text }) => order.push(['send', text]),
    },
    streamFactory: async ({ clientId, clientSecret }) => {
      assert.equal(clientId, 'ding-client');
      assert.equal(clientSecret, 'host-secret');
      return { client, topic: 'robot-topic' };
    },
    connectPollIntervalMs: 2,
  });

  const started = await runtime.start();
  assert.equal(started.ready, true);
  assert.equal(started.dingtalkStreamState, 'connected');
  assert.deepEqual(started.pendingSenders, []);
  assert.deepEqual(order.slice(0, 3), [
    ['harness-ready'],
    ['register', 'robot-topic'],
    ['connect'],
  ]);

  callback({
    headers: { messageId: 'callback-one' },
    data: JSON.stringify({
      msgId: 'business-one',
      msgtype: 'text',
      text: { content: '问题' },
      conversationType: '1',
      senderStaffId: 'staff-approved',
      senderNick: '用户',
      sessionWebhook: 'https://oapi.dingtalk.com/robot/reply?ticket=one',
    }),
  });
  assert.deepEqual(order.at(-1), ['ack', 'callback-one', { success: true }]);
  await eventually(() => runtime.status.messagesReplied === 1);
  assert.ok(order.findIndex(([action]) => action === 'ack') < order.findIndex(([action]) => action === 'ask'));
  assert.ok(order.findIndex(([action]) => action === 'ack') < order.findIndex(([action]) => action === 'send'));

  await runtime.stop();
  assert.deepEqual(order.at(-1), ['disconnect']);
  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.dingtalkStreamState, 'idle');
});

test('runtime sends visible-scope messages to Harness without local sender approval', async () => {
  const state = stateFixture();
  const asked = [];
  const sent = [];
  let callback;
  const client = {
    connected: true,
    socket: { readyState: 1 },
    registerCallbackListener(_topic, listener) { callback = listener; },
    async connect() {},
    socketCallBackResponse() {},
    disconnect() {},
  };
  const runtime = new DingtalkRuntime({
    config: { clientId: 'ding-client', approvedSenders: [] },
    clientSecret: 'host-secret',
    harness: {
      ensureRunning: async () => true,
      sessionExists: async () => false,
      createSession: async () => 'session-visible-sender',
      ask: async (sessionId, text) => {
        asked.push({ sessionId, text });
        return '直接回答';
      },
    },
    state,
    api: { sendText: async ({ text }) => sent.push(text) },
    streamFactory: async () => ({ client, topic: 'robot-topic' }),
  });
  await runtime.start();
  callback({
    headers: { messageId: 'callback-pending' },
    data: JSON.stringify({
      msgId: 'business-pending',
      msgtype: 'text',
      text: { content: '请求使用' },
      conversationType: '1',
      senderStaffId: 'raw-staff-id',
      senderNick: '可见范围用户',
      sessionWebhook: 'https://oapi.dingtalk.com/robot/reply?ticket=pending',
    }),
  });

  await eventually(() => runtime.status.messagesReplied === 1);
  assert.deepEqual(asked, [{
    sessionId: 'session-visible-sender',
    text: '请求使用',
  }]);
  assert.deepEqual(sent, ['直接回答']);
  assert.deepEqual(runtime.pendingSenders(), []);
  await runtime.stop();
});

test('runtime accepts an OPEN DingTalk socket when the SDK registered flag remains false', async () => {
  const client = {
    connected: true,
    registered: false,
    socket: { readyState: 1 },
    registerCallbackListener() {},
    async connect() {},
    socketCallBackResponse() {},
    disconnect() {},
  };
  const runtime = new DingtalkRuntime({
    config: { clientId: 'ding-client', approvedSenders: [] },
    clientSecret: 'host-secret',
    harness: { ensureRunning: async () => true },
    state: stateFixture(),
    api: { sendText: async () => true },
    streamFactory: async () => ({ client, topic: 'robot-topic' }),
  });

  assert.equal((await runtime.start()).ready, true);
  assert.equal(client.registered, false);
  await runtime.stop();
});

test('runtime never reports ready when connect resolves before the socket opens permanently', async () => {
  let disconnects = 0;
  const client = {
    connected: false,
    socket: { readyState: 0 },
    registerCallbackListener() {},
    async connect() {},
    socketCallBackResponse() {},
    disconnect() { disconnects += 1; },
  };
  const runtime = new DingtalkRuntime({
    config: { clientId: 'ding-client', approvedSenders: [] },
    clientSecret: 'host-secret',
    harness: { ensureRunning: async () => true },
    state: stateFixture(),
    api: { sendText: async () => true },
    streamFactory: async () => ({ client, topic: 'robot-topic' }),
    connectTimeoutMs: 15,
    connectPollIntervalMs: 2,
    logger: { warn() {}, error() {} },
  });

  await assert.rejects(runtime.start(), /handshake timed out/);
  assert.equal(disconnects, 1);
  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.dingtalkStreamState, 'failed');
});

test('runtime bounds a stalled SDK gateway lookup and disconnects a late connection', async () => {
  let finishConnect;
  let disconnects = 0;
  const client = {
    connected: false,
    socket: { readyState: 0 },
    registerCallbackListener() {},
    connect: async () => new Promise((resolve) => { finishConnect = resolve; }),
    socketCallBackResponse() {},
    disconnect() { disconnects += 1; },
  };
  const runtime = new DingtalkRuntime({
    config: { clientId: 'ding-client', approvedSenders: [] },
    clientSecret: 'host-secret',
    harness: { ensureRunning: async () => true },
    state: stateFixture(),
    api: { sendText: async () => true },
    streamFactory: async () => ({ client, topic: 'robot-topic' }),
    connectTimeoutMs: 10,
    connectPollIntervalMs: 2,
    logger: { warn() {}, error() {} },
  });

  await assert.rejects(runtime.start(), /handshake timed out after 10ms/);
  assert.equal(disconnects, 1);
  finishConnect();
  await eventually(() => disconnects === 2);
  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.dingtalkStreamState, 'failed');
});

test('a callback from a stopped stream is not acknowledged or processed', async () => {
  const events = [];
  let callback;
  const client = {
    connected: true,
    socket: { readyState: 1 },
    registerCallbackListener(_topic, listener) { callback = listener; },
    async connect() {},
    socketCallBackResponse() { events.push('ack'); },
    disconnect() { this.connected = false; this.socket.readyState = 3; },
  };
  const runtime = new DingtalkRuntime({
    config: { clientId: 'ding-client', approvedSenders: [{ staffId: 'approved' }] },
    clientSecret: 'host-secret',
    harness: { ensureRunning: async () => true, ask: async () => events.push('ask') },
    state: stateFixture(),
    api: { sendText: async () => events.push('send') },
    streamFactory: async () => ({ client, topic: 'robot-topic' }),
  });
  await runtime.start();
  await runtime.stop();

  callback({
    headers: { messageId: 'late-callback' },
    data: JSON.stringify({
      msgId: 'late-message',
      msgtype: 'text',
      text: { content: '不应处理' },
      conversationType: '1',
      senderStaffId: 'approved',
      sessionWebhook: 'https://oapi.dingtalk.com/robot/reply?ticket=late',
    }),
  });
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(events, []);
});

test('stop aborts in-flight Harness work without waiting for the reply timeout', async () => {
  let callback;
  let askStarted;
  const askStartedPromise = new Promise((resolve) => { askStarted = resolve; });
  const client = {
    connected: true,
    socket: { readyState: 1 },
    registerCallbackListener(_topic, listener) { callback = listener; },
    async connect() {},
    socketCallBackResponse() {},
    disconnect() { this.connected = false; this.socket.readyState = 3; },
  };
  const runtime = new DingtalkRuntime({
    config: { clientId: 'ding-client', approvedSenders: [{ staffId: 'approved' }] },
    clientSecret: 'host-secret',
    harness: {
      ensureRunning: async () => true,
      sessionExists: async () => true,
      createSession: async () => 'session-one',
      ask: async (_sessionId, _text, { signal }) => {
        askStarted();
        await new Promise((resolve, reject) => {
          signal.addEventListener('abort', () => reject(signal.reason), { once: true });
        });
      },
    },
    state: stateFixture(),
    api: { sendText: async () => true },
    streamFactory: async () => ({ client, topic: 'robot-topic' }),
    logger: { warn() {}, error() {} },
  });
  await runtime.start();
  callback({
    headers: { messageId: 'callback-hanging' },
    data: JSON.stringify({
      msgId: 'business-hanging',
      msgtype: 'text',
      text: { content: '长时间问题' },
      conversationType: '1',
      senderStaffId: 'approved',
      sessionWebhook: 'https://oapi.dingtalk.com/robot/reply?ticket=hanging',
    }),
  });
  await askStartedPromise;

  await Promise.race([
    runtime.stop(),
    new Promise((_, reject) => setTimeout(
      () => reject(new Error('runtime stop did not abort Harness work')),
      100,
    )),
  ]);

  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.dingtalkStreamState, 'idle');
});
