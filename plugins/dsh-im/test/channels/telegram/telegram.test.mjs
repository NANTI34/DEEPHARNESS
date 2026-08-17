import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  TelegramConfigStore,
  deriveTelegramBotIdentity,
} from '../../../src/channels/telegram/config-store.mjs';
import { TelegramController } from '../../../src/channels/telegram/telegram-controller.mjs';
import {
  TelegramApi,
  inspectTelegramToken,
  validTelegramToken,
} from '../../../src/channels/telegram/telegram-api.mjs';
import { TelegramHarnessBridge } from '../../../src/channels/telegram/telegram-bridge.mjs';
import {
  TelegramRuntime,
  normalizeTelegramUpdate,
} from '../../../src/channels/telegram/telegram-runtime.mjs';
import { TelegramStateStore } from '../../../src/channels/telegram/state-store.mjs';
import {
  TELEGRAM_ENDPOINTS,
  createTelegramRpcHandler,
} from '../../../plugin-src/host/channels/telegram/rpc.mjs';

const TOKEN = '123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef123456';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function credentials() {
  const values = new Map();
  return {
    values,
    async resolve(ref) {
      return values.has(ref) ? { value: values.get(ref), source: 'test' } : undefined;
    },
    async set(ref, value) { values.set(ref, value); },
    async unset(ref) { values.delete(ref); },
  };
}

function memoryState() {
  const sessions = new Map();
  const seen = new Set();
  return {
    sessionFor: (key) => sessions.get(key) ?? null,
    setSession: async (key, value) => sessions.set(key, value),
    clearSession: async (key) => sessions.delete(key),
    hasSeen: (id) => seen.has(id),
    markSeen: async (id) => seen.add(id),
  };
}

test('Telegram API validates a Bot Token without exposing it in requests or errors', async () => {
  assert.equal(validTelegramToken(TOKEN), true);
  assert.equal(validTelegramToken('short'), false);
  const calls = [];
  const bot = await inspectTelegramToken(TOKEN, {
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return jsonResponse({ ok: true, result: {
        id: 123456789,
        is_bot: true,
        first_name: 'Harness',
        username: 'HarnessBot',
      } });
    },
  });
  assert.deepEqual(bot, {
    platformId: '123456789',
    name: 'Harness',
    username: 'HarnessBot',
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url.protocol, 'https:');
  assert.equal(calls[0].url.hostname, 'api.telegram.org');
  assert.match(calls[0].url.pathname, /^\/bot/);
  assert.match(calls[0].url.pathname, /getMe$/);
  assert.equal(calls[0].options.method, 'POST');

  const api = new TelegramApi({
    token: TOKEN,
    fetchImpl: async () => jsonResponse({ ok: false, error_code: 401, description: 'Unauthorized' }, 401),
  });
  await assert.rejects(() => api.getMe(), (error) => {
    assert.equal(error.code, 'telegram-401');
    assert.doesNotMatch(error.message, new RegExp(TOKEN));
    return true;
  });
});

test('Telegram config and controller store only a credential reference in bot data', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-im-telegram-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const configPath = join(directory, 'config.json');
  const configStore = await new TelegramConfigStore(configPath).load();
  const credentialStore = credentials();
  const runtimes = [];
  const controller = new TelegramController({
    credentials: credentialStore,
    configStore,
    inspectToken: async () => ({
      platformId: '123456789', name: 'Harness Telegram', username: 'harness_bot',
    }),
    createRuntime: async () => {
      const runtime = {
        status: {
          ready: true,
          connectionState: 'connected',
          harnessReachable: true,
          lastCheckedAt: 10,
        },
        async start() {},
        async stop() {},
      };
      runtimes.push(runtime);
      return runtime;
    },
  });

  const status = await controller.bindCredentials({ token: TOKEN });
  assert.equal(status.totals.connected, 1);
  assert.equal(status.bots[0].bot.name, 'Harness Telegram');
  assert.equal(status.bots[0].bot.username, 'harness_bot');
  const identity = deriveTelegramBotIdentity('123456789');
  assert.equal(credentialStore.values.get(identity.tokenRef), TOKEN);
  const persisted = await readFile(configPath, 'utf8');
  assert.doesNotMatch(persisted, new RegExp(TOKEN));
  assert.match(persisted, new RegExp(identity.tokenRef));

  await controller.reconnectBot(identity.botId);
  assert.equal(runtimes.length, 2);
  await controller.deleteBot(identity.botId);
  assert.equal(credentialStore.values.has(identity.tokenRef), false);
  assert.equal(controller.status().totals.configured, 0);
});

test('Telegram RPC accepts only token binding and strips credential internals', async () => {
  const calls = [];
  const controller = {
    status: () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    bindCredentials: async (payload) => {
      calls.push(payload);
      return {
        bots: [{
          botId: 'telegram_123',
          tokenRef: 'DSH_TELEGRAM_BOT_TOKEN_ABC',
          token: TOKEN,
          bot: { name: 'Telegram机器人', idMasked: '123•••' },
        }],
        totals: { configured: 1, connected: 0 },
      };
    },
    reconnectBot: async () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    deleteBot: async () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
  };
  const handler = createTelegramRpcHandler(controller);
  const result = await handler(TELEGRAM_ENDPOINTS.bindCredentials, { token: TOKEN });
  assert.equal(result.ok, true);
  assert.deepEqual(calls, [{ token: TOKEN }]);
  assert.equal(result.value.bots[0].token, undefined);
  assert.equal(result.value.bots[0].tokenRef, undefined);
  const rejected = await handler(TELEGRAM_ENDPOINTS.bindCredentials, { token: TOKEN, extra: true });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.error.code, 'bad-request');
});

test('Telegram normalizes private messages and requires an explicit group address', () => {
  const privateMessage = normalizeTelegramUpdate({
    update_id: 10,
    message: {
      message_id: 4,
      chat: { id: 88, type: 'private' },
      from: { id: 42, is_bot: false },
      text: 'hello',
    },
  }, { botId: '123456789', username: 'HarnessBot' });
  assert.equal(privateMessage.kind, 'direct');
  assert.equal(privateMessage.addressed, true);

  const groupMessage = normalizeTelegramUpdate({
    update_id: 11,
    message: {
      message_id: 5,
      chat: { id: -1001, type: 'supergroup' },
      from: { id: 43, is_bot: false },
      text: '@HarnessBot run this',
      entities: [{ type: 'mention', offset: 0, length: 11 }],
    },
  }, { botId: '123456789', username: 'HarnessBot' });
  assert.equal(groupMessage.kind, 'group');
  assert.equal(groupMessage.addressed, true);
  assert.equal(groupMessage.content, 'run this');
});

test('Telegram bridge ignores unaddressed groups and streams direct replies', async () => {
  const sent = [];
  const updates = [];
  const bot = {
    sendText: async (_target, text) => sent.push(text),
    sendTyping: async () => {},
    openStream: async () => ({
      update: async (text) => updates.push(text),
      finish: async (text) => sent.push(text),
    }),
  };
  let askCount = 0;
  const harness = {
    ensureRunning: async () => true,
    sessionExists: async () => true,
    createSession: async () => 'session-1',
    ask: async (_session, _text, options) => {
      askCount += 1;
      await options.onUpdate({ type: 'tool', name: '搜索' });
      await options.onUpdate({ type: 'text', text: '处理中' });
      return '完成';
    },
  };
  const bridge = new TelegramHarnessBridge({ bot, harness, state: memoryState() });
  await bridge.accept({
    messageId: '1', senderId: 'u1', kind: 'group', conversationId: 'g1', content: 'ignored',
    addressed: false, replyTarget: {},
  });
  assert.equal(askCount, 0);
  await bridge.accept({
    messageId: '2', senderId: 'u1', kind: 'direct', conversationId: 'u1', content: 'hello',
    addressed: true, replyTarget: {},
  });
  assert.equal(askCount, 1);
  assert.deepEqual(updates, ['正在使用搜索…', '处理中']);
  assert.deepEqual(sent, ['完成']);
});

test('Telegram runtime validates webhook state and starts a cancellable long poll', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-im-telegram-runtime-'));
  const state = await new TelegramStateStore(join(directory, 'state.json')).load();
  const calls = [];
  const fakeApi = {
    getMe: async () => ({ id: 123456789, is_bot: true }),
    getWebhookInfo: async () => ({ url: '' }),
    getUpdates: async ({ offset, timeout, signal }) => {
      calls.push({ offset, timeout });
      if (timeout === 0) return [];
      return new Promise((resolve, reject) => signal.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      }, { once: true }));
    },
  };
  const runtime = new TelegramRuntime({
    config: {
      botId: 'telegram_test',
      platformId: '123456789',
      username: 'HarnessBot',
    },
    token: TOKEN,
    harness: { ensureRunning: async () => true },
    state,
    createApi: () => fakeApi,
  });
  await runtime.start();
  assert.equal(runtime.status.ready, true);
  assert.equal(runtime.status.connectionState, 'connected');
  await runtime.stop();
  assert.equal(runtime.status.ready, false);
  assert.deepEqual(calls[0], { offset: -1, timeout: 0 });
  await rm(directory, { recursive: true, force: true });
});
