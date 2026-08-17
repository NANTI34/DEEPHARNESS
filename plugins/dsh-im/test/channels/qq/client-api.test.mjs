import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeProvisioning, normalizeSnapshot, safeQrSource } from '../../../plugin-src/client/channels/qq/api.js';

test('QQ client keeps only redacted bot and host-rendered QR state', () => {
  const qr = 'data:image/png;base64,YWJjZA==';
  assert.equal(safeQrSource(qr), qr);
  const provision = normalizeProvisioning({
    attemptId: 'attempt_1', status: 'pending', expiresAt: Date.now() + 1_000, qrCodeDataUrl: qr,
  });
  assert.equal(provision.qrCodeDataUrl, qr);
  const snapshot = normalizeSnapshot({
    bots: [{
      botId: 'qq_abc', connected: true, state: 'connected',
      bot: { name: 'QQ机器人', appIdMasked: '123••••456' },
      health: { summary: '运行正常' },
    }],
  });
  assert.equal(snapshot.totals.connected, 1);
  assert.equal(snapshot.bots[0].bot.appIdMasked, '123••••456');
});
