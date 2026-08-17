import { unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

import { QqConfigStore } from '../../../../src/channels/qq/config-store.mjs';
import { QqHarnessClient } from '../../../../src/channels/qq/harness-client.mjs';
import { QqController } from '../../../../src/channels/qq/qq-controller.mjs';
import { QqRuntime } from '../../../../src/channels/qq/qq-runtime.mjs';
import { QqQrAuth } from '../../../../src/channels/qq/qr-auth.mjs';
import { QqStateStore } from '../../../../src/channels/qq/state-store.mjs';
import { createConnectionSupervisor } from './connection-supervisor.mjs';

function harnessOrigin(webServer, configured) {
  if (configured !== undefined) return new URL(configured);
  const port = webServer?.port;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('dsh-im QQ requires an initialized DSH webServer port');
  }
  return new URL(`http://127.0.0.1:${port}`);
}

function pluginPaths(config) {
  const dshHome = resolve(config.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh'));
  const root = resolve(config.dataDir ?? join(dshHome, 'integrations', 'dsh-qq'));
  return {
    config: resolve(config.configPath ?? join(root, 'config.json')),
    bots: resolve(config.botsDir ?? join(root, 'bots')),
  };
}

export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.credentials) throw new TypeError('dsh-im QQ requires ctx.credentials');
  if (!ctx?.webServer) throw new TypeError('dsh-im QQ requires ctx.webServer');

  const ConfigStore = internals.ConfigStore ?? QqConfigStore;
  const StateStore = internals.StateStore ?? QqStateStore;
  const Harness = internals.HarnessClient ?? QqHarnessClient;
  const Controller = internals.Controller ?? QqController;
  const Runtime = internals.Runtime ?? QqRuntime;
  const QrAuth = internals.QrAuth ?? QqQrAuth;
  const createSupervisor = internals.createConnectionSupervisor ?? createConnectionSupervisor;
  const logger = typeof ctx.logger === 'function' ? ctx.logger('dsh-im:qq') : (ctx.logger ?? console);
  const paths = pluginPaths(config);
  const configStore = await new ConfigStore(paths.config).load();
  const qrAuth = internals.qrAuth ?? new QrAuth({ source: config.qrSource ?? 'deepseek-harness' });
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
    qrAuth,
    credentials: ctx.credentials,
    configStore,
    logger,
    createRuntime: async ({ botId, config: botConfig, appSecret }) => new Runtime({
      config: botConfig,
      appSecret,
      harness,
      state: await stateFor(botId),
      replyTimeoutMs: config.replyTimeoutMs ?? 600_000,
      connectTimeoutMs: config.connectTimeoutMs ?? 20_000,
      logger: {
        error: (...args) => logger.error?.(`[${botId}]`, ...args),
        warn: (...args) => logger.warn?.(`[${botId}]`, ...args),
        info: (...args) => logger.info?.(`[${botId}]`, ...args),
        debug: (...args) => logger.debug?.(`[${botId}]`, ...args),
      },
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
