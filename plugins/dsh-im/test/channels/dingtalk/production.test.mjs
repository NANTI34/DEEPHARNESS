import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createProductionController } from '../../../plugin-src/host/channels/dingtalk/production.mjs';

test('production assembly keeps secrets in credentials and creates per-bot runtimes', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-dingtalk-production-'));
  const seen = {};
  class ConfigStore {
    constructor(path) { seen.configPath = path; }
    async load() { return this; }
  }
  class DeviceAuth {
    constructor(options) { seen.deviceAuthOptions = options; }
  }
  class StateStore {
    constructor(path) { seen.statePath = path; }
    async load() { return this; }
  }
  class Harness {
    constructor(options) { seen.harnessOptions = options; }
    stopManagedProcess() { seen.harnessStopped = true; }
  }
  class Runtime {
    constructor(options) { seen.runtimeOptions = options; }
  }
  class Controller {
    constructor(options) {
      seen.controllerOptions = options;
      this.status = () => ({ totals: { configured: 0, connected: 0 } });
      this.initialize = async () => this.status();
    }
    async close() { seen.controllerClosed = true; }
  }
  const supervisor = {
    ready: Promise.resolve(null),
    start() { return this; },
    async close() { seen.supervisorClosed = true; },
  };
  const credentials = {};
  const production = await createProductionController({
    credentials,
    webServer: { port: 3080 },
    logger: () => console,
  }, { dataDir: directory }, {
    ConfigStore,
    DeviceAuth,
    StateStore,
    HarnessClient: Harness,
    Controller,
    Runtime,
    createConnectionSupervisor: () => supervisor,
  });

  assert.equal(seen.controllerOptions.credentials, credentials);
  assert.equal(seen.harnessOptions.baseUrl.href, 'http://127.0.0.1:3080/');
  assert.equal(seen.harnessOptions.autostart, false);
  const runtime = await seen.controllerOptions.createRuntime({
    botId: 'dt_abc',
    config: { botId: 'dt_abc', clientId: 'dingabc' },
    clientSecret: 'host-only-secret',
  });
  assert.ok(runtime instanceof Runtime);
  assert.equal(seen.runtimeOptions.clientSecret, 'host-only-secret');
  assert.match(seen.statePath, /dt_abc\/state\.json$/);

  await production.close();
  assert.equal(seen.supervisorClosed, true);
  assert.equal(seen.controllerClosed, true);
  assert.equal(seen.harnessStopped, true);
});
