// src/startup.ts
import { parseCmdline } from "@deepseek-ai/dsh-cmdline";
import { Command } from "commander";
var name = "open-design-startup";
var inject = ["cmdlineArgs"];
var OPEN_DESIGN_STARTUP_SERVICE = "openDesignStartup";
function apply(ctx) {
  const rawArgs = ctx.get("cmdlineArgs")?.get() ?? [];
  if (!rawArgs.some((arg) => arg === "--models" || arg === "--probe" || arg === "--stdio")) {
    ctx.provide(OPEN_DESIGN_STARTUP_SERVICE, {});
    return;
  }
  const program = new Command().name("dsh --profile open-design").description("Run the OpenDesign JSONL profile adapter.").helpOption("-h, --help", "show this help").option("--models", "print the Harness model catalog and exit").option("--probe", "print profile compatibility and exit").option("--stdio", "serve one OpenDesign run over JSONL stdio").action((options) => {
    const modes = [options.models, options.probe, options.stdio].filter(Boolean);
    if (modes.length !== 1) {
      program.error("error: exactly one of --models, --probe, or --stdio is required");
    }
    let mode = "stdio";
    if (options.models) mode = "models";
    else if (options.probe) mode = "probe";
    ctx.provide(OPEN_DESIGN_STARTUP_SERVICE, { mode });
  });
  parseCmdline(ctx, program);
}
export {
  OPEN_DESIGN_STARTUP_SERVICE,
  apply,
  inject,
  name
};
