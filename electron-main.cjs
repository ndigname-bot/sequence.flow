const { app, BrowserWindow, globalShortcut, screen, ipcMain, session } = require('electron');
const path = require('path');

// Force X11 / XWayland backend on Linux so Mutter honors bottom-right docking and dragging
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('ozone-platform', 'x11');
}

let studioWindow = null;
let floatingWindow = null;
let currentFloatingMode = 'ball'; // Default to compact floating ball
let isQuitting = false;
let autoPipEnabled = true;
let blurTimer = null;

function createStudioWindow() {
  studioWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    autoHideMenuBar: true,
    backgroundColor: '#04070F',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.cjs')
    },
    icon: path.join(__dirname, 'public/icon.svg')
  });

  studioWindow.setMenuBarVisibility(false);

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    studioWindow.loadURL(`${devUrl}?mode=studio`);
  } else {
    studioWindow.loadFile(path.join(__dirname, 'dist/index.html'), { query: { mode: 'studio' } });
  }

  // Intercept Minimize: Like Zoom/Gemini, enters compact floating Focus Ball in bottom-right corner
  studioWindow.on('minimize', (e) => {
    e.preventDefault();
    switchToBall();
  });

  // Intercept Close: Like Zoom, stays active as floating ball rather than terminating focus session
  studioWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      switchToBall();
    }
  });

  // Intercept Blur (Switching away to WhatsApp / Zoom / Browser)
  studioWindow.on('blur', () => {
    if (!autoPipEnabled) return;
    clearTimeout(blurTimer);
    blurTimer = setTimeout(() => {
      if (studioWindow && !studioWindow.isDestroyed() && !studioWindow.isFocused() && studioWindow.isVisible()) {
        switchToBall();
      }
    }, 1200);
  });

  studioWindow.on('focus', () => {
    clearTimeout(blurTimer);
  });

  studioWindow.on('closed', () => {
    studioWindow = null;
  });
}

function getOrCreateFloatingWindow(initialMode = 'ball') {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    return floatingWindow;
  }

  currentFloatingMode = initialMode;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const isBall = initialMode === 'ball';
  const winWidth = isBall ? 140 : 460;
  const winHeight = isBall ? 140 : 560;
  const winX = width - winWidth - 24;
  const winY = height - winHeight - 24;

  floatingWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: winX,
    y: winY,
    type: 'utility',
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.cjs')
    },
    icon: path.join(__dirname, 'public/icon.svg')
  });

  floatingWindow.setAlwaysOnTop(true, 'screen-saver');
  floatingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    floatingWindow.loadURL(`${devUrl}?mode=${initialMode}`);
  } else {
    floatingWindow.loadFile(path.join(__dirname, 'dist/index.html'), { query: { mode: initialMode } });
  }

  floatingWindow.on('closed', () => {
    floatingWindow = null;
  });

  return floatingWindow;
}

function switchToCompanion() {
  if (studioWindow && !studioWindow.isDestroyed() && studioWindow.isVisible()) {
    studioWindow.hide();
  }

  const win = getOrCreateFloatingWindow('companion');
  currentFloatingMode = 'companion';

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const [currentX, currentY] = win.getPosition();

  win.setSize(460, 560);
  // Dock in bottom-right area, clamping safely inside visible work area
  const targetX = Math.max(20, Math.min(currentX || (width - 480), width - 480));
  const targetY = Math.max(20, Math.min(currentY || (height - 580), height - 580));
  win.setPosition(targetX, targetY);
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.show();
  win.webContents.send('set-mode', 'companion');
}

function switchToBall() {
  if (studioWindow && !studioWindow.isDestroyed() && studioWindow.isVisible()) {
    studioWindow.hide();
  }

  const win = getOrCreateFloatingWindow('ball');
  currentFloatingMode = 'ball';

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const [currentX, currentY] = win.getPosition();

  win.setSize(140, 140);
  // Dock in bottom-right corner
  const targetX = Math.max(20, Math.min(currentX || (width - 160), width - 160));
  const targetY = Math.max(20, Math.min(currentY || (height - 160), height - 160));
  win.setPosition(targetX, targetY);
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.show();
  win.webContents.send('set-mode', 'ball');
}

function switchToStudio() {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.hide();
  }

  if (!studioWindow || studioWindow.isDestroyed()) {
    createStudioWindow();
    return;
  }

  if (studioWindow.isMinimized()) {
    studioWindow.restore();
  }
  studioWindow.show();
  studioWindow.focus();
}

// IPC Handlers
ipcMain.handle('expand-to-studio', () => {
  switchToStudio();
});

ipcMain.handle('expand-to-companion', () => {
  switchToCompanion();
});

ipcMain.handle('minimize-to-ball', () => {
  switchToBall();
});

ipcMain.handle('close-companion', () => {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    floatingWindow.hide();
  }
});

ipcMain.handle('launch-companion', () => {
  switchToCompanion();
});

ipcMain.handle('toggle-auto-pip', (event, enabled) => {
  autoPipEnabled = typeof enabled === 'boolean' ? enabled : !autoPipEnabled;
  return autoPipEnabled;
});

ipcMain.handle('get-auto-pip-status', () => {
  return autoPipEnabled;
});

// Real-time window movement via IPC dragging with display clamping
ipcMain.on('move-window', (event, { deltaX, deltaY }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || win.isDestroyed()) return;
  const [x, y] = win.getPosition();
  const [winW, winH] = win.getSize();
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });
  const { x: dispX, y: dispY, width: dispW, height: dispH } = currentDisplay.workArea;

  const targetX = Math.round(x + deltaX);
  const targetY = Math.round(y + deltaY);

  const clampedX = Math.max(dispX - winW + 40, Math.min(dispX + dispW - 40, targetX));
  const clampedY = Math.max(dispY, Math.min(dispY + dispH - 40, targetY));

  win.setPosition(clampedX, clampedY);
});

// Broadcast state between windows
ipcMain.on('broadcast-state', (event, { type, payload }) => {
  if (studioWindow && !studioWindow.isDestroyed() && event.sender !== studioWindow.webContents) {
    studioWindow.webContents.send('state-updated', { type, payload });
  }
  if (floatingWindow && !floatingWindow.isDestroyed() && event.sender !== floatingWindow.webContents) {
    floatingWindow.webContents.send('state-updated', { type, payload });
  }
});

app.whenReady().then(() => {
  // Allow microphone / media access for voice recording notes
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true);
    } else {
      callback(true);
    }
  });

  createStudioWindow();
  getOrCreateFloatingWindow('ball');

  // Global Shortcut to toggle Always-On-Top Mini Companion: Ctrl+Shift+Space
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (floatingWindow && floatingWindow.isVisible()) {
      floatingWindow.hide();
    } else if (studioWindow && studioWindow.isVisible()) {
      switchToBall();
    } else {
      switchToBall();
    }
  });

  // Global Shortcut to safely quit: Ctrl+Q
  globalShortcut.register('CommandOrControl+Q', () => {
    isQuitting = true;
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createStudioWindow();
      getOrCreateFloatingWindow('ball');
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
