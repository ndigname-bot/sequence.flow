const { app, BrowserWindow, globalShortcut, screen, ipcMain } = require('electron');
const path = require('path');

let studioWindow = null;
let floatingWindow = null;
let currentFloatingMode = 'companion'; // 'companion' | 'ball'
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

  // Intercept Minimize: Like Zoom, automatically enters floating Companion PiP
  studioWindow.on('minimize', (e) => {
    e.preventDefault();
    switchToCompanion();
  });

  // Intercept Close: Like Zoom, stays active as floating companion rather than losing session
  studioWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      switchToCompanion();
    }
  });

  // Intercept Blur (Switching away to WhatsApp / Zoom / Browser)
  studioWindow.on('blur', () => {
    if (!autoPipEnabled) return;
    clearTimeout(blurTimer);
    blurTimer = setTimeout(() => {
      if (studioWindow && !studioWindow.isDestroyed() && !studioWindow.isFocused() && studioWindow.isVisible()) {
        switchToCompanion();
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

function getOrCreateFloatingWindow(initialMode = 'companion') {
  if (floatingWindow && !floatingWindow.isDestroyed()) {
    return floatingWindow;
  }

  currentFloatingMode = initialMode;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const isBall = initialMode === 'ball';
  const winWidth = isBall ? 140 : 440;
  const winHeight = isBall ? 140 : 580;
  const winX = width - winWidth - 20;
  const winY = height - winHeight - 20;

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

  win.setSize(440, 580);
  const newX = Math.max(10, Math.min(currentX, width - 460));
  const newY = Math.max(10, Math.min(currentY, height - 600));
  win.setPosition(newX, newY);
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
  const newX = Math.max(10, Math.min(currentX, width - 150));
  const newY = Math.max(10, Math.min(currentY, height - 150));
  win.setPosition(newX, newY);
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
  createStudioWindow();
  getOrCreateFloatingWindow('companion');

  // Global Shortcut to toggle Always-On-Top Mini Companion: Ctrl+Shift+Space
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (floatingWindow && floatingWindow.isVisible()) {
      floatingWindow.hide();
    } else if (studioWindow && studioWindow.isVisible()) {
      switchToCompanion();
    } else {
      switchToCompanion();
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
      getOrCreateFloatingWindow('companion');
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
