import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const EMPTY_STATE = Object.freeze({ version: 1, sessions: {}, seenMessageIds: [] });

export class StateStore {
  #path;
  #state = structuredClone(EMPTY_STATE);
  #writeQueue = Promise.resolve();

  constructor(path) {
    this.#path = path;
  }

  async load() {
    try {
      const parsed = JSON.parse(await readFile(this.#path, 'utf8'));
      this.#state = {
        version: 1,
        sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {},
        seenMessageIds: Array.isArray(parsed.seenMessageIds) ? parsed.seenMessageIds.slice(-1000) : [],
      };
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
      await this.#persist();
    }
    return this;
  }

  sessionFor(key) {
    return this.#state.sessions[key] ?? null;
  }

  async setSession(key, sessionId) {
    this.#state.sessions[key] = sessionId;
    await this.#persist();
  }

  async clearSession(key) {
    delete this.#state.sessions[key];
    await this.#persist();
  }

  hasSeen(messageId) {
    return this.#state.seenMessageIds.includes(messageId);
  }

  async markSeen(messageId) {
    if (this.hasSeen(messageId)) return;
    this.#state.seenMessageIds.push(messageId);
    if (this.#state.seenMessageIds.length > 1000) {
      this.#state.seenMessageIds.splice(0, this.#state.seenMessageIds.length - 1000);
    }
    await this.#persist();
  }

  snapshot() {
    return structuredClone(this.#state);
  }

  async #persist() {
    const snapshot = JSON.stringify(this.#state, null, 2) + '\n';
    this.#writeQueue = this.#writeQueue.then(async () => {
      await mkdir(dirname(this.#path), { recursive: true, mode: 0o700 });
      const temporary = `${this.#path}.tmp`;
      await writeFile(temporary, snapshot, { encoding: 'utf8', mode: 0o600 });
      await rename(temporary, this.#path);
    });
    await this.#writeQueue;
  }
}
