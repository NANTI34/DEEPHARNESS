window.__ModuleLoader__.load({
  id: "@xmanrui/dsh-im",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// plugin-src/client/index.js
var index_exports = {};
__export(index_exports, {
  IMSettingsTab: () => IMSettingsTab,
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);
var React13 = __toESM(require("react"), 1);

// plugin-src/client/channel-logos.js
var React = __toESM(require("react"), 1);
var h = React.createElement;
function dimensions(size) {
  return size === void 0 ? {} : { width: size, height: size };
}
function WeixinLogoGlyph({ size } = {}) {
  return h("svg", {
    ...dimensions(size),
    viewBox: "0 0 24 24",
    focusable: "false",
    "aria-hidden": "true",
    "data-im-channel-logo": "weixin"
  }, h("path", {
    fill: "currentColor",
    d: "M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"
  }));
}
function FeishuLogoGlyph({ size } = {}) {
  return h(
    "svg",
    {
      ...dimensions(size),
      viewBox: "0 0 24 24",
      focusable: "false",
      "aria-hidden": "true",
      "data-im-channel-logo": "feishu"
    },
    h("path", { fill: "#00D6B9", d: "M7.2 4.5h7.6c1.2 0 2.1.55 2.7 1.58 1.05 1.8 1.55 3.45 1.58 4.95-2.04-.62-4.2-.15-6.22 1.45C11.3 9.7 9.42 7.04 7.2 4.5Z" }),
    h("path", { fill: "#1456B8", d: "M10.8 13.55c3.3-2.93 5.72-4.24 9.47-2.52-1.2 1.45-2.27 4.18-3.86 5.43-1.67 1.31-3.9.5-5.61-.64v-2.27Z" }),
    h("path", { fill: "#3370FF", d: "M4.4 8.35c3.47 3.61 7.25 6.1 10.33 5.7 1.06-.14 2.2-.72 3.4-1.72-1.04 2.65-2.6 4.8-5.06 6-2.46 1.2-5.56.52-7.42-.72A2.76 2.76 0 0 1 4.4 15.3V8.35Z" })
  );
}
function DingtalkLogoGlyph({ size } = {}) {
  return h("svg", {
    ...dimensions(size),
    viewBox: "0 0 48 48",
    focusable: "false",
    "aria-hidden": "true",
    "data-im-channel-logo": "dingtalk"
  }, h("path", {
    fill: "currentColor",
    d: "M37.05 22.783c-6.758-5.216-14.378-12.128-22.73-19.538-.655-.585-1.242-.354-1.536.42-1.88 4.973-.058 9.386 2.889 11.932s7.368 4.912 10.058 6.155c.105.049.013.203-.093.163-4.953-2.182-8.397-3.765-13.07-7.368-.497-.388-1.01-.242-1.07.521-.384 4.748 2.657 8.483 6.058 9.745 2.1.781 4.398 1.212 6.53 1.474.109.015.084.178-.027.178-2.747.01-6.058-.654-8.935-1.751-.606-.233-.818.25-.722.633.491 2.008 2.974 5.076 6.926 5.73a12 12 0 0 0 2.228.115c.164 0 .208.089.154.217q-2.685 4.6-2.803 4.797c-.091.152-.036.275.156.275h3.543c.164 0 .264.106.18.246l-4.958 8.196c-.191.328.035.565.395.301s15.212-11.133 15.636-11.448c.195-.142.148-.327-.124-.327h-3.18c-.206 0-.252-.14-.111-.28.14-.141 3.602-3.594 4.837-4.888 1.283-1.35 1.938-3.825-.231-5.498"
  }));
}
function QqLogoGlyph({ size } = {}) {
  return h("svg", {
    ...dimensions(size),
    viewBox: "0 0 24 24",
    focusable: "false",
    "aria-hidden": "true",
    "data-im-channel-logo": "qq"
  }, h("path", {
    fill: "currentColor",
    d: "M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"
  }));
}
function WecomLogoGlyph({ size } = {}) {
  return h(
    "svg",
    {
      ...dimensions(size),
      viewBox: "0 0 24 24",
      focusable: "false",
      "aria-hidden": "true",
      "data-im-channel-logo": "wecom"
    },
    h("path", {
      fill: "none",
      stroke: "#3370FF",
      strokeWidth: "2.35",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M17.7 14.5c1.05-1.12 1.65-2.52 1.65-4.03 0-3.82-3.58-6.92-8-6.92s-8 3.1-8 6.92 3.58 6.92 8 6.92c1.17 0 2.28-.22 3.28-.62"
    }),
    h("path", { fill: "#07C160", d: "M16.1 15.15c.7-.7 1.83-.7 2.53 0s.7 1.83 0 2.53-1.83.7-2.53 0-.7-1.83 0-2.53Z" }),
    h("path", { fill: "#FFB800", d: "M19.25 13.45a1.36 1.36 0 1 1 1.92 1.92 1.36 1.36 0 0 1-1.92-1.92Z" }),
    h("path", { fill: "#FF7A00", d: "M19.55 18.05a1.16 1.16 0 1 1 1.64 1.64 1.16 1.16 0 0 1-1.64-1.64Z" }),
    h("path", { fill: "#3370FF", d: "M15.25 18.75a.92.92 0 1 1 1.3 1.3.92.92 0 0 1-1.3-1.3Z" })
  );
}
function TelegramLogoGlyph({ size } = {}) {
  return h("svg", {
    ...dimensions(size),
    viewBox: "0 0 24 24",
    focusable: "false",
    "aria-hidden": "true",
    "data-im-channel-logo": "telegram"
  }, h("path", {
    fill: "currentColor",
    d: "M23.95 4.57c-.36-1.45-1.43-1.76-2.82-1.24L1.5 10.9c-1.34.52-1.32 1.27-.24 1.6l5.03 1.57 11.66-7.36c.55-.34 1.05-.16.64.21l-9.44 8.52-.37 5.12c.54 0 .78-.24 1.08-.53l2.59-2.51 5.38 3.97c.99.55 1.7.27 1.95-.92L23.95 4.57Z"
  }));
}
function DiscordLogoGlyph({ size } = {}) {
  return h("svg", {
    ...dimensions(size),
    viewBox: "0 0 24 24",
    focusable: "false",
    "aria-hidden": "true",
    "data-im-channel-logo": "discord"
  }, h("path", {
    fill: "currentColor",
    d: "M20.32 4.37a19.8 19.8 0 0 0-4.89-1.51c-.21.38-.46.89-.63 1.29a18.4 18.4 0 0 0-5.59 0 13 13 0 0 0-.64-1.29c-1.71.29-3.36.8-4.89 1.52C.59 9.09-.25 13.68.17 18.2a19.9 19.9 0 0 0 6 3.04c.48-.66.91-1.36 1.28-2.1-.7-.26-1.37-.58-2-.96.17-.12.33-.25.49-.38 3.86 1.79 8.04 1.79 11.86 0 .16.13.32.26.49.38-.64.38-1.31.7-2.01.97.37.73.8 1.44 1.28 2.09a19.8 19.8 0 0 0 6-3.04c.49-5.24-.84-9.79-3.24-13.83ZM8.02 15.42c-1.16 0-2.11-1.07-2.11-2.38s.93-2.38 2.11-2.38c1.18 0 2.13 1.08 2.11 2.38 0 1.31-.93 2.38-2.11 2.38Zm7.95 0c-1.16 0-2.11-1.07-2.11-2.38s.93-2.38 2.11-2.38c1.18 0 2.13 1.08 2.11 2.38 0 1.31-.93 2.38-2.11 2.38Z"
  }));
}
function SlackLogoGlyph({ size } = {}) {
  return h("svg", {
    ...dimensions(size),
    viewBox: "0 0 24 24",
    focusable: "false",
    "aria-hidden": "true",
    "data-im-channel-logo": "slack"
  }, h("path", {
    fill: "currentColor",
    d: "M6 15a2 2 0 1 1-2-2h2v2Zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5Zm2-8a2 2 0 1 1 2-2v2H9Zm0 1a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4h5Zm8 2a2 2 0 1 1 2 2h-2v-2Zm-1 0a2 2 0 1 1-4 0V5a2 2 0 1 1 4 0v5Zm-2 8a2 2 0 1 1-2 2v-2h2Zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5Z"
  }));
}
function WhatsappLogoGlyph({ size } = {}) {
  return h("svg", {
    ...dimensions(size),
    viewBox: "0 0 24 24",
    focusable: "false",
    "aria-hidden": "true",
    "data-im-channel-logo": "whatsapp"
  }, h("path", {
    fill: "currentColor",
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.83 9.83 0 0 1 2.893 6.991c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.8 11.8 0 0 0 12.055 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.688 1.448h.005c6.557 0 11.892-5.335 11.895-11.893a11.82 11.82 0 0 0-3.486-8.413"
  }));
}

// plugin-src/client/channels/dingtalk/api.js
var DINGTALK_RPC_CHANNEL = "/dingtalk";
var DINGTALK_ENDPOINTS = Object.freeze({
  status: "connection.status",
  beginProvisioning: "provision.begin",
  pollProvisioning: "provision.poll",
  cancelProvisioning: "provision.cancel",
  bindCredentials: "bot.bind-credentials",
  reconnectBot: "bot.reconnect",
  deleteBot: "bot.delete"
});
var ACCOUNT_STATES = /* @__PURE__ */ new Set(["connected", "connecting", "offline", "error"]);
var SNAPSHOT_STATES = /* @__PURE__ */ new Set(["disconnected", "offline", "provisioning", "connected", "degraded"]);
var PROVISION_STATES = /* @__PURE__ */ new Set([
  "starting",
  "pending",
  "scanned",
  "authorizing",
  "creating",
  "connecting",
  "connected",
  "expired",
  "failed",
  "cancelled"
]);
var HEALTH_STATES = /* @__PURE__ */ new Set(["healthy", "checking", "degraded", "offline"]);
var FORBIDDEN_ERROR_FIELDS = /(client[_-]?secret|secret[_-]?ref|device[_-]?code|app[_-]?secret|access[_-]?token|token)/i;
var QR_DATA_URL = /^data:image\/(?:png|webp);base64,[a-z\d+/]+={0,2}$/i;
var MAX_QR_SOURCE_LENGTH = 2 * 1024 * 1024;
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function optionalString(value, maxLength = 240) {
  if (typeof value !== "string") return void 0;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : void 0;
}
function opaqueId(value) {
  const id5 = optionalString(value, 128);
  return id5 && /^[a-z\d_-]+$/i.test(id5) ? id5 : void 0;
}
function timestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? void 0 : parsed;
  }
  return void 0;
}
function nonNegativeInteger(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : 0;
}
function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}
function safeErrorCode(value, fallback) {
  const code = optionalString(value, 80);
  return code && /^[a-z][a-z\d_.:-]*$/i.test(code) && !FORBIDDEN_ERROR_FIELDS.test(code) ? code : fallback;
}
function sanitizeMessage(value, fallback) {
  const message = optionalString(value, 480) ?? fallback;
  if (FORBIDDEN_ERROR_FIELDS.test(message)) return fallback;
  return message.replace(/([=:]\s*)[^\s,;，。]+/g, "$1\u2022\u2022\u2022\u2022\u2022\u2022").slice(0, 240);
}
function normalizeError(value, fallbackCode, fallbackMessage) {
  if (!isRecord(value)) return void 0;
  return {
    code: safeErrorCode(value.code, fallbackCode),
    message: sanitizeMessage(value.message, fallbackMessage)
  };
}
function unwrapRpcResult(result) {
  if (!isRecord(result) || typeof result.ok !== "boolean") {
    throw new Error("\u9489\u9489\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94");
  }
  if (!result.ok) {
    const error = new Error(sanitizeMessage(result.error?.message, "\u9489\u9489\u64CD\u4F5C\u5931\u8D25"));
    error.code = safeErrorCode(result.error?.code, "DINGTALK_RPC_ERROR");
    throw error;
  }
  return result.value;
}
function safeQrSource(value) {
  if (typeof value !== "string" || value.length > MAX_QR_SOURCE_LENGTH) return void 0;
  return QR_DATA_URL.test(value) ? value : void 0;
}
function normalizeProvisioning(value, now = Date.now()) {
  const source = isRecord(value?.provisioning) ? value.provisioning : value;
  if (!isRecord(source)) throw new Error("\u9489\u9489\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u7ED1\u5B9A\u8FDB\u5EA6");
  const attemptId = opaqueId(source.attemptId);
  if (!attemptId) throw new Error("\u9489\u9489\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1");
  const reportedStatus = optionalString(source.status, 32) ?? optionalString(source.state, 32);
  const status = PROVISION_STATES.has(reportedStatus) ? reportedStatus : "failed";
  const expiresAt = timestamp(source.expiresAt) ?? now + clamp(source.expiresIn, 1, 2 * 60 * 60, 10 * 60) * 1e3;
  const result = {
    attemptId,
    status,
    expiresAt,
    pollIntervalMs: clamp(source.pollIntervalMs, 1e3, 1e4, 3e3)
  };
  const qrCodeDataUrl = safeQrSource(source.qrCodeDataUrl);
  if (qrCodeDataUrl) result.qrCodeDataUrl = qrCodeDataUrl;
  if (opaqueId(source.botId)) result.botId = opaqueId(source.botId);
  if (source.alreadyConnected === true) result.alreadyConnected = true;
  const error = normalizeError(
    source.error,
    "DINGTALK_PROVISION_FAILED",
    "\u9489\u9489\u673A\u5668\u4EBA\u6CA1\u6709\u63A5\u5165\u5B8C\u6210"
  );
  if (error) result.error = error;
  return result;
}
function normalizeBot(value) {
  if (!isRecord(value)) return void 0;
  const botId = opaqueId(value.botId);
  if (!botId) return void 0;
  const bot = isRecord(value.bot) ? value.bot : {};
  const connected = value.connected === true;
  const reportedState = ACCOUNT_STATES.has(value.state) ? value.state : "offline";
  const state = connected ? "connected" : reportedState === "connected" ? "connecting" : reportedState;
  const health = isRecord(value.health) ? value.health : {};
  const stats = isRecord(value.stats) ? value.stats : {};
  return {
    botId,
    state,
    connected,
    configured: value.configured !== false,
    bot: {
      name: optionalString(bot.name, 100) ?? "\u9489\u9489\u673A\u5668\u4EBA",
      clientIdMasked: optionalString(bot.clientIdMasked, 140) ?? "\u5DF2\u5B89\u5168\u4FDD\u5B58"
    },
    health: {
      status: HEALTH_STATES.has(health.status) ? health.status : connected ? "healthy" : "offline",
      summary: optionalString(health.summary, 200) ?? (connected ? "\u9489\u9489 Stream \u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38" : "\u9489\u9489\u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA"),
      lastCheckedAt: timestamp(health.lastCheckedAt),
      lastConnectedAt: timestamp(health.lastConnectedAt)
    },
    stats: {
      messagesReceived: nonNegativeInteger(stats.messagesReceived),
      messagesReplied: nonNegativeInteger(stats.messagesReplied)
    },
    error: normalizeError(value.error, "DINGTALK_ACCOUNT_ERROR", "\u9489\u9489\u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA") ?? null
  };
}
function normalizeSnapshot(value) {
  const source = isRecord(value?.snapshot) ? value.snapshot : value;
  if (!isRecord(source) || !Array.isArray(source.bots)) {
    throw new Error("\u9489\u9489\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868");
  }
  const seen = /* @__PURE__ */ new Set();
  const bots = source.bots.map(normalizeBot).filter((bot) => {
    if (!bot || seen.has(bot.botId)) return false;
    seen.add(bot.botId);
    return true;
  });
  return {
    schemaVersion: Number.isSafeInteger(source.schemaVersion) ? source.schemaVersion : 1,
    revision: nonNegativeInteger(source.revision),
    state: SNAPSHOT_STATES.has(source.state) ? source.state : "offline",
    bots,
    totals: {
      configured: bots.length,
      connected: bots.filter((bot) => bot.connected).length
    },
    provisioning: source.provisioning ? normalizeProvisioning(source.provisioning) : null
  };
}
function presentError(error) {
  return {
    code: safeErrorCode(error?.code, "DINGTALK_ERROR"),
    message: sanitizeMessage(error?.message, "\u9489\u9489\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5")
  };
}
function formatRemaining(milliseconds) {
  const seconds = Math.max(0, Math.ceil(Number(milliseconds) / 1e3) || 0);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

// plugin-src/client/channels/dingtalk/index.js
var React4 = __toESM(require("react"), 1);

// plugin-src/client/credential-binding.js
var React3 = __toESM(require("react"), 1);

// plugin-src/client/i18n.js
var React2 = __toESM(require("react"), 1);
var IM_LOCALE_NAMESPACE = "dsh-im";
var EN = Object.freeze({
  "$locale": "en",
  "IM\u673A\u5668\u4EBA": "IM bots",
  "IM\u673A\u5668\u4EBA\u8BBE\u7F6E": "IM bot settings",
  "IM \u6E20\u9053": "IM channels",
  "\u8BA9\u804A\u5929\u673A\u5668\u4EBA\u8F7B\u677E\u63A5\u5165 DeepSeek Harness": "Connect IM bots to DeepSeek Harness with ease",
  "\u5E2E\u52A9\u4E0E\u53CD\u9988 \xB7 \u524D\u5F80 GitHub": "Help & feedback \xB7 Open GitHub",
  "\u5FAE\u4FE1": "WeChat",
  "\u98DE\u4E66": "Feishu",
  "\u9489\u9489": "DingTalk",
  "\u4F01\u4E1A\u5FAE\u4FE1": "WeCom",
  "\u5FAE\u4FE1\u673A\u5668\u4EBA": "WeChat bot",
  "\u98DE\u4E66\u673A\u5668\u4EBA": "Feishu bot",
  "\u9489\u9489\u673A\u5668\u4EBA": "DingTalk bot",
  "\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA": "WeCom bot",
  "QQ\u673A\u5668\u4EBA": "QQ bot",
  "WhatsApp\u673A\u5668\u4EBA": "WhatsApp bot",
  "WhatsApp\u8D26\u53F7": "WhatsApp account",
  "\u5FAE\u4FE1\u8BBE\u7F6E": "WeChat settings",
  "\u98DE\u4E66\u673A\u5668\u4EBA\u8BBE\u7F6E": "Feishu bot settings",
  "\u9489\u9489\u8BBE\u7F6E": "DingTalk settings",
  "\u4F01\u4E1A\u5FAE\u4FE1\u8BBE\u7F6E": "WeCom settings",
  "\u626B\u7801\u63A5\u5165\u673A\u5668\u4EBA": "Scan QR code",
  "\u6B63\u5728\u63A5\u5165": "Connecting",
  "\u624B\u52A8\u63A5\u5165": "Manual setup",
  "\u6536\u8D77\u51ED\u636E": "Hide credentials",
  "\u6536\u8D77\u63A5\u5165": "Hide setup",
  "\u63A5\u5165\u673A\u5668\u4EBA": "Connect bot",
  "\u5F00\u59CB\u63A5\u5165": "Start setup",
  "\u5728\u7EBF": "online",
  "\u8FD0\u884C\u6B63\u5E38": "Connected",
  "\u6B63\u5728\u8FDE\u63A5": "Connecting",
  "\u6B63\u5728\u8FDE\u63A5\u2026": "Connecting\u2026",
  "\u8FDE\u63A5\u672A\u5C31\u7EEA": "Not connected",
  "\u8FDE\u63A5\u4E2D": "Connecting",
  "\u8FDE\u63A5\u4E2D\u65AD": "Disconnected",
  "\u9700\u8981\u5904\u7406": "Needs attention",
  "\u72B6\u6001\u672A\u77E5": "Unknown status",
  "\u79BB\u7EBF": "Offline",
  "\u5DF2\u65AD\u5F00": "Disconnected",
  "\u6D88\u606F\u901A\u9053": "Message channel",
  "\u6700\u8FD1\u68C0\u67E5": "Last checked",
  "\u5C1A\u672A\u68C0\u67E5": "Not checked yet",
  "\u521A\u521A": "Just now",
  "\u68C0\u67E5\u8FDE\u63A5": "Check connection",
  "\u68C0\u67E5\u4E2D\u2026": "Checking\u2026",
  "\u91CD\u8BD5\u8FDE\u63A5": "Reconnect",
  "\u91CD\u8BD5\u4E2D\u2026": "Retrying\u2026",
  "\u79FB\u9664\u63A5\u5165": "Remove connection",
  "\u786E\u8BA4\u79FB\u9664\u63A5\u5165": "Remove connection",
  "\u786E\u8BA4\u79FB\u9664": "Remove",
  "\u6B63\u5728\u79FB\u9664\u2026": "Removing\u2026",
  "\u4FDD\u7559\u673A\u5668\u4EBA": "Keep bot",
  "\u4FDD\u7559\u8D26\u53F7": "Keep account",
  "\u53D6\u6D88": "Cancel",
  "\u5173\u95ED": "Close",
  "\u7ACB\u5373\u91CD\u8BD5": "Retry now",
  "\u91CD\u65B0\u8BFB\u53D6": "Reload",
  "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801": "Generate a new QR code",
  "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801\u540E\u7EE7\u7EED": "Generate a new QR code",
  "\u5237\u65B0\u4E8C\u7EF4\u7801": "Refresh QR code",
  "\u5237\u65B0\u4E2D\u2026": "Refreshing\u2026",
  "\u6362\u4E00\u4E2A\u4E8C\u7EF4\u7801": "Get another QR code",
  "\u7EE7\u7EED\u8FDE\u63A5": "Continue connecting",
  "\u7ED1\u5B9A\u5E76\u8FDE\u63A5": "Connect",
  "\u6B63\u5728\u7ED1\u5B9A\u2026": "Connecting\u2026",
  "\u9A8C\u8BC1\u5E76\u8FDE\u63A5": "Verify and connect",
  "\u6B63\u5728\u9A8C\u8BC1\u5E76\u8FDE\u63A5\u2026": "Verifying and connecting\u2026",
  "\u6B63\u5728\u9A8C\u8BC1\u2026": "Verifying\u2026",
  "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5": "The operation failed. Try again later.",
  "\u8BF7\u7A0D\u540E\u91CD\u8BD5": "Try again later.",
  "\u5F53\u524D\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4": "QR code expires in",
  "\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4": "QR code expires in",
  "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F": "QR code expired",
  "\u4E8C\u7EF4\u7801\u5DF2\u5931\u6548": "QR code expired",
  "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\n\u8BF7\u91CD\u65B0\u751F\u6210": "QR code expired\nGenerate a new one",
  "\u4E8C\u7EF4\u7801\u56FE\u7247\u6B63\u5728\u751F\u6210\u2026": "Generating QR code\u2026",
  "\u4E8C\u7EF4\u7801\u6B63\u5728\u751F\u6210\u2026": "Generating QR code\u2026",
  "\u4E8C\u7EF4\u7801\u6B63\u5728\u81EA\u52A8\u5237\u65B0\u2026": "Refreshing QR code\u2026",
  "\u4E8C\u7EF4\u7801\u672A\u5C31\u7EEA\uFF0C\u8BF7\u6253\u5F00\u6388\u6743\u94FE\u63A5": "The QR code is not ready. Open the authorization link.",
  "\u4E8C\u7EF4\u7801\u56FE\u7247\u672A\u5C31\u7EEA\uFF0C\u8BF7\u4F7F\u7528\u5907\u7528\u94FE\u63A5\u3002": "The QR code is not ready. Use the alternate link.",
  "\u4E8C\u7EF4\u7801\u56FE\u7247\u672A\u5C31\u7EEA\uFF0C\u8BF7\u91CD\u65B0\u751F\u6210\u3002": "The QR code is not ready. Generate a new one.",
  "\u7B49\u5F85\u5237\u65B0": "Waiting to refresh",
  "\u6B63\u5728\u5237\u65B0\u4E8C\u7EF4\u7801": "Refreshing QR code",
  "\u6253\u5F00\u5907\u7528\u94FE\u63A5": "Open alternate link",
  "\u751F\u6210\u4E8C\u7EF4\u7801": "Generate QR code",
  "\u751F\u6210\u5FAE\u4FE1\u4E8C\u7EF4\u7801": "Generate WeChat QR code",
  "\u751F\u6210\u98DE\u4E66\u4E8C\u7EF4\u7801": "Generate Feishu QR code",
  "\u751F\u6210\u9489\u9489\u4E8C\u7EF4\u7801": "Generate DingTalk QR code",
  "\u751F\u6210\u4F01\u4E1A\u5FAE\u4FE1\u4E8C\u7EF4\u7801": "Generate WeCom QR code",
  "\u751F\u6210 QQ \u4E8C\u7EF4\u7801": "Generate QQ QR code",
  "\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026": "Generating QR code\u2026",
  "\u6B63\u5728\u51C6\u5907\u6388\u6743\u4E8C\u7EF4\u7801": "Preparing authorization QR code",
  "\u6B63\u5728\u51C6\u5907\u5FAE\u4FE1\u4E8C\u7EF4\u7801": "Preparing WeChat QR code",
  "\u6B63\u5728\u6DFB\u52A0\u65B0\u673A\u5668\u4EBA": "Adding a new bot",
  "\u6B63\u5728\u7533\u8BF7\u9489\u9489\u6388\u6743\u4E8C\u7EF4\u7801\u2026": "Requesting DingTalk authorization QR code\u2026",
  "\u6B63\u5728\u7533\u8BF7\u4F01\u4E1A\u5FAE\u4FE1\u4E8C\u7EF4\u7801\u2026": "Requesting WeCom QR code\u2026",
  "\u6B63\u5728\u7533\u8BF7 QQ \u4E8C\u7EF4\u7801\u2026": "Requesting QQ QR code\u2026",
  "\u6B63\u5728\u751F\u6210 WhatsApp \u4E8C\u7EF4\u7801": "Generating WhatsApp QR code",
  "\u626B\u7801\uFF0C\u521B\u5EFA\u7B2C\u4E00\u4E2A\u98DE\u4E66\u5165\u53E3": "Scan to create your first Feishu bot",
  "\u626B\u7801\u53EA\u4F1A\u65B0\u589E\u4E00\u4E2A\u673A\u5668\u4EBA\uFF0C\u5DF2\u63A5\u5165\u7684\u673A\u5668\u4EBA\u4F1A\u7EE7\u7EED\u6B63\u5E38\u6536\u53D1\u6D88\u606F\u3002": "Scanning adds one bot. Existing bots will continue to send and receive messages.",
  "\u65E0\u9700\u624B\u52A8\u586B\u5199 App ID\u3002\u4EE5\u540E\u8FD8\u53EF\u4EE5\u7EE7\u7EED\u6DFB\u52A0\u673A\u5668\u4EBA\uFF0C\u5206\u522B\u670D\u52A1\u4E0D\u540C\u56E2\u961F\u6216\u98DE\u4E66\u79DF\u6237\u3002": "No App ID is required. You can add more bots later for different teams or Feishu tenants.",
  "\u4F7F\u7528\u98DE\u4E66\u626B\u7801\u521B\u5EFA\u673A\u5668\u4EBA": "Scan with Feishu to create a bot",
  "\u5237\u65B0\u4E8C\u7EF4\u7801\u540E\u7EE7\u7EED": "Refresh the QR code to continue",
  "\u6253\u5F00\u98DE\u4E66\u79FB\u52A8\u7AEF\uFF0C\u4F7F\u7528\u626B\u4E00\u626B\u8BFB\u53D6\u4E8C\u7EF4\u7801": "Open Feishu on your phone and scan the QR code",
  "\u6838\u5BF9\u5E94\u7528\u540D\u79F0\u4E0E\u6743\u9650\u8303\u56F4\uFF0C\u5E76\u786E\u8BA4\u521B\u5EFA": "Review the app name and permissions, then confirm",
  "\u4FDD\u6301\u672C\u9875\u6253\u5F00\uFF0C\u7B49\u5F85\u65B0\u673A\u5668\u4EBA\u7684\u957F\u8FDE\u63A5\u5C31\u7EEA": "Keep this page open until the bot connection is ready",
  "\u5728\u98DE\u4E66\u4E2D\u6253\u5F00": "Open in Feishu",
  "\u53D6\u6D88\u6DFB\u52A0": "Cancel",
  "\u5DF2\u786E\u8BA4\uFF0C\u6B63\u5728\u8FDE\u63A5\u65B0\u673A\u5668\u4EBA": "Confirmed. Connecting the new bot",
  "\u6B63\u5728\u5B89\u5168\u4FDD\u5B58\u51ED\u636E\u5E76\u68C0\u67E5\u65B0\u673A\u5668\u4EBA\u7684\u6D88\u606F\u901A\u9053\uFF0C\u5176\u4ED6\u673A\u5668\u4EBA\u4E0D\u4F1A\u4E2D\u65AD\u3002": "Saving credentials and checking the new bot connection. Existing bots will not be interrupted.",
  "\u6B63\u5728\u5411\u98DE\u4E66\u7533\u8BF7\u4E00\u6B21\u6027\u6388\u6743\u4E8C\u7EF4\u7801\uFF0C\u8BF7\u7A0D\u5019\u3002": "Requesting a one-time authorization QR code from Feishu\u2026",
  "\u65B0\u673A\u5668\u4EBA\u6CA1\u6709\u6DFB\u52A0\u5B8C\u6210": "The new bot was not added",
  "\u65B0\u98DE\u4E66\u673A\u5668\u4EBA\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5F00\u59CB\u804A\u5929\u3002": "The new Feishu bot is connected and ready to chat.",
  "\u98DE\u4E66\u5E94\u7528\u521B\u5EFA\u5931\u8D25": "Could not create the Feishu app",
  "\u673A\u5668\u4EBA\u5DF2\u7ECF\u521B\u5EFA\uFF0C\u4F46\u6682\u65F6\u65E0\u6CD5\u786E\u8BA4\u8FDE\u63A5\u72B6\u6001": "The bot was created, but its connection could not be confirmed yet",
  "\u673A\u5668\u4EBA\u4ECD\u672A\u8FDE\u63A5": "The bot is still offline",
  "\u673A\u5668\u4EBA\u5C1A\u672A\u8FDE\u63A5": "The bot is not connected yet",
  "\u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38": "Persistent connection is healthy",
  "\u957F\u8FDE\u63A5": "Persistent connection",
  "\u5E94\u7528\u6807\u8BC6\u5DF2\u5B89\u5168\u4FDD\u5B58": "App identifier stored securely",
  "\u673A\u5668\u4EBA\u6807\u8BC6\u5DF2\u5B89\u5168\u4FDD\u5B58": "Bot identifier stored securely",
  "\u5DF2\u5B89\u5168\u4FDD\u5B58": "Stored securely",
  "\u5DF2\u63A5\u5165\u7684\u5FAE\u4FE1\u8D26\u53F7": "Connected WeChat accounts",
  "\u5DF2\u63A5\u5165\u7684\u673A\u5668\u4EBA": "Connected bots",
  "\u5DF2\u63A5\u5165\u7684\u9489\u9489\u673A\u5668\u4EBA": "Connected DingTalk bots",
  "\u5DF2\u7ED1\u5B9A\u7684\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA": "Connected WeCom bots",
  "\u5DF2\u7ED1\u5B9A\u7684 QQ \u673A\u5668\u4EBA": "Connected QQ bots",
  "\u5DF2\u63A5\u5165\u7684 WhatsApp \u673A\u5668\u4EBA": "Connected WhatsApp accounts",
  "\u4F7F\u7528\u624B\u673A\u5FAE\u4FE1\u626B\u63CF\u4E8C\u7EF4\u7801": "Scan with WeChat on your phone",
  "\u626B\u4E00\u6B21\u7801\uFF0C\u5C31\u80FD\u5728\u5FAE\u4FE1\u91CC\u4F7F\u7528 Harness": "Scan once to use Harness in WeChat",
  "\u6253\u5F00\u624B\u673A\u5FAE\u4FE1\u5E76\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801": "Open WeChat on your phone and scan the QR code",
  "\u5728\u5FAE\u4FE1\u4E2D\u786E\u8BA4\u8FDE\u63A5\u8BE5\u673A\u5668\u4EBA": "Confirm the bot connection in WeChat",
  "\u4FDD\u6301\u672C\u9875\u6253\u5F00\uFF0C\u7B49\u5F85\u673A\u5668\u4EBA\u81EA\u52A8\u8FDE\u63A5": "Keep this page open while the bot connects",
  "\u7B49\u5F85\u5FAE\u4FE1\u626B\u7801": "Waiting for WeChat scan",
  "\u9700\u8981\u914D\u5BF9\u7801": "Pairing code required",
  "\u8F93\u5165\u624B\u673A\u5FAE\u4FE1\u663E\u793A\u7684\u6570\u5B57": "Enter the number shown in WeChat",
  "\u5FAE\u4FE1\u914D\u5BF9\u7801": "WeChat pairing code",
  "\u5DF2\u626B\u7801\uFF0C\u8BF7\u5728\u624B\u673A\u4E0A\u786E\u8BA4": "Scanned. Confirm on your phone",
  "\u914D\u5BF9\u7801\u5DF2\u63D0\u4EA4\uFF0C\u6B63\u5728\u7B49\u5F85\u5FAE\u4FE1\u786E\u8BA4\u3002": "Pairing code submitted. Waiting for WeChat confirmation.",
  "\u8FD9\u662F\u5FAE\u4FE1\u9644\u52A0\u7684\u5B89\u5168\u786E\u8BA4\u6B65\u9AA4\u3002\u914D\u5BF9\u7801\u53EA\u7528\u4E8E\u672C\u6B21\u626B\u7801\u8F6E\u8BE2\uFF0C\u4E0D\u4F1A\u5199\u5165\u914D\u7F6E\u6216\u65E5\u5FD7\u3002": "This is an additional WeChat confirmation step. The pairing code is used only for this connection and is never stored.",
  "\u6B63\u5728\u4FDD\u5B58\u51ED\u636E\u5E76\u9A8C\u8BC1 Harness \u4E0E\u5FAE\u4FE1\u957F\u8F6E\u8BE2\u3002": "Saving credentials and verifying the WeChat connection.",
  "\u5FAE\u4FE1\u5DF2\u786E\u8BA4\uFF0C\u6B63\u5728\u542F\u52A8\u6D88\u606F\u8FDE\u63A5": "Confirmed in WeChat. Starting the message connection",
  "\u5FAE\u4FE1\u5DF2\u7ED1\u5B9A\uFF0C\u53EF\u4EE5\u5F00\u59CB\u5411\u5DF2\u7ED1\u5B9A\u7684\u673A\u5668\u4EBA\u53D1\u6D88\u606F\u3002": "WeChat is connected and ready for messages.",
  "\u8FD9\u4E2A\u5FAE\u4FE1\u8D26\u53F7\u5DF2\u7ECF\u7ED1\u5B9A\u5E76\u4FDD\u6301\u5728\u7EBF\u3002": "This WeChat account is connected and online.",
  "\u5FAE\u4FE1\u8D26\u53F7\u53CA\u672C\u673A\u51ED\u636E\u5DF2\u79FB\u9664\u3002": "The WeChat account and local credentials were removed.",
  "\u5DF2\u53D6\u6D88\u5FAE\u4FE1\u7ED1\u5B9A\u3002": "WeChat setup was cancelled.",
  "\u6B63\u5728\u8054\u7CFB\u817E\u8BAF\u5FAE\u4FE1 iLink \u670D\u52A1\u3002": "Contacting the WeChat iLink service.",
  "iLink \u957F\u8F6E\u8BE2": "iLink long polling",
  "\u626B\u4E00\u6B21\u7801\uFF0C\u81EA\u52A8\u521B\u5EFA\u5E76\u8FDE\u63A5\u673A\u5668\u4EBA": "Scan once to create and connect a bot",
  "\u4F7F\u7528\u9489\u9489 App \u5B8C\u6210\u673A\u5668\u4EBA\u6388\u6743": "Authorize the bot with the DingTalk app",
  "\u4F7F\u7528\u5DF2\u52A0\u5165\u4F01\u4E1A/\u7EC4\u7EC7\u7684\u9489\u9489\u8D26\u53F7\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801": "Scan the QR code with a DingTalk account that belongs to an organization",
  "\u5728\u6388\u6743\u9875\u70B9\u51FB\u201C\u4E00\u952E\u521B\u5EFA\u65B0\u673A\u5668\u4EBA\u201D": "Select \u201CCreate new bot\u201D on the authorization page",
  "\u8BF7\u52FF\u5173\u95ED\u672C\u9875\uFF0C\u9489\u9489\u5B8C\u6210\u6388\u6743\u540E\u5C06\u81EA\u52A8\u7EE7\u7EED\u3002": "Keep this page open. Setup will continue after DingTalk authorization.",
  "\u7B49\u5F85\u9489\u9489\u626B\u7801\u6388\u6743": "Waiting for DingTalk authorization",
  "\u6388\u6743\u5DF2\u786E\u8BA4\uFF0C\u6B63\u5728\u521B\u5EFA\u9489\u9489\u673A\u5668\u4EBA": "Authorized. Creating the DingTalk bot",
  "\u6B63\u5728\u786E\u8BA4\u9489\u9489\u6388\u6743": "Confirming DingTalk authorization",
  "\u6B63\u5728\u68C0\u67E5\u9489\u9489 Stream \u957F\u8FDE\u63A5\uFF0C\u6210\u529F\u540E\u4F1A\u81EA\u52A8\u663E\u793A\u4E3A\u5728\u7EBF\u3002": "Checking the DingTalk Stream connection. It will appear online when ready.",
  "\u9489\u9489\u673A\u5668\u4EBA\u5DF2\u63A5\u5165\uFF0C\u53EF\u4EE5\u5F00\u59CB\u53D1\u9001\u6D88\u606F\u3002": "The DingTalk bot is connected and ready for messages.",
  "\u8FD9\u4E2A\u9489\u9489\u673A\u5668\u4EBA\u5DF2\u7ECF\u63A5\u5165\u5E76\u4FDD\u6301\u5728\u7EBF\u3002": "This DingTalk bot is connected and online.",
  "Stream \u957F\u8FDE\u63A5": "Stream persistent connection",
  "\u4F7F\u7528\u4F01\u4E1A\u5FAE\u4FE1 App \u626B\u7801\u521B\u5EFA\u667A\u80FD\u673A\u5668\u4EBA": "Scan with WeCom to create an AI bot",
  "\u4F7F\u7528\u4F01\u4E1A\u5FAE\u4FE1 App \u5B8C\u6210\u667A\u80FD\u673A\u5668\u4EBA\u6388\u6743": "Authorize the AI bot with WeCom",
  "\u6253\u5F00\u4F01\u4E1A\u5FAE\u4FE1 App\uFF0C\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801": "Open WeCom and scan the QR code",
  "\u5728\u817E\u8BAF\u6388\u6743\u9875\u9762\u786E\u8BA4\u521B\u5EFA\u667A\u80FD\u673A\u5668\u4EBA": "Confirm bot creation on the Tencent authorization page",
  "\u8FD4\u56DE\u8FD9\u91CC\u7B49\u5F85\u8FDE\u63A5\u5B8C\u6210": "Return here and wait for the connection to complete",
  "\u7B49\u5F85\u4F01\u4E1A\u5FAE\u4FE1 App \u626B\u7801": "Waiting for WeCom scan",
  "\u4F01\u4E1A\u5FAE\u4FE1\u5DF2\u6388\u6743\uFF0C\u6B63\u5728\u8FDE\u63A5\u673A\u5668\u4EBA": "Authorized in WeCom. Connecting the bot",
  "\u51ED\u636E\u6B63\u5728\u5199\u5165\u672C\u673A\uFF0C\u5E76\u542F\u52A8\u4F01\u4E1A\u5FAE\u4FE1 WebSocket \u6D88\u606F\u8FDE\u63A5\u3002": "Saving credentials locally and starting the WeCom WebSocket connection.",
  "WebSocket \u957F\u8FDE\u63A5": "WebSocket persistent connection",
  "\u4F7F\u7528\u624B\u673A QQ \u626B\u7801\u521B\u5EFA\u5E76\u7ED1\u5B9A\u673A\u5668\u4EBA": "Scan with mobile QQ to create and connect a bot",
  "\u4F7F\u7528\u624B\u673A QQ \u5B8C\u6210\u673A\u5668\u4EBA\u7ED1\u5B9A": "Complete bot setup with mobile QQ",
  "\u6253\u5F00\u624B\u673A QQ\uFF0C\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801": "Open mobile QQ and scan the QR code",
  "\u5728\u817E\u8BAF\u6388\u6743\u9875\u9762\u786E\u8BA4\u521B\u5EFA\u6216\u7ED1\u5B9A\u673A\u5668\u4EBA": "Confirm bot creation or connection on the Tencent authorization page",
  "\u7B49\u5F85\u624B\u673A QQ \u626B\u7801": "Waiting for mobile QQ scan",
  "QQ \u5DF2\u6388\u6743\uFF0C\u6B63\u5728\u8FDE\u63A5\u673A\u5668\u4EBA": "Authorized in QQ. Connecting the bot",
  "\u51ED\u636E\u6B63\u5728\u5199\u5165\u672C\u673A\uFF0C\u5E76\u542F\u52A8 QQ WebSocket \u6D88\u606F\u8FDE\u63A5\u3002": "Saving credentials locally and starting the QQ WebSocket connection.",
  "\u4F7F\u7528\u624B\u673A WhatsApp \u626B\u63CF\u4E8C\u7EF4\u7801\u5373\u53EF\u63A5\u5165\u3002": "Scan the QR code with WhatsApp to connect.",
  "\u7528\u624B\u673A WhatsApp \u626B\u63CF\u4E8C\u7EF4\u7801": "Scan with WhatsApp on your phone",
  "\u6253\u5F00 WhatsApp \u2192 \u8BBE\u7F6E \u2192 \u5DF2\u5173\u8054\u8BBE\u5907": "Open WhatsApp \u2192 Settings \u2192 Linked devices",
  "\u70B9\u51FB\u201C\u5173\u8054\u8BBE\u5907\u201D\u5E76\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801": "Select \u201CLink a device\u201D and scan the QR code",
  "\u7B49\u5F85 WhatsApp \u626B\u7801": "Waiting for WhatsApp scan",
  "\u5DF2\u626B\u7801\uFF0C\u6B63\u5728\u8FDE\u63A5 WhatsApp": "Scanned. Connecting WhatsApp",
  "\u6B63\u5728\u5EFA\u7ACB\u5B89\u5168\u7684\u5173\u8054\u8BBE\u5907\u4F1A\u8BDD\u3002": "Creating a secure linked-device session.",
  "\u5173\u8054\u8BBE\u5907\u6B63\u5728\u63A5\u5165 DeepSeek Harness\u3002": "Linking the device to DeepSeek Harness.",
  "WhatsApp Web \u5173\u8054\u8BBE\u5907\u8FD0\u884C\u6B63\u5E38": "WhatsApp linked device is healthy",
  "Bot API \u957F\u8F6E\u8BE2": "Bot API long polling",
  " Gateway \u957F\u8FDE\u63A5": " Gateway persistent connection",
  "Gateway \u957F\u8FDE\u63A5": "Gateway persistent connection",
  " Socket Mode \u957F\u8FDE\u63A5": " Socket Mode persistent connection",
  "Socket Mode \u957F\u8FDE\u63A5": "Socket Mode persistent connection",
  "\u63A5\u5165 Telegram \u673A\u5668\u4EBA": "Connect a Telegram bot",
  "\u5148\u901A\u8FC7 @BotFather \u83B7\u53D6 Bot Token\uFF0C\u518D\u5728\u8FD9\u91CC\u5B8C\u6210\u63A5\u5165\u3002": "Get a Bot Token from @BotFather, then connect it here.",
  "\u586B\u5199 @BotFather \u751F\u6210\u7684 Bot Token": "Enter the Bot Token from @BotFather",
  "\u63A5\u5165 Discord \u673A\u5668\u4EBA": "Connect a Discord bot",
  "\u5148\u5728 Developer Portal \u521B\u5EFA Bot \u5E76\u9080\u8BF7\u5230\u670D\u52A1\u5668\uFF0C\u518D\u5728\u8FD9\u91CC\u5B8C\u6210\u63A5\u5165\u3002": "Create a bot in the Developer Portal and invite it to your server, then connect it here.",
  "\u586B\u5199 Discord Developer Portal \u7684 Bot Token": "Enter the Bot Token from the Discord Developer Portal",
  "\u63A5\u5165 Slack \u673A\u5668\u4EBA": "Connect a Slack bot",
  "\u5148\u7528 Manifest \u521B\u5EFA\u5E76\u914D\u7F6E Slack App": "Create and configure a Slack app with the manifest",
  "\u590D\u5236\u914D\u7F6E\u540E\uFF0C\u5728 Slack \u9009\u62E9 From a manifest\uFF1B\u521B\u5EFA\u5B8C\u6210\u540E\u751F\u6210 connections:write App Token\uFF0C\u5E76\u5C06\u5E94\u7528\u5B89\u88C5\u5230\u5DE5\u4F5C\u533A\u3002": "Copy the manifest and choose \u201CFrom a manifest\u201D in Slack. Then create a connections:write App Token and install the app to your workspace.",
  "\u590D\u5236 Manifest": "Copy manifest",
  "\u5DF2\u590D\u5236 Manifest": "Manifest copied",
  "\u6253\u5F00 Slack \u521B\u5EFA\u9875": "Open Slack app creation",
  "Bot Token \u6765\u81EA OAuth & Permissions\uFF1BApp Token \u6765\u81EA Basic Information\uFF0C\u5E76\u4E14\u5FC5\u987B\u5305\u542B connections:write\u3002": "Get the Bot Token from OAuth & Permissions and the App Token from Basic Information. The App Token must include connections:write.",
  "\u4F7F\u7528\u5B98\u65B9 App Manifest \u5FEB\u901F\u914D\u7F6E\u673A\u5668\u4EBA\uFF0C\u518D\u586B\u5199 Bot Token \u4E0E App Token \u5EFA\u7ACB\u672C\u5730 Socket Mode \u8FDE\u63A5\u3002": "Configure the bot with the official app manifest, then enter the Bot Token and App Token to start a local Socket Mode connection.",
  "Slack \u5DE5\u4F5C\u533A": "Slack workspace",
  "Bot Token \u4E0E App Token": "Bot Token and App Token",
  "\u586B\u5199 Bot Token": "Enter Bot Token",
  "\u624B\u52A8\u63A5\u5165\u98DE\u4E66\u673A\u5668\u4EBA": "Connect Feishu bot manually",
  "\u624B\u52A8\u63A5\u5165\u9489\u9489\u673A\u5668\u4EBA": "Connect DingTalk bot manually",
  "\u624B\u52A8\u63A5\u5165\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA": "Connect WeCom bot manually",
  "\u624B\u52A8\u63A5\u5165QQ\u673A\u5668\u4EBA": "Connect QQ bot manually",
  "\u586B\u5199\u98DE\u4E66\u5F00\u653E\u5E73\u53F0 App ID": "Enter the Feishu Open Platform App ID",
  "\u586B\u5199\u98DE\u4E66\u5F00\u653E\u5E73\u53F0 App Secret": "Enter the Feishu Open Platform App Secret",
  "\u586B\u5199\u9489\u9489\u5E94\u7528 Client ID": "Enter the DingTalk Client ID",
  "\u586B\u5199\u9489\u9489\u5E94\u7528 Client Secret": "Enter the DingTalk Client Secret",
  "\u586B\u5199\u4F01\u4E1A\u5FAE\u4FE1\u667A\u80FD\u673A\u5668\u4EBA Bot ID": "Enter the WeCom AI Bot ID",
  "\u586B\u5199\u4F01\u4E1A\u5FAE\u4FE1\u667A\u80FD\u673A\u5668\u4EBA Secret": "Enter the WeCom AI Bot Secret",
  "\u586B\u5199 QQ \u5F00\u653E\u5E73\u53F0 AppID": "Enter the QQ Open Platform AppID",
  "\u586B\u5199 QQ \u5F00\u653E\u5E73\u53F0 AppSecret": "Enter the QQ Open Platform AppSecret",
  "\u626B\u7801\u63A5\u5165\u5FAE\u4FE1\u673A\u5668\u4EBA": "Connect WeChat bot by QR code",
  "\u626B\u7801\u63A5\u5165\u98DE\u4E66\u673A\u5668\u4EBA": "Connect Feishu bot by QR code",
  "\u626B\u7801\u63A5\u5165\u9489\u9489\u673A\u5668\u4EBA": "Connect DingTalk bot by QR code",
  "\u626B\u7801\u63A5\u5165\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA": "Connect WeCom bot by QR code",
  "\u626B\u7801\u63A5\u5165 QQ \u673A\u5668\u4EBA": "Connect QQ bot by QR code",
  "\u626B\u7801\u63A5\u5165 WhatsApp \u673A\u5668\u4EBA": "Connect WhatsApp by QR code",
  "\u626B\u7801\u7ED1\u5B9A WhatsApp \u673A\u5668\u4EBA": "Connect WhatsApp by QR code",
  "\u4F7F\u7528 App ID \u548C App Secret \u7ED1\u5B9A\u98DE\u4E66\u673A\u5668\u4EBA": "Connect a Feishu bot with App ID and App Secret",
  "\u4F7F\u7528 Client ID \u548C Client Secret \u7ED1\u5B9A\u9489\u9489\u673A\u5668\u4EBA": "Connect a DingTalk bot with Client ID and Client Secret",
  "\u4F7F\u7528 Bot ID \u548C Secret \u7ED1\u5B9A\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA": "Connect a WeCom bot with Bot ID and Secret",
  "\u4F7F\u7528 AppID \u548C AppSecret \u7ED1\u5B9A QQ \u673A\u5668\u4EBA": "Connect a QQ bot with AppID and AppSecret",
  "\u4F7F\u7528 Manifest \u548C\u53CC Token \u63A5\u5165 Slack \u673A\u5668\u4EBA": "Connect a Slack bot with a manifest and two tokens",
  "\u4F7F\u7528 Bot Token \u63A5\u5165 Telegram \u673A\u5668\u4EBA": "Connect a Telegram bot with a Bot Token",
  "\u4F7F\u7528 Bot Token \u63A5\u5165 Discord \u673A\u5668\u4EBA": "Connect a Discord bot with a Bot Token",
  "\u53D6\u6D88\u7ED1\u5B9A": "Cancel setup",
  "\u53D6\u6D88\u63A5\u5165": "Cancel setup",
  "\u4E8C\u7EF4\u7801\u7531\u817E\u8BAF\u5FAE\u4FE1 iLink \u670D\u52A1\u7B7E\u53D1\u3002\u7528\u624B\u673A\u5FAE\u4FE1\u626B\u63CF\u5E76\u786E\u8BA4\u540E\uFF0C\u8D26\u53F7\u51ED\u636E\u4F1A\u76F4\u63A5\u5199\u5165 Harness Host\uFF0C\u6D4F\u89C8\u5668\u4E0D\u4F1A\u6536\u5230 bot_token\u3002": "The QR code is issued by Tencent WeChat iLink. After you scan and confirm, account credentials are written directly to the Harness Host and are never exposed to the browser.",
  "\u626B\u7801\u8D26\u53F7\u5FC5\u987B\u5DF2\u52A0\u5165\u4F01\u4E1A/\u7EC4\u7EC7\u3002\u5982\u679C\u9489\u9489\u63D0\u793A\u5C1A\u672A\u52A0\u5165\u7EC4\u7EC7\uFF0C\u8BF7\u5728\u63D0\u793A\u9875\u521B\u5EFA\u7EC4\u7EC7\uFF0C\u6216\u6362\u7528\u5DF2\u52A0\u5165\u7EC4\u7EC7\u7684\u8D26\u53F7\u3002": "The DingTalk account must belong to an organization. If prompted, create an organization or use an account that already belongs to one.",
  "\u8BF7\u5728\u624B\u673A\u4E0A\u6838\u5BF9\u5E76\u786E\u8BA4\u6388\u6743\u3002\u90E8\u5206\u8D26\u53F7\u4F1A\u989D\u5916\u663E\u793A\u4E00\u4E2A\u914D\u5BF9\u6570\u5B57\uFF0C\u9875\u9762\u4F1A\u5728\u9700\u8981\u65F6\u63D0\u793A\u8F93\u5165\u3002": "Review and confirm authorization on your phone. Some accounts may also require a pairing number.",
  "\u6388\u6743\u7531\u9489\u9489\u5B98\u65B9\u9875\u9762\u5B8C\u6210\u3002\u626B\u7801\u8D26\u53F7\u5FC5\u987B\u5DF2\u52A0\u5165\u4E00\u4E2A\u4F01\u4E1A/\u7EC4\u7EC7\u5E76\u6709\u6743\u521B\u5EFA\u673A\u5668\u4EBA\uFF1B\u521B\u5EFA\u6210\u529F\u540E\uFF0C\u5E94\u7528\u51ED\u636E\u4F1A\u76F4\u63A5\u5199\u5165 Harness Host\u3002": "Authorization is completed on DingTalk\u2019s official page. The account must belong to an organization and be allowed to create bots. Credentials are written directly to the Harness Host.",
  "\u626B\u7801\u7531\u817E\u8BAF\u5B98\u65B9\u9875\u9762\u5B8C\u6210\uFF0C\u4E0D\u9700\u8981\u624B\u52A8\u586B\u5199 AppID \u6216 AppSecret\u3002\u626B\u7801\u6210\u529F\u540E\uFF0C\u673A\u5668\u4EBA\u4F1A\u81EA\u52A8\u8FDE\u63A5 DeepSeek Harness\u3002": "Scanning is completed on Tencent\u2019s official page. No AppID or AppSecret is required, and the bot connects automatically.",
  "\u626B\u7801\u7531\u817E\u8BAF\u5B98\u65B9\u9875\u9762\u5B8C\u6210\uFF0C\u4E0D\u9700\u8981\u624B\u52A8\u586B\u5199 Bot ID \u6216 Secret\u3002\u521B\u5EFA\u6210\u529F\u540E\uFF0C\u673A\u5668\u4EBA\u4F1A\u81EA\u52A8\u8FDE\u63A5 DeepSeek Harness\u3002": "Scanning is completed on Tencent\u2019s official page. No Bot ID or Secret is required, and the bot connects automatically.",
  "\u817E\u8BAF\u9875\u9762\u4F1A\u521B\u5EFA\u6216\u7ED1\u5B9A\u4E00\u4E2A QQ \u673A\u5668\u4EBA\uFF0C\u5E76\u628A\u8FDE\u63A5\u51ED\u636E\u5B89\u5168\u4EA4\u7ED9\u672C\u673A Harness Host\u3002": "Tencent will create or connect a QQ bot and securely deliver its credentials to the local Harness Host.",
  "\u4F01\u4E1A\u5FAE\u4FE1\u5B98\u65B9\u9875\u9762\u4F1A\u521B\u5EFA\u4E00\u4E2A\u667A\u80FD\u673A\u5668\u4EBA\uFF0C\u5E76\u628A\u8FDE\u63A5\u51ED\u636E\u5B89\u5168\u4EA4\u7ED9\u672C\u673A Harness Host\u3002": "WeCom will create an AI bot and securely deliver its credentials to the local Harness Host.",
  "\u4ECE\u6B64 Harness \u79FB\u9664\u8FD9\u4E2A\u5FAE\u4FE1\u8D26\u53F7\uFF1F": "Remove this WeChat account from Harness?",
  "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684 bot_token\u3001\u8D26\u53F7\u914D\u7F6E\u548C\u4F1A\u8BDD\u6620\u5C04\u3002\u5176\u4ED6\u5FAE\u4FE1\u8D26\u53F7\u4E0D\u53D7\u5F71\u54CD\u3002": "This stops the message connection and removes the locally stored bot_token, account configuration, and session mappings. Other WeChat accounts are not affected.",
  "\u6B64\u64CD\u4F5C\u4F1A\u505C\u6B62\u8FD9\u4E2A\u673A\u5668\u4EBA\u7684\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u4FDD\u5B58\u5728\u672C\u673A\u7684\u63A5\u5165\u914D\u7F6E\u548C\u51ED\u636E\u3002\u98DE\u4E66\u5F00\u653E\u5E73\u53F0\u4E2D\u7684\u5E94\u7528\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\uFF0C\u5176\u4ED6\u673A\u5668\u4EBA\u4E5F\u4E0D\u53D7\u5F71\u54CD\u3002": "This stops the bot connection and removes the locally stored configuration and credentials. The app in Feishu Open Platform is not deleted, and other bots are not affected.",
  "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684\u5E94\u7528\u51ED\u636E\u3001\u673A\u5668\u4EBA\u914D\u7F6E\u53CA\u4F1A\u8BDD\u6620\u5C04\u3002\u9489\u9489\u5F00\u653E\u5E73\u53F0\u4E2D\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\u3002": "This stops the message connection and removes the locally stored app credentials, bot configuration, and session mappings. The bot in DingTalk Open Platform is not deleted.",
  "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684\u5E94\u7528\u51ED\u636E\u3001\u673A\u5668\u4EBA\u914D\u7F6E\u53CA\u4F1A\u8BDD\u6620\u5C04\u3002\u4F01\u4E1A\u5FAE\u4FE1\u5E73\u53F0\u4E2D\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\u3002": "This stops the message connection and removes the locally stored app credentials, bot configuration, and session mappings. The bot in WeCom is not deleted.",
  "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684\u5E94\u7528\u51ED\u636E\u3001\u673A\u5668\u4EBA\u914D\u7F6E\u53CA\u4F1A\u8BDD\u6620\u5C04\u3002\u817E\u8BAF\u5E73\u53F0\u4E2D\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\u3002": "This stops the message connection and removes the locally stored app credentials, bot configuration, and session mappings. The bot on Tencent\u2019s platform is not deleted.",
  "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684 WhatsApp \u5173\u8054\u8BBE\u5907\u548C\u4F1A\u8BDD\u6620\u5C04\u3002": "This stops the message connection and removes the locally stored WhatsApp linked device and session mappings.",
  "\u6B63\u5728\u8BFB\u53D6\u98DE\u4E66\u673A\u5668\u4EBA\u5217\u8868": "Loading Feishu bots",
  "\u6B63\u5728\u8BFB\u53D6\u98DE\u4E66\u8FDE\u63A5\u72B6\u6001\u2026": "Loading Feishu connection status\u2026",
  "\u6B63\u5728\u8BFB\u53D6\u5FAE\u4FE1\u8FDE\u63A5\u72B6\u6001\u2026": "Loading WeChat connection status\u2026",
  "\u6B63\u5728\u8BFB\u53D6\u9489\u9489\u8FDE\u63A5\u72B6\u6001\u2026": "Loading DingTalk connection status\u2026",
  "\u901A\u8FC7\u626B\u7801\u628A\u9489\u9489\u673A\u5668\u4EBA\u63A5\u5165 DeepSeek Harness": "Connect a DingTalk bot to DeepSeek Harness by QR code",
  "\u9489\u9489\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u7ED1\u5B9A\u8FDB\u5EA6": "DingTalk did not return QR setup progress",
  "\u9489\u9489\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1": "DingTalk did not return a valid setup attempt",
  "\u9489\u9489 Stream \u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38": "DingTalk Stream connection is healthy",
  "\u9489\u9489\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868": "DingTalk did not return a valid bot list",
  "${totals.connected} / ${totals.configured} \u5728\u7EBF": "${totals.connected} / ${totals.configured} online",
  "\u7528\u4E8E\u628A\u9489\u9489\u673A\u5668\u4EBA\u63A5\u5165 DeepSeek Harness \u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801": "One-time QR code for connecting a DingTalk bot to DeepSeek Harness",
  "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\\n\u8BF7\u91CD\u65B0\u751F\u6210": "QR code expired\\nGenerate a new one",
  "\u673A\u5668\u4EBA\u5DF2\u521B\u5EFA\uFF0C\u6B63\u5728\u5EFA\u7ACB\u6D88\u606F\u8FDE\u63A5": "Bot created. Starting the message connection",
  "\u9489\u9489\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u5B89\u5168\u7684\u4E8C\u7EF4\u7801": "DingTalk did not return a secure QR code",
  "\u9489\u9489\u4E8C\u7EF4\u7801\u5DF2\u751F\u6210\uFF0C\u8BF7\u4F7F\u7528\u9489\u9489 App \u626B\u63CF\u3002": "DingTalk QR code generated. Scan it with the DingTalk app.",
  "\u9489\u9489\u673A\u5668\u4EBA\u51ED\u636E\u5DF2\u7ED1\u5B9A\u3002": "DingTalk bot credentials connected.",
  "\u5DF2\u53D6\u6D88\u9489\u9489\u673A\u5668\u4EBA\u63A5\u5165\u3002": "DingTalk bot setup cancelled.",
  "\u9489\u9489\u673A\u5668\u4EBA\u53CA\u672C\u673A\u51ED\u636E\u5DF2\u79FB\u9664\u3002": "DingTalk bot and local credentials removed.",
  "\u98DE\u4E66\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u4E8C\u7EF4\u7801\u4FE1\u606F": "Feishu did not return QR code information",
  "\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u7684\u4E8C\u7EF4\u7801\u4FE1\u606F\u4E0D\u5B8C\u6574": "Feishu returned incomplete QR code information",
  "\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u7684\u673A\u5668\u4EBA\u72B6\u6001": "Feishu returned an invalid bot status",
  "\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u7684\u673A\u5668\u4EBA\u7F3A\u5C11 botId": "The Feishu bot is missing botId",
  "\u98DE\u4E66\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u8FDE\u63A5\u72B6\u6001": "Feishu did not return connection status",
  "\u98DE\u4E66\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u521B\u5EFA\u8FDB\u5EA6": "Feishu did not return creation progress",
  "\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u4E86\u672A\u77E5\u7684\u521B\u5EFA\u72B6\u6001": "Feishu returned an unknown creation status",
  "\u5DF2\u63A5\u5165 ${totals.configured} \u4E2A\u673A\u5668\u4EBA\uFF0C\u5176\u4E2D ${totals.connected} \u4E2A\u5728\u7EBF": "${totals.connected} of ${totals.configured} bots online",
  "\u5C1A\u672A\u63A5\u5165\u673A\u5668\u4EBA": "No bot connected yet",
  "\u7528\u4E8E\u65B0\u589E DeepSeek Harness \u98DE\u4E66\u673A\u5668\u4EBA\u7684\u4E00\u6B21\u6027\u6388\u6743\u4E8C\u7EF4\u7801": "One-time authorization QR code for adding a Feishu bot to DeepSeek Harness",
  "\u8BF7\u5237\u65B0\u540E\u91CD\u65B0\u626B\u7801": "Refresh and scan again",
  '${connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"}${bot.name}': '${connected ? "Check connection" : "Reconnect"} ${bot.name}',
  "\u65E0\u6CD5\u8BFB\u53D6\u98DE\u4E66\u673A\u5668\u4EBA": "Could not load Feishu bots",
  "\u6388\u6743\u4E8C\u7EF4\u7801\u5DF2\u751F\u6210\uFF0C\u8BF7\u4F7F\u7528\u98DE\u4E66\u626B\u7801\u3002": "Authorization QR code generated. Scan it with Feishu.",
  "\u98DE\u4E66\u673A\u5668\u4EBA\u51ED\u636E\u5DF2\u7ED1\u5B9A\u3002": "Feishu bot credentials connected.",
  "\u5DF2\u53D6\u6D88\u6DFB\u52A0\u673A\u5668\u4EBA\u3002": "Adding the bot was cancelled.",
  "${newBot.bot.name}\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5728\u98DE\u4E66\u4E2D\u5F00\u59CB\u804A\u5929\u3002": "${newBot.bot.name} is connected and ready to chat in Feishu.",
  "${bot.name}\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u673A\u5668\u4EBA\u72B6\u6001\u3002": "${bot.name} operation failed. Check the bot status.",
  "${bot.name}\u5DF2\u4ECE\u6B64 DeepSeek Harness \u79FB\u9664\uFF1B\u98DE\u4E66\u5F00\u653E\u5E73\u53F0\u4E2D\u7684\u5E94\u7528\u672A\u88AB\u5220\u9664\u3002": "${bot.name} was removed from this DeepSeek Harness. The app in Feishu Open Platform was not deleted.",
  "\u65E0\u6CD5\u8BFB\u53D6\u8FDE\u63A5\u72B6\u6001": "Could not load connection status",
  "QQ \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u7ED1\u5B9A\u8FDB\u5EA6": "QQ did not return QR setup progress",
  "QQ \u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1": "QQ did not return a valid setup attempt",
  "QQ WebSocket \u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38": "QQ WebSocket connection is healthy",
  "QQ \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868": "QQ did not return a valid bot list",
  "\u5C1A\u672A\u7ED1\u5B9A QQ \u673A\u5668\u4EBA": "No QQ bot connected yet",
  "\u7528\u4E8E\u7ED1\u5B9A QQ \u673A\u5668\u4EBA\u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801": "One-time QR code for connecting a QQ bot",
  "${channel}${connectionSummary}\u8FD0\u884C\u6B63\u5E38": "${channel}${connectionSummary} is healthy",
  "${channel} \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868": "${channel} did not return a valid bot list",
  "\u4F7F\u7528 Bot Token \u63A5\u5165 ${channel} \u673A\u5668\u4EBA": "Connect a ${channel} bot with a Bot Token",
  "${model.totals.connected} / ${model.totals.configured} \u5728\u7EBF": "${model.totals.connected}/${model.totals.configured} online",
  " Bot API \u957F\u8F6E\u8BE2": " Bot API long polling",
  "\u4F01\u4E1A\u5FAE\u4FE1\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u7ED1\u5B9A\u8FDB\u5EA6": "WeCom did not return QR setup progress",
  "\u4F01\u4E1A\u5FAE\u4FE1\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1": "WeCom did not return a valid setup attempt",
  "\u4F01\u4E1A\u5FAE\u4FE1 WebSocket \u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38": "WeCom WebSocket connection is healthy",
  "\u4F01\u4E1A\u5FAE\u4FE1\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868": "WeCom did not return a valid bot list",
  "\u5C1A\u672A\u7ED1\u5B9A\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA": "No WeCom bot connected yet",
  "\u7528\u4E8E\u7ED1\u5B9A\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA\u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801": "One-time QR code for connecting a WeCom bot",
  "\u5FAE\u4FE1\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1": "WeChat did not return a valid setup attempt",
  "\u5FAE\u4FE1\u7ED1\u5B9A\u6CA1\u6709\u5B8C\u6210": "WeChat setup did not complete",
  "\u5FAE\u4FE1\u8FDE\u63A5\u6B63\u5E38": "WeChat connection is healthy",
  "\u5FAE\u4FE1\u8FDE\u63A5\u672A\u5C31\u7EEA": "WeChat connection is not ready",
  "\u5FAE\u4FE1\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u8D26\u53F7\u5217\u8868": "WeChat did not return a valid account list",
  "\u5C1A\u672A\u7ED1\u5B9A\u5FAE\u4FE1": "No WeChat account connected yet",
  "\u7528\u4E8E\u628A\u5FAE\u4FE1\u673A\u5668\u4EBA\u7ED1\u5B9A\u5230 DeepSeek Harness \u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801": "One-time QR code for connecting a WeChat bot to DeepSeek Harness",
  "\u4FDD\u6301\u672C\u9875\u6253\u5F00\uFF0C\u7B49\u5F85\u6D88\u606F\u957F\u8F6E\u8BE2\u53D8\u4E3A\u5728\u7EBF": "Keep this page open until long polling is online",
  "\u5FAE\u4FE1\u4E8C\u7EF4\u7801\u5DF2\u751F\u6210\uFF0C\u8BF7\u4F7F\u7528\u624B\u673A\u5FAE\u4FE1\u626B\u63CF\u3002": "WeChat QR code generated. Scan it with WeChat on your phone.",
  "\u79FB\u9664\u5931\u8D25\uFF1A${presentError(error).message}": "Removal failed: ${presentError(error).message}",
  "\u65E0\u6CD5\u8BFB\u53D6\u5FAE\u4FE1\u72B6\u6001": "Could not load WeChat status",
  "WhatsApp \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u8FDB\u5EA6": "WhatsApp did not return QR setup progress",
  "WhatsApp \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u626B\u7801\u4EFB\u52A1": "WhatsApp did not return a valid setup attempt",
  "WhatsApp \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868": "WhatsApp did not return a valid account list",
  "\u7528\u4E8E\u5173\u8054 WhatsApp \u8BBE\u5907\u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801": "One-time QR code for linking a WhatsApp device"
});
var en = EN;
var zh = Object.freeze(Object.fromEntries(
  Object.keys(EN).map((key) => [key, key === "$locale" ? "zh" : key])
));
var translate = (key) => key;
function setImTranslator(next) {
  translate = typeof next === "function" ? next : (key) => key;
}
function isEnglish() {
  return translate("$locale") === "en";
}
function channelName(value) {
  return localizeText(value);
}
function translateDynamic(text5) {
  let match = /^(\d+) \/ (\d+) 在线$/.exec(text5);
  if (match) return `${match[1]}/${match[2]} online`;
  match = /^已接入 (\d+) 个机器人，其中 (\d+) 个在线$/.exec(text5);
  if (match) return `${match[2]} of ${match[1]} bots online`;
  match = /^正在读取\s*(.+?)\s*机器人状态…$/.exec(text5);
  if (match) return `Loading ${channelName(match[1])} bot status\u2026`;
  match = /^无法读取\s*(.+?)\s*机器人状态$/.exec(text5);
  if (match) return `Could not load ${channelName(match[1])} bot status`;
  match = /^尚未接入\s*(.+?)\s*机器人$/.exec(text5);
  if (match) return `No ${channelName(match[1])} bot connected yet`;
  match = /^已接入的\s*(.+?)\s*机器人$/.exec(text5);
  if (match) return `Connected ${channelName(match[1])} bots`;
  match = /^手动接入(.+)机器人$/.exec(text5);
  if (match) return `Connect ${channelName(match[1])} bot manually`;
  match = /^(.+) 设置$/.exec(text5);
  if (match) return `${channelName(match[1])} settings`;
  match = /^从 DeepSeek Harness 移除“(.+)”？$/.exec(text5);
  if (match) return `Remove \u201C${match[1]}\u201D from DeepSeek Harness?`;
  match = /^从 DeepSeek Harness 移除(.+)$/.exec(text5);
  if (match) return `Remove ${match[1]} from DeepSeek Harness`;
  match = /^(检查连接|重试连接)(.+)$/.exec(text5);
  if (match) return `${localizeText(match[1])} ${match[2]}`;
  match = /^移除(.+)$/.exec(text5);
  if (match) return `Remove ${match[1]}`;
  match = /^这会停止消息连接，并删除本机保存的 (.+)、机器人配置及会话映射。(.+)中的机器人不会被自动删除。$/.exec(text5);
  if (match) {
    return `This stops the message connection and removes the locally stored ${localizeText(match[1])}, bot configuration, and session mappings. The bot in ${localizeText(match[2])} is not deleted.`;
  }
  match = /^二维码剩余 (.+)$/.exec(text5);
  if (match) return `QR code expires in ${match[1]}`;
  match = /^状态刷新失败：(.+)$/.exec(text5);
  if (match) return `Status refresh failed: ${match[1]}`;
  match = /^状态自动刷新失败：(.+)$/.exec(text5);
  if (match) return `Automatic status refresh failed: ${match[1]}`;
  match = /^操作失败：(.+)$/.exec(text5);
  if (match) return `Operation failed: ${match[1]}`;
  match = /^连接检查失败：(.+)$/.exec(text5);
  if (match) return `Connection check failed: ${match[1]}`;
  match = /^移除失败：(.+)$/.exec(text5);
  if (match) return `Removal failed: ${match[1]}`;
  const phrases = [
    ["\u4F01\u4E1A\u5FAE\u4FE1", "WeCom"],
    ["DeepSeek Harness", "DeepSeek Harness"],
    ["WhatsApp", "WhatsApp"],
    ["Telegram", "Telegram"],
    ["Discord", "Discord"],
    ["Slack", "Slack"],
    ["\u98DE\u4E66", "Feishu"],
    ["\u9489\u9489", "DingTalk"],
    ["\u5FAE\u4FE1", "WeChat"],
    ["\u673A\u5668\u4EBA", "bot"],
    ["\u8D26\u53F7", "account"],
    ["\u5E94\u7528", "app"],
    ["\u51ED\u636E", "credentials"],
    ["\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94", "service returned an unrecognized response"],
    ["\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868", "service did not return a valid bot list"],
    ["\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5", "operation failed; try again later"],
    ["\u64CD\u4F5C\u5931\u8D25", "operation failed"],
    ["\u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA", "connection is not ready"],
    ["\u6CA1\u6709\u63A5\u5165\u5B8C\u6210", "was not connected"],
    ["\u6CA1\u6709\u7ED1\u5B9A\u5B8C\u6210", "was not connected"],
    ["\u8BBE\u7F6E\u9875\u7F3A\u5C11 RPC \u8FDE\u63A5", "settings are missing an RPC connection"],
    ["\u8BBE\u7F6E", "settings"],
    ["\u8FDE\u63A5\u68C0\u67E5\u5B8C\u6210", "connection check completed"],
    ["\u4ECD\u672A\u8FDE\u63A5\uFF0C\u63D2\u4EF6\u4F1A\u7EE7\u7EED\u81EA\u52A8\u91CD\u8BD5", "is still offline; the plugin will keep retrying"],
    ["\u5DF2\u91CD\u65B0\u8FDE\u63A5", "reconnected"],
    ["\u79FB\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5", "could not be removed; try again"],
    ["\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5F00\u59CB\u804A\u5929", "is connected and ready to chat"],
    ["\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5F00\u59CB\u53D1\u9001\u6D88\u606F", "is connected and ready for messages"],
    ["\u670D\u52A1\u8BF7\u6C42\u5931\u8D25", "service request failed"],
    ["\u8FDE\u63A5\u9047\u5230\u95EE\u9898", "connection encountered a problem"],
    ["\u6B63\u5728\u8BFB\u53D6", "Loading "],
    ["\u8FDE\u63A5\u72B6\u6001", "connection status"],
    ["\u4E8C\u7EF4\u7801", "QR code"]
  ];
  let output = text5;
  for (const [source, target] of phrases) output = output.replaceAll(source, target);
  return output;
}
function localizeText(value) {
  if (typeof value !== "string") return value;
  const exact = translate(value);
  if (exact !== value || !isEnglish()) return exact;
  return translateDynamic(value);
}
var LOCALIZED_PROPS = Object.freeze([
  "aria-label",
  "alt",
  "placeholder",
  "title"
]);
function localizeChild(child) {
  if (typeof child === "string") return localizeText(child);
  if (Array.isArray(child)) return child.map(localizeChild);
  return child;
}
function h2(type, props, ...children) {
  let localizedProps = props;
  if (props) {
    for (const key of LOCALIZED_PROPS) {
      if (typeof props[key] === "string") {
        localizedProps = localizedProps === props ? { ...props } : localizedProps;
        localizedProps[key] = localizeText(props[key]);
      }
    }
  }
  return React2.createElement(type, localizedProps, ...children.map(localizeChild));
}

// plugin-src/client/credential-binding.js
function ActionIcon({ children }) {
  return h2("svg", {
    className: "dim-actionIcon",
    width: 15,
    height: 15,
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false"
  }, children);
}
function QrActionIcon() {
  return h2(
    ActionIcon,
    null,
    h2("path", {
      d: "M2.5 2.5h5v5h-5v-5Zm10 0h5v5h-5v-5Zm-10 10h5v5h-5v-5Z",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }),
    h2("path", {
      d: "M11.5 11.5h2v2h-2v-2Zm4 0h2v3h-2v-3Zm-4 4h3v2h-3v-2Zm5 1h1v1h-1v-1Z",
      fill: "currentColor"
    })
  );
}
function CredentialActionIcon() {
  return h2(
    ActionIcon,
    null,
    h2("circle", {
      cx: "6.25",
      cy: "10",
      r: "3.5",
      stroke: "currentColor",
      strokeWidth: "1.6"
    }),
    h2("path", {
      d: "M9.75 10h7.75m-2.5 0v2m-2.5-2v2",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })
  );
}
function CredentialBindingPanel({
  channel: channel4,
  identityLabel,
  identityPlaceholder,
  secretLabel,
  secretPlaceholder,
  busy = false,
  error = null,
  onSubmit,
  onCancel
}) {
  const [identity, setIdentity] = React3.useState("");
  const [secret, setSecret] = React3.useState("");
  const headingId = React3.useId();
  const hasIdentity = Boolean(identityLabel);
  const submit = (event) => {
    event.preventDefault();
    const normalizedIdentity = identity.trim();
    const normalizedSecret = secret.trim();
    if (hasIdentity && !normalizedIdentity || !normalizedSecret || busy) return;
    void onSubmit?.({ identity: normalizedIdentity, secret: normalizedSecret });
  };
  return h2(
    "section",
    {
      className: "ddt-card dim-surfaceCard dim-credentialPanel",
      "aria-labelledby": headingId
    },
    h2("h3", { id: headingId, className: "dim-credentialTitle" }, `\u624B\u52A8\u63A5\u5165${channel4}\u673A\u5668\u4EBA`),
    h2(
      "form",
      {
        className: `dim-credentialForm${hasIdentity ? "" : " dim-credentialFormSingle"}`,
        onSubmit: submit
      },
      hasIdentity ? h2(
        "label",
        { className: "dim-credentialField" },
        h2("span", null, identityLabel),
        h2("input", {
          value: identity,
          onChange: (event) => setIdentity(event.target.value),
          placeholder: identityPlaceholder,
          maxLength: 512,
          autoCapitalize: "none",
          autoCorrect: "off",
          spellCheck: false,
          autoComplete: "off",
          disabled: busy,
          required: true
        })
      ) : null,
      h2(
        "label",
        { className: "dim-credentialField" },
        h2("span", null, secretLabel),
        h2("input", {
          type: "password",
          value: secret,
          onChange: (event) => setSecret(event.target.value),
          placeholder: secretPlaceholder,
          maxLength: 1024,
          autoCapitalize: "none",
          autoCorrect: "off",
          spellCheck: false,
          autoComplete: "new-password",
          disabled: busy,
          required: true
        })
      ),
      error ? h2("p", { className: "dim-credentialError", role: "alert" }, error.message ?? String(error)) : null,
      h2(
        "div",
        { className: "ddt-actions dim-viewActions dim-credentialActions" },
        h2("button", {
          type: "submit",
          className: "ddt-button",
          "data-kind": "primary",
          disabled: busy || hasIdentity && !identity.trim() || !secret.trim()
        }, busy ? "\u6B63\u5728\u7ED1\u5B9A\u2026" : "\u7ED1\u5B9A\u5E76\u8FDE\u63A5"),
        h2("button", {
          type: "button",
          className: "ddt-button",
          onClick: onCancel,
          disabled: busy
        }, "\u53D6\u6D88")
      )
    )
  );
}

// plugin-src/client/channels/dingtalk/styles.js
var DINGTALK_STYLE_ID = "xmanrui-dsh-dingtalk-settings";
var CSS = String.raw`
.ddt-page {
  --ddt-accent: #1677ff;
  --ddt-accent-deep: #0958d9;
  --ddt-accent-wash: #eaf3ff;
  --ddt-success: var(--dsw-alias-state-success-primary, #20a162);
  --ddt-warning: var(--dsw-alias-state-warn-primary, #d97706);
  --ddt-error: var(--dsw-alias-state-error-primary, #d54941);
  width: 100%;
  max-width: 880px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 2px 0 28px;
  container-type: inline-size;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.ddt-page *, .ddt-page *::before, .ddt-page *::after { box-sizing: border-box; }
.ddt-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.ddt-headingCopy { min-width: 0; }
.ddt-heading h2, .ddt-heading p, .ddt-card h3, .ddt-card h4, .ddt-card p { margin: 0; }
.ddt-eyebrow { margin-bottom: 3px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; }
.ddt-heading h2 { font-size: 20px; line-height: 28px; font-weight: 680; }
.ddt-heading p { margin-top: 5px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 20px; white-space: nowrap; }
.ddt-tools, .ddt-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.ddt-tools { width: 100%; justify-content: space-between; flex-wrap: nowrap; }
.ddt-badge { min-height: 30px; display: inline-flex; align-items: center; gap: 7px; padding: 0 11px; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f2f3f5); font-size: 12px; white-space: nowrap; }
.ddt-dot { width: 8px; height: 8px; flex: none; border-radius: 50%; background: #aeb3bb; }
.ddt-dot[data-tone="success"] { background: var(--ddt-success); box-shadow: 0 0 0 3px color-mix(in srgb, var(--ddt-success) 14%, transparent); }
.ddt-dot[data-tone="warning"] { background: var(--ddt-warning); }
.ddt-dot[data-tone="error"] { background: var(--ddt-error); }
.ddt-button { min-height: 34px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 0 13px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; font-weight: 560; text-decoration: none; cursor: pointer; transition: border-color .15s ease, background .15s ease, transform .15s ease; }
.ddt-button:hover:not(:disabled) { border-color: #aeb3bb; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.ddt-button:active:not(:disabled) { transform: translateY(1px); }
.ddt-button:focus-visible { outline: 2px solid color-mix(in srgb, var(--ddt-accent) 70%, white); outline-offset: 2px; }
.ddt-button:disabled { cursor: not-allowed; opacity: .55; }
.ddt-button[data-kind="primary"] { color: #fff; border-color: var(--ddt-accent); background: var(--ddt-accent); }
.ddt-button[data-kind="primary"]:hover:not(:disabled) { border-color: var(--ddt-accent-deep); background: var(--ddt-accent-deep); }
.ddt-button[data-kind="danger"] { color: var(--ddt-error); }
.ddt-button[data-kind="quiet"] { min-height: 30px; padding: 0 10px; border-color: transparent; background: transparent; }
.ddt-card { overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.ddt-cardBody { padding: 24px; }
.ddt-empty { min-height: 230px; display: grid; grid-template-columns: minmax(0, 1fr) 180px; align-items: center; gap: 30px; }
.ddt-empty h3 { margin: 8px 0; font-size: 18px; }
.ddt-empty p { max-width: 560px; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.ddt-empty .ddt-actions { margin-top: 20px; }
.ddt-brandMark { width: 110px; height: 110px; display: grid; place-items: center; justify-self: center; border-radius: 28px; color: #fff; background: linear-gradient(145deg, #2997ff, var(--ddt-accent)); box-shadow: 0 18px 45px rgb(22 119 255 / 23%); }
.ddt-brandMark svg { filter: drop-shadow(0 3px 8px rgb(0 35 96 / 16%)); }
.ddt-qrLayout { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 34px; align-items: start; }
.ddt-qrColumn { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.ddt-qrFrame { position: relative; width: min(270px, 100%); aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; padding: 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 16px; background: #fff; }
.ddt-qrFrame::before { content: ''; position: absolute; inset: 6px; border: 1px solid rgb(22 119 255 / 10%); border-radius: 11px; pointer-events: none; }
.ddt-qrFrame img { display: block; width: 100%; height: 100%; object-fit: contain; }
.ddt-qrFallback { padding: 24px; color: #646a73; text-align: center; }
.ddt-expired { position: absolute; inset: 0; display: grid; place-items: center; padding: 30px; color: #fff; text-align: center; font-weight: 650; white-space: pre-line; background: rgb(31 35 41 / 76%); backdrop-filter: blur(3px); }
.ddt-countdown { width: min(270px, 100%); color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.ddt-countdownTop { display: flex; justify-content: space-between; margin-bottom: 6px; }
.ddt-countdown strong { color: var(--dsw-alias-label-primary, #1f2329); font-variant-numeric: tabular-nums; }
.ddt-progress { height: 4px; overflow: hidden; border-radius: 99px; background: #eef0f3; }
.ddt-progress span { display: block; width: var(--ddt-progress); height: 100%; background: var(--ddt-accent); transition: width .2s linear; }
.ddt-stateLabel { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; font-weight: 600; }
.ddt-qrCopy { min-width: 0; overflow-wrap: anywhere; }
.ddt-qrCopy h3 { margin: 9px 0 8px; font-size: 18px; }
.ddt-qrCopy > p { color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.ddt-steps { margin: 18px 0 16px; padding: 0; list-style: none; counter-reset: ddt-step; }
.ddt-steps li { position: relative; min-height: 28px; padding: 3px 0 3px 36px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 22px; counter-increment: ddt-step; }
.ddt-steps li::before { content: counter(ddt-step); position: absolute; left: 0; top: 1px; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 8px; color: var(--ddt-accent-deep); background: var(--ddt-accent-wash); font-size: 12px; font-weight: 700; }
.ddt-loading { padding: 38px; color: var(--dsw-alias-label-secondary, #646a73); text-align: center; }
.ddt-loading h3 { margin: 0 0 7px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; }
.ddt-loading p { line-height: 1.6; }
.ddt-spinner { width: 24px; height: 24px; margin: 0 auto 13px; border: 3px solid #e6e8eb; border-top-color: var(--ddt-accent); border-radius: 50%; animation: ddt-spin .8s linear infinite; }
.ddt-statusNotice, .ddt-inlineError { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--ddt-error) 28%, transparent); border-radius: 10px; color: var(--ddt-error); background: color-mix(in srgb, var(--ddt-error) 7%, transparent); font-size: 13px; }
.ddt-inlineError { flex-direction: column; padding: 22px; }
.ddt-inlineError h3 { font-size: 17px; }
.ddt-inlineError p { line-height: 1.55; }
.ddt-errorCode { font: 11px ui-monospace, SFMono-Regular, monospace; opacity: .8; }
.ddt-listHeading { display: flex; align-items: center; justify-content: space-between; margin: 2px 0 9px; }
.ddt-listHeading h3 { margin: 0; font-size: 14px; }
.ddt-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.ddt-accountTop { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.ddt-accountIdentity { min-width: 0; display: flex; align-items: center; gap: 12px; }
.ddt-avatar { width: 42px; height: 42px; display: grid; place-items: center; flex: none; border-radius: 12px; color: #fff; background: linear-gradient(145deg, #2997ff, var(--ddt-accent)); }
.ddt-accountIdentity h3 { overflow: hidden; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
.ddt-accountIdentity p { margin-top: 4px; color: var(--dsw-alias-label-secondary, #646a73); font: 12px ui-monospace, SFMono-Regular, monospace; }
.ddt-health { display: inline-flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; white-space: nowrap; }
.ddt-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 20px 0; }
.ddt-metric { min-width: 0; padding: 12px; border-radius: 9px; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.ddt-metric dt { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.ddt-metric dd { overflow: hidden; margin: 5px 0 0; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.ddt-accountFooter { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.ddt-accountFooter .ddt-actions { flex: none; flex-wrap: nowrap; gap: 8px; margin-top: 0; }
.ddt-accountFooter .ddt-button { flex: none; white-space: nowrap; }
.ddt-summary { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.ddt-confirm { padding: 18px 24px; border-top: 1px solid color-mix(in srgb, var(--ddt-error) 25%, transparent); background: color-mix(in srgb, var(--ddt-error) 5%, transparent); }
.ddt-confirm strong { display: block; margin-bottom: 6px; font-size: 14px; }
.ddt-confirm p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.55; }
.ddt-confirm .ddt-actions { margin-top: 13px; }
.ddt-visuallyHidden { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@keyframes ddt-spin { to { transform: rotate(360deg); } }
@container (max-width: 680px) {
  .ddt-heading { flex-direction: column; align-items: stretch; }
  .ddt-tools { width: 100%; flex-wrap: nowrap; gap: 6px; }
  .ddt-tools .ddt-badge { min-height: 34px; padding-inline: 8px; }
  .ddt-tools .ddt-button { flex: none; padding-inline: 10px; white-space: nowrap; }
  .ddt-empty { grid-template-columns: minmax(0, 1fr); }
  .ddt-brandMark { display: none; }
  .ddt-qrLayout { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 24px; }
  .ddt-qrColumn { width: 100%; min-width: 0; }
  .ddt-qrCopy { width: 100%; }
  .ddt-metrics { gap: 8px; }
  .ddt-metric { padding: 10px; }
}
@media (max-width: 720px) {
  .ddt-heading, .ddt-accountTop { flex-direction: column; align-items: stretch; }
  .ddt-heading p { white-space: normal; }
  .ddt-empty { grid-template-columns: minmax(0, 1fr); }
  .ddt-brandMark { display: none; }
  .ddt-qrLayout { grid-template-columns: minmax(0, 1fr); justify-items: center; }
  .ddt-qrCopy { width: 100%; }
  .ddt-cardBody { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .ddt-page *, .ddt-page *::before, .ddt-page *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
`;
function installDingtalkStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${DINGTALK_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-dingtalk";
  style.dataset.pluginCss = DINGTALK_STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/dingtalk/index.js
var ACTIVE_PROVISION_STATES = /* @__PURE__ */ new Set(["pending", "scanned", "authorizing", "creating", "connecting"]);
function DingtalkIcon({ size = 28 }) {
  return h2("svg", {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false"
  }, h2("path", {
    fill: "currentColor",
    d: "M37.05 22.783c-6.758-5.216-14.378-12.128-22.73-19.538-.655-.585-1.242-.354-1.536.42-1.88 4.973-.058 9.386 2.889 11.932s7.368 4.912 10.058 6.155c.105.049.013.203-.093.163-4.953-2.182-8.397-3.765-13.07-7.368-.497-.388-1.01-.242-1.07.521-.384 4.748 2.657 8.483 6.058 9.745 2.1.781 4.398 1.212 6.53 1.474.109.015.084.178-.027.178-2.747.01-6.058-.654-8.935-1.751-.606-.233-.818.25-.722.633.491 2.008 2.974 5.076 6.926 5.73a12 12 0 0 0 2.228.115c.164 0 .208.089.154.217q-2.685 4.6-2.803 4.797c-.091.152-.036.275.156.275h3.543c.164 0 .264.106.18.246l-4.958 8.196c-.191.328.035.565.395.301s15.212-11.133 15.636-11.448c.195-.142.148-.327-.124-.327h-3.18c-.206 0-.252-.14-.111-.28.14-.141 3.602-3.594 4.837-4.888 1.283-1.35 1.938-3.825-.231-5.498"
  }));
}
var Button = React4.forwardRef(function Button2({ children, kind = "secondary", className = "", ...props }, ref) {
  return h2("button", {
    ...props,
    ref,
    type: "button",
    className: `ddt-button ${className}`.trim(),
    "data-kind": kind
  }, children);
});
function Heading({ totals, adding, busy, onAdd, onCredential, credentialOpen, addButtonRef }) {
  return h2(
    "div",
    { className: "ddt-heading" },
    h2(
      "div",
      { className: "ddt-headingCopy" },
      h2("div", { className: "ddt-eyebrow" }, "Channel"),
      h2("h2", null, "\u9489\u9489\u673A\u5668\u4EBA"),
      h2("p", null, "\u901A\u8FC7\u626B\u7801\u628A\u9489\u9489\u673A\u5668\u4EBA\u63A5\u5165 DeepSeek Harness")
    ),
    h2(
      "div",
      { className: "ddt-tools" },
      h2(
        "div",
        { className: "dim-bindActions" },
        h2(Button, {
          kind: "primary",
          className: "dim-scanButton",
          onClick: onAdd,
          disabled: adding || busy,
          ref: addButtonRef,
          "aria-label": "\u626B\u7801\u63A5\u5165\u9489\u9489\u673A\u5668\u4EBA"
        }, h2(QrActionIcon), adding ? "\u6B63\u5728\u63A5\u5165" : "\u626B\u7801\u63A5\u5165\u673A\u5668\u4EBA"),
        h2(Button, {
          kind: "credential",
          className: "dim-credentialButton",
          onClick: onCredential,
          disabled: adding || busy,
          "aria-pressed": credentialOpen,
          "aria-label": "\u4F7F\u7528 Client ID \u548C Client Secret \u7ED1\u5B9A\u9489\u9489\u673A\u5668\u4EBA"
        }, h2(CredentialActionIcon), credentialOpen ? "\u6536\u8D77\u51ED\u636E" : "\u624B\u52A8\u63A5\u5165")
      ),
      totals.configured > 0 ? h2(
        "div",
        { className: "ddt-badge dim-onlineBadge" },
        h2("span", null, `${totals.connected} / ${totals.configured} \u5728\u7EBF`)
      ) : null
    )
  );
}
function LoadingView() {
  return h2(
    "div",
    { className: "ddt-card ddt-loading dim-surfaceCard dim-loadingView", "aria-busy": "true" },
    h2("div", { className: "ddt-spinner dim-spinner" }),
    h2("span", null, "\u6B63\u5728\u8BFB\u53D6\u9489\u9489\u8FDE\u63A5\u72B6\u6001\u2026")
  );
}
function EmptyView({ busy, onStart }) {
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-empty dim-surfaceBody dim-emptyView" },
      h2(
        "div",
        { className: "dim-emptyCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot" }),
          h2("span", null, "\u5C1A\u672A\u63A5\u5165\u9489\u9489\u673A\u5668\u4EBA")
        ),
        h2("h3", null, "\u626B\u4E00\u6B21\u7801\uFF0C\u81EA\u52A8\u521B\u5EFA\u5E76\u8FDE\u63A5\u673A\u5668\u4EBA"),
        h2("p", null, "\u6388\u6743\u7531\u9489\u9489\u5B98\u65B9\u9875\u9762\u5B8C\u6210\u3002\u626B\u7801\u8D26\u53F7\u5FC5\u987B\u5DF2\u52A0\u5165\u4E00\u4E2A\u4F01\u4E1A/\u7EC4\u7EC7\u5E76\u6709\u6743\u521B\u5EFA\u673A\u5668\u4EBA\uFF1B\u521B\u5EFA\u6210\u529F\u540E\uFF0C\u5E94\u7528\u51ED\u636E\u4F1A\u76F4\u63A5\u5199\u5165 Harness Host\u3002"),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(
            Button,
            { kind: "primary", onClick: onStart, disabled: busy },
            busy ? "\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026" : "\u751F\u6210\u9489\u9489\u4E8C\u7EF4\u7801"
          )
        )
      ),
      h2(
        "div",
        { className: "ddt-brandMark dim-emptyBrand", "aria-hidden": "true" },
        h2(DingtalkIcon, { size: 68 })
      )
    )
  );
}
function QrPanel({ provision, now, busy, onRefresh, onCancel }) {
  const [imageFailed, setImageFailed] = React4.useState(false);
  const source = safeQrSource(provision.qrCodeDataUrl);
  const remaining = Math.max(0, provision.expiresAt - now);
  const expired = remaining === 0 || provision.status === "expired";
  const duration = Math.max(1, provision.durationMs ?? 10 * 6e4);
  const progress = Math.round(Math.min(1, remaining / duration) * 100);
  React4.useEffect(() => setImageFailed(false), [source]);
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-qrLayout dim-surfaceBody dim-qrLayout" },
      h2(
        "div",
        { className: "ddt-qrColumn dim-qrColumn" },
        h2(
          "div",
          { className: "ddt-qrFrame dim-qrFrame" },
          source && !imageFailed ? h2("img", {
            src: source,
            alt: "\u7528\u4E8E\u628A\u9489\u9489\u673A\u5668\u4EBA\u63A5\u5165 DeepSeek Harness \u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801",
            onError: () => setImageFailed(true)
          }) : h2("div", { className: "ddt-qrFallback dim-qrFallback" }, "\u4E8C\u7EF4\u7801\u56FE\u7247\u672A\u5C31\u7EEA\uFF0C\u8BF7\u91CD\u65B0\u751F\u6210\u3002"),
          expired ? h2("div", { className: "ddt-expired dim-qrExpired" }, "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\n\u8BF7\u91CD\u65B0\u751F\u6210") : null
        ),
        h2(
          "div",
          { className: "ddt-countdown dim-countdown" },
          h2(
            "div",
            { className: "ddt-countdownTop dim-countdownTop" },
            h2("span", null, "\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4"),
            h2("strong", null, formatRemaining(remaining))
          ),
          h2(
            "div",
            { className: "ddt-progress dim-progress", "aria-hidden": "true" },
            h2("span", { style: { "--ddt-progress": `${progress}%` } })
          )
        )
      ),
      h2(
        "div",
        { className: "ddt-qrCopy dim-qrCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot", "data-tone": expired ? "error" : "warning" }),
          h2("span", null, expired ? "\u4E8C\u7EF4\u7801\u5DF2\u5931\u6548" : "\u7B49\u5F85\u9489\u9489\u626B\u7801\u6388\u6743")
        ),
        h2("h3", null, expired ? "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801\u540E\u7EE7\u7EED" : "\u4F7F\u7528\u9489\u9489 App \u5B8C\u6210\u673A\u5668\u4EBA\u6388\u6743"),
        h2("p", null, "\u626B\u7801\u8D26\u53F7\u5FC5\u987B\u5DF2\u52A0\u5165\u4F01\u4E1A/\u7EC4\u7EC7\u3002\u5982\u679C\u9489\u9489\u63D0\u793A\u5C1A\u672A\u52A0\u5165\u7EC4\u7EC7\uFF0C\u8BF7\u5728\u63D0\u793A\u9875\u521B\u5EFA\u7EC4\u7EC7\uFF0C\u6216\u6362\u7528\u5DF2\u52A0\u5165\u7EC4\u7EC7\u7684\u8D26\u53F7\u3002"),
        h2(
          "ol",
          { className: "ddt-steps dim-steps" },
          h2("li", null, "\u4F7F\u7528\u5DF2\u52A0\u5165\u4F01\u4E1A/\u7EC4\u7EC7\u7684\u9489\u9489\u8D26\u53F7\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801"),
          h2("li", null, "\u5728\u6388\u6743\u9875\u70B9\u51FB\u201C\u4E00\u952E\u521B\u5EFA\u65B0\u673A\u5668\u4EBA\u201D"),
          h2("li", null, "\u4FDD\u6301\u672C\u9875\u6253\u5F00\uFF0C\u7B49\u5F85\u673A\u5668\u4EBA\u81EA\u52A8\u8FDE\u63A5")
        ),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          expired ? h2(Button, { kind: "primary", onClick: onRefresh, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801") : null,
          !expired ? h2(Button, { onClick: onRefresh, disabled: busy }, "\u6362\u4E00\u4E2A\u4E8C\u7EF4\u7801") : null,
          h2(Button, { onClick: onCancel, disabled: busy }, "\u53D6\u6D88")
        )
      )
    )
  );
}
function ProgressPanel({ status, busy, onCancel }) {
  const connecting = status === "connecting";
  const creating = status === "creating";
  return h2(
    "div",
    { className: "ddt-card ddt-loading dim-surfaceCard dim-loadingView", "aria-busy": "true" },
    h2("div", { className: "ddt-spinner dim-spinner" }),
    h2("h3", null, connecting ? "\u673A\u5668\u4EBA\u5DF2\u521B\u5EFA\uFF0C\u6B63\u5728\u5EFA\u7ACB\u6D88\u606F\u8FDE\u63A5" : creating ? "\u6388\u6743\u5DF2\u786E\u8BA4\uFF0C\u6B63\u5728\u521B\u5EFA\u9489\u9489\u673A\u5668\u4EBA" : "\u6B63\u5728\u786E\u8BA4\u9489\u9489\u6388\u6743"),
    h2("p", null, connecting ? "\u6B63\u5728\u68C0\u67E5\u9489\u9489 Stream \u957F\u8FDE\u63A5\uFF0C\u6210\u529F\u540E\u4F1A\u81EA\u52A8\u663E\u793A\u4E3A\u5728\u7EBF\u3002" : "\u8BF7\u52FF\u5173\u95ED\u672C\u9875\uFF0C\u9489\u9489\u5B8C\u6210\u6388\u6743\u540E\u5C06\u81EA\u52A8\u7EE7\u7EED\u3002"),
    h2(
      "div",
      { className: "ddt-actions dim-viewActions", style: { justifyContent: "center", marginTop: 14 } },
      h2(Button, { onClick: onCancel, disabled: busy }, "\u53D6\u6D88\u63A5\u5165")
    )
  );
}
function ProvisionError({ provision, busy, onRetry, onClose }) {
  const error = provision.error ?? {
    code: "DINGTALK_PROVISION_FAILED",
    message: "\u9489\u9489\u673A\u5668\u4EBA\u6CA1\u6709\u63A5\u5165\u5B8C\u6210"
  };
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-inlineError dim-inlineError", role: "alert" },
      h2("h3", null, provision.status === "expired" ? "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F" : "\u9489\u9489\u673A\u5668\u4EBA\u6CA1\u6709\u63A5\u5165\u5B8C\u6210"),
      h2("p", null, error.message),
      h2("span", { className: "ddt-errorCode" }, error.code),
      h2(
        "div",
        { className: "ddt-actions dim-viewActions" },
        h2(Button, { kind: "primary", onClick: onRetry, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
        h2(Button, { onClick: onClose, disabled: busy }, "\u5173\u95ED")
      )
    )
  );
}
function checkedTime(value) {
  if (!value) return "\u5C1A\u672A\u68C0\u67E5";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(value));
  } catch {
    return "\u521A\u521A";
  }
}
function RemoveConfirmation({ account, busy, onConfirm, onCancel }) {
  const cancelRef = React4.useRef(null);
  React4.useEffect(() => cancelRef.current?.focus(), []);
  return h2(
    "div",
    {
      className: "ddt-confirm dim-confirm",
      role: "alertdialog",
      "aria-label": `\u79FB\u9664${account.bot.name}`,
      onKeyDown: (event) => {
        if (event.key === "Escape" && !busy) onCancel();
      }
    },
    h2("strong", null, `\u4ECE DeepSeek Harness \u79FB\u9664\u201C${account.bot.name}\u201D\uFF1F`),
    h2("p", null, "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684\u5E94\u7528\u51ED\u636E\u3001\u673A\u5668\u4EBA\u914D\u7F6E\u53CA\u4F1A\u8BDD\u6620\u5C04\u3002\u9489\u9489\u5F00\u653E\u5E73\u53F0\u4E2D\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\u3002"),
    h2(
      "div",
      { className: "ddt-actions dim-viewActions" },
      h2(Button, { ref: cancelRef, onClick: onCancel, disabled: busy }, "\u4FDD\u7559\u673A\u5668\u4EBA"),
      h2(
        Button,
        { kind: "danger", onClick: onConfirm, disabled: busy },
        busy ? "\u6B63\u5728\u79FB\u9664\u2026" : "\u786E\u8BA4\u79FB\u9664\u63A5\u5165"
      )
    )
  );
}
function AccountCard({
  account,
  busy,
  removing,
  onReconnect,
  onRequestRemove,
  onConfirmRemove,
  onCancelRemove
}) {
  const state = busy === "reconnect" ? "connecting" : account.state;
  const tone = account.connected ? "success" : state === "error" ? "error" : "warning";
  const stateLabel = account.connected ? "\u8FD0\u884C\u6B63\u5E38" : state === "connecting" ? "\u6B63\u5728\u8FDE\u63A5" : "\u8FDE\u63A5\u672A\u5C31\u7EEA";
  const summary = account.error?.message ?? (account.connected ? null : account.health.summary);
  return h2(
    "article",
    { className: "ddt-card dim-botCard", tabIndex: -1, "data-bot-id": account.botId },
    h2(
      "div",
      { className: "ddt-cardBody dim-botCardBody" },
      h2(
        "div",
        { className: "ddt-accountTop dim-botCardTop" },
        h2(
          "div",
          { className: "ddt-accountIdentity dim-botIdentity" },
          h2("div", { className: "ddt-avatar dim-botAvatar", "aria-hidden": "true" }, h2(DingtalkIcon, { size: 29 })),
          h2(
            "div",
            { className: "dim-botName" },
            h2("h3", { title: account.bot.name }, account.bot.name),
            h2("p", { title: account.bot.clientIdMasked }, account.bot.clientIdMasked)
          )
        ),
        h2(
          "div",
          { className: "ddt-health dim-botHealth" },
          h2("span", { className: "ddt-dot dim-healthDot", "data-tone": tone }),
          h2("span", null, stateLabel)
        )
      ),
      h2(
        "dl",
        { className: "ddt-metrics dim-botMetrics" },
        h2(
          "div",
          { className: "ddt-metric dim-botMetric" },
          h2("dt", null, "\u6D88\u606F\u901A\u9053"),
          h2("dd", null, account.connected ? "Stream \u957F\u8FDE\u63A5" : "\u79BB\u7EBF")
        ),
        h2(
          "div",
          { className: "ddt-metric dim-botMetric" },
          h2("dt", null, "\u6700\u8FD1\u68C0\u67E5"),
          h2("dd", null, checkedTime(account.health.lastCheckedAt))
        )
      ),
      h2(
        "div",
        { className: "ddt-accountFooter dim-cardFooter" },
        summary ? h2("div", { className: "ddt-summary dim-cardSummary" }, summary) : null,
        h2(
          "div",
          { className: "ddt-actions dim-cardActions" },
          h2(
            Button,
            { className: "dim-cardAction", onClick: onReconnect, disabled: Boolean(busy) },
            busy === "reconnect" ? "\u68C0\u67E5\u4E2D\u2026" : account.connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"
          ),
          h2(
            Button,
            { className: "dim-cardAction", kind: "danger", onClick: onRequestRemove, disabled: Boolean(busy) },
            "\u79FB\u9664\u63A5\u5165"
          )
        )
      )
    ),
    removing ? h2(RemoveConfirmation, {
      account,
      busy: busy === "delete",
      onConfirm: onConfirmRemove,
      onCancel: onCancelRemove
    }) : null
  );
}
function AccountList(props) {
  return h2(
    "section",
    { className: "dim-listSection" },
    h2(
      "div",
      { className: "ddt-listHeading dim-listHeading" },
      h2("h3", null, "\u5DF2\u63A5\u5165\u7684\u9489\u9489\u673A\u5668\u4EBA")
    ),
    h2("ul", { className: "ddt-list dim-botList" }, props.bots.map((account) => h2(
      "li",
      { key: account.botId },
      h2(AccountCard, {
        account,
        busy: props.busyByBot[account.botId],
        removing: props.removeTarget === account.botId,
        onReconnect: () => props.onReconnect(account),
        onRequestRemove: () => props.onRequestRemove(account),
        onConfirmRemove: () => props.onConfirmRemove(account),
        onCancelRemove: props.onCancelRemove
      })
    )))
  );
}
var EMPTY_TOTALS = Object.freeze({ configured: 0, connected: 0 });
function DingtalkSettingsTab({ rpcCall }) {
  const [model, setModel] = React4.useState({
    phase: "loading",
    bots: [],
    totals: EMPTY_TOTALS,
    revision: 0,
    error: null
  });
  const [provision, setProvision] = React4.useState(null);
  const [busy, setBusy] = React4.useState(false);
  const [busyByBot, setBusyByBot] = React4.useState({});
  const [removeTarget, setRemoveTarget] = React4.useState(null);
  const [credentialOpen, setCredentialOpen] = React4.useState(false);
  const [credentialError, setCredentialError] = React4.useState(null);
  const [notice, setNotice] = React4.useState("");
  const [now, setNow] = React4.useState(() => Date.now());
  const addButtonRef = React4.useRef(null);
  const mountedRef = React4.useRef(true);
  const statusRequestRef = React4.useRef(0);
  const noticeFrameRef = React4.useRef(null);
  const focusFrameRef = React4.useRef(null);
  React4.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      statusRequestRef.current += 1;
      if (noticeFrameRef.current !== null) {
        window.cancelAnimationFrame(noticeFrameRef.current);
        noticeFrameRef.current = null;
      }
      if (focusFrameRef.current !== null) {
        window.cancelAnimationFrame(focusFrameRef.current);
        focusFrameRef.current = null;
      }
    };
  }, []);
  React4.useEffect(() => installDingtalkStyles(), []);
  const announce = React4.useCallback((message) => {
    if (!mountedRef.current) return;
    if (noticeFrameRef.current !== null) {
      window.cancelAnimationFrame(noticeFrameRef.current);
      noticeFrameRef.current = null;
    }
    setNotice("");
    if (message) {
      noticeFrameRef.current = window.requestAnimationFrame(() => {
        noticeFrameRef.current = null;
        if (mountedRef.current) setNotice(message);
      });
    }
  }, []);
  const focusAddButton = React4.useCallback(() => {
    if (!mountedRef.current) return;
    if (focusFrameRef.current !== null) window.cancelAnimationFrame(focusFrameRef.current);
    focusFrameRef.current = window.requestAnimationFrame(() => {
      focusFrameRef.current = null;
      if (mountedRef.current) addButtonRef.current?.focus();
    });
  }, []);
  const invoke = React4.useCallback(async (endpoint, payload = {}, signal) => {
    if (typeof rpcCall !== "function") throw new TypeError("\u9489\u9489\u8BBE\u7F6E\u9875\u7F3A\u5C11 RPC \u8FDE\u63A5");
    return unwrapRpcResult(await rpcCall(endpoint, payload, signal));
  }, [rpcCall]);
  const loadStatus = React4.useCallback(async ({
    signal,
    silent = false,
    restoreProvisioning = false
  } = {}) => {
    if (!mountedRef.current || signal?.aborted) return void 0;
    const requestId = statusRequestRef.current + 1;
    statusRequestRef.current = requestId;
    const canCommit = () => mountedRef.current && !signal?.aborted && statusRequestRef.current === requestId;
    if (!silent && canCommit()) {
      setModel((current) => ({ ...current, phase: "loading", error: null }));
    }
    try {
      const snapshot = normalizeSnapshot(await invoke(DINGTALK_ENDPOINTS.status, {}, signal));
      if (!canCommit()) return void 0;
      setModel({
        phase: "ready",
        bots: snapshot.bots,
        totals: snapshot.totals,
        revision: snapshot.revision,
        error: null
      });
      if (restoreProvisioning && snapshot.provisioning) {
        setProvision((current) => !current || current.attemptId === snapshot.provisioning.attemptId ? {
          ...current,
          ...snapshot.provisioning,
          durationMs: current?.durationMs ?? Math.max(1, snapshot.provisioning.expiresAt - Date.now())
        } : current);
      }
      return snapshot;
    } catch (error) {
      if (error?.name === "AbortError" || !canCommit()) return void 0;
      setModel((current) => ({
        ...current,
        phase: silent && current.phase === "ready" ? "ready" : "error",
        error: presentError(error)
      }));
      return void 0;
    }
  }, [invoke]);
  React4.useEffect(() => {
    const controller = new AbortController();
    void loadStatus({ signal: controller.signal, restoreProvisioning: true });
    return () => controller.abort();
  }, [loadStatus]);
  React4.useEffect(() => {
    if (model.phase !== "ready") return void 0;
    const controller = new AbortController();
    let running = false;
    const timer = window.setInterval(async () => {
      if (running || controller.signal.aborted || !mountedRef.current) return;
      running = true;
      await loadStatus({
        signal: controller.signal,
        silent: true,
        restoreProvisioning: false
      });
      running = false;
    }, 15e3);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadStatus, model.phase]);
  React4.useEffect(() => {
    if (!provision || !ACTIVE_PROVISION_STATES.has(provision.status)) return void 0;
    const timer = window.setInterval(() => {
      if (mountedRef.current) setNow(Date.now());
    }, 1e3);
    return () => window.clearInterval(timer);
  }, [provision?.attemptId, provision?.status]);
  const startProvisioning = React4.useCallback(async ({ replace = false } = {}) => {
    if (!mountedRef.current) return;
    setCredentialOpen(false);
    setCredentialError(null);
    setBusy(true);
    try {
      if (replace && provision?.attemptId) {
        await invoke(DINGTALK_ENDPOINTS.cancelProvisioning, {
          attemptId: provision.attemptId
        });
        if (!mountedRef.current) return;
      }
      setProvision({ status: "starting" });
      const started = normalizeProvisioning(await invoke(
        DINGTALK_ENDPOINTS.beginProvisioning,
        { locale: "zh-CN" }
      ));
      if (!mountedRef.current) return;
      if (!started.qrCodeDataUrl) {
        throw new Error("\u9489\u9489\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u5B89\u5168\u7684\u4E8C\u7EF4\u7801");
      }
      setNow(Date.now());
      setProvision({
        ...started,
        durationMs: Math.max(1, started.expiresAt - Date.now())
      });
      announce("\u9489\u9489\u4E8C\u7EF4\u7801\u5DF2\u751F\u6210\uFF0C\u8BF7\u4F7F\u7528\u9489\u9489 App \u626B\u63CF\u3002");
    } catch (error) {
      if (!mountedRef.current) return;
      setProvision({
        attemptId: provision?.attemptId,
        status: "failed",
        error: presentError(error)
      });
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }, [announce, invoke, provision?.attemptId]);
  const bindCredentials = React4.useCallback(async ({ identity, secret }) => {
    if (!mountedRef.current) return;
    setBusy(true);
    setCredentialError(null);
    try {
      const snapshot = normalizeSnapshot(await invoke(
        DINGTALK_ENDPOINTS.bindCredentials,
        { clientId: identity, clientSecret: secret }
      ));
      if (!mountedRef.current) return;
      setModel({
        phase: "ready",
        bots: snapshot.bots,
        totals: snapshot.totals,
        revision: snapshot.revision,
        error: null
      });
      setCredentialOpen(false);
      announce("\u9489\u9489\u673A\u5668\u4EBA\u51ED\u636E\u5DF2\u7ED1\u5B9A\u3002");
    } catch (error) {
      if (mountedRef.current) setCredentialError(presentError(error));
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }, [announce, invoke]);
  const cancelProvisioning = React4.useCallback(async () => {
    if (!mountedRef.current) return;
    setBusy(true);
    try {
      if (provision?.attemptId && !["failed", "expired", "cancelled"].includes(provision.status)) {
        await invoke(DINGTALK_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
        if (!mountedRef.current) return;
      }
      setProvision(null);
      announce("\u5DF2\u53D6\u6D88\u9489\u9489\u673A\u5668\u4EBA\u63A5\u5165\u3002");
      focusAddButton();
    } catch (error) {
      if (!mountedRef.current) return;
      setProvision((current) => ({ ...current, status: "failed", error: presentError(error) }));
    } finally {
      if (mountedRef.current) setBusy(false);
    }
  }, [announce, focusAddButton, invoke, provision?.attemptId, provision?.status]);
  React4.useEffect(() => {
    const attemptId = provision?.attemptId;
    if (!attemptId || !ACTIVE_PROVISION_STATES.has(provision.status)) return void 0;
    const controller = new AbortController();
    let disposed = false;
    let timer = null;
    const canCommit = () => !disposed && !controller.signal.aborted && mountedRef.current;
    const schedule = (delay) => {
      if (!canCommit()) return;
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = null;
        if (canCommit()) void poll();
      }, delay);
    };
    const poll = async () => {
      try {
        const response = await invoke(
          DINGTALK_ENDPOINTS.pollProvisioning,
          { attemptId },
          controller.signal
        );
        if (!canCommit()) return;
        const result = normalizeProvisioning(response);
        if (result.status === "connected") {
          const snapshot = await loadStatus({
            signal: controller.signal,
            silent: true,
            restoreProvisioning: false
          });
          if (!canCommit()) return;
          const account = result.botId ? snapshot?.bots.find((bot) => bot.botId === result.botId) : snapshot?.bots.find((bot) => bot.connected);
          if (!account?.connected) {
            setProvision((current) => current?.attemptId === attemptId ? { ...current, ...result, status: "connecting" } : current);
            schedule(result.pollIntervalMs);
            return;
          }
          setProvision(null);
          announce(result.alreadyConnected ? "\u8FD9\u4E2A\u9489\u9489\u673A\u5668\u4EBA\u5DF2\u7ECF\u63A5\u5165\u5E76\u4FDD\u6301\u5728\u7EBF\u3002" : "\u9489\u9489\u673A\u5668\u4EBA\u5DF2\u63A5\u5165\uFF0C\u53EF\u4EE5\u5F00\u59CB\u53D1\u9001\u6D88\u606F\u3002");
          return;
        }
        if (!canCommit()) return;
        setProvision((current) => current?.attemptId === attemptId ? { ...current, ...result, durationMs: current.durationMs } : current);
        if (ACTIVE_PROVISION_STATES.has(result.status)) {
          schedule(result.pollIntervalMs);
        }
      } catch (error) {
        if (error?.name === "AbortError" || !canCommit()) return;
        setProvision((current) => current?.attemptId === attemptId ? { ...current, status: "failed", error: presentError(error) } : current);
      }
    };
    schedule(provision.pollIntervalMs ?? 3e3);
    return () => {
      disposed = true;
      controller.abort();
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    };
  }, [announce, invoke, loadStatus, provision?.attemptId, provision?.pollIntervalMs, provision?.status]);
  const setBotBusy = React4.useCallback((botId, operation) => {
    if (!mountedRef.current) return;
    setBusyByBot((current) => {
      const next = { ...current };
      if (operation) next[botId] = operation;
      else delete next[botId];
      return next;
    });
  }, []);
  const runBotAction = React4.useCallback(async ({ account, operation, endpoint, payload, success }) => {
    if (!mountedRef.current) return void 0;
    setBotBusy(account.botId, operation);
    try {
      await invoke(endpoint, payload);
      if (!mountedRef.current) return void 0;
      const snapshot = await loadStatus({ silent: true, restoreProvisioning: false });
      if (!mountedRef.current) return void 0;
      announce(typeof success === "function" ? success(snapshot) : success);
      return snapshot;
    } catch (error) {
      if (!mountedRef.current) return void 0;
      announce(`\u64CD\u4F5C\u5931\u8D25\uFF1A${presentError(error).message}`);
      return void 0;
    } finally {
      if (mountedRef.current) setBotBusy(account.botId, null);
    }
  }, [announce, invoke, loadStatus, setBotBusy]);
  const reconnect = React4.useCallback((account) => runBotAction({
    account,
    operation: "reconnect",
    endpoint: DINGTALK_ENDPOINTS.reconnectBot,
    payload: { botId: account.botId },
    success: (snapshot) => snapshot?.bots.find((bot) => bot.botId === account.botId)?.connected ? "\u9489\u9489\u8FDE\u63A5\u68C0\u67E5\u5B8C\u6210\u3002" : "\u9489\u9489\u4ECD\u672A\u8FDE\u63A5\uFF0C\u63D2\u4EF6\u4F1A\u7EE7\u7EED\u81EA\u52A8\u91CD\u8BD5\u3002"
  }), [runBotAction]);
  const remove = React4.useCallback(async (account) => {
    const snapshot = await runBotAction({
      account,
      operation: "delete",
      endpoint: DINGTALK_ENDPOINTS.deleteBot,
      payload: { botId: account.botId, confirm: true },
      success: "\u9489\u9489\u673A\u5668\u4EBA\u53CA\u672C\u673A\u51ED\u636E\u5DF2\u79FB\u9664\u3002"
    });
    if (snapshot && mountedRef.current) setRemoveTarget(null);
  }, [runBotAction]);
  let provisionView = null;
  if (provision?.status === "starting") {
    provisionView = h2(
      "div",
      { className: "ddt-card ddt-loading", "aria-busy": "true" },
      h2("div", { className: "ddt-spinner" }),
      h2("span", null, "\u6B63\u5728\u7533\u8BF7\u9489\u9489\u6388\u6743\u4E8C\u7EF4\u7801\u2026")
    );
  } else if (provision?.status === "pending") {
    provisionView = h2(QrPanel, {
      provision,
      now,
      busy,
      onRefresh: () => void startProvisioning({ replace: true }),
      onCancel: () => void cancelProvisioning()
    });
  } else if (["scanned", "authorizing", "creating", "connecting"].includes(provision?.status)) {
    provisionView = h2(ProgressPanel, {
      status: provision.status,
      busy,
      onCancel: () => void cancelProvisioning()
    });
  } else if (provision && ["failed", "expired", "cancelled"].includes(provision.status)) {
    provisionView = h2(ProvisionError, {
      provision,
      busy,
      onRetry: () => void startProvisioning({ replace: Boolean(provision.attemptId) }),
      onClose: () => void cancelProvisioning()
    });
  }
  const credentialView = credentialOpen ? h2(CredentialBindingPanel, {
    channel: "\u9489\u9489",
    identityLabel: "Client ID",
    identityPlaceholder: "\u586B\u5199\u9489\u9489\u5E94\u7528 Client ID",
    secretLabel: "Client Secret",
    secretPlaceholder: "\u586B\u5199\u9489\u9489\u5E94\u7528 Client Secret",
    busy,
    error: credentialError,
    onSubmit: bindCredentials,
    onCancel: () => {
      setCredentialOpen(false);
      setCredentialError(null);
    }
  }) : null;
  return h2(
    "section",
    { className: "ddt-page dim-channelPage", "aria-label": "\u9489\u9489\u8BBE\u7F6E" },
    h2(Heading, {
      totals: model.totals,
      adding: Boolean(provision),
      busy,
      onAdd: () => void startProvisioning(),
      onCredential: () => {
        setCredentialOpen((value) => !value);
        setCredentialError(null);
      },
      credentialOpen,
      addButtonRef
    }),
    h2("div", { className: "ddt-visuallyHidden", role: "status", "aria-live": "polite" }, notice),
    model.error && model.phase === "ready" ? h2("div", { className: "ddt-statusNotice dim-statusNotice", role: "alert" }, `\u72B6\u6001\u5237\u65B0\u5931\u8D25\uFF1A${model.error.message}`) : null,
    model.phase === "loading" ? h2(LoadingView) : model.phase === "error" ? h2(
      "div",
      { className: "ddt-card dim-surfaceCard" },
      h2(
        "div",
        { className: "ddt-inlineError dim-inlineError", role: "alert" },
        h2("h3", null, "\u65E0\u6CD5\u8BFB\u53D6\u9489\u9489\u673A\u5668\u4EBA\u72B6\u6001"),
        h2("p", null, model.error?.message ?? "\u8BF7\u7A0D\u540E\u91CD\u8BD5"),
        h2(Button, { onClick: () => void loadStatus() }, "\u91CD\u65B0\u8BFB\u53D6")
      )
    ) : h2(
      React4.Fragment,
      null,
      credentialView,
      provisionView,
      model.bots.length === 0 && !provision && !credentialOpen ? h2(EmptyView, { busy, onStart: () => void startProvisioning() }) : null,
      model.bots.length > 0 ? h2(AccountList, {
        bots: model.bots,
        busyByBot,
        removeTarget,
        onReconnect: (account) => void reconnect(account),
        onRequestRemove: (account) => setRemoveTarget(account.botId),
        onConfirmRemove: (account) => void remove(account),
        onCancelRemove: () => setRemoveTarget(null)
      }) : null
    )
  );
}

// plugin-src/client/channels/shared/token-api.js
var ACCOUNT_STATES2 = /* @__PURE__ */ new Set(["connected", "connecting", "offline", "error"]);
function isRecord2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function text(value, fallback, max = 240) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}
function id(value) {
  const result = text(value, "", 128);
  return /^[a-z\d_-]+$/i.test(result) ? result : void 0;
}
function timestamp2(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = typeof value === "string" ? Date.parse(value) : Number.NaN;
  return Number.isNaN(parsed) ? void 0 : parsed;
}
var TOKEN_BOT_ENDPOINTS = Object.freeze({
  status: "connection.status",
  bindCredentials: "bot.bind-credentials",
  reconnectBot: "bot.reconnect",
  deleteBot: "bot.delete"
});
function createTokenChannelApi(channel4, connectionSummary) {
  const unwrapRpcResult10 = (result) => {
    if (!isRecord2(result) || typeof result.ok !== "boolean") {
      throw new Error(`${channel4} \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94`);
    }
    if (!result.ok) {
      const error = new Error(text(result.error?.message, `${channel4} \u64CD\u4F5C\u5931\u8D25`));
      error.code = text(result.error?.code, `${channel4.toUpperCase()}_RPC_ERROR`, 80);
      throw error;
    }
    return result.value;
  };
  const normalizeBot7 = (value) => {
    if (!isRecord2(value) || !id(value.botId)) return void 0;
    const connected = value.connected === true;
    const state = ACCOUNT_STATES2.has(value.state) ? value.state : "offline";
    return {
      botId: id(value.botId),
      connected,
      state: connected ? "connected" : state,
      bot: {
        name: text(value.bot?.name, `${channel4}\u673A\u5668\u4EBA`, 100),
        username: text(value.bot?.username, "", 100),
        idMasked: text(value.bot?.idMasked, "\u673A\u5668\u4EBA\u6807\u8BC6\u5DF2\u5B89\u5168\u4FDD\u5B58", 140)
      },
      health: {
        summary: text(
          value.health?.summary,
          connected ? `${channel4}${connectionSummary}\u8FD0\u884C\u6B63\u5E38` : `${channel4}\u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA`
        ),
        lastCheckedAt: timestamp2(value.health?.lastCheckedAt)
      },
      error: isRecord2(value.error) ? {
        code: text(value.error.code, `${channel4.toUpperCase()}_ACCOUNT_ERROR`, 80),
        message: text(value.error.message, `${channel4}\u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA`)
      } : null
    };
  };
  const normalizeSnapshot9 = (value) => {
    const source = isRecord2(value?.snapshot) ? value.snapshot : value;
    if (!isRecord2(source) || !Array.isArray(source.bots)) {
      throw new Error(`${channel4} \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868`);
    }
    const bots = source.bots.map(normalizeBot7).filter(Boolean);
    return {
      revision: Number.isSafeInteger(source.revision) ? source.revision : 0,
      bots,
      totals: { configured: bots.length, connected: bots.filter((bot) => bot.connected).length }
    };
  };
  const presentError10 = (error) => ({
    code: text(error?.code, `${channel4.toUpperCase()}_ERROR`, 80),
    message: text(error?.message, `${channel4}\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5`)
  });
  return Object.freeze({ unwrapRpcResult: unwrapRpcResult10, normalizeSnapshot: normalizeSnapshot9, presentError: presentError10 });
}

// plugin-src/client/channels/discord/api.js
var DISCORD_RPC_CHANNEL = "/discord";
var DISCORD_ENDPOINTS = TOKEN_BOT_ENDPOINTS;
var api = createTokenChannelApi("Discord", " Gateway \u957F\u8FDE\u63A5");
var unwrapRpcResult2 = api.unwrapRpcResult;
var normalizeSnapshot2 = api.normalizeSnapshot;
var presentError2 = api.presentError;

// plugin-src/client/channels/shared/token-channel.js
var React5 = __toESM(require("react"), 1);
var Button3 = React5.forwardRef(function Button4({ children, kind = "secondary", className = "", ...props }, ref) {
  return h2("button", {
    ...props,
    ref,
    type: "button",
    className: `ddt-button ${className}`.trim(),
    "data-kind": kind
  }, children);
});
function checkedTime2(value) {
  if (!value) return "\u5C1A\u672A\u68C0\u67E5";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(value));
  } catch {
    return "\u521A\u521A";
  }
}
function createTokenChannelSettings(definition) {
  const {
    channel: channel4,
    endpoints,
    api: api4,
    LogoGlyph,
    installStyles,
    pageClass,
    avatarClass,
    connectionLabel,
    tokenPlaceholder,
    emptyTitle,
    emptyDescription,
    platformLabel,
    CredentialPanel = null,
    credentialPayload = ({ secret }) => ({ token: secret }),
    credentialAriaLabel = `\u4F7F\u7528 Bot Token \u63A5\u5165 ${channel4} \u673A\u5668\u4EBA`,
    credentialOpenLabel = "\u624B\u52A8\u63A5\u5165",
    credentialCloseLabel = "\u6536\u8D77\u51ED\u636E",
    credentialNoun = "Bot Token",
    emptyActionLabel = "\u586B\u5199 Bot Token"
  } = definition;
  function AccountCard5({ account, busy, removing, onReconnect, onRequestRemove, onConfirmRemove, onCancelRemove }) {
    const state = busy === "reconnect" ? "connecting" : account.state;
    const tone = account.connected ? "success" : state === "error" ? "error" : "warning";
    const stateLabel = account.connected ? "\u8FD0\u884C\u6B63\u5E38" : state === "connecting" ? "\u6B63\u5728\u8FDE\u63A5" : "\u8FDE\u63A5\u672A\u5C31\u7EEA";
    const summary = account.error?.message ?? (account.connected ? null : account.health.summary);
    const identity = account.bot.username ? `@${account.bot.username}` : account.bot.idMasked;
    return h2(
      "article",
      { className: "ddt-card dim-botCard", "data-bot-id": account.botId },
      h2(
        "div",
        { className: "ddt-cardBody dim-botCardBody" },
        h2(
          "div",
          { className: "ddt-accountTop dim-botCardTop" },
          h2(
            "div",
            { className: "ddt-accountIdentity dim-botIdentity" },
            h2(
              "div",
              { className: `ddt-avatar dim-botAvatar ${avatarClass}`, "aria-hidden": "true" },
              h2(LogoGlyph, { size: 29 })
            ),
            h2(
              "div",
              { className: "dim-botName" },
              h2("h3", null, account.bot.name),
              h2("p", null, identity)
            )
          ),
          h2(
            "div",
            { className: "ddt-health dim-botHealth" },
            h2("span", { className: "ddt-dot dim-healthDot", "data-tone": tone }),
            h2("span", null, stateLabel)
          )
        ),
        h2(
          "dl",
          { className: "ddt-metrics dim-botMetrics" },
          h2(
            "div",
            { className: "ddt-metric dim-botMetric" },
            h2("dt", null, "\u6D88\u606F\u901A\u9053"),
            h2("dd", null, account.connected ? connectionLabel : "\u79BB\u7EBF")
          ),
          h2(
            "div",
            { className: "ddt-metric dim-botMetric" },
            h2("dt", null, "\u6700\u8FD1\u68C0\u67E5"),
            h2("dd", null, checkedTime2(account.health.lastCheckedAt))
          )
        ),
        h2(
          "div",
          { className: "ddt-accountFooter dim-cardFooter" },
          summary ? h2("div", { className: "ddt-summary dim-cardSummary" }, summary) : null,
          h2(
            "div",
            { className: "ddt-actions dim-cardActions" },
            h2(Button3, {
              className: "dim-cardAction",
              onClick: onReconnect,
              disabled: Boolean(busy)
            }, busy === "reconnect" ? "\u68C0\u67E5\u4E2D\u2026" : account.connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"),
            h2(Button3, {
              className: "dim-cardAction",
              kind: "danger",
              onClick: onRequestRemove,
              disabled: Boolean(busy)
            }, "\u79FB\u9664\u63A5\u5165")
          )
        )
      ),
      removing ? h2(
        "div",
        { className: "ddt-confirm dim-confirm", role: "alertdialog" },
        h2("strong", null, `\u4ECE DeepSeek Harness \u79FB\u9664\u201C${account.bot.name}\u201D\uFF1F`),
        h2("p", null, `\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684 ${credentialNoun}\u3001\u673A\u5668\u4EBA\u914D\u7F6E\u53CA\u4F1A\u8BDD\u6620\u5C04\u3002${platformLabel}\u4E2D\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\u3002`),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(Button3, { onClick: onCancelRemove, disabled: Boolean(busy) }, "\u4FDD\u7559\u673A\u5668\u4EBA"),
          h2(
            Button3,
            { kind: "danger", onClick: onConfirmRemove, disabled: Boolean(busy) },
            busy === "delete" ? "\u6B63\u5728\u79FB\u9664\u2026" : "\u786E\u8BA4\u79FB\u9664\u63A5\u5165"
          )
        )
      ) : null
    );
  }
  function SettingsTab({ rpcCall }) {
    const [model, setModel] = React5.useState({
      phase: "loading",
      bots: [],
      totals: { configured: 0, connected: 0 },
      error: null
    });
    const [credentialOpen, setCredentialOpen] = React5.useState(false);
    const [credentialError, setCredentialError] = React5.useState(null);
    const [busy, setBusy] = React5.useState(false);
    const [busyByBot, setBusyByBot] = React5.useState({});
    const [removeTarget, setRemoveTarget] = React5.useState(null);
    const mounted = React5.useRef(true);
    React5.useEffect(() => {
      const disposeDingtalk = installDingtalkStyles();
      const disposeChannel = installStyles();
      mounted.current = true;
      return () => {
        mounted.current = false;
        disposeChannel();
        disposeDingtalk();
      };
    }, []);
    const invoke = React5.useCallback(async (endpoint, payload = {}, signal) => {
      if (typeof rpcCall !== "function") throw new TypeError(`${channel4} \u8BBE\u7F6E\u9875\u7F3A\u5C11 RPC \u8FDE\u63A5`);
      return api4.unwrapRpcResult(await rpcCall(endpoint, payload, signal));
    }, [rpcCall]);
    const loadStatus = React5.useCallback(async ({ signal, silent = false } = {}) => {
      if (!silent && mounted.current) setModel((current) => ({ ...current, phase: "loading", error: null }));
      try {
        const snapshot = api4.normalizeSnapshot(await invoke(endpoints.status, {}, signal));
        if (!mounted.current || signal?.aborted) return;
        setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      } catch (error) {
        if (error?.name !== "AbortError" && mounted.current && !signal?.aborted) {
          setModel((current) => ({
            ...current,
            phase: silent ? current.phase : "error",
            error: api4.presentError(error)
          }));
        }
      }
    }, [invoke]);
    React5.useEffect(() => {
      const controller = new AbortController();
      void loadStatus({ signal: controller.signal });
      return () => controller.abort();
    }, [loadStatus]);
    React5.useEffect(() => {
      if (model.phase !== "ready") return void 0;
      const controller = new AbortController();
      const timer = window.setInterval(
        () => void loadStatus({ signal: controller.signal, silent: true }),
        15e3
      );
      return () => {
        controller.abort();
        window.clearInterval(timer);
      };
    }, [loadStatus, model.phase]);
    const bindCredentials = React5.useCallback(async (values) => {
      setBusy(true);
      setCredentialError(null);
      try {
        const snapshot = api4.normalizeSnapshot(await invoke(
          endpoints.bindCredentials,
          credentialPayload(values)
        ));
        if (!mounted.current) return;
        setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
        setCredentialOpen(false);
      } catch (error) {
        if (mounted.current) setCredentialError(api4.presentError(error));
      } finally {
        if (mounted.current) setBusy(false);
      }
    }, [invoke]);
    const botAction = React5.useCallback(async (account, operation, endpoint, payload) => {
      setBusyByBot((current) => ({ ...current, [account.botId]: operation }));
      try {
        const snapshot = api4.normalizeSnapshot(await invoke(endpoint, payload));
        if (mounted.current) {
          setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
        }
      } finally {
        if (mounted.current) setBusyByBot((current) => {
          const next = { ...current };
          delete next[account.botId];
          return next;
        });
      }
    }, [invoke]);
    const botList = model.bots.length > 0 ? h2(
      "section",
      { className: "dim-listSection" },
      h2(
        "div",
        { className: "ddt-listHeading dim-listHeading" },
        h2("h3", null, `\u5DF2\u63A5\u5165\u7684 ${channel4} \u673A\u5668\u4EBA`)
      ),
      h2("ul", { className: "ddt-list dim-botList" }, model.bots.map((account) => h2("li", { key: account.botId }, h2(AccountCard5, {
        account,
        busy: busyByBot[account.botId],
        removing: removeTarget === account.botId,
        onReconnect: () => void botAction(
          account,
          "reconnect",
          endpoints.reconnectBot,
          { botId: account.botId }
        ),
        onRequestRemove: () => setRemoveTarget(account.botId),
        onCancelRemove: () => setRemoveTarget(null),
        onConfirmRemove: async () => {
          await botAction(account, "delete", endpoints.deleteBot, {
            botId: account.botId,
            confirm: true
          });
          if (mounted.current) setRemoveTarget(null);
        }
      }))))
    ) : null;
    return h2(
      "section",
      {
        className: `ddt-page ${pageClass} dim-channelPage`,
        "aria-label": `${channel4} \u8BBE\u7F6E`
      },
      h2(
        "div",
        { className: "ddt-heading" },
        h2(
          "div",
          { className: "ddt-tools" },
          h2(
            "div",
            { className: "dim-bindActions" },
            h2(Button3, {
              kind: "credential",
              className: "dim-credentialButton",
              onClick: () => {
                setCredentialOpen((value) => !value);
                setCredentialError(null);
              },
              disabled: busy,
              "aria-pressed": credentialOpen,
              "aria-label": credentialAriaLabel
            }, h2(CredentialActionIcon), credentialOpen ? credentialCloseLabel : credentialOpenLabel)
          ),
          model.totals.configured > 0 ? h2(
            "div",
            { className: "ddt-badge dim-onlineBadge" },
            h2("span", null, `${model.totals.connected} / ${model.totals.configured} \u5728\u7EBF`)
          ) : null
        )
      ),
      model.phase === "loading" ? h2("div", {
        className: "ddt-card ddt-loading dim-surfaceCard dim-loadingView",
        "aria-busy": "true"
      }, h2("div", { className: "ddt-spinner dim-spinner" }), `\u6B63\u5728\u8BFB\u53D6 ${channel4} \u673A\u5668\u4EBA\u72B6\u6001\u2026`) : model.phase === "error" ? h2(
        "div",
        { className: "ddt-card dim-surfaceCard" },
        h2(
          "div",
          { className: "ddt-inlineError dim-inlineError" },
          h2("h3", null, `\u65E0\u6CD5\u8BFB\u53D6 ${channel4} \u673A\u5668\u4EBA\u72B6\u6001`),
          h2("p", null, model.error?.message),
          h2(Button3, { onClick: () => void loadStatus() }, "\u91CD\u65B0\u8BFB\u53D6")
        )
      ) : h2(
        React5.Fragment,
        null,
        credentialOpen ? CredentialPanel ? h2(CredentialPanel, {
          busy,
          error: credentialError,
          onSubmit: bindCredentials,
          onCancel: () => {
            setCredentialOpen(false);
            setCredentialError(null);
          }
        }) : h2(CredentialBindingPanel, {
          channel: channel4,
          secretLabel: "Bot Token",
          secretPlaceholder: tokenPlaceholder,
          busy,
          error: credentialError,
          onSubmit: bindCredentials,
          onCancel: () => {
            setCredentialOpen(false);
            setCredentialError(null);
          }
        }) : null,
        model.bots.length === 0 && !credentialOpen ? h2(
          "div",
          { className: "ddt-card dim-surfaceCard" },
          h2(
            "div",
            { className: "ddt-cardBody ddt-empty dim-surfaceBody dim-emptyView" },
            h2(
              "div",
              { className: "dim-emptyCopy" },
              h2(
                "div",
                { className: "ddt-stateLabel dim-stateLabel" },
                h2("span", { className: "ddt-dot dim-stateDot" }),
                h2("span", null, `\u5C1A\u672A\u63A5\u5165 ${channel4} \u673A\u5668\u4EBA`)
              ),
              h2("h3", null, emptyTitle),
              h2("p", null, emptyDescription),
              h2(
                "div",
                { className: "ddt-actions dim-viewActions" },
                h2(Button3, {
                  kind: "primary",
                  onClick: () => setCredentialOpen(true)
                }, emptyActionLabel)
              )
            ),
            h2("div", {
              className: `ddt-brandMark dim-emptyBrand ${avatarClass}`,
              "aria-hidden": "true"
            }, h2(LogoGlyph, { size: 64 }))
          )
        ) : null,
        botList
      )
    );
  }
  return { SettingsTab, AccountCard: AccountCard5 };
}

// plugin-src/client/channels/discord/styles.js
var DISCORD_STYLE_ID = "xmanrui-dsh-im-discord-settings";
var CSS2 = String.raw`
.ddc-page { --ddt-accent: #5865f2; --ddt-accent-deep: #4752c4; --ddt-accent-wash: #eef0ff; }
.ddc-avatar { color: #fff; background: #5865f2; }
.ddc-avatar svg { display: block; }
`;
function installDiscordStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${DISCORD_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-im";
  style.dataset.pluginCss = DISCORD_STYLE_ID;
  style.textContent = CSS2;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/discord/index.js
var channel = createTokenChannelSettings({
  channel: "Discord",
  endpoints: DISCORD_ENDPOINTS,
  api,
  LogoGlyph: DiscordLogoGlyph,
  installStyles: installDiscordStyles,
  pageClass: "ddc-page",
  avatarClass: "ddc-avatar",
  connectionLabel: "Gateway \u957F\u8FDE\u63A5",
  tokenPlaceholder: "\u586B\u5199 Discord Developer Portal \u7684 Bot Token",
  emptyTitle: "\u63A5\u5165 Discord \u673A\u5668\u4EBA",
  emptyDescription: "\u5148\u5728 Developer Portal \u521B\u5EFA Bot \u5E76\u9080\u8BF7\u5230\u670D\u52A1\u5668\uFF0C\u518D\u5728\u8FD9\u91CC\u5B8C\u6210\u63A5\u5165\u3002",
  platformLabel: "Discord Developer Portal"
});
var DiscordSettingsTab = channel.SettingsTab;
var DiscordAccountCard = channel.AccountCard;

// plugin-src/client/channels/feishu/index.js
var React7 = __toESM(require("react"), 1);

// plugin-src/client/channels/feishu/api.js
var FEISHU_RPC_CHANNEL = "/feishu";
var FEISHU_ENDPOINTS = Object.freeze({
  status: "connection.status",
  beginProvisioning: "provision.begin",
  pollProvisioning: "provision.poll",
  cancelProvisioning: "provision.cancel",
  bindCredentials: "bot.bind-credentials",
  reconnectBot: "bot.reconnect",
  disconnectBot: "bot.disconnect",
  deleteBot: "bot.delete",
  // Kept for rolling upgrades. The multi-bot UI never calls these endpoints.
  testConnection: "connection.test",
  disconnect: "connection.disconnect"
});
var CONNECTION_STATES = /* @__PURE__ */ new Set([
  "disconnected",
  "offline",
  "provisioning",
  "connecting",
  "reconnecting",
  "connected",
  "error"
]);
var POLL_STATES = /* @__PURE__ */ new Set([
  "pending",
  "scanned",
  "connecting",
  "connected",
  "expired",
  "failed"
]);
function isRecord3(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function optionalString2(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function optionalTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.length > 0) {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? void 0 : parsed;
  }
  return void 0;
}
function clamp2(value, min, max, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
function unwrapRpcResult3(result) {
  if (!isRecord3(result) || typeof result.ok !== "boolean") {
    throw new Error("\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94");
  }
  if (!result.ok) {
    const message = optionalString2(result.error?.message) ?? "\u98DE\u4E66\u670D\u52A1\u8BF7\u6C42\u5931\u8D25";
    const error = new Error(message);
    error.code = optionalString2(result.error?.code) ?? "FEISHU_RPC_ERROR";
    throw error;
  }
  return result.value;
}
function normalizeProvisioning2(value, now = Date.now()) {
  const source = isRecord3(value?.provisioning) ? value.provisioning : value;
  if (!isRecord3(source)) throw new Error("\u98DE\u4E66\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u4E8C\u7EF4\u7801\u4FE1\u606F");
  const attemptId = optionalString2(source.attemptId) ?? optionalString2(source.provisioningId);
  const verificationUrl = optionalString2(source.verificationUrl);
  const qrCodeDataUrl = optionalString2(source.qrCodeDataUrl);
  if (!attemptId || !verificationUrl && !qrCodeDataUrl) {
    throw new Error("\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u7684\u4E8C\u7EF4\u7801\u4FE1\u606F\u4E0D\u5B8C\u6574");
  }
  const explicitExpiry = optionalTimestamp(source.expiresAt);
  const expireIn = clamp2(source.expireIn, 1, 60 * 60, 5 * 60);
  return {
    attemptId,
    verificationUrl,
    qrCodeDataUrl,
    expiresAt: explicitExpiry ?? now + expireIn * 1e3,
    pollIntervalMs: clamp2(source.pollIntervalMs, 800, 1e4, 1800)
  };
}
function normalizeBot2(value) {
  const source = isRecord3(value) ? value : {};
  return {
    name: optionalString2(source.name) ?? "\u98DE\u4E66\u673A\u5668\u4EBA",
    avatarUrl: optionalString2(source.avatarUrl),
    appIdMasked: optionalString2(source.appIdMasked),
    tenantName: optionalString2(source.tenantName),
    domain: source.domain === "lark" ? "lark" : "feishu",
    activated: typeof source.activated === "boolean" || typeof source.activated === "number" ? source.activated : void 0
  };
}
function normalizeHealth(value, connected = false) {
  const source = isRecord3(value) ? value : {};
  const fallbackStatus = connected ? "healthy" : "offline";
  const status = ["healthy", "degraded", "offline", "checking"].includes(source.status) ? source.status : fallbackStatus;
  return {
    status,
    summary: optionalString2(source.summary) ?? (connected ? "\u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38" : "\u673A\u5668\u4EBA\u5C1A\u672A\u8FDE\u63A5"),
    lastCheckedAt: optionalTimestamp(source.lastCheckedAt),
    lastConnectedAt: optionalTimestamp(source.lastConnectedAt)
  };
}
function normalizeError2(value) {
  if (!isRecord3(value)) return void 0;
  const message = optionalString2(value.message);
  if (!message) return void 0;
  return { message, code: optionalString2(value.code) };
}
function authoritativeState(value, connected) {
  if (connected) return "connected";
  const reported = CONNECTION_STATES.has(value) ? value : "disconnected";
  if (reported === "connected" || reported === "connecting" || reported === "reconnecting") {
    return "connecting";
  }
  if (reported === "error") return "error";
  return "offline";
}
function normalizeBotConnection(value, fallbackBotId) {
  if (!isRecord3(value)) throw new Error("\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6548\u7684\u673A\u5668\u4EBA\u72B6\u6001");
  const botId = optionalString2(value.botId) ?? optionalString2(fallbackBotId);
  if (!botId) throw new Error("\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u7684\u673A\u5668\u4EBA\u7F3A\u5C11 botId");
  const connected = value.connected === true;
  return {
    botId,
    state: authoritativeState(value.state, connected),
    connected,
    configured: value.configured !== false,
    bot: normalizeBot2(value.bot),
    health: normalizeHealth(value.health, connected),
    error: normalizeError2(value.error)
  };
}
function normalizeBotsSnapshot(value) {
  if (!isRecord3(value)) throw new Error("\u98DE\u4E66\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u8FDE\u63A5\u72B6\u6001");
  let sourceBots = Array.isArray(value.bots) ? value.bots : [];
  if (sourceBots.length === 0 && value.configured === true) {
    sourceBots = [{
      botId: optionalString2(value.botId) ?? "legacy-default",
      state: value.state,
      connected: value.connected,
      configured: true,
      bot: value.bot,
      health: value.health,
      error: value.error
    }];
  }
  const seen = /* @__PURE__ */ new Set();
  const bots = [];
  for (const source of sourceBots) {
    const bot = normalizeBotConnection(source);
    if (seen.has(bot.botId)) continue;
    seen.add(bot.botId);
    bots.push(bot);
  }
  const configured = bots.filter((bot) => bot.configured).length;
  const connected = bots.filter((bot) => bot.connected).length;
  const revision = Number.isSafeInteger(value.revision) && value.revision >= 0 ? value.revision : 0;
  const state = CONNECTION_STATES.has(value.state) ? value.state : "disconnected";
  return {
    schemaVersion: value.schemaVersion === 2 ? 2 : 1,
    revision,
    state,
    bots,
    // Derive counts from the authoritative list so stale summary fields never
    // make the UI claim that an unavailable bot is online.
    totals: { configured, connected },
    provisioning: value.provisioning ? normalizeProvisioning2(value.provisioning) : void 0,
    error: normalizeError2(value.error)
  };
}
function normalizeConnectionSnapshot(value) {
  if (!isRecord3(value)) throw new Error("\u98DE\u4E66\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u8FDE\u63A5\u72B6\u6001");
  const connected = value.connected === true;
  const reportedState = CONNECTION_STATES.has(value.state) ? value.state : "disconnected";
  const state = connected ? "connected" : reportedState === "connected" ? "connecting" : reportedState;
  const snapshot = {
    state,
    configured: value.configured === true,
    bot: normalizeBot2(value.bot),
    health: normalizeHealth(value.health, connected),
    provisioning: void 0,
    errorMessage: optionalString2(value.error?.message) ?? optionalString2(value.message)
  };
  if (value.provisioning) snapshot.provisioning = normalizeProvisioning2(value.provisioning);
  return snapshot;
}
function normalizePollResult(value) {
  if (!isRecord3(value)) throw new Error("\u98DE\u4E66\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u521B\u5EFA\u8FDB\u5EA6");
  const status = POLL_STATES.has(value.status) ? value.status : POLL_STATES.has(value.state) ? value.state : void 0;
  if (!status) throw new Error("\u98DE\u4E66\u670D\u52A1\u8FD4\u56DE\u4E86\u672A\u77E5\u7684\u521B\u5EFA\u72B6\u6001");
  const normalized = {
    status,
    botId: optionalString2(value.botId),
    message: optionalString2(value.error?.message) ?? optionalString2(value.message),
    connection: void 0,
    provisioning: void 0
  };
  if (value.provisioning) normalized.provisioning = normalizeProvisioning2(value.provisioning);
  if (status === "connected" && isRecord3(value.connection)) {
    normalized.connection = value.connection.botId ? normalizeBotConnection(value.connection) : normalizeConnectionSnapshot(value.connection);
  }
  return normalized;
}
function presentError3(error) {
  const raw = optionalString2(error?.message) ?? "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5";
  const message = raw.replace(/(client[_-]?secret|app[_-]?secret|secret|token)\s*[:=]\s*[^\s,;]+/gi, "$1=\u2022\u2022\u2022\u2022\u2022\u2022").slice(0, 240);
  return { message, code: optionalString2(error?.code) };
}
function formatRemaining2(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1e3));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// plugin-src/client/lifecycle.js
var React6 = __toESM(require("react"), 1);
function createPollScheduler({ setTimeoutFn, clearTimeoutFn }) {
  let disposed = false;
  let timer;
  return {
    get disposed() {
      return disposed;
    },
    schedule(callback, delayMs) {
      if (disposed) return false;
      if (timer !== void 0) clearTimeoutFn(timer);
      timer = setTimeoutFn(() => {
        timer = void 0;
        if (!disposed) void callback();
      }, delayMs);
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (timer !== void 0) clearTimeoutFn(timer);
      timer = void 0;
    }
  };
}
function createAnimationFrameScheduler({ requestFrame, cancelFrame }) {
  let disposed = false;
  const frames = /* @__PURE__ */ new Set();
  const keyedFrames = /* @__PURE__ */ new Map();
  return {
    schedule(callback, key) {
      if (disposed) return false;
      const previous = key === void 0 ? void 0 : keyedFrames.get(key);
      if (previous !== void 0) {
        keyedFrames.delete(key);
        frames.delete(previous);
        cancelFrame(previous);
      }
      let frame;
      let completed = false;
      frame = requestFrame(() => {
        completed = true;
        if (frame !== void 0) frames.delete(frame);
        if (key !== void 0 && keyedFrames.get(key) === frame) keyedFrames.delete(key);
        if (!disposed) callback();
      });
      if (!completed) {
        frames.add(frame);
        if (key !== void 0) keyedFrames.set(key, frame);
      }
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const frame of frames) cancelFrame(frame);
      frames.clear();
      keyedFrames.clear();
    }
  };
}
function useAnimationFrameScheduler() {
  const schedulerRef = React6.useRef(null);
  React6.useEffect(() => {
    const scheduler = createAnimationFrameScheduler({
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (frame) => window.cancelAnimationFrame(frame)
    });
    schedulerRef.current = scheduler;
    return () => {
      scheduler.dispose();
      if (schedulerRef.current === scheduler) schedulerRef.current = null;
    };
  }, []);
  return React6.useCallback(
    (callback, key) => schedulerRef.current?.schedule(callback, key) ?? false,
    []
  );
}

// plugin-src/client/channels/feishu/styles.js
var FEISHU_STYLE_ID = "beihuixinghe-dsh-feishu-settings";
var CSS3 = String.raw`
.bxf-page {
  --bxf-accent: var(--dsw-alias-state-business-primary, #3370ff);
  --bxf-success: var(--dsw-alias-state-success-primary, #20a162);
  --bxf-warning: var(--dsw-alias-state-warn-primary, #d97706);
  --bxf-error: var(--dsw-alias-state-error-primary, #d54941);
  box-sizing: border-box;
  width: 100%;
  max-width: 860px;
  color: var(--dsw-alias-label-primary, #1f2329);
  display: flex;
  flex-direction: column;
  container-type: inline-size;
  gap: 18px;
  padding: 2px 0 24px;
}

.bxf-page *, .bxf-page *::before, .bxf-page *::after { box-sizing: border-box; }

.bxf-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.bxf-headingCopy { min-width: 0; }
.bxf-heading h2, .bxf-heading p, .bxf-card h3, .bxf-card p { margin: 0; }

.bxf-eyebrow {
  color: var(--dsw-alias-label-tertiary, #8f959e);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: .08em;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.bxf-heading h2 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 650;
  letter-spacing: -.015em;
}

.bxf-heading p {
  max-width: 540px;
  color: var(--dsw-alias-label-secondary, #646a73);
  font-size: 13px;
  line-height: 20px;
  margin-top: 5px;
  white-space: nowrap;
}

.bxf-headingTools {
  width: 100%;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 8px;
}

.bxf-totalBadge {
  min-height: 28px;
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  border-radius: 999px;
  padding: 4px 10px;
  color: var(--dsw-alias-label-secondary, #646a73);
  background: var(--dsw-alias-bg-module-platform, #f2f3f5);
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
}

.bxf-totalBadge strong { color: var(--bxf-success); font-size: 13px; }

.bxf-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, #dee0e3);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-3, #fff);
  box-shadow: var(--dsw-shadow-lv1, 0 3px 12px rgba(31, 35, 41, .05));
}

.bxf-card::before {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 0 0 auto;
  height: 88px;
  background:
    radial-gradient(circle at 86% -35%, color-mix(in srgb, var(--bxf-accent) 18%, transparent), transparent 68%);
  opacity: .85;
}

.bxf-cardBody { position: relative; padding: 24px; }

.bxf-intro {
  min-height: 250px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 172px;
  gap: 32px;
  align-items: center;
}

.bxf-introCopy { max-width: 500px; }

.bxf-stateLabel {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--dsw-alias-label-secondary, #646a73);
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  margin-bottom: 13px;
}

.bxf-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--dsw-alias-label-tertiary, #8f959e);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--dsw-alias-label-tertiary, #8f959e) 12%, transparent);
}

.bxf-dot[data-tone="success"] {
  background: var(--bxf-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--bxf-success) 13%, transparent);
}

.bxf-dot[data-tone="warning"] {
  background: var(--bxf-warning);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--bxf-warning) 13%, transparent);
}

.bxf-dot[data-tone="error"] {
  background: var(--bxf-error);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--bxf-error) 13%, transparent);
}

.bxf-intro h3 {
  font-size: 24px;
  line-height: 34px;
  font-weight: 650;
  letter-spacing: -.02em;
}

.bxf-introCopy > p {
  max-width: 490px;
  color: var(--dsw-alias-label-secondary, #646a73);
  font-size: 14px;
  line-height: 23px;
  margin-top: 8px;
}

.bxf-note {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  color: var(--dsw-alias-label-tertiary, #8f959e);
  font-size: 12px;
  line-height: 18px;
  margin-top: 16px;
}

.bxf-note svg { flex: none; margin-top: 1px; }

.bxf-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.bxf-button {
  appearance: none;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid var(--dsw-alias-border-l2, #dee0e3);
  border-radius: 8px;
  padding: 7px 13px;
  color: var(--dsw-alias-label-primary, #1f2329);
  background: var(--dsw-alias-bg-layer-1, #fff);
  font: inherit;
  font-size: 13px;
  font-weight: 550;
  line-height: 20px;
  text-decoration: none;
  cursor: pointer;
  transition: background .15s var(--ds-ease-in-out, ease), border-color .15s var(--ds-ease-in-out, ease), transform .15s var(--ds-ease-in-out, ease);
}

.bxf-button:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, #f2f3f5);
  border-color: var(--dsw-alias-border-l1, #c9cdd4);
}

.bxf-button:active:not(:disabled) { transform: translateY(1px); }

.bxf-button:focus-visible, .bxf-link:focus-visible {
  outline: 2px solid var(--bxf-accent);
  outline-offset: 2px;
}

.bxf-button:disabled { cursor: not-allowed; opacity: .55; }

.bxf-button[data-kind="primary"] {
  border-color: var(--bxf-accent);
  color: #fff;
  background: var(--bxf-accent);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--bxf-accent) 24%, transparent);
}

.bxf-button[data-kind="primary"]:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--bxf-accent) 86%, #000);
  background: color-mix(in srgb, var(--bxf-accent) 90%, #000);
}

.bxf-button[data-kind="danger"] { color: var(--bxf-error); }
.bxf-button[data-size="small"] { min-height: 32px; padding: 5px 10px; font-size: 12px; }
.bxf-bindButton { flex: none; white-space: nowrap; }

.bxf-provisionCard {
  border-color: color-mix(in srgb, var(--bxf-accent) 32%, var(--dsw-alias-border-l2, #dee0e3));
}

.bxf-markStage {
  position: relative;
  width: 156px;
  height: 156px;
  display: grid;
  place-items: center;
  justify-self: end;
}

.bxf-markStage::before, .bxf-markStage::after {
  content: "";
  position: absolute;
  border-radius: 50%;
}

.bxf-markStage::before {
  inset: 12px;
  border: 1px solid color-mix(in srgb, var(--bxf-accent) 18%, var(--dsw-alias-border-l2, #dee0e3));
  background: color-mix(in srgb, var(--bxf-accent) 4%, var(--dsw-alias-bg-layer-1, #fff));
}

.bxf-markStage::after {
  inset: 0;
  border: 1px dashed color-mix(in srgb, var(--bxf-accent) 16%, transparent);
  animation: bxf-rotate 18s linear infinite;
}

.bxf-brandMark {
  position: relative;
  z-index: 1;
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  color: #fff;
  background: var(--bxf-accent);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--bxf-accent) 28%, transparent);
}

.bxf-qrLayout {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  align-items: center;
  gap: 32px;
}

.bxf-qrColumn { min-width: 0; }

.bxf-qrFrame {
  position: relative;
  width: 222px;
  height: 222px;
  display: grid;
  place-items: center;
  border: 1px solid var(--dsw-alias-border-l2, #dee0e3);
  border-radius: 14px;
  padding: 13px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(31, 35, 41, .07);
}

.bxf-qrFrame::before, .bxf-qrFrame::after {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: var(--bxf-accent);
  border-style: solid;
}

.bxf-qrFrame::before { inset: -3px auto auto -3px; border-width: 2px 0 0 2px; border-radius: 5px 0 0; }
.bxf-qrFrame::after { inset: auto -3px -3px auto; border-width: 0 2px 2px 0; border-radius: 0 0 5px; }
.bxf-qrFrame img { width: 100%; height: 100%; display: block; object-fit: contain; }

.bxf-qrFallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--bxf-accent);
  background: #f7f9ff;
  text-align: center;
  padding: 20px;
}

.bxf-qrFallback span { display: block; color: #646a73; font-size: 12px; line-height: 18px; margin-top: 8px; }

.bxf-expiredOverlay {
  position: absolute;
  inset: 10px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #1f2329;
  background: rgba(255, 255, 255, .94);
  backdrop-filter: blur(3px);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.bxf-countdown {
  width: 222px;
  color: var(--dsw-alias-label-tertiary, #8f959e);
  font-variant-numeric: tabular-nums;
  font-size: 11px;
  line-height: 17px;
  margin-top: 11px;
}

.bxf-countdownTop { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.bxf-progress { height: 3px; overflow: hidden; border-radius: 99px; background: var(--dsw-alias-bg-module-platform, #f2f3f5); margin-top: 6px; }
.bxf-progress > span { display: block; width: var(--bxf-progress, 100%); height: 100%; border-radius: inherit; background: var(--bxf-accent); transition: width 1s linear; }

.bxf-qrCopy h3 { font-size: 20px; line-height: 29px; font-weight: 650; }
.bxf-qrCopy > p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 21px; margin-top: 7px; }

.bxf-steps { counter-reset: bxf-step; display: flex; flex-direction: column; gap: 11px; margin: 20px 0 0; padding: 0; list-style: none; }
.bxf-steps li { counter-increment: bxf-step; display: grid; grid-template-columns: 23px minmax(0, 1fr); align-items: start; gap: 9px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 19px; }
.bxf-steps li::before { content: counter(bxf-step); width: 21px; height: 21px; display: grid; place-items: center; border: 1px solid var(--dsw-alias-border-l2, #dee0e3); border-radius: 50%; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font-size: 10px; font-weight: 650; }

.bxf-connecting { min-height: 292px; display: grid; place-items: center; text-align: center; padding: 36px 24px; }
.bxf-connectingCopy { max-width: 430px; }
.bxf-orbit { position: relative; width: 86px; height: 86px; display: grid; place-items: center; margin: 0 auto 22px; }
.bxf-orbit::before, .bxf-orbit::after { content: ""; position: absolute; border-radius: 50%; }
.bxf-orbit::before { inset: 3px; border: 1px solid color-mix(in srgb, var(--bxf-accent) 24%, transparent); animation: bxf-pulse 1.8s var(--ds-ease-in-out, ease) infinite; }
.bxf-orbit::after { inset: 0; border: 2px solid transparent; border-top-color: var(--bxf-accent); animation: bxf-rotate 1.2s linear infinite; }
.bxf-orbitCore { width: 50px; height: 50px; display: grid; place-items: center; border-radius: 16px; color: var(--bxf-accent); background: color-mix(in srgb, var(--bxf-accent) 9%, var(--dsw-alias-bg-layer-1, #fff)); }
.bxf-connecting h3 { font-size: 20px; line-height: 29px; }
.bxf-connecting p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 21px; margin-top: 7px; }
.bxf-connectingCompact { min-height: 248px; }

.bxf-inlineError {
  min-height: 190px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-content: center;
  gap: 15px;
  padding: 28px;
}

.bxf-inlineError h3 { font-size: 17px; line-height: 25px; margin: 0; }
.bxf-inlineError p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 21px; margin-top: 5px; overflow-wrap: anywhere; }

.bxf-listSection { display: flex; flex-direction: column; gap: 10px; }
.bxf-listHeading { min-height: 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 0 2px; }
.bxf-listHeading h3 { font-size: 14px; line-height: 22px; font-weight: 650; margin: 0; }
.bxf-botList { display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 0; list-style: none; }
.bxf-botList > li { min-width: 0; }
.bxf-botCard:focus { outline: none; }
.bxf-botCard:focus-visible { outline: 2px solid var(--bxf-accent); outline-offset: 2px; }

.bxf-connectedTop { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.bxf-botIdentity { min-width: 0; display: flex; align-items: center; gap: 13px; }
.bxf-avatar { flex: none; width: 48px; height: 48px; display: grid; place-items: center; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 3px rgb(31 35 41 / 7%); }
.bxf-botName { min-width: 0; }
.bxf-botName h3 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 17px; line-height: 24px; font-weight: 650; }
.bxf-botName p { overflow: hidden; color: var(--dsw-alias-label-tertiary, #8f959e); font-family: var(--ds-font-family-code, monospace); font-size: 12px; line-height: 18px; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; }

.bxf-healthPill { flex: none; display: inline-flex; align-items: center; gap: 7px; min-height: 28px; border-radius: 999px; padding: 4px 10px; color: var(--bxf-success); background: color-mix(in srgb, var(--bxf-success) 10%, transparent); font-size: 12px; font-weight: 600; line-height: 18px; }
.bxf-healthPill[data-health="degraded"], .bxf-healthPill[data-health="checking"], .bxf-healthPill[data-health="connecting"] { color: var(--bxf-warning); background: color-mix(in srgb, var(--bxf-warning) 10%, transparent); }
.bxf-healthPill[data-health="offline"], .bxf-healthPill[data-health="error"] { color: var(--bxf-error); background: color-mix(in srgb, var(--bxf-error) 10%, transparent); }

.bxf-statusGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 22px; }
.bxf-metric { min-width: 0; border: 1px solid var(--dsw-alias-border-l2, #dee0e3); border-radius: 9px; padding: 12px 13px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.bxf-metric dt { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 17px; }
.bxf-metric dd { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; line-height: 18px; font-weight: 550; margin: 3px 0 0; }

.bxf-connectedFooter { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.bxf-healthSummary { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 18px; }
.bxf-healthSummary[data-error="true"] { color: var(--bxf-error); }
.bxf-botActions { flex: none; flex-wrap: nowrap; gap: 8px; margin-top: 0; justify-content: flex-end; }
.bxf-botActions .bxf-button { flex: none; white-space: nowrap; }

.bxf-confirm {
  border-top: 1px solid var(--dsw-alias-border-l2, #dee0e3);
  background: color-mix(in srgb, var(--bxf-error) 4%, var(--dsw-alias-bg-module-platform, #f7f8fa));
  padding: 17px 24px 20px;
}
.bxf-confirm:focus { outline: none; }
.bxf-confirm h4 { font-size: 13px; line-height: 20px; margin: 0; }
.bxf-confirm p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 19px; margin: 4px 0 0; }
.bxf-confirm .bxf-actions { margin-top: 12px; }

.bxf-error { min-height: 252px; display: grid; grid-template-columns: 44px minmax(0, 1fr); align-content: center; gap: 15px; padding: 30px; }
.bxf-errorIcon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 13px; color: var(--bxf-error); background: color-mix(in srgb, var(--bxf-error) 9%, transparent); }
.bxf-error h3 { font-size: 17px; line-height: 25px; }
.bxf-error p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 21px; margin-top: 5px; overflow-wrap: anywhere; }
.bxf-errorCode { display: inline-block; color: var(--dsw-alias-label-tertiary, #8f959e); font-family: var(--ds-font-family-code, monospace); font-size: 11px; margin-top: 7px; }

.bxf-statusNotice {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid color-mix(in srgb, var(--bxf-warning) 28%, var(--dsw-alias-border-l2, #dee0e3));
  border-radius: 10px;
  padding: 9px 11px;
  color: var(--dsw-alias-label-secondary, #646a73);
  background: color-mix(in srgb, var(--bxf-warning) 5%, var(--dsw-alias-bg-layer-1, #fff));
  font-size: 12px;
  line-height: 18px;
}
.bxf-statusNotice > svg { flex: none; color: var(--bxf-warning); }
.bxf-statusNotice > span { min-width: 0; flex: 1; overflow-wrap: anywhere; }

.bxf-skeleton { min-height: 260px; padding: 28px; }
.bxf-skeletonLine { height: 12px; border-radius: 999px; background: linear-gradient(90deg, var(--dsw-alias-bg-module-platform, #f2f3f5), color-mix(in srgb, var(--dsw-alias-label-tertiary, #8f959e) 10%, transparent), var(--dsw-alias-bg-module-platform, #f2f3f5)); background-size: 220% 100%; animation: bxf-shimmer 1.5s linear infinite; }
.bxf-skeletonLine:nth-child(1) { width: 92px; }
.bxf-skeletonLine:nth-child(2) { width: 44%; height: 22px; margin-top: 23px; }
.bxf-skeletonLine:nth-child(3) { width: 72%; margin-top: 14px; }
.bxf-skeletonLine:nth-child(4) { width: 58%; margin-top: 9px; }
.bxf-skeletonBox { width: 138px; height: 38px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f2f3f5); margin-top: 28px; }

.bxf-visuallyHidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

@keyframes bxf-rotate { to { transform: rotate(360deg); } }
@keyframes bxf-pulse { 0%, 100% { transform: scale(.9); opacity: .45; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes bxf-shimmer { to { background-position: -220% 0; } }

@container (max-width: 620px) {
  .bxf-headingTools { gap: 6px; }
  .bxf-headingTools .bxf-totalBadge { padding-inline: 8px; }
  .bxf-headingTools .bxf-bindButton { padding-inline: 10px; }
}

@media (max-width: 680px) {
  .bxf-intro { grid-template-columns: minmax(0, 1fr); }
  .bxf-markStage { display: none; }
  .bxf-qrLayout { grid-template-columns: minmax(0, 1fr); justify-items: center; }
  .bxf-qrCopy { width: 100%; }
  .bxf-statusGrid { grid-template-columns: minmax(0, 1fr); }
  .bxf-connectedTop { align-items: flex-start; flex-direction: column; }
  .bxf-inlineError { grid-template-columns: minmax(0, 1fr); padding: 20px; }
  .bxf-statusNotice { align-items: flex-start; flex-wrap: wrap; }
  .bxf-cardBody { padding: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .bxf-page *, .bxf-page *::before, .bxf-page *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
}
`;
function installFeishuStyles() {
  if (typeof document === "undefined") {
    return () => {
    };
  }
  const existing = document.querySelector(
    `style[data-plugin-css="${FEISHU_STYLE_ID}"]`
  );
  if (existing) {
    return () => {
    };
  }
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-feishu";
  style.dataset.pluginCss = FEISHU_STYLE_ID;
  style.textContent = CSS3;
  document.head.appendChild(style);
  return () => {
    style.remove();
  };
}

// plugin-src/client/channels/feishu/index.js
function SvgIcon({ children, size = 18, className, viewBox = "0 0 24 24" }) {
  return h2("svg", {
    width: size,
    height: size,
    viewBox,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false",
    className
  }, children);
}
function RobotIcon({ size = 26 }) {
  return h2(
    SvgIcon,
    { size },
    h2("rect", {
      x: "5",
      y: "7.5",
      width: "14",
      height: "11",
      rx: "4",
      stroke: "currentColor",
      strokeWidth: "1.7"
    }),
    h2("path", {
      d: "M12 4.5v3M8.7 12h.01M15.3 12h.01M9.2 15.3c1.67 1.08 3.93 1.08 5.6 0M3.5 11.5v3M20.5 11.5v3",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round"
    })
  );
}
function AlertIcon({ size = 22 }) {
  return h2(
    SvgIcon,
    { size },
    h2("path", {
      d: "M12 3.4 21 19H3L12 3.4Z",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinejoin: "round"
    }),
    h2("path", {
      d: "M12 9v4.4M12 16.6v.01",
      stroke: "currentColor",
      strokeWidth: "1.9",
      strokeLinecap: "round"
    })
  );
}
function QrIcon({ size = 58 }) {
  return h2(SvgIcon, { size }, h2("path", {
    d: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v4h-2v-4Zm-4 4h4v2h-4v-2Z",
    fill: "currentColor"
  }));
}
var Button5 = React7.forwardRef(function Button6({ children, kind = "secondary", size, icon, className = "", ...props }, ref) {
  return h2("button", {
    ...props,
    ref,
    type: "button",
    className: `bxf-button ${className}`.trim(),
    "data-kind": kind,
    "data-size": size
  }, icon, h2("span", null, children));
});
function BrandMark() {
  return h2("div", { className: "bxf-brandMark" }, h2(RobotIcon, { size: 34 }));
}
function Heading2({ totals, onAdd, onCredential, credentialOpen, adding, busy, addButtonRef }) {
  const hasBots = totals.configured > 0;
  return h2(
    "div",
    { className: "bxf-heading" },
    h2(
      "div",
      { className: "bxf-headingTools" },
      h2(
        "div",
        { className: "dim-bindActions" },
        h2(Button5, {
          kind: "primary",
          size: "small",
          className: "bxf-bindButton dim-scanButton",
          onClick: onAdd,
          disabled: adding || busy,
          ref: addButtonRef,
          "aria-busy": busy ? "true" : void 0,
          "aria-label": "\u626B\u7801\u63A5\u5165\u98DE\u4E66\u673A\u5668\u4EBA",
          icon: h2(QrActionIcon)
        }, adding ? "\u6B63\u5728\u63A5\u5165" : "\u626B\u7801\u63A5\u5165\u673A\u5668\u4EBA"),
        h2(Button5, {
          kind: "credential",
          size: "small",
          className: "dim-credentialButton",
          onClick: onCredential,
          disabled: adding || busy,
          "aria-pressed": credentialOpen,
          "aria-label": "\u4F7F\u7528 App ID \u548C App Secret \u7ED1\u5B9A\u98DE\u4E66\u673A\u5668\u4EBA",
          icon: h2(CredentialActionIcon)
        }, credentialOpen ? "\u6536\u8D77\u51ED\u636E" : "\u624B\u52A8\u63A5\u5165")
      ),
      hasBots ? h2("div", {
        className: "bxf-totalBadge dim-onlineBadge",
        "aria-label": `\u5DF2\u63A5\u5165 ${totals.configured} \u4E2A\u673A\u5668\u4EBA\uFF0C\u5176\u4E2D ${totals.connected} \u4E2A\u5728\u7EBF`
      }, h2("span", null, `${totals.connected} / ${totals.configured} \u5728\u7EBF`)) : null
    )
  );
}
function LoadingView2() {
  return h2(
    "div",
    {
      className: "bxf-card dim-surfaceCard dim-loadingView",
      "aria-busy": "true",
      "aria-label": "\u6B63\u5728\u8BFB\u53D6\u98DE\u4E66\u673A\u5668\u4EBA\u5217\u8868"
    },
    h2("div", { className: "dim-spinner", "aria-hidden": "true" }),
    h2("span", null, "\u6B63\u5728\u8BFB\u53D6\u98DE\u4E66\u8FDE\u63A5\u72B6\u6001\u2026")
  );
}
function EmptyView2({ onStart, busy }) {
  return h2(
    "div",
    { className: "bxf-card dim-surfaceCard" },
    h2(
      "div",
      { className: "bxf-cardBody bxf-intro dim-surfaceBody dim-emptyView" },
      h2(
        "div",
        { className: "bxf-introCopy dim-emptyCopy" },
        h2(
          "div",
          { className: "bxf-stateLabel dim-stateLabel" },
          h2("span", { className: "bxf-dot dim-stateDot" }),
          h2("span", null, "\u5C1A\u672A\u63A5\u5165\u673A\u5668\u4EBA")
        ),
        h2("h3", null, "\u626B\u7801\uFF0C\u521B\u5EFA\u7B2C\u4E00\u4E2A\u98DE\u4E66\u5165\u53E3"),
        h2("p", null, "\u65E0\u9700\u624B\u52A8\u586B\u5199 App ID\u3002\u4EE5\u540E\u8FD8\u53EF\u4EE5\u7EE7\u7EED\u6DFB\u52A0\u673A\u5668\u4EBA\uFF0C\u5206\u522B\u670D\u52A1\u4E0D\u540C\u56E2\u961F\u6216\u98DE\u4E66\u79DF\u6237\u3002"),
        h2(
          "div",
          { className: "bxf-actions dim-viewActions" },
          h2(Button5, {
            kind: "primary",
            onClick: onStart,
            disabled: busy,
            "aria-busy": busy ? "true" : void 0
          }, busy ? "\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026" : "\u751F\u6210\u98DE\u4E66\u4E8C\u7EF4\u7801")
        )
      ),
      h2("div", { className: "bxf-markStage dim-emptyBrand", "aria-hidden": "true" }, h2(BrandMark))
    )
  );
}
function safeVerificationHref(value) {
  if (!value) return void 0;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : void 0;
  } catch {
    return void 0;
  }
}
function safeQrSource2(value) {
  if (!value) return void 0;
  return /^data:image\/(?:png|webp|svg\+xml)(?:;charset=[^;,]+)?;base64,/i.test(value) ? value : void 0;
}
function QrPane({ provision, now, onRefresh, onCancel, busy }) {
  const [imageFailed, setImageFailed] = React7.useState(false);
  const qrSource = safeQrSource2(provision.qrCodeDataUrl);
  const href = safeVerificationHref(provision.verificationUrl);
  const remaining = Math.max(0, provision.expiresAt - now);
  const expired = provision.expired === true || remaining === 0;
  const progress = Math.min(1, remaining / Math.max(1, provision.durationMs ?? remaining));
  React7.useEffect(() => setImageFailed(false), [qrSource]);
  return h2(
    "div",
    { className: "bxf-card bxf-provisionCard dim-surfaceCard" },
    h2(
      "div",
      { className: "bxf-cardBody bxf-qrLayout dim-surfaceBody dim-qrLayout" },
      h2(
        "div",
        { className: "bxf-qrColumn dim-qrColumn" },
        h2(
          "div",
          { className: "bxf-qrFrame dim-qrFrame" },
          qrSource && !imageFailed ? h2("img", {
            src: qrSource,
            alt: "\u7528\u4E8E\u65B0\u589E DeepSeek Harness \u98DE\u4E66\u673A\u5668\u4EBA\u7684\u4E00\u6B21\u6027\u6388\u6743\u4E8C\u7EF4\u7801",
            onError: () => setImageFailed(true)
          }) : h2(
            "div",
            { className: "bxf-qrFallback dim-qrFallback" },
            h2("div", null, h2(QrIcon), h2("span", null, "\u4E8C\u7EF4\u7801\u672A\u5C31\u7EEA\uFF0C\u8BF7\u6253\u5F00\u6388\u6743\u94FE\u63A5"))
          ),
          expired ? h2(
            "div",
            { className: "bxf-expiredOverlay dim-qrExpired", role: "status" },
            h2("div", null, "\u4E8C\u7EF4\u7801\u5DF2\u5931\u6548", h2("br"), "\u8BF7\u5237\u65B0\u540E\u91CD\u65B0\u626B\u7801")
          ) : null
        ),
        h2(
          "div",
          {
            className: "bxf-countdown dim-countdown",
            "aria-label": expired ? "\u4E8C\u7EF4\u7801\u5DF2\u5931\u6548" : `\u4E8C\u7EF4\u7801\u5269\u4F59 ${formatRemaining2(remaining)}`
          },
          h2(
            "div",
            { className: "bxf-countdownTop dim-countdownTop", "aria-hidden": "true" },
            h2("span", null, expired ? "\u7B49\u5F85\u5237\u65B0" : "\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4"),
            h2("strong", null, formatRemaining2(remaining))
          ),
          h2(
            "div",
            { className: "bxf-progress dim-progress", "aria-hidden": "true" },
            h2("span", { style: { "--bxf-progress": `${Math.round(progress * 100)}%` } })
          )
        )
      ),
      h2(
        "div",
        { className: "bxf-qrCopy dim-qrCopy" },
        h2(
          "div",
          { className: "bxf-stateLabel dim-stateLabel" },
          h2("span", { className: "bxf-dot dim-stateDot", "data-tone": "warning" }),
          h2("span", null, "\u6B63\u5728\u6DFB\u52A0\u65B0\u673A\u5668\u4EBA")
        ),
        h2("h3", null, expired ? "\u5237\u65B0\u4E8C\u7EF4\u7801\u540E\u7EE7\u7EED" : "\u4F7F\u7528\u98DE\u4E66\u626B\u7801\u521B\u5EFA\u673A\u5668\u4EBA"),
        h2("p", null, "\u626B\u7801\u53EA\u4F1A\u65B0\u589E\u4E00\u4E2A\u673A\u5668\u4EBA\uFF0C\u5DF2\u63A5\u5165\u7684\u673A\u5668\u4EBA\u4F1A\u7EE7\u7EED\u6B63\u5E38\u6536\u53D1\u6D88\u606F\u3002"),
        h2(
          "ol",
          { className: "bxf-steps dim-steps" },
          h2("li", null, "\u6253\u5F00\u98DE\u4E66\u79FB\u52A8\u7AEF\uFF0C\u4F7F\u7528\u626B\u4E00\u626B\u8BFB\u53D6\u4E8C\u7EF4\u7801"),
          h2("li", null, "\u6838\u5BF9\u5E94\u7528\u540D\u79F0\u4E0E\u6743\u9650\u8303\u56F4\uFF0C\u5E76\u786E\u8BA4\u521B\u5EFA"),
          h2("li", null, "\u4FDD\u6301\u672C\u9875\u6253\u5F00\uFF0C\u7B49\u5F85\u65B0\u673A\u5668\u4EBA\u7684\u957F\u8FDE\u63A5\u5C31\u7EEA")
        ),
        h2(
          "div",
          { className: "bxf-actions dim-viewActions" },
          expired ? h2(Button5, {
            kind: "primary",
            onClick: onRefresh,
            disabled: busy
          }, busy ? "\u5237\u65B0\u4E2D\u2026" : "\u5237\u65B0\u4E8C\u7EF4\u7801") : href ? h2("a", {
            className: "bxf-button bxf-link",
            "data-kind": "secondary",
            href,
            target: "_blank",
            rel: "noopener noreferrer"
          }, h2("span", null, "\u5728\u98DE\u4E66\u4E2D\u6253\u5F00")) : null,
          !expired ? h2(Button5, { onClick: onRefresh, disabled: busy }, "\u6362\u4E00\u4E2A\u4E8C\u7EF4\u7801") : null,
          h2(Button5, { onClick: onCancel, disabled: busy }, "\u53D6\u6D88\u6DFB\u52A0")
        )
      )
    )
  );
}
function ProvisionProgress({ phase, onCancel, busy }) {
  const connecting = phase === "connecting";
  return h2(
    "div",
    {
      className: "bxf-card bxf-provisionCard dim-surfaceCard dim-loadingView",
      "aria-busy": "true"
    },
    h2("div", { className: "dim-spinner", "aria-hidden": "true" }),
    h2("h3", null, connecting ? "\u5DF2\u786E\u8BA4\uFF0C\u6B63\u5728\u8FDE\u63A5\u65B0\u673A\u5668\u4EBA" : "\u6B63\u5728\u51C6\u5907\u6388\u6743\u4E8C\u7EF4\u7801"),
    h2("p", null, connecting ? "\u6B63\u5728\u5B89\u5168\u4FDD\u5B58\u51ED\u636E\u5E76\u68C0\u67E5\u65B0\u673A\u5668\u4EBA\u7684\u6D88\u606F\u901A\u9053\uFF0C\u5176\u4ED6\u673A\u5668\u4EBA\u4E0D\u4F1A\u4E2D\u65AD\u3002" : "\u6B63\u5728\u5411\u98DE\u4E66\u7533\u8BF7\u4E00\u6B21\u6027\u6388\u6743\u4E8C\u7EF4\u7801\uFF0C\u8BF7\u7A0D\u5019\u3002"),
    connecting ? h2(
      "div",
      { className: "bxf-actions dim-viewActions", style: { justifyContent: "center" } },
      h2(Button5, { onClick: onCancel, disabled: busy }, "\u53D6\u6D88\u6DFB\u52A0")
    ) : null
  );
}
function ProvisionError2({ error, onRetry, onCancel, busy }) {
  return h2(
    "div",
    { className: "bxf-card bxf-provisionCard dim-surfaceCard" },
    h2(
      "div",
      { className: "bxf-inlineError dim-inlineError", role: "alert" },
      h2(
        "div",
        null,
        h2("h3", null, "\u65B0\u673A\u5668\u4EBA\u6CA1\u6709\u6DFB\u52A0\u5B8C\u6210"),
        h2("p", null, error.message),
        error.code ? h2("span", { className: "bxf-errorCode" }, error.code) : null,
        h2(
          "div",
          { className: "bxf-actions dim-viewActions" },
          h2(
            Button5,
            { kind: "primary", onClick: onRetry, disabled: busy },
            busy ? "\u91CD\u8BD5\u4E2D\u2026" : "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"
          ),
          h2(Button5, { onClick: onCancel, disabled: busy }, "\u5173\u95ED")
        )
      )
    )
  );
}
var HEALTH_LABELS = {
  connected: "\u8FD0\u884C\u6B63\u5E38",
  connecting: "\u6B63\u5728\u8FDE\u63A5",
  offline: "\u8FDE\u63A5\u4E2D\u65AD",
  error: "\u9700\u8981\u5904\u7406"
};
function formatCheckedTime(timestamp7) {
  if (!timestamp7) return "\u5C1A\u672A\u68C0\u67E5";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(timestamp7));
  } catch {
    return "\u521A\u521A";
  }
}
function RemoveConfirmation2({ bot, busy, onConfirm, onCancel }) {
  const cancelRef = React7.useRef(null);
  const idPart = bot.botId.replace(/[^a-zA-Z0-9_-]/g, "-");
  const titleId = `bxf-remove-title-${idPart}`;
  const descriptionId = `bxf-remove-description-${idPart}`;
  React7.useEffect(() => cancelRef.current?.focus(), []);
  return h2(
    "div",
    {
      className: "bxf-confirm dim-confirm",
      role: "alertdialog",
      "aria-labelledby": titleId,
      "aria-describedby": descriptionId,
      onKeyDown: (event) => {
        if (event.key === "Escape" && !busy) {
          event.preventDefault();
          onCancel();
        }
      }
    },
    h2("h4", { id: titleId }, `\u4ECE DeepSeek Harness \u79FB\u9664\u201C${bot.bot.name}\u201D\uFF1F`),
    h2(
      "p",
      { id: descriptionId },
      "\u6B64\u64CD\u4F5C\u4F1A\u505C\u6B62\u8FD9\u4E2A\u673A\u5668\u4EBA\u7684\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u4FDD\u5B58\u5728\u672C\u673A\u7684\u63A5\u5165\u914D\u7F6E\u548C\u51ED\u636E\u3002\u98DE\u4E66\u5F00\u653E\u5E73\u53F0\u4E2D\u7684\u5E94\u7528\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\uFF0C\u5176\u4ED6\u673A\u5668\u4EBA\u4E5F\u4E0D\u53D7\u5F71\u54CD\u3002"
    ),
    h2(
      "div",
      { className: "bxf-actions dim-viewActions" },
      h2(Button5, { ref: cancelRef, onClick: onCancel, disabled: busy }, "\u4FDD\u7559\u673A\u5668\u4EBA"),
      h2(
        Button5,
        { kind: "danger", onClick: onConfirm, disabled: busy },
        busy ? "\u6B63\u5728\u79FB\u9664\u2026" : "\u786E\u8BA4\u79FB\u9664\u63A5\u5165"
      )
    )
  );
}
function BotCard({
  connection,
  busy,
  actionError,
  removing,
  onReconnect,
  onRequestRemove,
  onConfirmRemove,
  onCancelRemove,
  cardRef,
  removeButtonRef
}) {
  const { bot, health, state, connected } = connection;
  const stateForDisplay = busy === "reconnect" ? "connecting" : state;
  const tone = stateForDisplay === "connected" ? "success" : stateForDisplay === "connecting" ? "warning" : "error";
  const summary = actionError?.message ?? connection.error?.message ?? (connected ? null : health.summary);
  const titleId = `bxf-bot-${connection.botId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return h2(
    "article",
    {
      className: "bxf-card bxf-botCard dim-botCard",
      "aria-labelledby": titleId,
      "data-bot-id": connection.botId,
      tabIndex: -1,
      ref: cardRef
    },
    h2(
      "div",
      { className: "bxf-cardBody dim-botCardBody" },
      h2(
        "div",
        { className: "bxf-connectedTop dim-botCardTop" },
        h2(
          "div",
          { className: "bxf-botIdentity dim-botIdentity" },
          h2(
            "div",
            { className: "bxf-avatar dim-botAvatar", "aria-hidden": "true" },
            h2(FeishuLogoGlyph, { size: 34 })
          ),
          h2(
            "div",
            { className: "bxf-botName dim-botName" },
            h2("h3", { id: titleId, title: bot.name }, bot.name),
            h2("p", { title: bot.appIdMasked }, bot.appIdMasked ?? "\u5E94\u7528\u6807\u8BC6\u5DF2\u5B89\u5168\u4FDD\u5B58")
          )
        ),
        h2(
          "div",
          { className: "bxf-healthPill dim-botHealth", "data-health": stateForDisplay },
          h2("span", { className: "bxf-dot dim-healthDot", "data-tone": tone }),
          h2("span", null, HEALTH_LABELS[stateForDisplay] ?? "\u72B6\u6001\u672A\u77E5")
        )
      ),
      h2(
        "dl",
        { className: "bxf-statusGrid dim-botMetrics" },
        h2(
          "div",
          { className: "bxf-metric dim-botMetric" },
          h2("dt", null, "\u6D88\u606F\u901A\u9053"),
          h2("dd", null, connected ? "\u957F\u8FDE\u63A5" : stateForDisplay === "connecting" ? "\u8FDE\u63A5\u4E2D" : "\u5DF2\u65AD\u5F00")
        ),
        h2(
          "div",
          { className: "bxf-metric dim-botMetric" },
          h2("dt", null, "\u6700\u8FD1\u68C0\u67E5"),
          h2("dd", null, formatCheckedTime(health.lastCheckedAt))
        )
      ),
      h2(
        "div",
        { className: "bxf-connectedFooter dim-cardFooter" },
        summary ? h2(
          "div",
          { className: "bxf-healthSummary dim-cardSummary", "data-error": actionError || connection.error ? "true" : void 0 },
          summary
        ) : null,
        h2(
          "div",
          { className: "bxf-actions bxf-botActions dim-cardActions" },
          h2(Button5, {
            className: "dim-cardAction",
            onClick: onReconnect,
            disabled: Boolean(busy),
            "aria-busy": busy === "reconnect" ? "true" : void 0,
            "aria-label": `${connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"}${bot.name}`
          }, busy === "reconnect" ? connected ? "\u68C0\u67E5\u4E2D\u2026" : "\u6B63\u5728\u8FDE\u63A5\u2026" : connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"),
          h2(Button5, {
            className: "dim-cardAction",
            kind: "danger",
            onClick: onRequestRemove,
            disabled: Boolean(busy),
            ref: removeButtonRef,
            "aria-label": `\u4ECE DeepSeek Harness \u79FB\u9664${bot.name}`
          }, "\u79FB\u9664\u63A5\u5165")
        )
      )
    ),
    removing ? h2(RemoveConfirmation2, {
      bot: connection,
      busy: busy === "delete",
      onConfirm: onConfirmRemove,
      onCancel: onCancelRemove
    }) : null
  );
}
function BotList(props) {
  return h2(
    "section",
    { className: "bxf-listSection dim-listSection", "aria-labelledby": "bxf-bot-list-title" },
    h2(
      "div",
      { className: "bxf-listHeading dim-listHeading" },
      h2("h3", { id: "bxf-bot-list-title" }, "\u5DF2\u63A5\u5165\u7684\u673A\u5668\u4EBA")
    ),
    h2(
      "ul",
      { className: "bxf-botList dim-botList", role: "list" },
      props.bots.map((bot) => h2(
        "li",
        { key: bot.botId },
        h2(BotCard, {
          connection: bot,
          busy: props.busyByBot[bot.botId],
          actionError: props.errorsByBot[bot.botId],
          removing: props.removeTargetId === bot.botId,
          onReconnect: () => props.onReconnect(bot),
          onRequestRemove: () => props.onRequestRemove(bot),
          onConfirmRemove: () => props.onConfirmRemove(bot),
          onCancelRemove: props.onCancelRemove,
          cardRef: (node) => props.setCardRef(bot.botId, node),
          removeButtonRef: (node) => props.setRemoveButtonRef(bot.botId, node)
        })
      ))
    )
  );
}
function PageError({ error, onRetry, busy }) {
  return h2(
    "div",
    { className: "bxf-card dim-surfaceCard" },
    h2(
      "div",
      { className: "bxf-error dim-inlineError", role: "alert" },
      h2(
        "div",
        null,
        h2("h3", null, "\u65E0\u6CD5\u8BFB\u53D6\u98DE\u4E66\u673A\u5668\u4EBA"),
        h2("p", null, error.message),
        error.code ? h2("span", { className: "bxf-errorCode" }, error.code) : null,
        h2(
          "div",
          { className: "bxf-actions dim-viewActions" },
          h2(
            Button5,
            { kind: "primary", onClick: onRetry, disabled: busy },
            busy ? "\u91CD\u8BD5\u4E2D\u2026" : "\u91CD\u65B0\u8BFB\u53D6"
          )
        )
      )
    )
  );
}
var EMPTY_TOTALS2 = Object.freeze({ configured: 0, connected: 0 });
function mergeFeishuSnapshotState(current, snapshot, { restoreProvisioning = false, now = Date.now() } = {}) {
  if (snapshot.revision > 0 && current.revision > snapshot.revision) return current;
  let provisioning = current.provisioning;
  if (!provisioning && restoreProvisioning && snapshot.provisioning) {
    provisioning = {
      phase: snapshot.state === "connecting" ? "connecting" : "qr",
      ...snapshot.provisioning,
      durationMs: Math.max(1, snapshot.provisioning.expiresAt - now),
      expired: snapshot.provisioning.expiresAt <= now
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
    statusError: null
  };
}
function FeishuSettingsTab({ rpcCall }) {
  const [model, setModel] = React7.useState({
    phase: "loading",
    revision: 0,
    bots: [],
    totals: EMPTY_TOTALS2,
    provisioning: null,
    pageError: null,
    statusError: null
  });
  const [pageBusy, setPageBusy] = React7.useState(false);
  const [provisionBusy, setProvisionBusy] = React7.useState(false);
  const [credentialOpen, setCredentialOpen] = React7.useState(false);
  const [credentialBusy, setCredentialBusy] = React7.useState(false);
  const [credentialError, setCredentialError] = React7.useState(null);
  const [busyByBot, setBusyByBot] = React7.useState({});
  const [errorsByBot, setErrorsByBot] = React7.useState({});
  const [removeTargetId, setRemoveTargetId] = React7.useState(null);
  const [announcement, setAnnouncement] = React7.useState("");
  const [now, setNow] = React7.useState(() => Date.now());
  const [focusBotId, setFocusBotId] = React7.useState(null);
  const cardRefs = React7.useRef(/* @__PURE__ */ new Map());
  const removeButtonRefs = React7.useRef(/* @__PURE__ */ new Map());
  const addButtonRef = React7.useRef(null);
  const scheduleAnimationFrame = useAnimationFrameScheduler();
  const announce = React7.useCallback((message) => {
    setAnnouncement("");
    scheduleAnimationFrame(() => {
      if (message) setAnnouncement(message);
    }, "announcement");
  }, [scheduleAnimationFrame]);
  const invoke = React7.useCallback(async (endpoint, payload = {}, signal) => {
    return unwrapRpcResult3(await rpcCall(endpoint, payload, signal));
  }, [rpcCall]);
  const mergeSnapshot = React7.useCallback((snapshot, { restoreProvisioning = false } = {}) => {
    const now2 = Date.now();
    setModel((current) => mergeFeishuSnapshotState(
      current,
      snapshot,
      { restoreProvisioning, now: now2 }
    ));
  }, []);
  const loadStatus = React7.useCallback(async ({ signal, silent = false, restoreProvisioning = false } = {}) => {
    if (!silent) setPageBusy(true);
    try {
      const snapshot = normalizeBotsSnapshot(await invoke(FEISHU_ENDPOINTS.status, {}, signal));
      if (signal?.aborted) return void 0;
      mergeSnapshot(snapshot, { restoreProvisioning });
      return snapshot;
    } catch (error) {
      if (signal?.aborted || error?.name === "AbortError") return void 0;
      const presented = presentError3(error);
      setModel((current) => current.phase === "loading" || !silent ? { ...current, phase: "error", pageError: presented } : { ...current, statusError: presented });
      return void 0;
    } finally {
      if (!silent && !signal?.aborted) setPageBusy(false);
    }
  }, [invoke, mergeSnapshot]);
  React7.useEffect(() => {
    const controller = new AbortController();
    void loadStatus({ signal: controller.signal, restoreProvisioning: true });
    return () => controller.abort();
  }, [loadStatus]);
  React7.useEffect(() => {
    if (model.phase !== "ready") return void 0;
    const controller = new AbortController();
    let inFlight = false;
    const timer = window.setInterval(async () => {
      if (inFlight) return;
      inFlight = true;
      await loadStatus({
        signal: controller.signal,
        silent: true,
        restoreProvisioning: false
      });
      inFlight = false;
    }, 15e3);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadStatus, model.phase]);
  React7.useEffect(() => {
    if (!focusBotId) return;
    const node = cardRefs.current.get(focusBotId);
    if (!node) return;
    node.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    node.focus({ preventScroll: true });
    setFocusBotId(null);
  }, [focusBotId, model.bots]);
  const startProvisioning = React7.useCallback(async ({ replace = false } = {}) => {
    setCredentialOpen(false);
    setCredentialError(null);
    setProvisionBusy(true);
    announce("");
    const previousAttemptId = model.provisioning?.attemptId;
    setModel((current) => ({
      ...current,
      phase: current.phase === "loading" ? "ready" : current.phase,
      provisioning: { phase: "creating" }
    }));
    try {
      if (replace && previousAttemptId) {
        await invoke(FEISHU_ENDPOINTS.cancelProvisioning, { attemptId: previousAttemptId });
      }
      const provision2 = normalizeProvisioning2(await invoke(
        FEISHU_ENDPOINTS.beginProvisioning,
        { locale: "zh-CN" }
      ));
      const timestamp7 = Date.now();
      setNow(timestamp7);
      setModel((current) => ({
        ...current,
        provisioning: {
          phase: "qr",
          ...provision2,
          durationMs: Math.max(1, provision2.expiresAt - timestamp7),
          expired: false
        }
      }));
      announce("\u6388\u6743\u4E8C\u7EF4\u7801\u5DF2\u751F\u6210\uFF0C\u8BF7\u4F7F\u7528\u98DE\u4E66\u626B\u7801\u3002");
    } catch (error) {
      setModel((current) => ({
        ...current,
        provisioning: { phase: "error", error: presentError3(error) }
      }));
    } finally {
      setProvisionBusy(false);
    }
  }, [announce, invoke, model.provisioning?.attemptId]);
  const bindCredentials = React7.useCallback(async ({ identity, secret }) => {
    setCredentialBusy(true);
    setCredentialError(null);
    try {
      const snapshot = normalizeBotsSnapshot(await invoke(
        FEISHU_ENDPOINTS.bindCredentials,
        { appId: identity, appSecret: secret }
      ));
      mergeSnapshot(snapshot);
      setCredentialOpen(false);
      announce("\u98DE\u4E66\u673A\u5668\u4EBA\u51ED\u636E\u5DF2\u7ED1\u5B9A\u3002");
    } catch (error) {
      setCredentialError(presentError3(error));
    } finally {
      setCredentialBusy(false);
    }
  }, [announce, invoke, mergeSnapshot]);
  const cancelProvisioning = React7.useCallback(async () => {
    const attemptId = model.provisioning?.attemptId;
    setProvisionBusy(true);
    try {
      if (attemptId) await invoke(FEISHU_ENDPOINTS.cancelProvisioning, { attemptId });
      setModel((current) => ({ ...current, provisioning: null }));
      announce("\u5DF2\u53D6\u6D88\u6DFB\u52A0\u673A\u5668\u4EBA\u3002");
      await loadStatus({ silent: true, restoreProvisioning: false });
      scheduleAnimationFrame(() => addButtonRef.current?.focus(), "focus");
    } catch (error) {
      setModel((current) => ({
        ...current,
        provisioning: { phase: "error", attemptId, error: presentError3(error) }
      }));
    } finally {
      setProvisionBusy(false);
    }
  }, [announce, invoke, loadStatus, model.provisioning?.attemptId, scheduleAnimationFrame]);
  const countdownAttemptId = model.provisioning?.attemptId;
  const countdownPhase = model.provisioning?.phase;
  const countdownExpiresAt = model.provisioning?.expiresAt;
  const countdownExpired = model.provisioning?.expired;
  React7.useEffect(() => {
    if (!countdownAttemptId || countdownPhase !== "qr" || countdownExpired) return void 0;
    const tick = () => {
      const timestamp7 = Date.now();
      setNow(timestamp7);
      if (timestamp7 >= countdownExpiresAt) {
        setModel((current) => current.provisioning?.attemptId === countdownAttemptId ? { ...current, provisioning: { ...current.provisioning, expired: true } } : current);
      }
    };
    tick();
    const timer = window.setInterval(tick, 1e3);
    return () => window.clearInterval(timer);
  }, [countdownAttemptId, countdownPhase, countdownExpiresAt, countdownExpired]);
  React7.useEffect(() => {
    const provision2 = model.provisioning;
    if (!provision2 || !["qr", "connecting"].includes(provision2.phase) || !provision2.attemptId || provision2.expired) return void 0;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const result = normalizePollResult(await invoke(
          FEISHU_ENDPOINTS.pollProvisioning,
          { attemptId: provision2.attemptId },
          controller.signal
        ));
        if (result.status === "connected") {
          const snapshot = await loadStatus({ signal: controller.signal, silent: true, restoreProvisioning: false });
          const newBot = snapshot?.bots.find((bot) => bot.botId === result.botId);
          if (!snapshot) {
            throw new Error("\u673A\u5668\u4EBA\u5DF2\u7ECF\u521B\u5EFA\uFF0C\u4F46\u6682\u65F6\u65E0\u6CD5\u786E\u8BA4\u8FDE\u63A5\u72B6\u6001");
          }
          if (!newBot?.connected) {
            setModel((current) => current.provisioning?.attemptId === provision2.attemptId ? { ...current, provisioning: { ...current.provisioning, phase: "connecting" } } : current);
            return;
          }
          setModel((current) => ({ ...current, provisioning: null }));
          announce(newBot ? `${newBot.bot.name}\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5728\u98DE\u4E66\u4E2D\u5F00\u59CB\u804A\u5929\u3002` : "\u65B0\u98DE\u4E66\u673A\u5668\u4EBA\u5DF2\u8FDE\u63A5\uFF0C\u53EF\u4EE5\u5F00\u59CB\u804A\u5929\u3002");
          if (result.botId) setFocusBotId(result.botId);
          return;
        }
        if (result.status === "failed") {
          const error = new Error(result.message ?? "\u98DE\u4E66\u5E94\u7528\u521B\u5EFA\u5931\u8D25");
          error.code = "FEISHU_PROVISION_FAILED";
          throw error;
        }
        if (result.status === "expired") {
          setModel((current) => current.provisioning?.attemptId === provision2.attemptId ? { ...current, provisioning: { ...current.provisioning, phase: "qr", expired: true } } : current);
          return;
        }
        setModel((current) => {
          if (current.provisioning?.attemptId !== provision2.attemptId) return current;
          const next = result.provisioning ?? current.provisioning;
          return {
            ...current,
            provisioning: {
              ...current.provisioning,
              ...next,
              phase: ["scanned", "connecting"].includes(result.status) ? "connecting" : "qr"
            }
          };
        });
      } catch (error) {
        if (error?.name === "AbortError") return;
        setModel((current) => current.provisioning?.attemptId === provision2.attemptId ? {
          ...current,
          provisioning: {
            phase: "error",
            attemptId: provision2.attemptId,
            error: presentError3(error)
          }
        } : current);
      }
    }, provision2.pollIntervalMs);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [announce, invoke, loadStatus, model.provisioning]);
  const setBotBusy = React7.useCallback((botId, value) => {
    setBusyByBot((current) => {
      const next = { ...current };
      if (value) next[botId] = value;
      else delete next[botId];
      return next;
    });
  }, []);
  const setBotError = React7.useCallback((botId, error) => {
    setErrorsByBot((current) => {
      const next = { ...current };
      if (error) next[botId] = presentError3(error);
      else delete next[botId];
      return next;
    });
  }, []);
  const reconnectOneBot = React7.useCallback(async (connection) => {
    const { botId, bot } = connection;
    setBotBusy(botId, "reconnect");
    setBotError(botId, null);
    try {
      const snapshot = normalizeBotsSnapshot(await invoke(FEISHU_ENDPOINTS.reconnectBot, { botId }));
      mergeSnapshot(snapshot);
      const refreshed = snapshot.bots.find((item) => item.botId === botId);
      if (!refreshed?.connected) {
        const error = new Error(
          refreshed?.error?.message ?? refreshed?.health.summary ?? "\u673A\u5668\u4EBA\u4ECD\u672A\u8FDE\u63A5"
        );
        error.code = refreshed?.error?.code ?? "FEISHU_BOT_OFFLINE";
        throw error;
      }
      announce(connection.connected ? `${bot.name}\u8FDE\u63A5\u68C0\u67E5\u5B8C\u6210\u3002` : `${bot.name}\u5DF2\u91CD\u65B0\u8FDE\u63A5\u3002`);
    } catch (error) {
      setBotError(botId, error);
      announce(`${bot.name}\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u67E5\u770B\u673A\u5668\u4EBA\u72B6\u6001\u3002`);
    } finally {
      setBotBusy(botId, null);
    }
  }, [announce, invoke, mergeSnapshot, setBotBusy, setBotError]);
  const requestRemove = React7.useCallback((connection) => {
    setRemoveTargetId(connection.botId);
  }, []);
  const cancelRemove = React7.useCallback(() => {
    const botId = removeTargetId;
    setRemoveTargetId(null);
    scheduleAnimationFrame(() => removeButtonRefs.current.get(botId)?.focus(), "focus");
  }, [removeTargetId, scheduleAnimationFrame]);
  const confirmRemove = React7.useCallback(async (connection) => {
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
            connected: bots.filter((item) => item.connected).length
          }
        };
      });
      announce(`${bot.name}\u5DF2\u4ECE\u6B64 DeepSeek Harness \u79FB\u9664\uFF1B\u98DE\u4E66\u5F00\u653E\u5E73\u53F0\u4E2D\u7684\u5E94\u7528\u672A\u88AB\u5220\u9664\u3002`);
      await loadStatus({ silent: true });
      scheduleAnimationFrame(() => addButtonRef.current?.focus(), "focus");
    } catch (error) {
      setBotError(botId, error);
      announce(`${bot.name}\u79FB\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002`);
    } finally {
      setBotBusy(botId, null);
    }
  }, [announce, invoke, loadStatus, scheduleAnimationFrame, setBotBusy, setBotError]);
  const provision = model.provisioning;
  let provisionContent = null;
  if (provision?.phase === "creating") {
    provisionContent = h2(ProvisionProgress, { phase: "creating", busy: provisionBusy });
  } else if (provision?.phase === "qr") {
    provisionContent = h2(QrPane, {
      provision,
      now,
      onRefresh: () => void startProvisioning({ replace: true }),
      onCancel: () => void cancelProvisioning(),
      busy: provisionBusy || model.phase !== "ready"
    });
  } else if (provision?.phase === "connecting") {
    provisionContent = h2(ProvisionProgress, {
      phase: "connecting",
      onCancel: () => void cancelProvisioning(),
      busy: provisionBusy
    });
  } else if (provision?.phase === "error") {
    provisionContent = h2(ProvisionError2, {
      error: provision.error,
      onRetry: () => void startProvisioning({ replace: Boolean(provision.attemptId) }),
      onCancel: () => void cancelProvisioning(),
      busy: provisionBusy
    });
  }
  const credentialContent = credentialOpen ? h2(CredentialBindingPanel, {
    channel: "\u98DE\u4E66",
    identityLabel: "App ID",
    identityPlaceholder: "\u586B\u5199\u98DE\u4E66\u5F00\u653E\u5E73\u53F0 App ID",
    secretLabel: "App Secret",
    secretPlaceholder: "\u586B\u5199\u98DE\u4E66\u5F00\u653E\u5E73\u53F0 App Secret",
    busy: credentialBusy,
    error: credentialError,
    onSubmit: bindCredentials,
    onCancel: () => {
      setCredentialOpen(false);
      setCredentialError(null);
    }
  }) : null;
  const setCardRef = React7.useCallback((botId, node) => {
    if (node) cardRefs.current.set(botId, node);
    else cardRefs.current.delete(botId);
  }, []);
  const setRemoveButtonRef = React7.useCallback((botId, node) => {
    if (node) removeButtonRefs.current.set(botId, node);
    else removeButtonRefs.current.delete(botId);
  }, []);
  return h2(
    "section",
    { className: "bxf-page dim-channelPage", "aria-label": "\u98DE\u4E66\u673A\u5668\u4EBA\u8BBE\u7F6E" },
    h2(Heading2, {
      totals: model.totals,
      onAdd: () => void startProvisioning(),
      onCredential: () => {
        setCredentialOpen((value) => !value);
        setCredentialError(null);
      },
      credentialOpen,
      adding: Boolean(provision),
      busy: provisionBusy || credentialBusy,
      addButtonRef
    }),
    h2("div", {
      className: "bxf-visuallyHidden",
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true"
    }, announcement),
    model.statusError ? h2(
      "div",
      { className: "bxf-statusNotice dim-statusNotice", role: "status" },
      h2(AlertIcon, { size: 16 }),
      h2("span", null, `\u72B6\u6001\u81EA\u52A8\u5237\u65B0\u5931\u8D25\uFF1A${model.statusError.message}`),
      h2(Button5, { size: "small", onClick: () => void loadStatus({ silent: true }), disabled: pageBusy }, "\u7ACB\u5373\u91CD\u8BD5")
    ) : null,
    model.phase === "loading" ? h2(LoadingView2) : model.phase === "error" ? h2(PageError, {
      error: model.pageError ?? { message: "\u65E0\u6CD5\u8BFB\u53D6\u8FDE\u63A5\u72B6\u6001" },
      onRetry: () => void loadStatus(),
      busy: pageBusy
    }) : h2(
      React7.Fragment,
      null,
      credentialContent,
      provisionContent,
      model.bots.length === 0 && !provision && !credentialOpen ? h2(EmptyView2, { onStart: () => void startProvisioning(), busy: provisionBusy }) : null,
      model.bots.length > 0 ? h2(BotList, {
        bots: model.bots,
        busyByBot,
        errorsByBot,
        removeTargetId,
        onReconnect: (bot) => void reconnectOneBot(bot),
        onRequestRemove: requestRemove,
        onConfirmRemove: (bot) => void confirmRemove(bot),
        onCancelRemove: cancelRemove,
        setCardRef,
        setRemoveButtonRef
      }) : null
    )
  );
}

// plugin-src/client/channels/qq/api.js
var QQ_RPC_CHANNEL = "/qq";
var QQ_ENDPOINTS = Object.freeze({
  status: "connection.status",
  beginProvisioning: "provision.begin",
  pollProvisioning: "provision.poll",
  cancelProvisioning: "provision.cancel",
  bindCredentials: "bot.bind-credentials",
  reconnectBot: "bot.reconnect",
  deleteBot: "bot.delete"
});
var PROVISION_STATES2 = /* @__PURE__ */ new Set(["starting", "pending", "refreshing", "connecting", "connected", "failed", "cancelled"]);
var ACCOUNT_STATES3 = /* @__PURE__ */ new Set(["connected", "connecting", "offline", "error"]);
var QR_DATA_URL2 = /^data:image\/(?:png|webp);base64,[a-z\d+/]+={0,2}$/i;
function isRecord4(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function text2(value, fallback, max = 240) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}
function id2(value) {
  const result = text2(value, "", 128);
  return /^[a-z\d_-]+$/i.test(result) ? result : void 0;
}
function timestamp3(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = typeof value === "string" ? Date.parse(value) : Number.NaN;
  return Number.isNaN(parsed) ? void 0 : parsed;
}
function unwrapRpcResult4(result) {
  if (!isRecord4(result) || typeof result.ok !== "boolean") throw new Error("QQ \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94");
  if (!result.ok) {
    const error = new Error(text2(result.error?.message, "QQ \u64CD\u4F5C\u5931\u8D25"));
    error.code = text2(result.error?.code, "QQ_RPC_ERROR", 80);
    throw error;
  }
  return result.value;
}
function safeQrSource3(value) {
  return typeof value === "string" && value.length <= 2 * 1024 * 1024 && QR_DATA_URL2.test(value) ? value : void 0;
}
function normalizeProvisioning3(value, now = Date.now()) {
  const source = isRecord4(value?.provisioning) ? value.provisioning : value;
  if (!isRecord4(source)) throw new Error("QQ \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u7ED1\u5B9A\u8FDB\u5EA6");
  const attemptId = id2(source.attemptId);
  if (!attemptId) throw new Error("QQ \u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1");
  const reported = text2(source.status, "failed", 32);
  const result = {
    attemptId,
    status: PROVISION_STATES2.has(reported) ? reported : "failed",
    expiresAt: timestamp3(source.expiresAt) ?? now + 5 * 6e4,
    pollIntervalMs: Math.min(1e4, Math.max(500, Number(source.pollIntervalMs) || 1e3)),
    qrRevision: Number.isSafeInteger(source.qrRevision) ? source.qrRevision : 0
  };
  const qrCodeDataUrl = safeQrSource3(source.qrCodeDataUrl);
  if (qrCodeDataUrl) result.qrCodeDataUrl = qrCodeDataUrl;
  if (id2(source.botId)) result.botId = id2(source.botId);
  if (isRecord4(source.error)) result.error = {
    code: text2(source.error.code, "QQ_PROVISION_FAILED", 80),
    message: text2(source.error.message, "QQ \u673A\u5668\u4EBA\u6CA1\u6709\u63A5\u5165\u5B8C\u6210")
  };
  return result;
}
function normalizeBot3(value) {
  if (!isRecord4(value) || !id2(value.botId)) return void 0;
  const connected = value.connected === true;
  const state = ACCOUNT_STATES3.has(value.state) ? value.state : "offline";
  return {
    botId: id2(value.botId),
    connected,
    state: connected ? "connected" : state,
    bot: {
      name: text2(value.bot?.name, "QQ\u673A\u5668\u4EBA", 100),
      appIdMasked: text2(value.bot?.appIdMasked, "\u5E94\u7528\u6807\u8BC6\u5DF2\u5B89\u5168\u4FDD\u5B58", 140)
    },
    health: {
      summary: text2(value.health?.summary, connected ? "QQ WebSocket \u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38" : "QQ \u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA"),
      lastCheckedAt: timestamp3(value.health?.lastCheckedAt)
    },
    error: isRecord4(value.error) ? {
      code: text2(value.error.code, "QQ_ACCOUNT_ERROR", 80),
      message: text2(value.error.message, "QQ \u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA")
    } : null
  };
}
function normalizeSnapshot3(value) {
  const source = isRecord4(value?.snapshot) ? value.snapshot : value;
  if (!isRecord4(source) || !Array.isArray(source.bots)) throw new Error("QQ \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868");
  const bots = source.bots.map(normalizeBot3).filter(Boolean);
  return {
    revision: Number.isSafeInteger(source.revision) ? source.revision : 0,
    bots,
    totals: { configured: bots.length, connected: bots.filter((bot) => bot.connected).length },
    provisioning: source.provisioning ? normalizeProvisioning3(source.provisioning) : null
  };
}
function presentError4(error) {
  return {
    code: text2(error?.code, "QQ_ERROR", 80),
    message: text2(error?.message, "QQ \u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5")
  };
}
function formatRemaining3(milliseconds) {
  const seconds = Math.max(0, Math.ceil(Number(milliseconds) / 1e3) || 0);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

// plugin-src/client/channels/qq/index.js
var React8 = __toESM(require("react"), 1);

// plugin-src/client/channels/qq/styles.js
var QQ_STYLE_ID = "xmanrui-dsh-im-qq-settings";
var CSS4 = String.raw`
.dqq-page { --ddt-accent: #1677ff; --ddt-accent-deep: #0958d9; --ddt-accent-wash: #eaf3ff; }
.dqq-avatar, .dqq-brand { color: #fff; background: #1677ff; }
.dqq-avatar svg, .dqq-brand svg { display: block; }
`;
function installQqStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${QQ_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-im";
  style.dataset.pluginCss = QQ_STYLE_ID;
  style.textContent = CSS4;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/qq/index.js
var ACTIVE_STATES = /* @__PURE__ */ new Set(["pending", "refreshing", "connecting"]);
var Button7 = React8.forwardRef(function Button8({ children, kind = "secondary", className = "", ...props }, ref) {
  return h2("button", {
    ...props,
    ref,
    type: "button",
    className: `ddt-button ${className}`.trim(),
    "data-kind": kind
  }, children);
});
function checkedTime3(value) {
  if (!value) return "\u5C1A\u672A\u68C0\u67E5";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(value));
  } catch {
    return "\u521A\u521A";
  }
}
function Heading3({ totals, adding, busy, onAdd, onCredential, credentialOpen, addButtonRef }) {
  return h2(
    "div",
    { className: "ddt-heading" },
    h2(
      "div",
      { className: "ddt-tools" },
      h2(
        "div",
        { className: "dim-bindActions" },
        h2(Button7, {
          kind: "primary",
          className: "dim-scanButton",
          onClick: onAdd,
          disabled: adding || busy,
          ref: addButtonRef,
          "aria-label": "\u626B\u7801\u63A5\u5165 QQ \u673A\u5668\u4EBA"
        }, h2(QrActionIcon), adding ? "\u6B63\u5728\u63A5\u5165" : "\u626B\u7801\u63A5\u5165\u673A\u5668\u4EBA"),
        h2(Button7, {
          kind: "credential",
          className: "dim-credentialButton",
          onClick: onCredential,
          disabled: adding || busy,
          "aria-pressed": credentialOpen,
          "aria-label": "\u4F7F\u7528 AppID \u548C AppSecret \u7ED1\u5B9A QQ \u673A\u5668\u4EBA"
        }, h2(CredentialActionIcon), credentialOpen ? "\u6536\u8D77\u51ED\u636E" : "\u624B\u52A8\u63A5\u5165")
      ),
      totals.configured > 0 ? h2(
        "div",
        { className: "ddt-badge dim-onlineBadge" },
        h2("span", null, `${totals.connected} / ${totals.configured} \u5728\u7EBF`)
      ) : null
    )
  );
}
function LoadingView3() {
  return h2(
    "div",
    { className: "ddt-card ddt-loading dim-surfaceCard dim-loadingView", "aria-busy": "true" },
    h2("div", { className: "ddt-spinner dim-spinner" }),
    h2("span", null, "\u6B63\u5728\u8BFB\u53D6 QQ \u673A\u5668\u4EBA\u72B6\u6001\u2026")
  );
}
function EmptyView3({ busy, onStart }) {
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-empty dim-surfaceBody dim-emptyView" },
      h2(
        "div",
        { className: "dim-emptyCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot" }),
          h2("span", null, "\u5C1A\u672A\u7ED1\u5B9A QQ \u673A\u5668\u4EBA")
        ),
        h2("h3", null, "\u4F7F\u7528\u624B\u673A QQ \u626B\u7801\u521B\u5EFA\u5E76\u7ED1\u5B9A\u673A\u5668\u4EBA"),
        h2("p", null, "\u626B\u7801\u7531\u817E\u8BAF\u5B98\u65B9\u9875\u9762\u5B8C\u6210\uFF0C\u4E0D\u9700\u8981\u624B\u52A8\u586B\u5199 AppID \u6216 AppSecret\u3002\u626B\u7801\u6210\u529F\u540E\uFF0C\u673A\u5668\u4EBA\u4F1A\u81EA\u52A8\u8FDE\u63A5 DeepSeek Harness\u3002"),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(
            Button7,
            { kind: "primary", onClick: onStart, disabled: busy },
            busy ? "\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026" : "\u751F\u6210 QQ \u4E8C\u7EF4\u7801"
          )
        )
      ),
      h2(
        "div",
        { className: "ddt-brandMark dim-emptyBrand dqq-brand", "aria-hidden": "true" },
        h2(QqLogoGlyph, { size: 64 })
      )
    )
  );
}
function QrPanel2({ provision, now, busy, onRefresh, onCancel }) {
  const source = safeQrSource3(provision.qrCodeDataUrl);
  const remaining = Math.max(0, provision.expiresAt - now);
  const duration = Math.max(1, provision.durationMs ?? 5 * 6e4);
  const progress = Math.round(Math.min(1, remaining / duration) * 100);
  const refreshing = provision.status === "refreshing";
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-qrLayout dim-surfaceBody dim-qrLayout" },
      h2(
        "div",
        { className: "ddt-qrColumn dim-qrColumn" },
        h2(
          "div",
          { className: "ddt-qrFrame dim-qrFrame" },
          source ? h2("img", { src: source, alt: "\u7528\u4E8E\u7ED1\u5B9A QQ \u673A\u5668\u4EBA\u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801" }) : h2(
            "div",
            { className: "ddt-qrFallback dim-qrFallback" },
            refreshing ? "\u4E8C\u7EF4\u7801\u6B63\u5728\u81EA\u52A8\u5237\u65B0\u2026" : "\u4E8C\u7EF4\u7801\u56FE\u7247\u6B63\u5728\u751F\u6210\u2026"
          )
        ),
        h2(
          "div",
          { className: "ddt-countdown dim-countdown" },
          h2(
            "div",
            { className: "ddt-countdownTop dim-countdownTop" },
            h2("span", null, "\u5F53\u524D\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4"),
            h2("strong", null, refreshing ? "--:--" : formatRemaining3(remaining))
          ),
          h2("div", { className: "ddt-progress dim-progress", style: { "--ddt-progress": `${progress}%` } }, h2("span"))
        )
      ),
      h2(
        "div",
        { className: "ddt-qrCopy dim-qrCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot", "data-tone": "warning" }),
          h2("span", null, refreshing ? "\u6B63\u5728\u5237\u65B0\u4E8C\u7EF4\u7801" : "\u7B49\u5F85\u624B\u673A QQ \u626B\u7801")
        ),
        h2("h3", null, "\u4F7F\u7528\u624B\u673A QQ \u5B8C\u6210\u673A\u5668\u4EBA\u7ED1\u5B9A"),
        h2("p", null, "\u817E\u8BAF\u9875\u9762\u4F1A\u521B\u5EFA\u6216\u7ED1\u5B9A\u4E00\u4E2A QQ \u673A\u5668\u4EBA\uFF0C\u5E76\u628A\u8FDE\u63A5\u51ED\u636E\u5B89\u5168\u4EA4\u7ED9\u672C\u673A Harness Host\u3002"),
        h2(
          "ol",
          { className: "ddt-steps dim-steps" },
          h2("li", null, "\u6253\u5F00\u624B\u673A QQ\uFF0C\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801"),
          h2("li", null, "\u5728\u817E\u8BAF\u6388\u6743\u9875\u9762\u786E\u8BA4\u521B\u5EFA\u6216\u7ED1\u5B9A\u673A\u5668\u4EBA"),
          h2("li", null, "\u8FD4\u56DE\u8FD9\u91CC\u7B49\u5F85\u8FDE\u63A5\u5B8C\u6210")
        ),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(Button7, { onClick: onRefresh, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
          h2(Button7, { kind: "quiet", onClick: onCancel, disabled: busy }, "\u53D6\u6D88")
        )
      )
    )
  );
}
function ProvisionView({ provision, busy, onRetry, onClose }) {
  if (provision.status === "connecting") {
    return h2(
      "div",
      { className: "ddt-card ddt-loading dim-surfaceCard dim-specialView", "aria-busy": "true" },
      h2("div", { className: "ddt-spinner dim-spinner" }),
      h2("h3", null, "QQ \u5DF2\u6388\u6743\uFF0C\u6B63\u5728\u8FDE\u63A5\u673A\u5668\u4EBA"),
      h2("p", null, "\u51ED\u636E\u6B63\u5728\u5199\u5165\u672C\u673A\uFF0C\u5E76\u542F\u52A8 QQ WebSocket \u6D88\u606F\u8FDE\u63A5\u3002")
    );
  }
  const error = provision.error ?? { code: "QQ_PROVISION_FAILED", message: "QQ \u673A\u5668\u4EBA\u6CA1\u6709\u7ED1\u5B9A\u5B8C\u6210" };
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-inlineError dim-inlineError", role: "alert" },
      h2("h3", null, "QQ \u673A\u5668\u4EBA\u6CA1\u6709\u7ED1\u5B9A\u5B8C\u6210"),
      h2("p", null, error.message),
      h2("span", { className: "ddt-errorCode" }, error.code),
      h2(
        "div",
        { className: "ddt-actions dim-viewActions" },
        h2(Button7, { kind: "primary", onClick: onRetry, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
        h2(Button7, { onClick: onClose, disabled: busy }, "\u5173\u95ED")
      )
    )
  );
}
function RemoveConfirmation3({ account, busy, onConfirm, onCancel }) {
  return h2(
    "div",
    { className: "ddt-confirm dim-confirm", role: "alertdialog" },
    h2("strong", null, `\u4ECE DeepSeek Harness \u79FB\u9664\u201C${account.bot.name}\u201D\uFF1F`),
    h2("p", null, "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684\u5E94\u7528\u51ED\u636E\u3001\u673A\u5668\u4EBA\u914D\u7F6E\u53CA\u4F1A\u8BDD\u6620\u5C04\u3002\u817E\u8BAF\u5E73\u53F0\u4E2D\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\u3002"),
    h2(
      "div",
      { className: "ddt-actions dim-viewActions" },
      h2(Button7, { onClick: onCancel, disabled: busy }, "\u4FDD\u7559\u673A\u5668\u4EBA"),
      h2(Button7, { kind: "danger", onClick: onConfirm, disabled: busy }, busy ? "\u6B63\u5728\u79FB\u9664\u2026" : "\u786E\u8BA4\u79FB\u9664\u63A5\u5165")
    )
  );
}
function AccountCard2({ account, busy, removing, onReconnect, onRequestRemove, onConfirmRemove, onCancelRemove }) {
  const tone = account.connected ? "success" : account.state === "error" ? "error" : "warning";
  const stateLabel = account.connected ? "\u8FD0\u884C\u6B63\u5E38" : account.state === "connecting" ? "\u6B63\u5728\u8FDE\u63A5" : "\u8FDE\u63A5\u672A\u5C31\u7EEA";
  const summary = account.error?.message ?? (account.connected ? null : account.health.summary);
  return h2(
    "article",
    { className: "ddt-card dim-botCard", "data-bot-id": account.botId },
    h2(
      "div",
      { className: "ddt-cardBody dim-botCardBody" },
      h2(
        "div",
        { className: "ddt-accountTop dim-botCardTop" },
        h2(
          "div",
          { className: "ddt-accountIdentity dim-botIdentity" },
          h2("div", { className: "ddt-avatar dim-botAvatar dqq-avatar", "aria-hidden": "true" }, h2(QqLogoGlyph, { size: 29 })),
          h2(
            "div",
            { className: "dim-botName" },
            h2("h3", null, account.bot.name),
            h2("p", null, account.bot.appIdMasked)
          )
        ),
        h2(
          "div",
          { className: "ddt-health dim-botHealth" },
          h2("span", { className: "ddt-dot dim-healthDot", "data-tone": tone }),
          h2("span", null, stateLabel)
        )
      ),
      h2(
        "dl",
        { className: "ddt-metrics dim-botMetrics" },
        h2("div", { className: "ddt-metric dim-botMetric" }, h2("dt", null, "\u6D88\u606F\u901A\u9053"), h2("dd", null, account.connected ? "WebSocket \u957F\u8FDE\u63A5" : "\u79BB\u7EBF")),
        h2("div", { className: "ddt-metric dim-botMetric" }, h2("dt", null, "\u6700\u8FD1\u68C0\u67E5"), h2("dd", null, checkedTime3(account.health.lastCheckedAt)))
      ),
      h2(
        "div",
        { className: "ddt-accountFooter dim-cardFooter" },
        summary ? h2("div", { className: "ddt-summary dim-cardSummary" }, summary) : null,
        h2(
          "div",
          { className: "ddt-actions dim-cardActions" },
          h2(Button7, { className: "dim-cardAction", onClick: onReconnect, disabled: Boolean(busy) }, busy === "reconnect" ? "\u68C0\u67E5\u4E2D\u2026" : account.connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"),
          h2(Button7, { className: "dim-cardAction", kind: "danger", onClick: onRequestRemove, disabled: Boolean(busy) }, "\u79FB\u9664\u63A5\u5165")
        )
      )
    ),
    removing ? h2(RemoveConfirmation3, {
      account,
      busy: busy === "delete",
      onConfirm: onConfirmRemove,
      onCancel: onCancelRemove
    }) : null
  );
}
function QqSettingsTab({ rpcCall }) {
  const [model, setModel] = React8.useState({ phase: "loading", bots: [], totals: { configured: 0, connected: 0 }, error: null });
  const [provision, setProvision] = React8.useState(null);
  const [busy, setBusy] = React8.useState(false);
  const [busyByBot, setBusyByBot] = React8.useState({});
  const [removeTarget, setRemoveTarget] = React8.useState(null);
  const [credentialOpen, setCredentialOpen] = React8.useState(false);
  const [credentialError, setCredentialError] = React8.useState(null);
  const [now, setNow] = React8.useState(Date.now());
  const mounted = React8.useRef(true);
  const addButtonRef = React8.useRef(null);
  React8.useEffect(() => {
    const disposeDingtalk = installDingtalkStyles();
    const disposeQq = installQqStyles();
    mounted.current = true;
    return () => {
      mounted.current = false;
      disposeQq();
      disposeDingtalk();
    };
  }, []);
  const invoke = React8.useCallback(async (endpoint, payload = {}, signal) => {
    if (typeof rpcCall !== "function") throw new TypeError("QQ \u8BBE\u7F6E\u9875\u7F3A\u5C11 RPC \u8FDE\u63A5");
    return unwrapRpcResult4(await rpcCall(endpoint, payload, signal));
  }, [rpcCall]);
  const loadStatus = React8.useCallback(async ({ signal, silent = false, restore = false } = {}) => {
    if (!silent && mounted.current) setModel((current) => ({ ...current, phase: "loading", error: null }));
    try {
      const snapshot = normalizeSnapshot3(await invoke(QQ_ENDPOINTS.status, {}, signal));
      if (!mounted.current || signal?.aborted) return void 0;
      setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      if (restore && snapshot.provisioning) setProvision({
        ...snapshot.provisioning,
        durationMs: Math.max(1, snapshot.provisioning.expiresAt - Date.now())
      });
      return snapshot;
    } catch (error) {
      if (error?.name !== "AbortError" && mounted.current && !signal?.aborted) {
        setModel((current) => ({ ...current, phase: silent ? current.phase : "error", error: presentError4(error) }));
      }
      return void 0;
    }
  }, [invoke]);
  React8.useEffect(() => {
    const controller = new AbortController();
    void loadStatus({ signal: controller.signal, restore: true });
    return () => controller.abort();
  }, [loadStatus]);
  React8.useEffect(() => {
    if (model.phase !== "ready") return void 0;
    const controller = new AbortController();
    const timer = window.setInterval(() => void loadStatus({ signal: controller.signal, silent: true }), 15e3);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadStatus, model.phase]);
  React8.useEffect(() => {
    if (!provision || !ACTIVE_STATES.has(provision.status)) return void 0;
    const timer = window.setInterval(() => mounted.current && setNow(Date.now()), 1e3);
    return () => window.clearInterval(timer);
  }, [provision?.attemptId, provision?.status]);
  const startProvisioning = React8.useCallback(async (replace = false) => {
    setCredentialOpen(false);
    setCredentialError(null);
    setBusy(true);
    try {
      if (replace && provision?.attemptId) await invoke(QQ_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      if (!mounted.current) return;
      setProvision({ status: "starting" });
      const started = normalizeProvisioning3(await invoke(QQ_ENDPOINTS.beginProvisioning, { locale: "zh-CN" }));
      if (!mounted.current) return;
      setNow(Date.now());
      setProvision({ ...started, durationMs: Math.max(1, started.expiresAt - Date.now()) });
    } catch (error) {
      if (mounted.current) setProvision({ status: "failed", error: presentError4(error) });
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke, provision?.attemptId]);
  const bindCredentials = React8.useCallback(async ({ identity, secret }) => {
    setBusy(true);
    setCredentialError(null);
    try {
      const snapshot = normalizeSnapshot3(await invoke(
        QQ_ENDPOINTS.bindCredentials,
        { appId: identity, appSecret: secret }
      ));
      if (!mounted.current) return;
      setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      setCredentialOpen(false);
    } catch (error) {
      if (mounted.current) setCredentialError(presentError4(error));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke]);
  const closeProvision = React8.useCallback(async () => {
    setBusy(true);
    try {
      if (provision?.attemptId && ACTIVE_STATES.has(provision.status)) {
        await invoke(QQ_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      }
      if (mounted.current) setProvision(null);
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke, provision?.attemptId, provision?.status]);
  React8.useEffect(() => {
    const attemptId = provision?.attemptId;
    if (!attemptId || !ACTIVE_STATES.has(provision.status)) return void 0;
    const controller = new AbortController();
    let disposed = false;
    let timer;
    const poll = async () => {
      try {
        const current = normalizeProvisioning3(await invoke(QQ_ENDPOINTS.pollProvisioning, { attemptId }, controller.signal));
        if (disposed || controller.signal.aborted || !mounted.current) return;
        if (current.status === "connected") {
          setProvision(null);
          await loadStatus({ signal: controller.signal, silent: true });
          return;
        }
        setProvision((previous) => previous?.attemptId === attemptId ? { ...previous, ...current, durationMs: current.qrRevision !== previous.qrRevision ? Math.max(1, current.expiresAt - Date.now()) : previous.durationMs } : previous);
        if (ACTIVE_STATES.has(current.status)) timer = window.setTimeout(poll, current.pollIntervalMs);
      } catch (error) {
        if (!disposed && !controller.signal.aborted && mounted.current) {
          setProvision((current) => ({ ...current, status: "failed", error: presentError4(error) }));
        }
      }
    };
    timer = window.setTimeout(poll, provision.pollIntervalMs ?? 1e3);
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [invoke, loadStatus, provision?.attemptId, provision?.pollIntervalMs, provision?.status]);
  const botAction = React8.useCallback(async (account, operation, endpoint, payload) => {
    setBusyByBot((current) => ({ ...current, [account.botId]: operation }));
    try {
      const snapshot = normalizeSnapshot3(await invoke(endpoint, payload));
      if (mounted.current) setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      return snapshot;
    } finally {
      if (mounted.current) setBusyByBot((current) => {
        const next = { ...current };
        delete next[account.botId];
        return next;
      });
    }
  }, [invoke]);
  let provisionView = null;
  if (provision?.status === "starting") provisionView = h2("div", { className: "ddt-card ddt-loading dim-surfaceCard" }, h2("div", { className: "ddt-spinner" }), "\u6B63\u5728\u7533\u8BF7 QQ \u4E8C\u7EF4\u7801\u2026");
  else if (["pending", "refreshing"].includes(provision?.status)) provisionView = h2(QrPanel2, {
    provision,
    now,
    busy,
    onRefresh: () => void startProvisioning(true),
    onCancel: () => void closeProvision()
  });
  else if (provision) provisionView = h2(ProvisionView, {
    provision,
    busy,
    onRetry: () => void startProvisioning(true),
    onClose: () => void closeProvision()
  });
  const botList = model.bots.length > 0 ? h2(
    "section",
    { className: "dim-listSection" },
    h2(
      "div",
      { className: "ddt-listHeading dim-listHeading" },
      h2("h3", null, "\u5DF2\u7ED1\u5B9A\u7684 QQ \u673A\u5668\u4EBA")
    ),
    h2("ul", { className: "ddt-list dim-botList" }, model.bots.map((account) => h2("li", { key: account.botId }, h2(AccountCard2, {
      account,
      busy: busyByBot[account.botId],
      removing: removeTarget === account.botId,
      onReconnect: () => void botAction(account, "reconnect", QQ_ENDPOINTS.reconnectBot, { botId: account.botId }),
      onRequestRemove: () => setRemoveTarget(account.botId),
      onCancelRemove: () => setRemoveTarget(null),
      onConfirmRemove: async () => {
        await botAction(account, "delete", QQ_ENDPOINTS.deleteBot, { botId: account.botId, confirm: true });
        if (mounted.current) setRemoveTarget(null);
      }
    }))))
  ) : null;
  const credentialView = credentialOpen ? h2(CredentialBindingPanel, {
    channel: "QQ",
    identityLabel: "AppID",
    identityPlaceholder: "\u586B\u5199 QQ \u5F00\u653E\u5E73\u53F0 AppID",
    secretLabel: "AppSecret",
    secretPlaceholder: "\u586B\u5199 QQ \u5F00\u653E\u5E73\u53F0 AppSecret",
    busy,
    error: credentialError,
    onSubmit: bindCredentials,
    onCancel: () => {
      setCredentialOpen(false);
      setCredentialError(null);
    }
  }) : null;
  return h2(
    "section",
    { className: "ddt-page dqq-page dim-channelPage", "aria-label": "QQ \u8BBE\u7F6E" },
    h2(Heading3, {
      totals: model.totals,
      adding: Boolean(provision),
      busy,
      onAdd: () => void startProvisioning(),
      onCredential: () => {
        setCredentialOpen((value) => !value);
        setCredentialError(null);
      },
      credentialOpen,
      addButtonRef
    }),
    model.phase === "loading" ? h2(LoadingView3) : model.phase === "error" ? h2("div", { className: "ddt-card dim-surfaceCard" }, h2("div", { className: "ddt-inlineError dim-inlineError" }, h2("h3", null, "\u65E0\u6CD5\u8BFB\u53D6 QQ \u673A\u5668\u4EBA\u72B6\u6001"), h2("p", null, model.error?.message), h2(Button7, { onClick: () => void loadStatus() }, "\u91CD\u65B0\u8BFB\u53D6"))) : h2(
      React8.Fragment,
      null,
      credentialView,
      provisionView,
      model.bots.length === 0 && !provision && !credentialOpen ? h2(EmptyView3, { busy, onStart: () => void startProvisioning() }) : null,
      botList
    )
  );
}

// plugin-src/client/channels/slack/api.js
var SLACK_RPC_CHANNEL = "/slack";
var SLACK_ENDPOINTS = TOKEN_BOT_ENDPOINTS;
var api2 = createTokenChannelApi("Slack", " Socket Mode \u957F\u8FDE\u63A5");
var unwrapRpcResult5 = api2.unwrapRpcResult;
var normalizeSnapshot4 = api2.normalizeSnapshot;
var presentError5 = api2.presentError;

// plugin-src/client/channels/slack/index.js
var React9 = __toESM(require("react"), 1);

// src/channels/slack/manifest.mjs
var SLACK_APP_MANIFEST_YAML = `_metadata:
  major_version: 1
display_information:
  name: DeepSeek Harness
  description: Connect Slack conversations to a local DeepSeek Harness agent.
  background_color: "#4A154B"
features:
  app_home:
    home_tab_enabled: false
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: DeepSeek Harness
    always_online: false
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - chat:write
      - im:history
settings:
  event_subscriptions:
    bot_events:
      - app_mention
      - message.im
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false
`;
var SLACK_CREATE_APP_URL = "https://api.slack.com/apps?new_app=1";

// plugin-src/client/channels/slack/styles.js
var SLACK_STYLE_ID = "xmanrui-dsh-im-slack-settings";
var CSS5 = String.raw`
.dsl-page { --ddt-accent: #4a154b; --ddt-accent-deep: #321033; --ddt-accent-wash: #f7eef7; }
.dsl-avatar { color: #fff; background: #4a154b; }
.dsl-avatar svg { display: block; }
.dsl-setup { display: grid; gap: 18px; }
.dsl-guide { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: start; gap: 18px; padding: 16px; border: 1px solid color-mix(in srgb, #4a154b 18%, var(--dsw-alias-border-l2, #e5e6eb)); border-radius: 11px; background: color-mix(in srgb, #4a154b 4%, var(--dsw-alias-bg-layer-1, #fff)); }
.dsl-guideCopy { min-width: 0; }
.dsl-guideCopy strong { display: block; margin-bottom: 5px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; }
.dsl-guideCopy p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
.dsl-guideActions { display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.dsl-guideActions .ddt-button { white-space: nowrap; }
.dsl-copyState { color: var(--dsw-alias-state-success-primary, #20a162); }
.dsl-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.dsl-tokenHint { grid-column: 1 / -1; margin: -4px 0 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.55; }
@container (max-width: 680px) {
  .dsl-guide { grid-template-columns: minmax(0, 1fr); }
  .dsl-guideActions { justify-content: flex-start; }
  .dsl-fields { grid-template-columns: minmax(0, 1fr); }
}
`;
function installSlackStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${SLACK_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-im";
  style.dataset.pluginCss = SLACK_STYLE_ID;
  style.textContent = CSS5;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/slack/index.js
function SlackCredentialPanel({ busy, error, onSubmit, onCancel }) {
  const [botToken, setBotToken] = React9.useState("");
  const [appToken, setAppToken] = React9.useState("");
  const [copied, setCopied] = React9.useState(false);
  const headingId = React9.useId();
  const copyManifest = async () => {
    try {
      await navigator.clipboard.writeText(SLACK_APP_MANIFEST_YAML);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2e3);
    } catch {
      setCopied(false);
    }
  };
  const submit = (event) => {
    event.preventDefault();
    const normalizedBotToken = botToken.trim();
    const normalizedAppToken = appToken.trim();
    if (!normalizedBotToken || !normalizedAppToken || busy) return;
    void onSubmit?.({ botToken: normalizedBotToken, appToken: normalizedAppToken });
  };
  return h2(
    "section",
    {
      className: "ddt-card dim-surfaceCard dim-credentialPanel dsl-setup",
      "aria-labelledby": headingId
    },
    h2("h3", { id: headingId, className: "dim-credentialTitle" }, "\u63A5\u5165 Slack \u673A\u5668\u4EBA"),
    h2(
      "div",
      { className: "dsl-guide" },
      h2(
        "div",
        { className: "dsl-guideCopy" },
        h2("strong", null, "\u5148\u7528 Manifest \u521B\u5EFA\u5E76\u914D\u7F6E Slack App"),
        h2("p", null, "\u590D\u5236\u914D\u7F6E\u540E\uFF0C\u5728 Slack \u9009\u62E9 From a manifest\uFF1B\u521B\u5EFA\u5B8C\u6210\u540E\u751F\u6210 connections:write App Token\uFF0C\u5E76\u5C06\u5E94\u7528\u5B89\u88C5\u5230\u5DE5\u4F5C\u533A\u3002")
      ),
      h2(
        "div",
        { className: "dsl-guideActions" },
        h2("button", {
          type: "button",
          className: "ddt-button",
          onClick: () => void copyManifest(),
          disabled: busy
        }, copied ? h2("span", { className: "dsl-copyState" }, "\u5DF2\u590D\u5236 Manifest") : "\u590D\u5236 Manifest"),
        h2("a", {
          className: "ddt-button",
          href: SLACK_CREATE_APP_URL,
          target: "_blank",
          rel: "noreferrer"
        }, "\u6253\u5F00 Slack \u521B\u5EFA\u9875")
      )
    ),
    h2(
      "form",
      { className: "dim-credentialForm dim-credentialFormSingle", onSubmit: submit },
      h2(
        "div",
        { className: "dsl-fields" },
        h2(
          "label",
          { className: "dim-credentialField" },
          h2("span", null, "Bot Token"),
          h2("input", {
            type: "password",
            value: botToken,
            onChange: (event) => setBotToken(event.target.value),
            placeholder: "xoxb-\u2026",
            maxLength: 4096,
            autoCapitalize: "none",
            autoCorrect: "off",
            spellCheck: false,
            autoComplete: "new-password",
            disabled: busy,
            required: true
          })
        ),
        h2(
          "label",
          { className: "dim-credentialField" },
          h2("span", null, "App Token"),
          h2("input", {
            type: "password",
            value: appToken,
            onChange: (event) => setAppToken(event.target.value),
            placeholder: "xapp-\u2026",
            maxLength: 4096,
            autoCapitalize: "none",
            autoCorrect: "off",
            spellCheck: false,
            autoComplete: "new-password",
            disabled: busy,
            required: true
          })
        ),
        h2("p", { className: "dsl-tokenHint" }, "Bot Token \u6765\u81EA OAuth & Permissions\uFF1BApp Token \u6765\u81EA Basic Information\uFF0C\u5E76\u4E14\u5FC5\u987B\u5305\u542B connections:write\u3002")
      ),
      error ? h2("p", { className: "dim-credentialError", role: "alert" }, error.message ?? String(error)) : null,
      h2(
        "div",
        { className: "ddt-actions dim-viewActions dim-credentialActions" },
        h2("button", {
          type: "submit",
          className: "ddt-button",
          "data-kind": "primary",
          disabled: busy || !botToken.trim() || !appToken.trim()
        }, busy ? "\u6B63\u5728\u9A8C\u8BC1\u5E76\u8FDE\u63A5\u2026" : "\u9A8C\u8BC1\u5E76\u8FDE\u63A5"),
        h2("button", {
          type: "button",
          className: "ddt-button",
          onClick: onCancel,
          disabled: busy
        }, "\u53D6\u6D88")
      )
    )
  );
}
var channel2 = createTokenChannelSettings({
  channel: "Slack",
  endpoints: SLACK_ENDPOINTS,
  api: api2,
  LogoGlyph: SlackLogoGlyph,
  installStyles: installSlackStyles,
  pageClass: "dsl-page",
  avatarClass: "dsl-avatar",
  connectionLabel: "Socket Mode \u957F\u8FDE\u63A5",
  emptyTitle: "\u63A5\u5165 Slack \u673A\u5668\u4EBA",
  emptyDescription: "\u4F7F\u7528\u5B98\u65B9 App Manifest \u5FEB\u901F\u914D\u7F6E\u673A\u5668\u4EBA\uFF0C\u518D\u586B\u5199 Bot Token \u4E0E App Token \u5EFA\u7ACB\u672C\u5730 Socket Mode \u8FDE\u63A5\u3002",
  platformLabel: "Slack \u5DE5\u4F5C\u533A",
  CredentialPanel: SlackCredentialPanel,
  credentialPayload: ({ botToken, appToken }) => ({ botToken, appToken }),
  credentialAriaLabel: "\u4F7F\u7528 Manifest \u548C\u53CC Token \u63A5\u5165 Slack \u673A\u5668\u4EBA",
  credentialOpenLabel: "\u63A5\u5165\u673A\u5668\u4EBA",
  credentialCloseLabel: "\u6536\u8D77\u63A5\u5165",
  credentialNoun: "Bot Token \u4E0E App Token",
  emptyActionLabel: "\u5F00\u59CB\u63A5\u5165"
});
var SlackSettingsTab = channel2.SettingsTab;
var SlackAccountCard = channel2.AccountCard;

// plugin-src/client/channels/telegram/api.js
var TELEGRAM_RPC_CHANNEL = "/telegram";
var TELEGRAM_ENDPOINTS = TOKEN_BOT_ENDPOINTS;
var api3 = createTokenChannelApi("Telegram", " Bot API \u957F\u8F6E\u8BE2");
var unwrapRpcResult6 = api3.unwrapRpcResult;
var normalizeSnapshot5 = api3.normalizeSnapshot;
var presentError6 = api3.presentError;

// plugin-src/client/channels/telegram/styles.js
var TELEGRAM_STYLE_ID = "xmanrui-dsh-im-telegram-settings";
var CSS6 = String.raw`
.dtg-page { --ddt-accent: #229ed9; --ddt-accent-deep: #1687bd; --ddt-accent-wash: #eaf7fd; }
.dtg-avatar { color: #fff; background: #229ed9; }
.dtg-avatar svg { display: block; }
`;
function installTelegramStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${TELEGRAM_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-im";
  style.dataset.pluginCss = TELEGRAM_STYLE_ID;
  style.textContent = CSS6;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/telegram/index.js
var channel3 = createTokenChannelSettings({
  channel: "Telegram",
  endpoints: TELEGRAM_ENDPOINTS,
  api: api3,
  LogoGlyph: TelegramLogoGlyph,
  installStyles: installTelegramStyles,
  pageClass: "dtg-page",
  avatarClass: "dtg-avatar",
  connectionLabel: "Bot API \u957F\u8F6E\u8BE2",
  tokenPlaceholder: "\u586B\u5199 @BotFather \u751F\u6210\u7684 Bot Token",
  emptyTitle: "\u63A5\u5165 Telegram \u673A\u5668\u4EBA",
  emptyDescription: "\u5148\u901A\u8FC7 @BotFather \u83B7\u53D6 Bot Token\uFF0C\u518D\u5728\u8FD9\u91CC\u5B8C\u6210\u63A5\u5165\u3002",
  platformLabel: "Telegram"
});
var TelegramSettingsTab = channel3.SettingsTab;
var TelegramAccountCard = channel3.AccountCard;

// plugin-src/client/channels/wecom/api.js
var WECOM_RPC_CHANNEL = "/wecom";
var WECOM_ENDPOINTS = Object.freeze({
  status: "connection.status",
  beginProvisioning: "provision.begin",
  pollProvisioning: "provision.poll",
  cancelProvisioning: "provision.cancel",
  bindCredentials: "bot.bind-credentials",
  reconnectBot: "bot.reconnect",
  deleteBot: "bot.delete"
});
var PROVISION_STATES3 = /* @__PURE__ */ new Set(["starting", "pending", "refreshing", "connecting", "connected", "failed", "cancelled"]);
var ACCOUNT_STATES4 = /* @__PURE__ */ new Set(["connected", "connecting", "offline", "error"]);
var QR_DATA_URL3 = /^data:image\/(?:png|webp);base64,[a-z\d+/]+={0,2}$/i;
function isRecord5(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function text3(value, fallback, max = 240) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}
function id3(value) {
  const result = text3(value, "", 128);
  return /^[a-z\d_-]+$/i.test(result) ? result : void 0;
}
function timestamp4(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = typeof value === "string" ? Date.parse(value) : Number.NaN;
  return Number.isNaN(parsed) ? void 0 : parsed;
}
function unwrapRpcResult7(result) {
  if (!isRecord5(result) || typeof result.ok !== "boolean") throw new Error("\u4F01\u4E1A\u5FAE\u4FE1\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94");
  if (!result.ok) {
    const error = new Error(text3(result.error?.message, "\u4F01\u4E1A\u5FAE\u4FE1\u64CD\u4F5C\u5931\u8D25"));
    error.code = text3(result.error?.code, "WECOM_RPC_ERROR", 80);
    throw error;
  }
  return result.value;
}
function safeQrSource4(value) {
  return typeof value === "string" && value.length <= 2 * 1024 * 1024 && QR_DATA_URL3.test(value) ? value : void 0;
}
function normalizeProvisioning4(value, now = Date.now()) {
  const source = isRecord5(value?.provisioning) ? value.provisioning : value;
  if (!isRecord5(source)) throw new Error("\u4F01\u4E1A\u5FAE\u4FE1\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u7ED1\u5B9A\u8FDB\u5EA6");
  const attemptId = id3(source.attemptId);
  if (!attemptId) throw new Error("\u4F01\u4E1A\u5FAE\u4FE1\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1");
  const reported = text3(source.status, "failed", 32);
  const result = {
    attemptId,
    status: PROVISION_STATES3.has(reported) ? reported : "failed",
    expiresAt: timestamp4(source.expiresAt) ?? now + 5 * 6e4,
    pollIntervalMs: Math.min(1e4, Math.max(500, Number(source.pollIntervalMs) || 1e3)),
    qrRevision: Number.isSafeInteger(source.qrRevision) ? source.qrRevision : 0
  };
  const qrCodeDataUrl = safeQrSource4(source.qrCodeDataUrl);
  if (qrCodeDataUrl) result.qrCodeDataUrl = qrCodeDataUrl;
  if (id3(source.botId)) result.botId = id3(source.botId);
  if (isRecord5(source.error)) result.error = {
    code: text3(source.error.code, "WECOM_PROVISION_FAILED", 80),
    message: text3(source.error.message, "\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA\u6CA1\u6709\u63A5\u5165\u5B8C\u6210")
  };
  return result;
}
function normalizeBot4(value) {
  if (!isRecord5(value) || !id3(value.botId)) return void 0;
  const connected = value.connected === true;
  const state = ACCOUNT_STATES4.has(value.state) ? value.state : "offline";
  return {
    botId: id3(value.botId),
    connected,
    state: connected ? "connected" : state,
    bot: {
      name: text3(value.bot?.name, "\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA", 100),
      appIdMasked: text3(value.bot?.appIdMasked, "\u5E94\u7528\u6807\u8BC6\u5DF2\u5B89\u5168\u4FDD\u5B58", 140)
    },
    health: {
      summary: text3(value.health?.summary, connected ? "\u4F01\u4E1A\u5FAE\u4FE1 WebSocket \u957F\u8FDE\u63A5\u8FD0\u884C\u6B63\u5E38" : "\u4F01\u4E1A\u5FAE\u4FE1\u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA"),
      lastCheckedAt: timestamp4(value.health?.lastCheckedAt)
    },
    error: isRecord5(value.error) ? {
      code: text3(value.error.code, "WECOM_ACCOUNT_ERROR", 80),
      message: text3(value.error.message, "\u4F01\u4E1A\u5FAE\u4FE1\u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA")
    } : null
  };
}
function normalizeSnapshot6(value) {
  const source = isRecord5(value?.snapshot) ? value.snapshot : value;
  if (!isRecord5(source) || !Array.isArray(source.bots)) throw new Error("\u4F01\u4E1A\u5FAE\u4FE1\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868");
  const bots = source.bots.map(normalizeBot4).filter(Boolean);
  return {
    revision: Number.isSafeInteger(source.revision) ? source.revision : 0,
    bots,
    totals: { configured: bots.length, connected: bots.filter((bot) => bot.connected).length },
    provisioning: source.provisioning ? normalizeProvisioning4(source.provisioning) : null
  };
}
function presentError7(error) {
  return {
    code: text3(error?.code, "WECOM_ERROR", 80),
    message: text3(error?.message, "\u4F01\u4E1A\u5FAE\u4FE1\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5")
  };
}
function formatRemaining4(milliseconds) {
  const seconds = Math.max(0, Math.ceil(Number(milliseconds) / 1e3) || 0);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

// plugin-src/client/channels/wecom/index.js
var React10 = __toESM(require("react"), 1);

// plugin-src/client/channels/wecom/styles.js
var WECOM_STYLE_ID = "xmanrui-dsh-im-wecom-settings";
var CSS7 = String.raw`
.dwecom-page { --ddt-accent: #3370ff; --ddt-accent-deep: #245bdb; --ddt-accent-wash: #eef4ff; }
.dwecom-avatar, .dwecom-brand { color: #3370ff; background: #fff; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); }
.dwecom-avatar svg, .dwecom-brand svg { display: block; }
`;
function installWecomStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${WECOM_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-im";
  style.dataset.pluginCss = WECOM_STYLE_ID;
  style.textContent = CSS7;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/wecom/index.js
var ACTIVE_STATES2 = /* @__PURE__ */ new Set(["pending", "refreshing", "connecting"]);
var Button9 = React10.forwardRef(function Button10({ children, kind = "secondary", className = "", ...props }, ref) {
  return h2("button", {
    ...props,
    ref,
    type: "button",
    className: `ddt-button ${className}`.trim(),
    "data-kind": kind
  }, children);
});
function checkedTime4(value) {
  if (!value) return "\u5C1A\u672A\u68C0\u67E5";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(value));
  } catch {
    return "\u521A\u521A";
  }
}
function Heading4({ totals, adding, busy, onAdd, onCredential, credentialOpen, addButtonRef }) {
  return h2(
    "div",
    { className: "ddt-heading" },
    h2(
      "div",
      { className: "ddt-tools" },
      h2(
        "div",
        { className: "dim-bindActions" },
        h2(Button9, {
          kind: "primary",
          className: "dim-scanButton",
          onClick: onAdd,
          disabled: adding || busy,
          ref: addButtonRef,
          "aria-label": "\u626B\u7801\u63A5\u5165\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA"
        }, h2(QrActionIcon), adding ? "\u6B63\u5728\u63A5\u5165" : "\u626B\u7801\u63A5\u5165\u673A\u5668\u4EBA"),
        h2(Button9, {
          kind: "credential",
          className: "dim-credentialButton",
          onClick: onCredential,
          disabled: adding || busy,
          "aria-pressed": credentialOpen,
          "aria-label": "\u4F7F\u7528 Bot ID \u548C Secret \u7ED1\u5B9A\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA"
        }, h2(CredentialActionIcon), credentialOpen ? "\u6536\u8D77\u51ED\u636E" : "\u624B\u52A8\u63A5\u5165")
      ),
      totals.configured > 0 ? h2(
        "div",
        { className: "ddt-badge dim-onlineBadge" },
        h2("span", null, `${totals.connected} / ${totals.configured} \u5728\u7EBF`)
      ) : null
    )
  );
}
function LoadingView4() {
  return h2(
    "div",
    { className: "ddt-card ddt-loading dim-surfaceCard dim-loadingView", "aria-busy": "true" },
    h2("div", { className: "ddt-spinner dim-spinner" }),
    h2("span", null, "\u6B63\u5728\u8BFB\u53D6\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA\u72B6\u6001\u2026")
  );
}
function EmptyView4({ busy, onStart }) {
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-empty dim-surfaceBody dim-emptyView" },
      h2(
        "div",
        { className: "dim-emptyCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot" }),
          h2("span", null, "\u5C1A\u672A\u7ED1\u5B9A\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA")
        ),
        h2("h3", null, "\u4F7F\u7528\u4F01\u4E1A\u5FAE\u4FE1 App \u626B\u7801\u521B\u5EFA\u667A\u80FD\u673A\u5668\u4EBA"),
        h2("p", null, "\u626B\u7801\u7531\u817E\u8BAF\u5B98\u65B9\u9875\u9762\u5B8C\u6210\uFF0C\u4E0D\u9700\u8981\u624B\u52A8\u586B\u5199 Bot ID \u6216 Secret\u3002\u521B\u5EFA\u6210\u529F\u540E\uFF0C\u673A\u5668\u4EBA\u4F1A\u81EA\u52A8\u8FDE\u63A5 DeepSeek Harness\u3002"),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(
            Button9,
            { kind: "primary", onClick: onStart, disabled: busy },
            busy ? "\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026" : "\u751F\u6210\u4F01\u4E1A\u5FAE\u4FE1\u4E8C\u7EF4\u7801"
          )
        )
      ),
      h2(
        "div",
        { className: "ddt-brandMark dim-emptyBrand dwecom-brand", "aria-hidden": "true" },
        h2(WecomLogoGlyph, { size: 64 })
      )
    )
  );
}
function QrPanel3({ provision, now, busy, onRefresh, onCancel }) {
  const source = safeQrSource4(provision.qrCodeDataUrl);
  const remaining = Math.max(0, provision.expiresAt - now);
  const duration = Math.max(1, provision.durationMs ?? 5 * 6e4);
  const progress = Math.round(Math.min(1, remaining / duration) * 100);
  const refreshing = provision.status === "refreshing";
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-qrLayout dim-surfaceBody dim-qrLayout" },
      h2(
        "div",
        { className: "ddt-qrColumn dim-qrColumn" },
        h2(
          "div",
          { className: "ddt-qrFrame dim-qrFrame" },
          source ? h2("img", { src: source, alt: "\u7528\u4E8E\u7ED1\u5B9A\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA\u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801" }) : h2(
            "div",
            { className: "ddt-qrFallback dim-qrFallback" },
            refreshing ? "\u4E8C\u7EF4\u7801\u6B63\u5728\u81EA\u52A8\u5237\u65B0\u2026" : "\u4E8C\u7EF4\u7801\u56FE\u7247\u6B63\u5728\u751F\u6210\u2026"
          )
        ),
        h2(
          "div",
          { className: "ddt-countdown dim-countdown" },
          h2(
            "div",
            { className: "ddt-countdownTop dim-countdownTop" },
            h2("span", null, "\u5F53\u524D\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4"),
            h2("strong", null, refreshing ? "--:--" : formatRemaining4(remaining))
          ),
          h2("div", { className: "ddt-progress dim-progress", style: { "--ddt-progress": `${progress}%` } }, h2("span"))
        )
      ),
      h2(
        "div",
        { className: "ddt-qrCopy dim-qrCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot", "data-tone": "warning" }),
          h2("span", null, refreshing ? "\u6B63\u5728\u5237\u65B0\u4E8C\u7EF4\u7801" : "\u7B49\u5F85\u4F01\u4E1A\u5FAE\u4FE1 App \u626B\u7801")
        ),
        h2("h3", null, "\u4F7F\u7528\u4F01\u4E1A\u5FAE\u4FE1 App \u5B8C\u6210\u667A\u80FD\u673A\u5668\u4EBA\u6388\u6743"),
        h2("p", null, "\u4F01\u4E1A\u5FAE\u4FE1\u5B98\u65B9\u9875\u9762\u4F1A\u521B\u5EFA\u4E00\u4E2A\u667A\u80FD\u673A\u5668\u4EBA\uFF0C\u5E76\u628A\u8FDE\u63A5\u51ED\u636E\u5B89\u5168\u4EA4\u7ED9\u672C\u673A Harness Host\u3002"),
        h2(
          "ol",
          { className: "ddt-steps dim-steps" },
          h2("li", null, "\u6253\u5F00\u4F01\u4E1A\u5FAE\u4FE1 App\uFF0C\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801"),
          h2("li", null, "\u5728\u817E\u8BAF\u6388\u6743\u9875\u9762\u786E\u8BA4\u521B\u5EFA\u667A\u80FD\u673A\u5668\u4EBA"),
          h2("li", null, "\u8FD4\u56DE\u8FD9\u91CC\u7B49\u5F85\u8FDE\u63A5\u5B8C\u6210")
        ),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(Button9, { onClick: onRefresh, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
          h2(Button9, { kind: "quiet", onClick: onCancel, disabled: busy }, "\u53D6\u6D88")
        )
      )
    )
  );
}
function ProvisionView2({ provision, busy, onRetry, onClose }) {
  if (provision.status === "connecting") {
    return h2(
      "div",
      { className: "ddt-card ddt-loading dim-surfaceCard dim-specialView", "aria-busy": "true" },
      h2("div", { className: "ddt-spinner dim-spinner" }),
      h2("h3", null, "\u4F01\u4E1A\u5FAE\u4FE1\u5DF2\u6388\u6743\uFF0C\u6B63\u5728\u8FDE\u63A5\u673A\u5668\u4EBA"),
      h2("p", null, "\u51ED\u636E\u6B63\u5728\u5199\u5165\u672C\u673A\uFF0C\u5E76\u542F\u52A8\u4F01\u4E1A\u5FAE\u4FE1 WebSocket \u6D88\u606F\u8FDE\u63A5\u3002")
    );
  }
  const error = provision.error ?? { code: "WECOM_PROVISION_FAILED", message: "\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA\u6CA1\u6709\u7ED1\u5B9A\u5B8C\u6210" };
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-inlineError dim-inlineError", role: "alert" },
      h2("h3", null, "\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA\u6CA1\u6709\u7ED1\u5B9A\u5B8C\u6210"),
      h2("p", null, error.message),
      h2("span", { className: "ddt-errorCode" }, error.code),
      h2(
        "div",
        { className: "ddt-actions dim-viewActions" },
        h2(Button9, { kind: "primary", onClick: onRetry, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
        h2(Button9, { onClick: onClose, disabled: busy }, "\u5173\u95ED")
      )
    )
  );
}
function RemoveConfirmation4({ account, busy, onConfirm, onCancel }) {
  return h2(
    "div",
    { className: "ddt-confirm dim-confirm", role: "alertdialog" },
    h2("strong", null, `\u4ECE DeepSeek Harness \u79FB\u9664\u201C${account.bot.name}\u201D\uFF1F`),
    h2("p", null, "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684\u5E94\u7528\u51ED\u636E\u3001\u673A\u5668\u4EBA\u914D\u7F6E\u53CA\u4F1A\u8BDD\u6620\u5C04\u3002\u4F01\u4E1A\u5FAE\u4FE1\u5E73\u53F0\u4E2D\u7684\u673A\u5668\u4EBA\u4E0D\u4F1A\u88AB\u81EA\u52A8\u5220\u9664\u3002"),
    h2(
      "div",
      { className: "ddt-actions dim-viewActions" },
      h2(Button9, { onClick: onCancel, disabled: busy }, "\u4FDD\u7559\u673A\u5668\u4EBA"),
      h2(Button9, { kind: "danger", onClick: onConfirm, disabled: busy }, busy ? "\u6B63\u5728\u79FB\u9664\u2026" : "\u786E\u8BA4\u79FB\u9664\u63A5\u5165")
    )
  );
}
function AccountCard3({ account, busy, removing, onReconnect, onRequestRemove, onConfirmRemove, onCancelRemove }) {
  const tone = account.connected ? "success" : account.state === "error" ? "error" : "warning";
  const stateLabel = account.connected ? "\u8FD0\u884C\u6B63\u5E38" : account.state === "connecting" ? "\u6B63\u5728\u8FDE\u63A5" : "\u8FDE\u63A5\u672A\u5C31\u7EEA";
  const summary = account.error?.message ?? (account.connected ? null : account.health.summary);
  return h2(
    "article",
    { className: "ddt-card dim-botCard", "data-bot-id": account.botId },
    h2(
      "div",
      { className: "ddt-cardBody dim-botCardBody" },
      h2(
        "div",
        { className: "ddt-accountTop dim-botCardTop" },
        h2(
          "div",
          { className: "ddt-accountIdentity dim-botIdentity" },
          h2("div", { className: "ddt-avatar dim-botAvatar dwecom-avatar", "aria-hidden": "true" }, h2(WecomLogoGlyph, { size: 29 })),
          h2(
            "div",
            { className: "dim-botName" },
            h2("h3", null, account.bot.name),
            h2("p", null, account.bot.appIdMasked)
          )
        ),
        h2(
          "div",
          { className: "ddt-health dim-botHealth" },
          h2("span", { className: "ddt-dot dim-healthDot", "data-tone": tone }),
          h2("span", null, stateLabel)
        )
      ),
      h2(
        "dl",
        { className: "ddt-metrics dim-botMetrics" },
        h2("div", { className: "ddt-metric dim-botMetric" }, h2("dt", null, "\u6D88\u606F\u901A\u9053"), h2("dd", null, account.connected ? "WebSocket \u957F\u8FDE\u63A5" : "\u79BB\u7EBF")),
        h2("div", { className: "ddt-metric dim-botMetric" }, h2("dt", null, "\u6700\u8FD1\u68C0\u67E5"), h2("dd", null, checkedTime4(account.health.lastCheckedAt)))
      ),
      h2(
        "div",
        { className: "ddt-accountFooter dim-cardFooter" },
        summary ? h2("div", { className: "ddt-summary dim-cardSummary" }, summary) : null,
        h2(
          "div",
          { className: "ddt-actions dim-cardActions" },
          h2(Button9, { className: "dim-cardAction", onClick: onReconnect, disabled: Boolean(busy) }, busy === "reconnect" ? "\u68C0\u67E5\u4E2D\u2026" : account.connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"),
          h2(Button9, { className: "dim-cardAction", kind: "danger", onClick: onRequestRemove, disabled: Boolean(busy) }, "\u79FB\u9664\u63A5\u5165")
        )
      )
    ),
    removing ? h2(RemoveConfirmation4, {
      account,
      busy: busy === "delete",
      onConfirm: onConfirmRemove,
      onCancel: onCancelRemove
    }) : null
  );
}
function WecomSettingsTab({ rpcCall }) {
  const [model, setModel] = React10.useState({ phase: "loading", bots: [], totals: { configured: 0, connected: 0 }, error: null });
  const [provision, setProvision] = React10.useState(null);
  const [busy, setBusy] = React10.useState(false);
  const [busyByBot, setBusyByBot] = React10.useState({});
  const [removeTarget, setRemoveTarget] = React10.useState(null);
  const [credentialOpen, setCredentialOpen] = React10.useState(false);
  const [credentialError, setCredentialError] = React10.useState(null);
  const [now, setNow] = React10.useState(Date.now());
  const mounted = React10.useRef(true);
  const addButtonRef = React10.useRef(null);
  React10.useEffect(() => {
    const disposeDingtalk = installDingtalkStyles();
    const disposeWecom = installWecomStyles();
    mounted.current = true;
    return () => {
      mounted.current = false;
      disposeWecom();
      disposeDingtalk();
    };
  }, []);
  const invoke = React10.useCallback(async (endpoint, payload = {}, signal) => {
    if (typeof rpcCall !== "function") throw new TypeError("\u4F01\u4E1A\u5FAE\u4FE1\u8BBE\u7F6E\u9875\u7F3A\u5C11 RPC \u8FDE\u63A5");
    return unwrapRpcResult7(await rpcCall(endpoint, payload, signal));
  }, [rpcCall]);
  const loadStatus = React10.useCallback(async ({ signal, silent = false, restore = false } = {}) => {
    if (!silent && mounted.current) setModel((current) => ({ ...current, phase: "loading", error: null }));
    try {
      const snapshot = normalizeSnapshot6(await invoke(WECOM_ENDPOINTS.status, {}, signal));
      if (!mounted.current || signal?.aborted) return void 0;
      setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      if (restore && snapshot.provisioning) setProvision({
        ...snapshot.provisioning,
        durationMs: Math.max(1, snapshot.provisioning.expiresAt - Date.now())
      });
      return snapshot;
    } catch (error) {
      if (error?.name !== "AbortError" && mounted.current && !signal?.aborted) {
        setModel((current) => ({ ...current, phase: silent ? current.phase : "error", error: presentError7(error) }));
      }
      return void 0;
    }
  }, [invoke]);
  React10.useEffect(() => {
    const controller = new AbortController();
    void loadStatus({ signal: controller.signal, restore: true });
    return () => controller.abort();
  }, [loadStatus]);
  React10.useEffect(() => {
    if (model.phase !== "ready") return void 0;
    const controller = new AbortController();
    const timer = window.setInterval(() => void loadStatus({ signal: controller.signal, silent: true }), 15e3);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadStatus, model.phase]);
  React10.useEffect(() => {
    if (!provision || !ACTIVE_STATES2.has(provision.status)) return void 0;
    const timer = window.setInterval(() => mounted.current && setNow(Date.now()), 1e3);
    return () => window.clearInterval(timer);
  }, [provision?.attemptId, provision?.status]);
  const startProvisioning = React10.useCallback(async (replace = false) => {
    setCredentialOpen(false);
    setCredentialError(null);
    setBusy(true);
    try {
      if (replace && provision?.attemptId) await invoke(WECOM_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      if (!mounted.current) return;
      setProvision({ status: "starting" });
      const started = normalizeProvisioning4(await invoke(WECOM_ENDPOINTS.beginProvisioning, { locale: "zh-CN" }));
      if (!mounted.current) return;
      setNow(Date.now());
      setProvision({ ...started, durationMs: Math.max(1, started.expiresAt - Date.now()) });
    } catch (error) {
      if (mounted.current) setProvision({ status: "failed", error: presentError7(error) });
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke, provision?.attemptId]);
  const bindCredentials = React10.useCallback(async ({ identity, secret }) => {
    setBusy(true);
    setCredentialError(null);
    try {
      const snapshot = normalizeSnapshot6(await invoke(
        WECOM_ENDPOINTS.bindCredentials,
        { botId: identity, secret }
      ));
      if (!mounted.current) return;
      setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      setCredentialOpen(false);
    } catch (error) {
      if (mounted.current) setCredentialError(presentError7(error));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke]);
  const closeProvision = React10.useCallback(async () => {
    setBusy(true);
    try {
      if (provision?.attemptId && ACTIVE_STATES2.has(provision.status)) {
        await invoke(WECOM_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      }
      if (mounted.current) setProvision(null);
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke, provision?.attemptId, provision?.status]);
  React10.useEffect(() => {
    const attemptId = provision?.attemptId;
    if (!attemptId || !ACTIVE_STATES2.has(provision.status)) return void 0;
    const controller = new AbortController();
    let disposed = false;
    let timer;
    const poll = async () => {
      try {
        const current = normalizeProvisioning4(await invoke(WECOM_ENDPOINTS.pollProvisioning, { attemptId }, controller.signal));
        if (disposed || controller.signal.aborted || !mounted.current) return;
        if (current.status === "connected") {
          setProvision(null);
          await loadStatus({ signal: controller.signal, silent: true });
          return;
        }
        setProvision((previous) => previous?.attemptId === attemptId ? { ...previous, ...current, durationMs: current.qrRevision !== previous.qrRevision ? Math.max(1, current.expiresAt - Date.now()) : previous.durationMs } : previous);
        if (ACTIVE_STATES2.has(current.status)) timer = window.setTimeout(poll, current.pollIntervalMs);
      } catch (error) {
        if (!disposed && !controller.signal.aborted && mounted.current) {
          setProvision((current) => ({ ...current, status: "failed", error: presentError7(error) }));
        }
      }
    };
    timer = window.setTimeout(poll, provision.pollIntervalMs ?? 1e3);
    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [invoke, loadStatus, provision?.attemptId, provision?.pollIntervalMs, provision?.status]);
  const botAction = React10.useCallback(async (account, operation, endpoint, payload) => {
    setBusyByBot((current) => ({ ...current, [account.botId]: operation }));
    try {
      const snapshot = normalizeSnapshot6(await invoke(endpoint, payload));
      if (mounted.current) setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      return snapshot;
    } finally {
      if (mounted.current) setBusyByBot((current) => {
        const next = { ...current };
        delete next[account.botId];
        return next;
      });
    }
  }, [invoke]);
  let provisionView = null;
  if (provision?.status === "starting") provisionView = h2("div", { className: "ddt-card ddt-loading dim-surfaceCard" }, h2("div", { className: "ddt-spinner" }), "\u6B63\u5728\u7533\u8BF7\u4F01\u4E1A\u5FAE\u4FE1\u4E8C\u7EF4\u7801\u2026");
  else if (["pending", "refreshing"].includes(provision?.status)) provisionView = h2(QrPanel3, {
    provision,
    now,
    busy,
    onRefresh: () => void startProvisioning(true),
    onCancel: () => void closeProvision()
  });
  else if (provision) provisionView = h2(ProvisionView2, {
    provision,
    busy,
    onRetry: () => void startProvisioning(true),
    onClose: () => void closeProvision()
  });
  const botList = model.bots.length > 0 ? h2(
    "section",
    { className: "dim-listSection" },
    h2(
      "div",
      { className: "ddt-listHeading dim-listHeading" },
      h2("h3", null, "\u5DF2\u7ED1\u5B9A\u7684\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA")
    ),
    h2("ul", { className: "ddt-list dim-botList" }, model.bots.map((account) => h2("li", { key: account.botId }, h2(AccountCard3, {
      account,
      busy: busyByBot[account.botId],
      removing: removeTarget === account.botId,
      onReconnect: () => void botAction(account, "reconnect", WECOM_ENDPOINTS.reconnectBot, { botId: account.botId }),
      onRequestRemove: () => setRemoveTarget(account.botId),
      onCancelRemove: () => setRemoveTarget(null),
      onConfirmRemove: async () => {
        await botAction(account, "delete", WECOM_ENDPOINTS.deleteBot, { botId: account.botId, confirm: true });
        if (mounted.current) setRemoveTarget(null);
      }
    }))))
  ) : null;
  const credentialView = credentialOpen ? h2(CredentialBindingPanel, {
    channel: "\u4F01\u4E1A\u5FAE\u4FE1",
    identityLabel: "Bot ID",
    identityPlaceholder: "\u586B\u5199\u4F01\u4E1A\u5FAE\u4FE1\u667A\u80FD\u673A\u5668\u4EBA Bot ID",
    secretLabel: "Secret",
    secretPlaceholder: "\u586B\u5199\u4F01\u4E1A\u5FAE\u4FE1\u667A\u80FD\u673A\u5668\u4EBA Secret",
    busy,
    error: credentialError,
    onSubmit: bindCredentials,
    onCancel: () => {
      setCredentialOpen(false);
      setCredentialError(null);
    }
  }) : null;
  return h2(
    "section",
    { className: "ddt-page dwecom-page dim-channelPage", "aria-label": "\u4F01\u4E1A\u5FAE\u4FE1\u8BBE\u7F6E" },
    h2(Heading4, {
      totals: model.totals,
      adding: Boolean(provision),
      busy,
      onAdd: () => void startProvisioning(),
      onCredential: () => {
        setCredentialOpen((value) => !value);
        setCredentialError(null);
      },
      credentialOpen,
      addButtonRef
    }),
    model.phase === "loading" ? h2(LoadingView4) : model.phase === "error" ? h2("div", { className: "ddt-card dim-surfaceCard" }, h2("div", { className: "ddt-inlineError dim-inlineError" }, h2("h3", null, "\u65E0\u6CD5\u8BFB\u53D6\u4F01\u4E1A\u5FAE\u4FE1\u673A\u5668\u4EBA\u72B6\u6001"), h2("p", null, model.error?.message), h2(Button9, { onClick: () => void loadStatus() }, "\u91CD\u65B0\u8BFB\u53D6"))) : h2(
      React10.Fragment,
      null,
      credentialView,
      provisionView,
      model.bots.length === 0 && !provision && !credentialOpen ? h2(EmptyView4, { busy, onStart: () => void startProvisioning() }) : null,
      botList
    )
  );
}

// plugin-src/client/channels/weixin/index.js
var React11 = __toESM(require("react"), 1);

// plugin-src/client/channels/weixin/api.js
var WEIXIN_RPC_CHANNEL = "/weixin";
var WEIXIN_ENDPOINTS = Object.freeze({
  status: "connection.status",
  beginProvisioning: "provision.begin",
  pollProvisioning: "provision.poll",
  submitVerification: "provision.verify",
  cancelProvisioning: "provision.cancel",
  reconnectBot: "bot.reconnect",
  deleteBot: "bot.delete"
});
var ACCOUNT_STATES5 = /* @__PURE__ */ new Set(["connected", "connecting", "offline", "error"]);
var PROVISION_STATES4 = /* @__PURE__ */ new Set([
  "starting",
  "pending",
  "scanned",
  "needs_verification",
  "connecting",
  "connected",
  "expired",
  "failed",
  "cancelled"
]);
function isRecord6(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function string(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function timestamp5(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function unwrapRpcResult8(result) {
  if (!isRecord6(result) || typeof result.ok !== "boolean") {
    throw new Error("\u5FAE\u4FE1\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94");
  }
  if (!result.ok) {
    const error = new Error(string(result.error?.message, "\u5FAE\u4FE1\u64CD\u4F5C\u5931\u8D25"));
    error.code = string(result.error?.code, "WEIXIN_RPC_ERROR");
    throw error;
  }
  return result.value;
}
function safeQrSource5(value) {
  return typeof value === "string" && /^data:image\/(?:png|webp|svg\+xml)(?:;charset=[^;,]+)?;base64,/i.test(value) ? value : void 0;
}
function safeVerificationUrl(value) {
  if (typeof value !== "string") return void 0;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "weixin.qq.com" || host.endsWith(".weixin.qq.com")) ? url.toString() : void 0;
  } catch {
    return void 0;
  }
}
function normalizeProvisioning5(value) {
  if (!isRecord6(value) || !string(value.attemptId)) {
    throw new Error("\u5FAE\u4FE1\u626B\u7801\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u7ED1\u5B9A\u4EFB\u52A1");
  }
  const status = PROVISION_STATES4.has(value.status) ? value.status : "failed";
  const result = {
    attemptId: string(value.attemptId),
    status,
    expiresAt: timestamp5(value.expiresAt) ?? Date.now(),
    pollIntervalMs: Math.min(5e3, Math.max(500, Number(value.pollIntervalMs) || 1e3)),
    verificationRequired: value.verificationRequired === true || status === "needs_verification"
  };
  const verificationUrl = safeVerificationUrl(value.verificationUrl);
  const qrCodeDataUrl = safeQrSource5(value.qrCodeDataUrl);
  if (verificationUrl) result.verificationUrl = verificationUrl;
  if (qrCodeDataUrl) result.qrCodeDataUrl = qrCodeDataUrl;
  if (string(value.botId)) result.botId = string(value.botId);
  if (value.alreadyConnected === true) result.alreadyConnected = true;
  if (isRecord6(value.error)) {
    result.error = {
      code: string(value.error.code, "WEIXIN_PROVISION_FAILED"),
      message: string(value.error.message, "\u5FAE\u4FE1\u7ED1\u5B9A\u6CA1\u6709\u5B8C\u6210")
    };
  }
  return result;
}
function normalizeBot5(value) {
  if (!isRecord6(value) || !string(value.botId) || !isRecord6(value.bot)) return null;
  const state = ACCOUNT_STATES5.has(value.state) ? value.state : "error";
  const connected = value.connected === true;
  return {
    botId: string(value.botId),
    state: connected ? "connected" : state,
    connected,
    configured: value.configured === true,
    bot: {
      name: string(value.bot.name, "\u5FAE\u4FE1\u673A\u5668\u4EBA"),
      accountIdMasked: string(value.bot.accountIdMasked, "\u5DF2\u5B89\u5168\u4FDD\u5B58")
    },
    health: {
      status: string(value.health?.status, connected ? "healthy" : "offline"),
      summary: string(value.health?.summary, connected ? "\u5FAE\u4FE1\u8FDE\u63A5\u6B63\u5E38" : "\u5FAE\u4FE1\u8FDE\u63A5\u672A\u5C31\u7EEA"),
      lastCheckedAt: timestamp5(value.health?.lastCheckedAt)
    },
    stats: {
      messagesReceived: Math.max(0, Number(value.stats?.messagesReceived) || 0),
      messagesReplied: Math.max(0, Number(value.stats?.messagesReplied) || 0)
    },
    error: isRecord6(value.error) ? {
      code: string(value.error.code, "WEIXIN_ACCOUNT_ERROR"),
      message: string(value.error.message, "\u5FAE\u4FE1\u8FDE\u63A5\u672A\u5C31\u7EEA")
    } : null
  };
}
function normalizeSnapshot7(value) {
  if (!isRecord6(value) || !Array.isArray(value.bots)) {
    throw new Error("\u5FAE\u4FE1\u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u8D26\u53F7\u5217\u8868");
  }
  const bots = value.bots.map(normalizeBot5).filter(Boolean);
  return {
    schemaVersion: Number(value.schemaVersion) || 1,
    revision: Number(value.revision) || 0,
    state: string(value.state, "offline"),
    bots,
    totals: {
      configured: bots.length,
      connected: bots.filter((bot) => bot.connected).length
    },
    provisioning: value.provisioning ? normalizeProvisioning5(value.provisioning) : null
  };
}
function presentError8(error) {
  return {
    code: string(error?.code, "WEIXIN_ERROR"),
    message: string(error?.message, "\u5FAE\u4FE1\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5")
  };
}
function formatRemaining5(milliseconds) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1e3));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// plugin-src/client/channels/weixin/styles.js
var WEIXIN_STYLE_ID = "xmanrui-dsh-weixin-settings";
var CSS8 = String.raw`
.dxw-page {
  --dxw-accent: #07c160;
  --dxw-accent-dark: #05994c;
  --dxw-success: var(--dsw-alias-state-success-primary, #20a162);
  --dxw-warning: var(--dsw-alias-state-warn-primary, #d97706);
  --dxw-error: var(--dsw-alias-state-error-primary, #d54941);
  width: 100%;
  max-width: 880px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 2px 0 28px;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.dxw-page *, .dxw-page *::before, .dxw-page *::after { box-sizing: border-box; }
.dxw-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.dxw-heading h2, .dxw-heading p, .dxw-card h3, .dxw-card p { margin: 0; }
.dxw-eyebrow { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 3px; }
.dxw-heading h2 { font-size: 20px; line-height: 28px; font-weight: 680; }
.dxw-heading p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 20px; margin-top: 5px; white-space: nowrap; }
.dxw-tools, .dxw-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.dxw-tools { width: 100%; justify-content: space-between; flex-wrap: nowrap; }
.dxw-badge { display: inline-flex; align-items: center; gap: 7px; min-height: 30px; padding: 0 11px; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f2f3f5); font-size: 12px; white-space: nowrap; }
.dxw-dot { width: 8px; height: 8px; border-radius: 50%; background: #aeb3bb; flex: none; }
.dxw-dot[data-tone="success"] { background: var(--dxw-success); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dxw-success) 14%, transparent); }
.dxw-dot[data-tone="warning"] { background: var(--dxw-warning); }
.dxw-dot[data-tone="error"] { background: var(--dxw-error); }
.dxw-button { min-height: 34px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; padding: 0 13px; display: inline-flex; align-items: center; justify-content: center; gap: 7px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; font-weight: 560; cursor: pointer; text-decoration: none; transition: border-color .15s ease, background .15s ease, transform .15s ease; }
.dxw-button:hover:not(:disabled) { border-color: #aeb3bb; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.dxw-button:active:not(:disabled) { transform: translateY(1px); }
.dxw-button:focus-visible, .dxw-input:focus-visible { outline: 2px solid color-mix(in srgb, var(--dxw-accent) 70%, white); outline-offset: 2px; }
.dxw-button:disabled { cursor: not-allowed; opacity: .55; }
.dxw-button[data-kind="primary"] { color: white; border-color: var(--dxw-accent); background: var(--dxw-accent); }
.dxw-button[data-kind="primary"]:hover:not(:disabled) { border-color: var(--dxw-accent-dark); background: var(--dxw-accent-dark); }
.dxw-button[data-kind="danger"] { color: var(--dxw-error); }
.dxw-card { overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.dxw-cardBody { padding: 24px; }
.dxw-empty { min-height: 230px; display: grid; grid-template-columns: minmax(0, 1fr) 180px; align-items: center; gap: 30px; }
.dxw-empty h3 { font-size: 18px; margin-bottom: 8px; }
.dxw-empty p { max-width: 560px; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.dxw-empty .dxw-actions { margin-top: 20px; }
.dxw-logo { width: 110px; height: 110px; display: grid; place-items: center; justify-self: center; border-radius: 28px; color: white; background: var(--dxw-accent); box-shadow: 0 18px 45px rgb(7 193 96 / 22%); }
.dxw-logo svg { width: 62px; height: 62px; }
.dxw-qrLayout { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 34px; align-items: center; }
.dxw-qrColumn { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.dxw-qrFrame { position: relative; width: 270px; aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; padding: 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 16px; background: white; }
.dxw-qrFrame img { display: block; width: 100%; height: 100%; object-fit: contain; }
.dxw-qrFallback { padding: 24px; text-align: center; color: #646a73; }
.dxw-expired { position: absolute; inset: 0; display: grid; place-items: center; padding: 30px; color: white; text-align: center; font-weight: 650; background: rgb(31 35 41 / 76%); backdrop-filter: blur(3px); }
.dxw-countdown { width: 270px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.dxw-countdown div { display: flex; justify-content: space-between; margin-bottom: 6px; }
.dxw-progress { height: 4px; overflow: hidden; border-radius: 99px; background: #eef0f3; }
.dxw-progress span { display: block; width: var(--dxw-progress); height: 100%; background: var(--dxw-accent); transition: width .2s linear; }
.dxw-qrCopy h3 { margin: 9px 0 8px; font-size: 18px; }
.dxw-qrCopy > p { color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.dxw-steps { margin: 18px 0 22px; padding-left: 22px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 1.9; }
.dxw-stateLabel { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; font-weight: 600; }
.dxw-verify { max-width: 560px; margin: 0 auto; padding: 32px; text-align: center; }
.dxw-verify h3 { margin: 8px 0; font-size: 19px; }
.dxw-verify p { color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.6; }
.dxw-codeRow { display: flex; justify-content: center; gap: 10px; margin: 24px 0 10px; }
.dxw-input { width: 190px; height: 42px; padding: 0 14px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, white); color: inherit; font: inherit; font-size: 18px; letter-spacing: .16em; text-align: center; }
.dxw-statusNotice, .dxw-error { display: flex; align-items: center; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--dxw-error) 28%, transparent); border-radius: 10px; color: var(--dxw-error); background: color-mix(in srgb, var(--dxw-error) 7%, transparent); font-size: 13px; }
.dxw-error { align-items: flex-start; flex-direction: column; padding: 22px; }
.dxw-error h3 { font-size: 17px; }
.dxw-errorCode { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; opacity: .8; }
.dxw-listHeading { display: flex; justify-content: space-between; align-items: center; margin: 2px 0 9px; }
.dxw-listHeading h3 { margin: 0; font-size: 14px; }
.dxw-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.dxw-accountTop { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dxw-accountIdentity { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dxw-avatar { width: 42px; height: 42px; display: grid; place-items: center; flex: none; border-radius: 12px; color: white; background: var(--dxw-accent); }
.dxw-accountIdentity h3 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; }
.dxw-accountIdentity p { color: var(--dsw-alias-label-secondary, #646a73); font: 12px ui-monospace, SFMono-Regular, monospace; margin-top: 4px; }
.dxw-health { display: inline-flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; white-space: nowrap; }
.dxw-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 20px 0; }
.dxw-metric { padding: 12px 14px; border-radius: 9px; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.dxw-metric dt { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.dxw-metric dd { overflow: hidden; margin: 5px 0 0; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
.dxw-accountFooter { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.dxw-accountFooter .dxw-actions { flex: none; flex-wrap: nowrap; gap: 8px; margin-top: 0; }
.dxw-accountFooter .dxw-button { flex: none; white-space: nowrap; }
.dxw-summary { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.dxw-confirm { padding: 18px 24px; border-top: 1px solid color-mix(in srgb, var(--dxw-error) 25%, transparent); background: color-mix(in srgb, var(--dxw-error) 5%, transparent); }
.dxw-confirm strong { display: block; font-size: 14px; margin-bottom: 6px; }
.dxw-confirm p { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.55; }
.dxw-confirm .dxw-actions { margin-top: 13px; }
.dxw-loading { padding: 36px; color: var(--dsw-alias-label-secondary, #646a73); text-align: center; }
.dxw-spinner { width: 24px; height: 24px; margin: 0 auto 12px; border: 3px solid #e6e8eb; border-top-color: var(--dxw-accent); border-radius: 50%; animation: dxw-spin .8s linear infinite; }
.dxw-visuallyHidden { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@keyframes dxw-spin { to { transform: rotate(360deg); } }
@media (max-width: 720px) {
  .dxw-heading, .dxw-accountTop { flex-direction: column; align-items: stretch; }
  .dxw-empty { grid-template-columns: minmax(0, 1fr); }
  .dxw-logo { display: none; }
  .dxw-qrLayout { grid-template-columns: minmax(0, 1fr); justify-items: center; }
  .dxw-qrCopy { width: 100%; }
  .dxw-metrics { grid-template-columns: minmax(0, 1fr); }
  .dxw-cardBody { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .dxw-page *, .dxw-page *::before, .dxw-page *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
`;
function installWeixinStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${WEIXIN_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-weixin";
  style.dataset.pluginCss = WEIXIN_STYLE_ID;
  style.textContent = CSS8;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/weixin/index.js
var Button11 = React11.forwardRef(function Button12({ children, kind = "secondary", className = "", ...props }, ref) {
  return h2("button", {
    ...props,
    ref,
    type: "button",
    className: `dxw-button ${className}`.trim(),
    "data-kind": kind
  }, children);
});
function Heading5({ totals, adding, busy, onAdd, addButtonRef }) {
  return h2(
    "div",
    { className: "dxw-heading" },
    h2(
      "div",
      { className: "dxw-tools" },
      h2(Button11, {
        kind: "primary",
        className: "dim-scanButton",
        onClick: onAdd,
        disabled: adding || busy,
        ref: addButtonRef,
        "aria-label": "\u626B\u7801\u63A5\u5165\u5FAE\u4FE1\u673A\u5668\u4EBA"
      }, h2(QrActionIcon), adding ? "\u6B63\u5728\u63A5\u5165" : "\u626B\u7801\u63A5\u5165\u673A\u5668\u4EBA"),
      totals.configured > 0 ? h2(
        "div",
        { className: "dxw-badge dim-onlineBadge" },
        h2("span", null, `${totals.connected} / ${totals.configured} \u5728\u7EBF`)
      ) : null
    )
  );
}
function LoadingView5() {
  return h2(
    "div",
    { className: "dxw-card dxw-loading dim-surfaceCard dim-loadingView", "aria-busy": "true" },
    h2("div", { className: "dxw-spinner dim-spinner" }),
    h2("span", null, "\u6B63\u5728\u8BFB\u53D6\u5FAE\u4FE1\u8FDE\u63A5\u72B6\u6001\u2026")
  );
}
function EmptyView5({ onStart, busy }) {
  return h2(
    "div",
    { className: "dxw-card dim-surfaceCard" },
    h2(
      "div",
      { className: "dxw-cardBody dxw-empty dim-surfaceBody dim-emptyView" },
      h2(
        "div",
        { className: "dim-emptyCopy" },
        h2(
          "div",
          { className: "dxw-stateLabel dim-stateLabel" },
          h2("span", { className: "dxw-dot dim-stateDot" }),
          h2("span", null, "\u5C1A\u672A\u7ED1\u5B9A\u5FAE\u4FE1")
        ),
        h2("h3", null, "\u626B\u4E00\u6B21\u7801\uFF0C\u5C31\u80FD\u5728\u5FAE\u4FE1\u91CC\u4F7F\u7528 Harness"),
        h2("p", null, "\u4E8C\u7EF4\u7801\u7531\u817E\u8BAF\u5FAE\u4FE1 iLink \u670D\u52A1\u7B7E\u53D1\u3002\u7528\u624B\u673A\u5FAE\u4FE1\u626B\u63CF\u5E76\u786E\u8BA4\u540E\uFF0C\u8D26\u53F7\u51ED\u636E\u4F1A\u76F4\u63A5\u5199\u5165 Harness Host\uFF0C\u6D4F\u89C8\u5668\u4E0D\u4F1A\u6536\u5230 bot_token\u3002"),
        h2(
          "div",
          { className: "dxw-actions dim-viewActions" },
          h2(
            Button11,
            { kind: "primary", onClick: onStart, disabled: busy },
            busy ? "\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026" : "\u751F\u6210\u5FAE\u4FE1\u4E8C\u7EF4\u7801"
          )
        )
      ),
      h2("div", { className: "dxw-logo dim-emptyBrand", "aria-hidden": "true" }, h2(WeixinLogoGlyph, { size: 64 }))
    )
  );
}
function QrPanel4({ provision, now, busy, onRefresh, onCancel }) {
  const [imageFailed, setImageFailed] = React11.useState(false);
  const source = safeQrSource5(provision.qrCodeDataUrl);
  const href = safeVerificationUrl(provision.verificationUrl);
  const remaining = Math.max(0, provision.expiresAt - now);
  const expired = remaining === 0 || provision.status === "expired";
  const duration = Math.max(1, provision.durationMs ?? 5 * 6e4);
  const progress = Math.round(Math.min(1, remaining / duration) * 100);
  React11.useEffect(() => setImageFailed(false), [source]);
  return h2(
    "div",
    { className: "dxw-card dim-surfaceCard" },
    h2(
      "div",
      { className: "dxw-cardBody dxw-qrLayout dim-surfaceBody dim-qrLayout" },
      h2(
        "div",
        { className: "dxw-qrColumn dim-qrColumn" },
        h2(
          "div",
          { className: "dxw-qrFrame dim-qrFrame" },
          source && !imageFailed ? h2("img", {
            src: source,
            alt: "\u7528\u4E8E\u628A\u5FAE\u4FE1\u673A\u5668\u4EBA\u7ED1\u5B9A\u5230 DeepSeek Harness \u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801",
            onError: () => setImageFailed(true)
          }) : h2("div", { className: "dxw-qrFallback dim-qrFallback" }, "\u4E8C\u7EF4\u7801\u56FE\u7247\u672A\u5C31\u7EEA\uFF0C\u8BF7\u4F7F\u7528\u5907\u7528\u94FE\u63A5\u3002"),
          expired ? h2("div", { className: "dxw-expired dim-qrExpired" }, "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\n\u8BF7\u91CD\u65B0\u751F\u6210") : null
        ),
        h2(
          "div",
          { className: "dxw-countdown dim-countdown" },
          h2("div", { className: "dim-countdownTop" }, h2("span", null, "\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4"), h2("strong", null, formatRemaining5(remaining))),
          h2(
            "div",
            { className: "dxw-progress dim-progress", "aria-hidden": "true" },
            h2("span", { style: { "--dxw-progress": `${progress}%` } })
          )
        )
      ),
      h2(
        "div",
        { className: "dxw-qrCopy dim-qrCopy" },
        h2(
          "div",
          { className: "dxw-stateLabel dim-stateLabel" },
          h2("span", { className: "dxw-dot dim-stateDot", "data-tone": provision.status === "scanned" ? "success" : "warning" }),
          h2("span", null, provision.status === "scanned" ? "\u5DF2\u626B\u7801\uFF0C\u8BF7\u5728\u624B\u673A\u4E0A\u786E\u8BA4" : "\u7B49\u5F85\u5FAE\u4FE1\u626B\u7801")
        ),
        h2("h3", null, expired ? "\u4E8C\u7EF4\u7801\u5DF2\u5931\u6548" : "\u4F7F\u7528\u624B\u673A\u5FAE\u4FE1\u626B\u63CF\u4E8C\u7EF4\u7801"),
        h2("p", null, "\u8BF7\u5728\u624B\u673A\u4E0A\u6838\u5BF9\u5E76\u786E\u8BA4\u6388\u6743\u3002\u90E8\u5206\u8D26\u53F7\u4F1A\u989D\u5916\u663E\u793A\u4E00\u4E2A\u914D\u5BF9\u6570\u5B57\uFF0C\u9875\u9762\u4F1A\u5728\u9700\u8981\u65F6\u63D0\u793A\u8F93\u5165\u3002"),
        h2(
          "ol",
          { className: "dxw-steps dim-steps" },
          h2("li", null, "\u6253\u5F00\u624B\u673A\u5FAE\u4FE1\u5E76\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801"),
          h2("li", null, "\u5728\u5FAE\u4FE1\u4E2D\u786E\u8BA4\u8FDE\u63A5\u8BE5\u673A\u5668\u4EBA"),
          h2("li", null, "\u4FDD\u6301\u672C\u9875\u6253\u5F00\uFF0C\u7B49\u5F85\u6D88\u606F\u957F\u8F6E\u8BE2\u53D8\u4E3A\u5728\u7EBF")
        ),
        h2(
          "div",
          { className: "dxw-actions dim-viewActions" },
          expired ? h2(Button11, { kind: "primary", onClick: onRefresh, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801") : null,
          href ? h2("a", {
            className: "dxw-button",
            href,
            target: "_blank",
            rel: "noopener noreferrer"
          }, "\u6253\u5F00\u5907\u7528\u94FE\u63A5") : null,
          !expired ? h2(Button11, { onClick: onRefresh, disabled: busy }, "\u6362\u4E00\u4E2A\u4E8C\u7EF4\u7801") : null,
          h2(Button11, { onClick: onCancel, disabled: busy }, "\u53D6\u6D88")
        )
      )
    )
  );
}
function VerificationPanel({ provision, busy, onSubmit, onCancel }) {
  const [code, setCode] = React11.useState("");
  const valid = /^\d{4,8}$/.test(code);
  React11.useEffect(() => setCode(""), [provision.attemptId]);
  return h2(
    "div",
    { className: "dxw-card dim-surfaceCard" },
    h2(
      "form",
      {
        className: "dxw-verify dim-specialView",
        onSubmit: (event) => {
          event.preventDefault();
          if (valid && !busy) onSubmit(code);
        }
      },
      h2(
        "div",
        { className: "dxw-stateLabel" },
        h2("span", { className: "dxw-dot", "data-tone": "warning" }),
        h2("span", null, "\u9700\u8981\u914D\u5BF9\u7801")
      ),
      h2("h3", null, "\u8F93\u5165\u624B\u673A\u5FAE\u4FE1\u663E\u793A\u7684\u6570\u5B57"),
      h2("p", null, "\u8FD9\u662F\u5FAE\u4FE1\u9644\u52A0\u7684\u5B89\u5168\u786E\u8BA4\u6B65\u9AA4\u3002\u914D\u5BF9\u7801\u53EA\u7528\u4E8E\u672C\u6B21\u626B\u7801\u8F6E\u8BE2\uFF0C\u4E0D\u4F1A\u5199\u5165\u914D\u7F6E\u6216\u65E5\u5FD7\u3002"),
      h2(
        "div",
        { className: "dxw-codeRow" },
        h2("input", {
          className: "dxw-input",
          value: code,
          inputMode: "numeric",
          autoComplete: "one-time-code",
          maxLength: 8,
          "aria-label": "\u5FAE\u4FE1\u914D\u5BF9\u7801",
          onChange: (event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 8)),
          autoFocus: true
        }),
        h2("button", {
          type: "submit",
          className: "dxw-button",
          "data-kind": "primary",
          disabled: !valid || busy
        }, busy ? "\u6B63\u5728\u9A8C\u8BC1\u2026" : "\u7EE7\u7EED\u8FDE\u63A5")
      ),
      h2(Button11, { onClick: onCancel, disabled: busy }, "\u53D6\u6D88\u7ED1\u5B9A")
    )
  );
}
function ProgressPanel2({ scanned, onCancel, busy }) {
  return h2(
    "div",
    { className: "dxw-card dxw-loading dim-surfaceCard dim-loadingView", "aria-busy": "true" },
    h2("div", { className: "dxw-spinner dim-spinner" }),
    h2("h3", null, scanned ? "\u5FAE\u4FE1\u5DF2\u786E\u8BA4\uFF0C\u6B63\u5728\u542F\u52A8\u6D88\u606F\u8FDE\u63A5" : "\u6B63\u5728\u51C6\u5907\u5FAE\u4FE1\u4E8C\u7EF4\u7801"),
    h2("p", null, scanned ? "\u6B63\u5728\u4FDD\u5B58\u51ED\u636E\u5E76\u9A8C\u8BC1 Harness \u4E0E\u5FAE\u4FE1\u957F\u8F6E\u8BE2\u3002" : "\u6B63\u5728\u8054\u7CFB\u817E\u8BAF\u5FAE\u4FE1 iLink \u670D\u52A1\u3002"),
    onCancel ? h2(
      "div",
      { className: "dxw-actions dim-viewActions", style: { justifyContent: "center", marginTop: 14 } },
      h2(Button11, { onClick: onCancel, disabled: busy }, "\u53D6\u6D88")
    ) : null
  );
}
function ProvisionError3({ provision, busy, onRetry, onClose }) {
  const error = provision.error ?? { code: "WEIXIN_PROVISION_FAILED", message: "\u5FAE\u4FE1\u7ED1\u5B9A\u6CA1\u6709\u5B8C\u6210" };
  return h2(
    "div",
    { className: "dxw-card dim-surfaceCard" },
    h2(
      "div",
      { className: "dxw-error dim-inlineError", role: "alert" },
      h2("h3", null, provision.status === "expired" ? "\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F" : "\u5FAE\u4FE1\u6CA1\u6709\u7ED1\u5B9A\u5B8C\u6210"),
      h2("p", null, error.message),
      h2("span", { className: "dxw-errorCode" }, error.code),
      h2(
        "div",
        { className: "dxw-actions dim-viewActions" },
        h2(Button11, { kind: "primary", onClick: onRetry, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
        h2(Button11, { onClick: onClose, disabled: busy }, "\u5173\u95ED")
      )
    )
  );
}
function checkedTime5(timestamp7) {
  if (!timestamp7) return "\u5C1A\u672A\u68C0\u67E5";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(timestamp7));
  } catch {
    return "\u521A\u521A";
  }
}
function AccountCard4({ account, busy, removing, onReconnect, onRequestRemove, onConfirmRemove, onCancelRemove }) {
  const state = busy === "reconnect" ? "connecting" : account.state;
  const tone = account.connected ? "success" : state === "error" ? "error" : "warning";
  const summary = account.error?.message ?? (account.connected ? null : account.health.summary);
  return h2(
    "article",
    { className: "dxw-card dim-botCard", tabIndex: -1, "data-bot-id": account.botId },
    h2(
      "div",
      { className: "dxw-cardBody dim-botCardBody" },
      h2(
        "div",
        { className: "dxw-accountTop dim-botCardTop" },
        h2(
          "div",
          { className: "dxw-accountIdentity dim-botIdentity" },
          h2("div", { className: "dxw-avatar dim-botAvatar", "aria-hidden": "true" }, h2(WeixinLogoGlyph, { size: 27 })),
          h2("div", { className: "dim-botName" }, h2("h3", null, account.bot.name), h2("p", null, account.bot.accountIdMasked))
        ),
        h2(
          "div",
          { className: "dxw-health dim-botHealth" },
          h2("span", { className: "dxw-dot dim-healthDot", "data-tone": tone }),
          h2("span", null, account.connected ? "\u8FD0\u884C\u6B63\u5E38" : state === "connecting" ? "\u6B63\u5728\u8FDE\u63A5" : "\u8FDE\u63A5\u672A\u5C31\u7EEA")
        )
      ),
      h2(
        "dl",
        { className: "dxw-metrics dim-botMetrics" },
        h2(
          "div",
          { className: "dxw-metric dim-botMetric" },
          h2("dt", null, "\u6D88\u606F\u901A\u9053"),
          h2("dd", null, account.connected ? "iLink \u957F\u8F6E\u8BE2" : "\u79BB\u7EBF")
        ),
        h2(
          "div",
          { className: "dxw-metric dim-botMetric" },
          h2("dt", null, "\u6700\u8FD1\u68C0\u67E5"),
          h2("dd", null, checkedTime5(account.health.lastCheckedAt))
        )
      ),
      h2(
        "div",
        { className: "dxw-accountFooter dim-cardFooter" },
        summary ? h2("div", { className: "dxw-summary dim-cardSummary" }, summary) : null,
        h2(
          "div",
          { className: "dxw-actions dim-cardActions" },
          h2(
            Button11,
            { className: "dim-cardAction", onClick: onReconnect, disabled: Boolean(busy) },
            busy === "reconnect" ? "\u68C0\u67E5\u4E2D\u2026" : account.connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"
          ),
          h2(Button11, { className: "dim-cardAction", kind: "danger", onClick: onRequestRemove, disabled: Boolean(busy) }, "\u79FB\u9664\u63A5\u5165")
        )
      )
    ),
    removing ? h2(
      "div",
      { className: "dxw-confirm dim-confirm", role: "alertdialog" },
      h2("strong", null, "\u4ECE\u6B64 Harness \u79FB\u9664\u8FD9\u4E2A\u5FAE\u4FE1\u8D26\u53F7\uFF1F"),
      h2("p", null, "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684 bot_token\u3001\u8D26\u53F7\u914D\u7F6E\u548C\u4F1A\u8BDD\u6620\u5C04\u3002\u5176\u4ED6\u5FAE\u4FE1\u8D26\u53F7\u4E0D\u53D7\u5F71\u54CD\u3002"),
      h2(
        "div",
        { className: "dxw-actions dim-viewActions" },
        h2(Button11, { onClick: onCancelRemove, disabled: busy === "delete" }, "\u4FDD\u7559\u8D26\u53F7"),
        h2(
          Button11,
          { kind: "danger", onClick: onConfirmRemove, disabled: busy === "delete" },
          busy === "delete" ? "\u6B63\u5728\u79FB\u9664\u2026" : "\u786E\u8BA4\u79FB\u9664"
        )
      )
    ) : null
  );
}
function AccountList2(props) {
  return h2(
    "section",
    { className: "dim-listSection" },
    h2("div", { className: "dxw-listHeading dim-listHeading" }, h2("h3", null, "\u5DF2\u63A5\u5165\u7684\u5FAE\u4FE1\u8D26\u53F7")),
    h2("ul", { className: "dxw-list dim-botList" }, props.bots.map((account) => h2(
      "li",
      { key: account.botId },
      h2(AccountCard4, {
        account,
        busy: props.busyByBot[account.botId],
        removing: props.removeTarget === account.botId,
        onReconnect: () => props.onReconnect(account),
        onRequestRemove: () => props.onRequestRemove(account),
        onConfirmRemove: () => props.onConfirmRemove(account),
        onCancelRemove: props.onCancelRemove
      })
    )))
  );
}
var EMPTY_TOTALS3 = Object.freeze({ configured: 0, connected: 0 });
function mergeWeixinProvisioningSnapshot(current, incoming, { restoreProvisioning = false } = {}) {
  if (!incoming || !current && !restoreProvisioning) return current;
  if (current && current.attemptId !== incoming.attemptId) return current;
  return {
    ...current,
    ...incoming,
    durationMs: current?.durationMs ?? 5 * 6e4
  };
}
function WeixinSettingsTab({ rpcCall }) {
  const [model, setModel] = React11.useState({
    phase: "loading",
    bots: [],
    totals: EMPTY_TOTALS3,
    revision: 0,
    error: null
  });
  const [provision, setProvision] = React11.useState(null);
  const [busy, setBusy] = React11.useState(false);
  const [busyByBot, setBusyByBot] = React11.useState({});
  const [removeTarget, setRemoveTarget] = React11.useState(null);
  const [notice, setNotice] = React11.useState("");
  const [now, setNow] = React11.useState(() => Date.now());
  const addButtonRef = React11.useRef(null);
  const scheduleAnimationFrame = useAnimationFrameScheduler();
  const announce = React11.useCallback((value) => {
    setNotice("");
    scheduleAnimationFrame(() => {
      if (value) setNotice(value);
    }, "announcement");
  }, [scheduleAnimationFrame]);
  const invoke = React11.useCallback(async (endpoint, payload = {}, signal) => {
    return unwrapRpcResult8(await rpcCall(endpoint, payload, signal));
  }, [rpcCall]);
  const loadStatus = React11.useCallback(async ({
    signal,
    silent = false,
    restoreProvisioning = false
  } = {}) => {
    if (!silent) setModel((current) => ({ ...current, phase: "loading", error: null }));
    try {
      const snapshot = normalizeSnapshot7(await invoke(WEIXIN_ENDPOINTS.status, {}, signal));
      if (signal?.aborted) return void 0;
      setModel({
        phase: "ready",
        bots: snapshot.bots,
        totals: snapshot.totals,
        revision: snapshot.revision,
        error: null
      });
      if (snapshot.provisioning) {
        setProvision((current) => mergeWeixinProvisioningSnapshot(
          current,
          snapshot.provisioning,
          { restoreProvisioning }
        ));
      }
      return snapshot;
    } catch (error) {
      if (signal?.aborted || error?.name === "AbortError") return void 0;
      setModel((current) => ({
        ...current,
        phase: silent && current.phase === "ready" ? "ready" : "error",
        error: presentError8(error)
      }));
      return void 0;
    }
  }, [invoke]);
  React11.useEffect(() => {
    const controller = new AbortController();
    void loadStatus({ signal: controller.signal, restoreProvisioning: true });
    return () => controller.abort();
  }, [loadStatus]);
  React11.useEffect(() => {
    if (model.phase !== "ready") return void 0;
    const controller = new AbortController();
    let running = false;
    const timer = window.setInterval(async () => {
      if (running) return;
      running = true;
      await loadStatus({
        signal: controller.signal,
        silent: true,
        restoreProvisioning: false
      });
      running = false;
    }, 15e3);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadStatus, model.phase]);
  React11.useEffect(() => {
    if (!provision || !["pending", "scanned"].includes(provision.status)) return void 0;
    const timer = window.setInterval(() => setNow(Date.now()), 1e3);
    return () => window.clearInterval(timer);
  }, [provision?.attemptId, provision?.status]);
  const startProvisioning = React11.useCallback(async ({ replace = false } = {}) => {
    setBusy(true);
    try {
      if (replace && provision?.attemptId) {
        await invoke(WEIXIN_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      }
      setProvision({ status: "starting" });
      const started = normalizeProvisioning5(await invoke(WEIXIN_ENDPOINTS.beginProvisioning, { locale: "zh-CN" }));
      setNow(Date.now());
      setProvision({ ...started, durationMs: Math.max(1, started.expiresAt - Date.now()) });
      announce("\u5FAE\u4FE1\u4E8C\u7EF4\u7801\u5DF2\u751F\u6210\uFF0C\u8BF7\u4F7F\u7528\u624B\u673A\u5FAE\u4FE1\u626B\u63CF\u3002");
    } catch (error) {
      setProvision({
        status: "failed",
        error: presentError8(error),
        ...provision?.attemptId ? { attemptId: provision.attemptId } : {}
      });
    } finally {
      setBusy(false);
    }
  }, [announce, invoke, provision?.attemptId]);
  const cancelProvisioning = React11.useCallback(async () => {
    setBusy(true);
    try {
      if (provision?.attemptId && !["failed", "expired", "cancelled"].includes(provision.status)) {
        await invoke(WEIXIN_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      }
      setProvision(null);
      announce("\u5DF2\u53D6\u6D88\u5FAE\u4FE1\u7ED1\u5B9A\u3002");
      scheduleAnimationFrame(() => addButtonRef.current?.focus(), "focus");
    } catch (error) {
      setProvision((current) => ({ ...current, status: "failed", error: presentError8(error) }));
    } finally {
      setBusy(false);
    }
  }, [announce, invoke, provision?.attemptId, provision?.status, scheduleAnimationFrame]);
  const submitVerification = React11.useCallback(async (verifyCode) => {
    if (!provision?.attemptId) return;
    setBusy(true);
    try {
      const next = normalizeProvisioning5(await invoke(WEIXIN_ENDPOINTS.submitVerification, {
        attemptId: provision.attemptId,
        verifyCode
      }));
      setProvision((current) => ({ ...current, ...next }));
      announce("\u914D\u5BF9\u7801\u5DF2\u63D0\u4EA4\uFF0C\u6B63\u5728\u7B49\u5F85\u5FAE\u4FE1\u786E\u8BA4\u3002");
    } catch (error) {
      setProvision((current) => ({ ...current, status: "failed", error: presentError8(error) }));
    } finally {
      setBusy(false);
    }
  }, [announce, invoke, provision?.attemptId]);
  React11.useEffect(() => {
    const attemptId = provision?.attemptId;
    if (!attemptId || !["pending", "scanned", "connecting"].includes(provision.status)) return void 0;
    const controller = new AbortController();
    const scheduler = createPollScheduler({
      setTimeoutFn: (callback, delayMs) => window.setTimeout(callback, delayMs),
      clearTimeoutFn: (timer) => window.clearTimeout(timer)
    });
    const poll = async () => {
      try {
        const result = normalizeProvisioning5(await invoke(
          WEIXIN_ENDPOINTS.pollProvisioning,
          { attemptId },
          controller.signal
        ));
        if (scheduler.disposed) return;
        if (result.status === "connected") {
          const snapshot = await loadStatus({
            signal: controller.signal,
            silent: true,
            restoreProvisioning: false
          });
          if (scheduler.disposed) return;
          const account = snapshot?.bots.find((bot) => bot.botId === result.botId);
          if (!account?.connected) {
            setProvision((current) => current?.attemptId === attemptId ? { ...current, ...result, status: "connecting" } : current);
            scheduler.schedule(poll, result.pollIntervalMs);
            return;
          }
          setProvision(null);
          announce(result.alreadyConnected ? "\u8FD9\u4E2A\u5FAE\u4FE1\u8D26\u53F7\u5DF2\u7ECF\u7ED1\u5B9A\u5E76\u4FDD\u6301\u5728\u7EBF\u3002" : "\u5FAE\u4FE1\u5DF2\u7ED1\u5B9A\uFF0C\u53EF\u4EE5\u5F00\u59CB\u5411\u5DF2\u7ED1\u5B9A\u7684\u673A\u5668\u4EBA\u53D1\u6D88\u606F\u3002");
          return;
        }
        setProvision((current) => current?.attemptId === attemptId ? { ...current, ...result, durationMs: current.durationMs } : current);
        if (["pending", "scanned", "connecting"].includes(result.status)) {
          scheduler.schedule(poll, result.pollIntervalMs);
        }
      } catch (error) {
        if (scheduler.disposed || error?.name === "AbortError") return;
        setProvision((current) => current?.attemptId === attemptId ? { ...current, status: "failed", error: presentError8(error) } : current);
      }
    };
    scheduler.schedule(poll, provision.pollIntervalMs ?? 1e3);
    return () => {
      scheduler.dispose();
      controller.abort();
    };
  }, [announce, invoke, loadStatus, provision?.attemptId, provision?.status, provision?.pollIntervalMs]);
  const setBotBusy = React11.useCallback((botId, value) => {
    setBusyByBot((current) => {
      const next = { ...current };
      if (value) next[botId] = value;
      else delete next[botId];
      return next;
    });
  }, []);
  const reconnect = React11.useCallback(async (account) => {
    setBotBusy(account.botId, "reconnect");
    try {
      const snapshot = normalizeSnapshot7(await invoke(WEIXIN_ENDPOINTS.reconnectBot, { botId: account.botId }));
      setModel((current) => ({ ...current, bots: snapshot.bots, totals: snapshot.totals, revision: snapshot.revision }));
      const refreshed = snapshot.bots.find((bot) => bot.botId === account.botId);
      announce(refreshed?.connected ? "\u5FAE\u4FE1\u8FDE\u63A5\u68C0\u67E5\u5B8C\u6210\u3002" : "\u5FAE\u4FE1\u4ECD\u672A\u8FDE\u63A5\uFF0C\u63D2\u4EF6\u4F1A\u7EE7\u7EED\u81EA\u52A8\u91CD\u8BD5\u3002");
    } catch (error) {
      announce(`\u8FDE\u63A5\u68C0\u67E5\u5931\u8D25\uFF1A${presentError8(error).message}`);
    } finally {
      setBotBusy(account.botId, null);
    }
  }, [announce, invoke, setBotBusy]);
  const remove = React11.useCallback(async (account) => {
    setBotBusy(account.botId, "delete");
    try {
      const snapshot = normalizeSnapshot7(await invoke(WEIXIN_ENDPOINTS.deleteBot, {
        botId: account.botId,
        confirm: true
      }));
      setModel((current) => ({ ...current, bots: snapshot.bots, totals: snapshot.totals, revision: snapshot.revision }));
      setRemoveTarget(null);
      announce("\u5FAE\u4FE1\u8D26\u53F7\u53CA\u672C\u673A\u51ED\u636E\u5DF2\u79FB\u9664\u3002");
    } catch (error) {
      announce(`\u79FB\u9664\u5931\u8D25\uFF1A${presentError8(error).message}`);
    } finally {
      setBotBusy(account.botId, null);
    }
  }, [announce, invoke, setBotBusy]);
  let provisionView = null;
  if (provision?.status === "starting") {
    provisionView = h2(ProgressPanel2, { busy });
  } else if (["pending", "scanned"].includes(provision?.status)) {
    provisionView = h2(QrPanel4, {
      provision,
      now,
      busy,
      onRefresh: () => void startProvisioning({ replace: true }),
      onCancel: () => void cancelProvisioning()
    });
  } else if (provision?.status === "needs_verification") {
    provisionView = h2(VerificationPanel, {
      provision,
      busy,
      onSubmit: (code) => void submitVerification(code),
      onCancel: () => void cancelProvisioning()
    });
  } else if (provision?.status === "connecting") {
    provisionView = h2(ProgressPanel2, {
      scanned: true,
      busy,
      onCancel: () => void cancelProvisioning()
    });
  } else if (provision && ["failed", "expired", "cancelled"].includes(provision.status)) {
    provisionView = h2(ProvisionError3, {
      provision,
      busy,
      onRetry: () => void startProvisioning({ replace: Boolean(provision.attemptId) }),
      onClose: () => void cancelProvisioning()
    });
  }
  return h2(
    "section",
    { className: "dxw-page dim-channelPage", "aria-label": "\u5FAE\u4FE1\u8BBE\u7F6E" },
    h2(Heading5, {
      totals: model.totals,
      adding: Boolean(provision),
      busy,
      onAdd: () => void startProvisioning(),
      addButtonRef
    }),
    h2("div", { className: "dxw-visuallyHidden", role: "status", "aria-live": "polite" }, notice),
    model.error && model.phase === "ready" ? h2("div", { className: "dxw-statusNotice dim-statusNotice" }, `\u72B6\u6001\u5237\u65B0\u5931\u8D25\uFF1A${model.error.message}`) : null,
    model.phase === "loading" ? h2(LoadingView5) : model.phase === "error" ? h2(
      "div",
      { className: "dxw-card dim-surfaceCard" },
      h2(
        "div",
        { className: "dxw-error dim-inlineError" },
        h2("h3", null, "\u65E0\u6CD5\u8BFB\u53D6\u5FAE\u4FE1\u72B6\u6001"),
        h2("p", null, model.error?.message ?? "\u8BF7\u7A0D\u540E\u91CD\u8BD5"),
        h2(Button11, { onClick: () => void loadStatus() }, "\u91CD\u65B0\u8BFB\u53D6")
      )
    ) : h2(
      React11.Fragment,
      null,
      provisionView,
      model.bots.length === 0 && !provision ? h2(EmptyView5, { onStart: () => void startProvisioning(), busy }) : null,
      model.bots.length > 0 ? h2(AccountList2, {
        bots: model.bots,
        busyByBot,
        removeTarget,
        onReconnect: (account) => void reconnect(account),
        onRequestRemove: (account) => setRemoveTarget(account.botId),
        onConfirmRemove: (account) => void remove(account),
        onCancelRemove: () => setRemoveTarget(null)
      }) : null
    )
  );
}

// plugin-src/client/channels/whatsapp/api.js
var WHATSAPP_RPC_CHANNEL = "/whatsapp";
var WHATSAPP_ENDPOINTS = Object.freeze({
  status: "connection.status",
  beginProvisioning: "provision.begin",
  pollProvisioning: "provision.poll",
  cancelProvisioning: "provision.cancel",
  reconnectBot: "bot.reconnect",
  deleteBot: "bot.delete"
});
var PROVISION_STATES5 = /* @__PURE__ */ new Set(["starting", "pending", "connecting", "connected", "failed", "cancelled"]);
var BOT_STATES = /* @__PURE__ */ new Set(["connected", "connecting", "offline", "error"]);
var QR_DATA_URL4 = /^data:image\/(?:png|webp);base64,[a-z\d+/]+={0,2}$/i;
function isRecord7(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function text4(value, fallback, max = 240) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
}
function id4(value) {
  const result = text4(value, "", 128);
  return /^[a-z\d_-]+$/i.test(result) ? result : void 0;
}
function timestamp6(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = typeof value === "string" ? Date.parse(value) : Number.NaN;
  return Number.isNaN(parsed) ? void 0 : parsed;
}
function unwrapRpcResult9(result) {
  if (!isRecord7(result) || typeof result.ok !== "boolean") {
    throw new Error("WhatsApp \u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u54CD\u5E94");
  }
  if (!result.ok) {
    const error = new Error(text4(result.error?.message, "WhatsApp \u64CD\u4F5C\u5931\u8D25"));
    error.code = text4(result.error?.code, "WHATSAPP_RPC_ERROR", 80);
    throw error;
  }
  return result.value;
}
function safeQrSource6(value) {
  return typeof value === "string" && value.length <= 2 * 1024 * 1024 && QR_DATA_URL4.test(value) ? value : void 0;
}
function normalizeProvisioning6(value, now = Date.now()) {
  const source = isRecord7(value?.provisioning) ? value.provisioning : value;
  if (!isRecord7(source)) throw new Error("WhatsApp \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u626B\u7801\u8FDB\u5EA6");
  const attemptId = id4(source.attemptId);
  if (!attemptId) throw new Error("WhatsApp \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u626B\u7801\u4EFB\u52A1");
  const reported = text4(source.status, "failed", 32);
  const result = {
    attemptId,
    status: PROVISION_STATES5.has(reported) ? reported : "failed",
    expiresAt: timestamp6(source.expiresAt) ?? now + 6e4,
    pollIntervalMs: Math.min(5e3, Math.max(500, Number(source.pollIntervalMs) || 1e3)),
    qrRevision: Number.isSafeInteger(source.qrRevision) ? source.qrRevision : 0
  };
  const qrCodeDataUrl = safeQrSource6(source.qrCodeDataUrl);
  if (qrCodeDataUrl) result.qrCodeDataUrl = qrCodeDataUrl;
  if (id4(source.botId)) result.botId = id4(source.botId);
  if (isRecord7(source.error)) result.error = {
    code: text4(source.error.code, "WHATSAPP_PROVISION_FAILED", 80),
    message: text4(source.error.message, "WhatsApp \u6CA1\u6709\u63A5\u5165\u5B8C\u6210")
  };
  return result;
}
function normalizeBot6(value) {
  if (!isRecord7(value) || !id4(value.botId)) return void 0;
  const connected = value.connected === true;
  const state = BOT_STATES.has(value.state) ? value.state : "offline";
  return {
    botId: id4(value.botId),
    connected,
    state: connected ? "connected" : state,
    bot: {
      name: text4(value.bot?.name, "WhatsApp\u673A\u5668\u4EBA", 100),
      idMasked: text4(value.bot?.idMasked, "WhatsApp\u8D26\u53F7", 140)
    },
    health: {
      summary: text4(value.health?.summary, connected ? "WhatsApp Web \u5173\u8054\u8BBE\u5907\u8FD0\u884C\u6B63\u5E38" : "WhatsApp \u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA"),
      lastCheckedAt: timestamp6(value.health?.lastCheckedAt)
    },
    error: isRecord7(value.error) ? {
      code: text4(value.error.code, "WHATSAPP_ACCOUNT_ERROR", 80),
      message: text4(value.error.message, "WhatsApp \u8FDE\u63A5\u5C1A\u672A\u5C31\u7EEA")
    } : null
  };
}
function normalizeSnapshot8(value) {
  const source = isRecord7(value?.snapshot) ? value.snapshot : value;
  if (!isRecord7(source) || !Array.isArray(source.bots)) {
    throw new Error("WhatsApp \u670D\u52A1\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7684\u673A\u5668\u4EBA\u5217\u8868");
  }
  const bots = source.bots.map(normalizeBot6).filter(Boolean);
  return {
    revision: Number.isSafeInteger(source.revision) ? source.revision : 0,
    bots,
    totals: { configured: bots.length, connected: bots.filter((bot) => bot.connected).length },
    provisioning: source.provisioning ? normalizeProvisioning6(source.provisioning) : null
  };
}
function presentError9(error) {
  return {
    code: text4(error?.code, "WHATSAPP_ERROR", 80),
    message: text4(error?.message, "WhatsApp \u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5")
  };
}
function formatRemaining6(milliseconds) {
  const seconds = Math.max(0, Math.ceil(Number(milliseconds) / 1e3) || 0);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

// plugin-src/client/channels/whatsapp/index.js
var React12 = __toESM(require("react"), 1);

// plugin-src/client/channels/whatsapp/styles.js
var WHATSAPP_STYLE_ID = "xmanrui-dsh-im-whatsapp-settings";
var CSS9 = String.raw`
.dwa-page { --ddt-accent: #25d366; --ddt-accent-deep: #128c7e; --ddt-accent-wash: #eafbf0; }
.dwa-avatar { color: #fff; background: #25d366; }
.dwa-avatar svg { display: block; }
`;
function installWhatsappStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${WHATSAPP_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-im";
  style.dataset.pluginCss = WHATSAPP_STYLE_ID;
  style.textContent = CSS9;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/channels/whatsapp/index.js
var ACTIVE_STATES3 = /* @__PURE__ */ new Set(["pending", "connecting"]);
var Button13 = React12.forwardRef(function Button14({ children, kind = "secondary", className = "", ...props }, ref) {
  return h2("button", {
    ...props,
    ref,
    type: "button",
    className: `ddt-button ${className}`.trim(),
    "data-kind": kind
  }, children);
});
function checkedTime6(value) {
  if (!value) return "\u5C1A\u672A\u68C0\u67E5";
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date(value));
  } catch {
    return "\u521A\u521A";
  }
}
function Heading6({ totals, busy, onAdd, addButtonRef }) {
  return h2(
    "div",
    { className: "ddt-heading" },
    h2(
      "div",
      { className: "ddt-tools" },
      h2(
        "div",
        { className: "dim-bindActions" },
        h2(Button13, {
          kind: "primary",
          className: "dim-scanButton",
          onClick: onAdd,
          disabled: busy,
          ref: addButtonRef,
          "aria-label": "\u626B\u7801\u63A5\u5165 WhatsApp \u673A\u5668\u4EBA"
        }, h2(QrActionIcon), busy ? "\u6B63\u5728\u63A5\u5165" : "\u626B\u7801\u63A5\u5165\u673A\u5668\u4EBA")
      ),
      totals.configured > 0 ? h2(
        "div",
        { className: "ddt-badge dim-onlineBadge" },
        h2("span", null, `${totals.connected} / ${totals.configured} \u5728\u7EBF`)
      ) : null
    )
  );
}
function LoadingView6() {
  return h2("div", {
    className: "ddt-card ddt-loading dim-surfaceCard dim-loadingView",
    "aria-busy": "true"
  }, h2("div", { className: "ddt-spinner dim-spinner" }), "\u6B63\u5728\u8BFB\u53D6 WhatsApp \u673A\u5668\u4EBA\u72B6\u6001\u2026");
}
function EmptyView6({ busy, onStart }) {
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-empty dim-surfaceBody dim-emptyView" },
      h2(
        "div",
        { className: "dim-emptyCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot" }),
          h2("span", null, "\u5C1A\u672A\u63A5\u5165 WhatsApp \u673A\u5668\u4EBA")
        ),
        h2("h3", null, "\u626B\u7801\u7ED1\u5B9A WhatsApp \u673A\u5668\u4EBA"),
        h2("p", null, "\u4F7F\u7528\u624B\u673A WhatsApp \u626B\u63CF\u4E8C\u7EF4\u7801\u5373\u53EF\u63A5\u5165\u3002"),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(
            Button13,
            { kind: "primary", onClick: onStart, disabled: busy },
            busy ? "\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026" : "\u751F\u6210\u4E8C\u7EF4\u7801"
          )
        )
      ),
      h2("div", {
        className: "ddt-brandMark dim-emptyBrand dwa-avatar",
        "aria-hidden": "true"
      }, h2(WhatsappLogoGlyph, { size: 64 }))
    )
  );
}
function QrPanel5({ provision, now, busy, onRefresh, onCancel }) {
  const source = safeQrSource6(provision.qrCodeDataUrl);
  const remaining = Math.max(0, provision.expiresAt - now);
  const duration = Math.max(1, provision.durationMs ?? 6e4);
  const progress = Math.round(Math.min(1, remaining / duration) * 100);
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-cardBody ddt-qrLayout dim-surfaceBody dim-qrLayout" },
      h2(
        "div",
        { className: "ddt-qrColumn dim-qrColumn" },
        h2(
          "div",
          { className: "ddt-qrFrame dim-qrFrame" },
          source ? h2("img", {
            src: source,
            alt: "\u7528\u4E8E\u5173\u8054 WhatsApp \u8BBE\u5907\u7684\u4E00\u6B21\u6027\u4E8C\u7EF4\u7801"
          }) : h2("div", { className: "ddt-qrFallback dim-qrFallback" }, "\u4E8C\u7EF4\u7801\u6B63\u5728\u751F\u6210\u2026")
        ),
        h2(
          "div",
          { className: "ddt-countdown dim-countdown" },
          h2(
            "div",
            { className: "ddt-countdownTop dim-countdownTop" },
            h2("span", null, "\u5F53\u524D\u4E8C\u7EF4\u7801\u6709\u6548\u65F6\u95F4"),
            h2("strong", null, formatRemaining6(remaining))
          ),
          h2("div", {
            className: "ddt-progress dim-progress",
            style: { "--ddt-progress": `${progress}%` }
          }, h2("span"))
        )
      ),
      h2(
        "div",
        { className: "ddt-qrCopy dim-qrCopy" },
        h2(
          "div",
          { className: "ddt-stateLabel dim-stateLabel" },
          h2("span", { className: "ddt-dot dim-stateDot", "data-tone": "warning" }),
          h2("span", null, "\u7B49\u5F85 WhatsApp \u626B\u7801")
        ),
        h2("h3", null, "\u7528\u624B\u673A WhatsApp \u626B\u63CF\u4E8C\u7EF4\u7801"),
        h2(
          "ol",
          { className: "ddt-steps dim-steps" },
          h2("li", null, "\u6253\u5F00 WhatsApp \u2192 \u8BBE\u7F6E \u2192 \u5DF2\u5173\u8054\u8BBE\u5907"),
          h2("li", null, "\u70B9\u51FB\u201C\u5173\u8054\u8BBE\u5907\u201D\u5E76\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801")
        ),
        h2(
          "div",
          { className: "ddt-actions dim-viewActions" },
          h2(Button13, { onClick: onRefresh, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
          h2(Button13, { kind: "quiet", onClick: onCancel, disabled: busy }, "\u53D6\u6D88")
        )
      )
    )
  );
}
function ProvisionView3({ provision, busy, onRetry, onClose }) {
  if (provision.status === "starting" || provision.status === "connecting") {
    const starting = provision.status === "starting";
    return h2(
      "div",
      {
        className: "ddt-card ddt-loading dim-surfaceCard dim-specialView",
        "aria-busy": "true"
      },
      h2("div", { className: "ddt-spinner dim-spinner" }),
      h2("h3", null, starting ? "\u6B63\u5728\u751F\u6210 WhatsApp \u4E8C\u7EF4\u7801" : "\u5DF2\u626B\u7801\uFF0C\u6B63\u5728\u8FDE\u63A5 WhatsApp"),
      h2("p", null, starting ? "\u6B63\u5728\u5EFA\u7ACB\u5B89\u5168\u7684\u5173\u8054\u8BBE\u5907\u4F1A\u8BDD\u3002" : "\u5173\u8054\u8BBE\u5907\u6B63\u5728\u63A5\u5165 DeepSeek Harness\u3002")
    );
  }
  const error = provision.error ?? {
    code: "WHATSAPP_PROVISION_FAILED",
    message: "WhatsApp \u6CA1\u6709\u63A5\u5165\u5B8C\u6210"
  };
  return h2(
    "div",
    { className: "ddt-card dim-surfaceCard" },
    h2(
      "div",
      { className: "ddt-inlineError dim-inlineError", role: "alert" },
      h2("h3", null, "WhatsApp \u6CA1\u6709\u63A5\u5165\u5B8C\u6210"),
      h2("p", null, error.message),
      h2("span", { className: "ddt-errorCode" }, error.code),
      h2(
        "div",
        { className: "ddt-actions dim-viewActions" },
        h2(Button13, { kind: "primary", onClick: onRetry, disabled: busy }, "\u91CD\u65B0\u751F\u6210\u4E8C\u7EF4\u7801"),
        h2(Button13, { onClick: onClose, disabled: busy }, "\u5173\u95ED")
      )
    )
  );
}
function RemoveConfirmation5({ account, busy, onConfirm, onCancel }) {
  return h2(
    "div",
    { className: "ddt-confirm dim-confirm", role: "alertdialog" },
    h2("strong", null, `\u4ECE DeepSeek Harness \u79FB\u9664\u201C${account.bot.name}\u201D\uFF1F`),
    h2("p", null, "\u8FD9\u4F1A\u505C\u6B62\u6D88\u606F\u8FDE\u63A5\uFF0C\u5E76\u5220\u9664\u672C\u673A\u4FDD\u5B58\u7684 WhatsApp \u5173\u8054\u8BBE\u5907\u548C\u4F1A\u8BDD\u6620\u5C04\u3002"),
    h2(
      "div",
      { className: "ddt-actions dim-viewActions" },
      h2(Button13, { onClick: onCancel, disabled: busy }, "\u4FDD\u7559\u673A\u5668\u4EBA"),
      h2(
        Button13,
        { kind: "danger", onClick: onConfirm, disabled: busy },
        busy ? "\u6B63\u5728\u79FB\u9664\u2026" : "\u786E\u8BA4\u79FB\u9664\u63A5\u5165"
      )
    )
  );
}
function WhatsappAccountCard({
  account,
  busy,
  removing,
  onReconnect,
  onRequestRemove,
  onConfirmRemove,
  onCancelRemove
}) {
  const state = busy === "reconnect" ? "connecting" : account.state;
  const tone = account.connected ? "success" : state === "error" ? "error" : "warning";
  const stateLabel = account.connected ? "\u8FD0\u884C\u6B63\u5E38" : state === "connecting" ? "\u6B63\u5728\u8FDE\u63A5" : "\u8FDE\u63A5\u672A\u5C31\u7EEA";
  const summary = account.error?.message ?? (account.connected ? null : account.health.summary);
  return h2(
    "article",
    { className: "ddt-card dim-botCard", "data-bot-id": account.botId },
    h2(
      "div",
      { className: "ddt-cardBody dim-botCardBody" },
      h2(
        "div",
        { className: "ddt-accountTop dim-botCardTop" },
        h2(
          "div",
          { className: "ddt-accountIdentity dim-botIdentity" },
          h2("div", {
            className: "ddt-avatar dim-botAvatar dwa-avatar",
            "aria-hidden": "true"
          }, h2(WhatsappLogoGlyph, { size: 29 })),
          h2(
            "div",
            { className: "dim-botName" },
            h2("h3", null, account.bot.name),
            h2("p", null, account.bot.idMasked)
          )
        ),
        h2(
          "div",
          { className: "ddt-health dim-botHealth" },
          h2("span", { className: "ddt-dot dim-healthDot", "data-tone": tone }),
          h2("span", null, stateLabel)
        )
      ),
      h2(
        "dl",
        { className: "ddt-metrics dim-botMetrics" },
        h2(
          "div",
          { className: "ddt-metric dim-botMetric" },
          h2("dt", null, "\u6D88\u606F\u901A\u9053"),
          h2("dd", null, account.connected ? "WhatsApp Web" : "\u79BB\u7EBF")
        ),
        h2(
          "div",
          { className: "ddt-metric dim-botMetric" },
          h2("dt", null, "\u6700\u8FD1\u68C0\u67E5"),
          h2("dd", null, checkedTime6(account.health.lastCheckedAt))
        )
      ),
      h2(
        "div",
        { className: "ddt-accountFooter dim-cardFooter" },
        summary ? h2("div", { className: "ddt-summary dim-cardSummary" }, summary) : null,
        h2(
          "div",
          { className: "ddt-actions dim-cardActions" },
          h2(Button13, {
            className: "dim-cardAction",
            onClick: onReconnect,
            disabled: Boolean(busy)
          }, busy === "reconnect" ? "\u68C0\u67E5\u4E2D\u2026" : account.connected ? "\u68C0\u67E5\u8FDE\u63A5" : "\u91CD\u8BD5\u8FDE\u63A5"),
          h2(Button13, {
            className: "dim-cardAction",
            kind: "danger",
            onClick: onRequestRemove,
            disabled: Boolean(busy)
          }, "\u79FB\u9664\u63A5\u5165")
        )
      )
    ),
    removing ? h2(RemoveConfirmation5, {
      account,
      busy: busy === "delete",
      onConfirm: onConfirmRemove,
      onCancel: onCancelRemove
    }) : null
  );
}
function WhatsappSettingsTab({ rpcCall }) {
  const [model, setModel] = React12.useState({
    phase: "loading",
    bots: [],
    totals: { configured: 0, connected: 0 },
    error: null
  });
  const [provision, setProvision] = React12.useState(null);
  const [busy, setBusy] = React12.useState(false);
  const [busyByBot, setBusyByBot] = React12.useState({});
  const [removeTarget, setRemoveTarget] = React12.useState(null);
  const [now, setNow] = React12.useState(Date.now());
  const mounted = React12.useRef(true);
  const addButtonRef = React12.useRef(null);
  React12.useEffect(() => {
    const disposeDingtalk = installDingtalkStyles();
    const disposeWhatsapp = installWhatsappStyles();
    mounted.current = true;
    return () => {
      mounted.current = false;
      disposeWhatsapp();
      disposeDingtalk();
    };
  }, []);
  const invoke = React12.useCallback(async (endpoint, payload = {}, signal) => {
    if (typeof rpcCall !== "function") throw new TypeError("WhatsApp \u8BBE\u7F6E\u9875\u7F3A\u5C11 RPC \u8FDE\u63A5");
    return unwrapRpcResult9(await rpcCall(endpoint, payload, signal));
  }, [rpcCall]);
  const loadStatus = React12.useCallback(async ({ signal, silent = false, restore = false } = {}) => {
    if (!silent && mounted.current) setModel((current) => ({ ...current, phase: "loading", error: null }));
    try {
      const snapshot = normalizeSnapshot8(await invoke(WHATSAPP_ENDPOINTS.status, {}, signal));
      if (!mounted.current || signal?.aborted) return void 0;
      setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      if (restore && snapshot.provisioning) setProvision({
        ...snapshot.provisioning,
        durationMs: Math.max(1, snapshot.provisioning.expiresAt - Date.now())
      });
      return snapshot;
    } catch (error) {
      if (error?.name !== "AbortError" && mounted.current && !signal?.aborted) {
        setModel((current) => ({
          ...current,
          phase: silent ? current.phase : "error",
          error: presentError9(error)
        }));
      }
      return void 0;
    }
  }, [invoke]);
  React12.useEffect(() => {
    const controller = new AbortController();
    void loadStatus({ signal: controller.signal, restore: true });
    return () => controller.abort();
  }, [loadStatus]);
  React12.useEffect(() => {
    if (model.phase !== "ready") return void 0;
    const controller = new AbortController();
    const timer = window.setInterval(
      () => void loadStatus({ signal: controller.signal, silent: true }),
      15e3
    );
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadStatus, model.phase]);
  React12.useEffect(() => {
    if (!provision || !ACTIVE_STATES3.has(provision.status)) return void 0;
    const timer = window.setInterval(() => mounted.current && setNow(Date.now()), 1e3);
    return () => window.clearInterval(timer);
  }, [provision?.attemptId, provision?.status]);
  const startProvisioning = React12.useCallback(async (replace = false) => {
    setBusy(true);
    try {
      if (replace && provision?.attemptId) {
        await invoke(WHATSAPP_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      }
      if (!mounted.current) return;
      setProvision({ status: "starting" });
      const started = normalizeProvisioning6(await invoke(WHATSAPP_ENDPOINTS.beginProvisioning, {}));
      if (!mounted.current) return;
      setNow(Date.now());
      setProvision({ ...started, durationMs: Math.max(1, started.expiresAt - Date.now()) });
    } catch (error) {
      if (mounted.current) setProvision({ status: "failed", error: presentError9(error) });
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke, provision?.attemptId]);
  const closeProvision = React12.useCallback(async () => {
    setBusy(true);
    try {
      if (provision?.attemptId && ACTIVE_STATES3.has(provision.status)) {
        await invoke(WHATSAPP_ENDPOINTS.cancelProvisioning, { attemptId: provision.attemptId });
      }
      if (mounted.current) setProvision(null);
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, [invoke, provision?.attemptId, provision?.status]);
  React12.useEffect(() => {
    const attemptId = provision?.attemptId;
    if (!attemptId || !ACTIVE_STATES3.has(provision.status)) return void 0;
    const controller = new AbortController();
    let disposed = false;
    let timer;
    const schedule = (delay) => {
      if (disposed || controller.signal.aborted) return;
      timer = window.setTimeout(() => void poll(), delay);
    };
    const poll = async () => {
      try {
        const current = normalizeProvisioning6(await invoke(
          WHATSAPP_ENDPOINTS.pollProvisioning,
          { attemptId },
          controller.signal
        ));
        if (disposed || controller.signal.aborted || !mounted.current) return;
        if (current.status === "connected") {
          setProvision(null);
          await loadStatus({ signal: controller.signal, silent: true });
          return;
        }
        setProvision((previous) => ({
          ...current,
          durationMs: previous?.durationMs ?? Math.max(1, current.expiresAt - Date.now())
        }));
        if (ACTIVE_STATES3.has(current.status)) schedule(current.pollIntervalMs);
      } catch (error) {
        if (!disposed && !controller.signal.aborted && mounted.current) {
          setProvision({ status: "failed", error: presentError9(error) });
        }
      }
    };
    schedule(provision.pollIntervalMs ?? 1e3);
    return () => {
      disposed = true;
      controller.abort();
      if (timer) window.clearTimeout(timer);
    };
  }, [invoke, loadStatus, provision?.attemptId, provision?.status]);
  const botAction = React12.useCallback(async (account, operation, endpoint, payload) => {
    setBusyByBot((current) => ({ ...current, [account.botId]: operation }));
    try {
      const snapshot = normalizeSnapshot8(await invoke(endpoint, payload));
      if (mounted.current) {
        setModel({ phase: "ready", bots: snapshot.bots, totals: snapshot.totals, error: null });
      }
    } finally {
      if (mounted.current) setBusyByBot((current) => {
        const next = { ...current };
        delete next[account.botId];
        return next;
      });
    }
  }, [invoke]);
  const botList = model.bots.length > 0 ? h2(
    "section",
    { className: "dim-listSection" },
    h2(
      "div",
      { className: "ddt-listHeading dim-listHeading" },
      h2("h3", null, "\u5DF2\u63A5\u5165\u7684 WhatsApp \u673A\u5668\u4EBA")
    ),
    h2("ul", { className: "ddt-list dim-botList" }, model.bots.map((account) => h2("li", { key: account.botId }, h2(WhatsappAccountCard, {
      account,
      busy: busyByBot[account.botId],
      removing: removeTarget === account.botId,
      onReconnect: () => void botAction(
        account,
        "reconnect",
        WHATSAPP_ENDPOINTS.reconnectBot,
        { botId: account.botId }
      ),
      onRequestRemove: () => setRemoveTarget(account.botId),
      onCancelRemove: () => setRemoveTarget(null),
      onConfirmRemove: async () => {
        await botAction(account, "delete", WHATSAPP_ENDPOINTS.deleteBot, {
          botId: account.botId,
          confirm: true
        });
        if (mounted.current) setRemoveTarget(null);
      }
    }))))
  ) : null;
  return h2(
    "section",
    {
      className: "ddt-page dwa-page dim-channelPage",
      "aria-label": "WhatsApp \u8BBE\u7F6E"
    },
    h2(Heading6, {
      totals: model.totals,
      busy,
      onAdd: () => void startProvisioning(false),
      addButtonRef
    }),
    model.phase === "loading" ? h2(LoadingView6) : model.phase === "error" ? h2(
      "div",
      { className: "ddt-card dim-surfaceCard" },
      h2(
        "div",
        { className: "ddt-inlineError dim-inlineError" },
        h2("h3", null, "\u65E0\u6CD5\u8BFB\u53D6 WhatsApp \u673A\u5668\u4EBA\u72B6\u6001"),
        h2("p", null, model.error?.message),
        h2(Button13, { onClick: () => void loadStatus() }, "\u91CD\u65B0\u8BFB\u53D6")
      )
    ) : h2(
      React12.Fragment,
      null,
      provision?.status === "pending" ? h2(QrPanel5, {
        provision,
        now,
        busy,
        onRefresh: () => void startProvisioning(true),
        onCancel: () => void closeProvision()
      }) : provision ? h2(ProvisionView3, {
        provision,
        busy,
        onRetry: () => void startProvisioning(true),
        onClose: () => void closeProvision()
      }) : model.bots.length === 0 ? h2(EmptyView6, { busy, onStart: () => void startProvisioning(false) }) : null,
      botList
    )
  );
}

// plugin-src/client/styles.js
var IM_STYLE_ID = "xmanrui-dsh-im-settings";
var CSS10 = String.raw`
.dim-page {
  --dim-blue: var(--dsw-alias-state-business-primary, #3370ff);
  --dim-blue-soft: color-mix(in srgb, var(--dim-blue) 9%, transparent);
  width: 100%;
  max-width: 1080px;
  padding: 2px 0 30px;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.dim-page *, .dim-page *::before, .dim-page *::after { box-sizing: border-box; }
.dim-title { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0 0 18px; }
.dim-brand { min-width: 0; display: flex; align-items: center; gap: 12px; }
.dim-brandLogo { width: 48px; height: 48px; flex: 0 0 48px; display: block; object-fit: contain; filter: grayscale(1) contrast(1.08); }
.dim-title p { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; line-height: 20px; font-weight: 600; white-space: nowrap; }
.dim-githubAction { position: relative; display: inline-flex; flex: none; }
.dim-githubLink { min-height: 30px; display: inline-flex; align-items: center; gap: 5px; flex: none; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-1, #fff); font-size: 12px; line-height: normal; font-weight: 560; text-decoration: none; transition: border-color .15s ease, color .15s ease, background .15s ease; }
.dim-githubLink:hover { border-color: #aeb3bb; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.dim-githubLink:focus-visible { outline: 2px solid color-mix(in srgb, var(--dim-blue) 70%, white); outline-offset: 2px; }
.dim-githubArrow { font-size: 13px; line-height: 1; }
.dim-githubTooltip { position: absolute; right: 0; bottom: calc(100% + 8px); z-index: 20; width: max-content; max-width: min(220px, 80vw); padding: 6px 9px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 7px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-3, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 14%); font-size: 11px; line-height: 16px; font-weight: 500; white-space: nowrap; opacity: 0; visibility: hidden; transform: translateY(3px); pointer-events: none; transition: opacity .15s ease, transform .15s ease, visibility .15s ease; }
.dim-githubAction:hover .dim-githubTooltip, .dim-githubAction:focus-within .dim-githubTooltip { opacity: 1; visibility: visible; transform: translateY(0); }
.dim-layout { display: grid; grid-template-columns: 174px 1px minmax(0, 1fr); gap: 24px; align-items: start; }
.dim-rail { max-height: 520px; display: grid; align-content: start; gap: 8px; overflow-y: auto; padding: 1px 4px 1px 1px; scrollbar-width: thin; scrollbar-color: var(--dsw-alias-border-l2, #dfe1e5) transparent; }
.dim-rail::-webkit-scrollbar { width: 4px; }
.dim-rail::-webkit-scrollbar-thumb { border-radius: 99px; background: var(--dsw-alias-border-l2, #dfe1e5); }
.dim-channel { width: 100%; min-height: 48px; display: grid; grid-template-columns: 30px minmax(0, 1fr); align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l2, #eef0f3); border-radius: 14px; color: inherit; background: var(--dsw-alias-bg-layer-3, #fff); box-shadow: 0 2px 8px rgb(31 35 41 / 3%); font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, background .16s ease, box-shadow .16s ease; }
.dim-channel:hover { border-color: color-mix(in srgb, var(--dim-blue) 25%, var(--dsw-alias-border-l2, #eef0f3)); background: color-mix(in srgb, var(--dim-blue) 2%, var(--dsw-alias-bg-layer-3, #fff)); box-shadow: 0 5px 16px rgb(31 35 41 / 5%); }
.dim-channel[aria-selected="true"] { border-color: color-mix(in srgb, var(--dim-blue) 43%, var(--dsw-alias-border-l2, #dfe1e5)); color: var(--dim-blue); background: color-mix(in srgb, var(--dim-blue) 12%, var(--dsw-alias-bg-layer-3, #fff)); box-shadow: 0 3px 12px rgb(51 112 255 / 7%); }
.dim-channel:focus-visible { outline: none; border-color: color-mix(in srgb, var(--dim-blue) 72%, var(--dsw-alias-border-l2, #dfe1e5)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--dim-blue) 24%, transparent) inset, 0 3px 12px rgb(51 112 255 / 7%); }
.dim-logo { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 9px; box-shadow: 0 1px 3px rgb(31 35 41 / 7%); }
.dim-logo svg { display: block; width: 20px; height: 20px; }
.dim-logoWeixin { color: white; background: #07c160; }
.dim-logoWeixin svg { width: 19px; height: 19px; }
.dim-logoFeishu { background: white; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); }
.dim-logoFeishu svg { width: 28px; height: 28px; }
.dim-logoDingtalk { color: white; background: #1677ff; }
.dim-logoDingtalk svg { width: 24px; height: 24px; }
.dim-logoQq { color: white; background: #1677ff; }
.dim-logoQq svg { width: 21px; height: 21px; }
.dim-logoWecom { background: white; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); }
.dim-logoWecom svg { width: 22px; height: 22px; }
.dim-logoTelegram { color: white; background: #229ed9; }
.dim-logoTelegram svg { width: 21px; height: 21px; }
.dim-logoDiscord { color: white; background: #5865f2; }
.dim-logoDiscord svg { width: 21px; height: 21px; }
.dim-logoSlack { color: white; background: #4a154b; }
.dim-logoSlack svg { width: 21px; height: 21px; }
.dim-logoWhatsapp { color: white; background: #25d366; }
.dim-logoWhatsapp svg { width: 21px; height: 21px; }
.dim-channelCopy { min-width: 0; display: block; }
.dim-channelCopy strong { overflow: hidden; color: inherit; font-size: 14px; line-height: 20px; font-weight: 680; text-overflow: ellipsis; white-space: nowrap; }
.dim-divider { width: 1px; min-height: 520px; background: var(--dsw-alias-border-l1, #eef0f3); }
.dim-panel { min-width: 0; container-type: inline-size; }
.dim-panel .bxf-page, .dim-panel .dxw-page, .dim-panel .ddt-page, .dim-panel .dqq-page, .dim-panel .dwecom-page, .dim-panel .dsl-page, .dim-panel .dwa-page { width: 100%; max-width: none; padding: 0 0 24px; }
.dim-panel .bxf-heading, .dim-panel .dxw-heading, .dim-panel .ddt-heading { justify-content: flex-end; }
.dim-panel .bxf-headingTools, .dim-panel .dxw-tools, .dim-panel .ddt-tools { width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) max-content; align-items: center; justify-content: stretch; gap: 8px; }
.dim-panel .dim-bindActions { min-width: 0; display: flex; align-items: center; flex-wrap: nowrap; gap: 8px; }
.dim-panel .dim-bindActions > button { min-width: 0; }
.dim-panel .bxf-headingTools .dim-scanButton, .dim-panel .dxw-tools .dim-scanButton, .dim-panel .ddt-tools .dim-scanButton { flex: none; min-height: 34px; display: inline-flex; align-items: center; justify-content: center; justify-self: start; gap: 6px; padding: 0 10px; border: 1px solid #1677ff; border-radius: 8px; color: #fff; background: #1677ff; box-shadow: none; font: inherit; font-size: 13px; font-weight: 560; white-space: nowrap; }
.dim-panel .bxf-headingTools .dim-scanButton:hover:not(:disabled), .dim-panel .dxw-tools .dim-scanButton:hover:not(:disabled), .dim-panel .ddt-tools .dim-scanButton:hover:not(:disabled) { border-color: #0958d9; background: #0958d9; }
.dim-panel .dim-credentialButton { flex: none; min-height: 34px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 10px; border: 1px solid #86909c; border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 5%); font: inherit; font-size: 13px; font-weight: 560; line-height: normal; white-space: nowrap; }
.dim-panel .dim-actionIcon { width: 15px; height: 15px; flex: 0 0 15px; }
.dim-panel .dim-credentialButton:hover:not(:disabled) { border-color: #4e5969; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.dim-panel .dim-credentialButton[aria-pressed="true"] { border-color: #4e5969; background: var(--dsw-alias-bg-module-platform, #f2f3f5); box-shadow: inset 0 0 0 1px rgb(78 89 105 / 8%); }
.dim-panel .bxf-headingTools .dim-onlineBadge, .dim-panel .dxw-tools .dim-onlineBadge, .dim-panel .ddt-tools .dim-onlineBadge { min-height: 30px; display: inline-flex; align-items: center; justify-self: end; gap: 0; padding: 0 11px; border: 0; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f2f3f5); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; white-space: nowrap; }
.dim-panel .dim-channelPage { width: 100%; max-width: none; display: flex; flex-direction: column; gap: 12px; padding: 0 0 24px; color: var(--dsw-alias-label-primary, #1f2329); box-sizing: border-box; }
.dim-panel .dim-surfaceCard { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.dim-panel .dim-surfaceCard::before { display: none; }
.dim-panel .dim-surfaceBody { padding: 24px; }
.dim-panel .dim-credentialPanel { display: grid; gap: 18px; padding: 20px; }
.dim-panel .dim-credentialTitle { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.dim-panel .dim-credentialForm { min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }
.dim-panel .dim-credentialFormSingle { grid-template-columns: minmax(0, 1fr); }
.dim-panel .dim-credentialField { min-width: 0; display: grid; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 560; }
.dim-panel .dim-credentialField input { width: 100%; min-width: 0; height: 38px; padding: 0 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; transition: border-color .16s ease, box-shadow .16s ease; }
.dim-panel .dim-credentialField input:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.dim-panel .dim-credentialField input::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }
.dim-panel .dim-credentialError, .dim-panel .dim-credentialActions { grid-column: 1 / -1; }
.dim-panel .dim-credentialError { margin: 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.5; }
.dim-panel .dim-credentialActions { margin-top: 0; }
.dim-panel .dim-listSection { display: flex; flex-direction: column; gap: 0; }
.dim-panel .dim-listHeading { min-height: 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0 0 6px; padding: 0; }
.dim-panel .dim-listHeading h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; line-height: normal; font-weight: 650; }
.dim-panel .dim-botList { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
.dim-panel .dim-loadingView { padding: 38px; color: var(--dsw-alias-label-secondary, #646a73); text-align: center; }
.dim-panel .dim-loadingView h3 { margin: 0 0 7px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: normal; font-weight: 650; }
.dim-panel .dim-loadingView p { margin: 0; line-height: 1.6; }
.dim-panel .dim-spinner { width: 24px; height: 24px; margin: 0 auto 13px; border: 3px solid var(--dsw-alias-border-l2, #e6e8eb); border-top-color: #1677ff; border-radius: 50%; animation: dim-spin .8s linear infinite; }
@keyframes dim-spin { to { transform: rotate(360deg); } }
.dim-panel .dim-emptyView { min-height: 230px; display: grid; grid-template-columns: minmax(0, 1fr) 180px; align-items: center; gap: 30px; }
.dim-panel .dim-emptyCopy { min-width: 0; }
.dim-panel .dim-emptyCopy h3 { margin: 8px 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.dim-panel .dim-emptyCopy > p { max-width: 560px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.dim-panel .dim-emptyBrand { width: 110px; height: 110px; display: grid; place-items: center; justify-self: center; border-radius: 28px; box-shadow: 0 18px 45px rgb(22 119 255 / 18%); }
.dim-panel .dim-stateLabel { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 600; }
.dim-panel .dim-stateDot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: none; }
.dim-panel .dim-stateDot[data-tone="success"] { background: var(--dsw-alias-state-success-primary, #20a162); }
.dim-panel .dim-stateDot[data-tone="warning"] { background: var(--dsw-alias-state-warn-primary, #d97706); }
.dim-panel .dim-stateDot[data-tone="error"] { background: var(--dsw-alias-state-error-primary, #d54941); }
.dim-panel .dim-viewActions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.dim-panel .dim-viewActions .bxf-button, .dim-panel .dim-viewActions .dxw-button, .dim-panel .dim-viewActions .ddt-button { min-height: 34px; padding: 0 13px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: none; font: inherit; font-size: 13px; font-weight: 560; line-height: normal; white-space: nowrap; }
.dim-panel .dim-viewActions .bxf-button[data-kind="primary"], .dim-panel .dim-viewActions .dxw-button[data-kind="primary"], .dim-panel .dim-viewActions .ddt-button[data-kind="primary"] { border-color: #1677ff; color: #fff; background: #1677ff; box-shadow: none; }
.dim-panel .dim-viewActions .bxf-button[data-kind="danger"], .dim-panel .dim-viewActions .dxw-button[data-kind="danger"], .dim-panel .dim-viewActions .ddt-button[data-kind="danger"] { color: var(--dsw-alias-state-error-primary, #d54941); }
.dim-panel .dim-qrLayout { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 34px; align-items: start; }
.dim-panel .dim-qrColumn { width: 100%; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.dim-panel .dim-qrFrame { position: relative; width: min(270px, 100%); height: auto; aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; padding: 10px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 16px; background: #fff; }
.dim-panel .dim-qrFrame::before { content: ""; position: absolute; inset: 7px; z-index: 0; border: 1px solid color-mix(in srgb, #1677ff 16%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 12px; pointer-events: none; }
.dim-panel .dim-qrFrame::after { display: none; }
.dim-panel .dim-qrFrame img { position: relative; z-index: 1; width: 100%; height: 100%; display: block; object-fit: contain; }
.dim-panel .dim-qrFallback { position: relative; z-index: 1; display: grid; place-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 1.5; text-align: center; }
.dim-panel .dim-qrExpired { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; padding: 20px; color: var(--dsw-static-neutral-bluish-1000, #0f1115); background: rgb(255 255 255 / 92%); font-size: 15px; line-height: 1.6; font-weight: 650; text-align: center; white-space: pre-line; backdrop-filter: blur(3px); }
.dim-panel .dim-countdown { width: min(270px, 100%); margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.dim-panel .dim-countdownTop { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.dim-panel .dim-countdownTop strong { color: var(--dsw-alias-label-primary, #1f2329); font-weight: 650; }
.dim-panel .dim-progress { height: 4px; overflow: hidden; margin: 0; border-radius: 99px; background: var(--dsw-alias-bg-module-platform, #eef0f3); }
.dim-panel .dim-progress span { display: block; width: var(--bxf-progress, var(--dxw-progress, var(--ddt-progress, 0%))); height: 100%; border-radius: inherit; background: #1677ff; transition: width .25s linear; }
.dim-panel .dim-qrCopy { min-width: 0; overflow-wrap: anywhere; }
.dim-panel .dim-qrCopy h3 { margin: 9px 0 8px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.dim-panel .dim-qrCopy > p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.dim-panel .dim-steps { margin: 18px 0 16px; padding: 0; list-style: none; counter-reset: dim-step; }
.dim-panel .dim-steps li { position: relative; min-height: 28px; display: flex; align-items: center; padding: 5px 0 5px 36px; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.5; counter-increment: dim-step; }
.dim-panel .dim-steps li::before { content: counter(dim-step); position: absolute; left: 0; top: 4px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; color: #4d93f8; background: color-mix(in srgb, #1677ff 16%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; font-weight: 650; }
.dim-panel .dim-specialView { padding: 32px; text-align: center; }
.dim-panel .dim-statusNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
.dim-panel .dim-inlineError { display: flex; align-items: flex-start; flex-direction: column; gap: 10px; padding: 22px; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); }
.dim-panel .dim-inlineError > div { min-width: 0; }
.dim-panel .dim-inlineError h3 { margin: 0; color: inherit; font-size: 17px; line-height: 1.35; font-weight: 650; }
.dim-panel .dim-inlineError p { margin: 7px 0 0; color: inherit; line-height: 1.6; }
.dim-panel .dim-confirm { padding: 18px 24px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.dim-panel .dim-confirm strong, .dim-panel .dim-confirm h4 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; line-height: 1.4; font-weight: 650; }
.dim-panel .dim-confirm p { margin: 7px 0 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.6; }
.dim-panel .dim-cardFooter { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-top: 8px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.dim-panel .dim-cardSummary { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; }
.dim-panel .dim-cardActions { flex: none; display: flex; align-items: center; flex-wrap: nowrap; gap: 8px; margin: 0 0 0 auto; }
.dim-panel .dim-cardActions .dim-cardAction { flex: none; min-height: 34px; padding: 0 13px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; font-weight: 560; line-height: normal; white-space: nowrap; }
.dim-panel .dim-cardActions .dim-cardAction:hover:not(:disabled) { border-color: #aeb3bb; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.dim-panel .dim-cardActions .dim-cardAction[data-kind="danger"] { color: var(--dsw-alias-state-error-primary, #d54941); }
.dim-panel .dim-botCard { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.dim-panel .dim-botCard::before { display: none; }
.dim-panel .dim-botCardBody { position: relative; padding: 14px; }
.dim-panel .dim-botCardTop { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dim-panel .dim-botIdentity { min-width: 0; display: flex; align-items: center; gap: 12px; }
.dim-panel .dim-botAvatar { flex: none; width: 42px; height: 42px; display: grid; place-items: center; overflow: hidden; border-radius: 12px; box-shadow: none; }
.dim-panel .dim-botAvatar svg { width: 29px; height: 29px; }
.dim-panel .dim-botName { min-width: 0; }
.dim-panel .dim-botName h3 { overflow: hidden; margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; font-weight: 650; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.dim-panel .dim-botName p { overflow: hidden; margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font: 12px ui-monospace, SFMono-Regular, monospace; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.dim-panel .dim-botCard .dim-botHealth { flex: none; min-height: 0; display: inline-flex; align-items: center; gap: 7px; padding: 0; border: 0; border-radius: 0; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-size: 12px; font-weight: 400; line-height: normal; white-space: nowrap; }
.dim-panel .dim-botCard .dim-healthDot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #aeb3bb; box-shadow: none; }
.dim-panel .dim-botCard .dim-healthDot[data-tone="success"] { background: var(--dsw-alias-state-success-primary, #20a162); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 14%, transparent); }
.dim-panel .dim-botCard .dim-healthDot[data-tone="warning"] { background: var(--dsw-alias-state-warn-primary, #d97706); }
.dim-panel .dim-botCard .dim-healthDot[data-tone="error"] { background: var(--dsw-alias-state-error-primary, #d54941); }
.dim-panel .dim-botMetrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 8px 0; }
.dim-panel .dim-botMetric { min-width: 0; padding: 8px; border: 0; border-radius: 9px; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.dim-panel .dim-botMetric dt { margin: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 400; line-height: normal; }
.dim-panel .dim-botMetric dd { overflow: hidden; margin: 5px 0 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 400; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.dim-panel .dim-botCard .dim-cardFooter { margin-top: 0; }
.dim-panel .ddt-headingCopy { display: none; }
.dim-panel .ddt-qrFrame, .dim-panel .ddt-countdown { width: min(270px, 100%); }
@container (max-width: 680px) {
  .dim-panel .bxf-headingTools, .dim-panel .dxw-tools, .dim-panel .ddt-tools { gap: 6px; }
  .dim-panel .dim-bindActions { gap: 6px; }
  .dim-panel .bxf-headingTools .dim-scanButton, .dim-panel .dxw-tools .dim-scanButton, .dim-panel .ddt-tools .dim-scanButton, .dim-panel .dim-credentialButton { gap: 5px; padding-inline: 8px; font-size: 12px; }
  .dim-panel .dim-actionIcon { width: 13px; height: 13px; flex-basis: 13px; }
  .dim-panel .bxf-headingTools .dim-onlineBadge, .dim-panel .dxw-tools .dim-onlineBadge, .dim-panel .ddt-tools .dim-onlineBadge { padding-inline: 8px; font-size: 11px; }
  .dim-panel .dim-credentialForm { grid-template-columns: minmax(0, 1fr); }
  .dim-panel .dim-credentialError, .dim-panel .dim-credentialActions { grid-column: auto; }
  .dim-panel .dim-emptyView { min-height: 0; grid-template-columns: minmax(0, 1fr); }
  .dim-panel .dim-emptyBrand { display: none; }
  .dim-panel .dim-qrLayout { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 24px; }
  .dim-panel .dim-qrColumn { width: 100%; min-width: 0; }
  .dim-panel .dim-qrCopy { width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .dim-panel .ddt-qrLayout { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 24px; }
  .dim-panel .ddt-qrColumn { width: 100%; min-width: 0; }
  .dim-panel .ddt-qrCopy { width: 100%; min-width: 0; overflow-wrap: anywhere; }
}
@media (max-width: 840px) {
  .dim-title { align-items: flex-start; }
  .dim-layout { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .dim-rail { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dim-divider { display: none; }
  .dim-rail { max-height: none; overflow: visible; padding-right: 1px; }
  .dim-channel { min-height: 48px; }
}
@media (max-width: 720px) {
  .dim-panel .dim-botCardTop { flex-direction: column; align-items: stretch; }
}
@media (max-width: 560px) {
  .dim-title { flex-direction: column; gap: 10px; }
  .dim-title p { white-space: normal; }
  .dim-githubTooltip { right: auto; left: 0; }
  .dim-rail { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .dim-page * { transition-duration: .01ms !important; }
}
`;
function installImStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector(`style[data-plugin-css="${IM_STYLE_ID}"]`);
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@xmanrui/dsh-im";
  style.dataset.pluginCss = IM_STYLE_ID;
  style.textContent = CSS10;
  document.head.appendChild(style);
  return () => style.remove();
}

// plugin-src/client/index.js
var name = "im-settings";
var inject = ["slots", "connection", "locale"];
var IM_PLUGIN_LOGO_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAc3ElEQVR42u2de5RdVZ3nP799zn3VuyoVkkACSSrvgOQBRE3CcwRF8dXaS3yuNc3Io9U1PSM67dg9djut0KvXqKOtznKWPXTboiO2gIiggiQREEgCeb8TCASoPCv1uFX33nP2b/4459577q37qtwK9sxksypF3Xvuvvv83r/v77f3gXPj3Dg3zo1z49w4N86N/x+HTMYk69c/zYzzp5PL5kjE46gqGk6uEv7W4pcpSuGC/GuqCIIWXyksUaLX2WAiCV9U1ZL/BwmmLfyjhem0bE4N/yzOH309P68E86qiKJlsFsdxGRsdZsWK5U3Tzm3mw7t27cN1JViwKosXz2fv3kOdoNOAboEEEpAgSu/ghoI7l5AhlRkQvKI1GQAiWiQUWpkBFAlbYGpxGSEjgnuJMkZQrGoO1VPW2qMHXzp8asn8Beq2dqCq7Nyxm6UXL35jNWDrlq2kWtoK0ud5XrcxZq2IuSEWc1e6rjvLGGmryuBy0SuRzgoLLBXkPNVDgmlEs8puKjJ/ueZJYVKpSoU8k621vrU2bX37qm/tZs/zH7a+XZdIxE94vofjOAwOnmT58hVnnwHbtu9g+rSZnDp1HGv9FmOc97mue2s8HrsikYgnYrEYxkhh8WdrhDx4w4aqYq3iez5jmUwuk8lu9jzvu9b3f+K6sZF5S+ewZ9sBFi7sO3sM2LZtN77v0dragud5C2Ju7MupVOK9qZZUPBarYs10sjzNv67heT6j6dHc6FjmQS/n/aXjODsViyDMmz938hmwe/c+stkcra0t5HLeW2Ix91vtba0rkqnkpEjiZEh01CG/MWoBY5ksIyPp7blc7lNGzDrf9wBhQYOaYBq5aMvW7STjKeKxONlMdnU8Hruns7N9RaqlMvFVJ34jcgYMq2azJ0MYGhXfZCpBR0fbxfF4/PtW7dWOG+MrX7+bLVt2TJ4G7Nt7AFWwqn2xmPvjzs72lYlEvBY9J6ZeEzBTk2n7q81VCGel8aXlch6Dg8Pbc9nsH4sxu0SEvr7ZzWvArp17UBSrfsp1nb9qa2utSfw84SdEI6nNyFIpb+CiBiarxUiRSO6hjalELObS1pq62HHdv/Y8v9X6ll279jTPABOLoyqAvC+RiH8glUpUkZgKVDUOuC44Tv0f1wXHLV4f5gh16SkNMkPK16v16ZpnUoMql0gmSCYT7zFGPmgch0ULFzRngp5++hm6u6fgW787EYs/2N3TuSYej9WWLgGMgWwWc+gQsmsXHD8O1ha/rpBuRvKBUNe1owMWLUIXLoRUCvX9s+I883nHZDttz/M4dWrwmUwm+y7HMcfTI2mWLb/kzDLhqb3T8K2PEXNtIhG/omqoSSSjNAbZvx/3nnuQ9RvQk6fAemVMKuIAhVwpb2xFoL0dXbMGe9ttaN88sJPMhEIiNvn5hOu6JBKJFbmcd62I+d8tLS1nboKyuSwnjh4X13FuTKYS8arSIkXim40bcT97J/Iv/wInjiNYxBhwDBgJGGSk8LeKoPn385owOIj8/CGcP/8CZv++QKMmLuQN+YezEbUmErGY45ibBk8PGM/zzpwBjuPQPaVnius6l9WS/vydyMsv49x1N7JnT0C0PEGjnFIbmBXfLzVL0dBJJPAD27bifPvbSDo9YUpJLQOrk2DFtLpvdl0X13FWtrS0nee6bpNgnDDLcZ2Zpo4UKuD87H7YuRN1DFEIRwDRMFGaORPzb65DEwl03QZ0z57KVBECJ77hd8i2beiaNQHTyilQixJnEQOuxWBjDI7rni8mOwuR15tggILqdGNMW01nJYIMnEY2/K5ozFVDXFILaKlMnYrz1a8ga9YGn/ujD+B95jPort2BeSpDLxFgZATz4x8jr70WaIzjQDKF9nSj06bB1KloKhVoiLU1mCGTI/pEUNQaZs0YaRGY1jwcLbSLiDs+U4yk/SIwMADHjuXjtvHiZi2ybBmy6s1gwwho/nzk6mvQnbuK1rAEwdSAMY/+CvOrXxXfMwbicejqhosuwi67FF29Gl20CG1pqcIInTwjL/WVyBhxgc56ltNtgNvxSsweF6ULAbEkImtll+jYGHh+EOvn3xwdLQu6S4P8wI1oxOwA6iOjo5BOwyuvYJ56EvnhD9GVK7Hvfz/2rW9FE4nQx7xxuFDp/QqAU4/vpj6rxRvnSqWYIKoG0k13Nzp9eqFyNC4vdgxs2YL+4iHIZMDz0PXr0cceC96LErgsnVbyzI2U13wf1IIRxHGCyOmxx3A+/3ncL/0V5uDBwFxVkNVmdaFa3nkmgJJbO7ARRIhHsxUti+8KlamODrjySnjhhVLKSTHZ0qEhvC9/GfPLX4Lros8/jx4/TkneXw4ZdHbCLbfgT+0FPzQtw8PIkSPI7j3I/n1w4kTAF8eBdBp54H6c3bvgP34Wu2Y12LI1N2uBZHz+MO7vyE9zJqhsuSW11Mh7IoJ997th3TrMli1gTAn9C+Hl0BD2sceKtnyc2QkvD1XMvuMd+B/7GMRixbtUAulPp+GllzC/fQLz8C+QQ4cCRjsO7N6D88UvIl/4c+z110cSb51869PElKaBKMhWg31VIt9sLXrB+ehttwaOUDWs8GqpSBCajAjeIyUcUERtED1dcw3+n9wSMMrzArPjeeB7gdlLpWDxEuwdt+P9/bfxb/4wJJNhtGTgaD/mq1/FrF8fJIOTSPC8IOZLouXOVkQQpK62ufXVTSb0Oq8cQTKZ0lhdxidb4zC08EbUjaHTp2Pf+U78j3wYenurO1NV0DA3uOhC7OfuhAXzcb7x32HgVJBH9B/F3HU32tsLS5eivm3aE0SDv5oGTepjTW5d8yPqR6251FrVyZOYh38BnhdISEcn9u03oH19QRha0koSWXxehx0H7e1FFy3CzpoVSG0V4o9bi7XgxrAf/CDEE5i77kKGhgJNePEQ5utfx7/77iB01QlGR2dQVi1odjMMCFo3ZITAjZloW0k5Z9UYzKbnkW07ECPomy7F3vpJ/NWr0Xi8eudCFcmWmklVtc8rqGBvugk5dgz51rcCIM9xkKefxvzzD7F33F5IEM9m5lwMw7UJDQiCEkegRg0g32OjaDKBzpuLfctb8T/6UTh/Bvg+EoEQzn7FNkje/Jtvht27MY/8MvAhVjE/uheWL8MvhzWayYbrFS206Sgo6h7zwYwUGCBRE7DqCrzvfQ86O4Nky/cnpStiwlOoQlsr/u23I3v3IgcPBEw4dQr55jcxF12EnTmrCszdoHY0cFkjOmbqTaBKC+CM52jY+yPRvM+Bnp7A+eVtt0yOUE/YZVqLzuvDv/VWNBVEZRiDbNuG+drXkdMDIcx9pjXO+gCtkfqYhanrSESzoQ8owAL50KuiiVZlsmJtbUDgalYhraLXXx845iJIg/n1r3C+8Y3ASU9ieFqZhtJEHhBUjlTKEo6i5GuVejAYBFccHDGYCfy44uBgSpRHpLoyST0Wxlzsv7sFvfKqIJMOb8Tcdx/O396NHDtaFbKYmNU7M6GrG4Yq2qIho/Kho9bIBfIcfyl3jGfTe9gz9ioj/ij5Jt1CD5CMTyWNGKbFeljVsoBlqbkkxMVWkfGG/YIq9PTgf+5OnNODyPObgkxZFbn/AdwjR7C33Y5duRJ13RBJJWyvBGtLa8e2BsBXHh02DUWoWrQSa6vUUQ3CoB3lnhO/4X+depyD2X6yfq6yvOaziig8oMGNTnHbeXfnKu6c9n4ujPVWZIJM1B/Mno3/pf+C89d/jWzeVDQ9zzyL2bsPueEG7E03wfz5ZGIxDr/Sz96Dhzl2/BS+tXR1tDHnoguYN3smHe0tBcZUS0ylQRa49S2YelGB0xpXDvgjfPG1H/CDk0/g4WMwOOKWpXEVii4lixVOesN8//iveTl7nL+fdRsXxKdg6yZPdcISa9H58/G/8jeYr30N85vfoNYPkr2BAcy992IeeYTdq9bw4KwFvHDgMENDI8H3hoKRTMaZe9FM3nHdat688mJc16loekSkFC1upiKmkZZ9VS3hbZTnFuW7xx/hn04+gaKYMHAqXpj/nMXmM2FVjJhxTT6C4IjDb4a28s0TD/Nfp3848AtS2/PWTbCsj501C/3Sl9BFizA/vBf6+4PmAOOwLtnFP74+Qv/xHZiw/d2RopvMZnPs3HOAgy8d4cWXX+UDN11HMhGP7HcY7w+kWR8gMJbPhPNIZAERzReoMOzKvMw/nno8JK5UrLGoQl9qBu/regttToKHBp5l08h+Sqs4Rc8rAj89+RQfaH8LS1pm4lsdl0sL4IghJi4uDkZM2MmnFfcciLXQ3o695Rb0zW/B+dG9mPXreTbezv+cuZABcWpWUYwxZDIZHvjlE8RiMT5w07VBuEml+pQ0B0WE3Gwr5gFa3BQhpVD00yN7OJI9GaKAFJqftLAVwnJ+opfvzf00V3VcAgIfmnoVN++9m83pg5iSgEwL7D/qDXDHK9+hx20NKpmhNkm4DcqIkDRxup02ZsZ7mZeYwZLkLObGp9HttOGKgw2jtZLKGoJe+ib8xYs48exGfvxPDzIwlsNEiG+txRiDiOD7flgfkcLfD/96A0sWzOZNi+dV9FPavAZU0aJyHEiVg5nX8VRxpRRcltD+W7W8uXUhb+1YXMgl5icv4MYpl7F59CCiUoS3NbJzRpVdoy+jEpqYEmXRCOgSvBIzLh1OC3Pi57GqZT5XtV3MxamLOM/tJCGxiEkRxILEE/w+Z9if9UtEwIiwYtkSVq9aTiqZYPuu/ax7ahPDI+kCE04PDvP4ho0sXjAHpyyfaDRKqwvGiZAtd8JSOWMrOFod17gZmC4PG9jHSGda2s8WTJColGykK8Gz8uqslbF3EEwYIg/4I2xKH2Bjej/fP/EY58d6mJuYxqz4FKY47SRNDDGCjyWb8ejf+CrW84OGsVCgrlx9GXf82z+mo70NgKtXX0bfnFn8j3vuI5vNheZI2LP/RU4NDDJ1Svc4h2xVMdokGAelRflKiKhB6ItNw1UpCK+Mw8ccnhrcyUMDz/Hu7isQhCeHd/HAqeeCVE8oMAGJ4k6GGW43LbFkyLy8XQ1CDIuSsTlGdIwRmyFrPVQUg2AwZNXjUPYoBzKvh65MIn7JkkzHWdV/PqlC5KK0t7XynndcTUd7WyHuFxGuXXM565/axOZtu3FC03R6cJjjJwY4r7fnjJIxt4HITsZVwsqDC1XWti1hduI8DmRfx5FiZlmoGCEc9wb504Pf5r7ODbjGYd3pHbySPRFEQsXKTIH4FuWC2BT+4cJPMzt+HhZbKU4jozkG/BFeyZ5g+9hLbErvZ8foYfq90+TUK2iH4JRuDBSHmI3h5ExB8xRob2sZJ9GqSjKZYPq0XthafN3zfUbHMrVq6s0kYpRsX9TxYHcYglr6EjO4vfdG/uK1H5ANb7rEOktAhqO5Qe49vgFQTPifRrlMhAkqfKTnKla1LggjjUh5M7rPNJTqy1vm8x5dRdpmOJw9xqb0fp5J72H76GFe9U4yZMfI2lwQ24sgRkhKDHEl4vhheCTNiZOn6Y0wQUQYy2TpP3qixAa6jkMymThjCKN+QUZkGPABN2qHxmub8vGea9k+9hL3nPotRiOTlMTFAUZU4kO1tICRT34+2LWaO3rfHmhDeSJWsoBSuDRpYixKzmRxchY391zJaT/NCX+IE94Qg346FBCIYWiXJI9u/B0vHN2NkcCsDA6N8OCj67j9/PNoa20pRETrn9rErn2HyLdpqiqdHW309nRVKp0XNL/ZKEgbQenzF53yRwrybCUC1qmWxvtaJGRBQxQcHGbFerm5+0rumHojU5y2qnhQTfShYK6ELqeVbqeN+YkZhUK5MTCaE7b1G0ZSQ4jZV9QCEX77u+cYGh5hTT4K2r2fxzc8y9hYJoILKYsXzKGnq6Nixtt8W0oQBrYX8oCo8ElpRuxg2Di6n3UjOxAFH8tMdwrv7XozU5z2wibpkvBRiOyOVxwxzIj1sDLVx/zEDIyYhohfO+RTCpZUgxLxYEZ44oDh3q0OGw45ZEYuZWXqGVKjL6JhMGqt5fcbt/Lc8zvym9EL4WdU+q9ZczmxmDMOG4oQsEkNENFq+Hz0t4/lwcFnOOUNEifO9V0r+OzU97Ay2VeMvUVq9+aE7+fhCm1Q8huJt40ELakbDjl880mHx/c7pLMS4LzSw4GOt7Mw+8843nAxujMmSOBUiXaHqyqO4/Cu669k8YLZVYgfCFdzXREiiGpWysqfWkXsLoxPZXlLHx/tvoabu9bS5bTiY/Hz5kAnYOwmsXhsBAZGhe/+3uG7v49xbCg0hSb8TmsZbr+YrunvwX3x55w4dbqABY3H9CzJZIJ3vW0tN92wtiIMEdU9bQYNVVWsalxrJWGR8cmeG/hI11X0OO0FrTgLJfcJ8cYIHDop/MWjMR7Y6QaV0gLh4cIey02Lfd69xLJ02jJeeamTnz+6nh17DpBOj0bqAZBIxJlz4UxufFuAhsYctyaBpYGVNtKYlQ4zGKfMUoybPi4uiby9P2slvsaZ4Ahs7xf+/QNxnnrRKaLhFnrblA8v9/j4Sp+FUy1O0DhB9+I+5s2ZycGXjrD3wGGOnTiFWqWrs52+2TOZ3zeLzrbWuiYyv7uyKRMU3qwfhV6I1idFqri8CJRRCUMqQKmV24xtHcfVEPENbHlV+PQDcTYedkqg7LVzfb5wncfq2T6uCSqVxWqlJRGPsXThXJYunBv6gLBCFobDtoGMVwsFgSYYEIBmtoCGRqHlWpwVCVQ/nRNOpyFri2lZHh/VKOgW+ZWKQVcKYgZ8PTNT5BjY9IrhMw/EeP5lp1D5dg18bKXHF6/LcX6H4pUQvlRGykuP1RxtrbWU5bFnpgEiRdOjVbCgcpvbPyQ8sM3h0T0OLx4XMo32QKnSnoBlM5UPrfRZPcfHMdUjufIbz2vc4/sd7vx5jF39pqBoMVf59BqPz1+doy0Onq0J8DYk4bWaBYpgZlMaIGi0BTqaS1Uh/saXDf/55zGeetEptnVKHVuipb+3vgq/2OXwZ1d73LE6R9wZb6ykDHMxooxkhR9udrjrCZfXBorEj8eUP7vS486rciRj4Q6pJqKAqlalzCwL0mxnnAKM5p1wlOZSgfi7+4VP3Rdn2ysGMWU+ILrjpWyTfKVJTwwLf/Nrl55W+MRluSqnowSO1rOw+YjhW0+6/Gy7QyZXzLgTMeWzV3v8hytzJNzmevkhKoDVPG9pFNlURSzcDZMErdu9lPXhm+tdth0JiF9RrTWQvo6E4gADGQoVs0raNJoVvvOky/ULfGZ12ZKNLp4NYvsd/Yb7dzjcv83w2mlTUvfvbFH+07U5bl3lEZ8M4k9UWVSRZjLhsNDh1etMNwL7jgqP7HIqS3VE2j+0QrltrZB0lZ9shu+sV0Z9GV9wCMP1Pf3CN37ncMkMgwVyFk6lhYMnhO39wp6jhqGxUNVNAQiib6rlL9+W471LfRw5O8SvFw5PwhYlbajIYAR2vW44PiyB9FeIMK3CipnK3/2RcEFXQOlLLoAXj1t++oKQB0jLs2HPwrc2uAUsVss3X0V3xVpIJJR3LvK58yqPN82wWOWsZCV1ovFJKsg0GnaHqb5nQwZoBXhBYeE0YXp7sW+3JQGXzhJ+uqWKWGlxAdZqabwaRVUtJOLKZTMtf3KFxzsX+7TFxzvbs3J8XQ1f0HxNOACTbG0OB5ToaVVco/hhI9G4zwjsPaocHRJmdAUvpTOw6eUyEZLxDi9oRzGRMEwRR2hNKBd0KFfMsty42GftHEt3KmhJ8bWCb5nIyVzhP/WkW6o7z4bAiPolSUtsXMGqbKlW4eIZlhkdyssDlctwIvDCEeFz9yu3r4WEK9y7UfnVHlP9JsP4/UPLLDO6PNQKxihtcZjeoczpCX7Oa1NiYUd8YHJk3B60eucujeNN1ePMShXxDAopE4uClGJxq2rxw0Jfr/LB5T7/7XFTcWUSXveDZ4WHtisGZWC0tlBaCytnWe56V47eVq3Yrm5DyN2zBBGHSMOHaNWtBk7g9TOFDk0DPMyDcTXvxhi4Y63HDUv8qpfmTzM4nRZOpqVqCKoabF45r91y57UePS1F2CD/k/9btbo3VBo/v+4PdbSpacAHZAoMkNrackGn8vHLPeJuMfTQMPaP/uRLkOPeC6VeLczptfzde3Nct8BvOHPVsiMl8gUp/UNQNn/gdzN5QNgnk6LB80XHcsojOw2ZnBROj+lIKe0JHbeprVJhzBjobQ3Qyo9e7rF0hjYcvxcO3q5ke1QD6EQn6AcmIU9o+qgChSRlNeGquUC/w6/3OuEGB7hmgc9nrspxUU+ekLW7lx0jdCaV7hYtlBAnard1XAIY8QvSvBmaSNzfSA5VHw2FHPnu6DoM2Pm60D8kXNBluX2NxydW+UxpteGxl424RC10UVudmFRqGaZc7EeSybXvUlrOEKmpTbYpBoS3M6iKTxgNVbsZX2Ftn+Wum3Ksmm257MKgt8fzpalMsRwEqbaGYhOfFhDLOsQ5c7vSmCx5Ysxg8wc2wevW+sMaPJChthPuUj59lVciwTIZEhc1ETWoJ/kOaqWkV+vsnOddKv7lxULf+qOq2q/aRBiq1mJ9/+VczjtifVvX2QRfXGq7J+PgsJJQUmrPJXXi9qrFHa2fTWktHYpepxbf819VtYfr3XFNBvjqc3r41DHf95/zcl5jBKqXuGjTClHx/6MEFKlQj46+N5EEqwwlye8ULZ8n+nnP8/F9u2l4JH3U8/wzZ4DruEzpPk+t1YczmWxOJwHTfSOP9/9DZVeZTNbzrf9Qd2en78ScM2dAOj0c9OD79vFsNvtcPW6+0XkOWpmxFY8LE5k0jtQSIs/zGRvLPO97/mO+9cmOppuTkQP7DwZZqtUPt7W2fL+9ozXxRjylourZ/g0sXCv6Amk4Nq8WYzUSIA0PjWSHR9KfjDnuPbPnzKpblK+b4eY8xVqL73k/Gx0bu2+symaESZHoRq2KatVsU6tgD6rKmZvQxj6XGcswOjp2v1r7E8/32LFj1+RYyb17DwY9QtbOjcfjP+rsbL+84jH2f0BzFFYhCvtr5AwPWTrTGkIum2NwaGRTJpO92XHMPhFDX99FzYFxhcmHhnBMDMdxDnqe96nBweGdmUx2sgKbScVdhDNP/OQMRTSbzTE4NLwzm8n+qQj7AAYHhyY3Tti9Zx/W5oi5KXzfWxGPxb7W2tpyZSqVLOwu/H911HrWzNhYhpGR9NO5rPcZY2Sj1aCtfd682ZMfqO3evZdMZpRUqg3r2xmO69yZTCY+kUole2Ixl9IT1uVfiW5M/rBWyeVyjI6Onc5ksj/wff9vjZjDnvVwjMOCBX3NaV2tsWPHbhKJJNb3GcuNmmQstdY45hbXda9NJOLn5xlhTDTsq9f43+jGgFr9cVqF8ZX6qZXG+6y1CC/4PrmcRzabezWX8x73fO8fxkaz61pbkr7jOIxlR1myeNHZT1U2P7+VtrZW1Focx2VkJO3GYrH5ruOsNo65TOBCMaZdKsRglU6rrBhna/nREdUR1dIsuHpBsmBKdPwTVfIPAy0/jjg0NVZVh6y1h33fblbVJ33r743H4p4NH0Lh+xmWLl3yxuaKm57bQkdXB77vhf2Zhnnz5/DC81vjxjgx45hCHaCQwqOFzrnKQFWRCOFmSfJdV2LGbX4tnF6bJ370HDu1waMFAwhZUY1s0s6f7Cv5R9ia4AuliKv6YUirVrHq55YtuyS7b9+L4XVgHIf08BBvuvSSP3yy/txz20mlLL7v4DgS7FN3THSTcPiFihR67cuXUeHBPvknHokUDy6t+JjaqAYIIsHDN/MaV3aiTJm0S/GiSMeDVVs4phqUXC6LY2J4fobly5dxbpwb58a5cW6cG+fGuXFunBvnxrlxbvxfOP4PkGeTnhleaTYAAAAASUVORK5CYII=";
var CHANNELS = Object.freeze([
  { id: "weixin", label: "\u5FAE\u4FE1" },
  { id: "feishu", label: "\u98DE\u4E66" },
  { id: "dingtalk", label: "\u9489\u9489" },
  { id: "wecom", label: "\u4F01\u4E1A\u5FAE\u4FE1" },
  { id: "qq", label: "QQ" },
  { id: "slack", label: "Slack" },
  { id: "telegram", label: "Telegram" },
  { id: "discord", label: "Discord" },
  { id: "whatsapp", label: "WhatsApp" }
]);
function WeixinLogo() {
  return h2(
    "span",
    { className: "dim-logo dim-logoWeixin", "aria-hidden": "true" },
    h2(WeixinLogoGlyph)
  );
}
function FeishuLogo() {
  return h2(
    "span",
    { className: "dim-logo dim-logoFeishu", "aria-hidden": "true" },
    h2(FeishuLogoGlyph)
  );
}
function DingtalkLogo() {
  return h2(
    "span",
    { className: "dim-logo dim-logoDingtalk", "aria-hidden": "true" },
    h2(DingtalkLogoGlyph)
  );
}
function QqLogo() {
  return h2("span", { className: "dim-logo dim-logoQq", "aria-hidden": "true" }, h2(QqLogoGlyph));
}
function WecomLogo() {
  return h2("span", { className: "dim-logo dim-logoWecom", "aria-hidden": "true" }, h2(WecomLogoGlyph));
}
function TelegramLogo() {
  return h2(
    "span",
    { className: "dim-logo dim-logoTelegram", "aria-hidden": "true" },
    h2(TelegramLogoGlyph)
  );
}
function SlackLogo() {
  return h2(
    "span",
    { className: "dim-logo dim-logoSlack", "aria-hidden": "true" },
    h2(SlackLogoGlyph)
  );
}
function DiscordLogo() {
  return h2(
    "span",
    { className: "dim-logo dim-logoDiscord", "aria-hidden": "true" },
    h2(DiscordLogoGlyph)
  );
}
function WhatsappLogo() {
  return h2(
    "span",
    { className: "dim-logo dim-logoWhatsapp", "aria-hidden": "true" },
    h2(WhatsappLogoGlyph)
  );
}
function ChannelLogo({ channel: channel4 }) {
  if (channel4 === "weixin") return h2(WeixinLogo);
  if (channel4 === "feishu") return h2(FeishuLogo);
  if (channel4 === "dingtalk") return h2(DingtalkLogo);
  if (channel4 === "wecom") return h2(WecomLogo);
  if (channel4 === "qq") return h2(QqLogo);
  if (channel4 === "slack") return h2(SlackLogo);
  if (channel4 === "telegram") return h2(TelegramLogo);
  if (channel4 === "discord") return h2(DiscordLogo);
  return h2(WhatsappLogo);
}
function IMSettingsTab({
  dingtalkRpcCall,
  discordRpcCall,
  feishuRpcCall,
  qqRpcCall,
  slackRpcCall,
  telegramRpcCall,
  wecomRpcCall,
  weixinRpcCall,
  whatsappRpcCall
}) {
  const [selected, setSelected] = React13.useState("weixin");
  const githubTooltipId = React13.useId();
  const active = CHANNELS.find((channel4) => channel4.id === selected) ?? CHANNELS[0];
  return h2(
    "section",
    { className: "dim-page", "aria-label": "IM\u673A\u5668\u4EBA\u8BBE\u7F6E" },
    h2(
      "header",
      { className: "dim-title" },
      h2(
        "div",
        { className: "dim-brand" },
        h2("img", {
          className: "dim-brandLogo",
          src: IM_PLUGIN_LOGO_URL,
          alt: "dsh-im",
          width: 48,
          height: 48
        }),
        h2("p", null, "\u8BA9\u804A\u5929\u673A\u5668\u4EBA\u8F7B\u677E\u63A5\u5165 DeepSeek Harness")
      ),
      h2(
        "span",
        { className: "dim-githubAction" },
        h2(
          "a",
          {
            className: "dim-githubLink",
            href: "https://github.com/xmanrui/dsh-im",
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": "dsh-im GitHub",
            "aria-describedby": githubTooltipId
          },
          h2("span", null, "GitHub"),
          h2("span", { className: "dim-githubArrow", "aria-hidden": "true" }, "\u2197")
        ),
        h2("span", {
          id: githubTooltipId,
          className: "dim-githubTooltip",
          role: "tooltip"
        }, "\u5E2E\u52A9\u4E0E\u53CD\u9988 \xB7 \u524D\u5F80 GitHub")
      )
    ),
    h2(
      "div",
      { className: "dim-layout" },
      h2(
        "nav",
        { className: "dim-rail", role: "tablist", "aria-label": "IM \u6E20\u9053" },
        CHANNELS.map((channel4) => h2(
          "button",
          {
            key: channel4.id,
            type: "button",
            role: "tab",
            id: `dim-tab-${channel4.id}`,
            className: "dim-channel",
            "aria-selected": channel4.id === active.id,
            "aria-controls": `dim-panel-${channel4.id}`,
            onClick: () => setSelected(channel4.id)
          },
          h2(ChannelLogo, { channel: channel4.id }),
          h2(
            "span",
            { className: "dim-channelCopy" },
            h2("strong", null, channel4.label)
          )
        ))
      ),
      h2("div", { className: "dim-divider", "aria-hidden": "true" }),
      h2("main", {
        className: "dim-panel",
        role: "tabpanel",
        id: `dim-panel-${active.id}`,
        "aria-labelledby": `dim-tab-${active.id}`
      }, active.id === "weixin" ? h2(WeixinSettingsTab, { rpcCall: weixinRpcCall }) : active.id === "feishu" ? h2(FeishuSettingsTab, { rpcCall: feishuRpcCall }) : active.id === "dingtalk" ? h2(DingtalkSettingsTab, { rpcCall: dingtalkRpcCall }) : active.id === "wecom" ? h2(WecomSettingsTab, { rpcCall: wecomRpcCall }) : active.id === "qq" ? h2(QqSettingsTab, { rpcCall: qqRpcCall }) : active.id === "slack" ? h2(SlackSettingsTab, { rpcCall: slackRpcCall }) : active.id === "telegram" ? h2(TelegramSettingsTab, { rpcCall: telegramRpcCall }) : active.id === "discord" ? h2(DiscordSettingsTab, { rpcCall: discordRpcCall }) : h2(WhatsappSettingsTab, { rpcCall: whatsappRpcCall }))
    )
  );
}
function apply(ctx) {
  ctx.effect(
    () => ctx.locale.register(IM_LOCALE_NAMESPACE, { zh, en }),
    "im-settings: bilingual dictionaries"
  );
  const t = ctx.locale.bind(IM_LOCALE_NAMESPACE);
  setImTranslator(t);
  ctx.effect(() => {
    const disposers = [
      installFeishuStyles(),
      installWeixinStyles(),
      installWecomStyles(),
      installQqStyles(),
      installSlackStyles(),
      installTelegramStyles(),
      installDiscordStyles(),
      installWhatsappStyles(),
      installImStyles()
    ];
    return () => {
      for (const dispose of disposers.reverse()) dispose();
    };
  }, "im-settings: install combined channel styles");
  const feishuRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(FEISHU_RPC_CHANNEL, endpoint, payload, signal);
  const weixinRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(WEIXIN_RPC_CHANNEL, endpoint, payload, signal);
  const dingtalkRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(DINGTALK_RPC_CHANNEL, endpoint, payload, signal);
  const qqRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(QQ_RPC_CHANNEL, endpoint, payload, signal);
  const wecomRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(WECOM_RPC_CHANNEL, endpoint, payload, signal);
  const telegramRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(TELEGRAM_RPC_CHANNEL, endpoint, payload, signal);
  const discordRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(DISCORD_RPC_CHANNEL, endpoint, payload, signal);
  const whatsappRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(WHATSAPP_RPC_CHANNEL, endpoint, payload, signal);
  const slackRpcCall = (endpoint, payload, signal) => ctx.connection.rpc.call(SLACK_RPC_CHANNEL, endpoint, payload, signal);
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "im",
    order: 20,
    label: () => t("IM\u673A\u5668\u4EBA"),
    locale: IM_LOCALE_NAMESPACE,
    inject: () => ({
      dingtalkRpcCall,
      discordRpcCall,
      feishuRpcCall,
      qqRpcCall,
      slackRpcCall,
      telegramRpcCall,
      wecomRpcCall,
      weixinRpcCall,
      whatsappRpcCall
    })
  }, IMSettingsTab));
}

    return module.exports;
  }
});
