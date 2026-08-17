import { TokenBotController } from '../shared/token-bot-controller.mjs';
import { deriveTelegramBotIdentity, maskTelegramBotId } from './config-store.mjs';
import { inspectTelegramToken } from './telegram-api.mjs';
import { TELEGRAM_DESCRIPTOR } from './telegram-bridge.mjs';

export class TelegramController extends TokenBotController {
  constructor(options) {
    super({
      ...options,
      descriptor: TELEGRAM_DESCRIPTOR,
      inspectToken: options.inspectToken ?? inspectTelegramToken,
      deriveIdentity: deriveTelegramBotIdentity,
      maskPlatformId: maskTelegramBotId,
    });
  }
}
