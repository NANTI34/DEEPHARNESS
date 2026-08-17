import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  SlackConfigStore,
  deriveSlackBotIdentity,
} from '../../../src/channels/slack/config-store.mjs';
import { SlackController } from '../../../src/channels/slack/slack-controller.mjs';
import {
  SlackApi,
  inspectSlackCredentials,
  validSlackAppToken,
  validSlackBotToken,
} from '../../../src/channels/slack/slack-api.mjs';
import {
  SlackRuntime,
  normalizeSlackEvent,
} from '../../../src/channels/slack/slack-runtime.mjs';
import {
  SLACK_ENDPOINTS,
  createSlackRpcHandler,
} from '../../../plugin-src/host/channels/slack/rpc.mjs';

const BOT_TOKEN = `xoxb-${'0'.repeat(24)}-not-a-real-token`;
const APP_TOKEN = `xapp-${'0'.repeat(24)}-not-a-real-token`;

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
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

test('Slack validates both tokens and inspects Bot and Socket Mode credentials', async () => {
  assert.equal(validSlackBotToken(BOT_TOKEN), true);
  assert.equal(validSlackAppToken(APP_TOKEN), true);
  assert.equal(validSlackBotToken(APP_TOKEN), false);
  assert.equal(validSlackAppToken(BOT_TOKEN), false);
  const calls = [];
  const identity = await inspectSlackCredentials({ botToken: BOT_TOKEN, appToken: APP_TOKEN }, {
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      if (url.pathname.endsWith('/auth.test')) {
        return jsonResponse({
          ok: true,
          team: 'Harness Lab',
          team_id: 'T12345678',
          user: 'deepseek-harness',
          user_id: 'U12345678',
          bot_id: 'B12345678',
        });
      }
      return jsonResponse({ ok: true, url: 'wss://wss-primary.slack.com/link/?ticket=test' });
    },
  });
  assert.deepEqual(identity, {
    platformId: 'T12345678:U12345678',
    name: 'deepseek-harness',
    username: 'deepseek-harness',
    teamId: 'T12345678',
    teamName: 'Harness Lab',
  });
  assert.equal(calls.find((call) => call.url.pathname.endsWith('/auth.test')).options.headers.authorization, `Bearer ${BOT_TOKEN}`);
  assert.equal(calls.find((call) => call.url.pathname.endsWith('/apps.connections.open')).options.headers.authorization, `Bearer ${APP_TOKEN}`);
});

test('Slack API uses native streaming methods and suppresses generated mass mentions', async () => {
  const calls = [];
  const api = new SlackApi({
    botToken: BOT_TOKEN,
    appToken: APP_TOKEN,
    fetchImpl: async (url, options) => {
      const body = options.body ? JSON.parse(options.body) : null;
      calls.push({ method: url.pathname.split('/').pop(), body });
      return jsonResponse({ ok: true, ts: '1700000000.100' });
    },
  });
  await api.startStream({
    channelId: 'C12345678',
    threadTs: '1700000000.001',
    recipientTeamId: 'T12345678',
    recipientUserId: 'U12345678',
  });
  await api.appendStream({
    channelId: 'C12345678',
    ts: '1700000000.100',
    markdownText: 'hello ',
  });
  await api.stopStream({ channelId: 'C12345678', ts: '1700000000.100' });
  await api.postMessage({
    channelId: 'C12345678',
    threadTs: '1700000000.001',
    text: '请通知 <!channel> 和 <@U99999999>',
  });
  assert.deepEqual(calls.slice(0, 3).map((call) => call.method), [
    'chat.startStream', 'chat.appendStream', 'chat.stopStream',
  ]);
  assert.equal(calls[1].body.markdown_text, 'hello ');
  assert.equal(calls[3].body.text, '请通知 @channel 和 @U99999999');
});

test('Slack controller stores two protected credential references and exposes neither token', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-im-slack-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const configPath = join(directory, 'config.json');
  const configStore = await new SlackConfigStore(configPath).load();
  const credentialStore = credentials();
  const controller = new SlackController({
    credentials: credentialStore,
    configStore,
    inspectCredentials: async () => ({
      platformId: 'T12345678:U12345678',
      name: 'DeepSeek Harness',
      username: 'deepseek-harness',
      teamId: 'T12345678',
      teamName: 'Harness Lab',
    }),
    createRuntime: async () => ({
      status: {
        ready: true,
        connectionState: 'connected',
        harnessReachable: true,
        lastCheckedAt: 20,
      },
      async start() {},
      async stop() {},
    }),
  });
  const status = await controller.bindCredentials({ botToken: BOT_TOKEN, appToken: APP_TOKEN });
  assert.equal(status.totals.connected, 1);
  assert.equal(status.bots[0].bot.name, 'DeepSeek Harness');
  assert.equal(status.bots[0].bot.teamName, 'Harness Lab');
  const identity = deriveSlackBotIdentity('T12345678:U12345678');
  assert.equal(credentialStore.values.get(identity.botTokenRef), BOT_TOKEN);
  assert.equal(credentialStore.values.get(identity.appTokenRef), APP_TOKEN);
  const stored = await readFile(configPath, 'utf8');
  assert.doesNotMatch(stored, new RegExp(BOT_TOKEN));
  assert.doesNotMatch(stored, new RegExp(APP_TOKEN));
  await controller.deleteBot(identity.botId);
  assert.equal(credentialStore.values.has(identity.botTokenRef), false);
  assert.equal(credentialStore.values.has(identity.appTokenRef), false);
});

test('Slack RPC requires exactly two tokens and strips all credential internals', async () => {
  const controller = {
    status: () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    bindCredentials: async () => ({
      bots: [{
        botId: 'slack_1234567890abcdef12345678',
        botToken: BOT_TOKEN,
        appToken: APP_TOKEN,
        botTokenRef: 'DSH_SLACK_BOT_TOKEN_ABC',
        appTokenRef: 'DSH_SLACK_APP_TOKEN_ABC',
        platformId: 'T123:U123',
        bot: { name: 'Slack机器人', idMasked: 'T123•••' },
      }],
      totals: { configured: 1, connected: 0 },
    }),
    reconnectBot: async () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    deleteBot: async () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
  };
  const handler = createSlackRpcHandler(controller);
  const result = await handler(SLACK_ENDPOINTS.bindCredentials, {
    botToken: BOT_TOKEN,
    appToken: APP_TOKEN,
  });
  assert.equal(result.ok, true);
  assert.equal(result.value.bots[0].botToken, undefined);
  assert.equal(result.value.bots[0].appToken, undefined);
  assert.equal(result.value.bots[0].botTokenRef, undefined);
  assert.equal(result.value.bots[0].appTokenRef, undefined);
  assert.equal(result.value.bots[0].platformId, undefined);
  const rejected = await handler(SLACK_ENDPOINTS.bindCredentials, {
    botToken: BOT_TOKEN,
    appToken: APP_TOKEN,
    extra: true,
  });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.error.code, 'bad-request');
});

test('Slack normalizes direct messages and addressed channel events', () => {
  const direct = normalizeSlackEvent({
    event_id: 'Ev001',
    team_id: 'T12345678',
    event: {
      type: 'message',
      channel_type: 'im',
      channel: 'D12345678',
      user: 'U87654321',
      ts: '1700000000.001',
      text: 'hello &amp; welcome',
    },
  }, 'U12345678');
  assert.equal(direct.kind, 'direct');
  assert.equal(direct.addressed, true);
  assert.equal(direct.content, 'hello & welcome');
  assert.equal(direct.conversationId, 'D12345678');
  assert.equal(direct.replyTarget.threadTs, '1700000000.001');

  const group = normalizeSlackEvent({
    event_id: 'Ev002',
    team_id: 'T12345678',
    event: {
      type: 'app_mention',
      channel: 'C12345678',
      user: 'U87654321',
      user_team: 'T12345678',
      ts: '1700000000.002',
      text: '<@U12345678> run this',
    },
  }, 'U12345678');
  assert.equal(group.kind, 'group');
  assert.equal(group.addressed, true);
  assert.equal(group.content, 'run this');
  assert.equal(group.conversationId, 'C12345678:1700000000.002');
  assert.equal(group.replyTarget.threadTs, '1700000000.002');

  const botMessage = normalizeSlackEvent({
    event_id: 'Ev003',
    event: {
      type: 'message', channel_type: 'im', channel: 'D12345678', user: 'U12345678',
      bot_id: 'B12345678', ts: '1700000000.003', text: 'ignore me',
    },
  }, 'U12345678');
  assert.equal(botMessage, null);
});

class FakeSocket {
  #listeners = new Map();
  sent = [];
  readyState = 1;

  addEventListener(name, listener) {
    const listeners = this.#listeners.get(name) ?? [];
    listeners.push(listener);
    this.#listeners.set(name, listeners);
  }

  send(value) {
    this.sent.push(JSON.parse(value));
  }

  close(code = 1000) {
    if (this.readyState >= 2) return;
    this.readyState = 3;
    this.emit('close', { code });
  }

  emit(name, event) {
    for (const listener of this.#listeners.get(name) ?? []) listener(event);
  }
}

test('Slack runtime opens Socket Mode, acknowledges envelopes, and becomes ready', async () => {
  let socket;
  const runtime = new SlackRuntime({
    config: {
      botId: 'slack_test',
      platformId: 'T12345678:U12345678',
      name: 'DeepSeek Harness',
    },
    botToken: BOT_TOKEN,
    appToken: APP_TOKEN,
    harness: { ensureRunning: async () => true },
    state: {
      sessionFor: () => null,
      setSession: async () => {},
      clearSession: async () => {},
      hasSeen: () => false,
      markSeen: async () => {},
    },
    createApi: () => ({
      authTest: async () => ({ team_id: 'T12345678', user_id: 'U12345678' }),
      openConnection: async () => ({ url: 'wss://wss-primary.slack.com/link/?ticket=test' }),
    }),
    createWebSocket: () => {
      socket = new FakeSocket();
      queueMicrotask(() => socket.emit('message', {
        data: JSON.stringify({
          type: 'hello',
          connection_info: { app_id: 'A12345678' },
        }),
      }));
      return socket;
    },
  });
  await runtime.start();
  assert.equal(runtime.status.ready, true);
  socket.emit('message', {
    data: JSON.stringify({
      envelope_id: 'env-1',
      type: 'events_api',
      payload: { type: 'event_callback', api_app_id: 'A12345678', event_id: 'Ev-noop', event: {} },
    }),
  });
  assert.deepEqual(socket.sent.at(-1), { envelope_id: 'env-1' });
  await runtime.stop();
  assert.equal(runtime.status.ready, false);
});
