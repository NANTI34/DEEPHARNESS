# DEEPHARNESS — DeepSeek Harness Windows 桌面版

> 把 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 变成 Windows 桌面应用:一条命令安装,桌面快捷方式一键打开你的 AI 工作台。

![logo](tools/logo.png)

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg) ![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-0078D6.svg) ![Node](https://img.shields.io/badge/node-%3E%3D20-339933.svg) ![Version](https://img.shields.io/badge/dsh-0.1.0--rc.6-4D6BFE.svg)

---

## 📖 这是什么?

**DeepSeek Harness (DSH)** 是 DeepSeek 官方的开源 AI 智能体工作台:一个运行在你自己电脑上的全栈 Agent 运行时,提供浏览器操作界面、技能(Skill)系统、多模型路由、沙箱文件系统、子代理编排等能力,数据完全保存在本地。

**DEEPHARNESS 项目**为 DSH 做了 Windows 桌面化封装,解决三个日常痛点:

| 痛点 | 本项目的解法 |
|---|---|
| 每次都要敲命令启动服务 | 桌面快捷方式一键启动,自动检测/拉起服务 |
| 命令行黑窗口难看、容易误关 | 无控制台窗口(隐藏 PowerShell 调用),服务常驻后台 |
| 不知道服务有没有在跑 | 启动器先探测端口,已有服务直接复用,绝不重复启动 |

## ✨ 特性

- 🚀 **一键启动** — 双击桌面快捷方式:检测服务 → (未运行则后台启动)→ 打开工作台
- 🧠 **智能探测** — 先 TCP 探测端口,再用 `__DSH_BOOT__` 页面标记确认确实是 DSH 服务,避免误用他人端口
- 🖥️ **双模式体验** — 默认浏览器打开(火狐等)+ 可选 Edge 应用模式独立窗口,更像原生桌面应用
- 💾 **数据 100% 本地** — 配置、会话、技能、沙箱全部保存在 `%USERPROFILE%\.dsh`
- 📦 **便携分发** — 应用本体就在 `app/` 目录,克隆仓库即可获得完整应用
- 🎨 **品牌化** — 自带多尺寸应用图标(`dsh.ico`,16–256px)与 README 横幅,图标生成脚本可复现
- ⚖️ **MIT 开源** — 基于 MIT 协议,应用本体来自 DeepSeek 官方开源项目

## 🔧 工作原理

```
┌──────────────────────────────────────────────────────────────────┐
│ 双击桌面 "DEEPHARNESS" 快捷方式                                    │
└──────────────────────────────┬───────────────────────────────────┘
                               ▼
              start-hidden.vbs(wscript,无窗口)
                               ▼
              DEEPHARNESS.ps1(隐藏 PowerShell)
                               ▼
         ┌───────────── 端口 3080 上已有 DSH 服务? ─────────────┐
         │ 是                                             │ 否  │
         ▼                                                ▼     │
   直接复用现有服务                              后台启动服务          │
   (不重复启动)                     node app\lib\bin.js web         │
         │                               │ 等待就绪(≤90s)           │
         └──────────────┬────────────────┘                         │
                        ▼                                          │
              打开浏览器 → http://127.0.0.1:3080                     │
                        ▼                                          │
                 DeepSeek Harness 工作台                             │
└──────────────────────────────────────────────────────────────────┘
```

关键细节:

- **端口探测** — 用 `TcpClient` 异步探测,再请求首页并检查 `__DSH_BOOT__` 标记,双重确认
- **服务常驻** — 服务由 `Start-Process` 独立拉起,关闭浏览器/启动器不影响服务运行
- **日志留痕** — 服务输出写入 `logs\server.log` 与 `logs\server.err.log`,启动失败时弹窗直接展示错误尾部
- **幂等安全** — 无论双击多少次快捷方式,都只会得到一个服务实例和一次页面打开

## 环境要求

| 项目 | 要求 |
|---|---|
| 操作系统 | Windows 10 / 11(x64) |
| Node.js | 20 或更高版本(<https://nodejs.org>),已安装时启动器自动复用 |
| 浏览器 | 任意现代浏览器(默认浏览器即可;Edge 可选,用于应用模式) |

## 🚀 快速开始

```powershell
git clone https://github.com/NANTI34/DEEPHARNESS.git
cd DEEPHARNESS
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

`install.ps1` 自动完成:

1. **检查 Node.js**(缺失时打开官网引导安装)
2. **安装应用依赖**(`npm install`,首次约 1–3 分钟;已装过则自动跳过)
3. **创建桌面快捷方式** — `DEEPHARNESS`(默认浏览器)与 `DEEPHARNESS App`(Edge 应用模式,检测到 Edge 才创建)

然后双击桌面 **DEEPHARNESS** 即可。首次双击会静默完成服务启动,稍等片刻页面自动打开。

## 🖱️ 使用说明

| 快捷方式 | 行为 | 适用场景 |
|---|---|---|
| `DEEPHARNESS` | 默认浏览器打开工作台 | 日常使用,多标签页协作 |
| `DEEPHARNESS App` | Edge 应用模式独立窗口 | 想要"原生应用"体验,独立于浏览器标签 |

### 自定义端口与工作目录

服务默认端口 `3080`,工作目录默认为项目根目录。需要调整时:

```powershell
# 用 8080 端口启动/打开
powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Port 8080

# 指定工作目录(Agent 的文件操作以此为根)
powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Workspace D:\my-workspace
```

> 提示:自定义端口时,`DEEPHARNESS App`(Edge 应用模式)快捷方式固定指向 3080,如需同步请手动修改快捷方式参数。

### 常用路径

| 路径 | 说明 |
|---|---|
| `%USERPROFILE%\.dsh` | 全部数据:配置、会话、技能、凭据 |
| `%USERPROFILE%\.dsh\profiles\web` | Web 工作台配置文件 |
| `logs\server.log` / `logs\server.err.log` | 服务运行日志 / 错误日志 |
| `fonts\` | 外观插件"导入字体"的字体文件目录 |

## 🎨 外观与费用(可选动态插件)

在会话中加载「DEEPHARNESS 外观与费用」动态插件(需在页面 Run 卡片授权)后:

- **顶栏品牌色固定** — 最外层上边栏使用 DEEPHARNESS 品牌深蓝(`#16204A`),不再跟随浏览器主题(设置 → 外观可切换)
- **字体风格** — 默认 / 微软雅黑 / 宋体 / 楷体 / 等宽 一键切换
- **导入字体** — 将 `.ttf` / `.woff2` 等放入 `fonts\` 目录,在设置页一键导入
- **渐变背景预设** — 暗夜蓝 / 极光紫 / 深林 / 纯色深蓝
- **费用统计** — 统计栏下方新增一行,按 [DeepSeek 官方定价](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/) 估算本会话费用:
  - 基于会话日志中的真实 token 用量(输入缓存命中 / 未命中 / 输出)
  - **自动适配 2026-08-17 峰谷定价**:8.17 前按旧价;之后按北京时间高峰(9:00-12:00、14:00-18:00,价格翻倍)与空闲时段(半价)自动切换
  - 同时给出 flash 与 pro 两档参考价

> 动态插件为进程级功能:服务重启后需重新加载插件;字体/背景选择在刷新页面后需重新设置。

## 🔒 数据与隐私

- **全部本地**:会话记录、技能、模型配置、沙箱文件均保存在 `%USERPROFILE%\.dsh`,不上传任何服务器
- **仅本机访问**:服务默认绑定 `127.0.0.1`,不对局域网开放
- **删除即走**:删除仓库目录不影响数据;彻底清除需删除 `%USERPROFILE%\.dsh`

## 📁 项目结构

```
DEEPHARNESS/
├─ app/                        # DeepSeek Harness 应用本体(@deepseek-ai/dsh v0.1.0-rc.6)
│  ├─ lib/                     # CLI 启动入口(bin.js 等)
│  ├─ config/                  # 内置 Agent 预设与技能
│  ├─ package.json             # 依赖清单(含 package-lock.json 锁定版本)
│  └─ node_modules/            # 依赖(由 install.ps1 安装,不入库)
├─ launcher/
│  ├─ DEEPHARNESS.ps1          # 主启动器(端口探测 + 后台启动 + 打开界面)
│  ├─ start-hidden.vbs         # 无控制台窗口调用(wscript)
│  └─ assets/
│     └─ dsh.ico               # 应用图标(16–256px 多尺寸)
├─ install.ps1                 # 一键安装:依赖 + 桌面快捷方式
├─ uninstall.ps1               # 一键卸载:删除桌面快捷方式
├─ tools/
│  ├─ make-icon.ps1            # 图标生成脚本(可复现,无需外部素材)
│  └─ logo.png                 # README 横幅
├─ README.md                   # 本文档
├─ LICENSE                     # MIT 协议
└─ .gitignore
```

## ❓ 常见问题

**Q:双击快捷方式后没有反应?**
A:启动器是静默的,首次启动需等待服务就绪(通常 5–20 秒)。若 90 秒内未打开页面,会弹出错误对话框并显示 `logs\server.err.log` 的错误尾部。

**Q:端口 3080 被占用?**
A:启动器只会复用"确认是 DSH 的服务";若是其他程序占用,请用 `-Port` 参数换端口:
```powershell
powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Port 8080
```

**Q:提示"未找到 Node.js"?**
A:安装 Node.js 20+ 后重试:<https://nodejs.org>

**Q:提示"尚未安装依赖"?**
A:运行 `install.ps1` 完成 `npm install`,之后即可正常使用。

**Q:如何修改默认端口?**
A:编辑 `launcher\DEEPHARNESS.ps1` 顶部 `param([int]$Port = 3080)`,或改用 `install.ps1` 后手动更新 Edge 快捷方式参数。

**Q:数据会丢吗?**
A:数据在 `%USERPROFILE%\.dsh`,与仓库目录相互独立。卸载应用、删除仓库都不会动数据。

## 🔄 升级

```powershell
cd DEEPHARNESS
git pull
powershell -ExecutionPolicy Bypass -File .\install.ps1 -Force   # 重新安装依赖并刷新快捷方式
```

> `install.ps1 -Force` 会强制重新执行 `npm install` 以同步上游依赖更新。

## 🗑️ 卸载

```powershell
powershell -ExecutionPolicy Bypass -File .\uninstall.ps1
```

删除桌面快捷方式后,删除仓库目录即完成卸载(数据保留在 `%USERPROFILE%\.dsh`)。

## ⚖️ 开源与致谢

- 本项目基于 **MIT 协议**开源(见 [LICENSE](LICENSE))
- 应用本体来自 DeepSeek 官方开源项目 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)(`@deepseek-ai/dsh` v0.1.0-rc.6,MIT)
- 感谢 DeepSeek 团队开源如此出色的 Agent 运行时

---

## English Overview

**DEEPHARNESS** packages [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek's open-source AI agent workbench — as a Windows desktop app.

- **One-click launch**: a desktop shortcut that probes the local port (3080 by default), boots the DSH server in the background if needed, and opens the workbench in your browser.
- **Two modes**: open in your default browser, or use the bundled Edge app-mode shortcut for a standalone-window, native-app feel.
- **100% local data**: everything lives in `%USERPROFILE%\.dsh`; the server binds to `127.0.0.1` only.
- **Requirements**: Windows 10/11 + Node.js 20+.

```powershell
git clone https://github.com/NANTI34/DEEPHARNESS.git
cd DEEPHARNESS
powershell -ExecutionPolicy Bypass -File .\install.ps1   # installs deps + desktop shortcut
```

Double-click the **DEEPHARNESS** shortcut on your desktop. Uninstall with `uninstall.ps1`. MIT licensed — see [LICENSE](LICENSE).
