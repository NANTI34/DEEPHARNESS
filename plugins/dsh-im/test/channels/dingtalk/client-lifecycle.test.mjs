import assert from 'node:assert/strict';
import test from 'node:test';
import * as React from 'react';
import TestRenderer from 'react-test-renderer';

import {
  DINGTALK_ENDPOINTS,
} from '../../../plugin-src/client/channels/dingtalk/api.js';
import { DingtalkSettingsTab } from '../../../plugin-src/client/channels/dingtalk/index.js';

const { act, create } = TestRenderer;

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

function ok(value) {
  return { ok: true, value };
}

function provisioning(attemptId, overrides = {}) {
  return {
    attemptId,
    status: 'pending',
    expiresAt: Date.now() + 60_000,
    pollIntervalMs: 1_000,
    qrCodeDataUrl: `data:image/png;base64,${attemptId === 'attempt-old' ? 'QUFBQQ==' : 'QkJCQg=='}`,
    ...overrides,
  };
}

function snapshot(overrides = {}) {
  return {
    schemaVersion: 1,
    revision: 1,
    state: 'disconnected',
    bots: [],
    provisioning: null,
    ...overrides,
  };
}

function createBrowserClock() {
  let nextId = 1;
  const timeouts = new Map();
  const intervals = new Map();
  const frames = new Map();
  const cancelledFrames = [];
  const previousWindow = globalThis.window;

  globalThis.window = {
    setTimeout(callback, delay) {
      const id = nextId++;
      timeouts.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id) {
      timeouts.delete(id);
    },
    setInterval(callback, delay) {
      const id = nextId++;
      intervals.set(id, { callback, delay });
      return id;
    },
    clearInterval(id) {
      intervals.delete(id);
    },
    requestAnimationFrame(callback) {
      const id = nextId++;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) {
      cancelledFrames.push(id);
      frames.delete(id);
    },
  };

  return {
    cancelledFrames,
    frames,
    intervals,
    timeouts,
    runInterval(delay) {
      const entry = [...intervals.values()].find((candidate) => candidate.delay === delay);
      assert.ok(entry, `missing ${delay}ms interval`);
      return entry.callback();
    },
    runTimeout(delay) {
      const match = [...timeouts.entries()].find(([, candidate]) => candidate.delay === delay);
      assert.ok(match, `missing ${delay}ms timeout`);
      const [id, entry] = match;
      timeouts.delete(id);
      return entry.callback();
    },
    restore() {
      if (previousWindow === undefined) delete globalThis.window;
      else globalThis.window = previousWindow;
    },
  };
}

async function flushMicrotasks() {
  for (let index = 0; index < 6; index += 1) await Promise.resolve();
}

function nodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  const children = Array.isArray(node) ? node : node.children;
  return Array.isArray(children) ? children.map(nodeText).join('') : nodeText(children);
}

function findButton(renderer, label) {
  const button = renderer.root.findAllByType('button')
    .find((candidate) => nodeText(candidate) === label);
  assert.ok(button, `missing button: ${label}`);
  return button;
}

test('a late poll response cannot issue status RPCs or schedule work after effect cleanup', async (t) => {
  const clock = createBrowserClock();
  t.after(() => clock.restore());
  const oldPoll = deferred();
  let beginCount = 0;
  let statusCalls = 0;
  const rpcCall = async (endpoint, payload) => {
    if (endpoint === DINGTALK_ENDPOINTS.status) {
      statusCalls += 1;
      return ok(snapshot());
    }
    if (endpoint === DINGTALK_ENDPOINTS.beginProvisioning) {
      beginCount += 1;
      return ok(provisioning(beginCount === 1 ? 'attempt-old' : 'attempt-new'));
    }
    if (endpoint === DINGTALK_ENDPOINTS.cancelProvisioning) return ok({ cancelled: true });
    if (endpoint === DINGTALK_ENDPOINTS.pollProvisioning) {
      assert.equal(payload.attemptId, 'attempt-old');
      return oldPoll.promise;
    }
    throw new Error(`unexpected endpoint: ${endpoint}`);
  };

  let renderer;
  await act(async () => {
    renderer = create(React.createElement(DingtalkSettingsTab, { rpcCall }));
    await flushMicrotasks();
  });
  await act(async () => {
    findButton(renderer, '生成钉钉二维码').props.onClick();
    await flushMicrotasks();
  });
  await act(async () => {
    clock.runTimeout(1_000);
    await flushMicrotasks();
  });
  await act(async () => {
    findButton(renderer, '换一个二维码').props.onClick();
    await flushMicrotasks();
  });

  assert.equal(clock.timeouts.size, 1, 'the replacement attempt owns one poll timer');
  assert.equal(statusCalls, 1, 'only the initial status request has run');

  await act(async () => {
    oldPoll.resolve(ok(provisioning('attempt-old', {
      status: 'connected',
      botId: 'bot-old',
    })));
    await flushMicrotasks();
  });

  assert.equal(statusCalls, 1, 'the disposed poll cannot start a connected-status refresh');
  assert.equal(clock.timeouts.size, 1, 'the disposed poll cannot add another timer');
  assert.equal(renderer.root.findByType('img').props.src, 'data:image/png;base64,QkJCQg==');

  act(() => renderer.unmount());
});

test('a stale periodic status response cannot restore cancelled provisioning', async (t) => {
  const clock = createBrowserClock();
  t.after(() => clock.restore());
  const staleStatus = deferred();
  let statusCalls = 0;
  const rpcCall = async (endpoint) => {
    if (endpoint === DINGTALK_ENDPOINTS.status) {
      statusCalls += 1;
      return statusCalls === 1 ? ok(snapshot()) : staleStatus.promise;
    }
    if (endpoint === DINGTALK_ENDPOINTS.beginProvisioning) {
      return ok(provisioning('attempt-old'));
    }
    if (endpoint === DINGTALK_ENDPOINTS.cancelProvisioning) return ok({ cancelled: true });
    throw new Error(`unexpected endpoint: ${endpoint}`);
  };

  let renderer;
  await act(async () => {
    renderer = create(React.createElement(DingtalkSettingsTab, { rpcCall }));
    await flushMicrotasks();
  });
  await act(async () => {
    findButton(renderer, '生成钉钉二维码').props.onClick();
    await flushMicrotasks();
  });
  const firstAnnouncement = [...clock.frames.keys()][0];
  assert.ok(firstAnnouncement, 'starting provisioning schedules an announcement');

  await act(async () => {
    void clock.runInterval(15_000);
    await flushMicrotasks();
  });
  await act(async () => {
    findButton(renderer, '取消').props.onClick();
    await flushMicrotasks();
  });
  assert.ok(clock.cancelledFrames.includes(firstAnnouncement), 'a new announcement cancels the old frame');

  await act(async () => {
    staleStatus.resolve(ok(snapshot({ provisioning: provisioning('attempt-old') })));
    await flushMicrotasks();
  });

  assert.equal(renderer.root.findAllByType('img').length, 0);
  findButton(renderer, '生成钉钉二维码');
  assert.ok(clock.frames.size > 0, 'cancel leaves its announcement or focus frame pending');

  act(() => renderer.unmount());
  assert.equal(clock.frames.size, 0, 'unmount cancels every pending animation frame');
});

test('unmount does not cancel a Host provisioning task that already started', async (t) => {
  const clock = createBrowserClock();
  t.after(() => clock.restore());
  const begin = deferred();
  const calls = [];
  const rpcCall = async (endpoint, payload, signal) => {
    calls.push({ endpoint, payload, signal });
    if (endpoint === DINGTALK_ENDPOINTS.status) return ok(snapshot());
    if (endpoint === DINGTALK_ENDPOINTS.beginProvisioning) return begin.promise;
    throw new Error(`unexpected endpoint: ${endpoint}`);
  };

  let renderer;
  await act(async () => {
    renderer = create(React.createElement(DingtalkSettingsTab, { rpcCall }));
    await flushMicrotasks();
  });
  await act(async () => {
    findButton(renderer, '生成钉钉二维码').props.onClick();
    await flushMicrotasks();
  });

  const beginCall = calls.find((call) => call.endpoint === DINGTALK_ENDPOINTS.beginProvisioning);
  assert.ok(beginCall);
  assert.equal(beginCall.signal, undefined, 'component teardown must not abort Host provisioning');
  act(() => renderer.unmount());

  begin.resolve(ok(provisioning('attempt-old')));
  await flushMicrotasks();
  assert.equal(
    calls.filter((call) => call.endpoint === DINGTALK_ENDPOINTS.cancelProvisioning).length,
    0,
  );
  assert.equal(clock.frames.size, 0);
});
