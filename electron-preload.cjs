const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setCompanionOverlay: (enable) => ipcRenderer.invoke('set-companion-overlay', enable),
  setBallOverlay: (enable) => ipcRenderer.invoke('set-ball-overlay', enable)
});
