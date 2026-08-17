import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { WecomRuntime } from '../../../src/channels/wecom/wecom-runtime.mjs';

class FakeClient extends EventEmitter {
  disconnected = false;
  connect() { queueMicrotask(() => this.emit('authenticated')); }
  disconnect() { this.disconnected = true; }
  async replyStream() {}
  async replyStreamNonBlocking() {}
  async sendMessage() {}
}

test('Enterprise WeChat runtime waits for authentication, suppresses SDK payload logs, and reconnects', async () => {
  const client = new FakeClient();
  let options;
  const logs = [];
  const runtime = new WecomRuntime({
    config: { botId: 'wecom_bot', remoteBotId: 'remote-bot' },
    secret: 'private-secret',
    harness: { ensureRunning: async () => true },
    state: {},
    createClient: (value) => { options = value; return client; },
    logger: { debug: (...args) => logs.push(args), warn() {} },
    connectTimeoutMs: 100,
  });
  const status = await runtime.start();
  assert.equal(status.ready, true);
  assert.equal(status.wecomConnectionState, 'connected');
  assert.equal(options.botId, 'remote-bot');
  assert.equal(options.secret, 'private-secret');
  options.logger.debug('raw message payload');
  options.logger.warn('raw unknown frame');
  assert.deepEqual(logs, []);
  client.emit('disconnected', 'network');
  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.wecomConnectionState, 'connecting');
  client.emit('authenticated');
  assert.equal(runtime.status.ready, true);
  await runtime.stop();
  assert.equal(client.disconnected, true);
  assert.equal(runtime.status.ready, false);
});

test('Enterprise WeChat runtime never reports ready without SDK authentication', async () => {
  const client = new FakeClient();
  client.connect = () => {};
  const runtime = new WecomRuntime({
    config: { botId: 'wecom_bot', remoteBotId: 'remote-bot' },
    secret: 'private-secret',
    harness: { ensureRunning: async () => true },
    state: {},
    createClient: () => client,
    connectTimeoutMs: 5,
  });
  await assert.rejects(() => runtime.start(), /authentication timed out/);
  assert.equal(runtime.status.ready, false);
  assert.equal(client.disconnected, true);
});

test('Enterprise WeChat runtime stop cancels an in-flight authentication wait', async () => {
  const client = new FakeClient();
  client.connect = () => {};
  const runtime = new WecomRuntime({
    config: { botId: 'wecom_bot', remoteBotId: 'remote-bot' },
    secret: 'private-secret',
    harness: { ensureRunning: async () => true },
    state: {},
    createClient: () => client,
    connectTimeoutMs: 60_000,
  });
  const starting = runtime.start();
  await new Promise((resolve) => setImmediate(resolve));
  await runtime.stop();
  await assert.rejects(starting, { name: 'AbortError' });
  assert.equal(client.disconnected, true);
  assert.equal(runtime.status.wecomConnectionState, 'idle');
});
