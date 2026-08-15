// DEEPHARNESS 常驻增强插件 — host half
// 职责:在 webServer 上注册 /deepharness/api/* 路由,为浏览器端提供:
//   工作区文件树 / 文件读写 / 新建目录(经 fs 服务,遵守沙箱策略)
//   终端命令执行(经 subprocess / node child_process,工作区根为 cwd)
//   字体托管(仓库 fonts\ 目录 + %USERPROFILE%\.dsh\fonts)
// 随服务启动自动加载(由 install.ps1 通过 `dsh plugin --profile web add` 安装)。
import { execFile } from 'node:child_process'
import { promises as fsp, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export const name = 'deep-harness-appearance'

// ── 常量 ──────────────────────────────────────────────────────────────
const API_PREFIX = '/deepharness/api'
const MAX_READ_BYTES = 2 * 1024 * 1024 // 单文件预览上限 2MB
const MAX_TREE_DEPTH = 4
const MAX_TREE_ENTRIES = 600
const MAX_COMMAND_LEN = 8000
const MAX_EXEC_MS = 300000
const FONT_EXTS = new Set(['.ttf', '.otf', '.woff', '.woff2'])
const BG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const BG_MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' }
// 文件树默认隐藏的目录/文件
const IGNORED_NAMES = new Set([
  'node_modules', '.git', '.svn', '.hg', '.venv', '.idea', '.vscode',
  'dist', 'build', 'out', 'coverage', '.next', '.turbo', '.cache',
  '__pycache__', '.pytest_cache', 'logs', 'obj', 'bin', '.dsh'
])
const IGNORED_FILE_RE = /\.(pyc|pyo|class|o|obj|exe|dll|so|dylib|png|jpe?g|gif|webp|ico|ttf|otf|woff2?|zip|7z|rar|tar|gz|lock|map)$/i

// ── 工具 ──────────────────────────────────────────────────────────────
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  })
  res.end(body)
}

function readBody(req, maxBytes = 4 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', chunk => {
      size += chunk.length
      if (size > maxBytes) {
        reject(new Error('request body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export function apply(ctx) {
  const webServer = ctx.webServer
  const root = process.cwd()
  const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
  const fontsDirs = [path.join(root, 'fonts'), path.join(dshHome, 'fonts')]

  /** 解析工作区内相对路径;越界抛错 */
  function safePath(rel) {
    const relStr = String(rel || '.')
    const abs = path.resolve(root, relStr)
    const relCheck = path.relative(root, abs)
    if (relCheck === '..' || relCheck.startsWith('..' + path.sep) || path.isAbsolute(relCheck)) {
      throw new Error('path escapes workspace')
    }
    return abs
  }

  function relOf(absPath) {
    const abs = path.isAbsolute(absPath) ? absPath : path.resolve(root, absPath)
    const rel = path.relative(root, abs)
    return rel === '' ? '.' : rel.split(path.sep).join('/')
  }

  // ── 文件操作(node:fs + 工作区包含约束;用户主动操作,无需观测策略)─
  async function fsStat(abs) {
    const s = await fsp.stat(abs)
    return { type: s.isDirectory() ? 'dir' : 'file', size: s.size }
  }

  // ── 文件树 ──────────────────────────────────────────────────────────
  async function buildTree(rel, depth) {
    const target = safePath(rel)
    let stat
    try { stat = await fsStat(target) } catch { throw new Error('path not found') }
    const isDir = stat.type === 'dir'
    const out = { name: path.basename(target) || root, rel: relOf(target), type: isDir ? 'dir' : 'file' }
    if (!isDir) {
      out.size = stat.size ?? 0
      return out
    }
    if (depth <= 0) return out
    const dirents = await fsp.readdir(target, { withFileTypes: true })
    const children = []
    const sizes = await Promise.all(dirents.slice(0, MAX_TREE_ENTRIES).map(async (entry) => {
      if (IGNORED_NAMES.has(entry.name)) return null
      if (!entry.isDirectory() && IGNORED_FILE_RE.test(entry.name)) return null
      let size
      if (!entry.isDirectory()) {
        try { size = (await fsp.stat(path.join(target, entry.name))).size } catch { size = 0 }
      }
      return { entry, size }
    }))
    for (const item of sizes) {
      if (!item || children.length >= MAX_TREE_ENTRIES) continue
      const { entry, size } = item
      const childIsDir = entry.isDirectory()
      children.push({
        name: entry.name,
        rel: relOf(path.join(target, entry.name)),
        type: childIsDir ? 'dir' : 'file',
        size: childIsDir ? undefined : size
      })
    }
    children.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name, 'zh') : a.type === 'dir' ? -1 : 1))
    out.children = children
    return out
  }

  // ── 命令执行(终端)──────────────────────────────────────────────────
  function runCommand(command, cwd, timeoutMs) {
    return new Promise(resolve => {
      const exe = process.platform === 'win32' ? 'powershell.exe' : 'bash'
      const args = process.platform === 'win32'
        ? ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', command]
        : ['-c', command]
      execFile(exe, args, {
        cwd,
        timeout: timeoutMs,
        maxBuffer: 8 * 1024 * 1024,
        windowsHide: true,
        env: { ...process.env }
      }, (err, stdout, stderr) => {
        if (!err) {
          resolve({ exitCode: 0, timedOut: false, stdout: String(stdout || ''), stderr: String(stderr || '') })
          return
        }
        resolve({
          exitCode: typeof err.code === 'number' ? err.code : 1,
          timedOut: Boolean(err.killed),
          stdout: String(stdout || ''),
          stderr: String(stderr || '') + (err.message ? '\n' + err.message : '')
        })
      })
    })
  }

  // ── 字体 ────────────────────────────────────────────────────────────
  function findFontFile(name) {
    if (typeof name !== 'string' || !name || name.includes('/') || name.includes('\\') || name.includes('..')) return null
    const ext = path.extname(name).toLowerCase()
    if (!FONT_EXTS.has(ext)) return null
    for (const dir of fontsDirs) {
      const file = path.join(dir, name)
      try {
        if (existsSync(file)) return file
      } catch { /* ignore */ }
    }
    return null
  }

  function listFonts() {
    const seen = new Map()
    for (const dir of fontsDirs) {
      let names = []
      try { names = readdirSync(dir) } catch { continue }
      for (const name of names) {
        if (!FONT_EXTS.has(path.extname(name).toLowerCase())) continue
        if (seen.has(name)) continue
        seen.set(name, { name, bytes: (() => { try { return statSync(path.join(dir, name)).size } catch { return 0 } })() })
      }
    }
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  }

  // ── 背景图 ──────────────────────────────────────────────────────────
  const bgDirs = [path.join(root, 'assets', 'backgrounds'), path.join(dshHome, 'backgrounds')]

  function findBgFile(name) {
    if (typeof name !== 'string' || !name || name.includes('/') || name.includes('\\') || name.includes('..')) return null
    const ext = path.extname(name).toLowerCase()
    if (!BG_EXTS.has(ext)) return null
    for (const dir of bgDirs) {
      const file = path.join(dir, name)
      try {
        if (existsSync(file)) return file
      } catch { /* ignore */ }
    }
    return null
  }

  function listBackgrounds() {
    const seen = new Map()
    const userDir = path.join(dshHome, 'backgrounds')
    for (const dir of bgDirs) {
      let names = []
      try { names = readdirSync(dir) } catch { continue }
      for (const name of names) {
        if (!BG_EXTS.has(path.extname(name).toLowerCase())) continue
        if (seen.has(name)) continue
        // source: repo 目录为出厂自带(不可删),dshHome 为用户上传(可删)
        const source = dir === userDir ? 'user' : 'repo'
        seen.set(name, { name, source, bytes: (() => { try { return statSync(path.join(dir, name)).size } catch { return 0 } })() })
      }
    }
    return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
  }

  // ── 路由注册 ────────────────────────────────────────────────────────
  const disposers = []
  const route = (method, pathname, handler) => {
    disposers.push(webServer.register({
      kind: 'exact',
      path: pathname,
      handler: async (req, res) => {
        if (req.method !== method) {
          res.writeHead(405)
          res.end()
          return
        }
        try {
          await handler(req, res)
        } catch (err) {
          sendJson(res, 500, { ok: false, error: String(err?.message || err) })
        }
      }
    }))
  }
  const prefix = (method, pathname, handler) => {
    disposers.push(webServer.register({
      kind: 'prefix',
      path: pathname,
      handler: async (req, res) => {
        if (req.method !== method) {
          res.writeHead(405)
          res.end()
          return
        }
        try {
          await handler(req, res)
        } catch (err) {
          sendJson(res, 500, { ok: false, error: String(err?.message || err) })
        }
      }
    }))
  }

  route('GET', API_PREFIX + '/status', async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      plugin: name,
      version: '1.5.0',
      root,
      dshHome,
      fontsDirs,
      platform: process.platform,
      node: process.version
    })
  })

  route('GET', API_PREFIX + '/tree', async (req, res) => {
    const url = new URL(req.url, 'http://x')
    const rel = url.searchParams.get('path') || '.'
    const depth = Math.min(MAX_TREE_DEPTH, Math.max(0, Number(url.searchParams.get('depth')) || 1))
    const tree = await buildTree(rel, depth)
    sendJson(res, 200, { ok: true, root, tree })
  })

  route('GET', API_PREFIX + '/file', async (req, res) => {
    const url = new URL(req.url, 'http://x')
    const rel = url.searchParams.get('path')
    if (!rel) throw new Error('missing path')
    const target = safePath(rel)
    const stat = await fsStat(target)
    if (stat.type === 'dir') throw new Error('is a directory')
    if (stat.size > MAX_READ_BYTES) {
      sendJson(res, 200, { ok: true, path: relOf(target), size: stat.size, truncated: true, binary: false, content: '' })
      return
    }
    const raw = await fsp.readFile(target)
    const isBinary = raw.subarray(0, 8192).includes(0)
    if (isBinary) {
      sendJson(res, 200, { ok: true, path: relOf(target), size: raw.length, binary: true, content: raw.toString('base64') })
      return
    }
    sendJson(res, 200, { ok: true, path: relOf(target), size: raw.length, binary: false, content: raw.toString('utf8') })
  })

  prefix('POST', API_PREFIX + '/write', async (req, res) => {
    const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
    const rel = String(body.path || '')
    if (!rel) throw new Error('missing path')
    const target = safePath(rel)
    await fsp.mkdir(path.dirname(target), { recursive: true })
    await fsp.writeFile(target, String(body.content ?? ''), 'utf8')
    sendJson(res, 200, { ok: true, path: relOf(target) })
  })

  prefix('POST', API_PREFIX + '/mkdir', async (req, res) => {
    const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
    const rel = String(body.path || '')
    if (!rel) throw new Error('missing path')
    const target = safePath(rel)
    await fsp.mkdir(target, { recursive: true })
    sendJson(res, 200, { ok: true, path: relOf(target) })
  })

  route('GET', API_PREFIX + '/fonts', async (_req, res) => {
    sendJson(res, 200, { ok: true, fonts: listFonts() })
  })

  route('GET', API_PREFIX + '/font', async (req, res) => {
    const url = new URL(req.url, 'http://x')
    const name = url.searchParams.get('name')
    const file = findFontFile(name)
    if (!file) throw new Error('font not found')
    const data = await fsp.readFile(file)
    sendJson(res, 200, { ok: true, name, bytes: data.length, mime: 'font/' + path.extname(file).slice(1).toLowerCase(), dataBase64: data.toString('base64') })
  })

  prefix('POST', API_PREFIX + '/font/upload', async (req, res) => {
    const body = JSON.parse((await readBody(req, 32 * 1024 * 1024)).toString('utf8') || '{}')
    const name = String(body.name || '')
    if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) throw new Error('invalid font name')
    const ext = path.extname(name).toLowerCase()
    if (!FONT_EXTS.has(ext)) throw new Error('unsupported font format')
    const dir = path.join(dshHome, 'fonts')
    await fsp.mkdir(dir, { recursive: true })
    const data = Buffer.from(String(body.dataBase64 || ''), 'base64')
    if (data.length === 0) throw new Error('empty font data')
    await fsp.writeFile(path.join(dir, name), data)
    sendJson(res, 200, { ok: true, name, bytes: data.length })
  })

  route('GET', API_PREFIX + '/backgrounds', async (_req, res) => {
    sendJson(res, 200, { ok: true, backgrounds: listBackgrounds() })
  })

  // 原始图片字节(供 CSS background-image url() 直接引用)
  route('GET', API_PREFIX + '/background', async (req, res) => {
    const url = new URL(req.url, 'http://x')
    const name = url.searchParams.get('name')
    const file = findBgFile(name)
    if (!file) throw new Error('background not found')
    const data = await fsp.readFile(file)
    const mime = BG_MIME[path.extname(file).toLowerCase()] || 'image/jpeg'
    // 壁纸按名称寻址(换背景即换 URL),允许长缓存,避免每次打开页面重复下载
    res.writeHead(200, {
      'content-type': mime,
      'cache-control': 'private, max-age=86400',
      'content-length': data.length
    })
    res.end(data)
  })

  prefix('POST', API_PREFIX + '/background/upload', async (req, res) => {
    const body = JSON.parse((await readBody(req, 64 * 1024 * 1024)).toString('utf8') || '{}')
    let name = String(body.name || '')
    if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) throw new Error('invalid background name')
    const ext = path.extname(name).toLowerCase()
    if (!BG_EXTS.has(ext)) throw new Error('unsupported image format')
    // 裁剪产物统一为 JPEG;若原始格式保留,则去掉多余扩展名标记
    name = path.basename(name, ext) + '.jpg'
    const dir = path.join(dshHome, 'backgrounds')
    await fsp.mkdir(dir, { recursive: true })
    const data = Buffer.from(String(body.dataBase64 || ''), 'base64')
    if (data.length === 0) throw new Error('empty image data')
    await fsp.writeFile(path.join(dir, name), data)
    sendJson(res, 200, { ok: true, name, bytes: data.length })
  })

  // 删除用户上传的背景图(出厂自带 repo 目录的图不可删)
  prefix('POST', API_PREFIX + '/background/delete', async (req, res) => {
    const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
    const name = String(body.name || '')
    if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) throw new Error('invalid background name')
    const file = findBgFile(name)
    if (!file) throw new Error('background not found')
    const userDir = path.join(dshHome, 'backgrounds')
    if (!file.startsWith(userDir + path.sep) && file !== path.join(userDir, name)) {
      throw new Error('出厂自带背景不可删除')
    }
    await fsp.unlink(file).catch(() => { throw new Error('删除失败') })
    sendJson(res, 200, { ok: true, name })
  })

  prefix('POST', API_PREFIX + '/exec', async (req, res) => {
    const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
    const command = String(body.command || '').trim()
    if (!command) throw new Error('missing command')
    if (command.length > MAX_COMMAND_LEN) throw new Error('command too long')
    let cwd = root
    if (body.cwd) {
      const rel = String(body.cwd)
      if (rel !== '.') cwd = safePath(rel)
    }
    const timeoutMs = Math.min(MAX_EXEC_MS, Math.max(1000, Number(body.timeoutMs) || 60000))
    const result = await runCommand(command, cwd, timeoutMs)
    sendJson(res, 200, { ok: true, ...result })
  })

  ctx.effect(() => () => {
    for (const dispose of disposers) dispose()
  }, 'deep-harness-appearance: routes')
}

export const inject = ['webServer']
