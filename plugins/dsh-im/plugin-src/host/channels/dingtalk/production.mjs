import { unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

import { DingtalkConfigStore } from '../../../../src/channels/dingtalk/config-store.mjs';
import { DingtalkDeviceAuth } from '../../../../src/channels/dingtalk/device-auth.mjs';
import { DingtalkController } from '../../../../src/channels/dingtalk/dingtalk-controller.mjs';
import { DingtalkRuntime } from '../../../../src/channels/dingtalk/dingtalk-runtime.mjs';
import { HarnessClient } from '../../../../src/channels/dingtalk/harness-client.mjs';
import { DingtalkStateStore } from '../../../../src/channels/dingtalk/state-store.mjs';
import { createConnectionSupervisor } from './connection-supervisor.mjs';

function harnessOrigin(webServer, configured) {
  if (configured !== undefined) return new URL(configured);
  const port = webServer?.port;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('dsh-dingtalk requires an initialized DSH webServer port');
  }
  return new URL(`http://127.0.0.1:${port}`);
}

function pluginPaths(config) {
  const dshHome = resolve(config.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh'));
  const root = resolve(config.dataDir ?? join(dshHome, 'integrations', 'dsh-dingtalk'));
  return {
    root,
    config: resolve(config.configPath ?? join(root, 'config.json')),
    bots: resolve(config.botsDir ?? join(root, 'bots')),
  };
}

export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.credentials) throw new TypeError('dsh-dingtalk requires ctx.credentials');
  if (!ctx?.webServer) throw new TypeError('dsh-dingtalk requires ctx.webServer');

  const ConfigStore = internals.ConfigStore ?? DingtalkConfigStore;
  const DeviceAuth = internals.DeviceAuth ?? DingtalkDeviceAuth;
  const StateStore = internals.StateStore ?? DingtalkStateStore;
  const Harness = internals.HarnessClient ?? HarnessClient;
  const Controller = internals.Controller ?? DingtalkController;
  const Runtime = internals.Runtime ?? DingtalkRuntime;
  const createSupervisor = internals.createConnectionSupervisor ?? createConnectionSupervisor;
  const logger = typeof ctx.logger === 'function'
    ? ctx.logger('dsh-dingtalk')
    : (ctx.logger ?? console);
  const paths = pluginPaths(config);
  const configStore = await new ConfigStore(paths.config).load();
  const deviceAuth = internals.deviceAuth ?? new DeviceAuth({
    baseUrl: config.registrationBaseUrl,
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
    deviceAuth,
    credentials: ctx.credentials,
    configStore,
    logger,
    createRuntime: async ({ botId, config: botConfig, clientSecret }) => {
      const state = await stateFor(botId);
      return new Runtime({
        config: botConfig,
        clientSecret,
        harness,
        state,
        replyTimeoutMs: config.replyTimeoutMs ?? 600_000,
        maxMessageChars: config.maxMessageChars ?? 4_000,
        connectTimeoutMs: config.connectTimeoutMs ?? 15_000,
        logger: {
          error: (...args) => logger.error?.(`[${botId}]`, ...args),
          warn: (...args) => logger.warn?.(`[${botId}]`, ...args),
          info: (...args) => logger.info?.(`[${botId}]`, ...args),
          debug: (...args) => logger.debug?.(`[${botId}]`, ...args),
        },
      });
    },
    deleteState: async ({ botId }) => {
      const state = stateStores.get(botId);
      stateStores.delete(botId);
      if (state && typeof state.remove === 'function') {
        await state.remove();
        return;
      }
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
