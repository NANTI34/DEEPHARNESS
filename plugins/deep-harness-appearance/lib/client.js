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
        padding: "8px 10px", fontSize: "12.5px", lineHeight: "1.5",
        fontFamily: "Consolas, 'Cascadia Code', monospace", resize: "none", outline: "none",
        whiteSpace: "pre", overflow: "auto", tabSize: 2, border: "none", margin: 0,
        // 固定暗底亮字:不依赖主题变量(浅色主题下 label-primary 解析为透明,
        // 会导致输入文字看不见),保证任何主题都可读
        background: "#0F172A", color: "#E2E8F0", caretColor: "#CBD5E1"
      },
      editorWrap: {
        flex: 1, minHeight: 0, position: "relative",
        display: "flex", flexDirection: "column",
        background: "var(--dsw-alias-bg-layer-1)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        overflow: "hidden"
      },
      editorToolbar: {
        display: "flex", alignItems: "center", gap: 6,
        padding: "5px 8px", borderBottom: "1px solid var(--dsw-alias-border-l2)",
        background: "var(--dsw-alias-bg-layer-2)", flex: "none"
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

    // ── 语法高亮(按文件类型,轻量正则着色)──────────────────────────
    const HL_LIMIT = 65536; // 超过 64KB 不做高亮,保证流畅
    const HL_LANG = {
      js: { keywords: "const let var function return if else for while do break continue new class extends super this async await import export from default try catch finally throw switch case typeof instanceof in of null undefined true false void delete yield", line: "//", block: ["/*", "*/"] },
      ts: { keywords: "const let var function return if else for while do break continue new class extends super this async await import export from default try catch finally throw switch case typeof instanceof in of null undefined true false void interface type enum namespace declare readonly public private protected implements abstract as keyof infer satisfies", line: "//", block: ["/*", "*/"] },
      py: { keywords: "def class if elif else for while import from return yield lambda with as try except finally raise pass break continue global nonlocal del assert is in not and or None True False async await self", line: "#" },
      json: { keywords: "true false null" },
      ps1: { keywords: "function param if else elseif foreach for while switch return throw try catch finally begin process end filter workflow in not and or eq ne gt lt ge le $true $false $null New-Item Set-Content Get-Content Write-Output Write-Host Remove-Item Test-Path Join-Path Split-Path Start-Process Get-Command Push-Location Pop-Location Set-Location Get-ChildItem Select-Object ForEach-Object Where-Object Sort-Object ConvertTo-Json ConvertFrom-Json Invoke-WebRequest Import-Module Add-Type New-Object Exit Break Continue $env $error $args $input $host $PID $PSVersionTable", line: "#" },
      java: { keywords: "public private protected class interface extends implements static final void int long double float boolean char byte short new return if else for while do switch case break continue try catch finally throw throws import package this super abstract synchronized volatile enum record var true false null instanceof", line: "//", block: ["/*", "*/"] },
      c: { keywords: "int char float double void long short unsigned signed struct union enum typedef static extern const volatile register return if else for while do switch case break continue goto sizeof true false NULL", line: "//", block: ["/*", "*/"] },
      cpp: { keywords: "class namespace template typename public private protected virtual override constexpr auto new delete this nullptr using friend operator inline extern const int char float double void long short unsigned signed struct union enum typedef static return if else for while do switch case break continue true false NULL", line: "//", block: ["/*", "*/"] },
      go: { keywords: "package import func var const type struct interface map chan go defer return if else for range switch case break continue fallthrough select goto true false nil iota", line: "//", block: ["/*", "*/"] },
      rs: { keywords: "fn let mut const struct enum impl trait mod use pub crate self Self match if else for while loop return break continue move ref async await dyn static type where true false", line: "//", block: ["/*", "*/"] },
      sql: { keywords: "select from where insert into values update set delete create table drop alter join left right inner outer on group by order having limit offset as and or not null is in like between exists distinct count sum avg min max primary key foreign references default unique index view procedure function begin commit rollback case when then else end", line: "--", block: ["/*", "*/"] },
      yaml: { keywords: "true false null yes no on off", line: "#" },
      sh: { keywords: "if then else elif fi for while do done case esac function return exit export local readonly unset echo printf test true false", line: "#" },
      html: { keywords: "", line: "", block: ["<!--", "-->"] },
      xml: { keywords: "", line: "", block: ["<!--", "-->"] },
      css: { keywords: "", line: "", block: ["/*", "*/"] },
      md: { keywords: "", line: "" }
    };
    function langFor(name) {
      const ext = (name || "").split(".").pop().toLowerCase();
      if (!ext || ext === name) return null;
      if (["js", "jsx", "mjs", "cjs"].includes(ext)) return "js";
      if (["ts", "tsx", "mts"].includes(ext)) return "ts";
      if (ext === "py") return "py";
      if (ext === "json") return "json";
      if (["ps1", "psm1"].includes(ext)) return "ps1";
      if (ext === "java") return "java";
      if (["c", "h"].includes(ext)) return "c";
      if (["cpp", "cc", "hpp", "cxx"].includes(ext)) return "cpp";
      if (ext === "go") return "go";
      if (ext === "rs") return "rs";
      if (ext === "sql") return "sql";
      if (["yml", "yaml"].includes(ext)) return "yaml";
      if (["sh", "bash"].includes(ext)) return "sh";
      if (["html", "htm"].includes(ext)) return "html";
      if (["xml", "svg"].includes(ext)) return "xml";
      if (ext === "css") return "css";
      if (["md", "markdown"].includes(ext)) return "md";
      return null;
    }
    const HL_COLOR = {
      kw: "#7C9BFF", str: "#86EFAC", com: "#64748B", num: "#FBBF24", tag: "#F472B6", attr: "#FBBF24", head: "#4D6BFE", code: "#F472B6", bold: "#7C9BFF"
    };
    function escHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function highlightCode(text, langName) {
      const lang = HL_LANG[langName];
      if (!lang) return escHtml(text);
      const kwSet = lang.keywords ? new Set(lang.keywords.split(" ")) : null;
      const lineC = lang.line;
      const blockC = lang.block;
      const parts = [];
      const push = (t, cls) => parts.push(cls ? '<span style="color:' + cls + '">' + escHtml(t) + "</span>" : escHtml(t));
      let i = 0;
      const n = text.length;
      // markdown 特殊处理
      if (langName === "md") {
        const lines = text.split("\n");
        return lines.map((ln, idx) => {
          let out = "";
          const head = /^(#{1,6})\s+/.exec(ln);
          if (head) {
            out += '<span style="color:' + HL_COLOR.head + ';font-weight:700">' + escHtml(head[0]) + "</span>";
            out += '<span style="color:' + HL_COLOR.head + '">' + escHtml(ln.slice(head[0].length)) + "</span>";
          } else {
            let rest = ln;
            const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
            let m, last = 0;
            while ((m = re.exec(rest))) {
              out += escHtml(rest.slice(last, m.index));
              const tok = m[0];
              if (tok.startsWith("`")) out += '<span style="color:' + HL_COLOR.code + '">' + escHtml(tok) + "</span>";
              else if (tok.startsWith("**")) out += '<span style="color:' + HL_COLOR.bold + ';font-weight:700">' + escHtml(tok) + "</span>";
              else if (tok.startsWith("[")) out += '<span style="color:' + HL_COLOR.str + '">' + escHtml(tok) + "</span>";
              else out += '<span style="color:' + HL_COLOR.kw + '">' + escHtml(tok) + "</span>";
              last = m.index + tok.length;
            }
            out += escHtml(rest.slice(last));
          }
          return out + (idx < lines.length - 1 ? "\n" : "");
        }).join("");
      }
      const escKw = kwSet ? [...kwSet].map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") : "";
      const escLineC = lineC ? lineC.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
      const escBlockS = blockC ? blockC[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
      const escBlockE = blockC ? blockC[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
      const pieces = [];
      pieces.push(escLineC ? "(?:" + escLineC + "[^\\n]*)" : "");
      pieces.push(escBlockS ? "(?:" + escBlockS + "[\\s\\S]*?" + escBlockE + ")" : "");
      pieces.push('"(?:[^"\\\\\\n]|\\\\.)*"');
      pieces.push("'(?:[^'\\\\\\n]|\\\\.)*'");
      pieces.push("`(?:[^`\\\\\\n]|\\\\.)*`");
      pieces.push("\\b\\d+(?:\\.\\d+)?\\b");
      if (kwSet) pieces.push("\\b(?:" + escKw + ")\\b");
      if (langName === "html" || langName === "xml") pieces.push("<\\/?[a-zA-Z][^>]*>");
      const re = new RegExp(pieces.filter(Boolean).join("|"), "g");
      let m;
      while ((m = re.exec(text))) {
        const tok = m[0];
        if (i < m.index) push(text.slice(i, m.index), null);
        i = m.index + tok.length;
        if (lineC && tok.startsWith(lineC)) push(tok, HL_COLOR.com);
        else if (blockC && tok.startsWith(blockC[0])) push(tok, HL_COLOR.com);
        else if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith("`")) push(tok, HL_COLOR.str);
        else if (/^\d/.test(tok)) push(tok, HL_COLOR.num);
        else if (kwSet && kwSet.has(tok)) push(tok, HL_COLOR.kw);
        else if (langName === "html" || langName === "xml") {
          const am = /^<\/?([a-zA-Z][\w-]*)([^>]*)\/?>$/.exec(tok);
          if (am) {
            const inner = am[2].replace(/([a-zA-Z-]+)(=)("(?:[^"]*)"|'(?:[^']*)')?/g, (all, name, eq, val) =>
              '<span style="color:' + HL_COLOR.attr + '">' + escHtml(name) + "</span>" + eq +
              (val ? '<span style="color:' + HL_COLOR.str + '">' + escHtml(val) + "</span>" : ""));
            parts.push("<" + (tok[1] === "/" ? "/" : "") + '<span style="color:' + HL_COLOR.tag + '">' + escHtml(am[1]) + "</span>" + inner + ">");
          } else push(tok, HL_COLOR.tag);
        } else push(tok, null);
      }
      if (i < n) push(text.slice(i), null);
      return parts.join("");
    }

    // 文件编辑器:双模式。
    // 编辑模式 = 普通 textarea(可靠、零错位、输入即时可见);
    // 高亮预览 = 只读着色渲染(按文件类型)。默认进入编辑模式。
    function CodeEditor({ value, onChange, language, placeholder }) {
      const [mode, setMode] = React.useState("edit");
      const html = React.useMemo(() => {
        if (value.length > HL_LIMIT) return escHtml(value);
        return highlightCode(value, language) || "";
      }, [value, language]);
      const langLabel = language || "纯文本";
      return React.createElement("div", { style: STYLES.editorWrap },
        React.createElement("div", { style: STYLES.editorToolbar },
          React.createElement("button", {
            style: mode === "edit" ? STYLES.buttonPrimary : STYLES.button,
            onClick: () => setMode("edit")
          }, "编辑"),
          React.createElement("button", {
            style: mode === "preview" ? STYLES.buttonPrimary : STYLES.button,
            onClick: () => setMode("preview")
          }, "高亮预览"),
          React.createElement("span", { style: { ...STYLES.hint, marginLeft: 8 } },
            langLabel + (mode === "preview" && value.length > HL_LIMIT ? "(文件过大,未着色)" : ""))
        ),
        mode === "edit"
          ? React.createElement("textarea", {
            value: value,
            spellCheck: false,
            placeholder: placeholder,
            wrap: "off",
            style: STYLES.editor,
            onChange: (e) => onChange(e.target.value)
          })
          : React.createElement("pre", {
            style: { ...STYLES.editor, whiteSpace: "pre", color: "#D1D5DB" },
            dangerouslySetInnerHTML: { __html: html + "\n" }
          })
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
        const target = content.path || content.rel;
        if (!target) { setMsg("保存失败: 缺少文件路径"); return; }
        try {
          await apiPost("/write", { path: target, content: editing });
          setDirty(false);
          setMsg("✓ 已保存 " + target);
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
              ? React.createElement("div", { style: { ...STYLES.editorWrap, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13 } },
                "← 从左侧文件树选择文件")
              : content.binary
                ? React.createElement("div", { style: { ...STYLES.editorWrap, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13 } },
                  "二进制文件(" + (content.size / 1024).toFixed(1) + " KB),不支持文本编辑")
                : React.createElement(CodeEditor, {
                  value: editing,
                  language: langFor(content.path || content.rel),
                  placeholder: content.truncated ? "文件过大已截断(仅显示前 2MB)" : "",
                  onChange: (v) => { setEditing(v); setDirty(true); }
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
      const [root, setRoot] = React.useState("");
      // 会话内工作目录(相对工作区根),支持 cd 并持久到本次会话
      const [cwd, setCwd] = React.useState(".");

      // 输出行数上限:防止大输出把页面拖卡
      const MAX_TERM_LINES = 600;
      const append = (line) => setLines(prev =>
        prev.length >= MAX_TERM_LINES ? [...prev.slice(1), line] : [...prev, line]);

      React.useEffect(() => {
        apiGet("/status").then(d => setRoot(d.root || "")).catch(() => setRoot(""));
      }, []);
      React.useEffect(() => {
        const el = outputRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, [lines]);

      const fullPath = (rel) => {
        const relStr = rel === "." ? "" : rel.split("/").join("\\");
        return root ? (root + (relStr ? "\\" + relStr : "")) : (relStr || ".");
      };

      // 解析相对路径(支持 . .. 与绝对路径),返回相对工作区根的路径
      const resolveRel = (target) => {
        const t = String(target || "").trim();
        if (!t) return ".";
        let rel;
        if (/^[a-zA-Z]:[\\/]/.test(t)) {
          rel = t.replace(/\\/g, "/");
        } else {
          const base = cwd === "." ? "" : cwd;
          rel = (base ? base + "/" : "") + t.replace(/\\/g, "/");
        }
        const parts = rel.split("/");
        const out = [];
        for (const p of parts) {
          if (p === "" || p === ".") continue;
          if (p === "..") { out.pop(); continue; }
          out.push(p);
        }
        return out.join("/") || ".";
      };

      const doCd = async (command) => {
        let arg = command.replace(/^cd\s*/i, "").trim();
        if (arg.length >= 2 && ((arg[0] === '"' && arg[arg.length - 1] === '"') || (arg[0] === "'" && arg[arg.length - 1] === "'"))) {
          arg = arg.slice(1, -1);
        }
        const rel = resolveRel(arg);
        try {
          const d = await apiGet("/tree?path=" + encodeURIComponent(rel) + "&depth=0");
          if (d.tree && d.tree.type === "dir") {
            setCwd(rel);
            append({ type: "cmd", text: "❯ " + command });
            append({ type: "sys", text: "当前目录: " + fullPath(rel) });
          } else {
            append({ type: "cmd", text: "❯ " + command });
            append({ type: "err", text: "cd: 不是目录或不存在: " + (arg || ".") });
          }
        } catch (err) {
          append({ type: "cmd", text: "❯ " + command });
          append({ type: "err", text: "cd 失败: " + String(err.message || err) });
        }
      };

      const run = async (cmd) => {
        const command = cmd.trim();
        if (!command || busy) return;
        setValue("");
        setHistory(prev => [command, ...prev].slice(0, 50));
        setHistoryIdx(-1);
        if (/^cd(\s|$)/i.test(command)) {
          setBusy(true);
          try {
            await doCd(command);
          } finally {
            setBusy(false);
          }
          return;
        }
        append({ type: "cmd", text: "❯ " + command });
        setBusy(true);
        try {
          const d = await apiPost("/exec", { command, cwd, timeoutMs: 60000 });
          if (d.stdout) append({ type: "out", text: d.stdout.replace(/\n$/, "") });
          if (d.stderr) append({ type: "err", text: d.stderr.replace(/\n$/, "") });
          append({ type: "sys", text: d.timedOut ? "[已超时]" : ("[exit code: " + d.exitCode + "]") });
        } catch (err) {
          append({ type: "err", text: String(err.message || err) });
        } finally {
          setBusy(false);
        }
      };

      return React.createElement("div", { style: STYLES.panel },
        React.createElement(CostLine, { useProjection }),
        React.createElement("div", {
          style: {
            flex: "none", padding: "4px 10px", borderRadius: 7, fontSize: 12,
            color: "var(--dsw-alias-label-tertiary)",
            background: "rgba(77,107,254,0.08)", border: "1px solid rgba(77,107,254,0.2)",
            fontFamily: "Consolas, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }
        }, "📁 当前目录: " + (root ? fullPath(cwd) : (cwd === "." ? "…" : cwd))),
        React.createElement("div", { ref: outputRef, style: STYLES.terminal },
          lines.map((line, i) => {
            const color = line.type === "err" ? "#F87171" : line.type === "cmd" ? "#93C5FD" : line.type === "sys" ? "#6B7280" : "#D1D5DB";
            return React.createElement("div", { key: i, style: { color } }, line.text);
          }),
          busy && React.createElement("div", { style: { color: "#6B7280" } }, "… 运行中")
        ),
        React.createElement("div", { style: STYLES.cmdInput },
          React.createElement("span", { style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 13, whiteSpace: "nowrap" } },
            cwd === "." ? "❯" : (cwd.split("/").pop() + ">")),
          React.createElement("input", {
            style: STYLES.input,
            value: value,
            placeholder: root ? (fullPath(cwd) + " 下运行(Enter 执行,↑↓ 历史)") : "输入命令…",
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

    // ── 一键换肤(预设皮肤)──────────────────────────────────────────────
    // 皮肤通过覆盖 DSH 主题令牌 + 少量结构样式实现,与品牌色/金边/背景系统独立;
    // 开启皮肤时以皮肤为准,关闭即回默认。css 为空表示无皮肤。
    const SKINS = [
      { id: "none", label: "默认(无皮肤)", css: "" },
      { id: "classic-xp", label: "经典蓝调",
        css: ':root{--dsw-alias-state-business-primary:#3B6FE0 !important;--dsw-alias-label-primary:#1F2D4D !important;--dsw-alias-label-secondary:#4A5A7A !important;--dsw-alias-label-tertiary:#7A86A0 !important;--dsw-alias-bg-layer-1:#F2F5FA !important;--dsw-alias-bg-layer-2:#E8EDF5 !important;--dsw-alias-bg-layer-3:#DEE5F0 !important;--dsw-alias-border-l2:#B9C6DC !important;--dsw-alias-state-success-primary:#1F8F3D !important;--dsw-alias-state-error-primary:#C03A2B !important;}\n' +
          '[class*="sidebarCol"]{background:linear-gradient(180deg,#2F63D8 0%,#2456C0 60%,#1D4AA8 100%) !important;}\n' +
          '[class*="sidebarCol"] [class*="_brand"]{background:rgba(255,255,255,0.12) !important;border-bottom:1px solid rgba(255,255,255,0.25) !important;}\n' +
          '[class*="centerCol"], [class*="detailsCol"]{background:#F7F9FC !important;}\n' +
          '[class*="panel"], [class*="card"], [class*="nodeItem"]{border-radius:6px !important;}\n' +
          '::selection{background:#3B6FE0 !important;color:#fff !important;}' },
      { id: "mint-black", label: "薄荷绿黑",
        css: ':root{--dsw-alias-state-business-primary:#00C2B8 !important;--dsw-alias-label-primary:#E8FFFC !important;--dsw-alias-label-secondary:#9FD8D3 !important;--dsw-alias-label-tertiary:#6FA8A3 !important;--dsw-alias-bg-layer-1:#0E1B1A !important;--dsw-alias-bg-layer-2:#142624 !important;--dsw-alias-bg-layer-3:#1A302D !important;--dsw-alias-border-l2:#1F4B46 !important;--dsw-alias-state-success-primary:#00E5C3 !important;--dsw-alias-state-error-primary:#FF6EC7 !important;}\n' +
          '[class*="sidebarCol"]{background:linear-gradient(180deg,#062B27 0%,#0A3A34 55%,#0E4A42 100%) !important;}\n' +
          '[class*="sidebarCol"] [class*="_brand"]{background:rgba(0,194,184,0.16) !important;border-bottom:1px solid rgba(0,229,195,0.35) !important;}\n' +
          '[class*="centerCol"], [class*="detailsCol"]{background:#0B1615 !important;}\n' +
          '::selection{background:#00C2B8 !important;color:#001a17 !important;}' },
      { id: "sakura", label: "樱花粉",
        css: ':root{--dsw-alias-state-business-primary:#E86FA8 !important;--dsw-alias-label-primary:#4A2B3C !important;--dsw-alias-label-secondary:#7A5268 !important;--dsw-alias-label-tertiary:#A98A98 !important;--dsw-alias-bg-layer-1:#FDF2F7 !important;--dsw-alias-bg-layer-2:#FBEBF2 !important;--dsw-alias-bg-layer-3:#F9E3EC !important;--dsw-alias-border-l2:#F0C9DA !important;--dsw-alias-state-success-primary:#C96FA8 !important;--dsw-alias-state-error-primary:#E5484D !important;}\n' +
          '[class*="sidebarCol"]{background:linear-gradient(180deg,#F7D6E4 0%,#F3C8DA 55%,#EEB9CF 100%) !important;}\n' +
          '[class*="sidebarCol"] [class*="_brand"]{background:rgba(255,255,255,0.55) !important;border-bottom:1px solid rgba(232,111,168,0.4) !important;}\n' +
          '[class*="centerCol"], [class*="detailsCol"]{background:#FFFBFD !important;}\n' +
          '::selection{background:#E86FA8 !important;color:#fff !important;}' },
      { id: "deep-space", label: "深空紫",
        css: ':root{--dsw-alias-state-business-primary:#8B7CF6 !important;--dsw-alias-label-primary:#EDEAFF !important;--dsw-alias-label-secondary:#B9B1E8 !important;--dsw-alias-label-tertiary:#8A83B8 !important;--dsw-alias-bg-layer-1:#14122A !important;--dsw-alias-bg-layer-2:#1B1838 !important;--dsw-alias-bg-layer-3:#221E46 !important;--dsw-alias-border-l2:#3A3466 !important;--dsw-alias-state-success-primary:#7C6CF6 !important;--dsw-alias-state-error-primary:#F87171 !important;}\n' +
          '[class*="sidebarCol"]{background:linear-gradient(180deg,#1A1638 0%,#241D52 55%,#2E2570 100%) !important;}\n' +
          '[class*="sidebarCol"] [class*="_brand"]{background:rgba(139,124,246,0.18) !important;border-bottom:1px solid rgba(139,124,246,0.4) !important;}\n' +
          '[class*="centerCol"], [class*="detailsCol"]{background:#100E22 !important;}\n' +
          '::selection{background:#8B7CF6 !important;color:#fff !important;}' },
      { id: "neon-cyber", label: "赛博霓虹",
        css: ':root{--dsw-alias-state-business-primary:#22D3EE !important;--dsw-alias-label-primary:#EAFEFF !important;--dsw-alias-label-secondary:#9BE9F5 !important;--dsw-alias-label-tertiary:#6BB8C4 !important;--dsw-alias-bg-layer-1:#0B1220 !important;--dsw-alias-bg-layer-2:#101A2E !important;--dsw-alias-bg-layer-3:#16223A !important;--dsw-alias-border-l2:#1F3A55 !important;--dsw-alias-state-success-primary:#22D3EE !important;--dsw-alias-state-error-primary:#E879F9 !important;}\n' +
          '[class*="sidebarCol"]{background:linear-gradient(180deg,#0B1220 0%,#12263F 55%,#1A3257 100%) !important;border-right:1px solid rgba(34,211,238,0.35) !important;}\n' +
          '[class*="sidebarCol"] [class*="_brand"]{background:linear-gradient(90deg,rgba(34,211,238,0.22),rgba(232,121,249,0.22)) !important;border-bottom:1px solid rgba(34,211,238,0.45) !important;}\n' +
          '[class*="centerCol"], [class*="detailsCol"]{background:#080D18 !important;}\n' +
          '[class*="panel"]{box-shadow:0 0 24px rgba(34,211,238,0.12) !important;}\n' +
          '::selection{background:#22D3EE !important;color:#031018 !important;}' }
    ];

    // ── 社区皮肤(dsh-web-ui / dsh-deep-whale,经 /deepharness/api/skin 加载 CSS)──
    // bodyAttr = 皮肤 CSS 的激活选择器;community 皮肤 css 为空,由 applySkin 异步拉取。
    const COMMUNITY_SKINS = [
      { id: "qq98", label: "QQ2008 怀旧", bodyAttr: "data-dsh-retro", community: true, css: "" },
      { id: "blue-fantasy", label: "蓝色幻想", bodyAttr: "data-dsh-blue-fantasy", community: true, css: "" },
      { id: "whale-song", label: "鲸吟", bodyAttr: "data-dsh-whale-song", community: true, css: "" },
      { id: "minecraft", label: "MINECRAFT 方块世界", bodyAttr: "data-dsh-minecraft", community: true, css: "" },
      { id: "maid-atelier", label: "深海女仆工坊", bodyAttr: "data-dsh-maid-atelier", community: true, css: "" },
      { id: "xp", label: "Windows XP", bodyAttr: "data-dsh-xp", community: true, css: "" },
      { id: "ths", label: "同花顺", bodyAttr: "data-dsh-ths", community: true, css: "" },
      { id: "trading", label: "交易风格", bodyAttr: "data-dsh-trading", community: true, css: "" },
      { id: "miku", label: "初音未来(社区)", bodyAttr: "data-dsh-miku", community: true, css: "" },
      { id: "dragon-heir", label: "龙裔", bodyAttr: "data-dsh-dragon-heir", community: true, css: "" }
    ];
    // 社区皮肤元信息(名称/作者/许可),设置页加载后填充
    let communitySkinMeta = [];
    try {
      fetch(API + "/skins", { headers: { accept: "application/json" } })
        .then((r) => r.json())
        .then((d) => { communitySkinMeta = (d && d.skins) || []; })
        .catch(() => { /* 插件未就绪时静默 */ });
    } catch { /* ignore */ }
    function communityMeta(id) {
      return communitySkinMeta.find((s) => s.id === id);
    };
    const BRAND_COLOR = "#16204A";
    const DEFAULT_BG_NAME = "默认.jpg";

    // 颜色工具:hex → rgb;向目标色混合生成"同系但不同"的侧边栏色
    function hexToRgb(hex) {
      const h = String(hex || "").replace("#", "");
      if (h.length !== 6) return { r: 22, g: 32, b: 74 };
      const n = parseInt(h, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    function mixToward(hex, targetHex, t) {
      const a = hexToRgb(hex), b = hexToRgb(targetHex);
      const r = Math.round(a.r + (b.r - a.r) * t);
      const g = Math.round(a.g + (b.g - a.g) * t);
      const bl = Math.round(a.b + (b.b - a.b) * t);
      return "rgb(" + r + "," + g + "," + bl + ")";
    }
    function withAlpha(rgb, alpha) {
      return rgb.replace("rgb(", "rgba(").replace(")", "," + alpha + ")");
    }

    // 有背景时:侧栏(含顶栏标题行)/详情栏半透明,中间内容区半透明。
    // 注意:绝不能在这里用 backdrop-filter——它会创建新的包含块,
    // 把设置面板(position:fixed 全屏浮层)困在侧边栏里,导致设置页挤成一团。
    // 侧边栏用"调亮的品牌蓝"半透明,避免深蓝叠暗壁纸后看起来纯黑。
    function glassCss(brandColor) {
      const rgb = hexToRgb(brandColor);
      const rgba = (a) => "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + a + ")";
      const bright = mixToward(brandColor, "#5B7CFA", 0.38);
      return '[class*="sidebarCol"] { background: ' + withAlpha(bright, 0.5) + " !important; }\n" +
        '[class*="detailsCol"] { background: rgba(21,30,58,0.4) !important; }\n' +
        '[class*="centerCol"] { background: rgba(8,12,25,0.28) !important; }\n' +
        '[class*="sidebarCol"] [class*="_brand"] { background: ' + rgba(0.62) + " !important; }";
    }

    // 背景选择:新键优先;迁移旧版遗留(gradient 存于 background 键出现之前);
    // 无任何设置时使用出厂默认背景 默认.jpg
    function resolveBackground() {
      const raw = lsGet("deepharness.background", null);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.kind === "string") {
            // 1.3.0 升级清理:旧版遗留 gradient 键存在时,强制回到出厂默认背景
            // (用户明确以 默认.jpg 为默认背景,旧渐变选择不再沿用)
            if (lsGet("deepharness.gradient", null) !== null) {
              try { localStorage.removeItem("deepharness.gradient"); } catch { /* ignore */ }
              const def = { kind: "image", name: DEFAULT_BG_NAME };
              lsSet("deepharness.background", JSON.stringify(def));
              return def;
            }
            return parsed;
          }
        } catch { /* fall through */ }
      }
      // 出厂默认背景:仓库自带 assets/backgrounds/默认.jpg
      const def = { kind: "image", name: DEFAULT_BG_NAME };
      lsSet("deepharness.background", JSON.stringify(def));
      return def;
    }

    // 应用外观(读取 localStorage;返回 disposer 用于撤销令牌覆盖)
    function applyAppearance(theme) {
      const brand = lsGet("deepharness.brand", "on") !== "off";
      const brandColor = lsGet("deepharness.brandColor", BRAND_COLOR);
      // 侧边栏用同系深色(无背景模式),不与主色相同
      const sidebarColor = mixToward(brandColor, "#0B1220", 0.28);
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
      // 一键换肤激活时,皮肤完全接管外观:停用壁纸/玻璃/品牌背景,避免互相覆盖
      const skinActiveId = lsGet("deepharness.skin", "none");
      const skinActive = skinActiveId !== "none" && (SKINS.some(s => s.id === skinActiveId) || COMMUNITY_SKINS.some(s => s.id === skinActiveId));
      if (!skinActive) {
        if (bgLayer) {
          // 有背景:玻璃视效。品牌色开关真正生效——
          // 勾选 = 品牌蓝玻璃;不勾选 = 中性深色玻璃(完全不用品牌色)
          css.push("html, body { background: " + bgLayer + "; background-color: #0B1220; }");
          if (brand) {
            css.push(glassCss(brandColor));
          } else {
            css.push('[class*="sidebarCol"] { background: rgba(13,18,35,0.5) !important; }');
            css.push('[class*="detailsCol"] { background: rgba(13,18,35,0.4) !important; }');
            css.push('[class*="centerCol"] { background: rgba(8,12,25,0.28) !important; }');
          }
        } else if (brand) {
          css.push('[class*="sidebarCol"] { background: ' + sidebarColor + ' !important; }');
          css.push('[class*="sidebarCol"] [class*="_brand"] { background: ' + brandColor + ' !important; }');
          css.push("html, body { background-color: " + mixToward(brandColor, "#000000", 0.35) + "; }");
        }
      } else {
        // 皮肤接管:清掉 html/body 壁纸,避免白底/错底干扰皮肤
        css.push("html, body { background: none !important; background-color: transparent !important; }");
      }
      injectCSS("deep-harness-appearance-bg", css.join("\n"));

      // 金边装饰(可开关):金色渐变边框、光晕、繁复华丽风格
      const gold = lsGet("deepharness.gold", "off") === "on";
      if (gold) {
        injectCSS("deep-harness-appearance-gold",
          '[class*="sidebarCol"] { border-right: 1px solid rgba(212,175,55,0.45) !important; }\n' +
          '[class*="sidebarCol"] [class*="_brand"] { background: linear-gradient(135deg, rgba(212,175,55,0.30), rgba(212,175,55,0.10) 55%, transparent) !important; border-bottom: 1px solid rgba(212,175,55,0.55) !important; }\n' +
          '[class*="sidebarCol"] [class*="_brand"] svg, [class*="sidebarCol"] [class*="_brand"] img { filter: drop-shadow(0 0 6px rgba(212,175,55,0.55)); }\n' +
          '[class*="VOzbGW_panel"] { border: 1px solid rgba(212,175,55,0.45) !important; box-shadow: 0 0 30px rgba(212,175,55,0.16), var(--dsw-shadow-lv3) !important; }\n' +
          '[class*="VOzbGW_navCell"]:hover { border: 1px solid rgba(212,175,55,0.4) !important; }\n' +
          '[class*="editorWrap"], [class*="treeCol"], [class*="terminal"], textarea, pre { border-color: rgba(212,175,55,0.32) !important; }\n' +
          'button:not([class*="iconButton"]):hover { border-color: rgba(212,175,55,0.55) !important; }\n' +
          '::selection { background: rgba(212,175,55,0.35) !important; }\n' +
          '[class*="cost"], [class*="panel"] [class*="row"] { border-left: 2px solid rgba(212,175,55,0.35) !important; }\n' +
          // 金边延伸:对话框与各页面内部区域(仅描边/内阴影,不影响布局)
          '[role="dialog"], [class*="modal"], [class*="popover"], [class*="dropdown"], [class*="tooltip"] { border-color: rgba(212,175,55,0.45) !important; }\n' +
          '[role="dialog"] { box-shadow: 0 0 40px rgba(212,175,55,0.18), var(--dsw-shadow-lv3) !important; }\n' +
          '[role="dialog"] [class*="header"], [role="dialog"] [class*="title"], [class*="modal"] [class*="header"] { border-bottom: 1px solid rgba(212,175,55,0.35) !important; }\n' +
          '[class*="message"], [class*="chatItem"], [class*="bubble"], [class*="nodeItem"], [class*="sessionItem"] { border: 1px solid rgba(212,175,55,0.22) !important; }\n' +
          '[class*="message"]:hover, [class*="chatItem"]:hover, [class*="bubble"]:hover { border-color: rgba(212,175,55,0.45) !important; }\n' +
          '[class*="composer"], [class*="inputArea"], [class*="promptBox"], [class*="sendBar"] { border: 1px solid rgba(212,175,55,0.40) !important; }\n' +
          '[class*="composer"]:focus-within, [class*="inputArea"]:focus-within { border-color: rgba(212,175,55,0.75) !important; box-shadow: 0 0 18px rgba(212,175,55,0.20) !important; }\n' +
          '[class*="tab"][class*="active"], [class*="tabs"] [aria-selected="true"], [class*="navCell"][class*="active"] { border-bottom: 2px solid rgba(212,175,55,0.75) !important; }\n' +
          '[class*="stats"], [class*="chartCard"], [class*="metricCard"], [class*="detailCard"], [class*="card"] { border: 1px solid rgba(212,175,55,0.28) !important; }\n' +
          '[class*="workspace"], [class*="projectCard"], [class*="envCard"], [class*="settingCard"] { border: 1px solid rgba(212,175,55,0.30) !important; }\n' +
          '[class*="workspace"]:hover, [class*="projectCard"]:hover, [class*="envCard"]:hover { border-color: rgba(212,175,55,0.55) !important; }\n');
      } else {
        injectCSS("deep-harness-appearance-gold", "");
      }

      // 一键换肤(预设 + 社区):内置皮肤为内联 CSS;社区皮肤经路由拉取 CSS 并设置 body 激活属性
      const savedSkinId = lsGet("deepharness.skin", "none");
      const skin = SKINS.find(s => s.id === savedSkinId) || COMMUNITY_SKINS.find(s => s.id === savedSkinId) || SKINS[0];
      const applySkin = (skinEntry) => {
        // 清除旧皮肤:移除所有 data-dsh-* body 属性 + 清空皮肤样式
        try {
          [...document.body.attributes].filter(a => a.name.startsWith("data-dsh-")).forEach(a => document.body.removeAttribute(a.name));
        } catch { /* ignore */ }
        if (!skinEntry || skinEntry.id === "none") { injectCSS("deep-harness-appearance-skin", ""); return; }
        if (skinEntry.community) {
          if (skinEntry.bodyAttr) { try { document.body.setAttribute(skinEntry.bodyAttr, ""); } catch { /* ignore */ } }
          fetch(API + "/skin?name=" + encodeURIComponent(skinEntry.id), { cache: "no-store" })
            .then((r) => { if (!r.ok) throw new Error("skin fetch failed"); return r.text(); })
            .then((css) => {
              if (lsGet("deepharness.skin", "none") !== skinEntry.id) return; // 已被切换
              injectCSS("deep-harness-appearance-skin", css);
            })
            .catch(() => { /* 拉取失败保持无皮肤 */ });
        } else {
          injectCSS("deep-harness-appearance-skin", skinEntry.css || "");
        }
      };
      applySkin(skin);

      if (theme) {
        const tokens = {};
        if (bgLayer) {
          tokens["--dsw-alias-bg-base"] = { light: "rgba(8,12,25,0.12)", dark: "rgba(8,12,25,0.12)" };
          // 内容卡片(聊天/轨迹/列表)半透明,壁纸不再被大片纯色盖住
          tokens["--dsw-alias-bg-layer-1"] = { light: "rgba(17,24,48,0.72)", dark: "rgba(17,24,48,0.72)" };
          tokens["--dsw-alias-bg-layer-2"] = { light: "rgba(21,30,58,0.78)", dark: "rgba(21,30,58,0.78)" };
        }
        if (brand) {
          const bright = mixToward(brandColor, "#5B7CFA", 0.38);
          tokens["--dsw-specific-sidebar-fill"] = {
            light: bgLayer ? withAlpha(bright, 0.52) : sidebarColor,
            dark: bgLayer ? withAlpha(bright, 0.52) : sidebarColor
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

    // 全局外观层:主题令牌覆盖由插件主流程统一持有(见 apply 的 ctx.effect),
    // 设置组件触发重新应用但不在卸载时撤销,保证关闭设置后外观不丢失。
    let appearanceDisposer = null;
    function reapplyAppearance(theme) {
      if (appearanceDisposer) {
        try { appearanceDisposer(); } catch { /* ignore */ }
        appearanceDisposer = null;
      }
      appearanceDisposer = applyAppearance(theme || window.__dshClientTheme || null);
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
          "裁剪背景图(固定 16:9;拖动图片定位,滑杆缩放)"),
        React.createElement("div", {
          ref: areaRef,
          style: {
            position: "relative", width: "min(94vw, 1100px)", height: "min(68vh, 560px)",
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
            type: "range", min: 0.05, max: 8, step: 0.05, value: scale,
            style: { width: 220 },
            onChange: (e) => setScale(Number(e.target.value))
          }),
          scale.toFixed(2) + "×",
          React.createElement("span", { style: { color: "#64748B", fontSize: 12 } },
            "缩小(0.05×)可截取超大画面,放大(8×)可截细节;应用后按 16:9 铺满窗口,边缘会裁切")
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

    // ── 外观设置(设置 → 界面外观)────────────────────────────────────
    // 会话视图栏标签清单(侧边卡片开关用)
    const VIEW_TABS = [
      { id: "browser", label: "浏览器" },
      { id: "files", label: "文件" },
      { id: "terminal", label: "终端" },
      { id: "stats", label: "统计" },
      { id: "skills", label: "技能" },
      { id: "env", label: "环境" }
    ];
    const tabOn = (id) => lsGet("deepharness.tab." + id, "on") !== "off";

    function AppearanceSettings() {
      const [brand, setBrand] = React.useState(lsGet("deepharness.brand", "on") !== "off");
      const [brandColor, setBrandColor] = React.useState(lsGet("deepharness.brandColor", BRAND_COLOR));
      const [font, setFont] = React.useState(lsGet("deepharness.font", "default"));
      const [gold, setGold] = React.useState(lsGet("deepharness.gold", "off") === "on");
      const [skin, setSkin] = React.useState(lsGet("deepharness.skin", "none"));
      const [bg, setBg] = React.useState(resolveBackground());
      const [fonts, setFonts] = React.useState([]);
      const [backgrounds, setBackgrounds] = React.useState([]);
      const [msg, setMsg] = React.useState("");
      const [cropImage, setCropImage] = React.useState(null); // dataURL
      const [diag, setDiag] = React.useState(null); // 诊断信息(版本/环境)

      const reload = React.useCallback(() => {
        reapplyAppearance(window.__dshClientTheme || null);
      }, []);

      React.useEffect(() => {
        reload();
        // 注意:此处不得撤销外观层——层由插件主流程统一持有,
        // 组件卸载(关闭设置)时撤销会导致背景/半透明永久丢失。
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      React.useEffect(() => {
        apiGet("/fonts").then(d => setFonts(d.fonts || [])).catch(() => setFonts([]));
        apiGet("/backgrounds").then(d => setBackgrounds(d.backgrounds || [])).catch(() => setBackgrounds([]));
        apiGet("/status").then(d => setDiag(d)).catch(() => setDiag(null));
      }, []);

      const setBrandV = (v) => { lsSet("deepharness.brand", v ? "on" : "off"); setBrand(v); reload(); };
      const setBrandColorV = (v) => { lsSet("deepharness.brandColor", v); setBrandColor(v); reload(); };
      const setFontV = (v) => { lsSet("deepharness.font", v); setFont(v); reload(); };
      const setGoldV = (v) => { lsSet("deepharness.gold", v ? "on" : "off"); setGold(v); reload(); };
      const setSkinV = (v) => { lsSet("deepharness.skin", v); setSkin(v); reload(); };
      const setTabV = (id, on) => { lsSet("deepharness.tab." + id, on ? "on" : "off"); setMsg((on ? "已显示「" : "已隐藏「") + (VIEW_TABS.find(t => t.id === id) || {}).label + "」标签,刷新页面后生效"); };
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

      return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, maxWidth: 820 } },

        diag && React.createElement("div", {
          style: {
            display: "flex", flexWrap: "wrap", gap: "6px 14px", alignItems: "center",
            background: "rgba(77,107,254,0.08)", border: "1px solid rgba(77,107,254,0.25)",
            borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "var(--dsw-alias-label-secondary)"
          }
        },
          React.createElement("span", { style: { fontWeight: 700, color: "#4D6BFE" } }, "插件 v" + (diag.version || "?")),
          React.createElement("span", {}, "背景: " + (bgKind === "image" ? bgImageName : bgKind === "gradient" ? bg.id : "无")),
          React.createElement("span", {}, "环境: " + (typeof window.__dshDesktop !== "undefined" ? "桌面应用" : "浏览器")),
          React.createElement("span", {}, "品牌色: " + (brand ? brandColor : "关闭")),
          diag.root && React.createElement("span", { style: { color: "var(--dsw-alias-label-tertiary)" } }, "工作区: " + diag.root)
        ),

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "品牌与字体"),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "品牌色"),
            React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
              React.createElement("input", { type: "checkbox", checked: brand, onChange: (e) => setBrandV(e.target.checked) }),
              "启用品牌色(顶栏/侧栏不随主题变化)")
          ),
          brand && React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "主色"),
            React.createElement("input", {
              type: "color", value: brandColor,
              style: { width: 44, height: 28, padding: 0, border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 6, background: "transparent", cursor: "pointer" },
              onChange: (e) => setBrandColorV(e.target.value)
            }),
            React.createElement("span", { style: { ...STYLES.hint, flex: 1, minWidth: 200 } },
              "主色用于顶栏/标题行;有背景时侧边栏为品牌蓝玻璃,无背景时自动配同系深色(" + mixToward(brandColor, "#0B1220", 0.28) + "),两者区分不雷同")
          ),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "界面字体"),
            React.createElement("select", { style: STYLES.select, value: font, onChange: (e) => setFontV(e.target.value) },
              FONT_CHOICES.map(c => React.createElement("option", { key: c.id, value: c.id }, c.label))
            )
          )
        ),

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "一键换肤(预设)"),
          React.createElement("div", { style: STYLES.hint },
            "内置 5 款自研皮肤 + " + COMMUNITY_SKINS.length + " 款社区开源皮肤(dsh-web-ui / dsh-deep-whale)。点击即切换,与品牌色、金边、背景互相独立;「深海女仆工坊」为 CC BY-NC-SA 4.0(禁止商用),其余社区皮肤为 BSD-3-Clause。"),
          React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } },
            SKINS.filter(s => s.id !== "none").map(s => React.createElement("button", {
              key: s.id,
              style: skin === s.id ? STYLES.buttonPrimary : STYLES.button,
              title: "一键应用皮肤: " + s.label,
              onClick: () => setSkinV(s.id)
            }, s.label)),
            COMMUNITY_SKINS.map(s => {
              const meta = communityMeta(s.id);
              return React.createElement("button", {
                key: s.id,
                style: skin === s.id ? STYLES.buttonPrimary : STYLES.button,
                title: (meta ? meta.tagline + " · " : "") + (meta ? meta.author + " · " : "") + s.label + (s.id === "maid-atelier" ? "(非商用)" : ""),
                onClick: () => setSkinV(s.id)
              }, s.label + (s.id === "maid-atelier" ? "(非商用)" : ""));
            }),
            skin !== "none" && React.createElement("button", {
              style: { ...STYLES.button, borderColor: "#B45309", color: "#B45309" },
              onClick: () => setSkinV("none")
            }, "恢复默认")
          ),
          React.createElement("div", { style: STYLES.hint },
            "社区皮肤版权归原作者所有(来源: dsh-web-ui / Deepseek-Harness-EAC),随插件附许可文本;切换后若样式未刷新,重开设置或刷新页面即可。")
        ),

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "装饰(金边)"),
          React.createElement("div", { style: STYLES.row },
            React.createElement("span", { style: STYLES.label }, "金边装饰"),
            React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" } },
              React.createElement("input", { type: "checkbox", checked: gold, onChange: (e) => setGoldV(e.target.checked) }),
              "开启金色边框与光晕 — 繁复华丽风格(侧边栏金边、品牌行金渐变、面板金框、控件金色描边)")
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
            backgrounds.map(b => React.createElement("span", {
              key: b.name,
              style: { display: "inline-flex", alignItems: "center", gap: 4 }
            },
              React.createElement("button", {
                style: bgKind === "image" && bgImageName === b.name ? STYLES.buttonPrimary : STYLES.button,
                title: (b.bytes / 1024).toFixed(1) + " KB" + (b.source === "repo" ? "(出厂自带)" : ""),
                onClick: () => setBgV({ kind: "image", name: b.name })
              }, b.name),
              b.source === "user" && React.createElement("button", {
                title: "删除此背景",
                style: {
                  padding: "5px 8px", borderRadius: 7, border: "1px solid var(--dsw-alias-border-l2)",
                  background: "transparent", color: "#F87171", fontSize: 12, cursor: "pointer", lineHeight: 1
                },
                onClick: async () => {
                  try {
                    await apiPost("/background/delete", { name: b.name });
                    const d = await apiGet("/backgrounds");
                    setBackgrounds(d.backgrounds || []);
                    if (bgKind === "image" && bgImageName === b.name) setBgV({ kind: "none" });
                    setMsg("已删除背景 " + b.name);
                  } catch (err) {
                    setMsg("删除失败: " + String(err.message || err));
                  }
                }
              }, "✕")
            ))
          )
        ),

        React.createElement("div", { style: STYLES.section },
          React.createElement("span", { style: STYLES.sectionTitle }, "侧边卡片(标签开关)"),
          React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 } },
            VIEW_TABS.map(t => React.createElement("div", {
              key: t.id,
              style: {
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                padding: "8px 12px", borderRadius: 8, fontSize: 13,
                background: "var(--dsw-alias-bg-layer-1)", border: "1px solid var(--dsw-alias-border-l2)"
              }
            },
              React.createElement("span", { style: { color: "var(--dsw-alias-label-primary)", fontWeight: 600 } }, t.label),
              React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" } },
                React.createElement("input", { type: "checkbox", checked: tabOn(t.id), onChange: (e) => setTabV(t.id, e.target.checked) }),
                React.createElement("span", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)" } }, "显示")
              )
            ))
          ),
          React.createElement("div", { style: STYLES.hint },
            "会话视图栏的标签可逐项开关(默认全开);修改后刷新页面生效。")
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

        React.createElement("div", { style: STYLES.row },
          React.createElement("button", {
            style: { ...STYLES.button, borderColor: "#B45309", color: "#B45309" },
            onClick: () => {
              ["deepharness.brand", "deepharness.brandColor", "deepharness.font", "deepharness.background", "deepharness.gradient", "deepharness.customFonts", "deepharness.skin", "deepharness.gold"].forEach(k => {
                try { localStorage.removeItem(k); } catch { /* ignore */ }
              });
              VIEW_TABS.forEach(t => { try { localStorage.removeItem("deepharness.tab." + t.id); } catch { /* ignore */ } });
              setBrand(true);
              setBrandColor(BRAND_COLOR);
              setFont("default");
              setSkin("none");
              setGold(false);
              setBg(resolveBackground());
              reload();
              setMsg("✓ 已恢复默认外观(默认背景 默认.jpg + 品牌蓝玻璃 + 无皮肤)");
            }
          }, "恢复默认外观"),
          React.createElement("span", { style: STYLES.hint }, "一键清除外观设置并回到出厂默认")
        ),

        msg && React.createElement("div", { style: STYLES.hint }, msg),

        cropImage && React.createElement(CropOverlay, {
          imageDataUrl: cropImage,
          onCancel: () => setCropImage(null),
          onConfirm: confirmCrop
        })
      );
    }

    // ── 统计标签页:会话 token/耗时/费用明细 ─────────────────────────
    function StatsView(props) {
      const useProjection = props.useProjection;
      let usage = null, stats = null;
      try {
        usage = useProjection ? useProjection("tokenUsage") : null;
        stats = useProjection ? useProjection("sessionStats") : null;
      } catch { /* ignore */ }
      const fmtMs = (ms) => ms == null ? "—" : (ms >= 60000 ? (ms / 60000).toFixed(1) + " 分" : Math.round(ms) + " 毫秒");
      const row = (label, value) => React.createElement("div", {
        key: label,
        style: {
          display: "flex", justifyContent: "space-between", gap: 12,
          padding: "7px 10px", borderRadius: 8,
          background: "var(--dsw-alias-bg-layer-1)",
          fontSize: 13
        }
      },
        React.createElement("span", { style: { color: "var(--dsw-alias-label-secondary)" } }, label),
        React.createElement("span", { style: { color: "var(--dsw-alias-label-primary)", fontWeight: 600, fontFamily: "Consolas, monospace" } }, value)
      );
      const items = [];
      if (stats) {
        items.push(row("对话轮次", String(stats.turns ?? 0)));
        items.push(row("执行步骤", String(stats.steps ?? 0)));
        items.push(row("LLM 耗时", fmtMs(stats.llmMs)));
        items.push(row("工具调用耗时", fmtMs(stats.toolMs)));
        items.push(row("输出 tokens", formatTokens(stats.decodeTokens ?? 0)));
      }
      if (usage) {
        items.push(row("输入 tokens(未命中缓存)", formatTokens(usage.uncachedInputTokens ?? 0)));
        items.push(row("缓存命中 tokens", formatTokens(usage.cacheReadTokens ?? 0)));
        items.push(row("输出 tokens", formatTokens(usage.outputTokens ?? 0)));
        const flash = estimateCost(usage, "deepseek-v4-flash");
        const pro = estimateCost(usage, "deepseek-v4-pro");
        const tier = pricingTier("deepseek-v4-flash");
        items.push(row("费用估算(flash)", "¥" + flash.cost.toFixed(4)));
        items.push(row("费用估算(pro)", "¥" + pro.cost.toFixed(4)));
        items.push(row("当前定价时段", tier.label));
      }
      if (items.length === 0) {
        return React.createElement("div", { style: STYLES.panel },
          React.createElement("div", { style: { ...STYLES.hint, textAlign: "center", paddingTop: 24 } }, "暂无会话数据"));
      }
      return React.createElement("div", { style: { ...STYLES.panel, gap: 6, maxWidth: 720 } },
        React.createElement("div", { style: { fontSize: 13, color: "var(--dsw-alias-label-tertiary)", paddingBottom: 4 } },
          "本会话统计(真实用量,随对话实时更新)"),
        items
      );
    }

    // ── 技能标签页:浏览 DSH 技能库 ──────────────────────────────────
    function SkillsView() {
      const [skills, setSkills] = React.useState([]);
      const [selected, setSelected] = React.useState(null); // {name, content}
      const [msg, setMsg] = React.useState("");
      React.useEffect(() => {
        apiGet("/skills").then(d => setSkills(d.skills || [])).catch(() => setSkills([]));
      }, []);
      const open = async (s) => {
        try {
          const d = await apiGet("/skill?path=" + encodeURIComponent(s.path));
          setSelected({ name: d.name, content: d.content, truncated: d.truncated });
        } catch (err) {
          setMsg(String(err.message || err));
        }
      };
      return React.createElement("div", { style: STYLES.panel },
        React.createElement("div", { style: { fontSize: 13, color: "var(--dsw-alias-label-tertiary)" } },
          "技能库:内置 Agent 预设与本地技能,点击查看 SKILL.md"),
        React.createElement("div", { style: { ...STYLES.split, flex: 1, minHeight: 0 } },
          React.createElement("div", {
            style: {
              width: "38%", minWidth: 200, maxWidth: 380, overflowY: "auto",
              border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 8, padding: 4
            }
          },
            skills.length === 0 && React.createElement("div", { style: { ...STYLES.hint, padding: 12 } }, "未发现技能"),
            skills.map(s => React.createElement("div", {
              key: s.name,
              style: {
                padding: "7px 10px", borderRadius: 6, cursor: "pointer", marginBottom: 2,
                background: selected && selected.name === s.name ? "var(--dsw-alias-bg-layer-1)" : "transparent",
                border: selected && selected.name === s.name ? "1px solid #4D6BFE" : "1px solid transparent"
              },
              onClick: () => open(s)
            },
              React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--dsw-alias-label-primary)" } },
                s.name),
              React.createElement("div", { style: { fontSize: 11.5, color: "var(--dsw-alias-label-tertiary)", marginTop: 2 } },
                (s.preset || "local") + (s.description ? " · " + s.description.slice(0, 80) : ""))
            ))
          ),
          React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 } },
            selected === null
              ? React.createElement("div", { style: { ...STYLES.hint, padding: 12 } }, "← 从左侧选择技能查看说明")
              : React.createElement("div", {
                style: {
                  flex: 1, minHeight: 0, overflowY: "auto", borderRadius: 8, padding: "10px 12px",
                  background: "#0F172A", color: "#D1D5DB",
                  fontFamily: "Consolas, 'Cascadia Code', monospace", fontSize: 12, lineHeight: 1.5,
                  whiteSpace: "pre-wrap", wordBreak: "break-all",
                  border: "1px solid var(--dsw-alias-border-l2)"
                }
              },
                selected.name + (selected.truncated ? "(已截断)" : "") + "\n\n" + selected.content),
            msg && React.createElement("div", { style: STYLES.hint }, msg)
          )
        )
      );
    }

    // ── 环境标签页:版本/路径/诊断信息 ────────────────────────────────
    function EnvView() {
      const [info, setInfo] = React.useState(null);
      const [msg, setMsg] = React.useState("");
      React.useEffect(() => {
        apiGet("/status").then(d => setInfo(d)).catch(() => setInfo(null));
      }, []);
      const row = (label, value) => React.createElement("div", {
        key: label,
        style: {
          display: "flex", justifyContent: "space-between", gap: 12,
          padding: "7px 10px", borderRadius: 8,
          background: "var(--dsw-alias-bg-layer-1)", fontSize: 13
        }
      },
        React.createElement("span", { style: { color: "var(--dsw-alias-label-secondary)", flex: "none" } }, label),
        React.createElement("span", {
          style: { color: "var(--dsw-alias-label-primary)", fontFamily: "Consolas, monospace", fontSize: 12, textAlign: "right", wordBreak: "break-all" }
        }, value)
      );
      const items = [];
      if (info) {
        items.push(row("增强插件版本", "v" + (info.version || "?")));
        items.push(row("工作区根目录", info.root));
        items.push(row("数据目录", info.dshHome));
        items.push(row("平台 / Node", info.platform + " / " + (info.node || "?")));
        items.push(row("运行端口", String(window.location.port || 3080)));
        items.push(row("当前背景", (function () {
          const bg = resolveBackground();
          return bg.kind === "image" ? bg.name : bg.kind === "gradient" ? bg.id : "无";
        })()));
        items.push(row("品牌色", lsGet("deepharness.brand", "on") !== "off" ? lsGet("deepharness.brandColor", "#16204A") : "关闭"));
        items.push(row("运行环境", typeof window.__dshDesktop !== "undefined" ? "桌面应用" : "浏览器"));
      }
      const copyDiag = async () => {
        try {
          const diag = { at: new Date().toISOString(), info, bg: resolveBackground(), brand: lsGet("deepharness.brand", "on"), brandColor: lsGet("deepharness.brandColor", null), font: lsGet("deepharness.font", "default") };
          await navigator.clipboard.writeText(JSON.stringify(diag, null, 2));
          setMsg("✓ 诊断信息已复制到剪贴板");
        } catch {
          setMsg("复制失败(剪贴板不可用)");
        }
      };
      return React.createElement("div", { style: { ...STYLES.panel, gap: 6, maxWidth: 720 } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
          React.createElement("div", { style: { fontSize: 13, color: "var(--dsw-alias-label-tertiary)", flex: 1 } }, "环境与诊断信息"),
          React.createElement("button", { style: STYLES.button, onClick: copyDiag }, "复制诊断")
        ),
        items.length ? items : React.createElement("div", { style: STYLES.hint }, "加载中…"),
        msg && React.createElement("div", { style: STYLES.hint }, msg)
      );
    }

    // ── 浏览器标签页:内置轻量浏览器(搜索 / 网址 / 本地纯前端调试 / F12)──
    const BROWSER_ENGINES = {
      baidu: { label: "百度", url: (q) => "https://www.baidu.com/s?wd=" + encodeURIComponent(q) },
      bing: { label: "必应", url: (q) => "https://www.bing.com/search?q=" + encodeURIComponent(q) },
      google: { label: "Google", url: (q) => "https://www.google.com/search?q=" + encodeURIComponent(q) }
    };
    const BROWSER_SERVE = "/deepharness/browser/serve/";

    // 输入解析:网址 / 绝对路径 / 工作区相对路径 / 裸域名 / 搜索词
    function browserResolve(raw, engine) {
      const s = String(raw || "").trim();
      if (!s) return { type: "empty" };
      if (/^https?:\/\//i.test(s)) return { type: "url", url: s };
      const toServe = (p) => window.location.origin + BROWSER_SERVE + encodeURIComponent(p.replace(/\\/g, "/"));
      if (/^[a-zA-Z]:[\\/]/.test(s) || s.startsWith("/") || s.startsWith("\\")) return { type: "file", url: toServe(s) };
      if (s.includes("/") || s.includes("\\") || /\.html?$/i.test(s)) return { type: "file", url: toServe(s) };
      if (s.includes(".") && !/\s/.test(s)) return { type: "url", url: "https://" + s };
      const eng = BROWSER_ENGINES[engine] || BROWSER_ENGINES.baidu;
      return { type: "search", url: eng.url(s) };
    }

    function BrowserView() {
      const isDesktop = typeof window.__dshDesktop !== "undefined" && !!window.__dshDesktop.isDesktop;
      const useWebview = isDesktop && window.__dshDesktop && window.__dshDesktop.webview === true;
      const [input, setInput] = React.useState(lsGet("deepharness.browser.url", ""));
      const [current, setCurrent] = React.useState("");
      const [engine, setEngine] = React.useState(lsGet("deepharness.browser.engine", "baidu"));
      const [status, setStatus] = React.useState("");
      const [pageUrl, setPageUrl] = React.useState("");
      const [failMsg, setFailMsg] = React.useState("");
      const [recent, setRecent] = React.useState(JSON.parse(lsGet("deepharness.browser.recent", "[]")));
      const frameRef = React.useRef(null);

      const saveGuestUrl = () => {
        const el = frameRef.current;
        if (el && typeof el.getURL === "function") {
          try { lsSet("deepharness.browser.guestUrl", el.getURL()); } catch { /* ignore */ }
        }
      };

      // 访客页内守卫:把 target=_blank 链接改为同页跳转(就地打开,不弹新窗口)。
      // 完全在页面内部处理,不依赖主进程/allowpopups,每次导航后重新注入。
      const GUARD_SCRIPT = "(() => { " +
        "if (window.__dshLinkGuard) return 'already'; " +
        "window.__dshLinkGuard = true; " +
        "document.addEventListener('click', (e) => { " +
        "const a = e.target && e.target.closest ? e.target.closest('a[href]') : null; " +
        "if (a && a.target === '_blank' && /^https?:/.test(a.href)) { e.preventDefault(); e.stopPropagation(); location.href = a.href; } " +
        "}, true); " +
        "return 'guard-injected'; " +
        "})()";
      const injectGuard = () => {
        const el = frameRef.current;
        if (el && typeof el.executeJavaScript === "function") {
          el.executeJavaScript(GUARD_SCRIPT).catch(() => { /* 跨源/受限页面忽略 */ });
        }
      };

      React.useEffect(() => {
        // 恢复上次浏览位置(优先取访客页当前 URL,其次地址栏输入)
        if (!current) {
          const guest = lsGet("deepharness.browser.guestUrl", "");
          const saved = guest || lsGet("deepharness.browser.url", "");
          if (saved) navigate(saved);
        }
        const el = frameRef.current;
        if (el && el.tagName === "WEBVIEW") {
          const onFail = (e) => {
            if (e.isMainFrame) setFailMsg((e.errorDescription || e.validationMessage || "未知错误") + "(" + (e.errorCode || "?") + ")");
          };
          const onDone = () => { setFailMsg(""); };
          const onNav = () => {
            setFailMsg("");
            try { setPageUrl(el.getURL() || ""); } catch { /* ignore */ }
            saveGuestUrl();
          };
          const onNewWindow = (e) => {
            // 兜底:即便主进程未拦截,也在渲染进程就地打开
            try { e.preventDefault(); el.src = String(e.url); } catch { /* ignore */ }
          };
          el.addEventListener("did-fail-load", onFail);
          el.addEventListener("did-finish-load", () => { injectGuard(); onDone(); });
          el.addEventListener("did-navigate", () => { injectGuard(); onNav(); });
          el.addEventListener("did-navigate-in-page", () => { injectGuard(); onNav(); });
          el.addEventListener("new-window", onNewWindow);
          return () => {
            saveGuestUrl(); // 切走标签页时记住当前位置,回来不丢
            el.removeEventListener("did-fail-load", onFail);
            el.removeEventListener("did-finish-load", onDone);
            el.removeEventListener("did-navigate", onNav);
            el.removeEventListener("did-navigate-in-page", onNav);
            el.removeEventListener("new-window", onNewWindow);
          };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const navigate = (raw) => {
        const r = browserResolve(raw, engine);
        if (r.type === "empty") { setStatus("请输入搜索词、网址或本地 index.html 路径"); return; }
        lsSet("deepharness.browser.url", raw);
        const prev = JSON.parse(lsGet("deepharness.browser.recent", "[]"));
        const next = [raw, ...prev.filter((x) => x !== raw)].slice(0, 8);
        lsSet("deepharness.browser.recent", JSON.stringify(next));
        setRecent(next);
        setCurrent(r.url);
        setFailMsg("");
        setStatus(r.type === "search" ? "正在搜索: " + raw : r.type === "file" ? "本地文件: " + raw : "已打开: " + r.url);
      };

      const goBack = () => {
        const el = frameRef.current;
        if (!el) return;
        if (typeof el.goBack === "function") { try { if (el.canGoBack()) el.goBack(); } catch { /* ignore */ } }
        else { try { el.contentWindow.history.back(); } catch { /* ignore */ } }
      };
      const goForward = () => {
        const el = frameRef.current;
        if (!el) return;
        if (typeof el.goForward === "function") { try { if (el.canGoForward()) el.goForward(); } catch { /* ignore */ } }
        else { try { el.contentWindow.history.forward(); } catch { /* ignore */ } }
      };
      const reloadFrame = () => {
        const el = frameRef.current;
        if (!el) return;
        if (typeof el.reload === "function") el.reload();
        else { try { el.src = el.src; } catch { /* ignore */ } }
        setFailMsg("");
      };

      const openDevTools = () => {
        const el = frameRef.current;
        if (el && typeof el.openDevTools === "function") { el.openDevTools({ mode: "detach" }); return; }
        setStatus(useWebview
          ? "请直接在键盘按 F12 打开开发者工具"
          : "请按浏览器 F12 打开开发者工具,再在顶部帧列表选择本 iframe 进行调试");
      };

      const dropFile = (e) => {
        e.preventDefault();
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (!f) return;
        const p = f.path || f.webkitRelativePath;
        if (p) { setInput(p); navigate(p); }
        else setStatus("当前环境无法读取拖入文件路径,请手动输入路径");
      };

      const btnStyle = {
        padding: "5px 10px", borderRadius: 6, border: "1px solid var(--dsw-alias-border-l2)",
        background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
        fontSize: 12, cursor: "pointer", lineHeight: 1.4, flex: "none"
      };

      const toolbar = React.createElement("div", {
        style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" },
        onDragOver: (e) => e.preventDefault(),
        onDrop: dropFile
      },
        React.createElement("button", { style: btnStyle, title: "后退", onClick: goBack }, "←"),
        React.createElement("button", { style: btnStyle, title: "前进", onClick: goForward }, "→"),
        React.createElement("select", {
          value: engine,
          onChange: (e) => { const v = e.target.value; setEngine(v); lsSet("deepharness.browser.engine", v); },
          style: { padding: "5px 6px", borderRadius: 6, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)", fontSize: 12, outline: "none", flex: "none" },
          title: "搜索方式"
        },
          Object.keys(BROWSER_ENGINES).map((k) =>
            React.createElement("option", { key: k, value: k }, BROWSER_ENGINES[k].label))),
        React.createElement("input", {
          list: "dsh-browser-recent",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => { if (e.key === "Enter") navigate(input); },
          placeholder: "搜索词 / 网址 / 本地 index.html(如 D:/demo/index.html,可拖入文件)",
          style: {
            flex: 1, minWidth: 160, padding: "5px 10px", borderRadius: 6,
            border: "1px solid var(--dsw-alias-border-l2)",
            background: "var(--dsw-alias-bg-layer-1)", color: "var(--dsw-alias-label-primary)",
            fontSize: 12, outline: "none"
          }
        }),
        React.createElement("datalist", { id: "dsh-browser-recent" },
          recent.map((r, i) => React.createElement("option", { key: i, value: r }))),
        React.createElement("button", { style: { ...btnStyle, borderColor: "#4D6BFE", color: "#4D6BFE" }, onClick: () => navigate(input) }, "前往"),
        React.createElement("button", { style: btnStyle, title: "刷新", onClick: reloadFrame }, "刷新"),
        React.createElement("button", { style: btnStyle, title: "打开开发者工具", onClick: openDevTools }, "F12")
      );

      const frame = current === ""
        ? React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 } },
            React.createElement("div", { style: { textAlign: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13, lineHeight: 2.1, maxWidth: 560 } },
              React.createElement("div", { style: { fontSize: 42, lineHeight: 1.4 } }, "🌐"),
              React.createElement("div", null, "内置轻量浏览器(镶嵌在工作台会话视图内):搜索、打开网址、调试本地纯前端应用"),
              React.createElement("div", null, "输入本地 index.html 路径(如 D:/demo/index.html)即可运行,支持 ES module / fetch"),
              React.createElement("div", null, useWebview
                ? "桌面端:内嵌 Chromium 窗口,F12 打开独立开发者工具;切换标签页后返回不丢页面"
                : "浏览器模式:按浏览器 F12 后在帧列表选择本 iframe 调试")))
        : useWebview
        ? React.createElement("webview", {
            ref: frameRef, src: current,
            allowpopups: true, allowfullscreen: true,
            style: { flex: 1, minHeight: 0, borderRadius: 8, border: "1px solid var(--dsw-alias-border-l2)", background: "#FFFFFF" }
          })
        : React.createElement("iframe", {
            ref: frameRef, src: current,
            style: { flex: 1, minHeight: 0, borderRadius: 8, border: "1px solid var(--dsw-alias-border-l2)", background: "#FFFFFF" }
          });

      return React.createElement("div", { style: { ...STYLES.panel, gap: 6 } },
        toolbar,
        (status || pageUrl) && React.createElement("div", {
          style: { fontSize: 11.5, color: "var(--dsw-alias-label-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: "none" }
        }, pageUrl ? (status ? status + " · " : "") + pageUrl : status),
        failMsg && React.createElement("div", {
          style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, fontSize: 12, background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.4)", color: "#F87171", flex: "none" }
        },
          React.createElement("span", { style: { flex: 1 } }, "加载失败: " + failMsg),
          React.createElement("button", { style: btnStyle, onClick: reloadFrame }, "重试")),
        frame
      );
    }

    // ── 感谢名单(设置 → 感谢名单)───────────────────────────────────
    // 纯静态信息页:项目作者、调试助手、官方基础、参考项目与大肥鱼提供者。
    // 链接经 target=_blank 打开(桌面端由壳层转交系统浏览器)。
    function CreditsView() {
      const row = (title, items) => React.createElement("div", {
        style: { display: "flex", flexDirection: "column", gap: 6 }
      },
        React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "var(--dsw-alias-label-primary)" } }, title),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, items)
      );
      const entry = (name, desc, link) => React.createElement("div", {
        key: name,
        style: {
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          padding: "9px 12px", borderRadius: 8, fontSize: 13,
          background: "var(--dsw-alias-bg-layer-2)", border: "1px solid var(--dsw-alias-border-l2)"
        }
      },
        React.createElement("span", { style: { fontWeight: 600, color: "var(--dsw-alias-label-primary)" } }, name),
        React.createElement("span", { style: { flex: 1, minWidth: 160, color: "var(--dsw-alias-label-secondary)", fontSize: 12 } }, desc),
        link && React.createElement("a", {
          href: link, target: "_blank", rel: "noopener noreferrer",
          style: { fontSize: 12, color: "#4D6BFE", textDecoration: "none", wordBreak: "break-all" }
        }, "链接 ↗")
      );
      return React.createElement("div", { style: { ...STYLES.panel, gap: 12, maxWidth: 760 } },
        React.createElement("div", { style: { fontSize: 12, color: "var(--dsw-alias-label-tertiary)" } },
          "感谢每一位让 DEEPHARNESS 变得更好的人与项目。本项目基于 MIT 协议开源,参考项目版权归原作者所有。"),
        row("🎩 项目作者",
          entry("NANTI", "DEEPHARNESS 的创意提出者与全部需求/验收负责人,主导了每一次功能迭代与打磨。")),
        row("🤖 调试与优化",
          entry("DeepSeek AI 助手", "在 DeepSeek Harness 会话内完成代码实现、DEBUG 与兼容性优化,与 NANTI 一起逐项验收。")),
        row("🏗️ 官方基础",
          entry("@deepseek-ai/dsh(DeepSeek Harness)", "DeepSeek 官方开源的 Agent 运行时,本项目的底座(MIT)。",
            "https://github.com/deepseek-ai/deepseek-harness")),
        row("📚 参考项目(功能来源)",
          entry("Deepseek-Harness-EAC(揽尽万象)", "zouyuxuan122 — 一键夺舍/长期记忆/皮肤预设/插件体系等思路参考(MIT)。",
            "https://github.com/zouyuxuan122/Deepseek-Harness-EAC"),
          entry("dsh_desktop", "myYangyunfan — 桌面封装与 M3 主题系统参考(GitHub 与 Gitee 双源)。",
            "https://github.com/myYangyunfan/dsh_desktop"),
          entry("dsh-better-sidebar", "omdsh-dev — 「侧边卡片」工作台与逐项开关概念参考。",
            "https://github.com/omdsh-dev/DSH-better-sidebar"),
          entry("dsh-easy-setup / dsh-soul-md / dsh-tdai-memory", "EAC 打包的社区插件 — 一键夺舍指令、soul.md 人设注入、长期记忆方案参考。",
            "https://github.com/zouyuxuan122/Deepseek-Harness-EAC/tree/main/dsh-desktop/assets/plugins"),
          entry("dsh-web-ui", "zhu1090093659 — 本项目内置的 10 款社区皮肤来源(BSD-3-Clause)。",
            "https://github.com/zhu1090093659/dsh-web-ui"),
          entry("dsh-deep-whale(深海女仆工坊)", "Small-tailqwq — 内置皮肤「深海女仆工坊」(CC BY-NC-SA 4.0,禁止商用)。",
            "https://github.com/Small-tailqwq/dsh-deep-whale")),
        row("🐟 大肥鱼桌面伴侣",
          entry("dsh-dafeiyu", "QCYTSN — 状态驱动桌面宠物 + 聊天对话框(MIT)。",
            "https://github.com/QCYTSN/dsh-dafeiyu")),
        row("⚖️ 许可",
          React.createElement("div", { style: { fontSize: 12, lineHeight: 1.7, color: "var(--dsw-alias-label-tertiary)" } },
            "DEEPHARNESS 本体与增强插件为 MIT 协议;内置大肥鱼(dsh-dafeiyu)为 MIT;内置皮肤来自 dsh-web-ui(BSD-3-Clause)与 dsh-deep-whale(CC BY-NC-SA 4.0 禁止商用),版权归原作者所有,随插件附许可文本;其余参考项目按其各自许可分发。"))
      );
    }

    // ── 插件主体 ────────────────────────────────────────────────────
    const inject = ["slots", "theme"];

    function apply(ctx) {
      const slots = ctx.slots;
      const theme = ctx.theme;

      // 供设置组件重取(theme 服务实例)
      try { window.__dshClientTheme = theme; } catch { /* ignore */ }

      // 会话视图栏:「浏览器」标签(内置轻量浏览器:搜索 / 本地纯前端调试 / F12)
      if (tabOn("browser")) ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "browser",
        order: 10,
        label: () => "浏览器",
        inject: (sessionId) => ({ sessionId })
      }, BrowserView));

      // 会话视图栏:「文件」标签
      if (tabOn("files")) ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "files",
        order: 20,
        label: () => "文件",
        inject: (sessionId) => ({ sessionId })
      }, FilesView));

      // 会话视图栏:「终端」标签
      if (tabOn("terminal")) ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "terminal",
        order: 30,
        label: () => "终端",
        inject: (sessionId) => ({ sessionId })
      }, TerminalView));

      // 会话视图栏:「统计」标签(会话 token/耗时/费用明细)
      if (tabOn("stats")) ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "stats",
        order: 40,
        label: () => "统计",
        inject: (sessionId) => ({ sessionId })
      }, StatsView));

      // 会话视图栏:「技能」标签(技能库浏览)
      if (tabOn("skills")) ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "skills",
        order: 50,
        label: () => "技能",
        inject: (sessionId) => ({ sessionId })
      }, SkillsView));

      // 会话视图栏:「环境」标签(版本/路径/诊断)
      if (tabOn("env")) ctx.slots.inject("conversation.view", () => slots.register({
        name: "conversation.view",
        id: "env",
        order: 60,
        label: () => "环境",
        inject: (sessionId) => ({ sessionId })
      }, EnvView));

      // 设置 → 独立区块「界面外观」(左侧导航 + 右侧全宽内容区)
      ctx.slots.inject("settings.section", () => slots.register({
        name: "settings.section",
        id: "deepharness-appearance",
        order: 90,
        label: () => "界面外观"
      }, AppearanceSettings));

      // 设置 → 独立区块「感谢名单」(项目作者/调试助手/参考项目/大肥鱼提供者)
      ctx.slots.inject("settings.section", () => slots.register({
        name: "settings.section",
        id: "deepharness-credits",
        order: 96,
        label: () => "感谢名单"
      }, CreditsView));

      // 设置面板加宽:DSH 内核把面板固定为 800px,内容区仅约 580px,
      // 导致各设置页拥挤。这里放宽到视口允许的最大宽度。
      injectCSS("deep-harness-appearance-settings",
        '[class*="VOzbGW_panel"] { width: min(1120px, calc(100vw - 48px)) !important; }');

      // 设置页左侧导航:核心只为 models/agent-presets/plugins 提供专属图标,
      // 其余区块(含本插件三个)共用齿轮。给本插件三个区块配专属图案并隐藏重复齿轮。
      // 导航按 order 排序,本插件区块(order 90/95/96)恒为最后三项。
      injectCSS("deep-harness-appearance-nav",
        '[class*="navCell"]:nth-last-child(1) > svg, [class*="navCell"]:nth-last-child(2) > svg, [class*="navCell"]:nth-last-child(3) > svg { display: none !important; }\n' +
        '[class*="navCell"]:nth-last-child(3)::before { content: "🎨"; margin-right: 7px; font-size: 13px; line-height: 1; }\n' +
        '[class*="navCell"]:nth-last-child(2)::before { content: "🛠️"; margin-right: 7px; font-size: 13px; line-height: 1; }\n' +
        '[class*="navCell"]:nth-last-child(1)::before { content: "🙏"; margin-right: 7px; font-size: 13px; line-height: 1; }');

      // 启动即应用已保存的外观(品牌色/字体/背景),重启后自动恢复。
      // 主题覆盖层由插件主流程统一持有;设置组件只触发"重新应用",
      // 绝不在组件卸载时撤销覆盖层(否则关闭设置面板后背景/半透明永久丢失)。
      ctx.effect(() => {
        reapplyAppearance(theme);
        return () => {
          if (appearanceDisposer) {
            try { appearanceDisposer(); } catch { /* ignore */ }
            appearanceDisposer = null;
          }
        };
      }, "deep-harness-appearance: appearance");
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
