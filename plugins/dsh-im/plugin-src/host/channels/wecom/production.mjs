import { unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

import { WecomConfigStore } from '../../../../src/channels/wecom/config-store.mjs';
import { WecomHarnessClient } from '../../../../src/channels/wecom/harness-client.mjs';
import { WecomQrAuth } from '../../../../src/channels/wecom/qr-auth.mjs';
import { WecomStateStore } from '../../../../src/channels/wecom/state-store.mjs';
import { WecomController } from '../../../../src/channels/wecom/wecom-controller.mjs';
import { WecomRuntime } from '../../../../src/channels/wecom/wecom-runtime.mjs';
import { createConnectionSupervisor } from './connection-supervisor.mjs';

function harnessOrigin(webServer, configured) {
  if (configured !== undefined) return new URL(configured);
  const port = webServer?.port;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('dsh-im Enterprise WeChat requires an initialized DSH webServer port');
  }
  return new URL(`http://127.0.0.1:${port}`);
}

function pluginPaths(config) {
  const dshHome = resolve(config.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh'));
  const root = resolve(config.dataDir ?? join(dshHome, 'integrations', 'dsh-wecom'));
  return {
    config: resolve(config.configPath ?? join(root, 'config.json')),
    bots: resolve(config.botsDir ?? join(root, 'bots')),
  };
}

export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.credentials) throw new TypeError('dsh-im Enterprise WeChat requires ctx.credentials');
  if (!ctx?.webServer) throw new TypeError('dsh-im Enterprise WeChat requires ctx.webServer');

  const ConfigStore = internals.ConfigStore ?? WecomConfigStore;
  const StateStore = internals.StateStore ?? WecomStateStore;
  const Harness = internals.HarnessClient ?? WecomHarnessClient;
  const Controller = internals.Controller ?? WecomController;
  const Runtime = internals.Runtime ?? WecomRuntime;
  const QrAuth = internals.QrAuth ?? WecomQrAuth;
  const createSupervisor = internals.createConnectionSupervisor ?? createConnectionSupervisor;
  const logger = typeof ctx.logger === 'function' ? ctx.logger('dsh-im:wecom') : (ctx.logger ?? console);
  const paths = pluginPaths(config);
  const configStore = await new ConfigStore(paths.config).load();
  const qrAuth = internals.qrAuth ?? new QrAuth({
    source: config.qrSource ?? 'deepseek-harness',
    platform: config.qrPlatform,
  });
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
    createRuntime: async ({ botId, config: botConfig, secret }) => new Runtime({
      config: botConfig,
      secret,
      harness,
      state: await stateFor(botId),
      replyTimeoutMs: config.replyTimeoutMs ?? 600_000,
      connectTimeoutMs: config.connectTimeoutMs ?? 20_000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 10,
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
