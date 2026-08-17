import { createTextBridgeStatus, TextHarnessBridge } from '../shared/text-harness-bridge.mjs';

export const WHATSAPP_DESCRIPTOR = Object.freeze({
  key: 'whatsapp',
  label: 'WhatsApp',
  connectionLabel: ' Web 关联设备',
});

export class WhatsappHarnessBridge extends TextHarnessBridge {
  constructor(options) {
    super({ ...options, descriptor: WHATSAPP_DESCRIPTOR });
  }
}

export { createTextBridgeStatus as createWhatsappBridgeStatus };
