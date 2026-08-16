// 一次性测试:在 Node 中以模块系统契约验证 deep-harness-tools 的 client bundle(不渲染 DOM)
const fs = require('fs')
const path = require('path')
const assert = require('assert')

const code = fs.readFileSync(path.join(__dirname, '..', 'lib', 'client.js'), 'utf8')

// ── DOM/localStorage 桩 ─────────────────────────────────────────────
const storage = new Map()
const localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k)
}
const document = { getElementById: () => null, createElement: () => ({}), head: { appendChild: () => {} } }

// ── React 桩 ────────────────────────────────────────────────────────
function hookStub(name) {
  return (...args) => { throw new Error('react hook called outside component: ' + name) }
}
const reactStub = {
  createElement: (type, props, ...children) => ({ type, props: props || null, children }),
  Fragment: Symbol('fragment'),
  useState: hookStub('useState'),
  useEffect: hookStub('useEffect'),
  useRef: hookStub('useRef'),
  useCallback: hookStub('useCallback'),
  useMemo: hookStub('useMemo')
}

// ── 执行 bundle ──────────────────────────────────────────────────────
const registrations = []
const window = { __ModuleLoader__: { load: (handoff) => registrations.push(handoff) } }
const requireFn = (spec) => {
  if (spec === 'react') return reactStub
  throw new Error('unexpected require: ' + spec)
}
const fn = new Function('require', 'window', 'document', 'localStorage', 'fetch', code)
fn(requireFn, window, document, localStorage, () => Promise.reject(new Error('fetch not stubbed')))

assert.strictEqual(registrations.length, 1, 'bundle must register once')
const handoff = registrations[0]
assert.strictEqual(handoff.id, 'deep-harness-tools', 'module id must match package name')
const mod = handoff.factory(requireFn)
assert.strictEqual(typeof mod.apply, 'function', 'exports.apply must be a function')
assert.deepStrictEqual(mod.inject, ['slots', 'theme', 'sessions', 'workspaces'], 'client inject list must match')
console.log('module contract OK: id=%s inject=%j', handoff.id, mod.inject)

// ── 执行 apply(ctx) ──────────────────────────────────────────────────
const slotRegs = []
const fakeCtx = {
  slots: {
    inject: (name, cb) => {
      const reg = cb()
      slotRegs.push({ name, reg })
      return () => {}
    },
    register: (reg) => reg
  },
  theme: { overrideTokens: () => () => {} },
  effect: (cb) => { const dispose = cb(); return () => { if (typeof dispose === 'function') dispose() } }
}
mod.apply(fakeCtx)

const settingsSections = slotRegs.filter((r) => r.name === 'settings.section')
assert.strictEqual(settingsSections.length, 1, 'one settings.section expected')
assert.strictEqual(settingsSections[0].reg.id, 'deepharness-tools')
assert.strictEqual(typeof settingsSections[0].reg.label, 'function')
assert.ok(settingsSections[0].reg.label().length > 0)
console.log('slot registrations OK:')
for (const r of slotRegs) console.log('  -', r.name, '->', r.reg.id, r.reg.order)
console.log('DEEP-HARNESS-TOOLS CLIENT BUNDLE CONTRACT TEST PASSED')
