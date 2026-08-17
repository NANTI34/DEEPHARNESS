import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { unlink } from 'node:fs/promises';
import * as Lark from '@larksuiteoapi/node-sdk';
import { createConnectionSupervisor } from './connection-supervisor.mjs';
import { verifyFeishuApp } from '../../../../src/channels/feishu/feishu-app.mjs';
import { FeishuRuntime } from '../../../../src/channels/feishu/feishu-runtime.mjs';
import { HarnessClient } from '../../../../src/channels/feishu/harness-client.mjs';
import {
  LEGACY_FEISHU_SECRET_REF,
  PluginConfigStore,
} from '../../../../src/channels/feishu/plugin-config-store.mjs';
import { MultiBotDshFeishuController } from '../../../../src/channels/feishu/multi-bot-controller.mjs';
import { StateStore } from '../../../../src/channels/feishu/state-store.mjs';

function harnessOrigin(webServer, configured) {
  if (configured !== undefined) return new URL(configured);
  const port = webServer?.port;
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('dsh-feishu requires an initialized DSH webServer port');
  }
  // Even when DSH listens on all interfaces, its own plugin talks through the
  // loopback authority accepted by Connection's request-trust fence.
  return new URL(`http://127.0.0.1:${port}`);
}

function pluginPaths(config) {
  const dshHome = resolve(config.dshHome
    ?? process.env.DSH_HOME
    ?? join(homedir(), '.dsh'));
  const root = resolve(config.dataDir ?? join(dshHome, 'integrations', 'dsh-feishu'));
  return {
    root,
    config: resolve(config.configPath ?? join(root, 'config.json')),
    legacyState: resolve(config.statePath ?? join(root, 'state.json')),
    bots: resolve(config.botsDir ?? join(root, 'bots')),
  };
}

/**
 * Assemble the production controller from DSH Host services and local plugin
 * classes. No bridge process or environment App credentials are required.
 */
export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.credentials) throw new TypeError('dsh-feishu requires ctx.credentials');
  if (!ctx?.webServer) throw new TypeError('dsh-feishu requires ctx.webServer');

  const lark = internals.lark ?? Lark;
  const Controller = internals.Controller ?? MultiBotDshFeishuController;
  const ConfigStore = internals.ConfigStore ?? PluginConfigStore;
  const SessionStateStore = internals.StateStore ?? StateStore;
  const Harness = internals.HarnessClient ?? HarnessClient;
  const Runtime = internals.FeishuRuntime ?? FeishuRuntime;
  const verifyApp = internals.verifyFeishuApp ?? verifyFeishuApp;
  const createSupervisor = internals.createConnectionSupervisor ?? createConnectionSupervisor;
  const logger = typeof ctx.logger === 'function'
    ? ctx.logger('dsh-feishu')
    : (ctx.logger ?? console);
  const paths = pluginPaths(config);
  const configStore = await new ConfigStore(paths.config).load();
  // State is lazy per bot. A corrupt legacy file can therefore fail only the
  // migrated bot and cannot prevent healthy v2 bots from starting.
  const stateStores = new Map();
  const statePathFor = (botConfig) => !botConfig.id
    || !botConfig.secretRef
    || botConfig.secretRef === LEGACY_FEISHU_SECRET_REF
    ? paths.legacyState
    : resolve(paths.bots, botConfig.id, 'state.json');
  const stateFor = async (botConfig) => {
    const stateKey = botConfig.id ?? '__legacy__';
    let state = stateStores.get(stateKey);
    if (!state) {
      state = await new SessionStateStore(statePathFor(botConfig)).load();
      stateStores.set(stateKey, state);
    }
    return state;
  };
  const harness = new Harness({
    baseUrl: harnessOrigin(ctx.webServer, config.harnessBaseUrl),
    workspace: resolve(config.workspace ?? process.cwd()),
    agentPreset: config.agentPreset ?? 'standard',
    // This plugin is already hosted by a running DSH process. Starting a
    // second DSH would create a competing server and lifecycle.
    autostart: false,
    dshBin: config.dshBin ?? 'dsh',
  });

  const controller = new Controller({
    registerApp: (options) => lark.registerApp(options),
    verifyApp,
    credentials: ctx.credentials,
    configStore,
    createRuntime: async ({ botId, config: botConfig, appSecret }) => {
      const state = await stateFor(botConfig);
      return new Runtime({
        lark,
        appId: botConfig.appId,
        appSecret,
        domain: botConfig.domain,
        ownerOpenIds: botConfig.ownerOpenIds ?? [botConfig.ownerOpenId],
        harness,
        state,
        replyTimeoutMs: config.replyTimeoutMs ?? 600_000,
        logger: {
          error: (...args) => logger.error?.(`[${botId ?? botConfig.id}]`, ...args),
          warn: (...args) => logger.warn?.(`[${botId ?? botConfig.id}]`, ...args),
          info: (...args) => logger.info?.(`[${botId ?? botConfig.id}]`, ...args),
          debug: (...args) => logger.debug?.(`[${botId ?? botConfig.id}]`, ...args),
        },
      });
    },
    deleteState: async ({ botId, config: botConfig }) => {
      stateStores.delete(botId);
      try {
        await unlink(statePathFor(botConfig));
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
