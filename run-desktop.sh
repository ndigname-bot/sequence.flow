#!/usr/bin/env bash
# Sequence Flow Native Desktop Launcher
cd "$(dirname "$0")"

export DISPLAY="${DISPLAY:-:0}"
export WAYLAND_DISPLAY="${WAYLAND_DISPLAY:-wayland-0}"

echo "Launching Sequence Flow Desktop App..."
./node_modules/.bin/electron electron-main.cjs
