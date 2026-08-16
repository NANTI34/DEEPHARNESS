// DEEPHARNESS 工具插件 — host half
// 能力:
//   一键夺舍:把 Codex / Claude Code 的技能 + MCP + 记忆一键迁移到 DSH(迁移会话由客户端触发)
//   人设编辑(soul.md):markdown 人设热重载注入系统提示词(soul:persona)
//   长期记忆:自动捕获(用户消息 → 助手最终答复)写入本地记忆库,按量注入提示词(memory:recall)
//   后端切换:一键切换 agent-default-model(官方 v4 Pro / v4 Flash / opencode-go / 自定义)
// 数据目录:%USERPROFILE%\.dsh\deepharness-tools.json(配置)、memory\memories.jsonl(记忆)
import { promises as fsp, existsSync, readFileSync, watch } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

export const name = 'deep-harness-tools'
export const inject = ['systemPrompt', 'webServer']

const API_PREFIX = '/deepharness/tools'
const TOOLS_VERSION = '1.0.0'
const MAX_MEMORY_ENTRIES = 2000 // 记忆库上限(超出裁掉最旧)
const MEMORY_LINE_MAX = 800 // 单条记忆文件行上限
const USER_TEXT_MAX = 160 // 注入提示词时用户文本截断
const ASSISTANT_TEXT_MAX = 260 // 注入提示词时助手文本截断

// ── 工具 ──────────────────────────────────────────────────────────────
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(body)
}

function readBody(req, maxBytes = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > maxBytes) { reject(new Error('request body too large')); req.destroy(); return }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function dshHomeDir() {
  return process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
}

function toolsConfigPath(home) {
  return path.join(home, 'deepharness-tools.json')
}

function readConfig(home) {
  try {
    const raw = JSON.parse(readFileSync(toolsConfigPath(home), 'utf8'))
    return {
      persona: { enabled: true, path: 'soul.md', ...(raw?.persona || {}) },
      memory: { enabled: true, count: 5, ...(raw?.memory || {}) }
    }
  } catch {
    return { persona: { enabled: true, path: 'soul.md' }, memory: { enabled: true, count: 5 } }
  }
}

function writeConfig(home, config) {
  return fsp.mkdir(path.dirname(toolsConfigPath(home)), { recursive: true }).then(() =>
    fsp.writeFile(toolsConfigPath(home), JSON.stringify(config, null, 2) + '\n', 'utf8'))
}

function resolveHomePath(home, p) {
  const str = String(p || 'soul.md').trim()
  return path.isAbsolute(str) ? str : path.resolve(home, str)
}

// ── 记忆文件(JSONL)──────────────────────────────────────────────────
function memoryFilePath(home) {
  return path.join(home, 'memory', 'memories.jsonl')
}

function loadMemory(home, limit = MAX_MEMORY_ENTRIES) {
  const file = memoryFilePath(home)
  if (!existsSync(file)) return []
  const out = []
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim()) continue
    try {
      const entry = JSON.parse(line)
      if (entry && typeof entry.ts === 'number') out.push(entry)
    } catch { /* skip corrupt line */ }
  }
  return out.length > limit ? out.slice(out.length - limit) : out
}

async function appendMemory(home, entry) {
  const file = memoryFilePath(home)
  await fsp.mkdir(path.dirname(file), { recursive: true })
  const trimmed = {
    ts: entry.ts,
    sessionId: String(entry.sessionId || '').slice(0, 64),
    user: String(entry.user || '').slice(0, MEMORY_LINE_MAX),
    assistant: String(entry.assistant || '').slice(0, MEMORY_LINE_MAX)
  }
  const existing = loadMemory(home, MAX_MEMORY_ENTRIES)
  existing.push(trimmed)
  const kept = existing.slice(-MAX_MEMORY_ENTRIES)
  const tmp = file + '.tmp'
  await fsp.writeFile(tmp, kept.map((e) => JSON.stringify(e)).join('\n') + '\n', 'utf8')
  await fsp.rename(tmp, file)
}

// 消息文本抽取:content 块数组(含嵌套),只取文本
function textOf(blocks) {
  if (typeof blocks === 'string') return blocks.trim()
  if (!Array.isArray(blocks)) return ''
  const parts = []
  const walk = (v) => {
    if (typeof v === 'string') { parts.push(v); return }
    if (Array.isArray(v)) { v.forEach(walk); return }
    if (v && typeof v === 'object') {
      if (typeof v.text === 'string') parts.push(v.text)
      if (typeof v.content === 'string') parts.push(v.content)
      if (Array.isArray(v.content)) v.content.forEach(walk)
    }
  }
  blocks.forEach(walk)
  return parts.join(' ').trim()
}

function isSubagentSession(session) {
  return session?.header?.origin === 'subagent' || Number(session?.header?.delegationDepth ?? 0) > 0
}

function sessionIdOf(session) {
  return String(session?.header?.id ?? session?.id ?? 'unknown-session')
}

// ── 后端预设(agent-default-model)────────────────────────────────────
const BACKEND_PRESETS = [
  { id: 'official-pro', label: '官方 DeepSeek · v4 Pro', provider: 'deepseek-official', model: 'deepseek-v4-pro', reasoningEffort: null },
  { id: 'official-flash', label: '官方 DeepSeek · v4 Flash', provider: 'deepseek-official', model: 'deepseek-v4-flash', reasoningEffort: null },
  { id: 'opencode-flash', label: 'opencode-go · v4 Flash(第三方)', provider: 'opencode-go', model: 'deepseek-v4-flash', reasoningEffort: null }
]
const SAFE_SCALAR = /^[A-Za-z0-9._:/+-]+$/
const REASONING = new Set(['low', 'medium', 'high', 'max'])

function settingsFilePath(home) {
  return path.join(home, 'settings.yaml')
}

function readAgentDefaultModel(text) {
  const out = { provider: null, model: null, reasoningEffort: null }
  let inBlock = false
  for (const line of String(text || '').split(/\r?\n/)) {
    if (!inBlock) {
      if (/^agent-default-model:\s*$/.test(line)) inBlock = true
      continue
    }
    if (!/^\s/.test(line) && line.trim() !== '') break
    const m = /^\s+(provider|model|reasoningEffort):\s*(.+?)\s*$/.exec(line)
    if (m) out[m[1]] = m[2]
  }
  return out
}

function applyAgentDefaultModel(text, provider, model, reasoningEffort) {
  if (!SAFE_SCALAR.test(provider) || !SAFE_SCALAR.test(model)) throw new Error('provider/model 含非法字符')
  if (reasoningEffort && !REASONING.has(String(reasoningEffort))) throw new Error('reasoningEffort 仅支持 low/medium/high/max')
  const block = ['agent-default-model:', '  provider: ' + provider, '  model: ' + model]
  if (reasoningEffort) block.push('  reasoningEffort: ' + reasoningEffort)
  const lines = String(text || '').split(/\r?\n/)
  const out = []
  let replaced = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!replaced && /^agent-default-model:\s*$/.test(line)) {
      i++
      while (i < lines.length && /^\s/.test(lines[i])) i++
      i--
      out.push(...block)
      replaced = true
      continue
    }
    out.push(line)
  }
  if (!replaced) out.push('', ...block)
  return out.join('\n')
}

// ── 一键夺舍迁移提示词(参考 dsh-easy-setup,适配本仓库)────────────────
function buildMigrationPrompt(home) {
  const h = home.replace(/\\/g, '/')
  return [
    '一键夺舍:请把当前工作区里另一款 AI 编程工具(Claude Code / Codex / 其他 Agents 兼容工具)的配置全部迁移到 DSH。工作区可能是普通项目目录,也可能直接是那款工具的安装/配置目录(如 ~/.codex、~/.claude 本身),两种布局都要扫。全程用工具调用完成,只读源文件、不要修改或移动任何原有文件:',
    '',
    '1) 技能(Skills)迁移',
    '   - 扫描工作区下的技能目录:.claude/skills/*/SKILL.md、.codex/skills/*/SKILL.md、.agents/skills/*/SKILL.md,以及工作区根目录的 skills/*/SKILL.md(有哪些扫哪些,没有就跳过)',
    `   - 把每个技能目录完整复制到 DSH 全局技能目录 ${h}/skills/<技能名>/(目标已存在同名技能则跳过并记录)`,
    '',
    '2) MCP 服务器迁移',
    '   - 依次查找并读取:工作区下的 .mcp.json(项目级);工作区根目录的 config.toml(Codex 全局配置,解析其中 [mcp_servers] 段);工作区下的 .codex/config.toml;若工作区是 ~/.claude 或 ~/.codex 本身,则还要读其上级目录的 .claude.json(Claude 全局配置,解析顶层 mcpServers 字段)(有哪些读哪些)',
    `   - 把每个服务器转换为 DSH 的 MCP 插件行,追加到 ${h}/profiles/web/cordis.patch.yml 末尾(同 id 已存在则跳过)。stdio 型(有 command)格式:`,
    '       - insert:',
    '           - id: mcp-<服务器名>',
    "             name: '@deepseek-ai/dsh-mcp-client'",
    '             config:',
    '               transport: stdio',
    '               serverName: <服务器名>',
    '               command: <启动命令>',
    '               args: [<参数列表>]',
    '   - http 型(有 url 无 command)改用 transport: streamable-http 并写 url 字段',
    '',
    '3) 记忆与人设迁移',
    '   - 读取工作区下的 CLAUDE.md、AGENTS.md(含 .claude/CLAUDE.md,有哪些读哪些)',
    `   - 把内容追加到 ${h}/soul.md 末尾,先加一行一级标题「# 迁移自旧工具的记忆」,不要覆盖或改动 soul.md 已有内容`,
    '   - 注意:soul.md 会被当作提示词模板渲染,写入的内容里绝对不能出现成对双花括号定界符(变量语法,无转义);如原文包含,改写成单花括号或文字描述',
    '',
    '4) 最后给出汇总:列出生成了哪些技能、MCP 行与记忆合并结果,跳过了什么及原因,并提醒我重启 DSH 服务后全部生效。'
  ].join('\n')
}

// ── 插件主体 ────────────────────────────────────────────────────────
export function apply(ctx) {
  const home = dshHomeDir()
  const webServer = ctx.webServer
  let config = readConfig(home)

  // ── 提示词区块(人设 + 记忆)────────────────────────────────────────
  let personaDisposer = null
  let personaWatcher = null
  let personaTimer = undefined

  const personaFile = () => resolveHomePath(home, config.persona.path)

  const registerPersona = () => {
    if (personaDisposer) { try { personaDisposer() } catch { /* ignore */ } personaDisposer = null }
    if (!config.persona.enabled) return
    let text = ''
    try { text = readFileSync(personaFile(), 'utf8') } catch { text = '' }
    if (!text.trim()) return
    try {
      personaDisposer = ctx.systemPrompt.section({
        name: 'soul:persona',
        order: 1,
        text
      })
      ctx.logger?.info?.('[deep-harness-tools] persona section registered')
    } catch (error) {
      ctx.logger?.warn?.('[deep-harness-tools] persona section failed: ' + String(error?.message || error))
    }
  }

  const startPersonaWatch = () => {
    if (personaWatcher) { try { personaWatcher.close() } catch { /* ignore */ } personaWatcher = null }
    try {
      const dir = path.dirname(personaFile())
      personaWatcher = watch(dir, { persistent: false }, (_event, filename) => {
        if (filename && String(filename).toLowerCase() !== path.basename(personaFile()).toLowerCase()) return
        clearTimeout(personaTimer)
        personaTimer = setTimeout(registerPersona, 300)
      })
    } catch { /* watch best-effort */ }
  }

  // 记忆注入:函数文本每次组装时重读记忆文件 → 始终最新
  const registerMemory = () => {
    if (memoryDisposer) { try { memoryDisposer() } catch { /* ignore */ } memoryDisposer = null }
    if (!config.memory.enabled) return
    try {
      memoryDisposer = ctx.systemPrompt.section({
        name: 'memory:recall',
        order: 5,
        text: () => {
          try {
            const entries = loadMemory(home, Math.max(0, Math.min(10, Number(config.memory.count) || 0)))
            if (!entries.length) return ''
            const lines = entries.slice().reverse().map((e) => {
              const t = new Date(e.ts).toLocaleString('zh-CN', { hour12: false })
              const user = String(e.user || '').slice(0, USER_TEXT_MAX)
              const assistant = String(e.assistant || '').slice(0, ASSISTANT_TEXT_MAX)
              return `- ${t} 用户:${user}${assistant ? ' | 助手: ' + assistant : ''}`
            })
            return '# 长期记忆(自动捕获的过往对话,按需参考,不可编造)\n' + lines.join('\n')
          } catch { return '' }
        }
      })
      ctx.logger?.info?.('[deep-harness-tools] memory section registered')
    } catch (error) {
      ctx.logger?.warn?.('[deep-harness-tools] memory section failed: ' + String(error?.message || error))
    }
  }
  let memoryDisposer = null

  const refreshSections = () => { registerPersona(); registerMemory() }

  // ── 长期记忆捕获(会话事件 → 记忆库)────────────────────────────────
  const pendingUser = new Map() // sessionId -> user text
  const offEvent = ctx.on('session/event', (session, event) => {
    try {
      if (!event || typeof event.type !== 'string') return
      if (!config.memory.enabled) return
      if (isSubagentSession(session)) return
      const sessionId = sessionIdOf(session)
      const type = event.type
      const record = event.data && typeof event.data === 'object' ? event.data : {}
      const message = type === 'user/message' ? record : record.message
      if (!message || typeof message !== 'object') return
      if (type === 'user/message') {
        const text = textOf(message.content)
        if (text) pendingUser.set(sessionId, text.slice(0, MEMORY_LINE_MAX))
      } else if (type === 'assistant/message') {
        const text = textOf(message.content)
        if (!text) return
        const user = pendingUser.get(sessionId)
        if (!user) return
        pendingUser.delete(sessionId)
        appendMemory(home, { ts: Date.now(), sessionId, user, assistant: text }).catch(() => { /* 记忆写失败不影响主流程 */ })
      }
    } catch { /* 捕获失败静默 */ }
  }, { global: true })

  // ── 路由 ───────────────────────────────────────────────────────────
  const disposers = []
  const route = (method, pathname, handler) => {
    disposers.push(webServer.register({
      kind: 'exact',
      path: pathname,
      handler: async (req, res) => {
        if (req.method !== method) { res.writeHead(405); res.end(); return }
        try { await handler(req, res) } catch (err) {
          sendJson(res, 500, { ok: false, error: String(err?.message || err) })
        }
      }
    }))
  }

  route('GET', API_PREFIX + '/status', async (_req, res) => {
    const personaPath = personaFile()
    const memories = loadMemory(home, 1)
    const settingsText = existsSync(settingsFilePath(home)) ? readFileSync(settingsFilePath(home), 'utf8') : ''
    sendJson(res, 200, {
      ok: true,
      plugin: name,
      version: TOOLS_VERSION,
      home,
      persona: { enabled: config.persona.enabled, path: personaPath, exists: existsSync(personaPath) },
      memory: { enabled: config.memory.enabled, count: config.memory.count, total: loadMemory(home).length, path: memoryFilePath(home), lastTs: memories.length ? memories[memories.length - 1].ts : null },
      backend: readAgentDefaultModel(settingsText)
    })
  })

  route('GET', API_PREFIX + '/persona', async (_req, res) => {
    const p = personaFile()
    let content = ''
    let exists = false
    try { content = existsSync(p) ? readFileSync(p, 'utf8') : ''; exists = existsSync(p) } catch { /* ignore */ }
    sendJson(res, 200, { ok: true, path: p, exists, enabled: config.persona.enabled, content })
  })

  route('POST', API_PREFIX + '/persona/save', async (req, res) => {
    const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
    const next = {
      persona: {
        enabled: typeof body.enabled === 'boolean' ? body.enabled : config.persona.enabled,
        path: typeof body.path === 'string' && body.path.trim() ? String(body.path).trim() : config.persona.path
      },
      memory: config.memory
    }
    config = { ...config, persona: next.persona }
    await writeConfig(home, next)
    if (typeof body.content === 'string') {
      const p = personaFile()
      await fsp.mkdir(path.dirname(p), { recursive: true })
      await fsp.writeFile(p, body.content, 'utf8')
    }
    startPersonaWatch()
    registerPersona()
    sendJson(res, 200, { ok: true, path: personaFile(), enabled: config.persona.enabled })
  })

  route('GET', API_PREFIX + '/memory', async (req, res) => {
    const url = new URL(req.url, 'http://x')
    const q = String(url.searchParams.get('q') || '').trim().toLowerCase()
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20))
    let entries = loadMemory(home)
    if (q) {
      entries = entries.filter((e) => String(e.user || '').toLowerCase().includes(q) || String(e.assistant || '').toLowerCase().includes(q))
    }
    sendJson(res, 200, { ok: true, total: loadMemory(home).length, entries: entries.slice(-limit).reverse() })
  })

  route('POST', API_PREFIX + '/memory/config', async (req, res) => {
    const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
    const count = Number(body.count)
    config = {
      ...config,
      memory: {
        enabled: typeof body.enabled === 'boolean' ? body.enabled : config.memory.enabled,
        count: Number.isFinite(count) ? Math.max(0, Math.min(10, Math.round(count))) : config.memory.count
      }
    }
    await writeConfig(home, config)
    registerMemory()
    sendJson(res, 200, { ok: true, memory: config.memory })
  })

  route('POST', API_PREFIX + '/memory/clear', async (_req, res) => {
    const file = memoryFilePath(home)
    await fsp.mkdir(path.dirname(file), { recursive: true })
    await fsp.writeFile(file, '', 'utf8')
    sendJson(res, 200, { ok: true })
  })

  route('GET', API_PREFIX + '/duoshe', async (_req, res) => {
    sendJson(res, 200, { ok: true, prompt: buildMigrationPrompt(home) })
  })

  route('GET', API_PREFIX + '/backends', async (_req, res) => {
    const settingsText = existsSync(settingsFilePath(home)) ? readFileSync(settingsFilePath(home), 'utf8') : ''
    sendJson(res, 200, {
      ok: true,
      presets: BACKEND_PRESETS,
      current: readAgentDefaultModel(settingsText),
      settingsPath: settingsFilePath(home),
      backedUp: existsSync(settingsFilePath(home) + '.bak')
    })
  })

  route('POST', API_PREFIX + '/backend/apply', async (req, res) => {
    const body = JSON.parse((await readBody(req)).toString('utf8') || '{}')
    const settingsPath = settingsFilePath(home)
    const text = existsSync(settingsPath) ? readFileSync(settingsPath, 'utf8') : ''
    let provider, model, reasoningEffort
    if (body.preset) {
      const preset = BACKEND_PRESETS.find((p) => p.id === body.preset)
      if (!preset) throw new Error('unknown preset')
      provider = preset.provider
      model = preset.model
      reasoningEffort = preset.reasoningEffort ?? undefined
    } else {
      provider = String(body.provider || '').trim()
      model = String(body.model || '').trim()
      reasoningEffort = body.reasoningEffort ? String(body.reasoningEffort).trim() : undefined
      if (!provider || !model) throw new Error('provider/model 不能为空')
    }
    const next = applyAgentDefaultModel(text, provider, model, reasoningEffort)
    await fsp.mkdir(path.dirname(settingsPath), { recursive: true })
    // 先备份(仅一次,避免覆盖旧备份)
    const bak = settingsPath + '.bak'
    if (!existsSync(bak)) await fsp.writeFile(bak, text, 'utf8')
    await fsp.writeFile(settingsPath, next, 'utf8')
    sendJson(res, 200, { ok: true, applied: { provider, model, reasoningEffort: reasoningEffort || null }, note: '新会话将使用该后端;运行中的会话保持原模型。原配置已备份到 settings.yaml.bak' })
  })

  ctx.effect(() => {
    refreshSections()
    startPersonaWatch()
    return () => {
      offEvent?.()
      if (personaDisposer) { try { personaDisposer() } catch { /* ignore */ } }
      if (memoryDisposer) { try { memoryDisposer() } catch { /* ignore */ } }
      if (personaWatcher) { try { personaWatcher.close() } catch { /* ignore */ } }
      if (personaTimer) clearTimeout(personaTimer)
      for (const d of disposers) { try { d() } catch { /* ignore */ } }
    }
  })
}
