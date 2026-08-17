import assert from 'node:assert/strict';
import test from 'node:test';

import { createImHostPlugin, inject, name } from '../plugin-src/host/index.mjs';

test('Host composes all nine IM channels inside one plugin context', async () => {
  const calls = [];
  const plugin = createImHostPlugin({
    applyFeishu: async (ctx, config) => calls.push(['feishu', ctx, config]),
    applyWeixin: async (ctx, config) => calls.push(['weixin', ctx, config]),
    applyDingtalk: async (ctx, config) => calls.push(['dingtalk', ctx, config]),
    applyWecom: async (ctx, config) => calls.push(['wecom', ctx, config]),
    applyQq: async (ctx, config) => calls.push(['qq', ctx, config]),
    applySlack: async (ctx, config) => calls.push(['slack', ctx, config]),
    applyTelegram: async (ctx, config) => calls.push(['telegram', ctx, config]),
    applyDiscord: async (ctx, config) => calls.push(['discord', ctx, config]),
    applyWhatsapp: async (ctx, config) => calls.push(['whatsapp', ctx, config]),
  });
  const ctx = { marker: 'shared-context' };
  const config = {
    rpcAuthority: 'trusted-host',
    feishu: { domain: 'feishu' },
    weixin: { timeout: 30 },
    dingtalk: { replyTimeoutMs: 60_000 },
    wecom: { replyTimeoutMs: 60_000 },
    qq: { replyTimeoutMs: 60_000 },
    slack: { replyTimeoutMs: 60_000 },
    telegram: { replyTimeoutMs: 60_000 },
    discord: { replyTimeoutMs: 60_000 },
    whatsapp: { replyTimeoutMs: 60_000 },
  };

  await plugin.apply(ctx, config);

  assert.equal(name, 'dsh-im-host');
  assert.deepEqual(inject, ['connection', 'credentials', 'webServer']);
  assert.deepEqual(calls, [
    ['feishu', ctx, { ...config.feishu, rpcAuthority: 'trusted-host' }],
    ['weixin', ctx, { ...config.weixin, rpcAuthority: 'trusted-host' }],
    ['dingtalk', ctx, { ...config.dingtalk, rpcAuthority: 'trusted-host' }],
    ['wecom', ctx, { ...config.wecom, rpcAuthority: 'trusted-host' }],
    ['qq', ctx, { ...config.qq, rpcAuthority: 'trusted-host' }],
    ['slack', ctx, { ...config.slack, rpcAuthority: 'trusted-host' }],
    ['telegram', ctx, { ...config.telegram, rpcAuthority: 'trusted-host' }],
    ['discord', ctx, { ...config.discord, rpcAuthority: 'trusted-host' }],
    ['whatsapp', ctx, { ...config.whatsapp, rpcAuthority: 'trusted-host' }],
  ]);
});

test('Host does not start Weixin when Feishu activation fails', async () => {
  let weixinStarted = false;
  const plugin = createImHostPlugin({
    applyFeishu: async () => { throw new Error('feishu unavailable'); },
    applyWeixin: async () => { weixinStarted = true; },
    applyDingtalk: async () => { throw new Error('DingTalk must not start'); },
    applyWecom: async () => { throw new Error('Enterprise WeChat must not start'); },
    applyQq: async () => { throw new Error('QQ must not start'); },
  });

  await assert.rejects(() => plugin.apply({}, {}), /feishu unavailable/);
  assert.equal(weixinStarted, false);
});

test('Host does not start DingTalk when Weixin activation fails', async () => {
  let dingtalkStarted = false;
  const plugin = createImHostPlugin({
    applyFeishu: async () => {},
    applyWeixin: async () => { throw new Error('weixin unavailable'); },
    applyDingtalk: async () => { dingtalkStarted = true; },
    applyWecom: async () => { throw new Error('Enterprise WeChat must not start'); },
    applyQq: async () => { throw new Error('QQ must not start'); },
  });

  await assert.rejects(() => plugin.apply({}, {}), /weixin unavailable/);
  assert.equal(dingtalkStarted, false);
});

test('Host does not start Enterprise WeChat when DingTalk activation fails', async () => {
  let wecomStarted = false;
  const plugin = createImHostPlugin({
    applyFeishu: async () => {},
    applyWeixin: async () => {},
    applyDingtalk: async () => { throw new Error('dingtalk unavailable'); },
    applyWecom: async () => { wecomStarted = true; },
    applyQq: async () => { throw new Error('QQ must not start'); },
  });

  await assert.rejects(() => plugin.apply({}, {}), /dingtalk unavailable/);
  assert.equal(wecomStarted, false);
});

test('Host does not start QQ when Enterprise WeChat activation fails', async () => {
  let qqStarted = false;
  const plugin = createImHostPlugin({
    applyFeishu: async () => {},
    applyWeixin: async () => {},
    applyDingtalk: async () => {},
    applyWecom: async () => { throw new Error('wecom unavailable'); },
    applyQq: async () => { qqStarted = true; },
  });

  await assert.rejects(() => plugin.apply({}, {}), /wecom unavailable/);
  assert.equal(qqStarted, false);
});
