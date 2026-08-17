import assert from 'node:assert/strict';
import test from 'node:test';

import { apply, createDingtalkHostPlugin, inject, name } from '../../../plugin-src/host/channels/dingtalk/index.mjs';

function controller() {
  return {
    status() { return { bots: [] }; },
    startProvisioning() {},
    registrationStatus() {},
    cancelProvisioning() {},
    bindCredentials() {},
    reconnectBot() {},
    deleteBot() {},
    approveSender() {},
    revokeSender() {},
  };
}

test('Host exports the DingTalk plugin identity and required services', () => {
  const plugin = createDingtalkHostPlugin({ controller: controller() });
  assert.equal(name, 'dsh-dingtalk-host');
  assert.deepEqual(inject, ['connection', 'credentials', 'webServer']);
  assert.equal(plugin.name, name);
  assert.deepEqual(plugin.inject, inject);
});

test('Host installs loopback RPC for an injected controller', async () => {
  const calls = [];
  const dispose = () => {};
  const ctx = {
    connection: {
      rpc: {
        handle: (...args) => {
          calls.push(args);
          return dispose;
        },
      },
    },
  };

  assert.equal(await apply(ctx, { controller: controller() }), dispose);
  assert.equal(calls[0][0], '/dingtalk');
  assert.deepEqual(calls[0][2], { authority: 'loopback' });
});
