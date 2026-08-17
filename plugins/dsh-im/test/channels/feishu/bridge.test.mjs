import test from 'node:test';
import assert from 'node:assert/strict';
import { FeishuHarnessBridge } from '../../../src/channels/feishu/bridge.mjs';

function event(messageId, text) {
  return {
    sender: { sender_type: 'user', sender_id: { open_id: 'ou_user' } },
    message: {
      message_id: messageId,
      message_type: 'text',
      chat_type: 'p2p',
      chat_id: 'oc_chat',
      content: JSON.stringify({ text }),
    },
  };
}

test('bridge maps a Feishu conversation to a persistent Harness session and replies', async () => {
  const sent = [];
  const reactions = [];
  const removedReactions = [];
  const streamed = [];
  const sessions = new Map();
  const seen = new Set();
  const asked = [];
  const client = {
    im: { v1: { message: { create: async (request) => {
      sent.push(request);
      return { code: 0 };
    } } } },
  };
  const channel = {
    addReaction: async (messageId, emojiType) => {
      reactions.push({ messageId, emojiType });
      return `reaction-${emojiType}`;
    },
    removeReaction: async (messageId, reactionId) => {
      removedReactions.push({ messageId, reactionId });
    },
    stream: async (chatId, input, options) => {
      const updates = [];
      await input.markdown({
        setContent: async (content) => updates.push(content),
      });
      streamed.push({ chatId, options, updates });
      return { messageId: 'om_reply' };
    },
  };
  const harness = {
    ensureRunning: async () => true,
    sessionExists: async (sessionId) => sessionId === 'session-test',
    createSession: async () => 'session-test',
    ask: async (sessionId, text, options) => {
      asked.push({ sessionId, text });
      await options.onUpdate({ type: 'text', text: 'Harness' });
      return 'Harness reply';
    },
  };
  const state = {
    hasSeen: (id) => seen.has(id),
    markSeen: async (id) => seen.add(id),
    sessionFor: (key) => sessions.get(key) ?? null,
    setSession: async (key, sessionId) => sessions.set(key, sessionId),
    clearSession: async (key) => sessions.delete(key),
  };
  const status = {
    messagesReceived: 0,
    messagesReplied: 0,
    messagesRejected: 0,
    lastMessageAt: null,
    lastReplyAt: null,
    lastRejectedAt: null,
    lastError: null,
  };
  const bridge = new FeishuHarnessBridge({
    client,
    channel,
    harness,
    state,
    status,
    allowedSenderOpenIds: new Set(['ou_user']),
  });

  bridge.accept(event('om_1', '你好'));
  await bridge.waitForIdle();

  assert.equal(sessions.get('p2p:ou_user'), 'session-test');
  assert.deepEqual(asked, [{ sessionId: 'session-test', text: '你好' }]);
  assert.deepEqual(streamed, [{
    chatId: 'oc_chat',
    options: { replyTo: 'om_1' },
    updates: ['Harness', 'Harness reply'],
  }]);
  assert.deepEqual(reactions, [
    { messageId: 'om_1', emojiType: 'OnIt' },
    { messageId: 'om_1', emojiType: 'DONE' },
  ]);
  assert.deepEqual(removedReactions, [
    { messageId: 'om_1', reactionId: 'reaction-OnIt' },
  ]);
  assert.equal(sent.length, 0);
  assert.equal(status.messagesReceived, 1);
  assert.equal(status.messagesReplied, 1);
  assert.equal(status.streamResponses, 1);

  bridge.accept(event('om_1', '重复消息'));
  await bridge.waitForIdle();
  assert.equal(asked.length, 1);

  bridge.accept({
    ...event('om_2', '越权消息'),
    sender: { sender_type: 'user', sender_id: { open_id: 'ou_other' } },
  });
  await bridge.waitForIdle();
  assert.equal(asked.length, 1);
  assert.equal(status.messagesRejected, 1);
});

test('reaction failures do not block streaming replies', async () => {
  const seen = new Set();
  const status = { messagesReceived: 0, messagesReplied: 0, messagesRejected: 0 };
  const bridge = new FeishuHarnessBridge({
    client: {},
    channel: {
      addReaction: async () => { throw new Error('reaction unavailable'); },
      stream: async (_chatId, input) => input.markdown({ setContent: async () => undefined }),
    },
    harness: {
      sessionExists: async () => true,
      ask: async (_sessionId, _text, options) => {
        await options.onUpdate({ type: 'tool', name: 'web_search' });
        return '天气结果';
      },
    },
    state: {
      hasSeen: (id) => seen.has(id),
      markSeen: async (id) => seen.add(id),
      sessionFor: () => 'session-existing',
    },
    status,
    allowedSenderOpenIds: new Set(['ou_user']),
  });

  bridge.accept(event('om_reaction_failure', '深圳天气'));
  await bridge.waitForIdle();

  assert.equal(status.messagesReplied, 1);
  assert.equal(status.reactionErrors, 2);
  assert.equal(status.streamResponses, 1);
});

test('a stream finalization failure falls back to text without repeating the prompt', async () => {
  const seen = new Set();
  const sent = [];
  const finalReactions = [];
  let askCount = 0;
  const status = { messagesReceived: 0, messagesReplied: 0, messagesRejected: 0 };
  const bridge = new FeishuHarnessBridge({
    client: {
      im: { v1: { message: { create: async (request) => {
        sent.push(JSON.parse(request.data.content).text);
        return { code: 0 };
      } } } },
    },
    channel: {
      addReaction: async (_messageId, emojiType) => {
        finalReactions.push(emojiType);
        return `reaction-${emojiType}`;
      },
      removeReaction: async () => undefined,
      stream: async (_chatId, input) => {
        await input.markdown({ setContent: async () => undefined });
        throw new Error('card finalization failed');
      },
    },
    harness: {
      sessionExists: async () => true,
      ask: async () => {
        askCount += 1;
        return '已经生成的最终回答';
      },
    },
    state: {
      hasSeen: (id) => seen.has(id),
      markSeen: async (id) => seen.add(id),
      sessionFor: () => 'session-existing',
    },
    status,
    allowedSenderOpenIds: new Set(['ou_user']),
  });

  bridge.accept(event('om_stream_finalize_failure', '不要重复提交'));
  await bridge.waitForIdle();

  assert.equal(askCount, 1);
  assert.deepEqual(sent, ['已经生成的最终回答']);
  assert.deepEqual(finalReactions, ['OnIt', 'DONE']);
  assert.equal(status.messagesReplied, 1);
  assert.equal(status.streamFallbacks, 1);
  assert.equal(status.streamErrors, 1);
});

test('bridge does not expose internal error details in a Feishu failure reply', async () => {
  const sent = [];
  const seen = new Set();
  const status = { messagesReceived: 0, messagesReplied: 0, messagesRejected: 0 };
  const bridge = new FeishuHarnessBridge({
    client: {
      im: { v1: { message: { create: async (request) => {
        sent.push(JSON.parse(request.data.content).text);
        return { code: 0 };
      } } } },
    },
    channel: {
      addReaction: async (_messageId, emojiType) => `reaction-${emojiType}`,
      removeReaction: async () => undefined,
    },
    harness: {
      sessionExists: async () => true,
      ask: async () => {
        throw new Error('secret-shaped-internal-detail /private/path');
      },
    },
    state: {
      hasSeen: (id) => seen.has(id),
      markSeen: async (id) => seen.add(id),
      sessionFor: () => 'session-existing',
    },
    status,
    allowedSenderOpenIds: new Set(['ou_user']),
  });

  bridge.accept(event('om_internal_failure', '触发错误'));
  await bridge.waitForIdle();

  assert.equal(sent.length, 1);
  assert.match(sent[0], /处理失败，请稍后重试/);
  assert.doesNotMatch(sent[0], /secret-shaped-internal-detail|private\/path/);
  assert.equal(status.lastError, 'secret-shaped-internal-detail /private/path');
});
