# DEEPHARNESS — DeepSeek Harness Windows 桌面版

> 把 DeepSeek Harness 变成 Windows 桌面应用:一条命令安装,桌面快捷方式一键打开 AI 工作台。

![logo](tools/logo.png)

## ✨ 特性

- 🚀 **一键启动** — 双击桌面快捷方式,自动检测/后台启动本机服务,然后打开浏览器界面
- 🖥️ **桌面应用体验** — 附赠 Edge 应用模式快捷方式,独立窗口,更像原生桌面应用
- 💾 **数据本地保存** — 配置、会话、技能全部保留在 `%USERPROFILE%\.dsh`
- 📦 **便携分发** — 应用本体就在 `app/` 目录,克隆仓库即得
- ⚖️ **MIT 开源协议**

## 环境要求

| 项目 | 要求 |
|---|---|
| 操作系统 | Windows 10 / 11 |
| Node.js | 20 或更高版本(<https://nodejs.org>) |

## 快速开始

```powershell
git clone https://github.com/NANTI34/DEEPHARNESS.git
cd DEEPHARNESS
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

`install.ps1` 会自动完成:

1. 安装应用依赖(`npm install`)
2. 在桌面创建快捷方式 `DEEPHARNESS`(和 `DEEPHARNESS App`)

之后双击桌面的 **DEEPHARNESS** 快捷方式即可打开工作台。

## 使用说明

| 快捷方式 | 行为 |
|---|---|
| `DEEPHARNESS` | 用默认浏览器(火狐等)打开工作台 |
| `DEEPHARNESS App` | Edge 应用模式独立窗口,更像原生应用 |

- 首次双击会**后台启动**服务(日志在 `logs\server.log`),之后每次直接打开页面
- 服务端口默认 `3080`;如需自定义端口:

```powershell
powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Port 8080
```

## 数据目录

- 所有配置、会话、技能数据保存在 `%USERPROFILE%\.dsh`
- 删除仓库目录**不影响**数据;删除 `%USERPROFILE%\.dsh` 才会完全清除

## 卸载

```powershell
powershell -ExecutionPolicy Bypass -File .\uninstall.ps1
```

然后删除仓库目录即可。

## 常见问题

- **端口被占用** — 用 `-Port` 参数指定其他端口
- **启动失败** — 查看 `logs\server.err.log` 中的错误信息
- **提示未找到 Node.js** — 安装 Node.js 20+ 后重试

## 项目结构

```
DEEPHARNESS/
├─ app/                        # DeepSeek Harness 应用本体(@deepseek-ai/dsh)
├─ launcher/
│  ├─ DEEPHARNESS.ps1          # 主启动器(端口检测 + 后台启动 + 打开界面)
│  ├─ start-hidden.vbs         # 无控制台窗口调用
│  └─ assets/dsh.ico           # 应用图标
├─ install.ps1                 # 一键安装(依赖 + 桌面快捷方式)
├─ uninstall.ps1               # 一键卸载(删除快捷方式)
└─ tools/
   ├─ make-icon.ps1            # 图标生成脚本(可复现)
   └─ logo.png                 # README 横幅
```

## 开源声明

- 本项目基于 **MIT 协议**开源(见 [LICENSE](LICENSE))
- 应用本体来自 DeepSeek 官方开源项目 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)(`@deepseek-ai/dsh` v0.1.0-rc.6,MIT)
