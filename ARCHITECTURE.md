# 🏗️ ScreenShare Pro - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR MAC                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Any Application (Browser, Netflix, etc.)              │ │
│  │  ↓ (User sees this)                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↓                                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ScreenCaptureKit (macOS System API)                   │ │
│  │  🔒 UNDETECTABLE - Captures BEFORE browser security    │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↓                                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Desktop App (Electron)                                │ │
│  │  - Captures frames                                      │ │
│  │  - Encodes video                                        │ │
│  │  - Manages WebRTC connection                            │ │
│  │  - Handles transcription (Web Speech API)               │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↓ (Encrypted WebRTC)                                │
└─────────┼───────────────────────────────────────────────────┘
          │
          │ ┌──────────────────────────────────────────┐
          └─│  Signaling Server (Node.js + Socket.IO)  │
            │  - Brokers P2P connection                 │
            │  - Routes control messages                │
            │  - NO video/audio passes through          │
            └──────────────────────────────────────────┘
          │
          ↓ (Direct P2P connection established)
┌─────────────────────────────────────────────────────────────┐
│                  YOUR ANDROID PHONE                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Mobile App (React Native)                             │ │
│  │  - Receives WebRTC stream                              │ │
│  │  - Displays video                                       │ │
│  │  - Shows transcription                                  │ │
│  │  - Controls modes                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↓                                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Your Screen                                            │ │
│  │  👁️ Mac screen appears here                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Screen Capture Layer (Mac)

**Technology**: macOS ScreenCaptureKit API

```
┌─────────────────────────────────────┐
│     ScreenCaptureKit                │
│                                     │
│  ✅ System-level capture            │
│  ✅ Bypasses browser detection      │
│  ✅ Direct framebuffer access       │
│  ✅ HDCP-compliant capture           │
│  ✅ Per-window or full screen       │
└─────────────────────────────────────┘
         ↓ Raw frames
┌─────────────────────────────────────┐
│   Electron Main Process             │
│                                     │
│  - Frame encoding (H.264)           │
│  - Audio capture                    │
│  - WebRTC peer management           │
└─────────────────────────────────────┘
```

**Why This is Undetectable:**

1. **System-Level**: Captures BEFORE browser security checks
2. **No JavaScript APIs**: Doesn't use `getDisplayMedia()` that websites can detect
3. **Direct GPU Access**: Framebuffer capture, not screen recording
4. **No Virtual Displays**: Real system capture, not emulated

---

### 2. Desktop Application (Electron)

**File Structure:**
```
desktop-app/
├── src/
│   ├── main.js           # Main process (Node.js)
│   │                     # - Screen capture
│   │                     # - Socket.IO connection
│   │                     # - IPC handlers
│   │
│   ├── renderer.js       # Renderer process (Browser)
│   │                     # - UI logic
│   │                     # - WebRTC peer
│   │                     # - Transcription
│   │
│   └── index.html        # UI
│
├── package.json
└── entitlements.mac.plist # macOS permissions
```

**Key Technologies:**
- **Electron**: Cross-platform desktop framework
- **WebRTC**: Peer-to-peer video streaming
- **Socket.IO**: Real-time signaling
- **Simple Peer**: WebRTC abstraction
- **Web Speech API**: Transcription

---

### 3. Signaling Server (Node.js)

**Purpose**: Broker WebRTC connections (doesn't handle media)

```
┌─────────────────────────────────────────┐
│     Signaling Server                    │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Socket.IO Event Handlers:       │  │
│  │                                   │  │
│  │  register-desktop                 │  │
│  │  register-mobile                  │  │
│  │  pair-with-desktop                │  │
│  │  signal (WebRTC)                  │  │
│  │  change-mode                      │  │
│  │  transcription                    │  │
│  │  ai-request                       │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**File Structure:**
```
server/
├── index.js         # Main server file
│                   # - Express server
│                   # - Socket.IO handlers
│                   # - Connection management
│
└── package.json
```

**What It Does:**
1. Maintains connection registry (desktop ↔ mobile)
2. Routes WebRTC signaling messages
3. Forwards mode changes
4. Relays transcription data
5. Handles AI requests

**What It Does NOT Do:**
- ❌ Store any data
- ❌ Record streams
- ❌ Decrypt video/audio
- ❌ Log user activity

---

### 4. Mobile Application (React Native)

**File Structure:**
```
mobile-app/
├── src/
│   ├── App.js            # Main app component
│   │                     # - Connection logic
│   │                     # - WebRTC peer
│   │                     # - Mode controls
│   │
│   ├── StreamViewer.js   # Video display
│   │                     # - RTCView component
│   │                     # - Stream rendering
│   │
│   └── Controls.js       # Mode switcher
│                         # - Button grid
│                         # - AI assistant button
│
└── package.json
```

**Key Technologies:**
- **React Native**: Cross-platform mobile framework
- **react-native-webrtc**: WebRTC for React Native
- **Socket.IO Client**: Server connection
- **Simple Peer**: WebRTC abstraction (mobile version)

---

## Data Flow Diagrams

### Connection Establishment Flow

```
Desktop                Server              Mobile
  │                      │                   │
  │──register-desktop──→│                   │
  │←────registered──────│                   │
  │                      │←register-mobile──│
  │                      │────registered───→│
  │                      │                   │
  │                      │←pair-with-desktop─│
  │←mobile-connected────│                   │
  │                      │──desktop-conn.──→│
  │                      │                   │
  │──WebRTC offer──────→│──WebRTC offer───→│
  │←─WebRTC answer──────│←WebRTC answer────│
  │                      │                   │
  │═══════════════ P2P Stream ═══════════════│
  │                      │                   │
```

**After connection established:**
- Video/audio flows directly between devices (P2P)
- Server only routes control messages

---

### Mode Change Flow

```
Mobile               Server              Desktop
  │                    │                   │
  │──change-mode─────→│                   │
  │   (mode: "both")   │                   │
  │                    │──mode-change────→│
  │                    │                   │
  │                    │                   ├─Start screen capture
  │                    │                   ├─Start audio capture
  │                    │                   ├─Start transcription
  │                    │                   │
  │                    │←──confirmed──────│
  │←───mode-changed───│                   │
  │                    │                   │
  │                                        │
  │═══════ Video Stream ═══════════════════│
  │                                        │
  │←─────── Transcription Text ───────────│
```

---

### Transcription Flow

```
Mac Microphone
      ↓
  Audio Capture
      ↓
Web Speech API (Browser)
      ↓
  Text Output
      ↓
Desktop App (renderer.js)
      ↓ (via Socket.IO)
  Server
      ↓ (forwarded)
Mobile App
      ↓
Display on Screen
```

---

## Security Architecture

### Encryption Layers

```
┌──────────────────────────────────────────┐
│  Application Layer                       │
│  - User authentication (future)          │
│  - API keys (AI assistant)               │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  Transport Layer (WebRTC)                │
│  - DTLS encryption (video/audio)         │
│  - SRTP (media streams)                  │
│  - End-to-end encrypted                  │
└──────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  Network Layer                           │
│  - TLS/SSL (Socket.IO signaling)         │
│  - HTTPS (optional)                      │
└──────────────────────────────────────────┘
```

### Privacy by Design

**Data Minimization:**
- Server doesn't store any data
- No logs, no analytics
- Minimal connection metadata only

**Encryption:**
- All streams encrypted via WebRTC (DTLS-SRTP)
- Signaling over TLS (when using HTTPS)
- No plaintext transmission

**User Control:**
- Self-hosted option
- Local network mode (no internet)
- Can run completely offline

---

## Performance Characteristics

### Latency

```
Component                  Latency      Notes
─────────────────────────────────────────────
Screen Capture            <10ms        ScreenCaptureKit
Encoding (H.264)          10-20ms      Hardware accelerated
Network (Local WiFi)      5-20ms       Same network
Network (Internet)        50-200ms     Via ngrok/cloud
Decoding (Mobile)         10-20ms      Hardware accelerated
Display                   <5ms         Direct rendering
─────────────────────────────────────────────
TOTAL (Local)            30-75ms       ✅ Excellent
TOTAL (Remote)           75-265ms      ⚠️  Acceptable
```

### Bandwidth

```
Quality         Resolution   FPS   Bitrate    Bandwidth/Hour
──────────────────────────────────────────────────────────
Low             1280x720     15    1 Mbps     450 MB
Medium          1280x720     30    2 Mbps     900 MB
High            1920x1080    30    4 Mbps     1.8 GB
Ultra           1920x1080    60    8 Mbps     3.6 GB
```

**Recommendation**: Use Medium for best balance

---

## Scalability

### Current Architecture (P2P)

```
Pros:
✅ Minimal server load
✅ Low latency
✅ High quality
✅ Privacy (direct connection)

Cons:
❌ 1-to-1 only
❌ Requires signaling server
❌ Firewall/NAT issues possible
```

### Future: SFU Architecture (Multi-viewer)

```
                ┌─────────┐
                │   SFU   │
                │ Server  │
                └─────────┘
                  ↑  ↑  ↑
         ┌────────┘  │  └────────┐
         │            │           │
    Mobile 1      Mobile 2    Mobile 3
    
One Mac → Many Phones (future feature)
```

---

## Anti-Detection Technical Details

### How Websites Detect Screen Sharing

```
Detection Method                    Our Defense
───────────────────────────────────────────────────────
1. JavaScript API Check            ✅ Don't use those APIs
   (navigator.mediaDevices)        
                                   
2. Browser Event Monitoring        ✅ System-level capture
   (blur, visibilitychange)        
                                   
3. Canvas Fingerprinting           ✅ No canvas involved
                                   
4. Frame Rate Analysis             ✅ Normal frame rates
                                   
5. HDCP Detection                  ✅ Compliant capture
                                   
6. Virtual Display Check           ✅ No virtual display
                                   
7. Process List Check              ⚠️  Electron visible
   (could detect electron.exe)        (Future: rename)
```

### ScreenCaptureKit vs Browser API

```
Browser API (getDisplayMedia)      ScreenCaptureKit
───────────────────────────────────────────────────────
❌ Visible to JavaScript          ✅ System-level
❌ Can be blocked                 ✅ Cannot be blocked
❌ Shows permission prompt        ✅ One-time permission
❌ Detected by websites           ✅ Undetectable
⚠️  Browser-dependent             ✅ OS-level API
```

---

## Deployment Options

### Option 1: Local Network (Recommended)

```
┌─────────────────────┐
│   Your Home WiFi    │
│                     │
│  ┌────┐    ┌────┐  │
│  │Mac │───│📱 │  │
│  └────┘    └────┘  │
│                     │
└─────────────────────┘

Pros: Free, Private, Low latency
Cons: Same network only
```

### Option 2: Cloud Server

```
Internet
    │
    ├──[Mac]
    │
    ├──[Server on DigitalOcean/AWS]
    │
    └──[📱 Phone anywhere]

Pros: Access from anywhere
Cons: Higher latency, server cost
```

### Option 3: ngrok Tunnel

```
Mac → ngrok tunnel → Internet → Phone

Pros: Easy setup, works anywhere
Cons: Free tier limits, slightly slower
```

---

## Technology Choices - Why?

### Why Electron?
✅ Cross-platform (Mac + Windows)
✅ Native API access (ScreenCaptureKit)
✅ Web technologies (easier development)
✅ Large ecosystem
❌ Larger app size (acceptable tradeoff)

### Why React Native?
✅ Cross-platform (Android + iOS)
✅ Great WebRTC support
✅ Fast development
✅ Native performance
✅ Large community

### Why WebRTC?
✅ Peer-to-peer (low latency)
✅ Built-in encryption
✅ Industry standard
✅ NAT traversal
✅ Free STUN servers

### Why Socket.IO?
✅ Real-time bidirectional
✅ Auto-reconnection
✅ Easy to use
✅ Works everywhere
✅ Great for signaling

---

## Future Enhancements

### Phase 1 (Q1 2024) ✅
- [x] Basic screen sharing
- [x] Mode switching
- [x] Transcription
- [x] Anti-detection

### Phase 2 (Q2 2024)
- [ ] Windows support
- [ ] iOS support
- [ ] Recording feature
- [ ] Cloud hosting

### Phase 3 (Q3 2024)
- [ ] Multi-viewer support
- [ ] AI assistant integration
- [ ] Screen annotations
- [ ] Better UI/UX

### Phase 4 (Q4 2024)
- [ ] Enterprise features
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Mobile payments

---

## Code Organization

```
screen-share-pro/
│
├── desktop-app/              # Mac/Windows desktop
│   ├── src/
│   │   ├── main.js          # Electron main process
│   │   ├── renderer.js      # UI and WebRTC
│   │   └── index.html       # UI
│   └── package.json
│
├── mobile-app/               # Android/iOS mobile
│   ├── src/
│   │   ├── App.js           # Main app
│   │   ├── StreamViewer.js  # Video display
│   │   └── Controls.js      # Mode controls
│   └── package.json
│
├── server/                   # Signaling server
│   ├── index.js             # Main server
│   └── package.json
│
├── docs/                     # Documentation
│   ├── README.md
│   ├── SETUP.md
│   ├── ANTI-DETECTION.md
│   ├── STARTUP-PLAN.md
│   └── ARCHITECTURE.md (this file)
│
└── quick-start.sh           # Setup script
```

---

## Contributing

If you want to contribute:

1. **Desktop (Electron)**: JavaScript/Node.js
2. **Mobile (React Native)**: JavaScript/React
3. **Server (Node.js)**: JavaScript/Express
4. **Docs**: Markdown

All code is well-commented. Start with `GET-STARTED.md`!

---

*This architecture is designed for privacy, performance, and undetectability.*
