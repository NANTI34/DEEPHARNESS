import test from 'node:test';
import assert from 'node:assert/strict';
import { VerifiedFeishuChannel } from '../../../src/channels/feishu/feishu-channel.mjs';

function fakeClient(overrides = {}) {
  const calls = {
    replies: [],
    updates: [],
    settings: [],
    recalls: [],
    reactionsAdded: [],
    reactionsRemoved: [],
  };
  const client = {
    cardkit: { v1: {
      card: {
        create: async () => ({ code: 0, data: { card_id: 'card-test' } }),
        settings: async (request) => {
          calls.settings.push(request);
          return { code: 0 };
        },
      },
      cardElement: {
        content: async (request) => {
          calls.updates.push(request);
          return { code: 0 };
        },
      },
    } },
    im: { v1: {
      message: {
        reply: async (request) => {
          calls.replies.push(request);
          return { code: 0, data: { message_id: 'om-stream' } };
        },
        create: async () => ({ code: 0, data: { message_id: 'om-stream' } }),
        delete: async (request) => {
          calls.recalls.push(request);
          return { code: 0 };
        },
      },
      messageReaction: {
        create: async (request) => {
          calls.reactionsAdded.push(request);
          return { code: 0, data: { reaction_id: 'reaction-test' } };
        },
        delete: async (request) => {
          calls.reactionsRemoved.push(request);
          return { code: 0 };
        },
      },
    } },
  };

  if (overrides.updateContent) client.cardkit.v1.cardElement.content = overrides.updateContent;
  if (overrides.finishCard) client.cardkit.v1.card.settings = overrides.finishCard;
  return { client, calls };
}

test('VerifiedFeishuChannel streams content and verifies terminal settings', async () => {
  const { client, calls } = fakeClient();
  const channel = new VerifiedFeishuChannel({ client, initialText: '正在思考…' });

  const result = await channel.stream('oc_chat', {
    markdown: async (controller) => {
      await controller.setContent('第一段');
      await controller.setContent('第一段和第二段');
    },
  }, { replyTo: 'om_user' });

  assert.deepEqual(result, { messageId: 'om-stream' });
  assert.equal(calls.replies[0].path.message_id, 'om_user');
  assert.deepEqual(calls.updates.map((call) => ({
    content: call.data.content,
    sequence: call.data.sequence,
  })), [
    { content: '第一段', sequence: 1 },
    { content: '第一段和第二段', sequence: 2 },
  ]);
  assert.equal(calls.settings[0].data.sequence, 3);
  assert.deepEqual(JSON.parse(calls.settings[0].data.settings), {
    config: {
      streaming_mode: false,
      summary: { content: '第一段和第二段' },
    },
  });
  assert.equal(calls.recalls.length, 0);
});

test('VerifiedFeishuChannel rejects failed updates and recalls the partial card', async () => {
  const { client, calls } = fakeClient({
    updateContent: async () => ({ code: 230099, msg: 'element update failed' }),
  });
  const channel = new VerifiedFeishuChannel({ client });

  await assert.rejects(channel.stream('oc_chat', {
    markdown: async (controller) => controller.setContent('最终回答'),
  }, { replyTo: 'om_user' }), /cardElement\.content failed/);

  assert.deepEqual(calls.recalls, [{ path: { message_id: 'om-stream' } }]);
  assert.equal(calls.settings.length, 0);
});

test('VerifiedFeishuChannel rejects failed finalization and recalls the card', async () => {
  const { client, calls } = fakeClient({
    finishCard: async (request) => {
      calls.settings.push(request);
      return { code: 230099, msg: 'card finalization failed' };
    },
  });
  const channel = new VerifiedFeishuChannel({ client });

  await assert.rejects(channel.stream('oc_chat', {
    markdown: async (controller) => controller.setContent('已经生成的回答'),
  }, { replyTo: 'om_user' }), /card\.settings failed/);

  assert.deepEqual(calls.recalls, [{ path: { message_id: 'om-stream' } }]);
  assert.equal(calls.settings.length, 1);
});

test('VerifiedFeishuChannel checks reaction API results', async () => {
  const { client, calls } = fakeClient();
  const channel = new VerifiedFeishuChannel({ client });

  const reactionId = await channel.addReaction('om_user', 'OnIt');
  await channel.removeReaction('om_user', reactionId);

  assert.equal(reactionId, 'reaction-test');
  assert.equal(calls.reactionsAdded[0].data.reaction_type.emoji_type, 'OnIt');
  assert.equal(calls.reactionsRemoved[0].path.reaction_id, 'reaction-test');
});
