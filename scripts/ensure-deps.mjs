/**
 * Runs before `npm run dev` / `build` / `start` (via pre-scripts).
 * If dependencies were never installed (fresh clone/download), installs them
 * automatically so the app "just works" on Windows CMD, PowerShell, and Unix shells.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextInstalled = existsSync(join(projectRoot, "node_modules", "next"));

if (!nextInstalled) {
  console.log("");
  console.log("  Dependencies not installed yet — running `npm install` for you.");
  console.log("  This is a one-time step and can take a minute or two...");
  console.log("");
  try {
    execSync("npm install", { cwd: projectRoot, stdio: "inherit" });
    console.log("");
    console.log("  Dependencies installed. Starting the app...");
    console.log("");
  } catch {
    console.error("");
    console.error("  `npm install` failed — see the error above.");
    console.error("  Fix the issue (usually network or Node.js version) and try again.");
    process.exit(1);
  }
}

// Make sure the locally-served Monaco Editor assets exist (postinstall does
// this too, but this covers repos updated without re-running npm install).
try {
  execSync("node scripts/copy-monaco.mjs", { cwd: projectRoot, stdio: "inherit" });
} catch {
  console.error("  Could not prepare Monaco Editor assets — see the error above.");
  process.exit(1);
}
