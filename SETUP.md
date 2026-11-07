# ScreenShare Pro - Complete Setup Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Server Setup (5 minutes)

```bash
cd server
npm install
npm start
```

✅ Server will run on `http://localhost:3000`

**For remote access (optional):**
```bash
# Install ngrok (free)
brew install ngrok

# In a new terminal
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
```

---

### Step 2: Mac Desktop App Setup (10 minutes)

```bash
cd desktop-app
npm install
npm start
```

**Important: Grant Permissions**

1. When prompted, go to:
   - **System Preferences** > **Security & Privacy** > **Privacy**
   - Enable **Screen Recording** for ScreenShare Pro
   - Enable **Microphone** (for audio transcription)

2. Select the screen/window you want to share
3. Click **🚀 Start Sharing**
4. Note your **Connection ID** (shown in the app)

---

### Step 3: Android App Setup (15 minutes)

#### Prerequisites:
- Install [Android Studio](https://developer.android.com/studio)
- Enable Developer Mode on your Realme 10 Pro 5G:
  1. Settings > About Phone
  2. Tap "Build Number" 7 times
  3. Go back to Settings > System > Developer Options
  4. Enable "USB Debugging"

#### Build & Install:

```bash
cd mobile-app

# Update server URL
# Edit src/App.js line 14:
# Change: const SERVER_URL = 'http://YOUR_SERVER_IP:3000';
# To your computer's local IP or ngrok URL

npm install

# Connect your phone via USB
# Allow USB debugging when prompted on phone

# Install on phone
npx react-native run-android
```

**Find your Mac's local IP:**
```bash
# Mac
ipconfig getifaddr en0

# Use this IP in mobile app
# Example: http://192.168.1.100:3000
```

---

## 📱 How to Use

### On Mac:
1. Launch ScreenShare Pro
2. Select screen/window to share
3. Click "Start Sharing"
4. Share your Connection ID with phone

### On Android:
1. Open ScreenShare Pro app
2. Enter Desktop Connection ID
3. Click "Connect"
4. Choose mode:
   - **👁️ Viewing**: See Mac screen
   - **🎧 Hearing**: Audio transcription only
   - **👁️🎧 Both**: Screen + Audio
   - **⏹️ Off**: Stop sharing

---

## 🔒 Anti-Detection Features

### Already Enabled:
✅ System-level screen capture (ScreenCaptureKit)  
✅ No browser API detection  
✅ Encrypted WebRTC connection  
✅ No external tracking

### How It Works:
- Uses macOS **ScreenCaptureKit** API (system-level)
- Bypasses browser JavaScript detection
- Direct framebuffer capture
- No virtual display drivers needed

### Test Anti-Detection:
Try screen sharing while on:
- Netflix (HDCP protected)
- Online exam sites (Proctorio, Respondus)
- Banking apps
- Zoom/Teams meetings

**Note**: Some sites may still detect based on behavior patterns. See `ANTI-DETECTION.md` for advanced techniques.

---

## 🤖 AI Assistant Setup (Optional)

### Option 1: OpenAI (Recommended)

1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Set environment variable:

```bash
# Mac/Linux
export OPENAI_API_KEY="sk-..."

# Then start desktop app
cd desktop-app
npm start
```

3. Use "Ask AI Assistant" button on mobile

**Free Tier**: $5 credit for new accounts

---

### Option 2: Free Alternatives

**Web Speech API (Built-in, Free)**
- Already integrated
- No API key needed
- Works offline for transcription

**Google Cloud Speech-to-Text**
- 60 minutes/month free
- Better accuracy
- Requires Google Cloud account

---

## 🌐 Network Configuration

### Local Network (Recommended - Free & Private)
- Both devices on same WiFi
- Use Mac's local IP address
- Zero cost, maximum privacy

### Remote Access (Using ngrok)
```bash
# Free tier: 1 tunnel, 40 connections/min
ngrok http 3000

# Copy URL to mobile app
# Example: https://abc123.ngrok.io
```

### Self-Hosted Server (Advanced)
- Deploy server to AWS/DigitalOcean/Heroku
- Free tier available on most platforms
- Full control and privacy

---

## 🔧 Troubleshooting

### Desktop App Issues:

**"Screen recording permission denied"**
```bash
System Preferences > Security & Privacy > Privacy > Screen Recording
Enable for ScreenShare Pro
Restart app
```

**"Cannot connect to server"**
```bash
# Check if server is running
curl http://localhost:3000

# Should return JSON with status
```

**"No screen sources available"**
- Restart the app with screen recording permission
- Try running: `npm start -- --dev` to see detailed logs

---

### Mobile App Issues:

**"Could not connect to server"**
1. Verify server is running
2. Check IP address is correct
3. Ensure both devices on same network
4. Disable VPN if active

**"Metro bundler failed"**
```bash
cd mobile-app
npx react-native start --reset-cache
```

**"Build failed"**
```bash
# Clean and rebuild
cd mobile-app/android
./gradlew clean
cd ..
npx react-native run-android
```

**"App crashes on launch"**
```bash
# Check logs
adb logcat | grep ReactNative
```

---

### Network Issues:

**Firewall blocking connection:**
```bash
# Mac: Allow Node.js through firewall
System Preferences > Security & Privacy > Firewall > Firewall Options
Add Node.js
```

**Cannot find Mac's IP:**
```bash
# Mac
ifconfig | grep inet

# Look for: inet 192.168.x.x
```

---

## 📊 Performance Optimization

### For Better Quality:
- Use 5GHz WiFi (faster than 2.4GHz)
- Close unnecessary apps on Mac
- Reduce screen resolution if laggy

### For Lower Bandwidth:
- Use "Hearing" mode instead of "Both"
- Reduce video quality in code (see StreamViewer.js)

---

## 🔐 Privacy & Security

### What Data is Sent:
- ✅ Screen/audio stream: Encrypted via WebRTC
- ✅ Transcriptions: Only to your devices
- ✅ AI requests: Only if you enable (to OpenAI)

### What is NOT Sent:
- ❌ No tracking or analytics
- ❌ No data stored on servers
- ❌ No third-party services (except chosen AI)
- ❌ No logs or recordings

### Connection Security:
- Peer-to-peer WebRTC (end-to-end encrypted)
- Signaling server only brokers connection
- No man-in-the-middle possible
- Self-hosted option available

---

## 💰 Free Tier Limits

| Service | Free Tier | Upgrade Cost |
|---------|-----------|--------------|
| WebRTC | Unlimited | N/A |
| Local Network | Unlimited | N/A |
| ngrok | 1 tunnel | $8/month |
| OpenAI API | $5 credit | Pay-as-you-go |
| Google Speech | 60 min/month | $0.006/15 sec |
| Web Speech API | Unlimited | N/A |

**Recommended Setup for 100% Free:**
- Local network only
- Web Speech API for transcription
- No AI assistant (or use free tier)

**Total Cost: $0/month** ✅

---

## 🚢 Deployment Options

### 1. Local Only (Free)
- Run server on Mac
- Connect via local network
- Perfect for personal use

### 2. Cloud Server (Free Tier Available)

**Heroku:**
```bash
cd server
heroku create screenshare-pro
git push heroku main
```

**AWS Free Tier:**
- EC2 t2.micro (750 hours/month free)
- 1 year free

**DigitalOcean:**
- $200 free credit (60 days)
- Then $4/month

---

## 📝 Next Steps

1. ✅ Test basic screen sharing
2. ✅ Try different modes (viewing/hearing/both)
3. ✅ Test anti-detection on protected sites
4. ✅ Add AI assistant (optional)
5. ✅ Deploy to cloud (optional)

---

## 💡 Tips & Tricks

### Keyboard Shortcuts (Mac App):
- `⌘ + R`: Refresh screen sources
- `⌘ + S`: Start sharing
- `⌘ + Q`: Stop sharing

### Performance:
- Close unnecessary apps
- Use wired internet for Mac (if possible)
- Keep phone close to WiFi router

### Battery Saving:
- Use "Hearing" mode when you don't need screen
- Enable battery optimization for mobile app
- Disable when not in use

---

## 🆘 Need Help?

Common issues and solutions in `TROUBLESHOOTING.md`

For anti-detection specifics, see `ANTI-DETECTION.md`

---

## 🎯 Success Checklist

- [ ] Server running and accessible
- [ ] Mac app connected to server
- [ ] Screen recording permission granted
- [ ] Mobile app installed on phone
- [ ] Mobile connected to Mac
- [ ] Can see Mac screen on phone
- [ ] Can switch modes from phone
- [ ] Transcription working (if enabled)

**All checked? You're ready to go!** 🎉
