# DEEPHARNESS — DeepSeek Harness Windows 桌面应用

> 把 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 变成**真正的 Windows 桌面应用**:一条命令安装,双击桌面图标,原生应用窗口打开你的 AI 工作台——不是浏览器套壳。

![logo](tools/logo.png)

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg) ![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-0078D6.svg) ![Node](https://img.shields.io/badge/node-%3E%3D20-339933.svg) ![Version](https://img.shields.io/badge/version-0.2.0-4D6BFE.svg)

---


## 📖 这是什么?

**DeepSeek Harness (DSH)** 是 DeepSeek 官方的开源 AI 智能体工作台:一个运行在你自己电脑上的全栈 Agent 运行时,提供浏览器操作界面、技能(Skill)系统、多模型路由、沙箱文件系统、子代理编排等能力,数据完全保存在本地。

**DEEPHARNESS 项目**把 DSH 变成了一款 Windows 原生桌面应用,解决四个日常痛点:

| 痛点 | 本项目的解法 |
|---|---|
| 每次都要敲命令启动服务 | 桌面快捷方式一键启动,自动检测/拉起服务 |
| 命令行黑窗口难看、容易误关 | 无控制台窗口,服务常驻后台 |
| 浏览器标签页不像"应用" | **Electron 原生应用窗口**(独立任务栏图标、无地址栏),浏览器仅为备选入口 |
| 增强功能(文件/终端/外观/浏览器)重启就丢 | **常驻增强插件**随服务自动加载,重启后依然在 |

## ✨ 特性

- 🖥️ **原生桌面应用** — Electron 窗口加载工作台:独立窗口、任务栏图标、无地址栏/标签页/浏览器菜单,窗口大小与位置自动记忆(`%USERPROFILE%\.dsh\app\window-state.json`)
- 🚀 **一键启动** — 双击桌面快捷方式:检测服务 → (未运行则后台启动)→ 原生窗口打开工作台,重复双击只会聚焦已有窗口
- 🧠 **智能探测** — 先 TCP 探测端口,再用 `__DSH_BOOT__` 页面标记 + API 探测双重确认确实是 DSH 服务,避免误用他人端口
- 📁 **文件视图(常驻)** — 会话视图栏「文件」标签:工作区文件树(自动隐藏 `node_modules`/`.git` 等),点击文件即时预览/编辑,支持保存写回与新建文件
- 🖥️ **终端面板(常驻)** — 会话视图栏「终端」标签:工作区根目录下的命令执行器(PowerShell),快速运行命令并查看输出与退出码
- 💰 **费用估算(常驻)** — 按 [DeepSeek 官方定价](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/) 实时估算本会话费用:真实 token 用量(输入/缓存命中/输出),自动适配 2026-08-17 峰谷定价(高峰 9:00-12:00、14:00-18:00 为基准价,空闲时段半价,8.17 前按旧价),同时给出 flash 与 pro 两档参考
- 📊 **统计/技能/环境(常驻)** — 会话视图栏另有「统计」(会话 token/耗时/费用明细)、「技能」(内置 Agent 预设与本地技能库浏览)、「环境」(插件版本/路径/诊断,一键复制)标签
- 🌐 **内置轻量浏览器(常驻)** — 会话视图栏「浏览器」标签:搜索(百度/必应/Google)、打开网址、**调试本地纯前端应用**——输入本地 `index.html` 路径(或直接把文件拖进地址栏),经同源路由托管,ES module / fetch / Worker 均可运行;桌面端为独立 Chromium 内嵌窗口,**F12 打开独立开发者工具**,站点弹窗(target=_blank,如 B站视频卡片)自动就地打开,视频支持全屏
- 🐟 **大肥鱼桌面伴侣** — DSH 状态驱动的桌面宠物(`plugins/dsh-dafeiyu`):实时显示思考/干活/等待/成功/出错状态卡,右键可调整大小/减少动态/隐藏/关闭;**点击状态卡右上角 ⋯ 打开聊天对话框**与鱼对话
- 🎨 **品牌外观(常驻)** — 设置 →「DEEPHARNESS 外观」独立区块:品牌深蓝顶栏/侧栏色(可自定义主色)、界面字体切换(可导入字体)、渐变/图片背景预设、**金边装饰开关**(全界面金色描边光晕)、**一键换肤(5 款预设皮肤:经典 XP 蓝/初音绿黑/樱花粉/深空紫/赛博霓虹,互斥切换可恢复默认)**、**侧边卡片开关**(会话视图栏标签逐项显示/隐藏),选择保存在浏览器本地,重启后自动恢复
- 🛠️ **DEEPHARNESS 工具(常驻)** — 设置 →「DEEPHARNESS 工具」独立区块:
  - **一键夺舍** — 选择 Codex / Claude Code 目录一键迁移:自动注册为工作区、新建会话并发送迁移指令,AI 把技能(skills)、MCP 服务器、长期记忆(CLAUDE.md / AGENTS.md)全部搬进 DSH(也可仅复制指令)
  - **自定义提示词(soul.md)** — markdown 人设卡注入系统提示词,保存后约 300ms 热重载,无需重启
  - **长期记忆** — 自动捕获每轮「用户提问 → 助手答复」写入本地记忆库(可搜索/清空),按量注入新会话提示词,实现跨会话记忆
  - **后端切换** — 一键切换默认模型后端(官方 v4 Pro / v4 Flash / opencode-go 第三方 / 自定义 provider+model),原配置自动备份
- 💾 **数据 100% 本地** — 配置、会话、技能、沙箱全部保存在 `%USERPROFILE%\.dsh`
- 📦 **便携分发** — 应用本体在 `app/` 与 `desktop/`,克隆仓库 + 一条安装命令即可使用
- ⚖️ **MIT 开源** — 应用本体来自 DeepSeek 官方开源项目,本项目为纯封装增强

## 🔧 工作原理

```
┌──────────────────────────────────────────────────────────────────┐
│ 双击桌面 "DEEPHARNESS" 快捷方式                                    │
│   → electron.exe + desktop\main.js(原生窗口,无浏览器)            │
└──────────────────────────────┬───────────────────────────────────┘
                               ▼
             单实例锁(重复双击 → 聚焦已有窗口)
                               ▼
         ┌───────────── 端口 3080 上已有 DSH 服务? ─────────────┐
         │ 是                                             │ 否  │
         ▼                                                ▼     │
   复用现有服务(不再启动)                        后台启动服务          │
   探测:端口 + __DSH_BOOT__ + API        node app\lib\bin.js web   │
   检查:工作区是否一致(不一致则警告)              │ 等待就绪(≤120s)     │
         │                                                │        │
         └──────────────────┬─────────────────────────────┘        │
                            ▼                                      │
              Electron 原生窗口 → http://127.0.0.1:3080              │
                            ▼                                      │
       DeepSeek Harness 工作台 + 常驻增强插件(文件/终端/统计/技能/环境/浏览器/外观/费用)
                            + 大肥鱼桌面伴侣(桌面宠物)      │
└──────────────────────────────────────────────────────────────────┘
```

关键细节:

- **服务常驻** — 服务由启动器独立拉起,关闭应用窗口/浏览器不影响服务运行
- **工作区一致性** — 服务始终以**仓库根目录**为工作区启动;若 3080 上运行的是别的工作区启动的服务(如手动 `npx dsh` 从其他目录启动),桌面应用会弹出警告,因为 DSH 的会话按工作区存放、此时看不到本仓库的会话与文件
- **日志留痕** — 服务输出写入 `logs\server.log` 与 `logs\server.err.log`,桌面应用启动日志写入 `%USERPROFILE%\.dsh\app\boot.log`,启动失败时窗口内直接展示错误尾部
- **幂等安全** — 无论双击多少次快捷方式,都只会得到一个服务实例和一个窗口

## 环境要求

| 项目 | 要求 |
|---|---|
| 操作系统 | Windows 10 / 11(x64) |
| Node.js | 20 或更高版本(<https://nodejs.org>),已安装时启动器自动复用 |
| 浏览器 | 仅"浏览器回退入口"需要;默认入口(Electron)无需浏览器 |

## 🚀 快速开始

```powershell
git clone https://github.com/NANTI34/DEEPHARNESS.git
cd DEEPHARNESS
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

`install.ps1` 自动完成:

1. **检查 Node.js**(缺失时打开官网引导安装)
2. **安装应用依赖**(`app/` 的 npm install,首次约 1–3 分钟;已装过则自动跳过)
3. **安装桌面壳依赖**(`desktop/` 的 Electron,首次需下载约 120MB,失败自动切换国内镜像重试)
4. **安装常驻增强插件**(`plugins\deep-harness-appearance` + `plugins\deep-harness-tools` 写入 web profile,**随服务启动自动加载**,无需每次授权)
5. **创建桌面快捷方式**:
   - `DEEPHARNESS` — **Electron 原生应用窗口**(主入口)
   - `DEEPHARNESS(浏览器)` — 默认浏览器回退入口

然后双击桌面 **DEEPHARNESS** 即可。首次双击会静默完成服务启动,稍等片刻原生窗口自动打开。

## 🖱️ 使用说明

| 快捷方式 | 行为 | 适用场景 |
|---|---|---|
| `DEEPHARNESS` | Electron 原生应用窗口(主入口) | 日常使用,真正的桌面 APP 体验 |
| `DEEPHARNESS(浏览器)` | 默认浏览器打开工作台 | 需要浏览器多标签页协作时 |

### 自定义端口与工作目录

```powershell
# 用 8080 端口启动/打开(需同时指定 Electron 窗口端口):
powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Port 8080 -AppMode

# 指定工作目录(Agent 的文件操作以此为根;会话也按此目录存放):
powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Workspace D:\my-workspace
```

> 提示:自定义端口时,桌面快捷方式固定指向 3080;如需同步,请用上面的 PowerShell 命令启动。

### 退出与系统托盘


关闭 DEEPHARNESS 窗口时会弹出询问(可勾选"记住选择"):

| 选项 | 行为 |
|---|---|
| **最小化到托盘** | 应用驻留系统托盘,DSH 服务继续运行;左键托盘图标重新打开窗口,右键菜单可退出 |
| **退出并结束服务** | 退出应用,并停止本地 DSH 服务(占用 3080 端口的服务进程会被结束) |
| **退出(服务保持运行)** | 仅关闭应用窗口,服务常驻后台,下次双击直接复用 |

托盘右键菜单同样提供「打开工作台 / 最小化到托盘 / 退出(服务保持运行) / 退出并停止服务」。
记住的选择保存在 `%USERPROFILE%\.dsh\app\desktop-settings.json` 的 `closeAction` 字段。

### 常用路径

| 路径 | 说明 |
|---|---|
| `%USERPROFILE%\.dsh` | 全部数据:配置、会话、技能、凭据 |
| `%USERPROFILE%\.dsh\profiles\web` | Web 工作台配置文件(含常驻插件加载项) |
| `%USERPROFILE%\.dsh\app` | 桌面壳状态:窗口位置、启动日志、冒烟证据 |
| `%USERPROFILE%\.dsh\sessions` | 会话记录(按工作区目录分文件夹存放) |
| `%USERPROFILE%\.dsh\backgrounds` | 上传的背景图(裁剪产物) |
| `logs\server.log` / `logs\server.err.log` | 服务运行日志 / 错误日志 |
| `fonts\` | 外观插件"导入字体"的字体文件目录(仓库侧) |
| `assets\backgrounds\` | 出厂默认背景图(仓库侧) |

## 🎨 工作台增强(常驻插件,重启不丢)

**DEEPHARNESS 外观与增强插件**(`plugins\deep-harness-appearance`)由 `install.ps1` 安装进 web profile,**随服务启动自动加载**——不再像旧版"动态插件"那样需要每次在 Run 卡片授权、服务重启后全部丢失:

- **品牌色自定义** — 设置 →「DEEPHARNESS 外观」独立区块:可自由挑选品牌主色,顶栏/标题行用主色,**侧边栏自动配同系深色**(两者区分不雷同),全部不随浏览器主题变化(可一键关闭)
- **字体风格** — 默认 / 微软雅黑 / 宋体 / 楷体 / 等宽 一键切换,选择自动记忆
- **导入字体** — 将 `.ttf` / `.woff2` 等放入 `fonts\` 目录,或在设置页直接上传(保存到 `%USERPROFILE%\.dsh\fonts`),一键应用
- **渐变背景预设** — 暗夜蓝 / 极光紫 / 深林 / 纯色深蓝,选择自动记忆
- **图片背景 + 16:9 裁剪** — 设置页上传任意图片,弹出固定 16:9 比例裁剪框(拖动定位、缩放 0.05×–8× 可截超大画面或细节),确认后自动应用并保存到 `%USERPROFILE%\.dsh\backgrounds`;仓库自带 `assets\backgrounds\默认.jpg`(2560×1440)作为**出厂默认背景**;用户上传的背景可一键删除(出厂自带受保护)
- **半透明玻璃视效** — 有背景(渐变或图片)时,侧边栏呈现**调亮的品牌蓝半透明**,聊天/轨迹等内容卡片同步半透明化,壁纸在侧边栏、聊天区、轨迹界面处处可见,不再有大片纯色遮挡
- **金边装饰** — 设置页「装饰」开关:开启后全界面(侧边栏、面板、对话框、消息气泡、输入区、标签页、卡片等)披上金色描边与光晕,繁复华丽风格
- **一键换肤(预设皮肤)** — 设置页「一键换肤」:5 款预设一键互斥切换(经典 XP 蓝 / 初音绿黑 / 樱花粉 / 深空紫 / 赛博霓虹),覆盖界面主色与面板风格,与品牌色/金边/背景互相独立,可随时恢复默认
- **侧边卡片(标签开关)** — 设置页「侧边卡片」:会话视图栏的「浏览器/文件/终端/统计/技能/环境」标签逐项显示/隐藏(默认全开,修改后刷新页面生效)
- **费用统计** — 「文件」「终端」标签页顶部实时显示本会话费用估算:
  - 基于会话投影中的真实 token 用量(输入 / 缓存命中 / 输出)
  - **自动适配 2026-08-17 峰谷定价**:8.17 前按旧价;之后按北京时间高峰(9:00-12:00、14:00-18:00,基准价)与空闲时段(半价)自动切换
  - 同时给出 flash 与 pro 两档参考价
- **文件视图** — 会话视图栏「文件」标签:左侧工作区文件树(层级连线、自动隐藏 `node_modules`/`.git` 等),点击文件右侧即时预览与编辑,支持保存写回与新建文件;**代码按文件类型自动语法高亮**(JS/TS/Python/JSON/PowerShell/Java/C/C++/Go/Rust/SQL/YAML/HTML/CSS/Markdown 等,大文件自动降级保流畅)
- **终端面板** — 会话视图栏「终端」标签:工作区根目录下的命令执行器(PowerShell),快速运行命令并查看输出,支持命令历史与清屏
- **统计 / 技能 / 环境** — 「统计」按会话展示 token 用量、耗时与费用明细;「技能」浏览内置 Agent 预设与本地技能(SKILL.md);「环境」展示插件版本、工作区/数据目录、平台等诊断信息,一键复制
- **内置浏览器** — 会话视图栏「浏览器」标签:
  - 地址栏支持:搜索词(可切换 百度/必应/Google)、网址(自动补全 `https://`)、**本地 `index.html` 路径**(绝对路径如 `D:/demo/index.html` 或工作区相对路径,也可直接拖入文件)
  - 本地纯前端应用经 `/deepharness/browser/serve/*` 同源路由托管(正确 MIME、目录自动找 index.html、支持 Range),**ES module / fetch / Worker 全部可用**——这是 file:// 打开所不具备的
  - 桌面端使用独立 Chromium 内嵌窗口(`<webview>`),**F12(或工具栏「F12 调试」按钮)打开该页面独立的开发者工具**;浏览器回退模式为 iframe
  - 站点弹窗(`target=_blank` / `window.open`,如 B站视频卡片)自动**就地打开**,不另开窗口;视频支持全屏
- **大肥鱼桌面伴侣** — `plugins/dsh-dafeiyu`(随服务自动加载):
  - 桌面最上层透明宠物,实时跟随 DSH 会话状态:休息/思考/干活/等你/完成/出错,头顶状态卡显示当前任务与进度
  - 点击宠物有摸头/戳/尾巴互动,双击表白;右键菜单可调整大小(小/标准/大)、减少动态、本次隐藏、本次关闭
  - **点击状态卡右上角 ⋯ 打开「大肥鱼 · 聊天」对话框**:气泡聊天、Enter 发送,鱼会按关键词回复并汇报当前状态/任务
  - 设置页(设置 → 大肥鱼)可开关、调大小、活跃程度、减少动态、是否响应子 Agent

### DEEPHARNESS 工具插件(`plugins\deep-harness-tools`,随服务自动加载)

设置 →「DEEPHARNESS 工具」独立区块:

- **一键夺舍** — 参考社区 dsh-easy-setup 方案:选择 Codex / Claude Code 的安装/配置目录(或普通项目目录)→ 自动注册为工作区并新建会话 → 迁移指令自动发送,AI 全程用工具调用把技能(`.claude/skills`、`.codex/skills`、`skills/`)、MCP 服务器(`.mcp.json` / `config.toml` / `.claude.json`)与长期记忆(`CLAUDE.md` / `AGENTS.md` → `soul.md`)搬进 DSH,每一步可视化;也可「仅复制指令」手动执行
- **自定义提示词(soul.md 人设)** — 默认 `%USERPROFILE%\.dsh\soul.md`(可换路径),markdown 人设卡注册为 `soul:persona` 系统提示词区块;文件被监听,保存后约 300ms 热重载,无需重启;设置页内直接编辑
- **长期记忆** — 监听会话事件自动捕获每轮「用户提问 → 助手最终答复」,追加写入 `%USERPROFILE%\.dsh\memory\memories.jsonl`(上限 2000 条自动滚动);注册 `memory:recall` 提示词区块(函数文本,每次组装时重读),把最近 N 条(0–10,默认 5)注入新提示词,实现跨会话长期记忆;设置页支持关键词搜索与一键清空
- **后端切换** — 读取/改写 `%USERPROFILE%\.dsh\settings.yaml` 的 `agent-default-model`(provider / model / reasoningEffort),预设:官方 v4 Pro、官方 v4 Flash、opencode-go v4 Flash(第三方,需已装对应 provider 预设)、自定义;写入前自动备份 `settings.yaml.bak`,只对新会话生效
- 数据与配置:`deepharness-tools.json`(开关/路径/条数)、`memory\memories.jsonl`(记忆库),均在 `%USERPROFILE%\.dsh` 下

> 插件工作原理:host 半在 `webServer` 上注册 `/deepharness/api/*` 路由(文件树/读写、命令执行、字体与背景图托管、**浏览器本地文件同源托管 `/deepharness/browser/serve/*`**),浏览器半通过 DSH 的 `dsh.client` 机制自动加载(会话视图栏标签 + 设置项)。背景生效机制:背景承载在 `html/body`,同时用主题令牌把框架/侧栏变为半透明(不使用 `backdrop-filter`,避免创建包含块把全屏浮层困在侧边栏)。文件路径做了工作区包含校验,越界请求一律拒绝;浏览器托管允许绝对路径(本地调试工具)。
>
> 手动安装/卸载(install.ps1 已自动完成):
> ```powershell
> node .\app\lib\bin.js plugin --profile web add .\plugins\deep-harness-appearance
> node .\app\lib\bin.js plugin --profile web remove deep-harness-appearance
> ```
>
> 大肥鱼伴侣插件(`plugins\dsh-dafeiyu`,含桌面宠物程序 `runtime\bin\win32-x64\dsh-dafeiyu-helper.exe`,已随仓库分发)手动安装:
> ```powershell
> node .\app\lib\bin.js plugin --profile web add .\plugins\dsh-dafeiyu
> node .\app\lib\bin.js plugin --profile web remove dsh-dafeiyu
> ```

## 🔒 数据与持久化

- **全部本地**:会话记录、技能、模型配置、沙箱文件均保存在 `%USERPROFILE%\.dsh`,不上传任何服务器
- **仅本机访问**:服务默认绑定 `127.0.0.1`,不对局域网开放
- **会话按工作区存放**:DSH 的会话记录存放在 `%USERPROFILE%\.dsh\sessions\<工作区路径>` 下。请**始终通过 DEEPHARNESS 快捷方式启动**(工作区 = 仓库根目录);若从其他目录手动运行 `npx dsh`,打开工作台会看不到本仓库的旧会话——**会话没有丢,只是换了工作区**,回到 DEEPHARNESS 启动即可恢复
- **配置持久化**:模型配置(`settings.yaml`)、凭据(`.credentials.yaml`)、常驻插件(`profiles\web`)均在 `%USERPROFILE%\.dsh`,卸载/删除仓库均不影响
- **删除即走**:删除仓库目录不影响数据;彻底清除需删除 `%USERPROFILE%\.dsh`

## 📁 项目结构

```
DEEPHARNESS/
├─ app/                        # DeepSeek Harness 应用本体(@deepseek-ai/dsh v0.1.0-rc.6)
│  ├─ lib/                     # CLI 启动入口(bin.js 等)
│  ├─ config/                  # 内置 Agent 预设与技能
│  └─ package.json             # 依赖清单(含 package-lock.json 锁定版本)
├─ desktop/                    # Electron 桌面壳(真正的原生应用窗口)
│  ├─ main.js                  # 主进程:单实例/探测/拉起服务/窗口状态/工作区检查
│  ├─ preload.js               # 页面桥(__dshDesktop:设置/字体/外部链接/状态事件)
│  └─ package.json             # Electron 依赖
├─ plugins/
│  ├─ deep-harness-appearance/ # 常驻增强插件(文件/终端/统计/技能/环境/浏览器/外观/皮肤/费用)
│  │  ├─ lib/index.js          # host 半:/deepharness/api/* 路由(含背景图托管、浏览器文件托管)
│  │  ├─ lib/client.js         # 浏览器半:会话视图标签 + 设置项 + 16:9 背景裁剪
│  │  └─ test/                 # 契约测试(client-bundle.test.cjs)
│  ├─ deep-harness-tools/      # 工具插件(一键夺舍/人设 soul.md/长期记忆/后端切换)
│  │  ├─ lib/index.js          # host 半:systemPrompt 区块 + 记忆捕获 + /deepharness/tools/* 路由
│  │  ├─ lib/client.js         # 浏览器半:设置 →「DEEPHARNESS 工具」区块
│  │  └─ test/                 # 契约测试(client-bundle.test.cjs)
│  └─ dsh-dafeiyu/             # 大肥鱼桌面伴侣(宠物 + 聊天,内置 helper.exe)
│     ├─ src/                  # host 半:helper 进程管理、会话状态桥接
│     ├─ lib/client.js         # 设置页卡片(设置 → 大肥鱼)
│     ├─ runtime/helper.py     # 宠物窗口源码(PySide6)
│     └─ runtime/bin/win32-x64/dsh-dafeiyu-helper.exe  # 编译好的宠物程序
├─ assets/
│  └─ backgrounds/默认.jpg     # 出厂默认背景(16:9 裁剪,2560×1440)
├─ launcher/
│  ├─ DEEPHARNESS.ps1          # 启动器(端口探测 + 后台启动 + 打开界面)
│  ├─ start-hidden.vbs         # 无控制台窗口调用(wscript)
│  └─ assets/dsh.ico           # 应用图标(16–256px 多尺寸)
├─ install.ps1                 # 一键安装:依赖 + 常驻插件 + 桌面快捷方式
├─ uninstall.ps1               # 一键卸载:删除桌面快捷方式(-RemovePlugin 连插件)
├─ tools/
│  ├─ make-icon.ps1            # 图标生成脚本(可复现)
│  └─ logo.png                 # README 横幅
├─ README.md                   # 本文档
├─ LICENSE                     # MIT 协议
└─ .gitignore
```

## ❓ 常见问题

**Q:双击快捷方式后没有反应?**
A:启动是静默的,首次启动需等待服务就绪(通常 5–20 秒)。若超时,原生窗口会显示错误与 `logs\server.err.log` 的错误尾部;桌面壳自身的日志在 `%USERPROFILE%\.dsh\app\boot.log`。

**Q:提示"端口 3080 被占用/服务启动失败"?**
A:启动器只会复用"确认是 DSH 的服务";若是其他程序(或从其他目录手动运行的 `npx dsh`)占用,请先关闭它,或换端口:
```powershell
powershell -ExecutionPolicy Bypass -File .\launcher\DEEPHARNESS.ps1 -Port 8080 -AppMode
```

**Q:打开后会话列表是空的,我之前的对话呢?**
A:会话没有丢。DSH 的会话按"工作区(服务启动目录)"存放——如果 3080 上是**从别的目录**启动的服务(例如手动 `npx @deepseek-ai/dsh@latest web`),就看不到 D:\…\DEEPHARNESS 工作区里的会话。关闭那个服务,再通过 DEEPHARNESS 快捷方式启动即可;桌面应用检测到这种情况时会弹出警告。

**Q:「文件」「终端」等标签不见了?**
A:它们由常驻插件提供。若安装时跳过了插件(或 profile 被重置),手动执行:
```powershell
node .\app\lib\bin.js plugin --profile web add .\plugins\deep-harness-appearance
```
然后重启服务。外观设置存在浏览器本地存储中,清除浏览器数据会重置外观。大肥鱼不见了同理安装 `plugins\dsh-dafeiyu`。

**Q:浏览器标签里点视频/链接没反应?**
A:网站用 `target=_blank`/`window.open` 打开的链接(如 B站视频卡片)需要桌面壳的弹窗就地打开处理——请**完整重启应用**(托盘 → 退出并停止服务 → 重新打开),并确认「浏览器」标签使用的是桌面 webview 模式(重启后自动启用)。

**Q:提示"未找到 Node.js"?**
A:安装 Node.js 20+ 后重试:<https://nodejs.org>

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
powershell -ExecutionPolicy Bypass -File .\uninstall.ps1            # 删除桌面快捷方式
powershell -ExecutionPolicy Bypass -File .\uninstall.ps1 -RemovePlugin  # 同时移除常驻插件
```

删除桌面快捷方式后,删除仓库目录即完成卸载(数据保留在 `%USERPROFILE%\.dsh`)。

## ⚖️ 开源与致谢

- 本项目基于 **MIT 协议**开源(见 [LICENSE](LICENSE))
- 应用本体来自 DeepSeek 官方开源项目 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)(`@deepseek-ai/dsh` v0.1.0-rc.6,MIT)
- 感谢 DeepSeek 团队开源如此出色的 Agent 运行时

---

最后，我添加了一个极简模式V3,以期能重现美丽的灰测白月光。

## English Overview

**DEEPHARNESS** packages [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek's open-source AI agent workbench — as a **native Windows desktop app** (not a browser wrapper).

- **Native window**: an Electron shell (desktop shortcut `DEEPHARNESS`) that probes the local port (3080 by default), boots the DSH server in the background if needed, and opens the workbench in a standalone app window with no address bar or browser chrome. A browser shortcut remains as a fallback.
- **Persistent enhancement plugin**: the file-tree view, terminal panel, stats/skills/env tabs, a built-in lightweight **browser tab** (search / open URLs / debug local `index.html` with ES modules and F12 DevTools), appearance (brand topbar / fonts / gradients / gold trim) and per-session cost estimate ship as a profile plugin (`plugins/deep-harness-appearance`) that auto-loads with the service — no more re-authorizing after every restart. A desktop pet **BigFish** (`plugins/dsh-dafeiyu`) shows live session status and comes with a chat dialog.
- **100% local data**: everything lives in `%USERPROFILE%\.dsh` (sessions are stored per workspace directory); the server binds to `127.0.0.1` only.
- **Requirements**: Windows 10/11 + Node.js 20+.

```powershell
git clone https://github.com/NANTI34/DEEPHARNESS.git
cd DEEPHARNESS
powershell -ExecutionPolicy Bypass -File .\install.ps1   # installs deps + plugin + desktop shortcuts
```

Double-click the **DEEPHARNESS** shortcut on your desktop. Uninstall with `uninstall.ps1`. MIT licensed — see [LICENSE](LICENSE).
