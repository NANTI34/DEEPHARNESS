import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  DiscordConfigStore,
  deriveDiscordBotIdentity,
} from '../../../src/channels/discord/config-store.mjs';
import { DiscordController } from '../../../src/channels/discord/discord-controller.mjs';
import {
  DiscordApi,
  inspectDiscordToken,
  validDiscordToken,
} from '../../../src/channels/discord/discord-api.mjs';
import {
  DiscordRuntime,
  normalizeDiscordMessage,
} from '../../../src/channels/discord/discord-runtime.mjs';
import {
  DISCORD_ENDPOINTS,
  createDiscordRpcHandler,
} from '../../../plugin-src/host/channels/discord/rpc.mjs';

const TOKEN = 'MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.ABCD.abcdefghijklmnopqrstuvwxyz123456';

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

test('Discord API authenticates with a Bot header and validates the current bot', async () => {
  assert.equal(validDiscordToken(TOKEN), true);
  assert.equal(validDiscordToken('not-a-token'), false);
  const calls = [];
  const bot = await inspectDiscordToken(TOKEN, {
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return jsonResponse({
        id: '1234567890123456789',
        bot: true,
        username: 'HarnessBot',
        global_name: 'Harness Discord',
      });
    },
  });
  assert.deepEqual(bot, {
    platformId: '1234567890123456789',
    name: 'Harness Discord',
    username: 'HarnessBot',
  });
  assert.equal(calls[0].options.headers.authorization, `Bot ${TOKEN}`);
  assert.match(calls[0].url.pathname, /users\/@me$/);

  const api = new DiscordApi({
    token: TOKEN,
    fetchImpl: async () => jsonResponse({ message: '401: Unauthorized' }, 401),
  });
  await assert.rejects(() => api.getCurrentUser(), (error) => {
    assert.equal(error.code, 'discord-401');
    assert.doesNotMatch(error.message, new RegExp(TOKEN.replaceAll('.', '\\.')));
    return true;
  });
});

test('Discord API retries one rate-limited message request', async () => {
  let attempts = 0;
  const api = new DiscordApi({
    token: TOKEN,
    fetchImpl: async () => {
      attempts += 1;
      return attempts === 1
        ? jsonResponse({ message: 'rate limited', retry_after: 0.001 }, 429)
        : jsonResponse({ id: '987654321012345678', content: 'hello' });
    },
  });
  const message = await api.createMessage({
    channelId: '123456789012345678',
    content: 'hello',
  });
  assert.equal(message.id, '987654321012345678');
  assert.equal(attempts, 2);
});

test('Discord controller persists a credential reference and exposes only masked identity', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-im-discord-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const configPath = join(directory, 'config.json');
  const configStore = await new DiscordConfigStore(configPath).load();
  const credentialStore = credentials();
  const controller = new DiscordController({
    credentials: credentialStore,
    configStore,
    inspectToken: async () => ({
      platformId: '1234567890123456789',
      name: 'Harness Discord',
      username: 'HarnessBot',
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
  const status = await controller.bindCredentials({ token: TOKEN });
  assert.equal(status.totals.connected, 1);
  assert.equal(status.bots[0].bot.name, 'Harness Discord');
  const identity = deriveDiscordBotIdentity('1234567890123456789');
  assert.equal(credentialStore.values.get(identity.tokenRef), TOKEN);
  assert.doesNotMatch(await readFile(configPath, 'utf8'), new RegExp(TOKEN.replaceAll('.', '\\.')));
  await controller.deleteBot(identity.botId);
  assert.equal(credentialStore.values.has(identity.tokenRef), false);
});

test('Discord RPC rejects extra credential fields and removes token internals', async () => {
  const controller = {
    status: () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    bindCredentials: async () => ({
      bots: [{
        botId: 'discord_123',
        token: TOKEN,
        tokenRef: 'DSH_DISCORD_BOT_TOKEN_ABC',
        bot: { name: 'Discord机器人', idMasked: '123•••' },
      }],
      totals: { configured: 1, connected: 0 },
    }),
    reconnectBot: async () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
    deleteBot: async () => ({ bots: [], totals: { configured: 0, connected: 0 } }),
  };
  const handler = createDiscordRpcHandler(controller);
  const result = await handler(DISCORD_ENDPOINTS.bindCredentials, { token: TOKEN });
  assert.equal(result.ok, true);
  assert.equal(result.value.bots[0].token, undefined);
  assert.equal(result.value.bots[0].tokenRef, undefined);
  const rejected = await handler(DISCORD_ENDPOINTS.bindCredentials, { token: TOKEN, appId: 'x' });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.error.code, 'bad-request');
});

test('Discord normalizes DMs and only addressed server messages', () => {
  const direct = normalizeDiscordMessage({
    id: '111111111111111111',
    channel_id: '222222222222222222',
    author: { id: '333333333333333333', bot: false },
    content: 'hello',
  }, '1234567890123456789');
  assert.equal(direct.kind, 'direct');
  assert.equal(direct.addressed, true);

  const group = normalizeDiscordMessage({
    id: '111111111111111112',
    channel_id: '222222222222222223',
    guild_id: '444444444444444444',
    author: { id: '333333333333333334', bot: false },
    mentions: [{ id: '1234567890123456789' }],
    content: '<@1234567890123456789> run this',
  }, '1234567890123456789');
  assert.equal(group.kind, 'group');
  assert.equal(group.addressed, true);
  assert.equal(group.content, 'run this');

  const unmentionedReply = normalizeDiscordMessage({
    id: '111111111111111113',
    channel_id: '222222222222222223',
    guild_id: '444444444444444444',
    author: { id: '333333333333333334', bot: false },
    mentions: [],
    referenced_message: { author: { id: '1234567890123456789', bot: true } },
    content: '',
  }, '1234567890123456789');
  assert.equal(unmentionedReply.addressed, false);
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
    const packet = JSON.parse(value);
    this.sent.push(packet);
    if (packet.op === 2) {
      queueMicrotask(() => this.emit('message', {
        data: JSON.stringify({
          op: 0,
          t: 'READY',
          s: 1,
          d: {
            session_id: 'session',
            resume_gateway_url: 'wss://gateway.discord.gg',
          },
        }),
      }));
    }
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

test('Discord runtime identifies on Gateway v10 and becomes ready', async () => {
  let socket;
  const runtime = new DiscordRuntime({
    config: {
      botId: 'discord_test',
      platformId: '1234567890123456789',
      name: 'Harness Discord',
    },
    token: TOKEN,
    harness: { ensureRunning: async () => true },
    state: {
      sessionFor: () => null,
      setSession: async () => {},
      clearSession: async () => {},
      hasSeen: () => false,
      markSeen: async () => {},
    },
    createApi: () => ({
      getCurrentUser: async () => ({ id: '1234567890123456789', bot: true }),
      getGatewayBot: async () => ({ url: 'wss://gateway.discord.gg' }),
    }),
    createWebSocket: () => {
      socket = new FakeSocket();
      queueMicrotask(() => socket.emit('message', {
        data: JSON.stringify({ op: 10, d: { heartbeat_interval: 45_000 } }),
      }));
      return socket;
    },
    random: () => 0.5,
  });
  await runtime.start();
  assert.equal(runtime.status.ready, true);
  const identify = socket.sent.find((packet) => packet.op === 2);
  assert.equal(identify.d.token, TOKEN);
  assert.equal(identify.d.intents, 4_609);
  assert.equal(identify.d.properties.browser, 'dsh-im');
  await runtime.stop();
  assert.equal(runtime.status.ready, false);
});
