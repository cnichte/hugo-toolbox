#!/usr/bin/env node
/**
 * The one and only Hugo-Toolbox.
 * 
 * My personal Swiss-Army-Tool for Hugo.
 * This is a wrapper arround some usefull tools.
 * 
 * @author Carsten Nichte, 2025
 * 
 */
// bin/hugo-toolbox.mjs
import { spawn } from "child_process";
import { createRequire } from "module";
import path from "path";
import pc from "picocolors";

const require = createRequire(import.meta.url);

function printHelp() {
  console.log(`
${pc.bold("hugo-toolbox")} – Helper scripts for Hugo projects

${pc.bold("Usage:")}
  hugo-toolbox <command> [...args]

${pc.bold("Commands:")}
  ${pc.cyan("update-lastmod")}   Updated lastmod in Hugo bundles
  ${pc.cyan("clean-cache")}      Deletes Hugo caches / generated resources
  ${pc.cyan("sync")}             SFTP-Sync (Wrapper around sftp-push-sync)
  ${pc.cyan("check-links")}      Broken-Link-Check (Wrapper around hugo-broken-links-checker)

Examples:
  hugo-toolbox update-lastmod
  hugo-toolbox clean-cache
  hugo-toolbox sync staging --dry-run
  hugo-toolbox sync prod
  hugo-toolbox check-links
  hugo-toolbox check-links --dry-run
  hugo-toolbox check-links --config hugo-broken-links-checker.config.json

  You can find detailed instructions in the git repos.
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
        console.error(pc.red(`Subprozess durch Signal beendet: ${signal}`));
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

      case "check-links": {
        // Erwartet ein eigenes Modul zB.:
        //  "name": "hugo-broken-links",
        //  "bin": { "hugo-broken-links": "bin/hugo-broken-links.mjs" }
        const bin = resolveBin("hugo-broken-links-checker", "hugo-broken-links-checker");
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