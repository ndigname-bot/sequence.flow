const { app, BrowserWindow, globalShortcut, screen, ipcMain } = require('electron');
const path = require('path');

let studioWindow = null;
let companionWindow = null;
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

function createCompanionWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  companionWindow = new BrowserWindow({
    width: 440,
    height: 580,
    x: width - 460,
    y: height - 600,
    minWidth: 420,
    minHeight: 520,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    skipTaskbar: true,
    show: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.cjs')
    },
    icon: path.join(__dirname, 'public/icon.svg')
  });

  companionWindow.setAlwaysOnTop(true, 'screen-saver');

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    companionWindow.loadURL(`${devUrl}?mode=companion`);
  } else {
    companionWindow.loadFile(path.join(__dirname, 'dist/index.html'), { query: { mode: 'companion' } });
  }

  companionWindow.on('closed', () => {
    companionWindow = null;
  });
}

function switchToCompanion() {
  if (studioWindow && !studioWindow.isDestroyed() && studioWindow.isVisible()) {
    studioWindow.hide();
  }
  if (!companionWindow || companionWindow.isDestroyed()) {
    createCompanionWindow();
  }
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  companionWindow.setSize(440, 580);
  companionWindow.setPosition(width - 460, height - 600);
  companionWindow.setAlwaysOnTop(true, 'screen-saver');
  companionWindow.show();
  companionWindow.webContents.send('set-mode', 'companion');
}

function switchToStudio() {
  if (companionWindow && !companionWindow.isDestroyed()) {
    companionWindow.hide();
  }
  if (!studioWindow || studioWindow.isDestroyed()) {
    createStudioWindow();
  }
  if (studioWindow.isMinimized()) {
    studioWindow.restore();
  }
  studioWindow.show();
  studioWindow.focus();
}

function switchToBall() {
  if (!companionWindow || companionWindow.isDestroyed()) return;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  companionWindow.setSize(100, 100);
  companionWindow.setPosition(width - 120, height - 120);
  companionWindow.setAlwaysOnTop(true, 'screen-saver');
  companionWindow.webContents.send('set-mode', 'ball');
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
  if (companionWindow && !companionWindow.isDestroyed()) {
    companionWindow.hide();
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

// Broadcast state between windows
ipcMain.on('broadcast-state', (event, { type, payload }) => {
  if (studioWindow && !studioWindow.isDestroyed() && event.sender !== studioWindow.webContents) {
    studioWindow.webContents.send('state-updated', { type, payload });
  }
  if (companionWindow && !companionWindow.isDestroyed() && event.sender !== companionWindow.webContents) {
    companionWindow.webContents.send('state-updated', { type, payload });
  }
});

app.whenReady().then(() => {
  createStudioWindow();
  createCompanionWindow();

  // Global Shortcut to toggle Always-On-Top Mini Companion: Ctrl+Shift+Space
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (companionWindow && companionWindow.isVisible()) {
      companionWindow.hide();
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
      createCompanionWindow();
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
