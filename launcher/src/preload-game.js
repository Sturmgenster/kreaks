// Gibt dem Spiel das angemeldete Konto (UUID + Spielername) mit
const { contextBridge, ipcRenderer } = require('electron');
const acc = ipcRenderer.sendSync('game-account');
contextBridge.exposeInMainWorld('KREAKS_ACCOUNT', acc ? Object.freeze({ uuid: String(acc.uuid), name: String(acc.name || ''), licensed: !!acc.licensed, demo: !!acc.demo }) : null);
contextBridge.exposeInMainWorld('KREAKS_LAUNCHER', true);
