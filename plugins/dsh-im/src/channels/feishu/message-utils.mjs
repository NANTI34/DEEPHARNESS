export function conversationKey(event) {
  const chatType = event?.message?.chat_type;
  if (chatType === 'p2p') {
    const senderId = event?.sender?.sender_id?.open_id || event?.sender?.sender_id?.user_id;
    if (!senderId) throw new Error('Feishu p2p event has no sender id');
    return `p2p:${senderId}`;
  }
  const chatId = event?.message?.chat_id;
  if (!chatId) throw new Error('Feishu group event has no chat id');
  return `group:${chatId}`;
}

export function extractText(event) {
  if (event?.message?.message_type !== 'text') return null;
  let parsed;
  try {
    parsed = JSON.parse(event.message.content);
  } catch {
    return null;
  }
  let text = typeof parsed.text === 'string' ? parsed.text : '';
  for (const mention of event.message.mentions ?? []) {
    if (typeof mention.key === 'string' && mention.key) text = text.replaceAll(mention.key, '');
  }
  return text.trim();
}

export function splitText(text, maxChars = 9000) {
  if (text.length <= maxChars) return [text];
  const chunks = [];
  let remaining = text;
  while (remaining.length > maxChars) {
    let splitAt = remaining.lastIndexOf('\n', maxChars);
    if (splitAt < Math.floor(maxChars * 0.6)) splitAt = maxChars;
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).replace(/^\n+/, '');
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export function isBotSender(event) {
  return event?.sender?.sender_type === 'bot';
}

export function isAllowedSender(event, allowedOpenIds) {
  if (!allowedOpenIds || allowedOpenIds.size === 0) return false;
  if (allowedOpenIds.has('*')) return true;
  const senderOpenId = event?.sender?.sender_id?.open_id;
  return typeof senderOpenId === 'string' && allowedOpenIds.has(senderOpenId);
}
