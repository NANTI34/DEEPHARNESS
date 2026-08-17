import { TextHarnessBridge, createTextBridgeStatus } from '../shared/text-harness-bridge.mjs';

export const DISCORD_DESCRIPTOR = Object.freeze({
  key: 'discord',
  label: 'Discord',
  connectionLabel: ' Gateway 长连接',
});

export class DiscordHarnessBridge extends TextHarnessBridge {
  constructor(options) {
    super({ descriptor: DISCORD_DESCRIPTOR, ...options });
  }
}

export { createTextBridgeStatus as createDiscordBridgeStatus };
