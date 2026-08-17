import { TextHarnessBridge, createTextBridgeStatus } from '../shared/text-harness-bridge.mjs';

export const SLACK_DESCRIPTOR = Object.freeze({
  key: 'slack',
  label: 'Slack',
  connectionLabel: ' Socket Mode 长连接',
});

export class SlackHarnessBridge extends TextHarnessBridge {
  constructor(options) {
    super({ descriptor: SLACK_DESCRIPTOR, ...options });
  }
}

export { createTextBridgeStatus as createSlackBridgeStatus };
