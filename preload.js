const { contextBridge, ipcRenderer } = require('electron');

// «Тонкий» API: интерфейс видит только эти функции, а не ipcRenderer целиком
contextBridge.exposeInMainWorld('api', {
  listDir: (dir) => ipcRenderer.invoke('list-dir', dir),
  getSystemInfo: () => ipcRenderer.invoke('system-info')
});
