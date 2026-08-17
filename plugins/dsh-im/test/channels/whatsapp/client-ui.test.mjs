import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  EmptyView,
  ProvisionView,
  QrPanel,
  WhatsappAccountCard,
} from '../../../plugin-src/client/channels/whatsapp/index.js';

test('WhatsApp onboarding is QR-only with no Cloud API credential form', () => {
  const empty = renderToStaticMarkup(React.createElement(EmptyView, {}));
  const qr = renderToStaticMarkup(React.createElement(QrPanel, {
    provision: {
      qrCodeDataUrl: 'data:image/png;base64,QUJDRA==',
      expiresAt: Date.now() + 60_000,
      durationMs: 60_000,
    },
    now: Date.now(),
  }));
  assert.match(empty, /扫码绑定 WhatsApp 机器人/);
  assert.match(empty, /生成二维码/);
  assert.match(qr, /已关联设备/);
  assert.match(qr, /关联设备/);
  assert.doesNotMatch(`${empty}${qr}`, /Cloud API|Phone Number ID|Access Token|App Secret|Verify Token|Webhook/);
});

test('WhatsApp QR startup renders a neutral loading state instead of an error card', () => {
  const markup = renderToStaticMarkup(React.createElement(ProvisionView, {
    provision: { status: 'starting' },
    busy: true,
  }));
  assert.match(markup, /正在生成 WhatsApp 二维码/);
  assert.match(markup, /aria-busy="true"/);
  assert.doesNotMatch(markup, /WhatsApp 没有接入完成|WHATSAPP_PROVISION_FAILED|ddt-inlineError/);
});

test('WhatsApp account card uses the unified compact channel layout', () => {
  const markup = renderToStaticMarkup(React.createElement(WhatsappAccountCard, {
    account: {
      botId: 'whatsapp-card',
      state: 'connected',
      connected: true,
      bot: { name: 'Harness WhatsApp', idMasked: '1650••••0123' },
      health: { summary: 'WhatsApp Web 关联设备运行正常', lastCheckedAt: Date.now() },
      error: null,
    },
  }));
  assert.match(markup, /data-im-channel-logo="whatsapp"/);
  assert.match(markup, /WhatsApp Web/);
  assert.match(markup, /检查连接/);
  assert.match(markup, /移除接入/);
  assert.equal((markup.match(/class="ddt-metric dim-botMetric"/g) ?? []).length, 2);
});
