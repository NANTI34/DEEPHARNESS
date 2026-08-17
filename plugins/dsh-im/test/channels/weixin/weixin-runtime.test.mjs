import assert from 'node:assert/strict';
import test from 'node:test';

import { WeixinRuntime } from '../../../src/channels/weixin/weixin-runtime.mjs';

const flush = () => new Promise((resolve) => setImmediate(resolve));

test('runtime verifies the token, consumes getUpdates, replies, persists cursor, and aborts on stop', async () => {
  const calls = [];
  let pollCount = 0;
  const stateData = { cursor: '', seen: new Set(), session: null };
  const api = {
    notifyStart: async (request) => calls.push(['start', request.token]),
    notifyStop: async (request) => calls.push(['stop', request.token]),
    sendText: async (request) => calls.push(['send', request.text, request.contextToken]),
    getUpdates: async ({ signal }) => {
      pollCount += 1;
      if (pollCount === 1) {
        return {
          ret: 0,
          get_updates_buf: 'cursor-next',
          msgs: [{
            message_id: 7,
            message_type: 1,
            from_user_id: 'owner',
            context_token: 'context-7',
            item_list: [{ type: 1, text_item: { text: '问题' } }],
          }],
        };
      }
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    },
  };
  const state = {
    getUpdatesBuf: () => stateData.cursor,
    setGetUpdatesBuf: async (value) => { stateData.cursor = value; },
    hasSeen: (id) => stateData.seen.has(id),
    markSeen: async (id) => stateData.seen.add(id),
    sessionFor: () => stateData.session,
    setSession: async (_key, value) => { stateData.session = value; },
    clearSession: async () => { stateData.session = null; },
  };
  const runtime = new WeixinRuntime({
    api,
    config: {
      botId: 'wx_bot',
      baseUrl: 'https://ilinkai.weixin.qq.com/',
      ownerUserId: 'owner',
    },
    token: 'bot-token',
    harness: {
      ensureRunning: async () => true,
      sessionExists: async () => true,
      createSession: async () => 'session-1',
      ask: async () => '回答',
    },
    state,
    logger: { warn() {}, error() {} },
  });

  const started = await runtime.start();
  assert.equal(started.ready, true);
  await flush();
  await flush();
  assert.equal(stateData.cursor, 'cursor-next');
  assert.deepEqual(calls.slice(0, 2), [
    ['start', 'bot-token'],
    ['send', '回答', 'context-7'],
  ]);
  await runtime.stop();
  assert.deepEqual(calls.at(-1), ['stop', 'bot-token']);
  assert.equal(runtime.status.ready, false);
});

test('runtime refuses to report ready when notifyStart rejects the stored token', async () => {
  const runtime = new WeixinRuntime({
    api: {
      notifyStart: async () => { throw new Error('rejected'); },
      notifyStop: async () => {},
    },
    config: { botId: 'wx_bad', baseUrl: 'https://ilinkai.weixin.qq.com/', ownerUserId: 'owner' },
    token: 'bad-token',
    harness: { ensureRunning: async () => true },
    state: {},
  });
  await assert.rejects(runtime.start(), /rejected/);
  assert.equal(runtime.status.ready, false);
  assert.equal(runtime.status.weixinConnectionState, 'failed');
});
