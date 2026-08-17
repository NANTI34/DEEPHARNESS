const STREAM_ELEMENT_ID = 'stream_md';
const DEFAULT_INITIAL_TEXT = '已连接 DeepSeek Harness，正在思考…';
const MAX_STREAM_CHARS = 28000;

function assertApiSuccess(operation, response) {
  if (response?.code && response.code !== 0) {
    throw new Error(`${operation} failed: ${response.msg || response.code}`);
  }
  return response;
}

function summaryOf(text) {
  const summary = String(text ?? '').replace(/\s+/g, ' ').trim();
  return summary.length <= 50 ? summary : `${summary.slice(0, 49)}…`;
}

function streamingCard(initialText) {
  return {
    schema: '2.0',
    config: {
      streaming_mode: true,
      summary: { content: '正在生成…' },
      streaming_config: {
        print_frequency_ms: { default: 70 },
        print_step: { default: 1 },
        print_strategy: 'fast',
      },
    },
    body: {
      elements: [{
        tag: 'markdown',
        element_id: STREAM_ELEMENT_ID,
        content: initialText,
      }],
    },
  };
}

export class VerifiedFeishuChannel {
  #client;
  #initialText;

  constructor({ client, initialText = DEFAULT_INITIAL_TEXT }) {
    this.#client = client;
    this.#initialText = initialText;
  }

  async stream(chatId, input, options = {}) {
    if (typeof input?.markdown !== 'function') {
      throw new Error('Feishu stream requires a markdown producer');
    }

    let messageId = null;
    const cardResponse = assertApiSuccess('Feishu card.create', await this.#client.cardkit.v1.card.create({
      data: {
        type: 'card_json',
        data: JSON.stringify(streamingCard(this.#initialText)),
      },
    }));
    const cardId = cardResponse?.data?.card_id;
    if (!cardId) throw new Error('Feishu card.create returned no card_id');

    try {
      messageId = await this.#sendCard(chatId, cardId, options.replyTo);
      let sequence = 0;
      let lastContent = this.#initialText;
      const controller = {
        messageId,
        setContent: async (content) => {
          const next = String(content ?? '') || '…';
          if (next === lastContent) return;
          if (next.length > MAX_STREAM_CHARS) {
            throw new Error(`Feishu stream content exceeds ${MAX_STREAM_CHARS} characters`);
          }
          const response = await this.#client.cardkit.v1.cardElement.content({
            path: { card_id: cardId, element_id: STREAM_ELEMENT_ID },
            data: {
              content: next,
              sequence: ++sequence,
              uuid: `content_${cardId}_${sequence}`,
            },
          });
          assertApiSuccess('Feishu cardElement.content', response);
          lastContent = next;
        },
      };

      await input.markdown(controller);
      const finishResponse = await this.#client.cardkit.v1.card.settings({
        path: { card_id: cardId },
        data: {
          settings: JSON.stringify({
            config: {
              streaming_mode: false,
              summary: { content: summaryOf(lastContent) || '回答完成' },
            },
          }),
          sequence: ++sequence,
          uuid: `settings_${cardId}_${sequence}`,
        },
      });
      assertApiSuccess('Feishu card.settings', finishResponse);
      return { messageId };
    } catch (error) {
      if (messageId) await this.#recall(messageId);
      throw error;
    }
  }

  async #sendCard(chatId, cardId, replyTo) {
    const content = JSON.stringify({ type: 'card', data: { card_id: cardId } });
    const response = replyTo
      ? await this.#client.im.v1.message.reply({
        path: { message_id: replyTo },
        data: { msg_type: 'interactive', content },
      })
      : await this.#client.im.v1.message.create({
        params: { receive_id_type: 'chat_id' },
        data: { receive_id: chatId, msg_type: 'interactive', content },
      });
    assertApiSuccess('Feishu message send', response);
    const messageId = response?.data?.message_id;
    if (!messageId) throw new Error('Feishu message send returned no message_id');
    return messageId;
  }

  async #recall(messageId) {
    try {
      const response = await this.#client.im.v1.message.delete({
        path: { message_id: messageId },
      });
      assertApiSuccess('Feishu message delete', response);
    } catch (error) {
      console.warn('[bridge] unable to recall a failed streaming card:', error.message);
    }
  }

  async addReaction(messageId, emojiType) {
    const response = assertApiSuccess('Feishu reaction.create', await this.#client.im.v1.messageReaction.create({
      path: { message_id: messageId },
      data: { reaction_type: { emoji_type: emojiType } },
    }));
    const reactionId = response?.data?.reaction_id;
    if (!reactionId) throw new Error('Feishu reaction.create returned no reaction_id');
    return reactionId;
  }

  async removeReaction(messageId, reactionId) {
    assertApiSuccess('Feishu reaction.delete', await this.#client.im.v1.messageReaction.delete({
      path: { message_id: messageId, reaction_id: reactionId },
    }));
  }
}
