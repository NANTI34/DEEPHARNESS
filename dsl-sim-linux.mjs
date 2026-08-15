// Simulate how the minimal-v3 preset composes on a Linux host.
// Uses the deployment's real loader YAML dialect and the same expression
// semantics as cordis-plugin-loader's evaluate(), with process.platform
// overridden to 'linux' (Node exposes it as configurable).
import { readFileSync } from 'node:fs'
import { load } from 'file:///D:/codee/code8/app/node_modules/js-yaml/index.js'
import { entryListSchema } from 'file:///D:/codee/code8/app/node_modules/@deepseek-ai/cordis-plugin-include/lib/index.js'

const realPlatform = process.platform
// cordis-plugin-loader evaluate(): `new Function("ctx","expr", with(ctx){ return eval(expr) })`
const evaluate = new Function('ctx', 'expr', `
  with (ctx) {
    return eval(expr)
  }
`)

function evalPlatform(expr, platform) {
  Object.defineProperty(process, 'platform', { value: platform, configurable: true })
  try {
    return evaluate({ process }, expr)
  } finally {
    Object.defineProperty(process, 'platform', { value: realPlatform, configurable: true })
  }
}

const file = 'C:/Users/songf/.dsh/.agent-presets/minimal-v3/agent.cordis.yml'
const rows = load(readFileSync(file, 'utf8'), { schema: entryListSchema })

const TOOLS = {
  '@deepseek-ai/dsh-tool-bash-persistent': ['bash (persistent)'],
  '@deepseek-ai/dsh-tool-pwsh': ['pwsh'],
  '@deepseek-ai/dsh-tool-str-replace-editor': ['str_replace_editor'],
  '@deepseek-ai/dsh-tool-fs': ['read', 'write', 'edit'],
  '@deepseek-ai/dsh-tool-fs-search': ['glob', 'grep'],
}

function isDisabled(row, platform) {
  if (row.disabled === undefined) return false
  if (typeof row.disabled === 'boolean') return row.disabled
  if (row.disabled && row.disabled.__jsExpr !== undefined) return Boolean(evalPlatform(row.disabled.__jsExpr, platform))
  return Boolean(row.disabled)
}

const win = [], lin = []
function walk(list, prefix) {
  for (const row of list) {
    const id = prefix ? `${prefix}/${row.id}` : row.id
    const dWin = isDisabled(row, 'win32')
    const dLin = isDisabled(row, 'linux')
    win.push({ id, name: row.name, disabled: dWin })
    lin.push({ id, name: row.name, disabled: dLin })
    if (row.config && Array.isArray(row.config)) walk(row.config, id)
  }
}
walk(rows, '')

console.log('composition:', file)
console.log('node.exe real platform:', realPlatform, '| simulated:', 'linux\n')
console.log('row                                      win32    linux')
for (let i = 0; i < win.length; i++) {
  const w = win[i], l = lin[i]
  const wd = w.disabled ? 'disabled' : 'ENABLED'
  const ld = l.disabled ? 'disabled' : 'ENABLED'
  console.log(`${w.id.padEnd(42)}${wd.padEnd(9)}${ld}`)
}

const toolsFor = (list) => [...new Set(list.filter((r) => !r.disabled).flatMap((r) => TOOLS[r.name] ?? []))].join(', ')
console.log('\nWindows tool list:', toolsFor(win) || '(none)')
console.log('Linux   tool list:', toolsFor(lin) || '(none)')

// The fs-local cwd expression evaluates against the same scope.
const fsLocal = rows.flatMap((r) => (r.config ?? [])).find((r) => r.name === '@deepseek-ai/dsh-fs-local')
if (fsLocal?.config?.cwd?.__jsExpr !== undefined) {
  console.log('\ncwd expr:', fsLocal.config.cwd.__jsExpr)
  console.log('cwd on simulated linux:', evalPlatform(fsLocal.config.cwd.__jsExpr, 'linux'))
}
