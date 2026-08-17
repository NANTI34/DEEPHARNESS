import * as React from 'react';

export const IM_LOCALE_NAMESPACE = 'dsh-im';

const EN = Object.freeze({
  '$locale': 'en',
  'IM机器人': 'IM bots',
  'IM机器人设置': 'IM bot settings',
  'IM 渠道': 'IM channels',
  '让聊天机器人轻松接入 DeepSeek Harness': 'Connect IM bots to DeepSeek Harness with ease',
  '帮助与反馈 · 前往 GitHub': 'Help & feedback · Open GitHub',
  '微信': 'WeChat',
  '飞书': 'Feishu',
  '钉钉': 'DingTalk',
  '企业微信': 'WeCom',
  '微信机器人': 'WeChat bot',
  '飞书机器人': 'Feishu bot',
  '钉钉机器人': 'DingTalk bot',
  '企业微信机器人': 'WeCom bot',
  'QQ机器人': 'QQ bot',
  'WhatsApp机器人': 'WhatsApp bot',
  'WhatsApp账号': 'WhatsApp account',
  '微信设置': 'WeChat settings',
  '飞书机器人设置': 'Feishu bot settings',
  '钉钉设置': 'DingTalk settings',
  '企业微信设置': 'WeCom settings',
  '扫码接入机器人': 'Scan QR code',
  '正在接入': 'Connecting',
  '手动接入': 'Manual setup',
  '收起凭据': 'Hide credentials',
  '收起接入': 'Hide setup',
  '接入机器人': 'Connect bot',
  '开始接入': 'Start setup',
  '在线': 'online',
  '运行正常': 'Connected',
  '正在连接': 'Connecting',
  '正在连接…': 'Connecting…',
  '连接未就绪': 'Not connected',
  '连接中': 'Connecting',
  '连接中断': 'Disconnected',
  '需要处理': 'Needs attention',
  '状态未知': 'Unknown status',
  '离线': 'Offline',
  '已断开': 'Disconnected',
  '消息通道': 'Message channel',
  '最近检查': 'Last checked',
  '尚未检查': 'Not checked yet',
  '刚刚': 'Just now',
  '检查连接': 'Check connection',
  '检查中…': 'Checking…',
  '重试连接': 'Reconnect',
  '重试中…': 'Retrying…',
  '移除接入': 'Remove connection',
  '确认移除接入': 'Remove connection',
  '确认移除': 'Remove',
  '正在移除…': 'Removing…',
  '保留机器人': 'Keep bot',
  '保留账号': 'Keep account',
  '取消': 'Cancel',
  '关闭': 'Close',
  '立即重试': 'Retry now',
  '重新读取': 'Reload',
  '重新生成二维码': 'Generate a new QR code',
  '重新生成二维码后继续': 'Generate a new QR code',
  '刷新二维码': 'Refresh QR code',
  '刷新中…': 'Refreshing…',
  '换一个二维码': 'Get another QR code',
  '继续连接': 'Continue connecting',
  '绑定并连接': 'Connect',
  '正在绑定…': 'Connecting…',
  '验证并连接': 'Verify and connect',
  '正在验证并连接…': 'Verifying and connecting…',
  '正在验证…': 'Verifying…',
  '操作失败，请稍后重试': 'The operation failed. Try again later.',
  '请稍后重试': 'Try again later.',
  '当前二维码有效时间': 'QR code expires in',
  '二维码有效时间': 'QR code expires in',
  '二维码已过期': 'QR code expired',
  '二维码已失效': 'QR code expired',
  '二维码已过期\n请重新生成': 'QR code expired\nGenerate a new one',
  '二维码图片正在生成…': 'Generating QR code…',
  '二维码正在生成…': 'Generating QR code…',
  '二维码正在自动刷新…': 'Refreshing QR code…',
  '二维码未就绪，请打开授权链接': 'The QR code is not ready. Open the authorization link.',
  '二维码图片未就绪，请使用备用链接。': 'The QR code is not ready. Use the alternate link.',
  '二维码图片未就绪，请重新生成。': 'The QR code is not ready. Generate a new one.',
  '等待刷新': 'Waiting to refresh',
  '正在刷新二维码': 'Refreshing QR code',
  '打开备用链接': 'Open alternate link',
  '生成二维码': 'Generate QR code',
  '生成微信二维码': 'Generate WeChat QR code',
  '生成飞书二维码': 'Generate Feishu QR code',
  '生成钉钉二维码': 'Generate DingTalk QR code',
  '生成企业微信二维码': 'Generate WeCom QR code',
  '生成 QQ 二维码': 'Generate QQ QR code',
  '正在生成二维码…': 'Generating QR code…',
  '正在准备授权二维码': 'Preparing authorization QR code',
  '正在准备微信二维码': 'Preparing WeChat QR code',
  '正在添加新机器人': 'Adding a new bot',
  '正在申请钉钉授权二维码…': 'Requesting DingTalk authorization QR code…',
  '正在申请企业微信二维码…': 'Requesting WeCom QR code…',
  '正在申请 QQ 二维码…': 'Requesting QQ QR code…',
  '正在生成 WhatsApp 二维码': 'Generating WhatsApp QR code',
  '扫码，创建第一个飞书入口': 'Scan to create your first Feishu bot',
  '扫码只会新增一个机器人，已接入的机器人会继续正常收发消息。': 'Scanning adds one bot. Existing bots will continue to send and receive messages.',
  '无需手动填写 App ID。以后还可以继续添加机器人，分别服务不同团队或飞书租户。': 'No App ID is required. You can add more bots later for different teams or Feishu tenants.',
  '使用飞书扫码创建机器人': 'Scan with Feishu to create a bot',
  '刷新二维码后继续': 'Refresh the QR code to continue',
  '打开飞书移动端，使用扫一扫读取二维码': 'Open Feishu on your phone and scan the QR code',
  '核对应用名称与权限范围，并确认创建': 'Review the app name and permissions, then confirm',
  '保持本页打开，等待新机器人的长连接就绪': 'Keep this page open until the bot connection is ready',
  '在飞书中打开': 'Open in Feishu',
  '取消添加': 'Cancel',
  '已确认，正在连接新机器人': 'Confirmed. Connecting the new bot',
  '正在安全保存凭据并检查新机器人的消息通道，其他机器人不会中断。': 'Saving credentials and checking the new bot connection. Existing bots will not be interrupted.',
  '正在向飞书申请一次性授权二维码，请稍候。': 'Requesting a one-time authorization QR code from Feishu…',
  '新机器人没有添加完成': 'The new bot was not added',
  '新飞书机器人已连接，可以开始聊天。': 'The new Feishu bot is connected and ready to chat.',
  '飞书应用创建失败': 'Could not create the Feishu app',
  '机器人已经创建，但暂时无法确认连接状态': 'The bot was created, but its connection could not be confirmed yet',
  '机器人仍未连接': 'The bot is still offline',
  '机器人尚未连接': 'The bot is not connected yet',
  '长连接运行正常': 'Persistent connection is healthy',
  '长连接': 'Persistent connection',
  '应用标识已安全保存': 'App identifier stored securely',
  '机器人标识已安全保存': 'Bot identifier stored securely',
  '已安全保存': 'Stored securely',
  '已接入的微信账号': 'Connected WeChat accounts',
  '已接入的机器人': 'Connected bots',
  '已接入的钉钉机器人': 'Connected DingTalk bots',
  '已绑定的企业微信机器人': 'Connected WeCom bots',
  '已绑定的 QQ 机器人': 'Connected QQ bots',
  '已接入的 WhatsApp 机器人': 'Connected WhatsApp accounts',
  '使用手机微信扫描二维码': 'Scan with WeChat on your phone',
  '扫一次码，就能在微信里使用 Harness': 'Scan once to use Harness in WeChat',
  '打开手机微信并扫描左侧二维码': 'Open WeChat on your phone and scan the QR code',
  '在微信中确认连接该机器人': 'Confirm the bot connection in WeChat',
  '保持本页打开，等待机器人自动连接': 'Keep this page open while the bot connects',
  '等待微信扫码': 'Waiting for WeChat scan',
  '需要配对码': 'Pairing code required',
  '输入手机微信显示的数字': 'Enter the number shown in WeChat',
  '微信配对码': 'WeChat pairing code',
  '已扫码，请在手机上确认': 'Scanned. Confirm on your phone',
  '配对码已提交，正在等待微信确认。': 'Pairing code submitted. Waiting for WeChat confirmation.',
  '这是微信附加的安全确认步骤。配对码只用于本次扫码轮询，不会写入配置或日志。': 'This is an additional WeChat confirmation step. The pairing code is used only for this connection and is never stored.',
  '正在保存凭据并验证 Harness 与微信长轮询。': 'Saving credentials and verifying the WeChat connection.',
  '微信已确认，正在启动消息连接': 'Confirmed in WeChat. Starting the message connection',
  '微信已绑定，可以开始向已绑定的机器人发消息。': 'WeChat is connected and ready for messages.',
  '这个微信账号已经绑定并保持在线。': 'This WeChat account is connected and online.',
  '微信账号及本机凭据已移除。': 'The WeChat account and local credentials were removed.',
  '已取消微信绑定。': 'WeChat setup was cancelled.',
  '正在联系腾讯微信 iLink 服务。': 'Contacting the WeChat iLink service.',
  'iLink 长轮询': 'iLink long polling',
  '扫一次码，自动创建并连接机器人': 'Scan once to create and connect a bot',
  '使用钉钉 App 完成机器人授权': 'Authorize the bot with the DingTalk app',
  '使用已加入企业/组织的钉钉账号扫描左侧二维码': 'Scan the QR code with a DingTalk account that belongs to an organization',
  '在授权页点击“一键创建新机器人”': 'Select “Create new bot” on the authorization page',
  '请勿关闭本页，钉钉完成授权后将自动继续。': 'Keep this page open. Setup will continue after DingTalk authorization.',
  '等待钉钉扫码授权': 'Waiting for DingTalk authorization',
  '授权已确认，正在创建钉钉机器人': 'Authorized. Creating the DingTalk bot',
  '正在确认钉钉授权': 'Confirming DingTalk authorization',
  '正在检查钉钉 Stream 长连接，成功后会自动显示为在线。': 'Checking the DingTalk Stream connection. It will appear online when ready.',
  '钉钉机器人已接入，可以开始发送消息。': 'The DingTalk bot is connected and ready for messages.',
  '这个钉钉机器人已经接入并保持在线。': 'This DingTalk bot is connected and online.',
  'Stream 长连接': 'Stream persistent connection',
  '使用企业微信 App 扫码创建智能机器人': 'Scan with WeCom to create an AI bot',
  '使用企业微信 App 完成智能机器人授权': 'Authorize the AI bot with WeCom',
  '打开企业微信 App，扫描左侧二维码': 'Open WeCom and scan the QR code',
  '在腾讯授权页面确认创建智能机器人': 'Confirm bot creation on the Tencent authorization page',
  '返回这里等待连接完成': 'Return here and wait for the connection to complete',
  '等待企业微信 App 扫码': 'Waiting for WeCom scan',
  '企业微信已授权，正在连接机器人': 'Authorized in WeCom. Connecting the bot',
  '凭据正在写入本机，并启动企业微信 WebSocket 消息连接。': 'Saving credentials locally and starting the WeCom WebSocket connection.',
  'WebSocket 长连接': 'WebSocket persistent connection',
  '使用手机 QQ 扫码创建并绑定机器人': 'Scan with mobile QQ to create and connect a bot',
  '使用手机 QQ 完成机器人绑定': 'Complete bot setup with mobile QQ',
  '打开手机 QQ，扫描左侧二维码': 'Open mobile QQ and scan the QR code',
  '在腾讯授权页面确认创建或绑定机器人': 'Confirm bot creation or connection on the Tencent authorization page',
  '等待手机 QQ 扫码': 'Waiting for mobile QQ scan',
  'QQ 已授权，正在连接机器人': 'Authorized in QQ. Connecting the bot',
  '凭据正在写入本机，并启动 QQ WebSocket 消息连接。': 'Saving credentials locally and starting the QQ WebSocket connection.',
  '使用手机 WhatsApp 扫描二维码即可接入。': 'Scan the QR code with WhatsApp to connect.',
  '用手机 WhatsApp 扫描二维码': 'Scan with WhatsApp on your phone',
  '打开 WhatsApp → 设置 → 已关联设备': 'Open WhatsApp → Settings → Linked devices',
  '点击“关联设备”并扫描左侧二维码': 'Select “Link a device” and scan the QR code',
  '等待 WhatsApp 扫码': 'Waiting for WhatsApp scan',
  '已扫码，正在连接 WhatsApp': 'Scanned. Connecting WhatsApp',
  '正在建立安全的关联设备会话。': 'Creating a secure linked-device session.',
  '关联设备正在接入 DeepSeek Harness。': 'Linking the device to DeepSeek Harness.',
  'WhatsApp Web 关联设备运行正常': 'WhatsApp linked device is healthy',
  'Bot API 长轮询': 'Bot API long polling',
  ' Gateway 长连接': ' Gateway persistent connection',
  'Gateway 长连接': 'Gateway persistent connection',
  ' Socket Mode 长连接': ' Socket Mode persistent connection',
  'Socket Mode 长连接': 'Socket Mode persistent connection',
  '接入 Telegram 机器人': 'Connect a Telegram bot',
  '先通过 @BotFather 获取 Bot Token，再在这里完成接入。': 'Get a Bot Token from @BotFather, then connect it here.',
  '填写 @BotFather 生成的 Bot Token': 'Enter the Bot Token from @BotFather',
  '接入 Discord 机器人': 'Connect a Discord bot',
  '先在 Developer Portal 创建 Bot 并邀请到服务器，再在这里完成接入。': 'Create a bot in the Developer Portal and invite it to your server, then connect it here.',
  '填写 Discord Developer Portal 的 Bot Token': 'Enter the Bot Token from the Discord Developer Portal',
  '接入 Slack 机器人': 'Connect a Slack bot',
  '先用 Manifest 创建并配置 Slack App': 'Create and configure a Slack app with the manifest',
  '复制配置后，在 Slack 选择 From a manifest；创建完成后生成 connections:write App Token，并将应用安装到工作区。': 'Copy the manifest and choose “From a manifest” in Slack. Then create a connections:write App Token and install the app to your workspace.',
  '复制 Manifest': 'Copy manifest',
  '已复制 Manifest': 'Manifest copied',
  '打开 Slack 创建页': 'Open Slack app creation',
  'Bot Token 来自 OAuth & Permissions；App Token 来自 Basic Information，并且必须包含 connections:write。': 'Get the Bot Token from OAuth & Permissions and the App Token from Basic Information. The App Token must include connections:write.',
  '使用官方 App Manifest 快速配置机器人，再填写 Bot Token 与 App Token 建立本地 Socket Mode 连接。': 'Configure the bot with the official app manifest, then enter the Bot Token and App Token to start a local Socket Mode connection.',
  'Slack 工作区': 'Slack workspace',
  'Bot Token 与 App Token': 'Bot Token and App Token',
  '填写 Bot Token': 'Enter Bot Token',
  '手动接入飞书机器人': 'Connect Feishu bot manually',
  '手动接入钉钉机器人': 'Connect DingTalk bot manually',
  '手动接入企业微信机器人': 'Connect WeCom bot manually',
  '手动接入QQ机器人': 'Connect QQ bot manually',
  '填写飞书开放平台 App ID': 'Enter the Feishu Open Platform App ID',
  '填写飞书开放平台 App Secret': 'Enter the Feishu Open Platform App Secret',
  '填写钉钉应用 Client ID': 'Enter the DingTalk Client ID',
  '填写钉钉应用 Client Secret': 'Enter the DingTalk Client Secret',
  '填写企业微信智能机器人 Bot ID': 'Enter the WeCom AI Bot ID',
  '填写企业微信智能机器人 Secret': 'Enter the WeCom AI Bot Secret',
  '填写 QQ 开放平台 AppID': 'Enter the QQ Open Platform AppID',
  '填写 QQ 开放平台 AppSecret': 'Enter the QQ Open Platform AppSecret',
  '扫码接入微信机器人': 'Connect WeChat bot by QR code',
  '扫码接入飞书机器人': 'Connect Feishu bot by QR code',
  '扫码接入钉钉机器人': 'Connect DingTalk bot by QR code',
  '扫码接入企业微信机器人': 'Connect WeCom bot by QR code',
  '扫码接入 QQ 机器人': 'Connect QQ bot by QR code',
  '扫码接入 WhatsApp 机器人': 'Connect WhatsApp by QR code',
  '扫码绑定 WhatsApp 机器人': 'Connect WhatsApp by QR code',
  '使用 App ID 和 App Secret 绑定飞书机器人': 'Connect a Feishu bot with App ID and App Secret',
  '使用 Client ID 和 Client Secret 绑定钉钉机器人': 'Connect a DingTalk bot with Client ID and Client Secret',
  '使用 Bot ID 和 Secret 绑定企业微信机器人': 'Connect a WeCom bot with Bot ID and Secret',
  '使用 AppID 和 AppSecret 绑定 QQ 机器人': 'Connect a QQ bot with AppID and AppSecret',
  '使用 Manifest 和双 Token 接入 Slack 机器人': 'Connect a Slack bot with a manifest and two tokens',
  '使用 Bot Token 接入 Telegram 机器人': 'Connect a Telegram bot with a Bot Token',
  '使用 Bot Token 接入 Discord 机器人': 'Connect a Discord bot with a Bot Token',
  '取消绑定': 'Cancel setup',
  '取消接入': 'Cancel setup',
  '二维码由腾讯微信 iLink 服务签发。用手机微信扫描并确认后，账号凭据会直接写入 Harness Host，浏览器不会收到 bot_token。': 'The QR code is issued by Tencent WeChat iLink. After you scan and confirm, account credentials are written directly to the Harness Host and are never exposed to the browser.',
  '扫码账号必须已加入企业/组织。如果钉钉提示尚未加入组织，请在提示页创建组织，或换用已加入组织的账号。': 'The DingTalk account must belong to an organization. If prompted, create an organization or use an account that already belongs to one.',
  '请在手机上核对并确认授权。部分账号会额外显示一个配对数字，页面会在需要时提示输入。': 'Review and confirm authorization on your phone. Some accounts may also require a pairing number.',
  '授权由钉钉官方页面完成。扫码账号必须已加入一个企业/组织并有权创建机器人；创建成功后，应用凭据会直接写入 Harness Host。': 'Authorization is completed on DingTalk’s official page. The account must belong to an organization and be allowed to create bots. Credentials are written directly to the Harness Host.',
  '扫码由腾讯官方页面完成，不需要手动填写 AppID 或 AppSecret。扫码成功后，机器人会自动连接 DeepSeek Harness。': 'Scanning is completed on Tencent’s official page. No AppID or AppSecret is required, and the bot connects automatically.',
  '扫码由腾讯官方页面完成，不需要手动填写 Bot ID 或 Secret。创建成功后，机器人会自动连接 DeepSeek Harness。': 'Scanning is completed on Tencent’s official page. No Bot ID or Secret is required, and the bot connects automatically.',
  '腾讯页面会创建或绑定一个 QQ 机器人，并把连接凭据安全交给本机 Harness Host。': 'Tencent will create or connect a QQ bot and securely deliver its credentials to the local Harness Host.',
  '企业微信官方页面会创建一个智能机器人，并把连接凭据安全交给本机 Harness Host。': 'WeCom will create an AI bot and securely deliver its credentials to the local Harness Host.',
  '从此 Harness 移除这个微信账号？': 'Remove this WeChat account from Harness?',
  '这会停止消息连接，并删除本机保存的 bot_token、账号配置和会话映射。其他微信账号不受影响。': 'This stops the message connection and removes the locally stored bot_token, account configuration, and session mappings. Other WeChat accounts are not affected.',
  '此操作会停止这个机器人的连接，并删除保存在本机的接入配置和凭据。飞书开放平台中的应用不会被自动删除，其他机器人也不受影响。': 'This stops the bot connection and removes the locally stored configuration and credentials. The app in Feishu Open Platform is not deleted, and other bots are not affected.',
  '这会停止消息连接，并删除本机保存的应用凭据、机器人配置及会话映射。钉钉开放平台中的机器人不会被自动删除。': 'This stops the message connection and removes the locally stored app credentials, bot configuration, and session mappings. The bot in DingTalk Open Platform is not deleted.',
  '这会停止消息连接，并删除本机保存的应用凭据、机器人配置及会话映射。企业微信平台中的机器人不会被自动删除。': 'This stops the message connection and removes the locally stored app credentials, bot configuration, and session mappings. The bot in WeCom is not deleted.',
  '这会停止消息连接，并删除本机保存的应用凭据、机器人配置及会话映射。腾讯平台中的机器人不会被自动删除。': 'This stops the message connection and removes the locally stored app credentials, bot configuration, and session mappings. The bot on Tencent’s platform is not deleted.',
  '这会停止消息连接，并删除本机保存的 WhatsApp 关联设备和会话映射。': 'This stops the message connection and removes the locally stored WhatsApp linked device and session mappings.',
  '正在读取飞书机器人列表': 'Loading Feishu bots',
  '正在读取飞书连接状态…': 'Loading Feishu connection status…',
  '正在读取微信连接状态…': 'Loading WeChat connection status…',
  '正在读取钉钉连接状态…': 'Loading DingTalk connection status…',
  '通过扫码把钉钉机器人接入 DeepSeek Harness': 'Connect a DingTalk bot to DeepSeek Harness by QR code',
  '钉钉服务没有返回扫码绑定进度': 'DingTalk did not return QR setup progress',
  '钉钉扫码服务没有返回有效的绑定任务': 'DingTalk did not return a valid setup attempt',
  '钉钉 Stream 长连接运行正常': 'DingTalk Stream connection is healthy',
  '钉钉服务没有返回有效的机器人列表': 'DingTalk did not return a valid bot list',
  '${totals.connected} / ${totals.configured} 在线': '${totals.connected} / ${totals.configured} online',
  '用于把钉钉机器人接入 DeepSeek Harness 的一次性二维码': 'One-time QR code for connecting a DingTalk bot to DeepSeek Harness',
  '二维码已过期\\n请重新生成': 'QR code expired\\nGenerate a new one',
  '机器人已创建，正在建立消息连接': 'Bot created. Starting the message connection',
  '钉钉扫码服务没有返回安全的二维码': 'DingTalk did not return a secure QR code',
  '钉钉二维码已生成，请使用钉钉 App 扫描。': 'DingTalk QR code generated. Scan it with the DingTalk app.',
  '钉钉机器人凭据已绑定。': 'DingTalk bot credentials connected.',
  '已取消钉钉机器人接入。': 'DingTalk bot setup cancelled.',
  '钉钉机器人及本机凭据已移除。': 'DingTalk bot and local credentials removed.',
  '飞书服务没有返回二维码信息': 'Feishu did not return QR code information',
  '飞书服务返回的二维码信息不完整': 'Feishu returned incomplete QR code information',
  '飞书服务返回了无效的机器人状态': 'Feishu returned an invalid bot status',
  '飞书服务返回的机器人缺少 botId': 'The Feishu bot is missing botId',
  '飞书服务没有返回连接状态': 'Feishu did not return connection status',
  '飞书服务没有返回创建进度': 'Feishu did not return creation progress',
  '飞书服务返回了未知的创建状态': 'Feishu returned an unknown creation status',
  '已接入 ${totals.configured} 个机器人，其中 ${totals.connected} 个在线': '${totals.connected} of ${totals.configured} bots online',
  '尚未接入机器人': 'No bot connected yet',
  '用于新增 DeepSeek Harness 飞书机器人的一次性授权二维码': 'One-time authorization QR code for adding a Feishu bot to DeepSeek Harness',
  '请刷新后重新扫码': 'Refresh and scan again',
  '${connected ? "检查连接" : "重试连接"}${bot.name}': '${connected ? "Check connection" : "Reconnect"} ${bot.name}',
  '无法读取飞书机器人': 'Could not load Feishu bots',
  '授权二维码已生成，请使用飞书扫码。': 'Authorization QR code generated. Scan it with Feishu.',
  '飞书机器人凭据已绑定。': 'Feishu bot credentials connected.',
  '已取消添加机器人。': 'Adding the bot was cancelled.',
  '${newBot.bot.name}已连接，可以在飞书中开始聊天。': '${newBot.bot.name} is connected and ready to chat in Feishu.',
  '${bot.name}操作失败，请查看机器人状态。': '${bot.name} operation failed. Check the bot status.',
  '${bot.name}已从此 DeepSeek Harness 移除；飞书开放平台中的应用未被删除。': '${bot.name} was removed from this DeepSeek Harness. The app in Feishu Open Platform was not deleted.',
  '无法读取连接状态': 'Could not load connection status',
  'QQ 服务没有返回扫码绑定进度': 'QQ did not return QR setup progress',
  'QQ 扫码服务没有返回有效的绑定任务': 'QQ did not return a valid setup attempt',
  'QQ WebSocket 长连接运行正常': 'QQ WebSocket connection is healthy',
  'QQ 服务没有返回有效的机器人列表': 'QQ did not return a valid bot list',
  '尚未绑定 QQ 机器人': 'No QQ bot connected yet',
  '用于绑定 QQ 机器人的一次性二维码': 'One-time QR code for connecting a QQ bot',
  '${channel}${connectionSummary}运行正常': '${channel}${connectionSummary} is healthy',
  '${channel} 服务没有返回有效的机器人列表': '${channel} did not return a valid bot list',
  '使用 Bot Token 接入 ${channel} 机器人': 'Connect a ${channel} bot with a Bot Token',
  '${model.totals.connected} / ${model.totals.configured} 在线': '${model.totals.connected}/${model.totals.configured} online',
  ' Bot API 长轮询': ' Bot API long polling',
  '企业微信服务没有返回扫码绑定进度': 'WeCom did not return QR setup progress',
  '企业微信扫码服务没有返回有效的绑定任务': 'WeCom did not return a valid setup attempt',
  '企业微信 WebSocket 长连接运行正常': 'WeCom WebSocket connection is healthy',
  '企业微信服务没有返回有效的机器人列表': 'WeCom did not return a valid bot list',
  '尚未绑定企业微信机器人': 'No WeCom bot connected yet',
  '用于绑定企业微信机器人的一次性二维码': 'One-time QR code for connecting a WeCom bot',
  '微信扫码服务没有返回有效的绑定任务': 'WeChat did not return a valid setup attempt',
  '微信绑定没有完成': 'WeChat setup did not complete',
  '微信连接正常': 'WeChat connection is healthy',
  '微信连接未就绪': 'WeChat connection is not ready',
  '微信服务没有返回有效的账号列表': 'WeChat did not return a valid account list',
  '尚未绑定微信': 'No WeChat account connected yet',
  '用于把微信机器人绑定到 DeepSeek Harness 的一次性二维码': 'One-time QR code for connecting a WeChat bot to DeepSeek Harness',
  '保持本页打开，等待消息长轮询变为在线': 'Keep this page open until long polling is online',
  '微信二维码已生成，请使用手机微信扫描。': 'WeChat QR code generated. Scan it with WeChat on your phone.',
  '移除失败：${presentError(error).message}': 'Removal failed: ${presentError(error).message}',
  '无法读取微信状态': 'Could not load WeChat status',
  'WhatsApp 服务没有返回扫码进度': 'WhatsApp did not return QR setup progress',
  'WhatsApp 服务没有返回有效的扫码任务': 'WhatsApp did not return a valid setup attempt',
  'WhatsApp 服务没有返回有效的机器人列表': 'WhatsApp did not return a valid account list',
  '用于关联 WhatsApp 设备的一次性二维码': 'One-time QR code for linking a WhatsApp device',
});

export const en = EN;
export const zh = Object.freeze(Object.fromEntries(
  Object.keys(EN).map((key) => [key, key === '$locale' ? 'zh' : key]),
));

let translate = (key) => key;

export function setImTranslator(next) {
  translate = typeof next === 'function' ? next : (key) => key;
}

export function isEnglish() {
  return translate('$locale') === 'en';
}

function channelName(value) {
  return localizeText(value);
}

function translateDynamic(text) {
  let match = /^(\d+) \/ (\d+) 在线$/.exec(text);
  if (match) return `${match[1]}/${match[2]} online`;
  match = /^已接入 (\d+) 个机器人，其中 (\d+) 个在线$/.exec(text);
  if (match) return `${match[2]} of ${match[1]} bots online`;
  match = /^正在读取\s*(.+?)\s*机器人状态…$/.exec(text);
  if (match) return `Loading ${channelName(match[1])} bot status…`;
  match = /^无法读取\s*(.+?)\s*机器人状态$/.exec(text);
  if (match) return `Could not load ${channelName(match[1])} bot status`;
  match = /^尚未接入\s*(.+?)\s*机器人$/.exec(text);
  if (match) return `No ${channelName(match[1])} bot connected yet`;
  match = /^已接入的\s*(.+?)\s*机器人$/.exec(text);
  if (match) return `Connected ${channelName(match[1])} bots`;
  match = /^手动接入(.+)机器人$/.exec(text);
  if (match) return `Connect ${channelName(match[1])} bot manually`;
  match = /^(.+) 设置$/.exec(text);
  if (match) return `${channelName(match[1])} settings`;
  match = /^从 DeepSeek Harness 移除“(.+)”？$/.exec(text);
  if (match) return `Remove “${match[1]}” from DeepSeek Harness?`;
  match = /^从 DeepSeek Harness 移除(.+)$/.exec(text);
  if (match) return `Remove ${match[1]} from DeepSeek Harness`;
  match = /^(检查连接|重试连接)(.+)$/.exec(text);
  if (match) return `${localizeText(match[1])} ${match[2]}`;
  match = /^移除(.+)$/.exec(text);
  if (match) return `Remove ${match[1]}`;
  match = /^这会停止消息连接，并删除本机保存的 (.+)、机器人配置及会话映射。(.+)中的机器人不会被自动删除。$/.exec(text);
  if (match) {
    return `This stops the message connection and removes the locally stored ${localizeText(match[1])}, bot configuration, and session mappings. The bot in ${localizeText(match[2])} is not deleted.`;
  }
  match = /^二维码剩余 (.+)$/.exec(text);
  if (match) return `QR code expires in ${match[1]}`;
  match = /^状态刷新失败：(.+)$/.exec(text);
  if (match) return `Status refresh failed: ${match[1]}`;
  match = /^状态自动刷新失败：(.+)$/.exec(text);
  if (match) return `Automatic status refresh failed: ${match[1]}`;
  match = /^操作失败：(.+)$/.exec(text);
  if (match) return `Operation failed: ${match[1]}`;
  match = /^连接检查失败：(.+)$/.exec(text);
  if (match) return `Connection check failed: ${match[1]}`;
  match = /^移除失败：(.+)$/.exec(text);
  if (match) return `Removal failed: ${match[1]}`;

  const phrases = [
    ['企业微信', 'WeCom'], ['DeepSeek Harness', 'DeepSeek Harness'],
    ['WhatsApp', 'WhatsApp'], ['Telegram', 'Telegram'], ['Discord', 'Discord'],
    ['Slack', 'Slack'], ['飞书', 'Feishu'], ['钉钉', 'DingTalk'], ['微信', 'WeChat'],
    ['机器人', 'bot'], ['账号', 'account'], ['应用', 'app'], ['凭据', 'credentials'],
    ['服务返回了无法识别的响应', 'service returned an unrecognized response'],
    ['服务没有返回有效的机器人列表', 'service did not return a valid bot list'],
    ['操作失败，请稍后重试', 'operation failed; try again later'],
    ['操作失败', 'operation failed'], ['连接尚未就绪', 'connection is not ready'],
    ['没有接入完成', 'was not connected'], ['没有绑定完成', 'was not connected'],
    ['设置页缺少 RPC 连接', 'settings are missing an RPC connection'],
    ['设置', 'settings'], ['连接检查完成', 'connection check completed'],
    ['仍未连接，插件会继续自动重试', 'is still offline; the plugin will keep retrying'],
    ['已重新连接', 'reconnected'], ['移除失败，请重试', 'could not be removed; try again'],
    ['已连接，可以开始聊天', 'is connected and ready to chat'],
    ['已连接，可以开始发送消息', 'is connected and ready for messages'],
    ['服务请求失败', 'service request failed'], ['连接遇到问题', 'connection encountered a problem'],
    ['正在读取', 'Loading '], ['连接状态', 'connection status'], ['二维码', 'QR code'],
  ];
  let output = text;
  for (const [source, target] of phrases) output = output.replaceAll(source, target);
  return output;
}

export function localizeText(value) {
  if (typeof value !== 'string') return value;
  const exact = translate(value);
  if (exact !== value || !isEnglish()) return exact;
  return translateDynamic(value);
}

const LOCALIZED_PROPS = Object.freeze([
  'aria-label',
  'alt',
  'placeholder',
  'title',
]);

function localizeChild(child) {
  if (typeof child === 'string') return localizeText(child);
  if (Array.isArray(child)) return child.map(localizeChild);
  return child;
}

export function h(type, props, ...children) {
  let localizedProps = props;
  if (props) {
    for (const key of LOCALIZED_PROPS) {
      if (typeof props[key] === 'string') {
        localizedProps = localizedProps === props ? { ...props } : localizedProps;
        localizedProps[key] = localizeText(props[key]);
      }
    }
  }
  return React.createElement(type, localizedProps, ...children.map(localizeChild));
}
