#!/usr/bin/env bash
# Sequence Flow Native Desktop Launcher
cd "$(dirname "$0")"

# Ensure dev server or build is running
if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
  echo "Starting Sequence Flow background server..."
  npm run dev &
  sleep 2
fi

echo "Launching Sequence Flow Native Linux Desktop App..."
npx electron electron-main.cjs
