import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function assistantMessageText(event) {
  return (event?.data?.message?.content ?? [])
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('\n')
    .trim();
}

export class HarnessReplyTracker {
  #promptRpcId;
  #lastSeq;
  #openTurn = null;
  #targetTurn = null;
  #stepText = new Map();
  #latestText = '';
  #finished = false;
  #reason = null;

  constructor({ promptRpcId, afterSeq = -1 }) {
    this.#promptRpcId = promptRpcId;
    this.#lastSeq = afterSeq;
  }

  get finished() {
    return this.#finished;
  }

  get answer() {
    return this.#latestText.trim();
  }

  get reason() {
    return this.#reason;
  }

  consume(entries) {
    let update = null;
    const ordered = [...entries]
      .map((entry) => entry?.event ?? entry)
      .filter(Boolean)
      .sort((left, right) => (left.seq ?? -1) - (right.seq ?? -1));

    for (const event of ordered) {
      const seq = event.seq ?? -1;
      if (seq <= this.#lastSeq) continue;
      this.#lastSeq = seq;

      if (event.type === 'turn/start') this.#openTurn = event.data?.turn ?? null;

      if (event.type === 'user/message' && event.data?.source?.rpcId === this.#promptRpcId) {
        this.#targetTurn = this.#openTurn;
        continue;
      }
      if (this.#targetTurn === null) continue;

      if (event.type === 'turn/end') {
        if (event.data?.turn !== this.#targetTurn) continue;
        this.#finished = true;
        this.#reason = event.data?.reason ?? null;
        this.#openTurn = null;
        continue;
      }
      if (event.data?.turn !== this.#targetTurn) continue;

      if (event.type === 'assistant/chunk' && event.data?.chunk?.type === 'text-delta') {
        const step = event.data?.step ?? 0;
        const index = event.data.chunk.index ?? 0;
        const key = `${step}:${index}`;
        this.#stepText.set(key, (this.#stepText.get(key) ?? '') + event.data.chunk.text);
        const prefix = `${step}:`;
        const text = [...this.#stepText.entries()]
          .filter(([partKey]) => partKey.startsWith(prefix))
          .sort(([left], [right]) => Number(left.split(':')[1]) - Number(right.split(':')[1]))
          .map(([, part]) => part)
          .join('\n')
          .trim();
        if (text && text !== this.#latestText) {
          this.#latestText = text;
          update = { type: 'text', text };
        }
        continue;
      }

      if (event.type === 'assistant/message') {
        const text = assistantMessageText(event);
        if (text && text !== this.#latestText) {
          this.#latestText = text;
          update = { type: 'text', text };
        }
        continue;
      }

      if (event.type === 'tool/call') {
        update = { type: 'tool', name: event.data?.name ?? '工具' };
      } else if (event.type === 'tool/result') {
        update = { type: 'status', text: '正在整理结果…' };
      }
    }
    return update;
  }
}

export class HarnessRpcError extends Error {
  constructor(method, error) {
    super(`${method}: ${error?.message ?? 'unknown Harness RPC error'}`);
    this.name = 'HarnessRpcError';
    this.method = method;
    this.code = error?.code ?? 'internal';
    this.details = error?.details ?? {};
  }
}

export class HarnessClient {
  #baseUrl;
  #workspace;
  #agentPreset;
  #autostart;
  #dshBin;
  #fetch;
  #managedProcess = null;

  constructor({
    baseUrl,
    workspace,
    agentPreset = 'standard',
    autostart = false,
    dshBin = 'dsh',
    fetchImpl = fetch,
  }) {
    this.#baseUrl = new URL(baseUrl);
    this.#workspace = workspace;
    this.#agentPreset = agentPreset;
    this.#autostart = autostart;
    this.#dshBin = dshBin;
    this.#fetch = fetchImpl;
  }

  async rpc(method, payload = {}, timeoutMs = 30_000, options = {}) {
    const rpcId = options.rpcId ?? `dingtalk-${randomUUID()}`;
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = options.signal
      ? AbortSignal.any([options.signal, timeoutSignal])
      : timeoutSignal;
    const response = await this.#fetch(new URL(`/api/${method}`, this.#baseUrl), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'client-request', rpcId, method, payload }),
      signal,
    });
    if (!response.ok) throw new Error(`Harness transport ${method} failed: HTTP ${response.status}`);
    const body = await response.json();
    if (body?.type !== 'server-response' || body?.rpcId !== rpcId) {
      throw new Error(`Harness returned an invalid response for ${method}`);
    }
    if (!body.result?.ok) throw new HarnessRpcError(method, body.result?.error);
    return body.result.value;
  }

  async health(options = {}) {
    await this.rpc('host.describe', {}, 5_000, options);
    return true;
  }

  async ensureRunning(options = {}) {
    try {
      return await this.health(options);
    } catch (firstError) {
      if (!this.#autostart) throw firstError;
    }

    if (!this.#managedProcess || this.#managedProcess.exitCode !== null) {
      const port = this.#baseUrl.port || (this.#baseUrl.protocol === 'https:' ? '443' : '80');
      this.#managedProcess = spawn(this.#dshBin, [
        'web', '--host', this.#baseUrl.hostname, '--port', port,
      ], {
        cwd: this.#workspace,
        env: process.env,
        stdio: ['ignore', 'inherit', 'inherit'],
      });
      this.#managedProcess.on('error', (error) => {
        console.error('[dsh-dingtalk] failed to start Harness:', error.message);
      });
    }

    const deadline = Date.now() + 60_000;
    let lastError;
    while (Date.now() < deadline) {
      await sleep(1_000, options.signal);
      try {
        return await this.health(options);
      } catch (error) {
        lastError = error;
      }
    }
    throw new Error(`Harness did not become ready: ${lastError?.message ?? 'timeout'}`);
  }

  async workspaceId(options = {}) {
    const { items } = await this.rpc('workspace.list', {}, 30_000, options);
    const existing = items.find((item) => item.path === this.#workspace);
    if (existing) return existing.workspaceId;
    const created = await this.rpc('workspace.create', { path: this.#workspace }, 30_000, options);
    return created.workspace.workspaceId;
  }

  async createSession(options = {}) {
    await this.ensureRunning(options);
    const workspaceId = await this.workspaceId(options);
    const created = await this.rpc('session.create', {
      workspaceId,
      agentPreset: this.#agentPreset,
    }, 30_000, options);
    return created.sessionId;
  }

  async sessionExists(sessionId, options = {}) {
    try {
      await this.rpc('session.history', { sessionId, maxMessages: 1 }, 30_000, options);
      return true;
    } catch (error) {
      if (error instanceof HarnessRpcError && error.code === 'session-not-found') return false;
      throw error;
    }
  }

  async ask(sessionId, text, options = {}) {
    if (typeof options === 'number') options = { timeoutMs: options };
    const timeoutMs = options.timeoutMs ?? 600_000;
    const signal = options.signal;
    const onUpdate = typeof options.onUpdate === 'function' ? options.onUpdate : null;
    await this.ensureRunning({ signal });
    const before = await this.rpc(
      'session.history',
      { sessionId, maxMessages: 1 },
      30_000,
      { signal },
    );
    const baselineSeq = Math.max(-1, ...(before.events ?? []).map(({ event }) => event.seq ?? -1));
    const promptRpcId = `dingtalk-${randomUUID()}`;
    const tracker = new HarnessReplyTracker({ promptRpcId, afterSeq: baselineSeq });

    await this.rpc('session.prompt', {
      sessionId,
      mode: 'queue',
      content: [{ type: 'text', text }],
      clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }, 30_000, { rpcId: promptRpcId, signal });

    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      await sleep(300, signal);
      const history = await this.rpc(
        'session.history',
        { sessionId, maxMessages: 50 },
        30_000,
        { signal },
      );
      const update = tracker.consume(history.events ?? []);
      if (update && onUpdate) {
        try {
          await onUpdate(update);
        } catch (error) {
          console.warn('[dsh-dingtalk] ignored a progress update failure:', error.message);
        }
      }
      if (!tracker.finished) continue;
      if (tracker.answer) return tracker.answer;
      throw new Error(
        `Harness turn ended without a text reply${tracker.reason ? ` (${JSON.stringify(tracker.reason)})` : ''}`,
      );
    }
    throw new Error(`Harness reply timed out after ${Math.round(timeoutMs / 1_000)} seconds`);
  }

  stopManagedProcess() {
    if (this.#managedProcess?.exitCode === null) this.#managedProcess.kill('SIGTERM');
  }
}
