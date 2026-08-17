import assert from 'node:assert/strict';
import test from 'node:test';
import { FeishuRuntime } from '../../../src/channels/feishu/feishu-runtime.mjs';

class FakeClient {}

class FakeDispatcher {
  register(handlers) {
    this.handlers = handlers;
    return this;
  }
}

class FakeWSClient {
  static instances = [];

  constructor(options) {
    this.options = options;
    this.state = 'idle';
    FakeWSClient.instances.push(this);
  }

  async start() {
    this.state = 'connecting';
  }

  becomeReady() {
    this.state = 'connected';
    this.options.onReady();
  }

  getConnectionStatus() {
    return { state: this.state };
  }

  close() {
    this.state = 'closed';
  }
}

function fakeLark() {
  FakeWSClient.instances.length = 0;
  return {
    Domain: { Feishu: 'feishu-domain', Lark: 'lark-domain' },
    LoggerLevel: { info: 'info' },
    Client: FakeClient,
    EventDispatcher: FakeDispatcher,
    WSClient: FakeWSClient,
  };
}

test('FeishuRuntime becomes chat-ready only after Harness and Feishu are connected', async () => {
  let harnessChecks = 0;
  const runtime = new FeishuRuntime({
    lark: fakeLark(),
    appId: 'cli_test',
    appSecret: 'secret',
    ownerOpenId: 'ou_owner',
    harness: {
      async ensureRunning() { harnessChecks += 1; },
    },
    state: { hasSeen: () => false },
  });

  assert.equal(runtime.status.ready, false);
  let settled = false;
  const starting = runtime.start().then((value) => {
    settled = true;
    return value;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(settled, false);
  assert.equal(runtime.status.feishuLongConnectionState, 'connecting');
  FakeWSClient.instances[0].becomeReady();
  const status = await starting;
  assert.equal(harnessChecks, 1);
  assert.equal(status.ready, true);
  assert.equal(status.feishuLongConnectionState, 'connected');
  assert.equal(status.harnessReachable, true);

  const stopped = await runtime.stop();
  assert.equal(stopped.ready, false);
  assert.equal(stopped.feishuLongConnectionState, 'idle');
  assert.equal(FakeWSClient.instances[0].state, 'closed');
});

test('FeishuRuntime fails closed when the initial WebSocket handshake times out', async () => {
  const runtime = new FeishuRuntime({
    lark: fakeLark(),
    appId: 'cli_test',
    appSecret: 'secret',
    ownerOpenId: 'ou_owner',
    harness: { async ensureRunning() {} },
    state: { hasSeen: () => false },
    connectTimeoutMs: 10,
  });

  await assert.rejects(runtime.start(), /handshake timed out/);
  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.feishuLongConnectionState, 'failed');
  assert.equal(FakeWSClient.instances[0].state, 'closed');
});

test('FeishuRuntime fails closed when Harness is unavailable', async () => {
  const runtime = new FeishuRuntime({
    lark: fakeLark(),
    appId: 'cli_test',
    appSecret: 'secret',
    ownerOpenId: 'ou_owner',
    harness: {
      async ensureRunning() { throw new Error('Harness unavailable'); },
    },
    state: { hasSeen: () => false },
  });

  await assert.rejects(runtime.start(), /Harness unavailable/);
  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.feishuLongConnectionState, 'failed');
  assert.equal(runtime.status.lastError, 'Harness unavailable');
});
