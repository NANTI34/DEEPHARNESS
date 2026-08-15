# deep-harness-appearance — DEEPHARNESS 常驻增强插件

DEEPHARNESS 桌面版的**常驻**增强插件(替代旧版"动态插件":旧版随进程临时加载、服务重启后文件/终端等全部消失;本插件随服务启动自动加载,一次安装永久生效)。

## 能力

| 能力 | 说明 |
|---|---|
| 📁 **文件视图** | 会话视图栏新增「文件」标签:工作区文件树(自动隐藏 `node_modules`/`.git` 等),点击文件右侧预览/编辑,支持保存写回与新建文件 |
| 🖥️ **终端面板** | 会话视图栏新增「终端」标签:以工作区根目录为 cwd 的命令执行器(PowerShell),快速运行命令并查看输出与退出码 |
| 💰 **费用估算** | 文件/终端标签页顶部实时显示**本会话费用估算**:基于真实 token 用量(输入/缓存命中/输出),按 [DeepSeek 官方定价](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/) 自动适配 2026-08-17 峰谷定价(高峰 9:00-12:00、14:00-18:00 基准价,空闲半价,8.17 前旧价),同时给出 flash 与 pro 两档参考 |
| 🎨 **品牌外观** | 设置 → 通用 →「DEEPHARNESS 外观」:固定品牌深蓝顶栏/侧栏色、界面字体一键切换(默认/微软雅黑/宋体/楷体/等宽)、渐变背景预设(暗夜蓝/极光紫/深林/纯色深蓝)、字体导入(仓库 `fonts\` 目录扫描 + 网页上传到 `%USERPROFILE%\.dsh\fonts`) |
| 💾 **持久化** | 外观选择保存在浏览器 localStorage,服务重启、页面刷新后自动恢复;插件本身随 profile 常驻加载,无需再次授权 |

## 安装(由 install.ps1 自动完成)

```powershell
# 在仓库根目录执行:
node .\app\lib\bin.js plugin --profile web add .\plugins\deep-harness-appearance
```

该命令将插件写入 `%USERPROFILE%\.dsh\profiles\web`(依赖安装到 `profiles\node_modules`,
加载行写入 profile bundles),**重启服务后自动加载**。卸载:

```powershell
node .\app\lib\bin.js plugin --profile web remove deep-harness-appearance
```

## 结构

```
deep-harness-appearance/
├─ package.json        # dsh.bundle.patch(host 层)+ dsh.client(浏览器层)声明
├─ cordis.patch.yml    # profile 加载行:把本包插入 web profile 组合
├─ lib/
│  ├─ index.js         # host 半:webServer 路由 /deepharness/api/*(文件树/读写/终端/字体)
│  └─ client.js        # 浏览器半:conversation.view 标签 + settings.general.item 设置项
└─ README.md
```

## 工作原理

- **host 半**注册 `/deepharness/api/*` HTTP 路由(与工作台同源):
  `/status`(工作区根)、`/tree`(文件树)、`/file`(读)、`/write`(写)、`/mkdir`、`/exec`(命令执行,PowerShell,工作区根为 cwd)、`/fonts`、`/font`(读)、`/font/upload`(上传)。
  文件操作使用 node:fs 并做工作区包含校验(越界路径一律拒绝);命令执行走 `child_process`。
- **浏览器半**通过 `dsh.client` 机制被页面内核自动发现并加载:
  - `conversation.view` 槽位注册「文件」「终端」标签(与内置"轨迹"标签同协议);
  - `settings.general.item` 槽位注册外观设置;
  - 费用数据来自 DSH 会话投影 `tokenUsage`(真实用量),按官方峰谷定价在浏览器内估算。
- 路径安全:所有文件/命令路径被约束在工作区根目录内,越界请求被拒绝。

## 备注

- 定价表位于 `lib/client.js` 顶部 `PRICING`,DeepSeek 调整价格后可自行更新。
- 命令执行不经过 DSH 沙箱(用户主动操作的终端),请按需使用。
