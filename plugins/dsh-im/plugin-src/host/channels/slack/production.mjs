import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';

import { SlackConfigStore } from '../../../../src/channels/slack/config-store.mjs';
import { SlackController } from '../../../../src/channels/slack/slack-controller.mjs';
import { SlackHarnessClient } from '../../../../src/channels/slack/harness-client.mjs';
import { SlackRuntime } from '../../../../src/channels/slack/slack-runtime.mjs';
import { SlackStateStore } from '../../../../src/channels/slack/state-store.mjs';
import { createTokenConnectionSupervisor } from '../shared/connection-supervisor.mjs';
import { harnessOrigin, pluginPaths } from '../shared/production.mjs';

export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.credentials) throw new TypeError('dsh-im slack requires ctx.credentials');
  if (!ctx?.webServer) throw new TypeError('dsh-im slack requires ctx.webServer');

  const ResolvedConfigStore = internals.ConfigStore ?? SlackConfigStore;
  const ResolvedStateStore = internals.StateStore ?? SlackStateStore;
  const ResolvedHarness = internals.HarnessClient ?? SlackHarnessClient;
  const ResolvedController = internals.Controller ?? SlackController;
  const ResolvedRuntime = internals.Runtime ?? SlackRuntime;
  const createSupervisor = internals.createConnectionSupervisor ?? createTokenConnectionSupervisor;
  const logger = typeof ctx.logger === 'function'
    ? ctx.logger('dsh-im:slack') : (ctx.logger ?? console);
  const paths = pluginPaths(config, 'slack');
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
    ...(internals.inspectCredentials ? { inspectCredentials: internals.inspectCredentials } : {}),
    createRuntime: async ({ botId, config: botConfig, botToken, appToken }) => new ResolvedRuntime({
      config: botConfig,
      botToken,
      appToken,
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
    channel: 'slack',
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
