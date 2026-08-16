// DEEPHARNESS 桌面壳 preload:向页面暴露最小、明确的能力桥
// - 桌面环境标记 + 版本信息
// - 文件级设置持久化(独立于 localStorage,浏览器模式同样可读)
// - fonts 目录字体文件读取(设置 → 外观 → 导入字体)
// - 打开外部链接 / 应用日志 / 启动状态事件(供加载页与工作台使用)
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('__dshDesktop', {
  isDesktop: true,
  // 「浏览器」标签:桌面壳启用 webviewTag,页面据此使用 <webview>(独立 Chromium + 独立 DevTools)
  webview: true,
  versions: {
    desktop: ipcRenderer.sendSync('dsh:versions')
  },
  state: {
    read: (key) => ipcRenderer.invoke('dsh:state:read', key),
    write: (key, value) => ipcRenderer.invoke('dsh:state:write', key, value)
  },
  fonts: {
    list: () => ipcRenderer.invoke('dsh:fonts:list'),
    read: (name) => ipcRenderer.invoke('dsh:fonts:read', name)
  },
  openExternal: (url) => ipcRenderer.invoke('dsh:open-external', url),
  log: (level, ...args) => ipcRenderer.send('dsh:log', level, ...args),
  events: {
    onStatus: (cb) => { const h = (_e, s) => cb(s); ipcRenderer.on('dsh:status', h); return () => ipcRenderer.removeListener('dsh:status', h) },
    onWarn: (cb) => { const h = (_e, w) => cb(w); ipcRenderer.on('dsh:warn', h); return () => ipcRenderer.removeListener('dsh:warn', h) },
    onError: (cb) => { const h = (_e, s) => cb(s); ipcRenderer.on('dsh:error', h); return () => ipcRenderer.removeListener('dsh:error', h) }
  },
  actions: {
    retry: () => ipcRenderer.send('dsh:retry'),
    quit: () => ipcRenderer.send('dsh:quit')
  }
})
