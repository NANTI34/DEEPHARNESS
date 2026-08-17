import * as React from "react";

import { FeishuLogoGlyph } from "../../channel-logos.js";
import { CredentialActionIcon, CredentialBindingPanel, QrActionIcon } from "../../credential-binding.js";
import { h } from "../../i18n.js";
import {
  FEISHU_ENDPOINTS,
  FEISHU_RPC_CHANNEL,
  formatRemaining,
  normalizeBotsSnapshot,
  normalizePollResult,
  normalizeProvisioning,
  presentError,
  unwrapRpcResult,
} from "./api.js";
import { useAnimationFrameScheduler } from "../../lifecycle.js";
import { installFeishuStyles } from "./styles.js";

export const name = "feishu-settings";
export const inject = ["slots", "connection"];

function SvgIcon({ children, size = 18, className, viewBox = "0 0 24 24" }) {
  return h("svg", {
    width: size,
    height: size,
    viewBox,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false",
    className,
  }, children);
}

function ShieldIcon({ size = 18 }) {
  return h(SvgIcon, { size },
    h("path", {
      d: "M12 3 5.5 5.8v5.1c0 4.25 2.72 7.87 6.5 9.1 3.78-1.23 6.5-4.85 6.5-9.1V5.8L12 3Z",
      stroke: "currentColor", strokeWidth: "1.7", strokeLinejoin: "round",
    }),
    h("path", {
      d: "m9.3 11.8 1.7 1.7 3.8-4", stroke: "currentColor",
      strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round",
    }),
  );
}

function RobotIcon({ size = 26 }) {
  return h(SvgIcon, { size },
    h("rect", {
      x: "5", y: "7.5", width: "14", height: "11", rx: "4",
      stroke: "currentColor", strokeWidth: "1.7",
    }),
    h("path", {
      d: "M12 4.5v3M8.7 12h.01M15.3 12h.01M9.2 15.3c1.67 1.08 3.93 1.08 5.6 0M3.5 11.5v3M20.5 11.5v3",
      stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round",
    }),
  );
}

function SparkIcon({ size = 18 }) {
  return h(SvgIcon, { size },
    h("path", {
      d: "M12 2.8c.75 3.67 2.7 5.62 6.4 6.4-3.7.77-5.65 2.72-6.4 6.4-.75-3.68-2.7-5.63-6.4-6.4 3.7-.78 5.65-2.73 6.4-6.4Z",
      stroke: "currentColor", strokeWidth: "1.55", strokeLinejoin: "round",
    }),
    h("path", {
      d: "M5.2 15.8c.35 1.7 1.28 2.63 3 3-1.72.36-2.65 1.29-3 3-.36-1.71-1.29-2.64-3-3 1.71-.37 2.64-1.3 3-3ZM18.7 2.7c.22 1.06.79 1.63 1.85 1.85-1.06.22-1.63.79-1.85 1.85-.22-1.06-.79-1.63-1.85-1.85 1.06-.22 1.63-.79 1.85-1.85Z",
      fill: "currentColor",
    }),
  );
}

function RefreshIcon({ size = 16 }) {
  return h(SvgIcon, { size }, h("path", {
    d: "M19 7.5V4m0 0h-3.5M19 4l-2.1 2.1A7 7 0 1 0 19 13",
    stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round",
    strokeLinejoin: "round",
  }));
}

function ExternalIcon({ size = 15 }) {
  return h(SvgIcon, { size }, h("path", {
    d: "M13 5h6v6M19 5l-8.5 8.5M18 13.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5",
    stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round",
    strokeLinejoin: "round",
  }));
}

function AlertIcon({ size = 22 }) {
  return h(SvgIcon, { size },
    h("path", {
      d: "M12 3.4 21 19H3L12 3.4Z", stroke: "currentColor",
      strokeWidth: "1.7", strokeLinejoin: "round",
    }),
    h("path", {
      d: "M12 9v4.4M12 16.6v.01", stroke: "currentColor",
      strokeWidth: "1.9", strokeLinecap: "round",
    }),
  );
}

function QrIcon({ size = 58 }) {
  return h(SvgIcon, { size }, h("path", {
    d: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v4h-2v-4Zm-4 4h4v2h-4v-2Z",
    fill: "currentColor",
  }));
}

const Button = React.forwardRef(function Button(
  { children, kind = "secondary", size, icon, className = "", ...props },
  ref,
) {
  return h("button", {
    ...props,
    ref,
    type: "button",
    className: `bxf-button ${className}`.trim(),
    "data-kind": kind,
    "data-size": size,
  }, icon, h("span", null, children));
});

function BrandMark() {
  return h("div", { className: "bxf-brandMark" }, h(RobotIcon, { size: 34 }));
}

function Heading({ totals, onAdd, onCredential, credentialOpen, adding, busy, addButtonRef }) {
  const hasBots = totals.configured > 0;
  return h("div", { className: "bxf-heading" },
    h("div", { className: "bxf-headingTools" },
      h("div", { className: "dim-bindActions" },
        h(Button, {
          kind: "primary",
          size: "small",
          className: "bxf-bindButton dim-scanButton",
          onClick: onAdd,
          disabled: adding || busy,
          ref: addButtonRef,
          "aria-busy": busy ? "true" : undefined,
          "aria-label": "扫码接入飞书机器人",
          icon: h(QrActionIcon),
        }, adding ? "正在接入" : "扫码接入机器人"),
        h(Button, {
          kind: "credential",
          size: "small",
          className: "dim-credentialButton",
          onClick: onCredential,
          disabled: adding || busy,
          "aria-pressed": credentialOpen,
          "aria-label": "使用 App ID 和 App Secret 绑定飞书机器人",
          icon: h(CredentialActionIcon),
        }, credentialOpen ? "收起凭据" : "手动接入")),
      hasBots
        ? h("div", {
            className: "bxf-totalBadge dim-onlineBadge",
            "aria-label": `已接入 ${totals.configured} 个机器人，其中 ${totals.connected} 个在线`,
          }, h("span", null, `${totals.connected} / ${totals.configured} 在线`))
        : null,
    ),
  );
}

function LoadingView() {
  return h("div", {
    className: "bxf-card dim-surfaceCard dim-loadingView",
    "aria-busy": "true",
    "aria-label": "正在读取飞书机器人列表",
  },
    h("div", { className: "dim-spinner", "aria-hidden": "true" }),
    h("span", null, "正在读取飞书连接状态…"),
  );
}

function EmptyView({ onStart, busy }) {
  return h("div", { className: "bxf-card dim-surfaceCard" },
    h("div", { className: "bxf-cardBody bxf-intro dim-surfaceBody dim-emptyView" },
      h("div", { className: "bxf-introCopy dim-emptyCopy" },
        h("div", { className: "bxf-stateLabel dim-stateLabel" },
          h("span", { className: "bxf-dot dim-stateDot" }), h("span", null, "尚未接入机器人")),
        h("h3", null, "扫码，创建第一个飞书入口"),
        h("p", null, "无需手动填写 App ID。以后还可以继续添加机器人，分别服务不同团队或飞书租户。"),
        h("div", { className: "bxf-actions dim-viewActions" },
          h(Button, {
            kind: "primary", onClick: onStart,
            disabled: busy, "aria-busy": busy ? "true" : undefined,
          }, busy ? "正在生成二维码…" : "生成飞书二维码")),
      ),
      h("div", { className: "bxf-markStage dim-emptyBrand", "aria-hidden": "true" }, h(BrandMark)),
    ),
  );
}

function safeVerificationHref(value) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function safeQrSource(value) {
  if (!value) return undefined;
  return /^data:image\/(?:png|webp|svg\+xml)(?:;charset=[^;,]+)?;base64,/i.test(value)
    ? value
    : undefined;
}

function QrPane({ provision, now, onRefresh, onCancel, busy }) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const qrSource = safeQrSource(provision.qrCodeDataUrl);
  const href = safeVerificationHref(provision.verificationUrl);
  const remaining = Math.max(0, provision.expiresAt - now);
  const expired = provision.expired === true || remaining === 0;
  const progress = Math.min(1, remaining / Math.max(1, provision.durationMs ?? remaining));

  React.useEffect(() => setImageFailed(false), [qrSource]);

  return h("div", { className: "bxf-card bxf-provisionCard dim-surfaceCard" },
    h("div", { className: "bxf-cardBody bxf-qrLayout dim-surfaceBody dim-qrLayout" },
      h("div", { className: "bxf-qrColumn dim-qrColumn" },
        h("div", { className: "bxf-qrFrame dim-qrFrame" },
          qrSource && !imageFailed
            ? h("img", {
                src: qrSource,
                alt: "用于新增 DeepSeek Harness 飞书机器人的一次性授权二维码",
                onError: () => setImageFailed(true),
              })
            : h("div", { className: "bxf-qrFallback dim-qrFallback" },
                h("div", null, h(QrIcon), h("span", null, "二维码未就绪，请打开授权链接"))),
          expired
            ? h("div", { className: "bxf-expiredOverlay dim-qrExpired", role: "status" },
                h("div", null, "二维码已失效", h("br"), "请刷新后重新扫码"))
            : null,
        ),
        h("div", {
          className: "bxf-countdown dim-countdown",
          "aria-label": expired ? "二维码已失效" : `二维码剩余 ${formatRemaining(remaining)}`,
        },
          h("div", { className: "bxf-countdownTop dim-countdownTop", "aria-hidden": "true" },
            h("span", null, expired ? "等待刷新" : "二维码有效时间"),
            h("strong", null, formatRemaining(remaining))),
          h("div", { className: "bxf-progress dim-progress", "aria-hidden": "true" },
            h("span", { style: { "--bxf-progress": `${Math.round(progress * 100)}%` } })),
        ),
      ),
      h("div", { className: "bxf-qrCopy dim-qrCopy" },
        h("div", { className: "bxf-stateLabel dim-stateLabel" },
          h("span", { className: "bxf-dot dim-stateDot", "data-tone": "warning" }),
          h("span", null, "正在添加新机器人")),
        h("h3", null, expired ? "刷新二维码后继续" : "使用飞书扫码创建机器人"),
        h("p", null, "扫码只会新增一个机器人，已接入的机器人会继续正常收发消息。"),
        h("ol", { className: "bxf-steps dim-steps" },
          h("li", null, "打开飞书移动端，使用扫一扫读取二维码"),
          h("li", null, "核对应用名称与权限范围，并确认创建"),
          h("li", null, "保持本页打开，等待新机器人的长连接就绪")),
        h("div", { className: "bxf-actions dim-viewActions" },
          expired
            ? h(Button, {
                kind: "primary", onClick: onRefresh, disabled: busy,
              }, busy ? "刷新中…" : "刷新二维码")
            : href
              ? h("a", {
                  className: "bxf-button bxf-link", "data-kind": "secondary",
                  href, target: "_blank", rel: "noopener noreferrer",
                }, h("span", null, "在飞书中打开"))
              : null,
          !expired
            ? h(Button, { onClick: onRefresh, disabled: busy }, "换一个二维码")
            : null,
          h(Button, { onClick: onCancel, disabled: busy }, "取消添加")),
      ),
    ),
  );
}

function ProvisionProgress({ phase, onCancel, busy }) {
  const connecting = phase === "connecting";
  return h("div", {
    className: "bxf-card bxf-provisionCard dim-surfaceCard dim-loadingView",
    "aria-busy": "true",
  },
    h("div", { className: "dim-spinner", "aria-hidden": "true" }),
    h("h3", null, connecting ? "已确认，正在连接新机器人" : "正在准备授权二维码"),
    h("p", null, connecting
      ? "正在安全保存凭据并检查新机器人的消息通道，其他机器人不会中断。"
      : "正在向飞书申请一次性授权二维码，请稍候。"),
    connecting
      ? h("div", { className: "bxf-actions dim-viewActions", style: { justifyContent: "center" } },
          h(Button, { onClick: onCancel, disabled: busy }, "取消添加"))
      : null,
  );
}

function ProvisionError({ error, onRetry, onCancel, busy }) {
  return h("div", { className: "bxf-card bxf-provisionCard dim-surfaceCard" },
    h("div", { className: "bxf-inlineError dim-inlineError", role: "alert" },
      h("div", null,
        h("h3", null, "新机器人没有添加完成"),
        h("p", null, error.message),
        error.code ? h("span", { className: "bxf-errorCode" }, error.code) : null,
        h("div", { className: "bxf-actions dim-viewActions" },
          h(Button, { kind: "primary", onClick: onRetry, disabled: busy },
            busy ? "重试中…" : "重新生成二维码"),
          h(Button, { onClick: onCancel, disabled: busy }, "关闭")),
      ),
    ),
  );
}

const HEALTH_LABELS = {
  connected: "运行正常",
  connecting: "正在连接",
  offline: "连接中断",
  error: "需要处理",
};

function formatCheckedTime(timestamp) {
  if (!timestamp) return "尚未检查";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return "刚刚";
  }
}

function RemoveConfirmation({ bot, busy, onConfirm, onCancel }) {
  const cancelRef = React.useRef(null);
  const idPart = bot.botId.replace(/[^a-zA-Z0-9_-]/g, "-");
  const titleId = `bxf-remove-title-${idPart}`;
  const descriptionId = `bxf-remove-description-${idPart}`;

  React.useEffect(() => cancelRef.current?.focus(), []);

  return h("div", {
    className: "bxf-confirm dim-confirm",
    role: "alertdialog",
    "aria-labelledby": titleId,
    "aria-describedby": descriptionId,
    onKeyDown: (event) => {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onCancel();
      }
    },
  },
    h("h4", { id: titleId }, `从 DeepSeek Harness 移除“${bot.bot.name}”？`),
    h("p", { id: descriptionId },
      "此操作会停止这个机器人的连接，并删除保存在本机的接入配置和凭据。飞书开放平台中的应用不会被自动删除，其他机器人也不受影响。"),
    h("div", { className: "bxf-actions dim-viewActions" },
      h(Button, { ref: cancelRef, onClick: onCancel, disabled: busy }, "保留机器人"),
      h(Button, { kind: "danger", onClick: onConfirm, disabled: busy },
        busy ? "正在移除…" : "确认移除接入")),
  );
}

export function BotCard({
  connection,
  busy,
  actionError,
  removing,
  onReconnect,
  onRequestRemove,
  onConfirmRemove,
  onCancelRemove,
  cardRef,
  removeButtonRef,
}) {
  const { bot, health, state, connected } = connection;
  const stateForDisplay = busy === "reconnect"
    ? "connecting"
    : state;
  const tone = stateForDisplay === "connected"
    ? "success"
    : stateForDisplay === "connecting"
      ? "warning"
      : "error";
  const summary = actionError?.message
    ?? connection.error?.message
    ?? (connected ? null : health.summary);
  const titleId = `bxf-bot-${connection.botId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return h("article", {
    className: "bxf-card bxf-botCard dim-botCard",
    "aria-labelledby": titleId,
    "data-bot-id": connection.botId,
    tabIndex: -1,
    ref: cardRef,
  },
    h("div", { className: "bxf-cardBody dim-botCardBody" },
      h("div", { className: "bxf-connectedTop dim-botCardTop" },
        h("div", { className: "bxf-botIdentity dim-botIdentity" },
          h("div", { className: "bxf-avatar dim-botAvatar", "aria-hidden": "true" },
            h(FeishuLogoGlyph, { size: 34 })),
          h("div", { className: "bxf-botName dim-botName" },
            h("h3", { id: titleId, title: bot.name }, bot.name),
            h("p", { title: bot.appIdMasked }, bot.appIdMasked ?? "应用标识已安全保存")),
        ),
        h("div", { className: "bxf-healthPill dim-botHealth", "data-health": stateForDisplay },
          h("span", { className: "bxf-dot dim-healthDot", "data-tone": tone }),
          h("span", null, HEALTH_LABELS[stateForDisplay] ?? "状态未知")),
      ),
      h("dl", { className: "bxf-statusGrid dim-botMetrics" },
        h("div", { className: "bxf-metric dim-botMetric" }, h("dt", null, "消息通道"),
          h("dd", null, connected ? "长连接" : stateForDisplay === "connecting" ? "连接中" : "已断开")),
        h("div", { className: "bxf-metric dim-botMetric" }, h("dt", null, "最近检查"),
          h("dd", null, formatCheckedTime(health.lastCheckedAt))),
      ),
      h("div", { className: "bxf-connectedFooter dim-cardFooter" },
        summary ? h("div", { className: "bxf-healthSummary dim-cardSummary", "data-error": actionError || connection.error ? "true" : undefined },
          summary) : null,
        h("div", { className: "bxf-actions bxf-botActions dim-cardActions" },
          h(Button, {
            className: "dim-cardAction", onClick: onReconnect,
            disabled: Boolean(busy), "aria-busy": busy === "reconnect" ? "true" : undefined,
            "aria-label": `${connected ? "检查连接" : "重试连接"}${bot.name}`,
          }, busy === "reconnect" ? (connected ? "检查中…" : "正在连接…") : connected ? "检查连接" : "重试连接"),
          h(Button, {
            className: "dim-cardAction", kind: "danger", onClick: onRequestRemove,
            disabled: Boolean(busy), ref: removeButtonRef,
            "aria-label": `从 DeepSeek Harness 移除${bot.name}`,
          }, "移除接入")),
      ),
    ),
    removing
      ? h(RemoveConfirmation, {
          bot: connection,
          busy: busy === "delete",
          onConfirm: onConfirmRemove,
          onCancel: onCancelRemove,
        })
      : null,
  );
}

function BotList(props) {
  return h("section", { className: "bxf-listSection dim-listSection", "aria-labelledby": "bxf-bot-list-title" },
    h("div", { className: "bxf-listHeading dim-listHeading" },
      h("h3", { id: "bxf-bot-list-title" }, "已接入的机器人")),
    h("ul", { className: "bxf-botList dim-botList", role: "list" },
      props.bots.map((bot) => h("li", { key: bot.botId },
        h(BotCard, {
          connection: bot,
          busy: props.busyByBot[bot.botId],
          actionError: props.errorsByBot[bot.botId],
          removing: props.removeTargetId === bot.botId,
          onReconnect: () => props.onReconnect(bot),
          onRequestRemove: () => props.onRequestRemove(bot),
          onConfirmRemove: () => props.onConfirmRemove(bot),
          onCancelRemove: props.onCancelRemove,
          cardRef: (node) => props.setCardRef(bot.botId, node),
          removeButtonRef: (node) => props.setRemoveButtonRef(bot.botId, node),
        }),
      ))),
  );
}

function PageError({ error, onRetry, busy }) {
  return h("div", { className: "bxf-card dim-surfaceCard" },
    h("div", { className: "bxf-error dim-inlineError", role: "alert" },
      h("div", null,
        h("h3", null, "无法读取飞书机器人"),
        h("p", null, error.message),
        error.code ? h("span", { className: "bxf-errorCode" }, error.code) : null,
        h("div", { className: "bxf-actions dim-viewActions" },
          h(Button, { kind: "primary", onClick: onRetry, disabled: busy },
            busy ? "重试中…" : "重新读取"))),
    ),
  );
}

const EMPTY_TOTALS = Object.freeze({ configured: 0, connected: 0 });

export function mergeFeishuSnapshotState(
  current,
  snapshot,
  { restoreProvisioning = false, now = Date.now() } = {},
) {
  if (snapshot.revision > 0 && current.revision > snapshot.revision) return current;
  let provisioning = current.provisioning;
  if (!provisioning && restoreProvisioning && snapshot.provisioning) {
    provisioning = {
      phase: snapshot.state === "connecting" ? "connecting" : "qr",
      ...snapshot.provisioning,
      durationMs: Math.max(1, snapshot.provisioning.expiresAt - now),
      expired: snapshot.provisioning.expiresAt <= now,
    };
  }
  return {
    ...current,
    phase: "ready",
    revision: snapshot.revision,
    bots: snapshot.bots,
    totals: snapshot.totals,
    provisioning,
    pageError: null,
    statusError: null,
  };
}

export function FeishuSettingsTab({ rpcCall }) {
  const [model, setModel] = React.useState({
    phase: "loading",
    revision: 0,
    bots: [],
    totals: EMPTY_TOTALS,
    provisioning: null,
    pageError: null,
    statusError: null,
  });
  const [pageBusy, setPageBusy] = React.useState(false);
  const [provisionBusy, setProvisionBusy] = React.useState(false);
  const [credentialOpen, setCredentialOpen] = React.useState(false);
  const [credentialBusy, setCredentialBusy] = React.useState(false);
  const [credentialError, setCredentialError] = React.useState(null);
  const [busyByBot, setBusyByBot] = React.useState({});
  const [errorsByBot, setErrorsByBot] = React.useState({});
  const [removeTargetId, setRemoveTargetId] = React.useState(null);
  const [announcement, setAnnouncement] = React.useState("");
  const [now, setNow] = React.useState(() => Date.now());
  const [focusBotId, setFocusBotId] = React.useState(null);
  const cardRefs = React.useRef(new Map());
  const removeButtonRefs = React.useRef(new Map());
  const addButtonRef = React.useRef(null);
  const scheduleAnimationFrame = useAnimationFrameScheduler();

  const announce = React.useCallback((message) => {
    setAnnouncement("");
    scheduleAnimationFrame(() => {
      if (message) setAnnouncement(message);
    }, "announcement");
  }, [scheduleAnimationFrame]);

  const invoke = React.useCallback(async (endpoint, payload = {}, signal) => {
    return unwrapRpcResult(await rpcCall(endpoint, payload, signal));
  }, [rpcCall]);

  const mergeSnapshot = React.useCallback((snapshot, { restoreProvisioning = false } = {}) => {
    const now = Date.now();
    setModel((current) => mergeFeishuSnapshotState(
      current,
      snapshot,
      { restoreProvisioning, now },
    ));
  }, []);

  const loadStatus = React.useCallback(async ({ signal, silent = false, restoreProvisioning = false } = {}) => {
    if (!silent) setPageBusy(true);
    try {
      const snapshot = normalizeBotsSnapshot(await invoke(FEISHU_ENDPOINTS.status, {}, signal));
      if (signal?.aborted) return undefined;
      mergeSnapshot(snapshot, { restoreProvisioning });
      return snapshot;
    } catch (error) {
      if (signal?.aborted || error?.name === "AbortError") return undefined;
      const presented = presentError(error);
      setModel((current) => current.phase === "loading" || !silent
        ? { ...current, phase: "error", pageError: presented }
        : { ...current, statusError: presented });
      return undefined;
    } finally {
      if (!silent && !signal?.aborted) setPageBusy(false);
    }
  }, [invoke, mergeSnapshot]);

  React.useEffect(() => {
    const controller = new AbortController();
    void loadStatus({ signal: controller.signal, restoreProvisioning: true });
    return () => controller.abort();
  }, [loadStatus]);

  // One list request refreshes every bot. This continues while a new bot is
  // being provisioned so existing connections never disappear from the UI.
  React.useEffect(() => {
    if (model.phase !== "ready") return undefined;
    const controller = new AbortController();
    let inFlight = false;
    const timer = window.setInterval(async () => {
      if (inFlight) return;
      inFlight = true;
      await loadStatus({
        signal: controller.signal,
        silent: true,
        restoreProvisioning: false,
      });
      inFlight = false;
    }, 15_000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadStatus, model.phase]);

  React.useEffect(() => {
    if (!focusBotId) return;
    const node = cardRefs.current.get(focusBotId);
    if (!node) return;
    node.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    node.focus({ preventScroll: true });
    setFocusBotId(null);
  }, [focusBotId, model.bots]);

  const startProvisioning = React.useCallback(async ({ replace = false } = {}) => {
    setCredentialOpen(false);
    setCredentialError(null);
    setProvisionBusy(true);
    announce("");
    const previousAttemptId = model.provisioning?.attemptId;
    setModel((current) => ({
      ...current,
      phase: current.phase === "loading" ? "ready" : current.phase,
      provisioning: { phase: "creating" },
    }));
    try {
      if (replace && previousAttemptId) {
        await invoke(FEISHU_ENDPOINTS.cancelProvisioning, { attemptId: previousAttemptId });
      }
      const provision = normalizeProvisioning(await invoke(
        FEISHU_ENDPOINTS.beginProvisioning,
        { locale: "zh-CN" },
      ));
      const timestamp = Date.now();
      setNow(timestamp);
      setModel((current) => ({
        ...current,
        provisioning: {
          phase: "qr",
          ...provision,
          durationMs: Math.max(1, provision.expiresAt - timestamp),
          expired: false,
        },
      }));
      announce("授权二维码已生成，请使用飞书扫码。");
    } catch (error) {
      setModel((current) => ({
        ...current,
        provisioning: { phase: "error", error: presentError(error) },
      }));
    } finally {
      setProvisionBusy(false);
    }
  }, [announce, invoke, model.provisioning?.attemptId]);

  const bindCredentials = React.useCallback(async ({ identity, secret }) => {
    setCredentialBusy(true);
    setCredentialError(null);
    try {
      const snapshot = normalizeBotsSnapshot(await invoke(
        FEISHU_ENDPOINTS.bindCredentials,
        { appId: identity, appSecret: secret },
      ));
      mergeSnapshot(snapshot);
      setCredentialOpen(false);
      announce("飞书机器人凭据已绑定。");
    } catch (error) {
      setCredentialError(presentError(error));
    } finally {
      setCredentialBusy(false);
    }
  }, [announce, invoke, mergeSnapshot]);

  const cancelProvisioning = React.useCallback(async () => {
    const attemptId = model.provisioning?.attemptId;
    setProvisionBusy(true);
    try {
      if (attemptId) await invoke(FEISHU_ENDPOINTS.cancelProvisioning, { attemptId });
      setModel((current) => ({ ...current, provisioning: null }));
      announce("已取消添加机器人。");
      await loadStatus({ silent: true, restoreProvisioning: false });
      scheduleAnimationFrame(() => addButtonRef.current?.focus(), "focus");
    } catch (error) {
      setModel((current) => ({
        ...current,
        provisioning: { phase: "error", attemptId, error: presentError(error) },
      }));
    } finally {
      setProvisionBusy(false);
    }
  }, [announce, invoke, loadStatus, model.provisioning?.attemptId, scheduleAnimationFrame]);

  const countdownAttemptId = model.provisioning?.attemptId;
  const countdownPhase = model.provisioning?.phase;
  const countdownExpiresAt = model.provisioning?.expiresAt;
  const countdownExpired = model.provisioning?.expired;
  React.useEffect(() => {
    if (!countdownAttemptId || countdownPhase !== "qr" || countdownExpired) return undefined;
    const tick = () => {
      const timestamp = Date.now();
      setNow(timestamp);
      if (timestamp >= countdownExpiresAt) {
        setModel((current) => current.provisioning?.attemptId === countdownAttemptId
          ? { ...current, provisioning: { ...current.provisioning, expired: true } }
          : current);
      }
    };
    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, [countdownAttemptId, countdownPhase, countdownExpiresAt, countdownExpired]);

  React.useEffect(() => {
    const provision = model.provisioning;
    if (!provision
      || !["qr", "connecting"].includes(provision.phase)
      || !provision.attemptId
      || provision.expired) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const result = normalizePollResult(await invoke(
          FEISHU_ENDPOINTS.pollProvisioning,
          { attemptId: provision.attemptId },
          controller.signal,
        ));
        if (result.status === "connected") {
          const snapshot = await loadStatus({ signal: controller.signal, silent: true, restoreProvisioning: false });
          const newBot = snapshot?.bots.find((bot) => bot.botId === result.botId);
          if (!snapshot) {
            throw new Error("机器人已经创建，但暂时无法确认连接状态");
          }
          if (!newBot?.connected) {
            setModel((current) => current.provisioning?.attemptId === provision.attemptId
              ? { ...current, provisioning: { ...current.provisioning, phase: "connecting" } }
              : current);
            return;
          }
          setModel((current) => ({ ...current, provisioning: null }));
          announce(newBot
            ? `${newBot.bot.name}已连接，可以在飞书中开始聊天。`
            : "新飞书机器人已连接，可以开始聊天。");
          if (result.botId) setFocusBotId(result.botId);
          return;
        }
        if (result.status === "failed") {
          const error = new Error(result.message ?? "飞书应用创建失败");
          error.code = "FEISHU_PROVISION_FAILED";
          throw error;
        }
        if (result.status === "expired") {
          setModel((current) => current.provisioning?.attemptId === provision.attemptId
            ? { ...current, provisioning: { ...current.provisioning, phase: "qr", expired: true } }
            : current);
          return;
        }
        setModel((current) => {
          if (current.provisioning?.attemptId !== provision.attemptId) return current;
          const next = result.provisioning ?? current.provisioning;
          return {
            ...current,
            provisioning: {
              ...current.provisioning,
              ...next,
              phase: ["scanned", "connecting"].includes(result.status) ? "connecting" : "qr",
            },
          };
        });
      } catch (error) {
        if (error?.name === "AbortError") return;
        setModel((current) => current.provisioning?.attemptId === provision.attemptId
          ? {
              ...current,
              provisioning: {
                phase: "error",
                attemptId: provision.attemptId,
                error: presentError(error),
              },
            }
          : current);
      }
    }, provision.pollIntervalMs);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [announce, invoke, loadStatus, model.provisioning]);

  const setBotBusy = React.useCallback((botId, value) => {
    setBusyByBot((current) => {
      const next = { ...current };
      if (value) next[botId] = value;
      else delete next[botId];
      return next;
    });
  }, []);

  const setBotError = React.useCallback((botId, error) => {
    setErrorsByBot((current) => {
      const next = { ...current };
      if (error) next[botId] = presentError(error);
      else delete next[botId];
      return next;
    });
  }, []);

  const reconnectOneBot = React.useCallback(async (connection) => {
    const { botId, bot } = connection;
    setBotBusy(botId, "reconnect");
    setBotError(botId, null);
    try {
      const snapshot = normalizeBotsSnapshot(await invoke(FEISHU_ENDPOINTS.reconnectBot, { botId }));
      mergeSnapshot(snapshot);
      const refreshed = snapshot.bots.find((item) => item.botId === botId);
      if (!refreshed?.connected) {
        const error = new Error(
          refreshed?.error?.message ?? refreshed?.health.summary ?? "机器人仍未连接",
        );
        error.code = refreshed?.error?.code ?? "FEISHU_BOT_OFFLINE";
        throw error;
      }
      announce(connection.connected
        ? `${bot.name}连接检查完成。`
        : `${bot.name}已重新连接。`);
    } catch (error) {
      setBotError(botId, error);
      announce(`${bot.name}操作失败，请查看机器人状态。`);
    } finally {
      setBotBusy(botId, null);
    }
  }, [announce, invoke, mergeSnapshot, setBotBusy, setBotError]);

  const requestRemove = React.useCallback((connection) => {
    setRemoveTargetId(connection.botId);
  }, []);

  const cancelRemove = React.useCallback(() => {
    const botId = removeTargetId;
    setRemoveTargetId(null);
    scheduleAnimationFrame(() => removeButtonRefs.current.get(botId)?.focus(), "focus");
  }, [removeTargetId, scheduleAnimationFrame]);

  const confirmRemove = React.useCallback(async (connection) => {
    const { botId, bot } = connection;
    setBotBusy(botId, "delete");
    setBotError(botId, null);
    try {
      await invoke(FEISHU_ENDPOINTS.deleteBot, { botId, confirm: true });
      setRemoveTargetId(null);
      setModel((current) => {
        const bots = current.bots.filter((item) => item.botId !== botId);
        return {
          ...current,
          bots,
          totals: {
            configured: bots.length,
            connected: bots.filter((item) => item.connected).length,
          },
        };
      });
      announce(`${bot.name}已从此 DeepSeek Harness 移除；飞书开放平台中的应用未被删除。`);
      await loadStatus({ silent: true });
      scheduleAnimationFrame(() => addButtonRef.current?.focus(), "focus");
    } catch (error) {
      setBotError(botId, error);
      announce(`${bot.name}移除失败，请重试。`);
    } finally {
      setBotBusy(botId, null);
    }
  }, [announce, invoke, loadStatus, scheduleAnimationFrame, setBotBusy, setBotError]);

  const provision = model.provisioning;
  let provisionContent = null;
  if (provision?.phase === "creating") {
    provisionContent = h(ProvisionProgress, { phase: "creating", busy: provisionBusy });
  } else if (provision?.phase === "qr") {
    provisionContent = h(QrPane, {
      provision, now,
      onRefresh: () => void startProvisioning({ replace: true }),
      onCancel: () => void cancelProvisioning(),
      busy: provisionBusy || model.phase !== "ready",
    });
  } else if (provision?.phase === "connecting") {
    provisionContent = h(ProvisionProgress, {
      phase: "connecting",
      onCancel: () => void cancelProvisioning(),
      busy: provisionBusy,
    });
  } else if (provision?.phase === "error") {
    provisionContent = h(ProvisionError, {
      error: provision.error,
      onRetry: () => void startProvisioning({ replace: Boolean(provision.attemptId) }),
      onCancel: () => void cancelProvisioning(),
      busy: provisionBusy,
    });
  }

  const credentialContent = credentialOpen
    ? h(CredentialBindingPanel, {
        channel: "飞书",
        identityLabel: "App ID",
        identityPlaceholder: "填写飞书开放平台 App ID",
        secretLabel: "App Secret",
        secretPlaceholder: "填写飞书开放平台 App Secret",
        busy: credentialBusy,
        error: credentialError,
        onSubmit: bindCredentials,
        onCancel: () => { setCredentialOpen(false); setCredentialError(null); },
      })
    : null;

  const setCardRef = React.useCallback((botId, node) => {
    if (node) cardRefs.current.set(botId, node);
    else cardRefs.current.delete(botId);
  }, []);
  const setRemoveButtonRef = React.useCallback((botId, node) => {
    if (node) removeButtonRefs.current.set(botId, node);
    else removeButtonRefs.current.delete(botId);
  }, []);

  return h("section", { className: "bxf-page dim-channelPage", "aria-label": "飞书机器人设置" },
    h(Heading, {
      totals: model.totals,
      onAdd: () => void startProvisioning(),
      onCredential: () => { setCredentialOpen((value) => !value); setCredentialError(null); },
      credentialOpen,
      adding: Boolean(provision),
      busy: provisionBusy || credentialBusy,
      addButtonRef,
    }),
    h("div", {
      className: "bxf-visuallyHidden", role: "status", "aria-live": "polite", "aria-atomic": "true",
    }, announcement),
    model.statusError
      ? h("div", { className: "bxf-statusNotice dim-statusNotice", role: "status" },
          h(AlertIcon, { size: 16 }),
          h("span", null, `状态自动刷新失败：${model.statusError.message}`),
          h(Button, { size: "small", onClick: () => void loadStatus({ silent: true }), disabled: pageBusy }, "立即重试"))
      : null,
    model.phase === "loading"
      ? h(LoadingView)
      : model.phase === "error"
        ? h(PageError, {
            error: model.pageError ?? { message: "无法读取连接状态" },
            onRetry: () => void loadStatus(),
            busy: pageBusy,
          })
        : h(React.Fragment, null,
            credentialContent,
            provisionContent,
            model.bots.length === 0 && !provision && !credentialOpen
              ? h(EmptyView, { onStart: () => void startProvisioning(), busy: provisionBusy })
              : null,
            model.bots.length > 0
              ? h(BotList, {
                  bots: model.bots,
                  busyByBot,
                  errorsByBot,
                  removeTargetId,
                  onReconnect: (bot) => void reconnectOneBot(bot),
                  onRequestRemove: requestRemove,
                  onConfirmRemove: (bot) => void confirmRemove(bot),
                  onCancelRemove: cancelRemove,
                  setCardRef,
                  setRemoveButtonRef,
                })
              : null,
          ),
  );
}

export function apply(ctx) {
  ctx.effect(
    () => installFeishuStyles(),
    "feishu-settings: install client styles",
  );

  const rpcCall = (endpoint, payload, signal) =>
    ctx.connection.rpc.call(FEISHU_RPC_CHANNEL, endpoint, payload, signal);

  ctx.slots.inject("settings.plugins.tab", () =>
    ctx.slots.register(
      {
        name: "settings.plugins.tab",
        id: "feishu",
        order: 20,
        label: "飞书",
        inject: () => ({ rpcCall }),
      },
      FeishuSettingsTab,
    ),
  );
}
