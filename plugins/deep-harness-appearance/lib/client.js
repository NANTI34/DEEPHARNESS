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
        position: "absolute", inset: 0, width: "100%", height: "100%", boxSizing: "border-box",
        padding: "8px 10px", fontSize: "12.5px", lineHeight: "1.5",
        fontFamily: "Consolas, 'Cascadia Code', monospace", resize: "none", outline: "none",
        whiteSpace: "pre", overflow: "auto", tabSize: 2, border: "none", margin: 0
      },
      editorWrap: {
        flex: 1, minHeight: 0, position: "relative",
        background: "var(--dsw-alias-bg-layer-1)",
        border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px",
        overflow: "hidden"
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

    // 高亮编辑器:pre 底层着色 + 透明文字 textarea 叠加(同步滚动)
    function CodeEditor({ value, onChange, language, placeholder }) {
      const taRef = React.useRef(null);
      const preRef = React.useRef(null);
      const html = React.useMemo(() => {
        if (value.length > HL_LIMIT) return escHtml(value);
        return highlightCode(value, language) || "";
      }, [value, language]);
      const sync = () => {
        const ta = taRef.current, pre = preRef.current;
        if (ta && pre) { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; }
      };
      return React.createElement("div", { style: STYLES.editorWrap },
        React.createElement("pre", {
          ref: preRef,
          "aria-hidden": true,
          style: {
            ...STYLES.editor, overflow: "hidden", color: "#D1D5DB", pointerEvents: "none",
            background: "transparent", whiteSpace: "pre"
          },
          dangerouslySetInnerHTML: { __html: html + "\n" }
        }),
        React.createElement("textarea", {
          ref: taRef,
          value: value,
          spellCheck: false,
          placeholder: placeholder,
          style: { ...STYLES.editor, background: "transparent", color: "transparent", caretColor: "#CBD5E1" },
          onChange: (e) => onChange(e.target.value),
          onScroll: sync
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
              ? React.createElement("div", { style: { ...STYLES.editorWrap, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13 } },
                "← 从左侧文件树选择文件")
              : content.binary
                ? React.createElement("div", { style: { ...STYLES.editorWrap, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: 13 } },
                  "二进制文件(" + (content.size / 1024).toFixed(1) + " KB),不支持文本编辑")
                : React.createElement(CodeEditor, {
                  value: editing,
                  language: langFor(content.rel),
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
    function glassCss(brandColor) {
      const rgb = hexToRgb(brandColor);
      const rgba = (a) => "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + a + ")";
      return '[class*="sidebarCol"] { background: ' + rgba(0.45) + " !important; }\n" +
        '[class*="detailsCol"] { background: rgba(15,23,42,0.35) !important; }\n' +
        '[class*="centerCol"] { background: rgba(8,12,25,0.35) !important; }\n' +
        '[class*="sidebarCol"] [class*="_brand"] { background: ' + rgba(0.6) + " !important; }";
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
      if (bgLayer) {
        // 有背景:玻璃设计(侧边栏品牌蓝玻璃,与 brand 开关无关)
        css.push("html, body { background: " + bgLayer + "; background-color: #0B1220; }");
        css.push(glassCss(brandColor));
      } else if (brand) {
        css.push('[class*="sidebarCol"] { background: ' + sidebarColor + ' !important; }');
        css.push('[class*="sidebarCol"] [class*="_brand"] { background: ' + brandColor + ' !important; }');
        css.push("html, body { background-color: " + mixToward(brandColor, "#000000", 0.35) + "; }");
      }
      injectCSS("deep-harness-appearance-bg", css.join("\n"));

      if (theme) {
        const tokens = {};
        if (bgLayer) tokens["--dsw-alias-bg-base"] = { light: "rgba(8,12,25,0.12)", dark: "rgba(8,12,25,0.12)" };
        if (brand) {
          tokens["--dsw-specific-sidebar-fill"] = {
            light: bgLayer ? withAlpha(sidebarColor, 0.5) : sidebarColor,
            dark: bgLayer ? withAlpha(sidebarColor, 0.55) : sidebarColor
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

    // ── 外观设置(设置 → 通用 → DEEPHARNESS 外观)───────────────────
    function AppearanceSettings() {
      const [brand, setBrand] = React.useState(lsGet("deepharness.brand", "on") !== "off");
      const [brandColor, setBrandColor] = React.useState(lsGet("deepharness.brandColor", BRAND_COLOR));
      const [font, setFont] = React.useState(lsGet("deepharness.font", "default"));
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
              ["deepharness.brand", "deepharness.brandColor", "deepharness.font", "deepharness.background", "deepharness.gradient", "deepharness.customFonts"].forEach(k => {
                try { localStorage.removeItem(k); } catch { /* ignore */ }
              });
              setBrand(true);
              setBrandColor(BRAND_COLOR);
              setFont("default");
              setBg(resolveBackground());
              reload();
              setMsg("✓ 已恢复默认外观(默认背景 默认.jpg + 品牌蓝玻璃)");
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

      // 设置 → 独立区块「DEEPHARNESS 外观」(左侧导航 + 右侧全宽内容区)
      ctx.slots.inject("settings.section", () => slots.register({
        name: "settings.section",
        id: "deepharness-appearance",
        order: 90,
        label: () => "DEEPHARNESS 外观"
      }, AppearanceSettings));

      // 设置面板加宽:DSH 内核把面板固定为 800px,内容区仅约 580px,
      // 导致各设置页拥挤。这里放宽到视口允许的最大宽度。
      injectCSS("deep-harness-appearance-settings",
        '[class*="VOzbGW_panel"] { width: min(1120px, calc(100vw - 48px)) !important; }');

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
