#!/usr/bin/env node
import { spawn } from "child_process";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import pc from "picocolors";

const require = createRequire(import.meta.url);

function printHelp() {
  console.log(`
${pc.bold("hugo-toolbox")} – Helferskripte für Hugo-Projekte

${pc.bold("Usage:")}
  hugo-toolbox <command> [...args]

${pc.bold("Commands:")}
  ${pc.cyan("update-lastmod")}   Aktualisiert lastmod in Hugo-Bundles
  ${pc.cyan("clean-cache")}      Löscht Hugo-Caches / generierte Ressourcen
  ${pc.cyan("sync")}             SFTP-Sync (Wrapper um sftp-push-sync)

Beispiele:
  hugo-toolbox update-lastmod
  hugo-toolbox clean-cache
  hugo-toolbox sync staging --dry-run
  hugo-toolbox sync prod
`);
}

/**
 * Findet den Bin-Pfad eines Pakets über dessen package.json
 */
function resolveBin(pkgName, binName = pkgName) {
  const pkgJsonPath = require.resolve(`${pkgName}/package.json`);
  const pkg = require(pkgJsonPath);
  let relBin;

  if (typeof pkg.bin === "string") {
    // z.B. "bin/something.mjs"
    relBin = pkg.bin;
  } else if (pkg.bin && pkg.bin[binName]) {
    // z.B. { "hugo-update-lastmod": "bin/hugo-update-lastmod.mjs" }
    relBin = pkg.bin[binName];
  } else {
    throw new Error(
      `Kein bin-Eintrag für "${binName}" in package "${pkgName}" gefunden.`
    );
  }

  return path.join(path.dirname(pkgJsonPath), relBin);
}

/**
 * Startet einen Subprozess: node <binPath> ...args
 */
function runSubcommand(binPath, args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [binPath, ...args], {
      stdio: "inherit",
    });

    child.on("exit", (code, signal) => {
      if (signal) {
        console.error(
          pc.red(`Subprozess durch Signal beendet: ${signal}`)
        );
        process.exitCode = 1;
      } else if (typeof code === "number") {
        process.exitCode = code;
      }
      resolve();
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
    printHelp();
    return;
  }

  const rest = args.slice(1);

  try {
    switch (cmd) {
      case "update-lastmod": {
        const bin = resolveBin("hugo-update-lastmod", "hugo-update-lastmod");
        await runSubcommand(bin, rest);
        break;
      }

      case "clean-cache": {
        const bin = resolveBin("hugo-clean-cache", "hugo-clean-cache");
        await runSubcommand(bin, rest);
        break;
      }

      case "sync": {
        const bin = resolveBin("sftp-push-sync", "sftp-push-sync");
        await runSubcommand(bin, rest);
        break;
      }

      default:
        console.error(pc.red(`Unbekanntes Kommando: ${cmd}\n`));
        printHelp();
        process.exitCode = 1;
    }
  } catch (err) {
    console.error(pc.red("❌ Fehler im hugo-toolbox CLI:"), err.message || err);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(pc.red("❌ Unerwarteter Fehler in hugo-toolbox:"), err);
  process.exit(1);
});