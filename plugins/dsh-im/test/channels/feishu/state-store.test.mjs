import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { StateStore } from '../../../src/channels/feishu/state-store.mjs';

test('StateStore persists sessions and dedupe ids', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-feishu-state-'));
  const path = join(dir, 'state.json');
  const first = await new StateStore(path).load();
  await first.setSession('group:one', 'session-one');
  await first.markSeen('message-one');

  const second = await new StateStore(path).load();
  assert.equal(second.sessionFor('group:one'), 'session-one');
  assert.equal(second.hasSeen('message-one'), true);
  assert.equal(JSON.parse(await readFile(path, 'utf8')).version, 1);
});

test('separate bot StateStores isolate identical conversations and message ids', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-feishu-state-bots-'));
  const alpha = await new StateStore(join(dir, 'bot-alpha', 'state.json')).load();
  const beta = await new StateStore(join(dir, 'bot-beta', 'state.json')).load();

  await alpha.setSession('p2p:ou_same', 'session-alpha');
  await beta.setSession('p2p:ou_same', 'session-beta');
  await alpha.markSeen('om_same');

  assert.equal(alpha.sessionFor('p2p:ou_same'), 'session-alpha');
  assert.equal(beta.sessionFor('p2p:ou_same'), 'session-beta');
  assert.equal(alpha.hasSeen('om_same'), true);
  assert.equal(beta.hasSeen('om_same'), false);
});
