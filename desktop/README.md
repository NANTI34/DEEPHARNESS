# DEEPHARNESS 桌面壳(desktop/)

Electron 主进程:把 DeepSeek Harness 工作台装进一个真正的原生桌面窗口。

## 能力

- **原生窗口** — 独立应用窗口、任务栏图标与标题均为 DEEPHARNESS,无地址栏 / 标签页 / 浏览器菜单
- **一键拉起** — 自动探测 127.0.0.1:3080 上的 DSH 服务,未运行则静默后台启动(带品牌加载页与错误日志展示)
- **单实例** — 重复双击聚焦已有窗口,绝不重复启动服务
- **状态持久化** — 窗口大小 / 位置 / 最大化状态保存于 `%USERPROFILE%\.dsh\app\window-state.json`,下次启动原样恢复
- **系统托盘** — 关闭窗口时询问:「最小化到托盘」/「退出并结束服务」/「退出(服务保持运行)」,可选"记住选择";托盘图标左键打开窗口,右键菜单可随时管理
- **设置桥** — 通过 `window.__dshDesktop` 向工作台插件暴露文件级设置存储(`.dsh\app\desktop-settings.json`)、fonts 目录字体读取与外部链接打开
- **导航安全** — 外部链接一律交给系统浏览器;窗口只加载本机 DSH 服务地址

## 运行

```powershell
# 由 install.ps1 自动安装依赖(npm install)并创建桌面快捷方式
# 手动运行:
.\desktop\node_modules\.bin\electron.cmd .\desktop\main.js

# 自定义端口 / 调试 / 冒烟自测(加载成功后自动退出)
$env:DSH_PORT=8080; .\desktop\node_modules\.bin\electron.cmd .\desktop\main.js
.\desktop\node_modules\.bin\electron.cmd .\desktop\main.js --debug
.\desktop\node_modules\.bin\electron.cmd .\desktop\main.js --smoke
```

## 与启动器的关系

- `launcher\DEEPHARNESS.ps1` 仍是服务层的标准入口(端口探测 / 后台拉起 / 日志);
  `-AppMode` 现在优先打开本桌面壳,Electron 未安装时回退 Edge 应用窗口
- 桌面快捷方式 `DEEPHARNESS` 直接指向 `electron.exe` + `desktop\main.js`,无需任何脚本中转
- `DEEPHARNESS(浏览器)` 快捷方式保留为浏览器回退入口
