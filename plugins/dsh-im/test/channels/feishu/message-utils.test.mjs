import test from 'node:test';
import assert from 'node:assert/strict';
import {
  conversationKey,
  extractText,
  isAllowedSender,
  isBotSender,
  splitText,
} from '../../../src/channels/feishu/message-utils.mjs';

test('extractText removes bot mentions', () => {
  const event = {
    message: {
      message_type: 'text',
      content: JSON.stringify({ text: '@_user_1 你好' }),
      mentions: [{ key: '@_user_1' }],
    },
  };
  assert.equal(extractText(event), '你好');
});

test('conversationKey isolates p2p users and groups', () => {
  assert.equal(conversationKey({
    sender: { sender_id: { open_id: 'ou_test' } },
    message: { chat_type: 'p2p', chat_id: 'oc_private' },
  }), 'p2p:ou_test');
  assert.equal(conversationKey({
    sender: { sender_id: { open_id: 'ou_test' } },
    message: { chat_type: 'group', chat_id: 'oc_group' },
  }), 'group:oc_group');
});

test('splitText preserves all text', () => {
  const input = `${'a'.repeat(12)}\n${'b'.repeat(12)}`;
  const chunks = splitText(input, 15);
  assert.equal(chunks.join('\n'), input);
  assert.ok(chunks.every((chunk) => chunk.length <= 15));
});

test('isBotSender rejects bot loops', () => {
  assert.equal(isBotSender({ sender: { sender_type: 'bot' } }), true);
  assert.equal(isBotSender({ sender: { sender_type: 'user' } }), false);
});

test('isAllowedSender enforces an open-id allowlist', () => {
  const event = { sender: { sender_id: { open_id: 'ou_allowed' } } };
  assert.equal(isAllowedSender(event, new Set()), false);
  assert.equal(isAllowedSender(event, new Set(['ou_allowed'])), true);
  assert.equal(isAllowedSender(event, new Set(['ou_other'])), false);
  assert.equal(isAllowedSender(event, new Set(['*'])), true);
});
