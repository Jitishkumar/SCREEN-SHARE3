# 🚀 Getting Started with ScreenShare Pro

**Welcome!** This guide will get you up and running in **20 minutes**.

## ✅ Pre-Flight Checklist

Before you start, make sure you have:

### On Your Mac:
- [ ] macOS 12.3+ (for best anti-detection)
- [ ] Node.js installed ([Download](https://nodejs.org/))
- [ ] Terminal access
- [ ] Mac and phone on **same WiFi network**

### On Your Android Phone:
- [ ] Android 8.0 or higher
- [ ] USB cable (for initial app install)
- [ ] Developer mode enabled (we'll guide you)

### Optional:
- [ ] OpenAI API key (for AI assistant)
- [ ] ngrok account (for remote access)

---

## 🎯 Installation Path

Choose your path:

### 🟢 Path A: Super Quick (Recommended)
**Time: 5 minutes**

Use the automated script:

```bash
cd /Users/jitishkumar/Desktop/screen\ share3
./quick-start.sh
```

Select option 1, then option 4. Done!

---

### 🔵 Path B: Step by Step
**Time: 15-20 minutes**

Follow this if you want to understand each step.

---

## 📋 Step-by-Step Guide

### Step 1: Install Node.js (if not installed)

```bash
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org/
```

You should see something like `v18.0.0` or higher.

---

### Step 2: Start the Server

```bash
cd server
npm install
npm start
```

You should see:
```
🚀 ScreenShare Pro Server
📡 Server running on port 3000
🌐 Local: http://localhost:3000
```

**✅ Leave this terminal open!**

---

### Step 3: Start Desktop App

Open a **new terminal** (⌘+T):

```bash
cd desktop-app
npm install
npm start
```

**Important:** When prompted, grant these permissions:
1. **Screen Recording**
2. **Microphone** (if you want transcription)

Go to: System Preferences > Security & Privacy > Privacy

The app will open automatically.

---

### Step 4: Configure Desktop App

In the desktop app:

1. You'll see a list of screens and windows
2. Click "Select" on the screen you want to share
3. Click "🚀 Start Sharing"
4. **Note your Connection ID** (you'll need this!)

Example: `abc123def456`

---

### Step 5: Setup Android App

#### Enable Developer Mode on Phone:

1. Go to **Settings** > **About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings** > **System** > **Developer Options**
4. Enable **USB Debugging**

#### Get Your Mac's IP Address:

```bash
# In a new terminal
ipconfig getifaddr en0
```

You'll get something like: `192.168.1.100`

#### Update Mobile App Config:

```bash
cd mobile-app

# Open src/App.js in any text editor
# Line 14: Change SERVER_URL

# From:
const SERVER_URL = 'http://YOUR_SERVER_IP:3000';

# To (use your actual IP):
const SERVER_URL = 'http://192.168.1.100:3000';
```

#### Install on Phone:

```bash
# Make sure phone is connected via USB
npm install
npx react-native run-android
```

This will:
- Install the app on your phone
- Launch it automatically

**First time?** This might take 5-10 minutes.

---

### Step 6: Connect Phone to Mac

On your phone (in the ScreenShare Pro app):

1. Enter the **Desktop Connection ID** you noted earlier
2. Tap **"🔗 Connect"**
3. You should see: "Successfully connected to desktop"

---

### Step 7: Choose Your Mode

On your phone, tap a mode:

- **👁️ Viewing**: See your Mac screen
- **🎧 Hearing**: Audio transcription only
- **👁️🎧 Both**: Screen + Audio
- **⏹️ Off**: Stop sharing

**That's it!** Your Mac screen should now appear on your phone! 🎉

---

## 🧪 Testing Anti-Detection

Try opening these on your Mac while sharing:

1. **Netflix** - Should play without detection
2. **YouTube** - Should play normally
3. **Online banking** - Should work fine
4. **Any website** - Won't know you're sharing

**If detected:** Check `ANTI-DETECTION.md` for advanced techniques.

---

## 🎯 Common First-Time Issues

### Issue: "Cannot connect to server"

**Solution:**
```bash
# 1. Check server is running
# 2. Verify your IP address
ipconfig getifaddr en0

# 3. Make sure phone and Mac on same WiFi
# 4. Check firewall settings:
#    System Preferences > Security & Privacy > Firewall
#    Allow Node.js
```

---

### Issue: "Screen recording permission denied"

**Solution:**
```bash
System Preferences > Security & Privacy > Privacy > Screen Recording
✅ Enable for ScreenShare Pro
Restart desktop app
```

---

### Issue: "Mobile app won't install"

**Solution:**
```bash
# 1. Check USB debugging is enabled on phone
# 2. Accept the "Allow USB debugging?" prompt on phone
# 3. Check phone is detected:
adb devices

# Should show your device
# If not, install Android SDK tools

# 4. Clean and retry:
cd mobile-app/android
./gradlew clean
cd ..
npx react-native run-android
```

---

### Issue: "Black screen on phone"

**Solution:**
- Make sure you clicked "Select" on a screen source
- Try selecting a different window/screen
- Check that desktop app shows "Broadcasting"
- Restart both apps

---

### Issue: "Transcription not working"

**Solution:**
- Enable microphone permission on Mac
- Select "Hearing" or "Both" mode on phone
- Speak clearly into Mac's microphone
- Check language settings (currently set to English)

---

## 🎓 Next Steps

Now that everything is working:

### 1. Explore Features
- Try all 4 modes
- Test transcription
- Try AI assistant (if configured)

### 2. Optimize Performance
- Close unnecessary apps
- Use 5GHz WiFi if available
- Keep phone near router

### 3. Learn Advanced Features
- Read `ANTI-DETECTION.md`
- Check `SETUP.md` for remote access
- See `STARTUP-PLAN.md` if interested in business potential

### 4. Customize
- Change transcription language
- Adjust video quality
- Configure AI assistant

---

## 🔐 Security Tips

1. **Local Network Only** (most secure)
   - Keep server on your Mac
   - Don't expose to internet
   - Use only on your WiFi

2. **Remote Access** (if needed)
   - Use ngrok or VPN
   - Don't share Connection IDs
   - Use strong passwords

3. **Privacy**
   - No data leaves your devices (unless AI enabled)
   - Streams are encrypted
   - No cloud storage

---

## 🎉 You're All Set!

You now have a **working, undetectable screen sharing system**!

### Quick Commands Reference:

```bash
# Start server
cd server && npm start

# Start desktop app
cd desktop-app && npm start

# Install mobile app
cd mobile-app && npx react-native run-android

# Get your IP
ipconfig getifaddr en0

# Everything at once
./quick-start.sh
```

---

## 📞 Need More Help?

- **Setup issues**: See `SETUP.md`
- **Anti-detection**: See `ANTI-DETECTION.md`
- **Business ideas**: See `STARTUP-PLAN.md`
- **Technical details**: Check code comments

---

## ⭐ Enjoy!

You have something **truly unique**:
- ✅ Undetectable screen sharing
- ✅ AI-powered
- ✅ Real-time transcription
- ✅ Completely free
- ✅ Privacy-first

**Use it wisely and ethically!** 🚀

---

*Questions? Open an issue or discussion on GitHub!*
