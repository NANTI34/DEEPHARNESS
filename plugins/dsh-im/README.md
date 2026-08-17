# dsh-im

<p align="center">
  <img src="assets/logo.png" alt="dsh-im logo" width="160">
</p>

<p align="center"><strong>让聊天机器人轻松接入 DeepSeek Harness</strong></p>
<p align="center"><strong>Connect IM bots to DeepSeek Harness with ease</strong></p>

## 中文

通过扫码、App Manifest 或已有机器人凭据把 IM 机器人接入 DeepSeek Harness。一个插件、一个设置入口，统一管理飞书、微信、钉钉、企业微信、QQ、Slack、Telegram、Discord 和 WhatsApp 机器人。

Connect IM bots to DeepSeek Harness by scanning a QR code, using an App Manifest, or entering existing bot credentials. One plugin and one settings entry provide unified management for Feishu, WeChat, DingTalk, WeCom, QQ, Slack, Telegram, Discord, and WhatsApp bots.

## 界面

![IM机器人页面](docs/images/imbot.png)

## 当前内置渠道

- 飞书：扫码创建机器人，或使用已有 App ID + App Secret 绑定机器人，使用长连接收发消息；
- 微信：扫码绑定微信机器人，使用腾讯 iLink 长轮询收发消息；
- 钉钉：扫码创建机器人，或使用已有 Client ID + Client Secret 绑定机器人，使用钉钉 Stream 长连接收消息，并通过 AI Card 流式显示 Harness 回答。
- 企业微信：使用企业微信 App 扫码创建智能机器人，或使用已有 Bot ID + Secret 绑定机器人，通过官方 WebSocket 长连接收消息，原生显示“正在思考中”、工具执行进度和流式回答。
- QQ：使用手机 QQ 扫码创建机器人，或使用已有 AppID + AppSecret 绑定机器人，通过 WebSocket 长连接收消息；私聊支持原生“正在输入”和流式回答，群聊在机器人被 @ 后回复。
- Slack：使用预置 App Manifest 辅助创建并配置应用，再填写 Bot Token（`xoxb-`）与 App Token（`xapp-`），通过 Socket Mode 长连接收消息；私聊直接回复，频道仅在机器人被 @ 时响应，并优先使用 Slack 官方流式消息 API 显示 Harness 回答。
- Telegram：使用 @BotFather 生成的 Bot Token 接入机器人，通过官方 Bot API 长轮询收消息；私聊直接回复，群聊仅在机器人被提及或收到对机器人消息的回复时响应，并通过编辑消息流式显示 Harness 回答。
- Discord：使用 Developer Portal 生成的 Bot Token 接入机器人，通过 Gateway v10 长连接收消息；私信直接回复，服务器频道仅在机器人被提及时响应，并通过编辑消息流式显示 Harness 回答。
- WhatsApp：使用手机 WhatsApp 扫码关联设备，通过 WhatsApp Web 长连接收消息；收到消息后显示已读和“正在输入”，再发送 Harness 的最终回答。

其他 IM 平台可继续按同一渠道适配器结构接入。

## 安装

```sh
npx -y github:xmanrui/dsh-im install
```

也可以直接从 npm 安装：

```sh
dsh plugin --profile web add @xmanrui/dsh-im
```

重启 `dsh web`，然后打开「设置 → 插件 → IM机器人」。安装器会用 `dsh-im` 替换 profile 中直接安装的 `dsh-feishu`、`dsh-weixin` 和 `dsh-dingtalk`，但不删除任何渠道数据；原有渠道凭据和扫码绑定会继续使用。

飞书、QQ、钉钉和企业微信页面都提供两种入口：带二维码图标的蓝色「扫码接入机器人」按钮走平台官方扫码流程，右侧带钥匙图标的白色描边「手动接入」按钮连接已经创建的机器人应用。飞书和 QQ 分别填写 App ID + App Secret、AppID + AppSecret；钉钉填写官方 Client ID + Client Secret；企业微信填写官方 Bot ID + Secret。Secret 只提交给本机 Harness Host，并写入受保护的凭据存储；状态接口和机器人列表不会回传 Secret。

Telegram 和 Discord 没有官方扫码创建机器人流程，因此页面只显示带钥匙图标的「手动接入」入口，并只要求 Bot Token。Telegram Token 由 @BotFather 生成；若该机器人已经配置 Webhook，需要先由原服务移除 Webhook，Bot API 长轮询才能接管消息。Discord Token 来自 Developer Portal 的 Bot 页面；还需把机器人邀请到目标服务器，并授予查看频道、发送消息和读取历史消息权限。本插件只读取私信和明确提及机器人的服务器消息，因此不要求 Message Content 特权 Intent。

Slack 页面提供 Manifest 辅助创建与双 Token 接入。点击「开始接入」，复制页面提供的 App Manifest，再打开 Slack 创建页并选择 **From a manifest**；创建后在 **Basic Information → App-Level Tokens** 生成包含 `connections:write` 的 App Token，并在 **OAuth & Permissions** 将应用安装到工作区以取得 Bot Token。插件会验证两个 Token，再通过 Socket Mode 建立连接；Slack 没有官方扫码创建机器人流程。两个 Token 只提交到本机 Harness Host 并写入受保护的凭据存储，状态接口和机器人列表不会回传 Token。

WhatsApp 页面只显示「扫码接入机器人」。打开手机 WhatsApp 的「设置 → 已关联设备 → 关联设备」，扫描 Harness 页面中的二维码即可，不需要 Meta 控制台、Cloud API、Webhook、Phone Number ID 或 Access Token。关联设备状态只保存在本机 `~/.dsh/integrations/dsh-whatsapp/auth`，浏览器只会收到一次性二维码和脱敏后的账号状态。个人账号可在 WhatsApp 的「给自己发消息」会话中直接使用；插件按消息 ID 过滤自己的回复，避免形成回复循环。

建议为机器人准备独立 WhatsApp 号码。关联个人常用账号会让发给该账号的私聊消息成为 Harness 输入；群聊只有明确提及该账号或回复该账号消息时才会触发。请只把机器人号码开放给可信联系人，并在不再使用时同时从 Harness 和手机「已关联设备」中移除。

钉钉扫码接入时，请使用已加入企业/组织且有权创建机器人的钉钉账号扫描页面二维码，再在钉钉授权页点击「一键创建新机器人」。若提示“该账号还未加入组织”，请先创建组织或换用已加入组织的账号后重新扫码。插件不设置本机二次批准流程，钉钉中的机器人可见范围就是入站访问范围，请只开放给信任的组织、群或成员。

企业微信扫码接入时，请使用已加入企业且具有机器人创建或管理权限的企业微信账号，并在手机端确认创建智能机器人。扫码创建的是企业微信智能机器人，不是让插件直接登录个人微信账号。无论扫码还是凭据绑定，企业微信中的机器人可见范围就是入站访问范围，请只开放给信任的企业成员和群聊。

QQ 扫码接入使用腾讯 QQBot v2 官方流程。默认腾讯授权页会把接入方显示为“第三方机器人”；扫码成功后创建的是 QQ 开放平台机器人，并不是让插件直接控制个人 QQ 账号。扫码绑定只接受扫码者的消息；手动凭据无法识别扫码人，因此使用 QQ 开放平台中的机器人可见范围作为入站访问范围。

飞书扫码绑定会把扫码者作为允许使用者；手动凭据同样无法识别扫码人，因此使用飞书应用的可见范围作为入站访问范围。请在飞书开放平台中只向信任的租户、群或成员开放应用。

## 设计

- Harness 中只注册一个「IM机器人」设置页；
- 九个渠道的 Host、客户端与运行时源码都在本仓库维护，不依赖外部独立渠道插件；
- 设置页跟随 DeepSeek Harness 的语言选择，在中文和 English 之间即时切换；
- 左侧使用渠道 Logo 切换微信、飞书、钉钉、企业微信、QQ、Slack、Telegram、Discord 和 WhatsApp，不使用启用/停用开关；
- 九个渠道保持独立的 RPC、凭据、连接监督和会话映射；
- 浏览器只获得二维码、Manifest 和脱敏状态；手动输入的 Secret 或 Token 仅单向提交给本机 Host，任何 RPC 响应都不会返回 App Secret、`bot_token`、钉钉 `client_secret`、企业微信 Secret、QQ `app_secret`、Slack Bot/App Token、Telegram/Discord Bot Token、WhatsApp 关联设备密钥或原始用户标识。

## 本地开发

```sh
npm install
npm run check
node bin/dsh-im.mjs install --source .
```

`npm run check` 运行单元测试、构建 Host/Client 产物，并验证发布包不包含凭据或独立渠道设置页注册。

IM 管理 RPC 默认仅接受回环浏览器。如果 Web profile 在受信任的局域网内对外提供服务，可在该 profile 的 `cordis.patch.yml` 中显式开放给 Connection 已信任的 Host authority：

```yaml
- id: xmanrui-dsh-im
  config:
    rpcAuthority: trusted-host
```

`trusted-host` 只复用 Harness 的 Host／Origin 防护，不是用户认证。启用后，能访问该局域网地址的人也能查看机器人状态、扫码或提交应用凭据、重连和删除机器人；只应在可信网络中使用。

---

## English

Connect IM bots to DeepSeek Harness by scanning a QR code, using an App Manifest, or entering existing bot credentials. One plugin and one settings entry provide unified management for Feishu, WeChat, DingTalk, WeCom, QQ, Slack, Telegram, Discord, and WhatsApp bots.

> GitHub description: Connect IM bots to DeepSeek Harness by QR code, App Manifest, or bot credentials (supports Feishu, WeChat, DingTalk, WeCom, QQ, Slack, Telegram, Discord, and WhatsApp).

## Interface

![IM bot settings page](docs/images/imbot.png)

## Built-in channels

- Feishu: create a bot by QR code or bind an existing bot with App ID + App Secret, then send and receive messages over a persistent connection.
- WeChat: bind a WeChat bot by scanning a QR code, then send and receive messages through Tencent iLink long polling.
- DingTalk: create a bot by QR code or bind an existing bot with Client ID + Client Secret, receive messages through DingTalk Stream, and stream Harness replies through AI Cards.
- WeCom: create an intelligent bot by QR code or bind an existing bot with Bot ID + Secret, receive messages over the official WebSocket connection, and natively show a thinking state, tool progress, and streaming replies.
- QQ: create a bot by QR code or bind an existing bot with AppID + AppSecret, receive messages over a WebSocket connection, stream private-chat replies with a native typing indicator, and reply in groups when mentioned.
- Slack: use the bundled App Manifest to create and configure an app, enter its Bot Token (`xoxb-`) and App Token (`xapp-`), receive events over Socket Mode, reply directly in DMs and only when mentioned in channels, and prefer Slack's native streaming-message API for Harness output.
- Telegram: bind a BotFather-created bot with its Bot Token, receive messages through Bot API long polling, reply directly in private chats, require a mention or reply in groups, and stream Harness output by editing the reply.
- Discord: bind a Developer Portal bot with its Bot Token, receive events through Gateway v10, reply directly in DMs, require a mention in server channels, and stream Harness output by editing the reply.
- WhatsApp: scan a QR code to link a WhatsApp device, receive messages over WhatsApp Web, show a native read receipt and typing indicator, and then send the final Harness answer.

Other IM platforms can be added through the same channel-adapter structure.

## Installation

```sh
npx -y github:xmanrui/dsh-im install
```

Alternatively, install it directly from npm:

```sh
dsh plugin --profile web add @xmanrui/dsh-im
```

Restart `dsh web`, then open **Settings → Plugins → IM Bot**. The installer replaces directly installed `dsh-feishu`, `dsh-weixin`, and `dsh-dingtalk` entries in the profile with `dsh-im` without deleting channel data.

Feishu, QQ, DingTalk, and WeCom each provide two entry points. The blue **QR access** action uses the platform QR flow; the key-marked, outlined **Manual access** action immediately to its right connects an existing bot application. Feishu and QQ use App ID + App Secret and AppID + AppSecret respectively, DingTalk uses Client ID + Client Secret, and WeCom uses Bot ID + Secret. Secrets are sent only to the local Harness Host and stored through its protected credential provider; status responses and bot lists never return them.

Telegram and Discord do not provide an official QR flow for creating bots, so their pages expose only the key-marked **Manual access** action and request a Bot Token. Generate the Telegram token with BotFather; an existing webhook must be removed by its current service before Bot API long polling can receive updates. Generate the Discord token on the Developer Portal's Bot page, invite the bot to the target server, and grant View Channel, Send Messages, and Read Message History. The plugin reads DMs and server messages that explicitly mention the bot, so it does not request the privileged Message Content intent.

Slack provides Manifest-assisted creation with dual-Token access. Choose **Start setup**, copy the bundled App Manifest, open Slack's create page, and select **From a manifest**. Under **Basic Information → App-Level Tokens**, generate an App Token with `connections:write`; then install the app to the workspace under **OAuth & Permissions** to obtain the Bot Token. The plugin validates both Tokens before opening Socket Mode. Slack has no official QR-based bot-creation flow. Both Tokens are sent only to the local Harness Host and stored through its protected credential provider; status responses and bot lists never return them.

WhatsApp exposes only **QR access**. On the phone, open **WhatsApp → Settings → Linked devices → Link a device**, then scan the QR code shown by Harness. No Meta console, Cloud API, Webhook, Phone Number ID, or Access Token is required. Linked-device state stays under `~/.dsh/integrations/dsh-whatsapp/auth`; the browser receives only the one-time QR code and redacted account status. Personal accounts can use WhatsApp's **Message yourself** chat directly; the plugin suppresses only its own exact reply message IDs to prevent reply loops.

Use a dedicated WhatsApp number for the bot when possible. Linking a personal account makes DMs sent to that account eligible Harness input; group messages trigger only when they mention or reply to the linked account. Limit the number to trusted contacts, and remove the device from both Harness and the phone's **Linked devices** list when it is no longer used.

For DingTalk QR binding, scan with an account that belongs to an enterprise or organization and can create bots, then choose **Create a new bot** on the authorization page. If DingTalk reports that the account has not joined an organization, create one or switch to an account that has, then scan again. There is no second local sender-approval flow: the bot's DingTalk visibility is its inbound access scope, so restrict it to trusted organizations, groups, or members.

For WeCom QR binding, scan with an account that belongs to an enterprise and can create or manage bots, then confirm creation of the intelligent bot in the mobile app. This creates a WeCom intelligent bot; it does not sign the plugin into a personal WeChat account. For both QR and credential binding, restrict the bot's WeCom visibility to trusted enterprise members and group chats.

QQ QR binding uses Tencent's official QQBot v2 flow. Tencent's default authorization page labels the integration as a third-party bot. Scanning creates a QQ Open Platform bot; it does not give the plugin direct control of a personal QQ account. QR binding accepts only the scanner's messages. Manual credentials cannot identify a scanner, so the bot's QQ Open Platform visibility becomes its inbound access scope.

Feishu QR binding records the scanner as an allowed user. Manual credentials cannot identify a scanner, so the Feishu application's visibility becomes its inbound access scope. Restrict the application to trusted tenants, groups, or members.

## Design

- Registers a single **IM Bot** settings page in Harness.
- Maintains all nine channel Host, client, and runtime sources in this repository without external standalone channel plugins.
- Follows the DeepSeek Harness language preference and switches the settings UI live between Chinese and English.
- Uses channel logos for WeChat, Feishu, DingTalk, WeCom, QQ, Slack, Telegram, Discord, and WhatsApp navigation without enable/disable switches.
- Keeps RPC endpoints, credentials, connection supervision, and session mappings isolated by channel.
- Returns only QR codes, the public Slack Manifest, and redacted status data to the browser. Manually entered secrets and Tokens travel one way to the local Host; no RPC response returns App Secrets, `bot_token`, DingTalk `client_secret`, WeCom Secrets, QQ `app_secret`, Slack Bot/App Tokens, Telegram/Discord Bot Tokens, WhatsApp linked-device keys, or raw user identifiers.

## Local development

```sh
npm install
npm run check
node bin/dsh-im.mjs install --source .
```

`npm run check` runs unit tests, builds the Host and Client artifacts, and verifies that the published package contains neither credentials nor standalone channel settings-page registrations.

IM management RPCs accept loopback browsers by default. When a Web profile is deliberately served on a trusted LAN, opt the plugin into the Host authorities already trusted by Connection in that profile's `cordis.patch.yml`:

```yaml
- id: xmanrui-dsh-im
  config:
    rpcAuthority: trusted-host
```

`trusted-host` reuses Harness's Host/Origin fence; it is not user authentication. Anyone who can reach that LAN authority can inspect bot status, scan or submit application credentials, reconnect bots, and remove bots. Enable it only on a trusted network.

---

## 联系方式 / Contact

欢迎通过邮箱、微信或小红书联系我。

You can reach me by email, WeChat, or Xiaohongshu.

<table>
  <tr>
    <th align="center">邮箱 / Email</th>
    <th align="center">微信 / WeChat</th>
    <th align="center">小红书 / Xiaohongshu</th>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="mailto:longmanr307@gmail.com">longmanr307@gmail.com</a>
    </td>
    <td align="center" valign="top">
      <a href="docs/images/weixin.jpg"><img src="docs/images/weixin.jpg" alt="微信二维码 / WeChat QR code" width="240"></a>
    </td>
    <td align="center" valign="top">
      <a href="docs/images/xhs.jpg"><img src="docs/images/xhs.jpg" alt="小红书二维码 / Xiaohongshu QR code" width="240"></a>
    </td>
  </tr>
</table>
