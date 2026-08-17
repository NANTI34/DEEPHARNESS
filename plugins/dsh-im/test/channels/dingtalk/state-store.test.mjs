import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { DingtalkStateStore } from '../../../src/channels/dingtalk/state-store.mjs';

test('state store persists sessions, dedupe IDs, and host-only pending sender records atomically', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-dingtalk-state-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'bot.json');
  let currentTime = '2026-08-15T01:00:00.000Z';
  const store = await new DingtalkStateStore(path, {
    idFactory: () => 'fixed-id',
    now: () => currentTime,
  }).load();

  await store.setSession('p2p:staff-one', 'session-one');
  await store.markSeen('message-one');
  const first = await store.recordPendingSender({
    staffId: 'staff-one',
    displayName: '小明',
    sessionWebhook: 'https://oapi.dingtalk.com/reply?secret=must-not-persist',
  });
  currentTime = '2026-08-15T01:05:00.000Z';
  const updated = await store.recordPendingSender({ staffId: 'staff-one', displayName: '小明新名字' });

  assert.equal(store.sessionFor('p2p:staff-one'), 'session-one');
  assert.equal(store.hasSeen('message-one'), true);
  assert.equal(first.requestId, 'ding_sender_fixed-id');
  assert.equal(updated.requestId, first.requestId);
  assert.equal(updated.requestedAt, '2026-08-15T01:00:00.000Z');
  assert.equal(updated.lastSeenAt, '2026-08-15T01:05:00.000Z');
  assert.deepEqual(store.pendingSender(first.requestId), updated);

  const storedText = await readFile(path, 'utf8');
  assert.doesNotMatch(storedText, /sessionWebhook|must-not-persist/);
  assert.equal((await stat(path)).mode & 0o777, 0o600);

  const reloaded = await new DingtalkStateStore(path).load();
  assert.deepEqual(reloaded.pendingSenders(), [updated]);
  assert.equal(await reloaded.removePendingSenderByStaffId('staff-one'), true);
  assert.deepEqual(reloaded.pendingSenders(), []);
});

test('state store keeps only normalized fields from an existing pending-sender document', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-dingtalk-state-normalize-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'bot.json');
  const { writeFile } = await import('node:fs/promises');
  await writeFile(path, JSON.stringify({
    version: 1,
    sessions: { valid: 'session', invalid: 3 },
    seenMessageIds: ['one', 'one', null],
    pendingSenders: {
      request: {
        requestId: 'request',
        staffId: 'staff',
        nick: '昵称',
        requestedAt: '2026-08-15T01:00:00.000Z',
        lastSeenAt: '2026-08-15T01:02:00.000Z',
        sessionWebhook: 'https://oapi.dingtalk.com/reply?secret=discard',
      },
    },
  }));

  const store = await new DingtalkStateStore(path).load();
  assert.deepEqual(store.snapshot(), {
    version: 1,
    sessions: { valid: 'session' },
    seenMessageIds: ['one'],
    pendingSenders: {
      request: {
        requestId: 'request',
        staffId: 'staff',
        displayName: '昵称',
        requestedAt: '2026-08-15T01:00:00.000Z',
        lastSeenAt: '2026-08-15T01:02:00.000Z',
      },
    },
  });
});
