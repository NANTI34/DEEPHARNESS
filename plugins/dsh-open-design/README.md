# @open-design/dsh-runtime (adapted)

OpenDesign 的 DeepSeek Harness 配置文件运行时 (`github:nexu-io/open-design`)，为 DEEPHARNESS 适配。

## 功能

- 通过严格 JSONL stdio 协议，让 OpenDesign 驱动已安装的 DeepSeek Harness
- 三个启动模式（由 `dsh --profile web --models/--probe/--stdio` 触发）：
  - `--models`：输出 provider 合格的模型目录
  - `--probe`：输出协议身份信息并退出
  - `--stdio`：充当单个 OpenDesign 运行的服务端（JSONL over stdin/stdout）

## 适配说明（与上游差异）

| 上游行为 | 本次适配 |
| --- | --- |
| 覆盖 `system-prompt` persona | 保留 web profile 现有 persona 与路由模式 |
| 禁用 `hmr` | 保留热更新 |
| 未提供 startup 模式时 `apply` 抛错 | 静默跳过（web profile 零副作用），仅 `--stdio/--probe/--models` 时启用 |

## 构建

```sh
node build.mjs   # 使用 app 的 esbuild，产物输出到 dist/
```

## 许可

Apache-2.0，上游仓库 [nexu-io/open-design](https://github.com/nexu-io/open-design)。