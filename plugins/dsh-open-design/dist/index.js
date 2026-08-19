// src/index.ts
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline";
import {
  installModelSelection
} from "@deepseek-ai/dsh-agent";
import {
  createUserMessage,
  ReasoningEffortId
} from "@deepseek-ai/dsh-llm";
import { SessionId } from "@deepseek-ai/dsh-session";

// src/protocol.ts
var PROTOCOL_VERSION = 1;
var RUNTIME_NAME = "open-design";
var CAPABILITIES = {
  session_resume: true,
  session_cancel: true,
  structured_events: true
};
function modelsFrame(models) {
  return {
    v: PROTOCOL_VERSION,
    type: "models",
    runtime: RUNTIME_NAME,
    models
  };
}
function record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : null;
}
function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function parseHostCommand(value) {
  const input = record(value);
  if (!input || input.v !== 1 || !nonEmpty(input.type) || !nonEmpty(input.request_id)) {
    throw new Error("invalid protocol envelope");
  }
  if (input.type === "cancel") {
    return { v: 1, type: "cancel", request_id: input.request_id };
  }
  if (input.type !== "execute" || !nonEmpty(input.cwd) || !nonEmpty(input.prompt) || !Array.isArray(input.mcp_servers)) {
    throw new Error("invalid execute command");
  }
  const model = record(input.model);
  if (input.model !== void 0 && (!model || !nonEmpty(model.provider) || !nonEmpty(model.id))) {
    throw new Error("invalid model selection");
  }
  if (input.resume_session_id !== void 0 && !nonEmpty(input.resume_session_id)) {
    throw new Error("invalid resume session id");
  }
  if (input.reasoning_effort !== void 0 && !nonEmpty(input.reasoning_effort)) {
    throw new Error("invalid reasoning effort");
  }
  return {
    v: 1,
    type: "execute",
    request_id: input.request_id,
    cwd: input.cwd,
    prompt: input.prompt,
    mcp_servers: input.mcp_servers,
    ...input.resume_session_id === void 0 ? {} : { resume_session_id: input.resume_session_id },
    ...model === null ? {} : { model: { provider: model.provider, id: model.id } },
    ...input.reasoning_effort === void 0 ? {} : { reasoning_effort: input.reasoning_effort }
  };
}
function identityFrame(type, pluginVersion) {
  return {
    v: PROTOCOL_VERSION,
    type,
    runtime: RUNTIME_NAME,
    protocol_version: PROTOCOL_VERSION,
    plugin_version: pluginVersion,
    capabilities: CAPABILITIES
  };
}

// src/index.ts
var name = "open-design-runtime";
var inject = [
  "openDesignStartup",
  "agentDefaultModel",
  "agents",
  "llm",
  "sessions",
  "sessionPersistence"
];
var PLUGIN_VERSION = "0.1.0";
var PROCESS_EXIT_FALLBACK_MS = 1e3;
function writeFrame(output, frame) {
  output.write(`${JSON.stringify(frame)}
`);
}
function errorFacts(error, fallbackCode) {
  const candidate = typeof error === "object" && error !== null ? error : void 0;
  const code = typeof candidate?.code === "string" && candidate.code !== "" ? candidate.code : fallbackCode;
  if (error instanceof Error && error.message !== "") return { code, message: error.message };
  if (typeof candidate?.message === "string" && candidate.message !== "") {
    return { code, message: candidate.message };
  }
  if (typeof error === "string" && error !== "") return { code, message: error };
  return { code, message: "DeepSeek Harness reported an execution error." };
}
function contentText(content) {
  const text = [];
  const visit = (blocks) => {
    for (const block of blocks) {
      if (block.type === "text" || block.type === "reasoning") text.push(block.text);
      if (block.type === "tool-result") visit(block.content);
    }
  };
  visit(content);
  return text.join("");
}
function resultStatus(reason) {
  if (reason?.kind === "completed" || reason?.kind === "max-tokens") return "completed";
  if (reason?.kind === "aborted") return "cancelled";
  return "failed";
}
function resultError(reason) {
  if (resultStatus(reason) !== "failed") return void 0;
  if (!reason) {
    return {
      code: "DSH_PROFILE_MISSING_TURN_END",
      message: "DeepSeek Harness became idle without reporting how the turn ended."
    };
  }
  if (reason.kind === "error") return errorFacts(reason.error, "DSH_PROFILE_TURN_FAILED");
  if (reason.kind === "blocked") {
    return {
      code: "DSH_PROFILE_TURN_BLOCKED",
      message: "DeepSeek Harness blocked the turn before it completed."
    };
  }
  return {
    code: "DSH_PROFILE_TURN_FAILED",
    message: `DeepSeek Harness ended the turn with reason "${reason.kind}".`
  };
}
function terminalOutput(output) {
  return output === "" ? {} : { output };
}
function writeCancelledResult(output, requestId, sessionId) {
  writeFrame(output, {
    v: 1,
    type: "result",
    request_id: requestId,
    status: "cancelled",
    session_id: sessionId,
    resume_rejected: false
  });
}
function requestProfileExit(exit, forceExit = () => process.exit(0), schedule = (callback, delayMs) => setTimeout(callback, delayMs)) {
  exit(0);
  schedule(forceExit, PROCESS_EXIT_FALLBACK_MS).unref();
}
function createCancellationLatch(cancelActiveAgent) {
  const pendingRequestIds = /* @__PURE__ */ new Set();
  let activeRequest;
  const cancelActive = () => {
    if (!activeRequest || activeRequest.controller.signal.aborted) return;
    activeRequest.controller.abort();
    cancelActiveAgent();
  };
  return {
    activate(requestId, controller) {
      activeRequest = { requestId, controller };
      if (pendingRequestIds.delete(requestId)) cancelActive();
    },
    cancel(requestId) {
      if (activeRequest?.requestId === requestId) {
        cancelActive();
        return;
      }
      pendingRequestIds.add(requestId);
    }
  };
}
function usageFrame(requestId, provider, model, usage) {
  return {
    v: 1,
    type: "usage",
    request_id: requestId,
    provider,
    model,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    ...usage.cacheReadTokens === void 0 ? {} : { cache_read_tokens: usage.cacheReadTokens },
    ...usage.cacheWriteTokens === void 0 ? {} : { cache_write_tokens: usage.cacheWriteTokens }
  };
}
async function listModelCatalog(ctx) {
  const catalog = [];
  for (const provider of ctx.llm.listProviders()) {
    try {
      for (const model of await ctx.llm.listModels(provider.id)) {
        const resolved = await ctx.llm.resolveModelInfo(provider.id, model.id).catch(() => null);
        catalog.push({
          provider: provider.id,
          provider_name: provider.name,
          id: model.id,
          name: model.name,
          ...resolved?.reasoning?.efforts.length ? {
            reasoning_options: resolved.reasoning.efforts.map((effort) => ({
              id: String(effort.id),
              name: effort.name,
              ...resolved.reasoning?.defaultEffort === effort.id ? { default: true } : {}
            }))
          } : {}
        });
      }
    } catch {
      ctx.logger.warn(`open-design-runtime: could not list models for provider "${provider.id}"`);
    }
  }
  return catalog;
}
function emitSessionEvent(output, request, provider, model, event) {
  switch (event.type) {
    case "assistant/chunk": {
      const chunk = event.data.chunk;
      if (chunk.type === "text-delta" && chunk.text !== "") {
        writeFrame(output, { v: 1, type: "text", request_id: request.request_id, content: chunk.text });
      } else if (chunk.type === "reasoning-delta" && chunk.text !== "") {
        writeFrame(output, { v: 1, type: "thinking", request_id: request.request_id, content: chunk.text });
      }
      return;
    }
    case "tool/call":
      writeFrame(output, {
        v: 1,
        type: "tool_call",
        request_id: request.request_id,
        call_id: String(event.data.callId),
        name: event.data.name,
        arguments: event.data.arguments
      });
      return;
    case "tool/result":
      writeFrame(output, {
        v: 1,
        type: "tool_result",
        request_id: request.request_id,
        call_id: String(event.data.message.content[0].toolCallId),
        name: event.data.error?.name ?? "tool",
        output: contentText(event.data.message.content[0].content),
        is_error: event.data.message.content[0].isError === true
      });
      return;
    case "assistant/message":
      if (event.data.usage) writeFrame(output, usageFrame(request.request_id, provider, model, event.data.usage));
      return;
    default:
      return;
  }
}
async function execute(ctx, request, output, onHandle, signal) {
  const defaultSelection = ctx.agentDefaultModel.currentSelection();
  const baseSelection = request.model ? { provider: request.model.provider, model: request.model.id } : defaultSelection;
  const selection = request.reasoning_effort ? { ...baseSelection, reasoningEffort: ReasoningEffortId(request.reasoning_effort) } : baseSelection;
  const sessionId = SessionId(request.resume_session_id ?? `od-${randomUUID()}`);
  let handle;
  let firstSeq = Number.POSITIVE_INFINITY;
  let turnEnd;
  let assistantOutput = "";
  const setup = (agentCtx) => {
    const selected = { current: selection, assembled: void 0 };
    installModelSelection(agentCtx, selected);
  };
  let disposeEvent = () => {
  };
  const onSessionEvent = (session, event) => {
    if (String(session.id) !== String(sessionId) || event.seq < firstSeq) return;
    emitSessionEvent(output, request, selection.provider, selection.model, event);
    if (event.type === "assistant/chunk" && event.data.chunk.type === "text-delta") {
      assistantOutput += event.data.chunk.text;
    }
    if (event.type === "turn/end") turnEnd = event;
  };
  try {
    try {
      handle = request.resume_session_id ? await ctx.agents.resume({ resumeSessionId: sessionId, agentOptions: selection, setup, signal }) : await ctx.agents.create({
        sessionId,
        meta: { cwd: request.cwd },
        agentOptions: selection,
        setup,
        signal
      });
      onHandle(handle);
    } catch (error) {
      if (signal.aborted) {
        writeCancelledResult(output, request.request_id, String(sessionId));
        return;
      }
      const facts = errorFacts(error, request.resume_session_id ? "DSH_PROFILE_RESUME_REJECTED" : "DSH_PROFILE_SESSION_CREATE_FAILED");
      writeFrame(output, {
        v: 1,
        type: "result",
        request_id: request.request_id,
        status: "failed",
        session_id: String(sessionId),
        resume_rejected: Boolean(request.resume_session_id),
        error: facts
      });
      return;
    }
    writeFrame(output, {
      v: 1,
      type: "session",
      request_id: request.request_id,
      session_id: String(sessionId),
      resumed: Boolean(request.resume_session_id)
    });
    await handle.agent.whenIdle();
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }
    firstSeq = handle.agent.session.seq + 1;
    disposeEvent = ctx.on("session/event", onSessionEvent);
    await handle.agent.followup(createUserMessage({
      content: [{ type: "text", text: request.prompt }],
      source: { kind: "user" }
    }));
    await handle.agent.whenIdle();
    await ctx.sessions.flush(handle.agent.session);
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }
    const reason = turnEnd?.data.reason;
    const status = resultStatus(reason);
    const failed = resultError(reason);
    writeFrame(output, {
      v: 1,
      type: "result",
      request_id: request.request_id,
      status,
      session_id: String(sessionId),
      ...terminalOutput(assistantOutput),
      stop_reason: reason?.kind ?? "unknown",
      resume_rejected: false,
      ...failed === void 0 ? {} : { error: failed }
    });
  } catch (error) {
    if (signal.aborted) {
      writeCancelledResult(output, request.request_id, String(sessionId));
      return;
    }
    writeFrame(output, {
      v: 1,
      type: "result",
      request_id: request.request_id,
      status: "failed",
      session_id: String(sessionId),
      resume_rejected: false,
      error: errorFacts(error, "DSH_PROFILE_EXECUTION_FAILED")
    });
  } finally {
    disposeEvent();
    await handle?.dispose().catch(() => void 0);
    onHandle(void 0);
  }
}
async function serve(ctx, output, exit, input = process.stdin, finishProfile = requestProfileExit) {
  writeFrame(output, identityFrame("ready", PLUGIN_VERSION));
  const lines = createInterface({ input, crlfDelay: Infinity });
  let requestId = null;
  let handle;
  let task;
  const cancellation = createCancellationLatch(() => {
    handle?.agent.cancel({ kind: "user" });
  });
  await new Promise((resolve) => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      lines.close();
      input.destroy();
      resolve();
    };
    lines.on("line", (line) => {
      if (line.trim() === "") return;
      let command;
      try {
        command = parseHostCommand(JSON.parse(line));
      } catch {
        writeFrame(output, {
          v: 1,
          type: "protocol_error",
          ...requestId ? { request_id: requestId } : {},
          code: "DSH_PROFILE_INVALID_COMMAND",
          message: "OpenDesign sent an invalid profile command."
        });
        return;
      }
      if (command.type === "cancel") {
        cancellation.cancel(command.request_id);
        return;
      }
      if (task) {
        writeFrame(output, {
          v: 1,
          type: "protocol_error",
          request_id: command.request_id,
          code: "DSH_PROFILE_BUSY",
          message: "This profile process accepts exactly one execute command."
        });
        return;
      }
      requestId = command.request_id;
      const taskAbort = new AbortController();
      cancellation.activate(requestId, taskAbort);
      task = execute(
        ctx,
        command,
        output,
        (nextHandle) => {
          handle = nextHandle;
        },
        taskAbort.signal
      );
      void task.finally(settle);
    });
    lines.on("close", () => {
      if (!task) settle();
    });
  });
  finishProfile(exit);
}
function apply(ctx) {
  const startup = ctx.openDesignStartup;
  const exit = ctx.get("appExit");
  if (!exit) throw new Error("open-design-runtime requires appExit service");
  if (!startup || !startup.mode) {
    ctx.logger.warn("open-design-runtime: OpenDesign startup mode not provided, runtime idle");
    return;
  }
  if (startup.mode === "probe") {
    writeFrame(process.stdout, identityFrame("probe", PLUGIN_VERSION));
    exit(0);
    return;
  }
  void ctx.get("loader")?.await().then(async () => {
    if (startup.mode === "models") {
      writeFrame(process.stdout, modelsFrame(await listModelCatalog(ctx)));
      exit(0);
      return;
    }
    await serve(ctx, process.stdout, exit);
  }).catch((error) => {
    process.stderr.write(`open-design-runtime: ${error instanceof Error ? error.message : String(error)}
`);
    exit(1);
  });
}
var internals = {
  contentText,
  createCancellationLatch,
  errorFacts,
  emitSessionEvent,
  execute,
  listModelCatalog,
  requestProfileExit,
  resultStatus,
  resultError,
  serve,
  terminalOutput
};
export {
  apply,
  inject,
  internals,
  name
};
