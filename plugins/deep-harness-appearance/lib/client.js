// DEEPHARNESS 常驻增强插件 — client half(浏览器模块包)
// 由 dsh-client-modules 扫描 dsh.client 声明后以 /plugins/deep-harness-appearance/client.js 提供,
// 页面内核通过 window.__ModuleLoader__.load 注册为 cordis 客户端插件。
// 能力:
//  1. 会话视图栏「文件」「终端」标签(conversation.view 槽位)
//  2. 文件视图:工作区文件树 + 预览/编辑/保存/新建(经 /deepharness/api/*)
//  3. 终端面板:工作区根目录命令执行 + 清屏 + 历史
//  4. 费用估算:基于 tokenUsage 投影,按 DeepSeek 官方峰谷定价估算本会话费用
//  5. 外观:品牌顶栏色 / 字体 / 渐变与图片背景(16:9 固定比例裁剪)/ 半透明毛玻璃
window.__ModuleLoader__.load({
  id: "deep-harness-appearance",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    const React = require("react");

    // ── 工具 ────────────────────────────────────────────────────────
    const API = "/deepharness/api";

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

    function injectCSS(id, css) {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("style");
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = css || "";
    }

    function lsGet(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
      } catch { return fallback; }
    }
    function lsSet(key, value) {
      try { localStorage.setItem(key, value); } catch { /* ignore */ }
    }

    // ── 费用估算(DeepSeek 官方定价,2026-08-17 起峰谷)──────────────
    const PRICING = {
      "deepseek-v4-flash": {
        legacy: { input: 1, cacheRead: 0.02, output: 2 },
        peak: { input: 3, cacheRead: 0.1, output: 9 },
        offpeak: { input: 1.5, cacheRead: 0.05, output: 4.5 }
      },
      "deepseek-v4-pro": {
        legacy: { input: 3, cacheRead: 0.025, output: 6 },
        peak: { input: 9, cacheRead: 0.3, output: 27 },
        offpeak: { input: 4.5, cacheRead: 0.15, output: 13.5 }
      }
    };
    const PEAK_START_UTC = Date.UTC(2026, 7, 16, 16, 0, 0); // 北京时间 2026-08-17 00:00

    function bjHour() {
      const shifted = new Date(Date.now() + 8 * 3600e3);
      return shifted.getUTCHours();
    }
    function isPeak() {
      const h = bjHour();
      return (h >= 9 && h < 12) || (h >= 14 && h < 18);
    }
    function pricingTier(model) {
      const table = PRICING[model] || PRICING["deepseek-v4-flash"];
      if (Date.now() < PEAK_START_UTC) return { table: table.legacy, label: "旧价(8.17 前)", peak: false };
      const peak = isPeak();
      return { table: peak ? table.peak : table.offpeak, label: peak ? "高峰价(9-12/14-18 点)" : "空闲价(高峰半价)", peak };
    }
    function estimateCost(usage, model) {
      const { table } = pricingTier(model);
      const input = (usage.uncachedInputTokens || 0) + (usage.cacheWriteTokens || 0);
      const cacheRead = usage.cacheReadTokens || 0;
      const output = usage.outputTokens || 0;
      const cost = (input * table.input + cacheRead * table.cacheRead + output * table.output) / 1e6;
      return { cost, input, cacheRead, output };
    }
    function formatTokens(n) {
      return n >= 10000 ? (n / 1000).toFixed(1) + "k" : String(n);
    }

    // ── 样式 ─────────────────────────────────────────────────────────
    const STYLES = {
      cost: {
        display: "block", textAlign: "center", fontSize: "12px", lineHeight: "20px",
        color: "var(--dsw-alias-label-tertiary)", padding: "2px 16px 6px",
        fontFamily: "inherit", whiteSpace: "nowrap", overflow: "hidden",
        textOverflow: "ellipsis"
      },
      panel: {
        display: "flex", flexDirection: "column", height: "100%", minHeight: 0,
        boxSizing: "border-box", padding: "10px 14px", gap: "8px",
        fontFamily: "var(--dsh-font-family, inherit)"
      },
      split: { display: "flex", flex: 1, minHeight: 0, gap: "8px" },
      treeCol: {
        width: "30%", minWidth: 180, maxWidth: 320, overflowY: "auto",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px", padding: "4px",
        fontSize: "12px"
      },
      treeRow: {
        display: "flex", alignItems: "center", gap: "4px", padding: "1px 6px",
        borderRadius: "5px", cursor: "pointer", fontSize: "12px", lineHeight: "20px",
        whiteSpace: "nowrap", userSelect: "none"
      },
      editorCol: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" },
      editor: {
        flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box",
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        padding: "8px 10px", fontSize: "12.5px", lineHeight: "1.5",
        fontFamily: "Consolas, 'Cascadia Code', monospace", resize: "none", outline: "none"
      },
      terminal: {
        flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box",
        background: "rgba(11,17,32,0.85)", color: "#D1D5DB",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        padding: "8px 10px", fontSize: "12px", lineHeight: "1.45",
        fontFamily: "Consolas, 'Cascadia Code', monospace", overflowY: "auto",
        whiteSpace: "pre-wrap", wordBreak: "break-all"
      },
      cmdInput: { display: "flex", gap: "6px", alignItems: "center" },
      input: {
        flex: 1, minWidth: 0, boxSizing: "border-box",
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        padding: "6px 10px", fontSize: "12.5px", fontFamily: "inherit", outline: "none"
      },
      button: {
        padding: "5px 12px", borderRadius: "7px", border: "1px solid var(--dsw-alias-border-l2)",
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        fontSize: "12.5px", cursor: "pointer", whiteSpace: "nowrap"
      },
      buttonPrimary: {
        padding: "5px 12px", borderRadius: "7px", border: "none",
        background: "#4D6BFE", color: "#fff", fontSize: "12.5px", cursor: "pointer", whiteSpace: "nowrap"
      },
      hint: { fontSize: "12px", color: "var(--dsw-alias-label-tertiary)" },
      row: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
      select: {
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "7px",
        padding: "5px 8px", fontSize: "12.5px", maxWidth: 260
      },
      label: { fontSize: "13px", color: "var(--dsw-alias-label-secondary)", minWidth: 64 },
      section: {
        display: "flex", flexDirection: "column", gap: "10px",
        borderBottom: "1px solid var(--dsw-alias-border-l2)", padding: "12px 0"
      },
      sectionTitle: { fontSize: "13.5px", fontWeight: 600, color: "var(--dsw-alias-label-primary)" }
    };

    // ── 费用行 ──────────────────────────────────────────────────────
    function CostLine({ useProjection }) {
      let usage = null;
      try { usage = useProjection ? useProjection("tokenUsage") : null; } catch { usage = null; }
      const total = usage
        ? (usage.uncachedInputTokens || 0) + (usage.cacheReadTokens || 0) + (usage.cacheWriteTokens || 0) + (usage.outputTokens || 0)
        : 0;
      if (!usage || total <= 0) return null;
      const flash = estimateCost(usage, "deepseek-v4-flash");
      const pro = estimateCost(usage, "deepseek-v4-pro");
      const tier = pricingTier("deepseek-v4-flash");
      return React.createElement("div", { style: STYLES.cost, title: "按 DeepSeek 官方定价估算,仅供参考" },
        "本会话费用 ≈ ¥" + flash.cost.toFixed(4) + "(flash) / ¥" + pro.cost.toFixed(4) + "(pro) | " +
        "输入 " + formatTokens(flash.input) + " · 缓存命中 " + formatTokens(flash.cacheRead) + " · 输出 " + formatTokens(flash.output) + " | " + tier.label
      );
    }

    // ── 文件视图 ────────────────────────────────────────────────────
    function FileTree({ expanded, onToggle, onSelect, selected, root, refreshKey }) {
      const [dirs, setDirs] = React.useState({});
      const load = React.useCallback(async (rel) => {
        try {
          const d = await apiGet("/tree?path=" + encodeURIComponent(rel) + "&depth=1");
          setDirs(prev => ({ ...prev, [rel]: d.tree.children || [] }));
        } catch { setDirs(prev => ({ ...prev, [rel]: [] })); }
      }, []);
      React.useEffect(() => { load(root || "."); }, [root, load, refreshKey]);

      const renderChildren = (rel) => {
        const children = rel === (root || ".") ? (dirs[root || "."] || []) : (dirs[rel] || []);
        return children.map(child => {
          const isDir = child.type === "dir";
          const isOpen = expanded.has(child.rel);
          return React.createElement(React.Fragment, { key: child.rel },
            React.createElement("div", {
              style: { ...STYLES.treeRow, paddingLeft: 10 },
              title: child.rel,
              onClick: () => {
                if (isDir) {
                  onToggle(child.rel);
                  if (!isOpen && !dirs[child.rel]) load(child.rel);
                } else {
                  onSelect(child.rel);
                }
              }
            },
              React.createElement("span", { style: { width: 14, textAlign: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 11 } },
                isDir ? (isOpen ? "▾" : "▸") : ""),
              React.createElement("span", {
                style: isDir
                  ? { fontWeight: 600, color: "var(--dsw-alias-label-primary)" }
                  : (selected === child.rel ? { color: "#4D6BFE" } : { color: "var(--dsw-alias-label-secondary)" })
              }, child.name),
              child.size !== undefined && React.createElement("span", { style: { marginLeft: "auto", fontSize: 10, color: "var(--dsw-alias-label-tertiary)" } },
                child.size > 1024 ? (child.size / 1024).toFixed(1) + "K" : child.size + "B")
            ),
            isDir && isOpen && React.createElement("div", { style: { marginLeft: 10, borderLeft: "1px solid var(--dsw-alias-border-l2)" } },
              renderChildren(child.rel))
          );
        });
      };
      return React.createElement("div", { style: STYLES.treeCol }, renderChildren(root || "."));
    }

    function FilesView(props) {
      const useProjection = props.useProjection;
      const root = ".";
      const [expanded, setExpanded] = React.useState(new Set());
      const [selected, setSelected] = React.useState(null);
      const [content, setContent] = React.useState(null); // {rel,text,binary,truncated,size}
      const [editing, setEditing] = React.useState("");
      const [dirty, setDirty] = React.useState(false);
      const [msg, setMsg] = React.useState("");
      const [refreshKey, setRefreshKey] = React.useState(0);

      const openFile = async (rel) => {
        try {
          const d = await apiGet("/file?path=" + encodeURIComponent(rel));
          setSelected(rel);
          setContent(d);
          setEditing(d.binary ? "" : (d.content || ""));
          setDirty(false);
          setMsg(d.binary ? "二进制文件,仅显示大小" : d.truncated ? "文件过大,仅显示前 2MB" : "");
        } catch (err) {
          setMsg(String(err.message || err));
        }
      };
      const saveFile = async () => {
        if (!content) return;
        try {
          await apiPost("/write", { path: content.rel, content: editing });
          setDirty(false);
          setMsg("✓ 已保存 " + content.rel);
          setRefreshKey(k => k + 1);
        } catch (err) {
          setMsg("保存失败: " + String(err.message || err));
        }
      };
      const newFile = async () => {
        const name = window.prompt("新建文件(相对工作区根目录,可含子目录):", "notes/新文件.md");
        if (!name) return;
        try {
          await apiPost("/write", { path: name, content: "" });
          setMsg("✓ 已创建 " + name);
          setRefreshKey(k => k + 1);
        } catch (err) {
          setMsg("创建失败: " + String(err.message || err));
        }
      };

      return React.createElement("div", { style: STYLES.panel },
        React.createElement(CostLine, { useProjection }),
        React.createElement("div", { style: STYLES.split },
          React.createElement(FileTree, {
            root,
            expanded,
            selected,
            refreshKey,
            onToggle: (rel) => {
              setExpanded(prev => {
                const next = new Set(prev);
                if (next.has(rel)) next.delete(rel); else next.add(rel);
                return next;
              });
            },
            onSelect: openFile
          }),
          React.createElement("div", { style: STYLES.editorCol },
            React.createElement("div", { style: STYLES.row },
              React.createElement("button", {
                style: STYLES.button,
                title: "重新扫描工作区文件",
                onClick: () => setRefreshKey(k => k + 1)
              }, "⟳ 刷新"),
              React.createElement("button", { style: STYLES.button, onClick: newFile }, "＋ 新建文件"),
              React.createElement("span", { style: { ...STYLES.hint, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
                selected || "选择左侧文件开始编辑"),
              content && !content.binary && React.createElement("button", {
                style: STYLES.buttonPrimary,
                onClick: saveFile,
                disabled: !dirty
              }, dirty ? "保存修改" : "已保存")
            ),
            content === null
              ? React.createElement("div", { style: { ...STYLES.editor, color: "var(--dsw-alias-label-tertiary)" } }, "← 从左侧文件树选择文件")
              : content.binary
                ? React.createElement("div", { style: { ...STYLES.editor, color: "var(--dsw-alias-label-tertiary)" } },
                  "二进制文件(" + (content.size / 1024).toFixed(1) + " KB),不支持文本编辑")
                : React.createElement("textarea", {
                  style: STYLES.editor,
                  value: editing,
                  spellCheck: false,
                  onChange: (e) => { setEditing(e.target.value); setDirty(true); },
                  placeholder: content.truncated ? "文件过大已截断" : ""
                }),
            msg && React.createElement("div", { style: STYLES.hint }, msg)
          )
        )
      );
    }

    // ── 终端面板 ────────────────────────────────────────────────────
    function TerminalView(props) {
      const useProjection = props.useProjection;
      const [lines, setLines] = React.useState([{ type: "sys", text: "DEEPHARNESS 终端 — 工作区根目录命令执行器(PowerShell)" }]);
      const [value, setValue] = React.useState("");
      const [busy, setBusy] = React.useState(false);
      const [history, setHistory] = React.useState([]);
      const [historyIdx, setHistoryIdx] = React.useState(-1);
      const outputRef = React.useRef(null);
      const [root, setRoot] = React.useState(null);

      React.useEffect(() => {
        apiGet("/status").then(d => setRoot(d.root)).catch(() => setRoot(""));
      }, []);
      React.useEffect(() => {
        const el = outputRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, [lines]);

      const run = async (cmd) => {
        const command = cmd.trim();
        if (!command || busy) return;
        setLines(prev => [...prev, { type: "cmd", text: "❯ " + command }]);
        setValue("");
        setHistory(prev => [command, ...prev].slice(0, 50));
        setHistoryIdx(-1);
        setBusy(true);
        try {
          const d = await apiPost("/exec", { command, timeoutMs: 60000 });
          if (d.stdout) setLines(prev => [...prev, { type: "out", text: d.stdout.replace(/\n$/, "") }]);
          if (d.stderr) setLines(prev => [...prev, { type: "err", text: d.stderr.replace(/\n$/, "") }]);
          setLines(prev => [...prev, {
            type: "sys",
            text: d.timedOut ? "[已超时]" : ("[exit code: " + d.exitCode + "]")
          }]);
        } catch (err) {
          setLines(prev => [...prev, { type: "err", text: String(err.message || err) }]);
        } finally {
          setBusy(false);
        }
      };

      return React.createElement("div", { style: STYLES.panel },
        React.createElement(CostLine, { useProjection }),
        React.createElement("div", { ref: outputRef, style: STYLES.terminal },
          lines.map((line, i) => {
            const color = line.type === "err" ? "#F87171" : line.type === "cmd" ? "#93C5FD" : line.type === "sys" ? "#6B7280" : "#D1D5DB";
            return React.createElement("div", { key: i, style: { color } }, line.text);
          }),
          busy && React.createElement("div", { style: { color: "#6B7280" } }, "… 运行中")
        ),
        React.createElement("div", { style: STYLES.cmdInput },
          React.createElement("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 13 } }, "❯"),
          React.createElement("input", {
            style: STYLES.input,
            value: value,
            placeholder: root ? ("在 " + root + " 下运行(Enter 执行,↑↓ 历史)") : "输入命令…",
            spellCheck: false,
            disabled: busy,
            onChange: (e) => setValue(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") { e.preventDefault(); run(value); }
              else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (history.length === 0) return;
                const next = Math.min(historyIdx + 1, history.length - 1);
                setHistoryIdx(next);
                setValue(history[next]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIdx <= 0) { setHistoryIdx(-1); setValue(""); return; }
                const next = historyIdx - 1;
                setHistoryIdx(next);
                setValue(history[next]);
              }
            }
          }),
          React.createElement("button", { style: STYLES.button, onClick: () => setLines([{ type: "sys", text: "— 已清屏 —" }]) }, "清屏"),
          React.createElement("button", { style: STYLES.buttonPrimary, disabled: busy, onClick: () => run(value) }, busy ? "运行中" : "运行")
        )
      );
    }

    // ── 外观系统 ────────────────────────────────────────────────────
    const FONT_CHOICES = [
      { id: "default", label: "默认字体" },
      { id: "Microsoft YaHei", label: "微软雅黑" },
      { id: "SimSun", label: "宋体" },
      { id: "KaiTi", label: "楷体" },
      { id: "Consolas", label: "等宽字体" }
    ];
    const GRADIENT_CHOICES = [
      { id: "nightblue", label: "暗夜蓝", css: "linear-gradient(160deg, #0F172A 0%, #16204A 55%, #1E3A8A 100%)" },
      { id: "aurora", label: "极光紫", css: "linear-gradient(160deg, #0F172A 0%, #312E81 50%, #6D28D9 100%)" },
      { id: "forest", label: "深林", css: "linear-gradient(160deg, #0A0F0D 0%, #064E3B 55%, #065F46 100%)" },
      { id: "solidblue", label: "纯色深蓝", css: "#16204A" }
    ];
    const BRAND_COLOR = "#16204A";
    const DEFAULT_BG_NAME = "默认.jpg";
    // 有背景时:侧栏(含顶栏标题行)/详情栏半透明毛玻璃,中间内容区半透明
    const GLASS_CSS =
      '[class*="sidebarCol"] { background: rgba(22,32,74,0.52) !important; ' +
      'backdrop-filter: blur(18px) saturate(1.25) !important; -webkit-backdrop-filter: blur(18px) saturate(1.25) !important; }\n' +
      '[class*="detailsCol"] { background: rgba(15,23,42,0.52) !important; ' +
      'backdrop-filter: blur(18px) saturate(1.2) !important; -webkit-backdrop-filter: blur(18px) saturate(1.2) !important; }\n' +
      '[class*="centerCol"] { background: rgba(13,18,35,0.78) !important; }';

    function resolveBackground() {
      const raw = lsGet("deepharness.background", null);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.kind === "string") return parsed;
        } catch { /* fall through */ }
      }
      // 出厂默认背景:仓库自带 assets/backgrounds/默认.jpg
      return { kind: "image", name: DEFAULT_BG_NAME };
    }

    // 应用外观(读取 localStorage;返回 disposer 用于撤销令牌覆盖)
    function applyAppearance(theme) {
      const brand = lsGet("deepharness.brand", "on") !== "off";
      const font = lsGet("deepharness.font", "default");
      const bg = resolveBackground();
      const disposers = [];

      let bgLayer = "";
      if (bg.kind === "gradient") {
        const g = GRADIENT_CHOICES.find(c => c.id === bg.id);
        if (g) bgLayer = g.css;
      } else if (bg.kind === "image" && bg.name) {
        bgLayer = "url('" + API + "/background?name=" + encodeURIComponent(bg.name) + "') center/cover no-repeat fixed";
      }

      const css = [];
      if (bgLayer) {
        css.push("html, body { background: " + bgLayer + "; background-color: #0B1220; }");
        css.push(GLASS_CSS);
      } else if (brand) {
        css.push('[class*="sidebarCol"] { background: ' + BRAND_COLOR + ' !important; }');
        css.push("html, body { background-color: #0B1220; }");
      }
      injectCSS("deep-harness-appearance-bg", css.join("\n"));

      if (theme) {
        const tokens = {};
        if (bgLayer) tokens["--dsw-alias-bg-base"] = { light: "rgba(13,18,35,0.8)", dark: "rgba(13,18,35,0.8)" };
        if (brand) {
          tokens["--dsw-specific-sidebar-fill"] = {
            light: bgLayer ? "rgba(22,32,74,0.55)" : BRAND_COLOR,
            dark: bgLayer ? "rgba(22,32,74,0.55)" : BRAND_COLOR
          };
        }
        if (Object.keys(tokens).length > 0) {
          try { disposers.push(theme.overrideTokens("deep-harness-appearance", tokens)); } catch { /* ignore */ }
        }
      }

      if (font !== "default") {
        injectCSS("deep-harness-appearance-font",
          'body, button, input, textarea, select { font-family: "' + font + '", "Microsoft YaHei", system-ui, sans-serif; }');
      } else {
        injectCSS("deep-harness-appearance-font", "");
      }

      return () => {
        for (const d of disposers) { try { d(); } catch { /* ignore */ } }
      };
    }

    // ── 背景图裁剪(固定 16:9)───────────────────────────────────────
    const CROP_RATIO = 16 / 9;

    function CropOverlay({ imageDataUrl, onCancel, onConfirm }) {
      const [scale, setScale] = React.useState(1);
      const [offset, setOffset] = React.useState({ x: 0, y: 0 });
      const imgRef = React.useRef(null);
      const areaRef = React.useRef(null);
      const dragRef = React.useRef(null);

      const onMouseDown = (e) => {
        dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y };
        e.preventDefault();
      };
      React.useEffect(() => {
        const move = (e) => {
          if (!dragRef.current) return;
          setOffset({
            x: dragRef.current.baseX + (e.clientX - dragRef.current.startX),
            y: dragRef.current.baseY + (e.clientY - dragRef.current.startY)
          });
        };
        const up = () => { dragRef.current = null; };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return () => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
        };
      }, []);

      const doCrop = () => {
        const img = imgRef.current;
        const area = areaRef.current;
        if (!img || !area) return;
        const areaW = area.clientWidth, areaH = area.clientHeight;
        const fit = Math.min(areaW / img.naturalWidth, areaH / img.naturalHeight) * scale;
        const dispW = img.naturalWidth * fit, dispH = img.naturalHeight * fit;
        const imgLeft = (areaW - dispW) / 2 + offset.x;
        const imgTop = (areaH - dispH) / 2 + offset.y;
        let boxW = Math.min(areaW * 0.72, areaH * 0.72 * CROP_RATIO);
        let boxH = boxW / CROP_RATIO;
        const boxLeft = (areaW - boxW) / 2, boxTop = (areaH - boxH) / 2;
        let sx = (boxLeft - imgLeft) / fit;
        let sy = (boxTop - imgTop) / fit;
        let sw = boxW / fit;
        let sh = boxH / fit;
        sx = Math.max(0, Math.min(sx, img.naturalWidth - 1));
        sy = Math.max(0, Math.min(sy, img.naturalHeight - 1));
        sw = Math.min(sw, img.naturalWidth - sx);
        sh = Math.min(sh, img.naturalHeight - sy);
        if (sw <= 0 || sh <= 0) { window.alert("裁剪区域超出图片范围,请调整位置或缩小"); return; }
        const canvas = document.createElement("canvas");
        canvas.width = 1600;
        canvas.height = Math.round(1600 / CROP_RATIO);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        onConfirm(canvas.toDataURL("image/jpeg", 0.9));
      };

      return React.createElement("div", {
        style: {
          position: "fixed", inset: 0, zIndex: 99999, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 14,
          background: "rgba(5,10,25,0.82)", backdropFilter: "blur(6px)",
          fontFamily: "var(--dsh-font-family, inherit)"
        }
      },
        React.createElement("div", { style: { color: "#E2E8F0", fontSize: 15, fontWeight: 600 } },
          "裁剪背景图(固定 16:9,拖动图片调整位置)"),
        React.createElement("div", {
          ref: areaRef,
          style: {
            position: "relative", width: "min(92vw, 1000px)", height: "min(60vh, 520px)",
            overflow: "hidden", borderRadius: 12, border: "1px solid #334155",
            background: "#0B1220", cursor: "grab"
          },
          onMouseDown: onMouseDown
        },
          React.createElement("img", {
            ref: imgRef,
            src: imageDataUrl,
            draggable: false,
            style: {
              position: "absolute",
              left: "50%", top: "50%",
              transform: "translate(-50%, -50%) translate(" + offset.x + "px, " + offset.y + "px) scale(" + scale + ")",
              maxWidth: "none", maxHeight: "none",
              pointerEvents: "none", userSelect: "none"
            }
          }),
          React.createElement("div", {
            style: {
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%, -50%)",
              width: "72%", aspectRatio: "16/9", maxHeight: "80%",
              border: "2px solid #4D6BFE", borderRadius: 6, boxSizing: "border-box",
              boxShadow: "0 0 0 9999px rgba(5,10,25,0.45)", pointerEvents: "none"
            }
          })
        ),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, color: "#CBD5E1", fontSize: 13 } },
          "缩放",
          React.createElement("input", {
            type: "range", min: 1, max: 4, step: 0.05, value: scale,
            style: { width: 220 },
            onChange: (e) => setScale(Number(e.target.value))
          }),
          scale.toFixed(2) + "×"
        ),
        React.createElement("div", { style: { display: "flex", gap: 10 } },
          React.createElement("button", {
            style: { ...STYLES.button, padding: "8px 26px", fontSize: 13 },
            onClick: onCancel
          }, "取消"),
          React.createElement("button", {
            style: { ...STYLES.buttonPrimary, padding: "8px 26px", fontSize: 13 },
            onClick: doCrop
          }, "确认裁剪并应用")
        )
      );
    }

    // ── 外观设置(设置 → 通用 → DEEPHARNESS 外观)───────────────────
    function AppearanceSettings() {
      const [brand, setBrand] = React.useState(lsGet("deepharness.brand", "on") !== "off");
      const [font, setFont] = React.useState(lsGet("deepharness.font", "default"));
      const [bg, setBg] = React.useState(resolveBackground());
      const [fonts, setFonts] = React.useState([]);
      const [backgrounds, setBackgrounds] = React.useState([]);
      const [msg, setMsg] = React.useState("");
      const [cropImage, setCropImage] = React.useState(null); // dataURL
      const themeDisposerRef = React.useRef(null);

      const reload = React.useCallback(() => {
        if (themeDisposerRef.current) { try { themeDisposerRef.current(); } catch { /* ignore */ } }
        themeDisposerRef.current = applyAppearance(window.__dshClientTheme || null);
      }, []);

      React.useEffect(() => {
        reload();
        return () => { if (themeDisposerRef.current) { try { themeDisposerRef.current(); } catch { /* ignore */ } } };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      React.useEffect(() => {
        apiGet("/fonts").then(d => setFonts(d.fonts || [])).catch(() => setFonts([]));
        apiGet("/backgrounds").then(d => setBackgrounds(d.backgrounds || [])).catch(() => setBackgrounds([]));
      }, []);

      const setBrandV = (v) => { lsSet("deepharness.brand", v ? "on" : "off"); setBrand(v); reload(); };
      const setFontV = (v) => { lsSet("deepharness.font", v); setFont(v); reload(); };
      const setBgV = (next) => { lsSet("deepharness.background", JSON.stringify(next)); setBg(next); reload(); };

      const applyFontFile = async (name) => {
        try {
          const d = await apiGet("/font?name=" + encodeURIComponent(name));
          const mime = d.mime || "font/ttf";
          const family = "DH-" + name.replace(/[^a-zA-Z0-9_-]/g, "");
          const face = new FontFace(family, "url(data:" + mime + ";base64," + d.dataBase64 + ")");
          await face.load();
          document.fonts.add(face);
          lsSet("deepharness.font", family);
          setFont(family);
          setMsg("已应用字体 " + name);
          reload();
        } catch (err) {
          setMsg("字体应用失败: " + String(err.message || err));
        }
      };

      const uploadFont = async (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const dataBase64 = String(reader.result).split(",")[1] || "";
            await apiPost("/font/upload", { name: file.name, dataBase64 });
            const d = await apiGet("/fonts");
            setFonts(d.fonts || []);
            setMsg("已上传 " + file.name + " 到 %USERPROFILE%\\.dsh\\fonts,可在下方应用");
          } catch (err) {
            setMsg("上传失败: " + String(err.message || err));
          }
        };
        reader.readAsDataURL(file);
      };

      const pickBackgroundFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setCropImage(String(reader.result));
        reader.readAsDataURL(file);
      };

      const confirmCrop = async (dataUrl) => {
        setCropImage(null);
        const name = "background-" + Date.now() + ".jpg";
        try {
          const dataBase64 = dataUrl.split(",")[1] || "";
          await apiPost("/background/upload", { name, dataBase64 });
          const d = await apiGet("/backgrounds");
          setBackgrounds(d.backgrounds || []);
          setBgV({ kind: "image", name });
          setMsg("✓ 背景图已裁剪并应用");
        } catch (err) {
          setMsg("背景图上传失败: " + String(err.message || err));
        }
      };

      const tier = pricingTier("deepseek-v4-flash");
      const bgKind = bg && bg.kind ? bg.kind : "none";
      const bgImageName = bgKind === "image" ? bg.name : "";

      return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, maxWidth: 760 } },

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "品牌与字体"),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "品牌顶栏色"),
            React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" } },
              React.createElement("input", { type: "checkbox", checked: brand, onChange: (e) => setBrandV(e.target.checked) }),
              "固定 DEEPHARNESS 品牌深蓝(" + BRAND_COLOR + "),不随主题变化")
          ),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "界面字体"),
            React.createElement("select", { style: STYLES.select, value: font, onChange: (e) => setFontV(e.target.value) },
              FONT_CHOICES.map(c => React.createElement("option", { key: c.id, value: c.id }, c.label))
            )
          )
        ),

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "背景(渐变 / 图片)"),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "渐变背景"),
            React.createElement("select", {
              style: STYLES.select,
              value: bgKind === "gradient" ? bg.id : "none",
              onChange: (e) => {
                const v = e.target.value;
                setBgV(v === "none" ? { kind: "none" } : { kind: "gradient", id: v });
              }
            },
              React.createElement("option", { value: "none" }, "无(跟随主题)"),
              GRADIENT_CHOICES.map(c => React.createElement("option", { key: c.id, value: c.id }, c.label))
            ),
            React.createElement("span", { style: STYLES.hint }, "有背景时,顶栏/侧栏自动半透明毛玻璃")
          ),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "背景图片"),
            React.createElement("label", { style: { ...STYLES.button, display: "inline-block" } },
              "上传并裁剪(16:9)…",
              React.createElement("input", {
                type: "file", accept: ".jpg,.jpeg,.png,.webp,.gif", style: { display: "none" },
                onChange: (e) => pickBackgroundFile(e.target.files && e.target.files[0])
              })
            ),
            React.createElement("button", {
              style: bgKind === "none" ? STYLES.button : STYLES.buttonPrimary,
              onClick: () => setBgV({ kind: "none" })
            }, "无背景"),
            bgKind === "image" && React.createElement("span", { style: STYLES.hint }, "当前: " + bgImageName)
          ),
          backgrounds.length > 0 && React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
            backgrounds.map(b => React.createElement("button", {
              key: b.name,
              style: bgKind === "image" && bgImageName === b.name ? STYLES.buttonPrimary : STYLES.button,
              title: (b.bytes / 1024).toFixed(1) + " KB",
              onClick: () => setBgV({ kind: "image", name: b.name })
            }, b.name))
          )
        ),

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "导入字体"),
          React.createElement("div", { style: STYLES.row },
            React.createElement("label", { style: { ...STYLES.button, display: "inline-block" } },
              "上传 .ttf/.woff2…",
              React.createElement("input", {
                type: "file", accept: ".ttf,.otf,.woff,.woff2", style: { display: "none" },
                onChange: (e) => uploadFont(e.target.files && e.target.files[0])
              })
            ),
            fonts.length === 0 && React.createElement("span", { style: STYLES.hint }, "将字体放入仓库 fonts\\ 目录或上传,刷新后出现在这里")
          ),
          fonts.length > 0 && React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
            fonts.map(f => React.createElement("button", {
              key: f.name, style: STYLES.button,
              title: (f.bytes / 1024).toFixed(1) + " KB",
              onClick: () => applyFontFile(f.name)
            }, f.name))
          )
        ),

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "费用估算说明"),
          React.createElement("div", { style: STYLES.hint },
            "当前时段 = " + tier.label + "。高峰(北京时间 9:00-12:00、14:00-18:00)为基准价,空闲时段半价;2026-08-17 前按旧价。参考 DeepSeek 官方定价页。"
          )
        ),

        msg && React.createElement("div", { style: STYLES.hint }, msg),

        cropImage && React.createElement(CropOverlay, {
          imageDataUrl: cropImage,
          onCancel: () => setCropImage(null),
          onConfirm: confirmCrop
        })
      );
    }

    // ── 插件主体 ────────────────────────────────────────────────────
    const inject = ["slots", "theme"];

    function apply(ctx) {
      const slots = ctx.slots;
      const theme = ctx.theme;

      // 供设置组件重取(theme 服务实例)
      try { window.__dshClientTheme = theme; } catch { /* ignore */ }

      // 会话视图栏:「文件」标签
      ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "files",
        order: 20,
        label: () => "文件",
        inject: (sessionId) => ({ sessionId })
      }, FilesView));

      // 会话视图栏:「终端」标签
      ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "terminal",
        order: 30,
        label: () => "终端",
        inject: (sessionId) => ({ sessionId })
      }, TerminalView));

      // 设置 → 通用:DEEPHARNESS 外观
      ctx.slots.inject("settings.general.item", () => slots.register({
        name: "settings.general.item",
        id: "deepharness",
        order: 30
      }, AppearanceSettings));

      // 启动即应用已保存的外观(品牌色/字体/背景),重启后自动恢复
      ctx.effect(() => {
        const dispose = applyAppearance(theme);
        return () => { if (dispose) { try { dispose(); } catch { /* ignore */ } } };
      }, "deep-harness-appearance: appearance");
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
