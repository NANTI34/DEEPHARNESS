import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { DisconnectReason } from '@whiskeysockets/baileys';

import {
  WhatsappConfigStore,
  deriveWhatsappBotId,
} from '../../../src/channels/whatsapp/config-store.mjs';
import { WhatsappController } from '../../../src/channels/whatsapp/whatsapp-controller.mjs';
import {
  WhatsappRuntime,
  normalizeWhatsappMessage,
} from '../../../src/channels/whatsapp/whatsapp-runtime.mjs';
import { createWhatsappWebSession } from '../../../src/channels/whatsapp/whatsapp-web-session.mjs';
import {
  WHATSAPP_ENDPOINTS,
  createWhatsappRpcHandler,
} from '../../../plugin-src/host/channels/whatsapp/rpc.mjs';

const ACCOUNT_JID = '16505550123@s.whatsapp.net';
const AUTH_DIRECTORY = '7fe8c17e-4fb7-4c5b-a9dc-c36525575dd1';

function linkedConfig(overrides = {}) {
  return {
    botId: deriveWhatsappBotId(ACCOUNT_JID),
    accountJid: ACCOUNT_JID,
    authDirectory: AUTH_DIRECTORY,
    name: 'Harness WhatsApp',
    createdAt: new Date().toISOString(),
    connectedAt: new Date().toISOString(),
    ...overrides,
  };
}

test('WhatsApp config stores only linked-device metadata with restrictive permissions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-im-whatsapp-config-'));
  const path = join(root, 'config.json');
  const store = await new WhatsappConfigStore(path).load();
  await store.save(linkedConfig());
  assert.equal(store.list()[0].accountJid, ACCOUNT_JID);
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  await assert.rejects(() => store.save(linkedConfig({ botId: 'whatsapp_invalid' })));
});

test('WhatsApp Web session reports QR and linked identity without printing either', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-im-whatsapp-session-'));
  const events = new EventEmitter();
  let ended = false;
  const socket = {
    ev: events,
    user: { id: '16505550123:4@s.whatsapp.net', name: 'Harness WhatsApp' },
    end: async () => { ended = true; },
    logout: async () => {},
  };
  const qrValues = [];
  const session = await createWhatsappWebSession({
    authDir: root,
    onQr: (value) => qrValues.push(value),
    makeSocket: () => socket,
    loadAuthState: async () => ({
      state: {
        creds: { me: socket.user },
        keys: { get: async () => ({}), set: async () => {} },
      },
      saveCreds: async () => {},
    }),
  });
  events.emit('connection.update', { qr: 'host-only-qr-value' });
  events.emit('connection.update', { connection: 'open' });
  assert.deepEqual(qrValues, ['host-only-qr-value']);
  assert.deepEqual(await session.ready, {
    accountJid: ACCOUNT_JID,
    name: 'Harness WhatsApp',
  });
  assert.equal((await stat(root)).mode & 0o777, 0o700);
  await session.close();
  assert.equal(ended, true);
});

test('WhatsApp Web session restarts the socket after first-time QR pairing', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-im-whatsapp-restart-'));
  const sockets = Array.from({ length: 2 }, (_, index) => ({
    ev: new EventEmitter(),
    user: index === 1
      ? { id: '16505550123:4@s.whatsapp.net', name: 'Harness WhatsApp' }
      : undefined,
    end: async () => {},
    logout: async () => {},
  }));
  let socketIndex = 0;
  let saveCount = 0;
  const authState = {
    creds: {},
    keys: { get: async () => ({}), set: async () => {} },
  };
  const session = await createWhatsappWebSession({
    authDir: root,
    onQr: () => {},
    makeSocket: () => sockets[socketIndex++],
    loadAuthState: async () => ({
      state: authState,
      saveCreds: async () => { saveCount += 1; },
    }),
  });
  authState.creds.me = sockets[1].user;
  sockets[0].ev.emit('creds.update', { me: sockets[1].user });
  sockets[0].ev.emit('connection.update', {
    connection: 'close',
    lastDisconnect: { error: { output: { statusCode: DisconnectReason.restartRequired } } },
  });
  for (let index = 0; index < 20 && socketIndex < 2; index += 1) {
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.equal(socketIndex, 2);
  assert.equal(saveCount, 1);
  assert.equal(session.socket, sockets[1]);
  sockets[1].ev.emit('connection.update', { connection: 'open' });
  assert.deepEqual(await session.ready, {
    accountJid: ACCOUNT_JID,
    name: 'Harness WhatsApp',
  });
  await session.close();
});

test('WhatsApp Web session accepts recent append events without replaying stale history', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-im-whatsapp-append-'));
  const events = new EventEmitter();
  const received = [];
  const session = await createWhatsappWebSession({
    authDir: root,
    onQr: () => {},
    onMessage: async (message) => { received.push(message.key.id); },
    makeSocket: () => ({
      ev: events,
      end: async () => {},
      logout: async () => {},
    }),
    loadAuthState: async () => ({
      state: {
        creds: {},
        keys: { get: async () => ({}), set: async () => {} },
      },
      saveCreds: async () => {},
    }),
  });
  void session.ready.catch(() => undefined);
  events.emit('messages.upsert', {
    type: 'append',
    messages: [
      { key: { id: 'recent' }, messageTimestamp: Math.floor(Date.now() / 1_000) },
      { key: { id: 'stale' }, messageTimestamp: Math.floor(Date.now() / 1_000) - 300 },
    ],
  });
  events.emit('messages.upsert', {
    type: 'notify',
    messages: [{ key: { id: 'notify' } }],
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(received, ['recent', 'notify']);
  await session.close();
});

test('WhatsApp normalizes direct and explicitly mentioned group messages', () => {
  const direct = normalizeWhatsappMessage({
    key: { remoteJid: '16505550999@s.whatsapp.net', id: 'direct-1', fromMe: false },
    message: { conversation: 'hello' },
  }, ACCOUNT_JID);
  assert.equal(direct.kind, 'direct');
  assert.equal(direct.addressed, true);
  assert.equal(direct.content, 'hello');

  const group = normalizeWhatsappMessage({
    key: {
      remoteJid: '120363000000000000@g.us',
      participant: '16505550999@s.whatsapp.net',
      id: 'group-1',
      fromMe: false,
    },
    message: {
      extendedTextMessage: {
        text: 'question',
        contextInfo: { mentionedJid: [ACCOUNT_JID] },
      },
    },
  }, ACCOUNT_JID);
  assert.equal(group.kind, 'group');
  assert.equal(group.addressed, true);
  assert.equal(normalizeWhatsappMessage({
    key: { remoteJid: 'status@broadcast', id: 'ignored', fromMe: false },
    message: { conversation: 'ignored' },
  }, ACCOUNT_JID), null);

  const selfChat = normalizeWhatsappMessage({
    key: { remoteJid: ACCOUNT_JID, id: 'self-1', fromMe: true },
    message: { conversation: 'message yourself' },
  }, ACCOUNT_JID);
  assert.equal(selfChat.selfChat, true);
  assert.equal(selfChat.addressed, true);
  assert.equal(normalizeWhatsappMessage({
    key: { remoteJid: '16505550999@s.whatsapp.net', id: 'outbound-1', fromMe: true },
    message: { conversation: 'ordinary outbound message' },
  }, ACCOUNT_JID), null);
});

test('WhatsApp runtime connects a linked device and replies through Harness', async () => {
  let callbacks;
  const calls = [];
  const socket = {
    sendPresenceUpdate: async (...args) => calls.push(['presence', ...args]),
    readMessages: async () => {},
    sendMessage: async (jid, content) => {
      calls.push(['message', jid, content]);
      return { key: { id: 'reply-1' } };
    },
  };
  const state = {
    hasSeen: () => false,
    markSeen: async () => {},
    sessionFor: () => 'session-1',
    sessionExists: async () => true,
  };
  const harness = {
    ensureRunning: async () => {},
    sessionExists: async () => true,
    ask: async () => 'Harness answer',
  };
  const runtime = new WhatsappRuntime({
    config: linkedConfig(),
    authDir: '/tmp/test-whatsapp-auth',
    harness,
    state,
    createSession: async (options) => {
      callbacks = options;
      return {
        socket,
        ready: Promise.resolve({ accountJid: ACCOUNT_JID, name: 'Harness WhatsApp' }),
        close: async () => {},
        logout: async () => {},
      };
    },
  });
  await runtime.start();
  await callbacks.onMessage({
    key: { remoteJid: '16505550999@s.whatsapp.net', id: 'direct-2', fromMe: false },
    message: { conversation: 'hello' },
  });
  assert.equal(runtime.status.ready, true);
  assert.ok(calls.some((call) => call[0] === 'presence' && call[1] === 'composing'));
  assert.ok(calls.some((call) => call[0] === 'message' && call[2].text === 'Harness answer'));
  await runtime.stop();
});

test('WhatsApp runtime answers self-chat without processing its own reply echo', async () => {
  let callbacks;
  let askCount = 0;
  const sent = [];
  const socket = {
    sendPresenceUpdate: async () => {},
    readMessages: async () => { throw new Error('self-chat must not send a read receipt'); },
    sendMessage: async (jid, content) => {
      sent.push([jid, content]);
      return { key: { id: 'bot-reply-1' } };
    },
  };
  const runtime = new WhatsappRuntime({
    config: linkedConfig(),
    authDir: '/tmp/test-whatsapp-self-chat',
    harness: {
      ensureRunning: async () => {},
      sessionExists: async () => true,
      ask: async () => { askCount += 1; return 'Harness self-chat answer'; },
    },
    state: {
      hasSeen: () => false,
      markSeen: async () => {},
      sessionFor: () => 'session-self',
      sessionExists: async () => true,
    },
    createSession: async (options) => {
      callbacks = options;
      return {
        socket,
        ready: Promise.resolve({ accountJid: ACCOUNT_JID, name: 'Harness WhatsApp' }),
        close: async () => {},
        logout: async () => {},
      };
    },
  });
  await runtime.start();
  await callbacks.onMessage({
    key: { remoteJid: ACCOUNT_JID, id: 'owner-message-1', fromMe: true },
    message: { conversation: 'hello from message yourself' },
  });
  await callbacks.onMessage({
    key: { remoteJid: ACCOUNT_JID, id: 'bot-reply-1', fromMe: true },
    message: { conversation: 'Harness self-chat answer' },
  });
  assert.equal(askCount, 1);
  assert.deepEqual(sent, [[ACCOUNT_JID, { text: 'Harness self-chat answer' }]]);
  await runtime.stop();
});

test('WhatsApp QR controller and RPC keep the raw QR and linked identity host-only', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-im-whatsapp-controller-'));
  const configStore = await new WhatsappConfigStore(join(root, 'config.json')).load();
  let sessionOptions;
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  const deletedAuth = [];
  const controller = new WhatsappController({
    configStore,
    authPath: (name) => join(root, 'auth', name),
    createSession: async (options) => {
      sessionOptions = options;
      queueMicrotask(() => options.onQr('raw-linked-device-qr'));
      return { ready, close: async () => {} };
    },
    createRuntime: async () => ({
      status: {
        ready: true,
        connectionState: 'connected',
        harnessReachable: true,
        lastCheckedAt: Date.now(),
      },
      start: async () => {},
      stop: async () => {},
    }),
    deleteAuth: async (name) => deletedAuth.push(name),
  });
  t.after(() => controller.close());
  const handler = createWhatsappRpcHandler(controller, {
    encodeQr: async () => 'data:image/png;base64,QUJDRA==',
  });
  const started = await handler(WHATSAPP_ENDPOINTS.beginProvisioning, {});
  assert.equal(started.ok, true);
  assert.match(started.value.qrCodeDataUrl, /^data:image\/png/);
  assert.doesNotMatch(JSON.stringify(started.value), /raw-linked-device-qr|accountJid|authDirectory/);
  resolveReady({ accountJid: ACCOUNT_JID, name: 'Harness WhatsApp' });
  let status;
  for (let index = 0; index < 20; index += 1) {
    status = await handler(WHATSAPP_ENDPOINTS.status, {});
    if (status.value?.bots?.length) break;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  assert.equal(status.ok, true);
  assert.equal(status.value.bots[0].connected, true);
  assert.doesNotMatch(JSON.stringify(status.value), /16505550123@s\.whatsapp\.net|authDirectory/);
  assert.equal(sessionOptions.signal.aborted, false);
  assert.deepEqual(deletedAuth, []);
});
