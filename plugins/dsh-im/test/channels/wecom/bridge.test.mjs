import assert from 'node:assert/strict';
import test from 'node:test';

import { WecomHarnessBridge } from '../../../src/channels/wecom/wecom-bridge.mjs';

function frame(overrides = {}) {
  return {
    headers: { req_id: 'req-1' },
    body: {
      msgid: 'msg-1',
      chattype: 'single',
      from: { userid: 'member-1' },
      msgtype: 'text',
      text: { content: '请回答' },
      ...overrides,
    },
  };
}

function state() {
  const seen = new Set();
  return {
    seen,
    hasSeen: (id) => seen.has(id),
    markSeen: async (id) => seen.add(id),
    sessionFor: () => 'session-existing',
    sessionExists: async () => true,
    setSession: async () => {},
    clearSession: async () => {},
  };
}

test('Enterprise WeChat messages stream Harness progress and finalize once', async () => {
  const replies = [];
  const active = [];
  const store = state();
  const bridge = new WecomHarnessBridge({
    client: {
      replyStream: async (_frame, streamId, content, finish) => replies.push({ streamId, content, finish }),
      replyStreamNonBlocking: async (_frame, streamId, content, finish) => replies.push({ streamId, content, finish }),
      sendMessage: async (chatId, body) => active.push({ chatId, body }),
    },
    generateStreamId: () => 'stream-1',
    harness: {
      sessionExists: async () => true,
      createSession: async () => 'session-new',
      ensureRunning: async () => true,
      ask: async (_session, _text, { onUpdate }) => {
        await onUpdate({ type: 'tool', name: '网页搜索' });
        await onUpdate({ type: 'text', text: '回答中' });
        return '最终回答';
      },
    },
    state: store,
  });

  await bridge.accept(frame());
  assert.deepEqual(replies, [
    { streamId: 'stream-1', content: '正在思考中…', finish: false },
    { streamId: 'stream-1', content: '正在使用网页搜索…', finish: false },
    { streamId: 'stream-1', content: '回答中', finish: false },
    { streamId: 'stream-1', content: '最终回答', finish: true },
  ]);
  assert.deepEqual(active, []);
  assert.equal(store.seen.has('msg-1'), true);
  assert.equal(bridge.status.messagesReplied, 1);
});

test('Enterprise WeChat visibility scope accepts direct and group conversations without local approval', async () => {
  let asks = 0;
  const client = {
    replyStream: async () => {},
    replyStreamNonBlocking: async () => {},
    sendMessage: async () => {},
  };
  const harness = {
    sessionExists: async () => true,
    ask: async () => { asks += 1; return 'ok'; },
  };
  const bridge = new WecomHarnessBridge({ client, harness, state: state(), generateStreamId: () => 'stream' });
  await bridge.accept(frame({ msgid: 'direct', from: { userid: 'member-a' } }));
  await bridge.accept(frame({ msgid: 'group', chattype: 'group', chatid: 'group-1', from: { userid: 'member-b' } }));
  assert.equal(asks, 2);
});

test('Enterprise WeChat finalizes an existing progress stream when Harness fails', async () => {
  const replies = [];
  const store = state();
  const bridge = new WecomHarnessBridge({
    client: {
      replyStream: async (_frame, streamId, content, finish) => replies.push({ streamId, content, finish }),
      replyStreamNonBlocking: async () => {},
      sendMessage: async () => {},
    },
    generateStreamId: () => 'stream-failure',
    harness: {
      sessionExists: async () => true,
      ensureRunning: async () => true,
      ask: async () => { throw new Error('Harness unavailable'); },
    },
    state: store,
    logger: { error() {} },
  });

  await bridge.accept(frame());
  assert.deepEqual(replies, [
    { streamId: 'stream-failure', content: '正在思考中…', finish: false },
    { streamId: 'stream-failure', content: '消息处理失败，请稍后重试。', finish: true },
  ]);
  assert.equal(store.seen.has('msg-1'), true);
});
