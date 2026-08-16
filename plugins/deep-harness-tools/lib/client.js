// DEEPHARNESS 工具插件 — client half(设置页「实用工具」独立区块)
// 一键夺舍 / 人设编辑(soul.md) / 长期记忆 / 后端切换
window.__ModuleLoader__.load({
  id: "deep-harness-tools",
  factory: (require) => {
    const module = { exports: {} };
    const exports = module.exports;
    const React = require("react");

    const API = "/deepharness/tools";

    async function apiGet(path) {
      const res = await fetch(API + path, { headers: { accept: "application/json" } });
      const data = await res.json().catch(() => ({ ok: false, error: "bad response" }));
      if (!res.ok || !data.ok) throw new Error(data.error || ("HTTP " + res.status));
      return data;
    }
    async function apiPost(path, body) {
      const res = await fetch(API + path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body || {})
      });
      const data = await res.json().catch(() => ({ ok: false, error: "bad response" }));
      if (!res.ok || !data.ok) throw new Error(data.error || ("HTTP " + res.status));
      return data;
    }

    const STYLES = {      section: { display: "flex", flexDirection: "column", gap: 8, padding: "14px 16px", borderRadius: 12, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)" },
      sectionTitle: { fontSize: 14, fontWeight: 700, color: "var(--dsw-alias-label-primary)" },
      row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
      label: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-secondary)", minWidth: 96 },
      hint: { fontSize: 12, lineHeight: 1.6, color: "var(--dsw-alias-label-tertiary)" },
      button: { padding: "6px 14px", borderRadius: 8, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-3)", color: "var(--dsw-alias-label-primary)", fontSize: 13, cursor: "pointer" },
      buttonPrimary: { padding: "6px 14px", borderRadius: 8, border: "1px solid #4D6BFE", background: "#4D6BFE", color: "#fff", fontSize: 13, cursor: "pointer" },
      input: { padding: "6px 10px", borderRadius: 8, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-3)", color: "var(--dsw-alias-label-primary)", fontSize: 13, outline: "none" },
      textarea: { width: "100%", minHeight: 180, resize: "vertical", padding: "8px 10px", borderRadius: 8, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-3)", color: "var(--dsw-alias-label-primary)", fontFamily: "Consolas, monospace", fontSize: 12, lineHeight: 1.5, boxSizing: "border-box", outline: "none" },
      ok: { fontSize: 12, color: "var(--dsw-alias-state-success-primary, #22C55E)" },
      err: { fontSize: 12, color: "var(--dsw-alias-state-error-primary, #F87171)" }
    };

    // ── 插件市场(精选,离线清单;安装命令复制后自行执行)────────────────
    const MARKET_PLUGINS = [
      { id: "better-sidebar", name: "dsh-better-sidebar", desc: "侧边栏工作台:文件/编辑器/内嵌浏览器/真实终端/Git 面板(omdsh-dev)", install: "dsh-better-sidebar" },
      { id: "tdai-memory", name: "dsh-tdai-memory", desc: "长期记忆:腾讯云 Agent Memory 移植(L0 捕获→L1 结构化→自动召回注入)", install: "dsh-tdai-memory" },
      { id: "soul-md", name: "dsh-soul-md", desc: "soul.md 人设热重载:markdown 人设注入系统提示词,改动即生效", install: "dsh-soul-md" },
      { id: "tool-vision", name: "dsh-tool-vision", desc: "外置视觉模型:任意 OpenAI 兼容 VLM(识图/OCR/读图表)", install: "dsh-tool-vision" },
      { id: "webui-market", name: "dsh-webui-market", desc: "在线插件市场:浏览 awesome-dsh-plugin.com 并一键安装(需联网)", install: "dsh-webui-market" },
      { id: "easy-setup", name: "dsh-easy-setup", desc: "快速配置:视觉模型选择/soul.md 编辑/一键迁移(夺舍)", install: "dsh-easy-setup" },
      { id: "skin-switch", name: "dsh-skin-switch", desc: "皮肤切换器(EAC 配套:互斥切换 + 恢复默认)", install: "dsh-skin-switch" },
      { id: "balance", name: "dsh-balance", desc: "DeepSeek 余额小部件:对话底部实时显示本轮费用与余额", install: "dsh-balance" },
      { id: "terminal", name: "dsh-terminal", desc: "会话内持久终端:SSE 流式、断线重连(EAC 配套)", install: "dsh-terminal" },
      { id: "file-changes", name: "dsh-file-changes", desc: "文件更改追踪 + 一键还原:行级 diff(EAC 配套)", install: "dsh-file-changes" },
      { id: "deep-flow", name: "@jkxie/dsh-deep-flow", desc: "深度思考流式展示:思考过程可视化", install: "@jkxie/dsh-deep-flow" },
      { id: "tui", name: "dsh-TUI", desc: "Claude Code 风格全屏交互终端:工作状态行/滚动回滚/上下文进度条", install: "dsh-TUI" },
      { id: "mobile-fix", name: "dsh-web-mobile-fix", desc: "移动端布局修复(≤400px 窄屏适配,纯 CSS)", install: "dsh-web-mobile-fix" }
    ];

    function ToolsSettings({ ctx }) {
      const [status, setStatus] = React.useState(null);
      const [msg, setMsg] = React.useState("");
      const [persona, setPersona] = React.useState({ enabled: true, path: "", exists: false, content: "" });
      const [personaDraft, setPersonaDraft] = React.useState("");
      const [memQ, setMemQ] = React.useState("");
      const [memEntries, setMemEntries] = React.useState([]);
      const [memCount, setMemCount] = React.useState(5);
      const [memEnabled, setMemEnabled] = React.useState(true);
      const [memTotal, setMemTotal] = React.useState(0);
      const [backend, setBackend] = React.useState(null);
      const [backendCustom, setBackendCustom] = React.useState({ provider: "", model: "", reasoningEffort: "max" });
      const [duoshePrompt, setDuoshePrompt] = React.useState("");
      const [showDuoshe, setShowDuoshe] = React.useState(false);
      const [duosheBusy, setDuosheBusy] = React.useState(false);

      const loadAll = React.useCallback(() => {
        apiGet("/status").then((d) => {
          setStatus(d);
          setMemCount(d.memory.count);
          setMemEnabled(d.memory.enabled);
          setMemTotal(d.memory.total);
        }).catch((e) => setMsg("读取状态失败: " + String(e.message || e)));
        apiGet("/persona").then((d) => { setPersona({ enabled: d.enabled, path: d.path, exists: d.exists, content: d.content }); setPersonaDraft(d.content); }).catch(() => { /* 待插件就绪 */ });
        apiGet("/backends").then(setBackend).catch(() => { /* 待插件就绪 */ });
        apiGet("/duoshe").then((d) => setDuoshePrompt(d.prompt)).catch(() => { /* 待插件就绪 */ });
      }, []);
      React.useEffect(() => { loadAll(); }, [loadAll]);

      const savePersona = async () => {
        try {
          await apiPost("/persona/save", { enabled: persona.enabled, path: persona.path, content: personaDraft });
          setMsg("✓ 人设已保存(soul.md 热重载,约 300ms 生效)");
        } catch (err) { setMsg("人设保存失败: " + String(err.message || err)); }
      };

      const searchMemory = async () => {
        try {
          const d = await apiGet("/memory?q=" + encodeURIComponent(memQ) + "&limit=30");
          setMemEntries(d.entries || []);
          setMemTotal(d.total);
        } catch (err) { setMsg("记忆读取失败: " + String(err.message || err)); }
      };
      React.useEffect(() => { searchMemory(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

      const clearMemory = async () => {
        try {
          await apiPost("/memory/clear", {});
          setMemEntries([]);
          setMemTotal(0);
          setMsg("✓ 记忆库已清空");
        } catch (err) { setMsg("清空失败: " + String(err.message || err)); }
      };

      const saveMemConfig = async () => {
        try {
          await apiPost("/memory/config", { enabled: memEnabled, count: memCount });
          setMsg("✓ 记忆设置已保存(新提示词组装时生效)");
        } catch (err) { setMsg("保存失败: " + String(err.message || err)); }
      };

      const applyBackend = async (presetId) => {
        try {
          const d = await apiPost("/backend/apply", { preset: presetId });
          setMsg("✓ " + d.note);
          const b = await apiGet("/backends");
          setBackend(b);
        } catch (err) { setMsg("后端切换失败: " + String(err.message || err)); }
      };
      const applyBackendCustom = async () => {
        try {
          const d = await apiPost("/backend/apply", { provider: backendCustom.provider, model: backendCustom.model, reasoningEffort: backendCustom.reasoningEffort });
          setMsg("✓ " + d.note);
          const b = await apiGet("/backends");
          setBackend(b);
        } catch (err) { setMsg("后端切换失败: " + String(err.message || err)); }
      };

      // 一键夺舍:创建目标工作区会话并自动发送迁移指令(与 dsh-easy-setup 同机制)
      const startDuoshe = async () => {
        if (!ctx.workspaces || !ctx.sessions) { setMsg("工作区/会话服务不可用,请使用「仅复制指令」手动迁移"); return; }
        setDuosheBusy(true);
        setMsg("");
        try {
          const path = await ctx.workspaces.pickDirectory();
          if (!path) { setMsg("已取消选择"); return; }
          const ws = await ctx.workspaces.create({ path });
          const sessionId = await ctx.workspaces.connectWorkspace(ws.workspaceId);
          ctx.sessions.open(sessionId);
          // 等待新会话的 conversation 服务就绪
          let conversation = null;
          for (let i = 0; i < 40 && !conversation; i++) {
            await new Promise((r) => setTimeout(r, 200));
            try {
              const scoped = ctx.sessions.scope(sessionId);
              conversation = scoped ? scoped.get("conversation") : undefined;
            } catch { conversation = undefined; }
          }
          if (!conversation || typeof conversation.send !== "function") throw new Error("会话 conversation 服务未就绪");
          conversation.send(duoshePrompt).catch(() => { /* 发送后由会话接管 */ });
          setMsg("✓ 已新建迁移会话并自动发送「一键夺舍」指令——切换到该对话观看 AI 逐步完成迁移(skills / MCP / 记忆)");
        } catch (err) {
          setMsg("迁移启动失败: " + String(err.message || err) + " — 可改用「仅复制指令」");
        } finally {
          setDuosheBusy(false);
        }
      };

      const copyText = async (text, okMsg) => {
        try {
          await navigator.clipboard.writeText(text);
          setMsg("✓ " + okMsg);
        } catch { setMsg("复制失败(剪贴板不可用)"); }
      };

      const fmtTime = (ts) => {
        try { return new Date(ts).toLocaleString("zh-CN", { hour12: false }); } catch { return String(ts); }
      };

      return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 860 } },
        status && React.createElement("div", { style: STYLES.hint },
          "插件 v" + (status.version || "?") + " · 数据目录 " + status.home),

        // ── 一键夺舍 ──
        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "一键夺舍(迁移 Claude Code / Codex 到 DSH)"),
          React.createElement("div", { style: STYLES.hint },
            "选择另一款 AI 编程工具的安装/配置目录(如 ~/.codex、~/.claude,也可以是普通项目目录)→ 自动注册为工作区并新建对话 → 迁移指令自动发送。AI 会在对话里把技能(skills)、MCP 服务器、长期记忆(CLAUDE.md / AGENTS.md)全部搬进 DSH,每一步工具调用全程可视化。"),
          React.createElement("div", { style: STYLES.row },
            React.createElement("button", { style: STYLES.buttonPrimary, disabled: duosheBusy || !duoshePrompt, onClick: startDuoshe }, duosheBusy ? "处理中…" : "选择文件夹并开始迁移"),
            React.createElement("button", { style: STYLES.button, onClick: () => copyText(duoshePrompt, "迁移指令已复制到剪贴板,可粘贴到任意会话执行") }, "仅复制指令"),
            duoshePrompt && React.createElement("button", { style: STYLES.button, onClick: () => setShowDuoshe(!showDuoshe) }, showDuoshe ? "隐藏指令" : "查看指令")
          ),
          showDuoshe && duoshePrompt && React.createElement("pre", {
            style: { ...STYLES.hint, whiteSpace: "pre-wrap", fontFamily: "Consolas, monospace", maxHeight: 240, overflowY: "auto", background: "var(--dsw-alias-bg-layer-2)", padding: "8px 10px", borderRadius: 8, margin: 0 }
          }, duoshePrompt)
        ),

        // ── 人设编辑(soul.md) ──
        React.createElement("div", { style: STYLES.section },
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.sectionTitle }, "自定义提示词(人设 soul.md)"),
            React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", marginLeft: "auto" } },
              React.createElement("input", { type: "checkbox", checked: persona.enabled, onChange: (e) => { setPersona({ ...persona, enabled: e.target.checked }); apiPost("/persona/save", { enabled: e.target.checked }).then(() => setMsg(e.target.checked ? "✓ 人设已启用" : "已停用人设")).catch(() => {}); } }),
              "启用"
            )
          ),
          React.createElement("div", { style: STYLES.hint },
            "写入 markdown 人设卡(" + (persona.path || "soul.md") + (persona.exists ? "" : ",文件尚不存在,保存时创建") + "),注入系统提示词;保存后约 300ms 热重载,无需重启。"),
          React.createElement("textarea", {
            style: STYLES.textarea,
            value: personaDraft,
            onChange: (e) => setPersonaDraft(e.target.value),
            placeholder: "# 人设\n你是一个……"
          }),
          React.createElement("div", { style: STYLES.row },
            React.createElement("button", { style: STYLES.buttonPrimary, onClick: savePersona }, "保存人设"),
            React.createElement("span", { style: STYLES.hint }, "注意:内容不要包含成对双花括号 {{...}}(提示词变量语法)"))
        ),

        // ── 长期记忆 ──
        React.createElement("div", { style: STYLES.section },
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.sectionTitle }, "长期记忆(自动捕获)"),
            React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", marginLeft: "auto" } },
              React.createElement("input", { type: "checkbox", checked: memEnabled, onChange: (e) => setMemEnabled(e.target.checked) }),
              "启用"
            )
          ),
          React.createElement("div", { style: STYLES.hint },
            "自动把每轮「用户提问 → 助手最终答复」写入本地记忆库(共 " + memTotal + " 条),并按量注入新会话的系统提示词,实现跨会话长期记忆。"),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "注入条数"),
            React.createElement("select", { style: STYLES.input, value: String(memCount), onChange: (e) => setMemCount(Number(e.target.value)) },
              [0, 3, 5, 8, 10].map((n) => React.createElement("option", { key: n, value: String(n) }, n === 0 ? "不注入" : "最近 " + n + " 条"))
            ),
            React.createElement("button", { style: STYLES.button, onClick: saveMemConfig }, "保存"),
            React.createElement("button", { style: { ...STYLES.button, borderColor: "#B45309", color: "#B45309" }, onClick: clearMemory }, "清空记忆库")
          ),
          React.createElement("div", { style: STYLES.row },
            React.createElement("input", {
              style: { ...STYLES.input, flex: 1, minWidth: 200 },
              value: memQ,
              onChange: (e) => setMemQ(e.target.value),
              onKeyDown: (e) => { if (e.key === "Enter") searchMemory(); },
              placeholder: "搜索记忆关键词…"
            }),
            React.createElement("button", { style: STYLES.button, onClick: searchMemory }, "搜索")
          ),
          memEntries.length > 0 && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" } },
            memEntries.map((e, i) => React.createElement("div", {
              key: e.ts + "-" + i,
              style: { padding: "8px 10px", borderRadius: 8, fontSize: 12, background: "var(--dsw-alias-bg-layer-2)", border: "1px solid var(--dsw-alias-border-l2)" }
            },
              React.createElement("div", { style: { color: "var(--dsw-alias-label-tertiary)", marginBottom: 3 } }, fmtTime(e.ts)),
              React.createElement("div", { style: { color: "var(--dsw-alias-label-primary)" } }, "用户: " + String(e.user || "")),
              e.assistant && React.createElement("div", { style: { color: "var(--dsw-alias-label-secondary)" } }, "助手: " + String(e.assistant).slice(0, 200))
            ))
          ),
          memEntries.length === 0 && React.createElement("div", { style: STYLES.hint }, "暂无记忆(对话几轮后自动出现)")
        ),

        // ── 后端切换 ──
        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "后端(模型一键切换)"),
          React.createElement("div", { style: STYLES.hint },
            "当前: " + (backend && backend.current && backend.current.provider ? backend.current.provider + " / " + backend.current.model + (backend.current.reasoningEffort ? " / " + backend.current.reasoningEffort : "") : "读取中…") +
            " — 切换后对新会话生效,运行中的会话保持原模型;原配置备份在 settings.yaml.bak"),
          React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
            (backend && backend.presets || []).map((p) => {
              const cur = backend && backend.current;
              const active = cur && cur.provider === p.provider && cur.model === p.model;
              return React.createElement("button", {
                key: p.id,
                style: active ? STYLES.buttonPrimary : STYLES.button,
                onClick: () => applyBackend(p.id)
              }, p.label);
            })
          ),
          React.createElement("div", { style: STYLES.row },
            React.createElement("input", { style: { ...STYLES.input, width: 170 }, placeholder: "provider(自定义)", value: backendCustom.provider, onChange: (e) => setBackendCustom({ ...backendCustom, provider: e.target.value }) }),
            React.createElement("input", { style: { ...STYLES.input, width: 170 }, placeholder: "model(自定义)", value: backendCustom.model, onChange: (e) => setBackendCustom({ ...backendCustom, model: e.target.value }) }),
            React.createElement("select", { style: STYLES.input, value: backendCustom.reasoningEffort, onChange: (e) => setBackendCustom({ ...backendCustom, reasoningEffort: e.target.value }) },
              ["max", "high", "medium", "low"].map((r) => React.createElement("option", { key: r, value: r }, "reasoningEffort: " + r))
            ),
            React.createElement("button", { style: STYLES.button, onClick: applyBackendCustom }, "应用自定义后端")
          ),
          React.createElement("div", { style: STYLES.hint },
            "第三方(opencode-go 等)需已安装对应 provider 预设(如 v4-flash-godmode-opencode-go),否则新会话会提示无可用模型。")
        ),

        // ── 插件市场(精选) ──
        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "插件市场(精选)"),
          React.createElement("div", { style: STYLES.hint },
            "社区常用 DSH 插件精选(参考 Deepseek-Harness-EAC 插件体系)。点「复制命令」后在工作区根目录运行即可安装,装完重启服务生效;卸载把 add 换成 remove。"),
          React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" } },
            MARKET_PLUGINS.map((p) => React.createElement("div", {
              key: p.id,
              style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "8px 10px", borderRadius: 8, fontSize: 12, background: "var(--dsw-alias-bg-layer-2)", border: "1px solid var(--dsw-alias-border-l2)" }
            },
              React.createElement("span", { style: { fontWeight: 600, color: "var(--dsw-alias-label-primary)", minWidth: 150 } }, p.name),
              React.createElement("span", { style: { flex: 1, minWidth: 200, color: "var(--dsw-alias-label-secondary)" } }, p.desc),
              React.createElement("button", {
                style: STYLES.button,
                onClick: () => copyText("node app\\lib\\bin.js plugin --profile web " + (p.remove ? "remove " : "add ") + p.install, "安装命令已复制,粘贴到仓库根目录运行")
              }, p.remove ? "复制卸载命令" : "复制安装命令")
            ))
          )
        ),

        msg && React.createElement("div", { style: msg.indexOf("失败") >= 0 ? STYLES.err : STYLES.ok }, msg)
      );
    }

    // ── 插件主体 ────────────────────────────────────────────────────
    const inject = ["slots", "theme", "sessions", "workspaces"];

    function apply(ctx) {
      ctx.slots.inject("settings.section", () => ctx.slots.register({
        name: "settings.section",
        id: "deepharness-tools",
        order: 95,
        label: () => "实用工具"
      }, (props) => React.createElement(ToolsSettings, { ...props, ctx })));
    }

    module.exports = {
      name: "deep-harness-tools-client",
      inject,
      apply
    };
    return module.exports;
  }
});
