import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { QqRuntime } from '../../../src/channels/qq/qq-runtime.mjs';

class FakeBot extends EventEmitter {
  middlewares = [];
  stopped = false;
  use(value) { this.middlewares.push(value); }
  async start(signal) {
    queueMicrotask(() => this.emit('ready', {}));
    await new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
  }
  stop() { this.stopped = true; }
  async sendText() {}
}

test('QQ runtime waits for gateway ready, installs typing, and stops its client', async () => {
  const bot = new FakeBot();
  let botOptions;
  const sdkLogs = [];
  const runtime = new QqRuntime({
    config: { botId: 'qq_bot', appId: 'app', ownerUserOpenid: 'owner' },
    appSecret: 'secret',
    harness: { ensureRunning: async () => true },
    state: {},
    createBot: (options) => {
      botOptions = options;
      return bot;
    },
    logger: {
      debug: (...args) => sdkLogs.push(['debug', ...args]),
      info: (...args) => sdkLogs.push(['info', ...args]),
    },
    typingMiddleware: (options) => ({ name: 'typing-middleware', options }),
    connectTimeoutMs: 100,
  });
  const status = await runtime.start();
  assert.equal(status.ready, true);
  assert.equal(status.qqConnectionState, 'connected');
  assert.equal(bot.middlewares[0].name, 'typing-middleware');
  assert.equal(bot.middlewares[0].options.keepAlive, true);
  assert.equal(bot.middlewares[0].options.predicate({ message: { senderId: 'owner' } }), true);
  assert.equal(bot.middlewares[0].options.predicate({ message: { senderId: 'other' } }), false);
  botOptions.logger.debug('raw gateway payload');
  botOptions.logger.info('gateway ready');
  assert.deepEqual(sdkLogs, [['info', 'gateway ready']]);
  bot.emit('error', new Error('temporary disconnect'));
  bot.emit('resumed');
  assert.equal(runtime.status.ready, true);
  assert.equal(runtime.status.lastError, null);
  await runtime.stop();
  assert.equal(bot.stopped, true);
  assert.equal(runtime.status.ready, false);
});

test('QQ runtime never reports ready when the gateway does not emit ready', async () => {
  const bot = new FakeBot();
  bot.start = async (signal) => new Promise((resolve) => signal.addEventListener('abort', resolve, { once: true }));
  const runtime = new QqRuntime({
    config: { botId: 'qq_bot', appId: 'app', ownerUserOpenid: 'owner' },
    appSecret: 'secret',
    harness: { ensureRunning: async () => true },
    state: {},
    createBot: () => bot,
    typingMiddleware: () => 'typing',
    connectTimeoutMs: 5,
  });
  await assert.rejects(() => runtime.start(), /did not become ready/);
  assert.equal(runtime.status.ready, false);
});
