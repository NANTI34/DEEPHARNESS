// DEEPHARNESS 常驻增强插件 — client half(浏览器模块包)
// 由 dsh-client-modules 扫描 dsh.client 声明后以 /plugins/deep-harness-appearance/client.js 提供,
// 页面内核通过 window.__ModuleLoader__.load 注册为 cordis 客户端插件。
// 能力:
//  1. 会话视图栏新增「文件」「终端」标签(conversation.view 槽位)
//  2. 文件视图:工作区文件树 + 预览/编辑/保存/新建(经 /deepharness/api/*)
//  3. 终端面板:工作区根目录命令执行(经 /deepharness/api/exec)
//  4. 费用估算:基于 tokenUsage 投影,按 DeepSeek 官方峰谷定价估算本会话费用
//  5. 外观:品牌顶栏色 / 字体切换 / 渐变背景 / 字体导入(设置 → 通用 → DEEPHARNESS 外观)
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
    // 价格:元 / 百万 tokens(官方 https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)
    // 高峰时段(北京时间):9:00-12:00、14:00-18:00;空闲时段 = 高峰 × 0.5
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

    const STYLES = {
      cost: {
        display: "block", textAlign: "center", fontSize: "12px", lineHeight: "20px",
        color: "var(--dsw-alias-label-tertiary)", padding: "2px 16px 6px",
        fontFamily: "inherit", whiteSpace: "nowrap", overflow: "hidden",
        textOverflow: "ellipsis"
      },
      panel: {
        display: "flex", flexDirection: "column", height: "100%", minHeight: 0,
        boxSizing: "border-box", padding: "12px 16px", gap: "10px",
        fontFamily: "var(--dsh-font-family, inherit)"
      },
      treeRow: {
        display: "flex", alignItems: "center", gap: "6px", padding: "2px 4px",
        borderRadius: "6px", cursor: "pointer", fontSize: "13px", lineHeight: "22px",
        whiteSpace: "nowrap", userSelect: "none"
      },
      editor: {
        flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box",
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        padding: "10px 12px", fontSize: "13px", lineHeight: "1.55",
        fontFamily: "Consolas, 'Cascadia Code', monospace", resize: "none", outline: "none"
      },
      terminal: {
        flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box",
        background: "#0B1120", color: "#D1D5DB",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        padding: "10px 12px", fontSize: "12.5px", lineHeight: "1.5",
        fontFamily: "Consolas, 'Cascadia Code', monospace", overflowY: "auto",
        whiteSpace: "pre-wrap", wordBreak: "break-all"
      },
      cmdInput: {
        display: "flex", gap: "8px", alignItems: "center"
      },
      input: {
        flex: 1, minWidth: 0, boxSizing: "border-box",
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        padding: "8px 12px", fontSize: "13px", fontFamily: "inherit", outline: "none"
      },
      button: {
        padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--dsw-alias-border-l2)",
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        fontSize: "13px", cursor: "pointer"
      },
      buttonPrimary: {
        padding: "6px 14px", borderRadius: "8px", border: "none",
        background: "#4D6BFE", color: "#fff", fontSize: "13px", cursor: "pointer"
      },
      split: { display: "flex", flex: 1, minHeight: 0, gap: "10px" },
      treeCol: { width: "42%", minWidth: 220, maxWidth: 420, overflowY: "auto", border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px", padding: "6px" },
      editorCol: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" },
      hint: { fontSize: "12px", color: "var(--dsw-alias-label-tertiary)" },
      row: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
      select: {
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        padding: "6px 10px", fontSize: "13px"
      },
      label: { fontSize: "13px", color: "var(--dsw-alias-label-secondary)", minWidth: 72 }
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
    function FileTree({ expanded, onToggle, onSelect, selected, root }) {
      const [dirs, setDirs] = React.useState({});
      const load = React.useCallback(async (rel) => {
        try {
          const d = await apiGet("/tree?path=" + encodeURIComponent(rel) + "&depth=1");
          setDirs(prev => ({ ...prev, [rel]: d.tree.children || [] }));
        } catch { setDirs(prev => ({ ...prev, [rel]: [] })); }
      }, []);
      React.useEffect(() => { load(root || "."); }, [root, load]);

      const renderChildren = (rel) => {
        const children = rel === (root || ".") ? (dirs[root || "."] || []) : (dirs[rel] || []);
        return children.map(child => {
          const isDir = child.type === "dir";
          const isOpen = expanded.has(child.rel);
          return React.createElement(React.Fragment, { key: child.rel },
            React.createElement("div", {
              style: { ...STYLES.treeRow, paddingLeft: "12px" },
              onClick: () => {
                if (isDir) {
                  onToggle(child.rel);
                  if (!isOpen && !dirs[child.rel]) load(child.rel);
                } else {
                  onSelect(child.rel);
                }
              }
            },
              React.createElement("span", { style: { width: 16, textAlign: "center", color: "var(--dsw-alias-label-tertiary)" } },
                isDir ? (isOpen ? "▾" : "▸") : "·"),
              React.createElement("span", { style: isDir ? { fontWeight: 600, color: "var(--dsw-alias-label-primary)" } : (selected === child.rel ? { color: "#4D6BFE" } : { color: "var(--dsw-alias-label-secondary)" }) },
                child.name),
              child.size !== undefined && React.createElement("span", { style: { marginLeft: "auto", fontSize: 11, color: "var(--dsw-alias-label-tertiary)" } },
                child.size > 1024 ? (child.size / 1024).toFixed(1) + "KB" : child.size + "B")
            ),
            isDir && isOpen && React.createElement("div", { style: { marginLeft: 12, borderLeft: "1px solid var(--dsw-alias-border-l2)" } },
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
      const [dirty, setDirty] = React.useState(false);
      const [msg, setMsg] = React.useState("");
      const [editing, setEditing] = React.useState("");

      const openFile = async (rel) => {
        try {
          const d = await apiGet("/file?path=" + encodeURIComponent(rel));
          setSelected(rel);
          setContent(d);
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
          setMsg("已保存 " + content.rel);
        } catch (err) {
          setMsg("保存失败: " + String(err.message || err));
        }
      };
      const newFile = async () => {
        const name = window.prompt("新建文件(相对工作区根目录,可含子目录):", "notes/新文件.md");
        if (!name) return;
        try {
          await apiPost("/write", { path: name, content: "" });
          setMsg("已创建 " + name);
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
              React.createElement("span", { style: STYLES.hint }, selected ? selected : "选择左侧文件开始编辑"),
              React.createElement("button", { style: STYLES.button, onClick: newFile }, "新建文件"),
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
      const [lines, setLines] = React.useState([{ type: "sys", text: "DEEPHARNESS 终端 — 工作区根目录命令执行器" }]);
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
            placeholder: root ? ("在 " + root + " 下运行命令(Enter 执行)") : "输入命令…",
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
          React.createElement("button", { style: STYLES.buttonPrimary, disabled: busy, onClick: () => run(value) }, busy ? "运行中" : "运行")
        )
      );
    }

    // ── 外观设置(设置 → 通用 → DEEPHARNESS 外观)───────────────────
    const FONT_CHOICES = [
      { id: "default", label: "默认字体" },
      { id: "Microsoft YaHei", label: "微软雅黑" },
      { id: "SimSun", label: "宋体" },
      { id: "KaiTi", label: "楷体" },
      { id: "Consolas", label: "等宽字体" }
    ];
    const GRADIENT_CHOICES = [
      { id: "none", label: "无(跟随主题)" },
      { id: "nightblue", label: "暗夜蓝", css: "linear-gradient(160deg, #0F172A 0%, #16204A 55%, #1E3A8A 100%)" },
      { id: "aurora", label: "极光紫", css: "linear-gradient(160deg, #0F172A 0%, #312E81 50%, #6D28D9 100%)" },
      { id: "forest", label: "深林", css: "linear-gradient(160deg, #0A0F0D 0%, #064E3B 55%, #065F46 100%)" },
      { id: "solidblue", label: "纯色深蓝", css: "#16204A" }
    ];
    const BRAND_COLOR = "#16204A";

    // 应用外观(读取 localStorage,重进页面/重启服务后自动恢复)
    function applyAppearance(theme) {
      const brand = lsGet("deepharness.brand", "on") !== "off";
      const font = lsGet("deepharness.font", "default");
      const gradient = lsGet("deepharness.gradient", "none");

      // 品牌色:主题令牌覆盖(侧栏 + 标题行)+ 兜底 CSS
      const css = [];
      if (brand) {
        css.push(":root { --dsw-specific-sidebar-fill: " + BRAND_COLOR + "; }");
        css.push("html, body { background-color: " + BRAND_COLOR + "; }");
      }
      if (gradient !== "none") {
        const g = GRADIENT_CHOICES.find(c => c.id === gradient);
        if (g) css.push("html, body { background: " + g.css + " fixed; }");
      }
      injectCSS("deep-harness-appearance-css", css.join("\n"));

      if (font !== "default") {
        injectCSS("deep-harness-appearance-font",
          "body, button, input, textarea, select { font-family: \"" + font + "\", 'Microsoft YaHei', system-ui, sans-serif; }");
      } else {
        injectCSS("deep-harness-appearance-font", "");
      }

      if (theme && brand) {
        try {
          return theme.overrideTokens("deep-harness-appearance", {
            "--dsw-specific-sidebar-fill": { light: BRAND_COLOR, dark: BRAND_COLOR }
          });
        } catch { /* ignore */ }
      }
      return null;
    }

    function AppearanceSettings() {
      const [brand, setBrand] = React.useState(lsGet("deepharness.brand", "on") !== "off");
      const [font, setFont] = React.useState(lsGet("deepharness.font", "default"));
      const [gradient, setGradient] = React.useState(lsGet("deepharness.gradient", "none"));
      const [fonts, setFonts] = React.useState([]);
      const [msg, setMsg] = React.useState("");
      const [themeDisposer, setThemeDisposer] = React.useState(null);

      React.useEffect(() => {
        let dispose = null;
        try {
          const theme = window.__dshClientTheme;
          dispose = applyAppearance(theme || null);
        } catch { /* ignore */ }
        setThemeDisposer(dispose);
        return () => { if (dispose) { try { dispose(); } catch { /* ignore */ } } };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      React.useEffect(() => {
        apiGet("/fonts").then(d => setFonts(d.fonts || [])).catch(() => setFonts([]));
      }, []);

      const reloadTheme = () => {
        // 通过全局钩子获取 theme 服务(apply 阶段已缓存)
        try {
          if (themeDisposer) { try { themeDisposer(); } catch { /* ignore */ } }
        } catch { /* ignore */ }
        const dispose = applyAppearance(window.__dshClientTheme || null);
        setThemeDisposer(dispose);
      };

      const setBrandV = (v) => { lsSet("deepharness.brand", v ? "on" : "off"); setBrand(v); reloadTheme(); };
      const setFontV = (v) => { lsSet("deepharness.font", v); setFont(v); reloadTheme(); };
      const setGradientV = (v) => { lsSet("deepharness.gradient", v); setGradient(v); reloadTheme(); };

      const applyFontFile = async (name) => {
        try {
          const d = await apiGet("/font?name=" + encodeURIComponent(name));
          const mime = d.mime || "font/ttf";
          const family = "DH-" + name.replace(/[^a-zA-Z0-9_-]/g, "");
          const face = new FontFace(family, "url(data:" + mime + ";base64," + d.dataBase64 + ")");
          await face.load();
          document.fonts.add(face);
          lsSet("deepharness.font", family);
          lsSet("deepharness.customFonts", JSON.stringify([...JSON.parse(lsGet("deepharness.customFonts", "[]") || "[]"), family].filter((v, i, a) => a.indexOf(v) === i)));
          setFont(family);
          setMsg("已应用字体 " + name);
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

      const tier = pricingTier("deepseek-v4-flash");

      return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14, padding: "16px 0" } },
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
        ),
        React.createElement("div", { style: STYLES.row },
          React.createElement("span", { style: STYLES.label }, "渐变背景"),
          React.createElement("select", { style: STYLES.select, value: gradient, onChange: (e) => setGradientV(e.target.value) },
            GRADIENT_CHOICES.map(c => React.createElement("option", { key: c.id, value: c.id }, c.label))
          )
        ),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
          React.createElement("span", { style: STYLES.label }, "导入字体"),
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
        React.createElement("div", { style: STYLES.hint },
          "费用估算定价:当前时段 = " + tier.label + "。高峰(北京时间 9:00-12:00、14:00-18:00)为基准价,空闲时段半价;2026-08-17 前按旧价。参考官方定价页。"
        ),
        msg && React.createElement("div", { style: STYLES.hint }, msg)
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

      // 启动即应用已保存的外观(品牌色/字体/渐变),重启后自动恢复
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
