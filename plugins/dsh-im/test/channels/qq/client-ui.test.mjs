import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { AccountCard, QqSettingsTab } from '../../../plugin-src/client/channels/qq/index.js';

test('QQ settings uses the shared compact channel toolbar', () => {
  const markup = renderToStaticMarkup(React.createElement(QqSettingsTab, {
    rpcCall: async () => ({ ok: true, value: {} }),
  }));
  assert.match(markup, /class="ddt-page dqq-page dim-channelPage"/);
  assert.match(markup, /class="ddt-button dim-scanButton"/);
  assert.match(markup, /aria-label="扫码接入 QQ 机器人"/);
  assert.match(markup, /class="dim-actionIcon"[^]*扫码接入机器人/);
  assert.doesNotMatch(markup, /凭据仅保存在本机|role="switch"|type="checkbox"/);
});

test('QQ bot cards match the shared two-metric card treatment', () => {
  const markup = renderToStaticMarkup(React.createElement(AccountCard, {
    account: {
      botId: 'qq_bot',
      connected: true,
      state: 'connected',
      bot: { name: 'QQ机器人', appIdMasked: '123••••456' },
      health: { summary: 'QQ WebSocket 长连接运行正常', lastCheckedAt: Date.now() },
      error: null,
    },
    onReconnect() {},
    onRequestRemove() {},
    onConfirmRemove() {},
    onCancelRemove() {},
  }));
  assert.match(markup, /class="ddt-card dim-botCard"/);
  assert.match(markup, /data-im-channel-logo="qq"/);
  assert.equal((markup.match(/class="ddt-metric dim-botMetric"/g) ?? []).length, 2);
  assert.match(markup, />消息通道<[^]*>最近检查</);
  assert.match(markup, />检查连接<[^]*>移除接入</);
  assert.doesNotMatch(markup, /收到\s*\/\s*回复|dim-cardSummary|QQ WebSocket 长连接运行正常/);

  const offlineMarkup = renderToStaticMarkup(React.createElement(AccountCard, {
    account: {
      botId: 'qq_bot', connected: false, state: 'error',
      bot: { name: 'QQ机器人', appIdMasked: '123••••456' },
      health: { summary: '连接失败，请检查凭据', lastCheckedAt: Date.now() },
      error: null,
    },
    onReconnect() {}, onRequestRemove() {}, onConfirmRemove() {}, onCancelRemove() {},
  }));
  assert.match(offlineMarkup, /class="ddt-summary dim-cardSummary">连接失败，请检查凭据</);
});
