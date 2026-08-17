import * as React from 'react';

import {
  DingtalkLogoGlyph,
  DiscordLogoGlyph,
  FeishuLogoGlyph,
  QqLogoGlyph,
  SlackLogoGlyph,
  TelegramLogoGlyph,
  WecomLogoGlyph,
  WeixinLogoGlyph,
  WhatsappLogoGlyph,
} from './channel-logos.js';
import { DINGTALK_RPC_CHANNEL } from './channels/dingtalk/api.js';
import { DingtalkSettingsTab } from './channels/dingtalk/index.js';
import { DISCORD_RPC_CHANNEL } from './channels/discord/api.js';
import { DiscordSettingsTab } from './channels/discord/index.js';
import { installDiscordStyles } from './channels/discord/styles.js';
import { FeishuSettingsTab } from './channels/feishu/index.js';
import { FEISHU_RPC_CHANNEL } from './channels/feishu/api.js';
import { installFeishuStyles } from './channels/feishu/styles.js';
import { QQ_RPC_CHANNEL } from './channels/qq/api.js';
import { QqSettingsTab } from './channels/qq/index.js';
import { installQqStyles } from './channels/qq/styles.js';
import { SLACK_RPC_CHANNEL } from './channels/slack/api.js';
import { SlackSettingsTab } from './channels/slack/index.js';
import { installSlackStyles } from './channels/slack/styles.js';
import { TELEGRAM_RPC_CHANNEL } from './channels/telegram/api.js';
import { TelegramSettingsTab } from './channels/telegram/index.js';
import { installTelegramStyles } from './channels/telegram/styles.js';
import { WECOM_RPC_CHANNEL } from './channels/wecom/api.js';
import { WecomSettingsTab } from './channels/wecom/index.js';
import { installWecomStyles } from './channels/wecom/styles.js';
import { WeixinSettingsTab } from './channels/weixin/index.js';
import { WEIXIN_RPC_CHANNEL } from './channels/weixin/api.js';
import { installWeixinStyles } from './channels/weixin/styles.js';
import { WHATSAPP_RPC_CHANNEL } from './channels/whatsapp/api.js';
import { WhatsappSettingsTab } from './channels/whatsapp/index.js';
import { installWhatsappStyles } from './channels/whatsapp/styles.js';
import { en, h, IM_LOCALE_NAMESPACE, setImTranslator, zh } from './i18n.js';
import { installImStyles } from './styles.js';

export const name = 'im-settings';
export const inject = ['slots', 'connection', 'locale'];

const IM_PLUGIN_LOGO_URL = globalThis.__DSH_IM_LOGO_DATA_URL__ ?? 'assets/logo-icon.png';

const CHANNELS = Object.freeze([
  { id: 'weixin', label: '微信' },
  { id: 'feishu', label: '飞书' },
  { id: 'dingtalk', label: '钉钉' },
  { id: 'wecom', label: '企业微信' },
  { id: 'qq', label: 'QQ' },
  { id: 'slack', label: 'Slack' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'discord', label: 'Discord' },
  { id: 'whatsapp', label: 'WhatsApp' },
]);

function WeixinLogo() {
  return h('span', { className: 'dim-logo dim-logoWeixin', 'aria-hidden': 'true' },
    h(WeixinLogoGlyph));
}

function FeishuLogo() {
  return h('span', { className: 'dim-logo dim-logoFeishu', 'aria-hidden': 'true' },
    h(FeishuLogoGlyph));
}

function DingtalkLogo() {
  return h('span', { className: 'dim-logo dim-logoDingtalk', 'aria-hidden': 'true' },
    h(DingtalkLogoGlyph));
}

function QqLogo() {
  return h('span', { className: 'dim-logo dim-logoQq', 'aria-hidden': 'true' }, h(QqLogoGlyph));
}

function WecomLogo() {
  return h('span', { className: 'dim-logo dim-logoWecom', 'aria-hidden': 'true' }, h(WecomLogoGlyph));
}

function TelegramLogo() {
  return h('span', { className: 'dim-logo dim-logoTelegram', 'aria-hidden': 'true' },
    h(TelegramLogoGlyph));
}

function SlackLogo() {
  return h('span', { className: 'dim-logo dim-logoSlack', 'aria-hidden': 'true' },
    h(SlackLogoGlyph));
}

function DiscordLogo() {
  return h('span', { className: 'dim-logo dim-logoDiscord', 'aria-hidden': 'true' },
    h(DiscordLogoGlyph));
}

function WhatsappLogo() {
  return h('span', { className: 'dim-logo dim-logoWhatsapp', 'aria-hidden': 'true' },
    h(WhatsappLogoGlyph));
}

function ChannelLogo({ channel }) {
  if (channel === 'weixin') return h(WeixinLogo);
  if (channel === 'feishu') return h(FeishuLogo);
  if (channel === 'dingtalk') return h(DingtalkLogo);
  if (channel === 'wecom') return h(WecomLogo);
  if (channel === 'qq') return h(QqLogo);
  if (channel === 'slack') return h(SlackLogo);
  if (channel === 'telegram') return h(TelegramLogo);
  if (channel === 'discord') return h(DiscordLogo);
  return h(WhatsappLogo);
}

export function IMSettingsTab({
  dingtalkRpcCall,
  discordRpcCall,
  feishuRpcCall,
  qqRpcCall,
  slackRpcCall,
  telegramRpcCall,
  wecomRpcCall,
  weixinRpcCall,
  whatsappRpcCall,
}) {
  const [selected, setSelected] = React.useState('weixin');
  const githubTooltipId = React.useId();
  const active = CHANNELS.find((channel) => channel.id === selected) ?? CHANNELS[0];
  return h('section', { className: 'dim-page', 'aria-label': 'IM机器人设置' },
    h('header', { className: 'dim-title' },
      h('div', { className: 'dim-brand' },
        h('img', {
          className: 'dim-brandLogo',
          src: IM_PLUGIN_LOGO_URL,
          alt: 'dsh-im',
          width: 48,
          height: 48,
        }),
        h('p', null, '让聊天机器人轻松接入 DeepSeek Harness')),
      h('span', { className: 'dim-githubAction' },
        h('a', {
          className: 'dim-githubLink',
          href: 'https://github.com/xmanrui/dsh-im',
          target: '_blank',
          rel: 'noopener noreferrer',
          'aria-label': 'dsh-im GitHub',
          'aria-describedby': githubTooltipId,
        },
        h('span', null, 'GitHub'),
        h('span', { className: 'dim-githubArrow', 'aria-hidden': 'true' }, '↗')),
        h('span', {
          id: githubTooltipId,
          className: 'dim-githubTooltip',
          role: 'tooltip',
        }, '帮助与反馈 · 前往 GitHub')),
    ),
    h('div', { className: 'dim-layout' },
      h('nav', { className: 'dim-rail', role: 'tablist', 'aria-label': 'IM 渠道' },
        CHANNELS.map((channel) => h('button', {
          key: channel.id,
          type: 'button',
          role: 'tab',
          id: `dim-tab-${channel.id}`,
          className: 'dim-channel',
          'aria-selected': channel.id === active.id,
          'aria-controls': `dim-panel-${channel.id}`,
          onClick: () => setSelected(channel.id),
        },
        h(ChannelLogo, { channel: channel.id }),
        h('span', { className: 'dim-channelCopy' },
          h('strong', null, channel.label),
        )))),
      h('div', { className: 'dim-divider', 'aria-hidden': 'true' }),
      h('main', {
        className: 'dim-panel',
        role: 'tabpanel',
        id: `dim-panel-${active.id}`,
        'aria-labelledby': `dim-tab-${active.id}`,
      }, active.id === 'weixin'
        ? h(WeixinSettingsTab, { rpcCall: weixinRpcCall })
        : active.id === 'feishu'
          ? h(FeishuSettingsTab, { rpcCall: feishuRpcCall })
          : active.id === 'dingtalk'
            ? h(DingtalkSettingsTab, { rpcCall: dingtalkRpcCall })
            : active.id === 'wecom'
              ? h(WecomSettingsTab, { rpcCall: wecomRpcCall })
              : active.id === 'qq'
                ? h(QqSettingsTab, { rpcCall: qqRpcCall })
                : active.id === 'slack'
                  ? h(SlackSettingsTab, { rpcCall: slackRpcCall })
                : active.id === 'telegram'
                  ? h(TelegramSettingsTab, { rpcCall: telegramRpcCall })
                  : active.id === 'discord'
                    ? h(DiscordSettingsTab, { rpcCall: discordRpcCall })
                    : h(WhatsappSettingsTab, { rpcCall: whatsappRpcCall })),
    ),
  );
}

export function apply(ctx) {
  ctx.effect(
    () => ctx.locale.register(IM_LOCALE_NAMESPACE, { zh, en }),
    'im-settings: bilingual dictionaries',
  );
  const t = ctx.locale.bind(IM_LOCALE_NAMESPACE);
  setImTranslator(t);

  ctx.effect(() => {
    const disposers = [
      installFeishuStyles(),
      installWeixinStyles(),
      installWecomStyles(),
      installQqStyles(),
      installSlackStyles(),
      installTelegramStyles(),
      installDiscordStyles(),
      installWhatsappStyles(),
      installImStyles(),
    ];
    return () => {
      for (const dispose of disposers.reverse()) dispose();
    };
  }, 'im-settings: install combined channel styles');

  const feishuRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(FEISHU_RPC_CHANNEL, endpoint, payload, signal);
  const weixinRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(WEIXIN_RPC_CHANNEL, endpoint, payload, signal);
  const dingtalkRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(DINGTALK_RPC_CHANNEL, endpoint, payload, signal);
  const qqRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(QQ_RPC_CHANNEL, endpoint, payload, signal);
  const wecomRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(WECOM_RPC_CHANNEL, endpoint, payload, signal);
  const telegramRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(TELEGRAM_RPC_CHANNEL, endpoint, payload, signal);
  const discordRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(DISCORD_RPC_CHANNEL, endpoint, payload, signal);
  const whatsappRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(WHATSAPP_RPC_CHANNEL, endpoint, payload, signal);
  const slackRpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(SLACK_RPC_CHANNEL, endpoint, payload, signal);

  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'im',
    order: 20,
    label: () => t('IM机器人'),
    locale: IM_LOCALE_NAMESPACE,
    inject: () => ({
      dingtalkRpcCall,
      discordRpcCall,
      feishuRpcCall,
      qqRpcCall,
      slackRpcCall,
      telegramRpcCall,
      wecomRpcCall,
      weixinRpcCall,
      whatsappRpcCall,
    }),
  }, IMSettingsTab));
}
