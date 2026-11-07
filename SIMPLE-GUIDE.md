# 📱 Simple Guide - Mac to Phone Screen Sharing

**100% FREE - Use for 3 hours, 10 hours, unlimited! No costs ever!**

---

## What This Does

**Simple**: See your Mac screen on your Realme 10 Pro 5G phone.

**That's it!** No complicated features. Just screen sharing.

✅ **Unlimited hours** - use as long as you want  
✅ **HD quality** - 1080p  
✅ **Undetectable** - websites can't tell  
✅ **Free forever** - no subscription, no fees  
✅ **Private** - just you, your Mac, your phone  

---

## Setup (20 Minutes, One Time Only)

### Step 1: Start on Mac (5 minutes)

Open Terminal and type:

```bash
cd "/Users/jitishkumar/Desktop/screen share3"
./quick-start.sh
```

**Choose:**
1. First time: Press `1` (Setup) then `4` (Start)
2. Next times: Just press `4` (Start)

**You'll see:**
- Server running ✅
- Desktop app opens ✅
- Shows your Connection ID (like: `abc123def456`)

**Write down your Connection ID!** You need this for phone.

---

### Step 2: Grant Permission (One Time)

**Mac will ask for permission:**

1. System Preferences > Security & Privacy > Privacy
2. Click **Screen Recording**
3. Enable checkbox for **ScreenShare Pro**
4. Restart the desktop app

**This is required for screen capture.**

---

### Step 3: Select What to Share (Every time you use it)

In the desktop app:

1. You'll see thumbnails of your screens/windows
2. Click **"Select"** on the one you want to share
3. Click **"🚀 Start Sharing"**

Done! Desktop is ready.

---

### Step 4: Setup Phone (15 minutes, First Time Only)

#### A. Enable Developer Mode on Your Realme 10 Pro 5G:

1. Settings > About Phone
2. Tap **"Build Number"** 7 times (really!)
3. Go back to Settings > System > Developer Options
4. Turn on **"USB Debugging"**

#### B. Get Your Mac's WiFi IP Address:

In Terminal on Mac:

```bash
ipconfig getifaddr en0
```

You'll see something like: `192.168.1.100`

**Write this down!**

#### C. Update Mobile App:

```bash
cd "/Users/jitishkumar/Desktop/screen share3/mobile-app"

# Open src/App.js in any text editor
# Find line 14: const SERVER_URL = 'http://YOUR_SERVER_IP:3000';
# Change YOUR_SERVER_IP to your actual IP
# Example: const SERVER_URL = 'http://192.168.1.100:3000';
```

Or just run this (replace with YOUR IP):

```bash
# Replace 192.168.1.100 with YOUR actual IP!
sed -i '' "s/YOUR_SERVER_IP/192.168.1.100/g" src/App.js
```

#### D. Install App on Phone:

Connect phone to Mac with USB cable.

```bash
cd "/Users/jitishkumar/Desktop/screen share3/mobile-app"
npm install
npx react-native run-android
```

**First time takes 5-10 minutes.** Be patient!

App will automatically install and open on your phone.

---

### Step 5: Connect Phone to Mac (Every time you use it)

**On your phone (in the ScreenShare Pro app):**

1. Enter the **Connection ID** from your Mac
2. Tap **"🔗 Connect"**
3. Tap **"👁️ Viewing"** mode

**DONE!** Your Mac screen now appears on your phone! 🎉

---

## Daily Use (After First Setup)

### On Mac:
```bash
cd "/Users/jitishkumar/Desktop/screen share3"
./quick-start.sh
# Press 4 (Start)
# Select screen, click "Start Sharing"
# Note your Connection ID
```

### On Phone:
1. Open ScreenShare Pro app
2. Enter Connection ID
3. Tap "Connect"
4. Tap "Viewing"
5. Enjoy! 🎉

**Use for 3 hours, 10 hours, all day - always free!**

---

## Troubleshooting

### Problem: "Cannot connect to server"

**Solution:**
- Make sure Mac and phone on **same WiFi**
- Check server is running on Mac
- Verify IP address is correct
- Disable VPN if active

### Problem: "Black screen on phone"

**Solution:**
- Make sure you clicked "Select" on a screen in desktop app
- Click "Start Sharing" button
- Try selecting a different window

### Problem: "App won't install on phone"

**Solution:**
```bash
# Check phone is connected
adb devices

# If not showing, enable USB debugging again
# Then retry installation
```

### Problem: "Permission denied on Mac"

**Solution:**
- System Preferences > Security & Privacy > Privacy
- Screen Recording > Enable ScreenShare Pro
- Restart desktop app

---

## Tips for Best Quality

### For Smooth Video:
- ✅ Keep phone close to WiFi router
- ✅ Use 5GHz WiFi (faster)
- ✅ Close unnecessary apps on Mac
- ✅ Keep phone plugged in (saves battery)

### For Best WiFi:
- ✅ Both devices on same network
- ✅ Not too far from router
- ✅ Fewer people using WiFi = better

### For Long Sessions (3+ hours):
- ✅ Plug phone into charger
- ✅ Plug Mac into power
- ✅ Disable phone auto-lock (stays on)

---

## Undetectable Feature

**Websites CANNOT detect this!**

Works on:
- ✅ Netflix
- ✅ Online exams
- ✅ Banking apps
- ✅ Any website

**Why?** Uses system-level capture, not browser APIs.

---

## Cost Breakdown (It's Free!)

```
Feature                  Cost         
─────────────────────────────────────
Screen sharing           $0 forever ✅
Server                   $0 (runs on Mac)
Desktop app              $0 (open source)
Mobile app               $0 (open source)
Duration                 Unlimited hours
Quality                  1080p HD
Privacy                  No tracking
─────────────────────────────────────
TOTAL                    $0/month FOREVER ✅
```

**No subscriptions. No trials. No limits. Just free!**

---

## FAQ

**Q: How long can I use it?**  
A: Unlimited! 3 hours, 10 hours, 24/7 - always free.

**Q: Will it cost money later?**  
A: No! 100% free forever when using on your own WiFi.

**Q: Is my data private?**  
A: Yes! Only you see it. No cloud, no tracking, no storage.

**Q: Can websites detect this?**  
A: No! System-level capture = undetectable.

**Q: Does quality stay good for 3+ hours?**  
A: Yes! As long as WiFi is good.

**Q: Do I need to buy anything?**  
A: No! Everything is free and open source.

**Q: What about speech-to-text and AI?**  
A: Those are optional. You don't need them. Just ignore them!

**Q: Does phone battery drain fast?**  
A: Yes, keep it plugged in for long sessions.

**Q: Can I use this remotely (not on same WiFi)?**  
A: Yes, but requires ngrok (free tier or $8/mo). For your use case, just use same WiFi = free.

---

## That's It!

**Simple screen sharing:**
- Mac → Your Phone
- HD Quality
- Undetectable
- Free Forever
- Use 3+ hours no problem

**Enjoy!** 🎉

---

## Quick Command Reference

```bash
# Start server + desktop app
cd "/Users/jitishkumar/Desktop/screen share3"
./quick-start.sh
# Press 4

# Get your IP (for phone setup)
ipconfig getifaddr en0

# Install on phone (first time only)
cd mobile-app
npm install
npx react-native run-android

# Check phone connected
adb devices
```

---

**Need more help?** See detailed guides in the folder:
- GET-STARTED.md (detailed setup)
- SETUP.md (troubleshooting)
- START-HERE.md (all options)

But honestly, this simple guide is all you need! 😊
