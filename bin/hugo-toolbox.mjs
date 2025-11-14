#!/usr/bin/env node

import { spawn } from "child_process";
import pc from "picocolors";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const cmd = args[0];
const rest = args.slice(1);

function printHelp() {
  console.log(pc.bold("\nHugo Toolbox"));
  console.log("");
  console.log(pc.bold("Usage:"));
  console.log("  hugo-toolbox <command> [...args]\n");
  console.log(pc.bold("Commands:"));
  console.log("  update-lastmod          Run hugo-update-lastmod (update index.md lastmod from images)");
  console.log("  clean-cache             Run hugo-clean-cache (remove Hugo caches/resources)");
  console.log("  sync <conn> [--dry-run] Run sftp-push-sync for connection <conn>");
  console.log("");
  console.log(pc.bold("Examples:"));
  console.log("  hugo-toolbox update-lastmod");
  console.log("  hugo-toolbox clean-cache");
  console.log("  hugo-toolbox sync staging --dry-run");
  console.log("  hugo-toolbox sync prod\n");
}

function runChild(binName, binArgs) {
  const child = spawn(binName, binArgs, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });

  child.on("error", (err) => {
    console.error(pc.red(`❌ Fehler beim Starten von ${binName}:`), err.message);
    process.exit(1);
  });
}

if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
  printHelp();
  process.exit(0);
}

switch (cmd) {
  case "update-lastmod":
    runChild("hugo-update-lastmod", rest);
    break;

  case "clean-cache":
    runChild("hugo-clean-cache", rest);
    break;

  case "sync":
    if (!rest[0]) {
      console.error(pc.red("❌ Bitte eine Verbindung angeben, z. B.:"));
      console.error(pc.yellow("   hugo-toolbox sync staging --dry-run\n"));
      process.exit(1);
    }
    runChild("sftp-push-sync", rest);
    break;

  default:
    console.error(pc.red(`❌ Unbekannter Befehl: ${cmd}`));
    printHelp();
    process.exit(1);
}