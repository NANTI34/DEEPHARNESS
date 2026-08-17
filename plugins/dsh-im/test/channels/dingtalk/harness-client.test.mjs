import assert from 'node:assert/strict';
import test from 'node:test';

import { HarnessClient, HarnessReplyTracker, HarnessRpcError } from '../../../src/channels/dingtalk/harness-client.mjs';

test('reply tracker associates only the Harness turn created by the DingTalk prompt RPC', () => {
  const tracker = new HarnessReplyTracker({ promptRpcId: 'dingtalk-prompt', afterSeq: 2 });
  const update = tracker.consume([
    { event: { seq: 3, type: 'turn/start', data: { turn: 9 } } },
    { event: {
      seq: 4,
      type: 'user/message',
      data: { turn: 9, source: { rpcId: 'dingtalk-prompt' } },
    } },
    { event: {
      seq: 5,
      type: 'assistant/chunk',
      data: { turn: 9, step: 0, chunk: { type: 'text-delta', index: 0, text: '钉钉' } },
    } },
  ]);
  assert.deepEqual(update, { type: 'text', text: '钉钉' });
  tracker.consume([
    { event: {
      seq: 6,
      type: 'assistant/message',
      data: { turn: 9, message: { content: [{ type: 'text', text: '钉钉回复完成' }] } },
    } },
    { event: { seq: 7, type: 'turn/end', data: { turn: 9, reason: 'completed' } } },
  ]);
  assert.equal(tracker.finished, true);
  assert.equal(tracker.answer, '钉钉回复完成');
});

test('reply tracker ignores interleaved turns and events at or before the baseline', () => {
  const tracker = new HarnessReplyTracker({ promptRpcId: 'target', afterSeq: 10 });
  tracker.consume([
    { event: { seq: 9, type: 'turn/start', data: { turn: 1 } } },
    { event: { seq: 11, type: 'turn/start', data: { turn: 2 } } },
    { event: { seq: 12, type: 'user/message', data: { turn: 2, source: { rpcId: 'other' } } } },
    { event: {
      seq: 13,
      type: 'assistant/message',
      data: { turn: 2, message: { content: [{ type: 'text', text: 'wrong' }] } },
    } },
  ]);
  assert.equal(tracker.answer, '');
  assert.equal(tracker.finished, false);
});

test('Harness client validates the RPC envelope and preserves server error codes', async () => {
  let request;
  const client = new HarnessClient({
    baseUrl: 'http://127.0.0.1:3080',
    workspace: '/tmp/workspace',
    fetchImpl: async (url, options) => {
      request = { url: url.toString(), body: JSON.parse(options.body) };
      return {
        ok: true,
        json: async () => ({
          type: 'server-response',
          rpcId: request.body.rpcId,
          result: { ok: false, error: { code: 'session-not-found', message: 'missing' } },
        }),
      };
    },
  });

  await assert.rejects(
    client.rpc('session.history', { sessionId: 'one' }),
    (error) => error instanceof HarnessRpcError && error.code === 'session-not-found',
  );
  assert.equal(request.url, 'http://127.0.0.1:3080/api/session.history');
  assert.match(request.body.rpcId, /^dingtalk-/);
});
