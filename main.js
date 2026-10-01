const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // значения по умолчанию в актуальных версиях Electron, указаны явно
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile('index.html');
}

// Задание 3: чтение каталога средствами Node.js (fs → POSIX opendir/readdir)
ipcMain.handle('list-dir', async (event, dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return {
    path: path.resolve(dir),
    entries: entries.map(e => ({ name: e.name, isDir: e.isDirectory() }))
  };
});

// Задание 4 (вариант 2): информация о системе
ipcMain.handle('system-info', () => {
  const cpus = os.cpus();
  return {
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    cpuCount: cpus.length,
    cpuModel: cpus[0] ? cpus[0].model : 'неизвестно',
    totalMem: os.totalmem(),
    freeMem: os.freemem()
  };
});

app.whenReady().then(() => {
  createWindow();
  // macOS: приложение живёт без окон, клик по значку в Dock создаёт окно заново
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
