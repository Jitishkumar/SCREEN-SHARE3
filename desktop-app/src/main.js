const { app, BrowserWindow, desktopCapturer, ipcMain, screen, systemPreferences } = require('electron');
const path = require('path');
const io = require('socket.io-client');

let mainWindow;
let socket;
let captureStream;

// Server URL (change to your server)
const SERVER_URL = process.env.SERVER_URL || 'http://127.0.0.1:3000';  // Use 127.0.0.1 instead of localhost to force IPv4

// Test server connectivity first
async function testServerConnection() {
  try {
    const http = require('http');
    return new Promise((resolve, reject) => {
      const req = http.get(SERVER_URL + '/api/status', (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Server is reachable');
          resolve(true);
        } else {
          console.error('❌ Server returned status:', res.statusCode);
          resolve(false);
        }
      });
      req.on('error', (err) => {
        console.error('❌ Cannot reach server:', err.message);
        resolve(false);
      });
      req.setTimeout(5000, () => {
        req.destroy();
        console.error('❌ Server connection timeout');
        resolve(false);
      });
    });
  } catch (error) {
    console.error('❌ Server test failed:', error);
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      backgroundThrottling: false
    },
    title: 'ScreenShare Pro - Desktop',
    show: false // Don't show until ready
  });

  mainWindow.loadFile('src/index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();
  
  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Request screen capture permissions on Mac
async function requestPermissions() {
  if (process.platform === 'darwin') {
    const status = await systemPreferences.getMediaAccessStatus('screen');
    
    if (status !== 'granted') {
      console.log('⚠️  Screen recording permission required!');
      console.log('📋 Go to: System Preferences > Security & Privacy > Privacy > Screen Recording');
      console.log('✅ Enable permission for ScreenShare Pro');
    }
  }
}

// ANTI-DETECTION: Get screen sources WITHOUT triggering browser detection
async function getScreenSources() {
  try {
    // Use Electron's desktopCapturer (system-level, undetectable)
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 1920, height: 1080 }
    });

    return sources.map(source => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL()
    }));
  } catch (error) {
    console.error('❌ Failed to get screen sources:', error);
    return [];
  }
}

// Initialize Socket.IO connection
function initializeSocket() {
  console.log('🔄 Attempting to connect to:', SERVER_URL);
  
  socket = io(SERVER_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    transports: ['polling', 'websocket'],  // Try both transports
    upgrade: true
  });

  socket.on('connect', () => {
    console.log('✅ Connected to server:', socket.id);
    
    // Get IP address for mobile link
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = 'localhost';
    
    // Find the first non-internal IPv4 address
    for (const interfaceName in networkInterfaces) {
      for (const iface of networkInterfaces[interfaceName]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ipAddress = iface.address;
          break;
        }
      }
      if (ipAddress !== 'localhost') break;
    }
    
    const mobileLink = `http://${ipAddress}:3000`;
    
    // Print copyable info to terminal
    console.log('\n' + '='.repeat(60));
    console.log('📱 MOBILE ACCESS INFO (Copy these)');
    console.log('='.repeat(60));
    console.log('🔗 Mobile Link: ' + mobileLink);
    console.log('🆔 Connection ID: ' + socket.id);
    console.log('='.repeat(60) + '\n');
    
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('connection-status', { connected: true, id: socket.id });
    }
    
    // Register as desktop
    socket.emit('register-desktop', {
      deviceInfo: {
        platform: process.platform,
        hostname: require('os').hostname()
      }
    });
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('connection-status', { connected: false });
    }
  });

  // Handle mobile device connection
  socket.on('mobile-connected', (data) => {
    console.log('📱 Mobile device connected:', data.mobileId);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('mobile-connected', data);
    }
  });

  // Handle mode changes from mobile
  socket.on('mode-change', (data) => {
    console.log('🔄 Mode changed to:', data.mode);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('mode-change', data);
      handleModeChange(data.mode);
    }
  });

  // WebRTC signaling
  socket.on('signal', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('signal', data);
    }
  });
}

// Handle different sharing modes
function handleModeChange(mode) {
  switch (mode) {
    case 'viewing':
      console.log('👁️  Viewing mode: Screen sharing only');
      // Start screen capture
      mainWindow.webContents.send('start-screen-capture');
      break;
    
    case 'hearing':
      console.log('🎧 Hearing mode: Audio transcription only');
      // Start audio capture and transcription
      mainWindow.webContents.send('start-audio-capture');
      break;
    
    case 'both':
      console.log('👁️🎧 Both mode: Screen + Audio');
      // Start both
      mainWindow.webContents.send('start-both');
      break;
    
    case 'off':
      console.log('⏹️  Stopped sharing');
      mainWindow.webContents.send('stop-sharing');
      break;
  }
}

// IPC Handlers
ipcMain.handle('get-screen-sources', async () => {
  return await getScreenSources();
});

ipcMain.handle('get-connection-id', () => {
  return socket ? socket.id : null;
});

ipcMain.on('send-signal', (event, data) => {
  if (socket) {
    socket.emit('signal', data);
  }
});

ipcMain.on('start-sharing', (event, sourceId) => {
  console.log('🚀 Starting screen share with source:', sourceId);
  if (socket) {
    socket.emit('desktop-ready', { sourceId });
  }
});

ipcMain.on('transcription', (event, data) => {
  // Send transcription to mobile
  if (socket) {
    socket.emit('transcription', data);
  }
});

// App lifecycle
app.whenReady().then(async () => {
  await requestPermissions();
  
  // Test server connection first
  const serverReachable = await testServerConnection();
  if (!serverReachable) {
    console.error('⚠️  WARNING: Cannot connect to server at', SERVER_URL);
    console.error('⚠️  Make sure the server is running: cd server && npm start');
  }
  
  createWindow();
  
  // Initialize socket after window is ready
  mainWindow.webContents.once('did-finish-load', () => {
    console.log('🖥️  Window loaded, initializing socket...');
    setTimeout(() => {
      initializeSocket();
    }, 1000);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (socket) {
    socket.disconnect();
  }
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});
