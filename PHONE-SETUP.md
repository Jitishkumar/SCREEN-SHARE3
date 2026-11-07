# 📱 Phone Setup - Quick Guide

## ✅ Your Info:

- **Mac IP Address:** `10.210.148.79`
- **Server:** Running ✅
- **Desktop:** Running ✅
- **Connection ID:** `QaBnO8bZM5id6e3QAAAB` (check desktop app for current one)
- **Network:** Phone's hotspot (perfect! 👍)

---

## 📱 Step 1: Enable Developer Mode on Realme 10 Pro 5G

1. Open **Settings** on your phone
2. Go to **About Phone**
3. Tap **Build Number** 7 times rapidly
4. You'll see "You are now a developer!"
5. Go back to **Settings** > **System** > **Developer Options**
6. Turn on **USB Debugging**

---

## 🔌 Step 2: Connect Phone to Mac

1. Connect your Realme 10 Pro 5G to Mac with USB cable
2. On phone, when prompted: **"Allow USB debugging?"** - Tap **"Allow"**
3. Check if phone is connected:

```bash
cd "/Users/jitishkumar/Desktop/screen share3/mobile-app"
adb devices
```

You should see your device listed!

---

## 📲 Step 3: Install App on Phone

**Run these commands:**

```bash
cd "/Users/jitishkumar/Desktop/screen share3/mobile-app"

# Install dependencies (first time only)
npm install

# Install app on your phone
npx react-native run-android
```

**This will take 5-10 minutes the first time.** Be patient!

The app will automatically install and open on your phone.

---

## 📱 Step 4: Connect Phone to Mac (In the App)

Once the app opens on your Realme 10 Pro 5G:

1. You'll see **"Connection ID"** field
2. Enter: `QaBnO8bZM5id6e3QAAAB` (get latest from desktop app)
3. Tap **"🔗 Connect"**
4. Tap **"👁️ Viewing"** mode

**DONE! 🎉 Your Mac screen appears on your phone!**

---

## 🔄 Daily Use (After First Setup)

### On Mac:
```bash
cd "/Users/jitishkumar/Desktop/screen share3"
./quick-start.sh
# Press 4
```

### On Phone:
1. Make sure both devices using same hotspot
2. Open ScreenShare Pro app
3. Enter Connection ID from Mac
4. Tap "Connect"
5. Tap "Viewing"
6. Enjoy! 🎊

---

## 💰 Cost: $0 Forever!

Using your phone's hotspot:
- ✅ Screen sharing: FREE
- ✅ 3+ hours daily: FREE
- ✅ HD quality: FREE
- ✅ No WiFi needed: FREE
- ✅ Works anywhere: FREE

**Perfect setup for you!** 👍

---

## ⚠️ Important Notes

### Network:
- ✅ Both Mac and Phone must use **same hotspot**
- ✅ If using phone's hotspot: Mac connects to phone's hotspot ✅ (You're doing this!)
- ✅ If using WiFi: Both connect to same WiFi

### Battery:
- Phone will drain faster (streaming video)
- Keep phone plugged in for long sessions (3+ hours)
- Mac should also be plugged in

### Data Usage:
- Uses phone's mobile data (if hotspot is using mobile data)
- About 1-2 GB per hour for HD video
- Use WiFi if you have unlimited data concerns

---

## 🔧 Troubleshooting

### "Device not found" (adb devices shows nothing):
```bash
# Try restarting adb
adb kill-server
adb start-server
adb devices
```

### App won't install:
```bash
# Clean cache and retry
cd mobile-app
rm -rf node_modules
npm install
npx react-native run-android
```

### "Cannot connect to server" on phone:
- Make sure Mac is connected to phone's hotspot
- Verify IP with: `ipconfig getifaddr en0`
- Check server is running on Mac

### Black screen on phone:
- Make sure you clicked "Select" in desktop app
- Check Screen Recording permission is granted
- Try restarting desktop app

---

## 📊 What to Expect

### First Install:
- Time: 5-10 minutes
- Downloads Android dependencies
- Builds app
- Installs on phone
- Opens automatically

### After First Install:
- Future installs: 30 seconds
- Just open app on phone
- Enter Connection ID
- Connect!

---

## ✅ Success Checklist

- [ ] Developer mode enabled on phone
- [ ] USB debugging enabled
- [ ] Phone connected via USB
- [ ] `adb devices` shows your phone
- [ ] `npm install` completed
- [ ] App installed on phone
- [ ] Both devices on same hotspot
- [ ] Server running on Mac
- [ ] Desktop app running on Mac
- [ ] Connection ID entered on phone
- [ ] Connected and viewing! 🎉

---

## 🎯 Your Current Status

✅ Server running on Mac  
✅ Desktop app running on Mac  
✅ Screen capture working  
✅ IP address configured: `10.210.148.79`  
✅ Connection ID: `QaBnO8bZM5id6e3QAAAB`  

**Next:** Install app on your phone! 📱

---

## 🚀 Quick Commands

```bash
# Check phone connected
adb devices

# Install app on phone
cd "/Users/jitishkumar/Desktop/screen share3/mobile-app"
npm install
npx react-native run-android

# Get Mac IP (if needed)
ipconfig getifaddr en0

# Restart server if needed
cd "/Users/jitishkumar/Desktop/screen share3"
./quick-start.sh
```

---

**Ready? Connect your phone to Mac with USB cable and let's install the app!** 🎉
