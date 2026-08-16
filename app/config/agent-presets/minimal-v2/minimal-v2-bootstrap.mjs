/**
 * minimal-v2-bootstrap: 极简V2模式的首轮工具门控。
 *
 * 严格规则（主 Agent 与子 Agent 一致，经 standing scope 的装配瀑布统一生效）：
 *
 *  1. 在会话的当前锚定段内、首个持久 tool/call 之前，目录只暴露 Minimal 双工具：
 *     平台 shell（POSIX 为 bash，Windows 为 pwsh）+ str_replace_editor。
 *  2. 首次工具调用之后，完整目录开放（本 preset 的全部工具行）。
 *  3. 一次成功的压缩（compaction/end 且无 error）重新锚定：锚点回到极简双工具，
 *     直到下一次首次工具调用。
 *
 * 锚定段完全由持久事件推导（最后一次成功压缩 boundary 之后的 tool/call），因此
 * 进程重启/resume/reload 后状态自动保持，无需任何内存簿记。
 *
 * 本插件不发布服务、不注册工具、不改提示词（提示词由 persona 行以 complete
 * persona 固定），只消费宿主 `systemPrompt`/`tools`，可松散放置于 preset 中。
 */

export const name = 'minimal-v2-bootstrap'

export const inject = ['systemPrompt', 'tools']

/** 候选平台 shell 工具名，按平台活跃度只会命中其一。 */
const SHELL_CANDIDATES = ['bash', 'pwsh']
const EDITOR = 'str_replace_editor'

/**
 * 最后一次成功压缩事件（compaction/end 且 data.error 为 undefined）的 seq；
 * 没有任何成功压缩时返回 -1。
 * @param events - 会话的持久事件日志（含被 surface 遮蔽的旧事件）。
 * @returns 边界 seq，或 -1。
 */
function lastSuccessfulCompactionSeq(events) {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index]
    if (event?.type === 'compaction/end' && event.data?.error === undefined) return event.seq
  }
  return -1
}

/**
 * 当前锚定段内是否已出现首次工具调用：存在位于最后一次成功压缩 boundary 之后
 * 的 tool/call 事件。失败的压缩（end 带 error）不是 boundary，不会重置。
 * @param session - 被装配的 Agent 会话。
 * @returns true 表示已解锁完整目录。
 */
function hasUnlocked(session) {
  const boundary = lastSuccessfulCompactionSeq(session.events)
  return session.events.some((event) => event?.type === 'tool/call' && event.seq > boundary)
}

export function apply(ctx, config) {
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next()
    const agent = context.agent
    if (agent === undefined) return assembled // 非 Agent 装配（宿主侧）不动

    // 已解锁：完整目录原样放行。
    if (hasUnlocked(agent.session)) return assembled

    // 锚定段内：只保留平台 shell + str_replace_editor。
    const available = new Set(assembled.tools.map((tool) => tool.name))
    const shell = SHELL_CANDIDATES.find((candidate) => available.has(candidate))
    if (shell === undefined) {
      throw new Error(`${name}: catalog has no platform shell (bash/pwsh)`)
    }
    const keep = new Set([shell, EDITOR])
    return {
      ...assembled,
      tools: assembled.tools.filter((tool) => keep.has(tool.name)),
    }
  })
}
