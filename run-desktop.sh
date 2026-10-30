#!/usr/bin/env bash
# Sequence Flow Native Desktop Launcher
cd "$(dirname "$0")"

export DISPLAY="${DISPLAY:-:0}"
# Unset WAYLAND_DISPLAY so Electron runs on XWayland where window positioning and dragging work reliably
unset WAYLAND_DISPLAY

echo "Launching Sequence Flow Desktop App..."
./node_modules/.bin/electron --ozone-platform=x11 electron-main.cjs
