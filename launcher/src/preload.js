// Brücke zwischen Launcher-Oberfläche und Hauptprozess
const { contextBridge, ipcRenderer } = require('electron');
const on = (ch) => (fn) => { const h = (_e, d) => fn(d); ipcRenderer.on(ch, h); return () => ipcRenderer.removeListener(ch, h); };
contextBridge.exposeInMainWorld('launcher', {
  state: () => ipcRenderer.invoke('state'),
  manifest: () => ipcRenderer.invoke('manifest'),
  install: (v) => ipcRenderer.invoke('install', v),
  remove: (id) => ipcRenderer.invoke('remove', id),
  importZip: () => ipcRenderer.invoke('import'),
  setSettings: (p) => ipcRenderer.invoke('settings', p),
  launch: (id, account) => ipcRenderer.invoke('launch', { id, account }),
  win: (a) => ipcRenderer.invoke('win', a),
  openFolder: () => ipcRenderer.invoke('open-folder'),
  openExternal: (u) => ipcRenderer.invoke('open-external', u),
  installUpdate: () => ipcRenderer.invoke('updater:install'),
  onProgress: on('install-progress'), onUpdater: on('updater'),
  onGameStarted: on('game-started'), onGameClosed: on('game-closed')
});
