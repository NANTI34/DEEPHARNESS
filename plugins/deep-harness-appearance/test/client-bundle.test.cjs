// 一次性测试:在 Node 中以模块系统契约验证 client bundle(不渲染 DOM)
// 1) 模拟 window.__ModuleLoader__.load 注册
// 2) 模拟 require('react') 桩
// 3) 调用 apply(ctx) 并验证槽位注册
const fs = require('fs')
const path = require('path')
const assert = require('assert')

const code = fs.readFileSync(path.join(__dirname, '..', 'lib', 'client.js'), 'utf8')

// ── DOM/localStorage 桩 ─────────────────────────────────────────────
const storage = new Map()
// 模拟旧版遗留 localStorage:gradient 旧键存在、无 background 新键、brand=off
storage.set('deepharness.gradient', 'forest')
storage.set('deepharness.brand', 'off')
storage.set('deepharness.font', 'default')
const localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k)
}
const styleEls = new Map()
const document = {
  getElementById: (id) => styleEls.get(id) || null,
  createElement: () => ({ id: '', textContent: '' }),
  head: { appendChild: () => {} }
}

// ── React 桩(组件定义期不需要真实 hooks)─────────────────────────────
function hookStub(name) {
  return (...args) => { throw new Error('react hook called outside component: ' + name) }
}
const reactStub = {
  createElement: (type, props, ...children) => ({ type, props: props || null, children }),
  Fragment: Symbol('fragment'),
  memo: (c) => c,
  useState: hookStub('useState'),
  useEffect: hookStub('useEffect'),
  useRef: hookStub('useRef'),
  useCallback: hookStub('useCallback'),
  useMemo: hookStub('useMemo'),
  useLayoutEffect: hookStub('useLayoutEffect')
}

// ── 执行 bundle ──────────────────────────────────────────────────────
const registrations = []
const window = {
  __ModuleLoader__: { load: (handoff) => registrations.push(handoff) },
  prompt: () => null
}
const requireFn = (spec) => {
  if (spec === 'react') return reactStub
  throw new Error('unexpected require: ' + spec)
}
const fn = new Function('require', 'window', 'document', 'localStorage', 'fetch', code)
fn(requireFn, window, document, localStorage, () => Promise.reject(new Error('fetch not stubbed')))

assert.strictEqual(registrations.length, 1, 'bundle must register once')
const handoff = registrations[0]
assert.strictEqual(handoff.id, 'deep-harness-appearance', 'module id must match package name')
const mod = handoff.factory(requireFn)
assert.strictEqual(typeof mod.apply, 'function', 'exports.apply must be a function')
assert.ok(Array.isArray(mod.inject), 'exports.inject must be an array')
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
    register: (reg) => reg,
  },
  theme: {
    overrideTokens: (source, tokens) => {
      assert.strictEqual(source, 'deep-harness-appearance')
      assert.ok(tokens['--dsw-specific-sidebar-fill'], 'brand token override expected')
      return () => {}
    }
  },
  effect: (cb) => { const dispose = cb(); return () => { if (typeof dispose === 'function') dispose() } }
}
mod.apply(fakeCtx)

const viewTabs = slotRegs.filter(r => r.name === 'conversation.view').map(r => r.reg)
assert.strictEqual(viewTabs.length, 2, 'two conversation.view tabs expected')
const ids = viewTabs.map(r => r.id).sort()
assert.deepStrictEqual(ids, ['files', 'terminal'], 'tab ids must be files+terminal')
for (const tab of viewTabs) {
  assert.strictEqual(typeof tab.label, 'function')
  assert.strictEqual(typeof tab.label(), 'string')
  assert.ok(tab.label().length > 0)
  assert.strictEqual(typeof tab.inject, 'function')
  const props = tab.inject('session-test-1')
  assert.strictEqual(props.sessionId, 'session-test-1')
}
const settingsSections = slotRegs.filter(r => r.name === 'settings.section')
assert.strictEqual(settingsSections.length, 1, 'one settings.section expected')
assert.strictEqual(settingsSections[0].reg.id, 'deepharness-appearance')
assert.strictEqual(typeof settingsSections[0].reg.label, 'function')
assert.ok(settingsSections[0].reg.label().length > 0, 'section nav label required')

// 无 background 设置时(旧版遗留 gradient 键存在):apply 应写入出厂默认背景 默认.jpg
const migrated = JSON.parse(storage.get('deepharness.background'))
assert.strictEqual(migrated.kind, 'image', 'default background must be image')
assert.strictEqual(migrated.name, '默认.jpg', 'default background must be 默认.jpg')
console.log('default background OK: ' + storage.get('deepharness.background'))

console.log('slot registrations OK:')
for (const r of slotRegs) console.log('  -', r.name, '->', r.reg.id, r.reg.order)
console.log('CLIENT BUNDLE CONTRACT TEST PASSED')
