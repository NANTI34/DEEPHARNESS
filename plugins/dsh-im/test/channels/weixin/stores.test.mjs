import assert from 'node:assert/strict';
import { mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  deriveWeixinBotIdentity,
  WeixinConfigStore,
} from '../../../src/channels/weixin/config-store.mjs';
import { WeixinStateStore } from '../../../src/channels/weixin/state-store.mjs';

test('config store persists non-secret account facts atomically with restrictive permissions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-weixin-config-'));
  const path = join(root, 'nested', 'config.json');
  const store = await new WeixinConfigStore(path).load();
  const identity = deriveWeixinBotIdentity('account@im.bot');
  await store.save({
    ...identity,
    accountId: 'account@im.bot',
    ownerUserId: 'owner-user',
    baseUrl: 'https://ilinkai.weixin.qq.com',
    createdAt: '2026-08-15T00:00:00.000Z',
  });

  const raw = await readFile(path, 'utf8');
  assert.match(raw, /"accountId": "account@im\.bot"/);
  assert.doesNotMatch(raw, /bot_token|secret-token/);
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  assert.deepEqual((await new WeixinConfigStore(path).load()).list(), store.list());
});

test('config store rejects duplicate or tampered identities', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-weixin-invalid-'));
  const path = join(root, 'config.json');
  await writeFile(path, JSON.stringify({
    version: 1,
    accounts: [{
      botId: 'wx_000000000000000000000000',
      accountId: 'real@im.bot',
      tokenRef: 'DSH_WEIXIN_BOT_TOKEN_000000000000000000000000',
      ownerUserId: 'owner',
      baseUrl: 'https://ilinkai.weixin.qq.com',
    }],
  }));
  await assert.rejects(new WeixinConfigStore(path).load(), /invalid account data/);
});

test('state store retains sessions, deduplication, and the getUpdates cursor', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-weixin-state-'));
  const path = join(root, 'account', 'state.json');
  const state = await new WeixinStateStore(path).load();
  await state.setSession('p2p:user', 'session-1');
  await state.markSeen('message-1');
  await state.setGetUpdatesBuf('cursor-2');

  const restored = await new WeixinStateStore(path).load();
  assert.equal(restored.sessionFor('p2p:user'), 'session-1');
  assert.equal(restored.hasSeen('message-1'), true);
  assert.equal(restored.getUpdatesBuf(), 'cursor-2');
  assert.equal((await stat(path)).mode & 0o777, 0o600);
});
