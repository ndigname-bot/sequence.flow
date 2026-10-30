const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  expandToStudio: () => ipcRenderer.invoke('expand-to-studio'),
  minimizeToBall: () => ipcRenderer.invoke('minimize-to-ball'),
  expandToCompanion: () => ipcRenderer.invoke('expand-to-companion'),
  closeCompanion: () => ipcRenderer.invoke('close-companion'),
  launchCompanion: () => ipcRenderer.invoke('launch-companion'),
  toggleAutoPip: (enabled) => ipcRenderer.invoke('toggle-auto-pip', enabled),
  getAutoPipStatus: () => ipcRenderer.invoke('get-auto-pip-status'),
  broadcastState: (type, payload) => ipcRenderer.send('broadcast-state', { type, payload }),
  onStateUpdated: (callback) => {
    ipcRenderer.on('state-updated', (_event, data) => callback(data));
  },
  onSetMode: (callback) => {
    ipcRenderer.on('set-mode', (_event, mode) => callback(mode));
  }
});
