import {
  areJidsSameUser,
  normalizeMessageContent,
} from '@whiskeysockets/baileys';

import { splitMessageText } from '../shared/editable-message-stream.mjs';
import { createWhatsappBridgeStatus, WhatsappHarnessBridge } from './whatsapp-bridge.mjs';
import { createWhatsappWebSession } from './whatsapp-web-session.mjs';

function messageContext(content) {
  return content?.extendedTextMessage?.contextInfo
    ?? content?.imageMessage?.contextInfo
    ?? content?.videoMessage?.contextInfo
    ?? content?.documentMessage?.contextInfo
    ?? null;
}

function messageText(content) {
  return content?.conversation
    ?? content?.extendedTextMessage?.text
    ?? content?.imageMessage?.caption
    ?? content?.videoMessage?.caption
    ?? content?.documentMessage?.caption
    ?? '';
}

export function normalizeWhatsappMessage(message, accountJid) {
  const remoteJid = typeof message?.key?.remoteJid === 'string' ? message.key.remoteJid : '';
  const alternateRemoteJid = typeof message?.key?.remoteJidAlt === 'string'
    ? message.key.remoteJidAlt : '';
  const messageId = typeof message?.key?.id === 'string' ? message.key.id : '';
  if (!remoteJid || !messageId || remoteJid === 'status@broadcast'
    || remoteJid.endsWith('@newsletter')) return null;
  const group = remoteJid.endsWith('@g.us');
  const fromMe = message.key.fromMe === true;
  const selfChat = fromMe && !group
    && [remoteJid, alternateRemoteJid].some((jid) => jid && areJidsSameUser(jid, accountJid));
  if (fromMe && !selfChat) return null;
  const senderJid = selfChat ? accountJid : group ? message.key.participant : remoteJid;
  if (typeof senderJid !== 'string' || !senderJid) return null;
  const content = normalizeMessageContent(message.message);
  const context = messageContext(content);
  const mentioned = Array.isArray(context?.mentionedJid)
    && context.mentionedJid.some((jid) => areJidsSameUser(jid, accountJid));
  const replyToSelf = typeof context?.participant === 'string'
    && areJidsSameUser(context.participant, accountJid);
  return {
    messageId: `${remoteJid}:${messageId}`,
    providerMessageId: messageId,
    senderId: senderJid,
    senderIsBot: false,
    kind: group ? 'group' : 'direct',
    conversationId: remoteJid,
    content: messageText(content),
    addressed: !group || mentioned || replyToSelf,
    selfChat,
    replyTarget: { jid: remoteJid, quoted: message, selfChat },
  };
}

class RecentWhatsappOutboundIds {
  #ids = new Map();

  has(id) {
    this.#purge();
    return this.#ids.has(id);
  }

  remember(id) {
    if (typeof id !== 'string' || !id) return;
    this.#purge();
    this.#ids.set(id, Date.now() + 5 * 60_000);
    while (this.#ids.size > 256) this.#ids.delete(this.#ids.keys().next().value);
  }

  #purge() {
    const now = Date.now();
    for (const [id, expiresAt] of this.#ids) {
      if (expiresAt > now) continue;
      this.#ids.delete(id);
    }
  }
}

class WhatsappBotClient {
  #socket;
  #outboundIds;
  #typingTimers = new Map();

  constructor(socket, outboundIds) {
    this.#socket = socket;
    this.#outboundIds = outboundIds;
  }

  async sendText(target, text) {
    await this.#stopTyping(target.jid);
    let result = null;
    for (const [index, chunk] of splitMessageText(text, 4_000).entries()) {
      result = await this.#socket.sendMessage(
        target.jid,
        { text: chunk },
        index === 0 && target.quoted ? { quoted: target.quoted } : undefined,
      );
      this.#outboundIds.remember(result?.key?.id);
    }
    return result;
  }

  async sendTyping(target) {
    if (!target.selfChat && target.quoted?.key) {
      await this.#socket.readMessages([target.quoted.key]).catch(() => undefined);
    }
    await this.#socket.sendPresenceUpdate('composing', target.jid);
    await this.#stopTyping(target.jid, false);
    const timer = setInterval(() => {
      void this.#socket.sendPresenceUpdate('composing', target.jid).catch(() => {
        void this.#stopTyping(target.jid);
      });
    }, 20_000);
    timer.unref?.();
    this.#typingTimers.set(target.jid, timer);
  }

  async close() {
    const jids = [...this.#typingTimers.keys()];
    await Promise.allSettled(jids.map((jid) => this.#stopTyping(jid)));
  }

  async #stopTyping(jid, sendPaused = true) {
    const timer = this.#typingTimers.get(jid);
    if (timer) clearInterval(timer);
    this.#typingTimers.delete(jid);
    if (sendPaused) await this.#socket.sendPresenceUpdate('paused', jid).catch(() => undefined);
  }
}

export function createWhatsappRuntimeStatus() {
  return {
    startedAt: null,
    ready: false,
    connectionState: 'idle',
    harnessReachable: false,
    lastCheckedAt: null,
    lastConnectedAt: null,
    lastError: null,
    ...createWhatsappBridgeStatus(),
  };
}

export class WhatsappRuntime {
  #config;
  #authDir;
  #harness;
  #state;
  #logger;
  #replyTimeoutMs;
  #connectTimeoutMs;
  #createSession;
  #status = createWhatsappRuntimeStatus();
  #abortController = null;
  #session = null;
  #client = null;
  #bridge = null;
  #starting = null;

  constructor({
    config,
    authDir,
    harness,
    state,
    logger = console,
    replyTimeoutMs = 600_000,
    connectTimeoutMs = 30_000,
    createSession = createWhatsappWebSession,
  }) {
    if (!config || !authDir || !harness || !state || typeof createSession !== 'function') {
      throw new TypeError('WhatsappRuntime requires config, auth directory, Harness, state, and session factory');
    }
    this.#config = config;
    this.#authDir = authDir;
    this.#harness = harness;
    this.#state = state;
    this.#logger = logger;
    this.#replyTimeoutMs = replyTimeoutMs;
    this.#connectTimeoutMs = connectTimeoutMs;
    this.#createSession = createSession;
  }

  get status() {
    return structuredClone(this.#status);
  }

  async start() {
    if (this.#status.ready && this.#session) return this.status;
    if (this.#starting) return this.#starting;
    this.#starting = this.#start().finally(() => { this.#starting = null; });
    return this.#starting;
  }

  async #start() {
    await this.stop();
    this.#status.startedAt = new Date().toISOString();
    this.#status.connectionState = 'connecting';
    this.#status.lastError = null;
    await this.#harness.ensureRunning();
    this.#status.harnessReachable = true;
    const controller = new AbortController();
    this.#abortController = controller;
    const outboundIds = new RecentWhatsappOutboundIds();
    let rejectRelink;
    const relinkRequired = new Promise((_, reject) => { rejectRelink = reject; });
    void relinkRequired.catch(() => undefined);
    try {
      const session = await this.#createSession({
        authDir: this.#authDir,
        signal: controller.signal,
        logger: this.#logger,
        onQr: () => rejectRelink(Object.assign(
          new Error('WhatsApp linked-device session must be scanned again'),
          { code: 'relink-required' },
        )),
        onMessage: async (raw) => {
          const message = normalizeWhatsappMessage(raw, this.#config.accountJid);
          if (!message || outboundIds.has(message.providerMessageId) || !this.#bridge) return;
          this.#status.lastCheckedAt = Date.now();
          await this.#bridge.accept(message);
        },
        onDisconnect: ({ error }) => {
          if (controller.signal.aborted) return;
          this.#status.ready = false;
          this.#status.connectionState = 'failed';
          this.#status.lastError = error?.message ?? 'WhatsApp Web connection closed';
        },
      });
      this.#session = session;
      let timer;
      const identity = await Promise.race([
        session.ready,
        relinkRequired,
        new Promise((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('WhatsApp Web did not connect in time')),
            this.#connectTimeoutMs,
          );
        }),
      ]).finally(() => clearTimeout(timer));
      if (!areJidsSameUser(identity.accountJid, this.#config.accountJid)) {
        throw new Error('WhatsApp linked account does not match the saved bot');
      }
      const client = new WhatsappBotClient(session.socket, outboundIds);
      this.#client = client;
      this.#bridge = new WhatsappHarnessBridge({
        bot: client,
        harness: this.#harness,
        state: this.#state,
        status: this.#status,
        logger: this.#logger,
        replyTimeoutMs: this.#replyTimeoutMs,
      });
      const now = Date.now();
      this.#status.ready = true;
      this.#status.connectionState = 'connected';
      this.#status.lastCheckedAt = now;
      this.#status.lastConnectedAt = now;
      return this.status;
    } catch (error) {
      this.#status.ready = false;
      this.#status.connectionState = 'failed';
      this.#status.lastError = error?.message ?? String(error);
      await this.stop();
      throw error;
    }
  }

  async logout() {
    await this.#session?.logout().catch(() => undefined);
    return this.stop();
  }

  async stop() {
    const session = this.#session;
    const client = this.#client;
    const bridge = this.#bridge;
    this.#abortController?.abort();
    this.#abortController = null;
    this.#session = null;
    this.#client = null;
    this.#bridge = null;
    await client?.close().catch(() => undefined);
    await session?.close().catch(() => undefined);
    await Promise.race([
      bridge?.waitForIdle() ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
    this.#status.ready = false;
    this.#status.connectionState = 'idle';
    return this.status;
  }
}
