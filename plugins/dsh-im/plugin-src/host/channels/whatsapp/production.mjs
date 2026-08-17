import { rm, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

import { WhatsappConfigStore } from '../../../../src/channels/whatsapp/config-store.mjs';
import { WhatsappHarnessClient } from '../../../../src/channels/whatsapp/harness-client.mjs';
import { WhatsappStateStore } from '../../../../src/channels/whatsapp/state-store.mjs';
import { WhatsappController } from '../../../../src/channels/whatsapp/whatsapp-controller.mjs';
import { WhatsappRuntime } from '../../../../src/channels/whatsapp/whatsapp-runtime.mjs';
import { createWhatsappWebSession } from '../../../../src/channels/whatsapp/whatsapp-web-session.mjs';
import { createTokenConnectionSupervisor } from '../shared/connection-supervisor.mjs';

const AUTH_DIRECTORY_PATTERN = /^[a-f0-9-]{36}$/;

function harnessOrigin(webServer, configured) {
  if (configured !== undefined) return new URL(configured);
  const port = webServer?.port;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('dsh-im WhatsApp requires an initialized DSH webServer port');
  }
  return new URL(`http://127.0.0.1:${port}`);
}

function pluginPaths(config) {
  const dshHome = resolve(config.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh'));
  const root = resolve(config.dataDir ?? join(dshHome, 'integrations', 'dsh-whatsapp'));
  const authRoot = resolve(config.authDir ?? join(root, 'auth'));
  const authPath = (name) => {
    if (!AUTH_DIRECTORY_PATTERN.test(name ?? '')) throw new TypeError('Invalid WhatsApp auth directory');
    return resolve(authRoot, name);
  };
  return {
    config: resolve(config.configPath ?? join(root, 'config.json')),
    bots: resolve(config.botsDir ?? join(root, 'bots')),
    authPath,
  };
}

export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.webServer) throw new TypeError('dsh-im WhatsApp requires ctx.webServer');
  const logger = typeof ctx.logger === 'function'
    ? ctx.logger('dsh-im:whatsapp') : (ctx.logger ?? console);
  const ConfigStore = internals.ConfigStore ?? WhatsappConfigStore;
  const StateStore = internals.StateStore ?? WhatsappStateStore;
  const Harness = internals.HarnessClient ?? WhatsappHarnessClient;
  const Controller = internals.Controller ?? WhatsappController;
  const Runtime = internals.Runtime ?? WhatsappRuntime;
  const createSession = internals.createSession ?? createWhatsappWebSession;
  const createSupervisor = internals.createConnectionSupervisor ?? createTokenConnectionSupervisor;
  const paths = pluginPaths(config);
  const configStore = await new ConfigStore(paths.config).load();
  const stateStores = new Map();
  const statePath = (botId) => resolve(paths.bots, botId, 'state.json');
  const stateFor = async (botId) => {
    let state = stateStores.get(botId);
    if (!state) {
      state = await new StateStore(statePath(botId)).load();
      stateStores.set(botId, state);
    }
    return state;
  };
  const harness = new Harness({
    baseUrl: harnessOrigin(ctx.webServer, config.harnessBaseUrl),
    workspace: resolve(config.workspace ?? process.cwd()),
    agentPreset: config.agentPreset ?? 'standard',
    autostart: false,
    dshBin: config.dshBin ?? 'dsh',
  });
  const controller = new Controller({
    configStore,
    authPath: paths.authPath,
    createSession,
    logger,
    createRuntime: async ({ botId, config: botConfig, authDir }) => new Runtime({
      config: botConfig,
      authDir,
      harness,
      state: await stateFor(botId),
      replyTimeoutMs: config.replyTimeoutMs ?? 600_000,
      connectTimeoutMs: config.connectTimeoutMs ?? 30_000,
      createSession,
      logger: {
        error: (...args) => logger.error?.(`[${botId}]`, ...args),
        warn: (...args) => logger.warn?.(`[${botId}]`, ...args),
        info: (...args) => logger.info?.(`[${botId}]`, ...args),
        debug: (...args) => logger.debug?.(`[${botId}]`, ...args),
      },
    }),
    deleteAuth: (authDirectory) => rm(paths.authPath(authDirectory), {
      recursive: true,
      force: true,
    }),
    deleteState: async ({ botId }) => {
      const state = stateStores.get(botId);
      stateStores.delete(botId);
      if (state && typeof state.remove === 'function') return state.remove();
      try {
        await unlink(statePath(botId));
      } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
    },
  });
  const supervisor = createSupervisor({
    channel: 'whatsapp',
    controller,
    harness,
    logger,
    retryDelaysMs: config.retryDelaysMs,
    healthyIntervalMs: config.healthyIntervalMs,
  }).start();
  return {
    controller,
    ready: supervisor.ready,
    async close() {
      await supervisor.close();
      await controller.close();
      harness.stopManagedProcess();
    },
  };
}
