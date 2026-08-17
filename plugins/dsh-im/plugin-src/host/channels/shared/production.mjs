import { unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

import { createTokenConnectionSupervisor } from './connection-supervisor.mjs';

export function harnessOrigin(webServer, configured) {
  if (configured !== undefined) return new URL(configured);
  const port = webServer?.port;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('dsh-im token channel requires an initialized DSH webServer port');
  }
  return new URL(`http://127.0.0.1:${port}`);
}

export function pluginPaths(config, channel) {
  const dshHome = resolve(config.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh'));
  const root = resolve(config.dataDir ?? join(dshHome, 'integrations', `dsh-${channel}`));
  return {
    config: resolve(config.configPath ?? join(root, 'config.json')),
    bots: resolve(config.botsDir ?? join(root, 'bots')),
  };
}

export async function createTokenProductionController(ctx, config, internals, definitions) {
  const { channel, ConfigStore, StateStore, HarnessClient, Controller, Runtime } = definitions;
  if (!ctx?.credentials) throw new TypeError(`dsh-im ${channel} requires ctx.credentials`);
  if (!ctx?.webServer) throw new TypeError(`dsh-im ${channel} requires ctx.webServer`);

  const ResolvedConfigStore = internals.ConfigStore ?? ConfigStore;
  const ResolvedStateStore = internals.StateStore ?? StateStore;
  const ResolvedHarness = internals.HarnessClient ?? HarnessClient;
  const ResolvedController = internals.Controller ?? Controller;
  const ResolvedRuntime = internals.Runtime ?? Runtime;
  const createSupervisor = internals.createConnectionSupervisor ?? createTokenConnectionSupervisor;
  const logger = typeof ctx.logger === 'function'
    ? ctx.logger(`dsh-im:${channel}`) : (ctx.logger ?? console);
  const paths = pluginPaths(config, channel);
  const configStore = await new ResolvedConfigStore(paths.config).load();
  const stateStores = new Map();
  const statePath = (botId) => resolve(paths.bots, botId, 'state.json');
  const stateFor = async (botId) => {
    let state = stateStores.get(botId);
    if (!state) {
      state = await new ResolvedStateStore(statePath(botId)).load();
      stateStores.set(botId, state);
    }
    return state;
  };
  const harness = new ResolvedHarness({
    baseUrl: harnessOrigin(ctx.webServer, config.harnessBaseUrl),
    workspace: resolve(config.workspace ?? process.cwd()),
    agentPreset: config.agentPreset ?? 'standard',
    autostart: false,
    dshBin: config.dshBin ?? 'dsh',
  });
  const controller = new ResolvedController({
    credentials: ctx.credentials,
    configStore,
    logger,
    ...(internals.inspectToken ? { inspectToken: internals.inspectToken } : {}),
    createRuntime: async ({ botId, config: botConfig, token }) => new ResolvedRuntime({
      config: botConfig,
      token,
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
    channel,
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
