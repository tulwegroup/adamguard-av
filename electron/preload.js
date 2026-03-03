const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),

  // Window controls
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),

  // Notifications
  showNotification: (title, body) => 
    ipcRenderer.invoke('show-notification', { title, body }),

  // Event listeners
  onRunScan: (callback) => 
    ipcRenderer.on('run-scan', (event, type) => callback(type)),
  
  onCheckUpdates: (callback) => 
    ipcRenderer.on('check-updates', () => callback()),

  // Remove listeners
  removeAllListeners: (channel) => 
    ipcRenderer.removeAllListeners(channel),
});

// Platform detection
contextBridge.exposeInMainWorld('platform', {
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
});
