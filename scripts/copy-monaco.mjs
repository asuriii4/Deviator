/**
 * Copies the Monaco Editor runtime from node_modules into public/monaco so the
 * code editor is served from localhost instead of a CDN. Runs on postinstall
 * and from ensure-deps; safe to run repeatedly (skips when already in sync).
 */
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(projectRoot, "node_modules", "monaco-editor", "min", "vs");
const target = join(projectRoot, "public", "monaco", "vs");
const versionMarker = join(projectRoot, "public", "monaco", ".version");

if (!existsSync(source)) {
  console.error("  monaco-editor package not found — run `npm install` first.");
  process.exit(1);
}

const installedVersion = JSON.parse(
  readFileSync(join(projectRoot, "node_modules", "monaco-editor", "package.json"), "utf8")
).version;

const copiedVersion = existsSync(versionMarker)
  ? readFileSync(versionMarker, "utf8").trim()
  : null;

if (copiedVersion === installedVersion && existsSync(join(target, "loader.js"))) {
  process.exit(0);
}

console.log(`  Copying Monaco Editor v${installedVersion} into public/monaco (served from localhost)...`);
cpSync(source, target, { recursive: true });
writeFileSync(versionMarker, `${installedVersion}\n`);
console.log("  Monaco Editor assets ready.");
