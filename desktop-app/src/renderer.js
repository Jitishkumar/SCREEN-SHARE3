const { ipcRenderer } = require('electron');
const SimplePeer = require('simple-peer');

// Configuration
let peer = null;
let stream = null;
let audioStream = null;
let currentMode = 'off';
let isTranscribing = false;

// UI Elements
const statusDiv = document.getElementById('status');
const connectionIdDiv = document.getElementById('connection-id');
const screenSourcesDiv = document.getElementById('screen-sources');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const modeDiv = document.getElementById('current-mode');
const transcriptionDiv = document.getElementById('transcription');

// Update status
function updateStatus(message, type = 'info') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Initialize
async function initialize() {
  console.log('🚀 Initializing desktop app...');
  updateStatus('Connecting to server...', 'warning');
  
  // Don't fetch connection ID immediately - wait for connection-status event instead
  // The socket connection is async and may not be ready yet
  
  // Load screen sources
  await loadScreenSources();
}

// Load available screen sources (UNDETECTABLE METHOD)
async function loadScreenSources() {
  try {
    const sources = await ipcRenderer.invoke('get-screen-sources');
    
    screenSourcesDiv.innerHTML = '<h3>Select Screen/Window to Share:</h3>';
    
    sources.forEach(source => {
      const div = document.createElement('div');
      div.className = 'source-item';
      div.innerHTML = `
        <img src="${source.thumbnail}" width="200" />
        <p>${source.name}</p>
        <button onclick="selectSource('${source.id}')">Select</button>
      `;
      screenSourcesDiv.appendChild(div);
    });
  } catch (error) {
    console.error('Error loading sources:', error);
    updateStatus('Failed to load screen sources', 'error');
  }
}

// Select screen source
window.selectSource = async function(sourceId) {
  try {
    updateStatus('Preparing screen capture...', 'warning');

    // ANTI-DETECTION: Use Electron's desktopCapturer instead of browser API
    // Capture video only (audio capture on macOS is complex)
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          minWidth: 1280,
          maxWidth: 1920,
          minHeight: 720,
          maxHeight: 1080
        }
      }
    });

    console.log('✅ Video stream captured');

    // Note: System audio capture on macOS requires additional setup
    // For now, video only. Audio can be added later with proper configuration
    audioStream = null;

    updateStatus('✅ Screen capture ready! Waiting for mobile connection...', 'success');
    startBtn.disabled = false;
    
    // Store selected source
    window.selectedSourceId = sourceId;

  } catch (error) {
    console.error('Error capturing screen:', error);
    updateStatus('❌ Failed to capture screen. Check permissions!', 'error');
  }
};

// Start sharing
startBtn.addEventListener('click', () => {
  if (!stream) {
    updateStatus('❌ Please select a screen source first!', 'error');
    return;
  }

  ipcRenderer.send('start-sharing', window.selectedSourceId);
  updateStatus('🚀 Broadcasting... Connect from mobile app', 'success');
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

// Stop sharing
stopBtn.addEventListener('click', () => {
  stopSharing();
});

function stopSharing() {
  if (peer) {
    peer.destroy();
    peer = null;
  }
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  
  isTranscribing = false;
  currentMode = 'off';
  
  updateStatus('⏹️ Sharing stopped', 'info');
  startBtn.disabled = false;
  stopBtn.disabled = true;
  modeDiv.textContent = 'Mode: Off';
}

// Initialize WebRTC peer connection
function initializePeer(initiator = true) {
  peer = new SimplePeer({
    initiator: initiator,
    stream: stream,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });

  peer.on('signal', (data) => {
    console.log('📡 Sending signal to mobile');
    ipcRenderer.send('send-signal', {
      signal: data,
      type: 'offer'
    });
  });

  peer.on('connect', () => {
    console.log('✅ P2P connection established!');
    updateStatus('✅ Connected to mobile!', 'success');
  });

  peer.on('error', (err) => {
    console.error('❌ Peer error:', err);
    updateStatus('❌ Connection error: ' + err.message, 'error');
  });

  peer.on('close', () => {
    console.log('🔌 Connection closed');
    updateStatus('🔌 Mobile disconnected', 'warning');
  });
}

// Listen for connection status updates
ipcRenderer.on('connection-status', (event, data) => {
  if (data.connected) {
    updateStatus('✅ Connected to server', 'success');
    connectionIdDiv.textContent = `Connection ID: ${data.id}`;
  } else {
    updateStatus('❌ Disconnected from server', 'error');
  }
});

// Listen for mobile connection
ipcRenderer.on('mobile-connected', (event, data) => {
  updateStatus('📱 Mobile device connected! Starting peer connection...', 'success');
  initializePeer(true);
});

// Listen for WebRTC signals
ipcRenderer.on('signal', (event, data) => {
  if (peer && data.signal) {
    peer.signal(data.signal);
  }
});

// Listen for mode changes
ipcRenderer.on('mode-change', (event, data) => {
  currentMode = data.mode;
  modeDiv.textContent = `Mode: ${data.mode.toUpperCase()}`;
  updateStatus(`🔄 Mode changed to: ${data.mode}`, 'info');
  
  handleModeChange(data.mode);
});

// Handle mode-specific actions
async function handleModeChange(mode) {
  switch (mode) {
    case 'viewing':
      // Already streaming video
      stopAudioTranscription();
      break;
    
    case 'hearing':
      // Start audio transcription
      await startAudioTranscription();
      // Optionally pause video to save bandwidth
      break;
    
    case 'both':
      // Enable both
      await startAudioTranscription();
      break;
    
    case 'off':
      stopSharing();
      break;
  }
}

// Audio transcription using Web Speech API (FREE!)
async function startAudioTranscription() {
  if (isTranscribing) return;
  
  try {
    // Capture system audio (this requires additional permissions)
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    });

    // Use Web Speech API for transcription (completely free)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Change as needed
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        // Display transcription
        transcriptionDiv.textContent = transcript;
        
        // Send to mobile
        ipcRenderer.send('transcription', {
          text: transcript,
          timestamp: Date.now()
        });
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
      
      recognition.start();
      isTranscribing = true;
      
      // Store for cleanup
      window.speechRecognition = recognition;
      
      updateStatus('🎧 Audio transcription started', 'success');
    } else {
      updateStatus('⚠️  Speech recognition not supported', 'warning');
    }
    
  } catch (error) {
    console.error('Error starting audio transcription:', error);
    updateStatus('❌ Failed to start audio transcription', 'error');
  }
}

function stopAudioTranscription() {
  if (window.speechRecognition) {
    window.speechRecognition.stop();
    window.speechRecognition = null;
  }
  
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  
  isTranscribing = false;
  transcriptionDiv.textContent = '';
}

// AI Assistant integration (optional - not needed for simple viewing)
async function askAI(question) {
  return 'AI assistant not configured. This is optional and not needed for simple screen sharing.';
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + R: Refresh sources
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    loadScreenSources();
  }
  
  // Ctrl/Cmd + S: Start sharing
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (!startBtn.disabled) {
      startBtn.click();
    }
  }
  
  // Ctrl/Cmd + Q: Stop sharing
  if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
    e.preventDefault();
    stopBtn.click();
  }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  initialize();
});

// Export for debugging
window.debugInfo = () => {
  return {
    peer: !!peer,
    stream: !!stream,
    audioStream: !!audioStream,
    currentMode,
    isTranscribing
  };
};
