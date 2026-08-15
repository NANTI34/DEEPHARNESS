// DEEPHARNESS 桌面壳(主进程)
// 职责:单实例锁 → 探测/拉起 DSH 服务 → 原生窗口加载工作台
//      窗口状态持久化(%USERPROFILE%\.dsh\app\window-state.json)
//      设置持久化桥(%USERPROFILE%\.dsh\app\desktop-settings.json)
// 用法:electron main.js [--port 3080] [--smoke] [--debug]
const { app, BrowserWindow, ipcMain, shell, Menu, Tray, dialog } = require('electron')
const { spawn, execFile } = require('child_process')
const fs = require('fs')
const path = require('path')
const net = require('net')

const ROOT = path.resolve(__dirname, '..')
const PORT = Number(process.env.DSH_PORT || argValue('--port') || 3080)
const IS_SMOKE = process.env.DSH_SMOKE === '1' || process.argv.includes('--smoke')
const IS_DEBUG = process.argv.includes('--debug') || process.env.DSH_DEBUG === '1'
const URL_BASE = 'http://127.0.0.1:' + PORT
const DSH_HOME = process.env.DSH_HOME || path.join(process.env.USERPROFILE || '', '.dsh')
const APP_STATE_DIR = path.join(DSH_HOME, 'app')
const WINDOW_STATE_FILE = path.join(APP_STATE_DIR, 'window-state.json')
const SETTINGS_FILE = path.join(APP_STATE_DIR, 'desktop-settings.json')
const ICON = path.join(ROOT, 'launcher', 'assets', 'dsh.ico')
const BIN = path.join(ROOT, 'app', 'lib', 'bin.js')
const LOG_DIR = path.join(ROOT, 'logs')

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
const SMOKE_TIMEOUT_MS = 45000
const BOOT_TIMEOUT_MS = 120000

// Chromium 数据(含 localStorage)放入 .dsh\app\electron-user-data:
// 与产品“数据 100% 在 %USERPROFILE%\.dsh”的承诺一致
// DSH_TEST_USERDATA 用于隔离测试实例(避开单实例锁,不碰真实数据)
app.setPath('userData', process.env.DSH_TEST_USERDATA || path.join(DSH_HOME, 'app', 'electron-user-data'))

// 启动日志(文件级证据,stdout 在 GUI 子系统中不可见)
function bootLog(...args) {
  try {
    fs.mkdirSync(APP_STATE_DIR, { recursive: true })
    fs.appendFileSync(path.join(APP_STATE_DIR, 'boot.log'), '[' + new Date().toISOString() + '] ' + args.map(String).join(' ') + '\n')
  } catch { /* ignore */ }
}

function argValue(name) {
  const i = process.argv.indexOf(name)
  return i >= 0 ? process.argv[i + 1] : null
}

// ── 单实例锁:重复启动时聚焦已有窗口 ──────────────────────────────
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  let win = null
  let serverProc = null
  let bootAborted = false
  let stateWriteTimer = null
  let smokeTimer = null
  let tray = null
  let allowClose = false // 退出流程放行窗口关闭

  app.setName('DEEPHARNESS')
  app.setAppUserModelId('com.deepharness.desktop')
  Menu.setApplicationMenu(null)

  // ── 查找 node.exe ────────────────────────────────────────────────
  function findNode() {
    if (process.env.NODE && fs.existsSync(process.env.NODE)) return process.env.NODE
    for (const p of [
      path.join(process.env.ProgramFiles || '', 'nodejs', 'node.exe'),
      path.join(process.env['ProgramFiles(x86)'] || '', 'nodejs', 'node.exe'),
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'nodejs', 'node.exe')
    ]) if (p && fs.existsSync(p)) return p
    try {
      const out = require('child_process').execSync('where node', { encoding: 'utf8' })
      const first = out.split(/\r?\n/).map(s => s.trim()).find(s => s)
      if (first && fs.existsSync(first)) return first
    } catch { /* ignore */ }
    return null
  }

  // ── 服务探测(与 PowerShell 启动器同语义)────────────────────────
  function portOpen() {
    return new Promise(resolve => {
      const sock = new net.Socket()
      const done = v => { sock.destroy(); resolve(v) }
      sock.setTimeout(800)
      sock.once('connect', () => done(true))
      sock.once('timeout', () => done(false))
      sock.once('error', () => done(false))
      sock.connect(PORT, '127.0.0.1')
    })
  }

  async function httpProbe(pathname, options) {
    try {
      const res = await fetch(URL_BASE + pathname, options)
      const body = await res.text()
      return { ok: res.ok, status: res.status, body }
    } catch { return { ok: false, status: 0, body: '' } }
  }

  async function apiUp() {
    try {
      const res = await fetch(URL_BASE + '/api/session.list', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rpcId: 'desktop-probe' })
      })
      return res.ok
    } catch { return false }
  }

  // 工作区一致性检查:DSH 的会话按"工作区(服务启动目录)"存放。
  // 若 3080 上运行的是别的目录启动的服务,本仓库的会话/文件视图将看不到。
  // 返回不匹配原因(字符串)或 null(匹配/无法判断)。
  async function detectWorkspaceMismatch() {
    try {
      const res = await fetch(URL_BASE + '/api/workspace.list', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ rpcId: 'desktop-workspace-probe' })
      })
      if (!res.ok) return null
      const data = await res.json()
      const items = Array.isArray(data?.items) ? data.items : []
      if (items.length === 0) return null
      const mine = items.find(w => {
        const p = String(w?.path || '')
        return p.replace(/[\\/]+$/, '') === ROOT.replace(/[\\/]+$/, '')
      })
      if (mine) return null
      const first = items[0]
      return '当前 3080 端口运行的是另一个工作区(' + (first?.path || first?.title || '未知') + ')的服务,' +
        '本仓库的会话与文件不会显示。请先关闭那个服务(任务管理器结束其 node 进程),再重新打开本应用。'
    } catch { return null }
  }

  async function serviceUp() {
    if (!(await portOpen())) return false
    const home = await httpProbe('/')
    if (!home.ok || !home.body.includes('__DSH_BOOT__')) return false
    return await apiUp()
  }

  // ── 后台拉起服务 ────────────────────────────────────────────────
  function bootServer() {
    const node = findNode()
    return new Promise((resolve, reject) => {
      if (!node) return reject(new Error('未找到 Node.js,请先安装 Node.js 20+(https://nodejs.org)'))
      if (!fs.existsSync(path.join(ROOT, 'app', 'node_modules'))) {
        return reject(new Error('尚未安装应用依赖,请先运行项目根目录的 install.ps1'))
      }
      fs.mkdirSync(LOG_DIR, { recursive: true })
      const outLog = fs.openSync(path.join(LOG_DIR, 'server.log'), 'a')
      const errLog = fs.openSync(path.join(LOG_DIR, 'server.err.log'), 'a')
      serverProc = spawn(node, [BIN, 'web', '--port', String(PORT)], {
        cwd: ROOT,
        windowsHide: true,
        stdio: ['ignore', outLog, errLog],
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' }
      })
      serverProc.on('error', err => reject(err))
      serverProc.on('exit', (code, signal) => {
        if (serverProc && serverProc.__resolved) return
        reject(new Error('DSH 服务进程已退出(code=' + code + ', signal=' + signal + '),详见 logs\server.err.log'))
      })
      const started = Date.now()
      const poll = setInterval(async () => {
        if (bootAborted) return
        try {
          if (await serviceUp()) {
            clearInterval(poll)
            serverProc.__resolved = true
            serverProc.unref()
            resolve()
          } else if (Date.now() - started > BOOT_TIMEOUT_MS) {
            clearInterval(poll)
            reject(new Error('等待服务就绪超时(' + Math.round(BOOT_TIMEOUT_MS / 1000) + 's),详见 logs\server.err.log'))
          }
        } catch (err) { clearInterval(poll); reject(err) }
      }, 500)
    })
  }

  async function errTail() {
    try {
      const file = path.join(LOG_DIR, 'server.err.log')
      if (!fs.existsSync(file)) return ''
      const text = fs.readFileSync(file, 'utf8')
      return text.split(/\r?\n/).filter(Boolean).slice(-8).join('\n')
    } catch { return '' }
  }

  // ── 窗口状态持久化 ──────────────────────────────────────────────
  function loadWindowState() {
    try {
      const state = JSON.parse(fs.readFileSync(WINDOW_STATE_FILE, 'utf8'))
      if (state && typeof state.width === 'number' && typeof state.height === 'number') return state
    } catch { /* 首次启动 */ }
    return { width: 1440, height: 900 }
  }

  function scheduleSaveWindowState() {
    if (!win) return
    if (stateWriteTimer) clearTimeout(stateWriteTimer)
    stateWriteTimer = setTimeout(() => {
      try {
        if (win.isDestroyed()) return
        const [x, y] = win.getPosition()
        const state = {
          ...win.getBounds(),
          isMaximized: win.isMaximized(),
          // 还原最大化时用到的普通尺寸(最大化状态下不覆盖)
          normal: win.isMaximized() ? (win.__normalBounds || { width: 1440, height: 900 }) : null
        }
        if (state.normal) {
          const nb = win.__normalBounds
          state.normal = nb ? { x: nb.x, y: nb.y, width: nb.width, height: nb.height } : state.normal
          state.x = nb ? nb.x : x
          state.y = nb ? nb.y : y
        }
        fs.mkdirSync(APP_STATE_DIR, { recursive: true })
        fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(state, null, 2))
      } catch { /* 忽略窗口关闭竞态 */ }
    }, 500)
  }

  function sendToRenderer(channel, payload) {
    if (win && !win.isDestroyed()) win.webContents.send(channel, payload)
  }

  // ── 系统托盘 / 退出流程 ───────────────────────────────────────────
  function getCloseAction() {
    // DSH_CLOSE_ACTION 仅供冒烟测试注入,绝不写真实设置文件
    const test = process.env.DSH_CLOSE_ACTION
    if (test && ['ask', 'tray', 'quit-keep', 'quit-stop'].includes(test)) return test
    try {
      const a = readSettingsFile()['closeAction']
      return ['ask', 'tray', 'quit-keep', 'quit-stop'].includes(a) ? a : 'ask'
    } catch { return 'ask' }
  }

  function saveCloseAction(a) {
    try {
      const all = readSettingsFile()
      all['closeAction'] = a
      fs.mkdirSync(APP_STATE_DIR, { recursive: true })
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(all, null, 2))
    } catch { /* ignore */ }
  }

  function saveWindowStateNow() {
    try {
      if (win && !win.isDestroyed()) {
        if (stateWriteTimer) clearTimeout(stateWriteTimer)
        if (!win.isMaximized()) win.__normalBounds = win.getBounds()
        const s = { ...win.getBounds(), isMaximized: win.isMaximized() }
        fs.mkdirSync(APP_STATE_DIR, { recursive: true })
        fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(s, null, 2))
      }
    } catch { /* ignore */ }
  }

  function showMainWindow() {
    if (!win || win.isDestroyed()) {
      createWindow()
      bootAndLoad().catch(err => {
        console.error('[DEEPHARNESS] boot failed:', err)
        sendToRenderer('dsh:error', String(err.message || err))
      })
      return
    }
    if (win.isMinimized()) win.restore()
    win.show()
    win.focus()
  }

  function hideToTray() {
    try {
      saveWindowStateNow()
      if (win && !win.isDestroyed()) win.hide()
      bootLog('hidden to tray')
      if (tray && process.platform === 'win32') {
        try {
          tray.displayBalloon({
            title: 'DEEPHARNESS',
            content: '已最小化到系统托盘,DSH 服务继续运行。右键托盘图标可退出。'
          })
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
  }

  function portPid() {
    return new Promise(resolve => {
      const cmd = '(Get-NetTCPConnection -LocalPort ' + PORT + ' -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess)'
      execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', cmd], { windowsHide: true, timeout: 8000 }, (err, stdout) => {
        const pid = Number(String(stdout || '').trim())
        resolve(Number.isInteger(pid) && pid > 0 ? pid : null)
      })
    })
  }

  // 停止本地 DSH 服务:优先结束自己拉起的进程,否则结束占用端口的进程
  async function stopService() {
    const target = serverProc && serverProc.pid ? serverProc.pid : await portPid()
    if (!target) {
      bootLog('stopService: no pid found on port', PORT)
      return false
    }
    await new Promise(resolve => {
      execFile('taskkill', ['/PID', String(target), '/T', '/F'], { windowsHide: true, timeout: 10000 }, () => resolve())
    })
    bootLog('stopService: killed pid', target)
    return true
  }

  async function quitApp(stopServiceToo) {
    allowClose = true
    try {
      saveWindowStateNow()
      if (stopServiceToo) {
        bootLog('exit with service stop')
        await stopService()
      } else {
        bootLog('exit keep service')
      }
    } catch (err) { bootLog('exit error', String(err)) }
    app.exit(0)
  }

  async function onCloseRequested() {
    const action = getCloseAction()
    if (action === 'tray') return hideToTray()
    if (action === 'quit-stop') return quitApp(true)
    if (action === 'quit-keep') return quitApp(false)
    let result
    try {
      result = await dialog.showMessageBox(win, {
        type: 'question',
        title: 'DEEPHARNESS',
        message: '关闭窗口后希望如何处理?',
        detail: '· 最小化到托盘:应用驻留系统托盘,DSH 服务继续运行\n' +
          '· 退出并结束服务:退出应用,并停止本地 DSH 服务\n' +
          '· 退出(服务保持运行):仅关闭应用窗口,服务常驻后台',
        buttons: ['最小化到托盘', '退出并结束服务', '退出(服务保持运行)'],
        defaultId: 0,
        cancelId: 2,
        noLink: true,
        checkboxLabel: '记住选择,下次直接执行'
      })
    } catch { return }
    if (result.checkboxChecked) {
      saveCloseAction(['tray', 'quit-stop', 'quit-keep'][result.response] || 'ask')
    }
    if (result.response === 0) hideToTray()
    else if (result.response === 1) quitApp(true)
    else quitApp(false)
  }

  function createTray() {
    try {
      tray = new Tray(ICON)
      tray.setToolTip('DEEPHARNESS - DeepSeek Harness 工作台')
      tray.setContextMenu(Menu.buildFromTemplate([
        { label: '打开工作台', click: showMainWindow },
        { type: 'separator' },
        { label: '最小化到托盘', click: hideToTray },
        { type: 'separator' },
        { label: '退出(服务保持运行)', click: () => quitApp(false) },
        { label: '退出并停止服务', click: () => quitApp(true) }
      ]))
      tray.on('click', showMainWindow)
      bootLog('tray created')
    } catch (err) {
      bootLog('tray failed', String(err && err.message || err))
    }
  }

  // ── 启动状态页(品牌化加载页)────────────────────────────────────
  const STATUS_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>DEEPHARNESS</title>
<style>
  html,body{height:100%;margin:0}
  body{background:#0F172A;color:#E2E8F0;font-family:'Segoe UI','Microsoft YaHei',sans-serif;
       display:flex;align-items:center;justify-content:center;user-select:none}
  .box{text-align:center;max-width:560px;padding:0 32px}
  .logo{width:88px;height:88px;border-radius:22px;margin:0 auto 24px;
        background:linear-gradient(135deg,#4D6BFE,#7C3AED);display:flex;align-items:center;
        justify-content:center;font-size:40px;font-weight:700;color:#fff}
  h1{font-size:26px;margin:0 0 8px;letter-spacing:1px}
  .sub{color:#94A3B8;font-size:13px;margin:0 0 28px}
  .spin{width:26px;height:26px;border:3px solid #334155;border-top-color:#4D6BFE;
        border-radius:50%;margin:0 auto 18px;animation:r 0.9s linear infinite}
  @keyframes r{to{transform:rotate(360deg)}}
  .status{font-size:14px;color:#CBD5E1;min-height:20px}
  .err{background:#7F1D1D22;border:1px solid #7F1D1D;border-radius:10px;padding:14px;
       font-family:Consolas,monospace;font-size:12px;color:#FCA5A5;text-align:left;
       white-space:pre-wrap;word-break:break-all;max-height:220px;overflow:auto;margin:14px 0}
  .btn{display:inline-block;margin:6px;padding:9px 22px;border-radius:8px;border:1px solid #4D6BFE;
       color:#C7D4FF;background:transparent;cursor:pointer;font-size:13px}
  .btn:hover{background:#4D6BFE22}
  a{color:#7C9BFF}
  .warn{display:none;background:#78350F22;border:1px solid #B45309;border-radius:10px;
       padding:12px 16px;font-size:12.5px;color:#FBBF24;text-align:left;margin-bottom:18px;
       line-height:1.6;word-break:break-all}
</style></head><body><div class="box">
  <div class="logo">D</div>
  <h1>DEEPHARNESS</h1>
  <p class="sub">DeepSeek Harness · Windows 桌面版</p>
  <div class="warn" id="warn"></div>
  <div class="spin" id="spin"></div>
  <div class="status" id="status">正在检查本地服务…</div>
  <div id="err"></div>
  <div id="actions"></div>
  <script>
    const bridge = window.__dshDesktop
    const set = (s, e) => {
      document.getElementById('status').textContent = s
      document.getElementById('err').innerHTML = e || ''
      document.getElementById('actions').innerHTML = e
        ? '<button class="btn" onclick="bridge.actions.retry()">重试</button>' +
          '<button class="btn" onclick="bridge.actions.quit()">退出</button>'
        : ''
    }
    bridge.events.onStatus((s) => set(s))
    bridge.events.onWarn((w) => {
      const el = document.getElementById('warn')
      el.style.display = 'block'
      el.textContent = '⚠ ' + w
    })
    bridge.events.onError((e) => {
      document.getElementById('spin').style.display = 'none'
      set('启动失败', '<div class="err">' + String(e).replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</div>')
    })
  </script>
</div></body></html>`

  function createWindow() {
    const state = loadWindowState()
    win = new BrowserWindow({
      width: state.width,
      height: state.height,
      x: Number.isInteger(state.x) ? state.x : undefined,
      y: Number.isInteger(state.y) ? state.y : undefined,
      minWidth: 1000,
      minHeight: 660,
      title: 'DEEPHARNESS',
      icon: ICON,
      backgroundColor: '#0F172A',
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    })
    win.__normalBounds = { ...win.getBounds() }

    win.once('ready-to-show', () => {
      if (state.isMaximized) win.maximize()
      win.show()
    })

    // 固定标题(不被页面 title 覆盖)
    win.on('page-title-updated', e => e.preventDefault())

    // 窗口状态持久化
    for (const ev of ['resize', 'move']) win.on(ev, () => {
      if (!win.isMaximized()) win.__normalBounds = win.getBounds()
      scheduleSaveWindowState()
    })
    win.on('maximize', scheduleSaveWindowState)
    win.on('unmaximize', scheduleSaveWindowState)
    // 关闭窗口 → 询问:最小化到托盘 / 退出并结束服务 / 退出(服务保持运行)
    win.on('close', (e) => {
      if (allowClose) return
      e.preventDefault()
      onCloseRequested()
    })

    // 外部链接 → 系统浏览器;只允许加载本地服务地址
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (/^https?:/.test(url)) shell.openExternal(url)
      return { action: 'deny' }
    })
    win.webContents.on('will-navigate', (event, url) => {
      const allowed = url.startsWith(URL_BASE + '/') || url.startsWith('file://') || url.startsWith('data:')
      if (!allowed) {
        event.preventDefault()
        if (/^https?:/.test(url)) shell.openExternal(url)
      }
    })

      win.webContents.on('did-fail-load', (_e, code, desc, url) => {
      bootLog('did-fail-load', code, desc, url)
      if (url.startsWith(URL_BASE)) sendToRenderer('dsh:error', '页面加载失败(' + code + ' ' + desc + ')')
    })
    win.webContents.on('render-process-gone', (_e, details) => {
      bootLog('render-process-gone', JSON.stringify(details))
    })
    // 页面加载完成后自检:增强插件的客户端标记(#deep-harness-appearance-bg)
    // 若缺失说明服务刚就绪时 client bundle 请求失败(模块系统不自动重试),
    // 自动刷新页面一次恢复(只重试一次,避免死循环)
    let pluginChecked = false
    win.webContents.on('did-finish-load', () => {
      bootLog('did-finish-load', win.webContents.getURL())
      if (!win.webContents.getURL().startsWith(URL_BASE)) return
      if (pluginChecked || IS_SMOKE) return
      pluginChecked = true
      setTimeout(async () => {
        try {
          const ok = await win.webContents.executeJavaScript(
            "!!document.getElementById('deep-harness-appearance-bg')")
          if (!ok) {
            bootLog('enhancement plugin missing, reloading page once')
            win.webContents.reload()
          }
        } catch { /* ignore */ }
      }, 8000)
    })

    if (IS_DEBUG) win.webContents.openDevTools({ mode: 'detach' })
    bootLog('load status page')
    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(STATUS_HTML))
  }

  async function bootAndLoad() {
    const status = s => sendToRenderer('dsh:status', s)
    status('正在检查本地服务…')
    try {
      const up = await serviceUp()
      bootLog('serviceUp=', up)
      if (!up) {
        status('本地服务未运行,正在后台启动…')
        bootLog('booting server…')
        await bootServer()
        bootLog('server booted')
      }
      // 工作区一致性检查:提示"另一个工作区的服务"导致会话/文件不可见的情况
      const mismatch = await detectWorkspaceMismatch()
      if (mismatch) {
        bootLog('workspace mismatch:', mismatch)
        sendToRenderer('dsh:warn', mismatch)
      }
      status('服务已就绪,正在打开工作台…')
      bootLog('loading', URL_BASE + '/')
      win.loadURL(URL_BASE + '/')
      win.webContents.once('did-finish-load', () => {
        if (IS_SMOKE) {
          const closeAction = process.env.DSH_SMOKE_CLOSE
          if (closeAction) armSmokeClose(closeAction)
          else armSmokeExit()
        }
      })
      if (IS_SMOKE && win.webContents.getURL().startsWith(URL_BASE)) {
        const closeAction = process.env.DSH_SMOKE_CLOSE
        if (closeAction) armSmokeClose(closeAction)
        else armSmokeExit()
      }
    } catch (err) {
      const tail = await errTail()
      bootLog('boot ERROR', String(err.message || err))
      sendToRenderer('dsh:error', String(err.message || err) + (tail ? '\n\n日志尾部:\n' + tail : ''))
    }
  }

  // 冒烟测试专用:预设关闭动作并触发 win.close(),验证托盘/退出流程
  // 注意:通过环境变量注入动作,不写真实设置文件(避免污染用户数据)
  function armSmokeClose(action) {
    if (smokeTimer) return
    process.env.DSH_CLOSE_ACTION = action
    setTimeout(() => {
      bootLog('smoke-close: triggering close, action=' + action)
      if (win && !win.isDestroyed()) win.close()
    }, 2000)
    setTimeout(() => {
      try {
        const visible = win && !win.isDestroyed() && win.isVisible()
        bootLog('smoke-close: verify visible=' + visible)
        console.log('[SMOKE-CLOSE] visible=' + visible + ' action=' + action)
      } catch { /* ignore */ }
      app.exit(0)
    }, 10000)
  }

  async function armSmokeExit() {
    if (smokeTimer) return
    try {
      let renderer = null
      try {
        renderer = JSON.parse(await win.webContents.executeJavaScript(
          'JSON.stringify({ bridge: typeof window.__dshDesktop, boot: typeof window.__DSH_BOOT__, localOk: (function(){ try { localStorage.setItem("dsh-smoke","1"); return localStorage.getItem("dsh-smoke")==="1" } catch(e){ return false } })() })'
        ))
      } catch (err) {
        renderer = { probeError: String(err) }
      }
      const ev = {
        url: win.webContents.getURL(),
        title: win.webContents.getTitle(),
        at: new Date().toISOString(),
        port: PORT,
        rendererReady: !win.webContents.isLoading(),
        renderer
      }
      fs.mkdirSync(APP_STATE_DIR, { recursive: true })
      fs.writeFileSync(path.join(APP_STATE_DIR, 'smoke-last-run.json'), JSON.stringify(ev, null, 2))
      console.log('[SMOKE] window loaded:', JSON.stringify(ev))
    } catch (err) {
      console.error('[SMOKE] evidence write failed:', err)
    }
    smokeTimer = setTimeout(() => {
      console.log('[SMOKE] OK - quitting')
      app.exit(0)
    }, 6000)
    setTimeout(() => { console.error('[SMOKE] TIMEOUT'); app.exit(2) }, SMOKE_TIMEOUT_MS).unref()
  }

  // ── IPC:设置/字体/外部链接桥 ────────────────────────────────────
  function readSettingsFile() {
    try {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf8')
      const obj = JSON.parse(raw)
      return obj && typeof obj === 'object' ? obj : {}
    } catch { return {} }
  }

  ipcMain.handle('dsh:state:read', (_e, key) => {
    const all = readSettingsFile()
    return key === undefined ? all : all[String(key)]
  })
  ipcMain.handle('dsh:state:write', (_e, key, value) => {
    if (typeof key !== 'string' || !/^[\w.-]{1,128}$/.test(key)) throw new Error('invalid settings key')
    const all = readSettingsFile()
    all[key] = value
    fs.mkdirSync(APP_STATE_DIR, { recursive: true })
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(all, null, 2))
    return true
  })
  ipcMain.handle('dsh:fonts:list', () => {
    try {
      const dir = path.join(ROOT, 'fonts')
      if (!fs.existsSync(dir)) return []
      return fs.readdirSync(dir).filter(n => /\.(ttf|otf|woff2?)$/i.test(n)).slice(0, 200)
    } catch { return [] }
  })
  ipcMain.handle('dsh:fonts:read', (_e, name) => {
    if (typeof name !== 'string' || /[/\\]/.test(name)) throw new Error('invalid font name')
    const file = path.join(ROOT, 'fonts', name)
    const ext = path.extname(file).slice(1).toLowerCase()
    if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext)) throw new Error('unsupported font format')
    const data = fs.readFileSync(file)
    const mime = { ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2' }[ext]
    return { name, mime, dataBase64: data.toString('base64'), bytes: data.length }
  })
  ipcMain.handle('dsh:open-external', (_e, url) => {
    if (typeof url === 'string' && /^https?:/.test(url)) shell.openExternal(url)
    return true
  })
  ipcMain.on('dsh:log', (_e, level, ...args) => {
    console.log('[renderer:' + level + ']', ...args)
  })
  ipcMain.on('dsh:retry', () => {
    bootAborted = false
    sendToRenderer('dsh:status', '正在重试…')
    setTimeout(bootAndLoad, 300)
  })
  ipcMain.on('dsh:quit', () => app.quit())
  ipcMain.on('dsh:versions', event => {
    event.returnValue = pkg.version
  })

  // ── 应用生命周期 ────────────────────────────────────────────────
  app.on('second-instance', () => {
    showMainWindow()
  })

  app.on('before-quit', () => {
    allowClose = true
  })

  app.whenReady().then(() => {
    // 每次启动清空页面 HTTP 缓存:保证工作台页面与插件 bundle 永远加载最新版
    // (服务端升级插件后,旧的 index.html/客户端脚本缓存会导致"看起来没更新")
    try {
      const { session } = require('electron')
      session.defaultSession.clearCache().then(() => bootLog('http cache cleared')).catch(() => {})
    } catch { /* ignore */ }
    createWindow()
    createTray()
    bootAndLoad().catch(err => {
      console.error('[DEEPHARNESS] boot failed:', err)
      sendToRenderer('dsh:error', String(err.message || err))
    })
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        bootAndLoad().catch(() => {})
      } else {
        showMainWindow()
      }
    })
  })

  app.on('window-all-closed', () => {
    // 托盘驻留时窗口只是隐藏,不会走到这里;走到这里说明正在退出
    if (serverProc && serverProc.__resolved) serverProc.unref()
    app.quit()
  })
}
