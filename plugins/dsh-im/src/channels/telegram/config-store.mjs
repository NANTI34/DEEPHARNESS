import {
  deriveTokenBotIdentity,
  maskPlatformId,
  TokenBotConfigStore,
} from '../shared/token-config-store.mjs';

const IDENTITY_OPTIONS = Object.freeze({
  botPrefix: 'telegram',
  tokenRefPrefix: 'DSH_TELEGRAM_BOT_TOKEN',
});

export function deriveTelegramBotIdentity(platformId) {
  return deriveTokenBotIdentity(platformId, IDENTITY_OPTIONS);
}

export function maskTelegramBotId(platformId) {
  return maskPlatformId(platformId, 'Telegram机器人');
}

export class TelegramConfigStore extends TokenBotConfigStore {
  constructor(path) {
    super(path, { channel: 'Telegram', ...IDENTITY_OPTIONS });
  }
}
