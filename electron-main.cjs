const { app, BrowserWindow, globalShortcut, screen, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let isCompanionMode = false;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 420,
    minHeight: 300,
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

  mainWindow.setMenuBarVisibility(false);

  // Load built production application directly for instant offline startup
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Global Shortcut to toggle Always-On-Top Mini Companion: Ctrl+Shift+Space
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      if (mainWindow.isFocused()) {
        mainWindow.hide();
      } else {
        mainWindow.focus();
      }
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handlers for setting Companion Overlay Mode
ipcMain.handle('set-companion-overlay', (event, enable) => {
  if (!mainWindow) return;
  isCompanionMode = enable;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  if (enable) {
    // Mini Floating Tray in Bottom-Right above ZapZap / Zoom
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setSize(440, 560);
    mainWindow.setPosition(width - 460, height - 580);
  } else {
    // Restore Studio Dashboard Size
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setSize(1400, 900);
    mainWindow.center();
  }
});

// IPC handler for Focus Ball Mode (Compact Floating Orb)
ipcMain.handle('set-ball-overlay', (event, enable) => {
  if (!mainWindow) return;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  if (enable) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setSize(120, 120);
    mainWindow.setPosition(width - 140, height - 140);
  } else {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setSize(1400, 900);
    mainWindow.center();
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
