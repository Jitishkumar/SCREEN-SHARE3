const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Serve web viewer
app.use(express.static(path.join(__dirname, '../web-viewer')));

// Socket.IO setup
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Store active connections
const connections = {
  desktop: new Map(),  // desktopId -> socket
  mobile: new Map()    // mobileId -> socket
};

// Store pairing information
const pairs = new Map(); // desktopId -> mobileId

// Health check endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../web-viewer/index.html'));
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    service: 'ScreenShare Pro Signaling Server',
    connections: {
      desktop: connections.desktop.size,
      mobile: connections.mobile.size
    },
    uptime: process.uptime()
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 New connection: ${socket.id}`);

  // Handle desktop registration
  socket.on('register-desktop', (data) => {
    connections.desktop.set(socket.id, socket);
    console.log(`🖥️  Desktop registered: ${socket.id}`);
    
    socket.emit('registered', {
      type: 'desktop',
      id: socket.id
    });
  });

  // Handle mobile registration
  socket.on('register-mobile', (data) => {
    connections.mobile.set(socket.id, socket);
    console.log(`📱 Mobile registered: ${socket.id}`);
    
    socket.emit('registered', {
      type: 'mobile',
      id: socket.id
    });
    
    // Send list of available desktops
    const desktops = Array.from(connections.desktop.keys());
    socket.emit('available-desktops', { desktops });
  });

  // Handle pairing request from mobile
  socket.on('pair-with-desktop', (data) => {
    const { desktopId } = data;
    const mobileId = socket.id;
    
    console.log(`🔗 Pairing request: Mobile ${mobileId} -> Desktop ${desktopId}`);
    
    const desktopSocket = connections.desktop.get(desktopId);
    
    if (desktopSocket) {
      // Create pair
      pairs.set(desktopId, mobileId);
      pairs.set(mobileId, desktopId);
      
      // Notify both parties
      desktopSocket.emit('mobile-connected', { mobileId });
      socket.emit('desktop-connected', { desktopId });
      
      console.log(`✅ Paired: Desktop ${desktopId} <-> Mobile ${mobileId}`);
    } else {
      socket.emit('pairing-failed', {
        error: 'Desktop not found'
      });
      console.log(`❌ Desktop ${desktopId} not found`);
    }
  });

  // Handle desktop ready signal
  socket.on('desktop-ready', (data) => {
    const desktopId = socket.id;
    const mobileId = pairs.get(desktopId);
    
    if (mobileId) {
      const mobileSocket = connections.mobile.get(mobileId);
      if (mobileSocket) {
        mobileSocket.emit('desktop-ready', data);
        console.log(`📡 Desktop ${desktopId} ready for mobile ${mobileId}`);
      }
    }
  });

  // Handle mode change from mobile
  socket.on('change-mode', (data) => {
    const mobileId = socket.id;
    const desktopId = pairs.get(mobileId);
    
    console.log(`🔄 Mode change request from ${mobileId}: ${data.mode}`);
    
    if (desktopId) {
      const desktopSocket = connections.desktop.get(desktopId);
      if (desktopSocket) {
        desktopSocket.emit('mode-change', {
          mode: data.mode,
          mobileId
        });
        console.log(`✅ Mode changed to: ${data.mode}`);
      }
    }
  });

  // WebRTC signaling - forward signals between paired devices
  socket.on('signal', (data) => {
    const senderId = socket.id;
    const receiverId = pairs.get(senderId);
    
    if (receiverId) {
      const receiverSocket = connections.desktop.get(receiverId) || 
                            connections.mobile.get(receiverId);
      
      if (receiverSocket) {
        receiverSocket.emit('signal', {
          signal: data.signal,
          from: senderId
        });
        console.log(`📡 Signal forwarded: ${senderId} -> ${receiverId}`);
      }
    }
  });

  // Handle transcription from desktop
  socket.on('transcription', (data) => {
    const desktopId = socket.id;
    const mobileId = pairs.get(desktopId);
    
    if (mobileId) {
      const mobileSocket = connections.mobile.get(mobileId);
      if (mobileSocket) {
        mobileSocket.emit('transcription', data);
      }
    }
  });

  // Handle AI requests from mobile
  socket.on('ai-request', (data) => {
    const mobileId = socket.id;
    const desktopId = pairs.get(mobileId);
    
    if (desktopId) {
      const desktopSocket = connections.desktop.get(desktopId);
      if (desktopSocket) {
        desktopSocket.emit('ai-request', {
          question: data.question,
          mobileId
        });
      }
    }
  });

  // Handle AI response from desktop
  socket.on('ai-response', (data) => {
    const desktopId = socket.id;
    const mobileId = data.mobileId || pairs.get(desktopId);
    
    if (mobileId) {
      const mobileSocket = connections.mobile.get(mobileId);
      if (mobileSocket) {
        mobileSocket.emit('ai-response', {
          answer: data.answer
        });
      }
    }
  });

  // Handle chat between mobile users
  socket.on('mobile-chat', (data) => {
    const senderId = socket.id;
    
    // Only allow mobile users to send chat
    if (!connections.mobile.has(senderId)) {
      console.log('❌ Non-mobile user tried to send chat');
      return;
    }
    
    console.log(`💬 Chat from ${senderId}: ${data.text}`);
    
    // Broadcast to ALL mobile users (including sender)
    connections.mobile.forEach((mobileSocket, mobileId) => {
      mobileSocket.emit('mobile-chat-broadcast', {
        text: data.text,
        timestamp: data.timestamp,
        senderId: senderId
      });
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 Disconnected: ${socket.id}`);
    
    // Get paired device
    const pairedId = pairs.get(socket.id);
    
    // Notify paired device
    if (pairedId) {
      const pairedSocket = connections.desktop.get(pairedId) || 
                          connections.mobile.get(pairedId);
      
      if (pairedSocket) {
        pairedSocket.emit('peer-disconnected', {
          peerId: socket.id
        });
      }
      
      // Remove pairing
      pairs.delete(socket.id);
      pairs.delete(pairedId);
    }
    
    // Remove from connections
    connections.desktop.delete(socket.id);
    connections.mobile.delete(socket.id);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
});

// Start server - Listen on all network interfaces (0.0.0.0)
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // This allows external connections!

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 ScreenShare Pro Server');
  console.log('='.repeat(60));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://YOUR_IP:${PORT}`);
  console.log(`🔒 Privacy: All connections are peer-to-peer via WebRTC`);
  console.log('='.repeat(60));
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⏹️  SIGTERM received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⏹️  SIGINT received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});
