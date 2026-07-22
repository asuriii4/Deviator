#!/usr/bin/env bash
# Kodeon 1v1 Coding Arena - macOS / Linux launcher.
# Run with: ./start-unix.sh
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed. Install the LTS version from https://nodejs.org"
  exit 1
fi

echo "[1/3] Node.js found: $(node --version)"

if [ ! -d node_modules ]; then
  echo "[2/3] Installing dependencies (first run only)..."
  npm install
else
  echo "[2/3] Dependencies already installed — skipping npm install."
fi

echo "[3/3] Starting the dev server at http://localhost:3000 ..."
npm run dev
