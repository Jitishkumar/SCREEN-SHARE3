# 📚 COMPLETE GITHUB GUIDE

## ✅ Your Code Is Already On GitHub!

**Repository:** https://github.com/Jitishkumar/SCREEN-SHARE3

---

## 🔄 HOW TO PUSH CHANGES TO GITHUB

### Every Time You Make Changes:

```bash
# 1. Go to your project folder
cd "/Users/jitishkumar/Desktop/screen share3"

# 2. Check what changed
git status

# 3. Add all changes
git add .

# 4. Commit with a message
git commit -m "Describe what you changed"

# 5. Push to GitHub
git push origin main
```

### Example:
```bash
cd "/Users/jitishkumar/Desktop/screen share3"
git add .
git commit -m "Fixed chat formatting bug"
git push origin main
```

Done! ✅

---

## 💻 HOW TO USE IT HERE (Current Computer)

### First Time Setup (ALREADY DONE):
```bash
cd "/Users/jitishkumar/Desktop/screen share3"

# Install dependencies
cd server && npm install
cd ../desktop-app && npm install
```

### Every Time You Want To Use It:

**Option 1: Simple Script (Recommended)**
```bash
cd "/Users/jitishkumar/Desktop/screen share3"
./start.sh
```

**Option 2: Manual (2 Terminals)**

Terminal 1:
```bash
cd "/Users/jitishkumar/Desktop/screen share3/server"
node index.js
```

Terminal 2:
```bash
cd "/Users/jitishkumar/Desktop/screen share3/desktop-app"
npm start
```

### Look For This Output:
```
============================================================
📱 MOBILE ACCESS INFO (Copy these)
============================================================
🔗 Mobile Link: http://10.XXX.XXX.XXX:3000
🆔 Connection ID: XXXXXXXXXXXXX
============================================================
```

Copy the link and ID, open on phone!

---

## 📥 HOW TO USE IT FROM GITHUB (Another Computer)

### Step 1: Clone Repository
```bash
# Open Terminal and run:
git clone https://github.com/Jitishkumar/SCREEN-SHARE3.git

# Go into the folder
cd SCREEN-SHARE3
```

### Step 2: Install Node.js (If Not Installed)
```bash
# Check if Node.js is installed
node --version

# If not installed, download from: https://nodejs.org
# Or use Homebrew:
brew install node
```

### Step 3: Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install desktop app dependencies
cd ../desktop-app
npm install

# Go back to main folder
cd ..
```

### Step 4: Start The App
```bash
# Option 1: Use the start script
./start.sh

# Option 2: Manual start
# Terminal 1:
cd server
node index.js

# Terminal 2 (new terminal):
cd desktop-app
npm start
```

### Step 5: Use It!
1. Desktop app opens automatically
2. Copy the Mobile Link and Connection ID from terminal
3. Open link on your phone
4. Enter Connection ID
5. Start sharing!

---

## 📋 QUICK COMMAND REFERENCE

### On Current Computer (Already Have Files):

**Start:**
```bash
cd "/Users/jitishkumar/Desktop/screen share3" && ./start.sh
```

**Stop:**
```
Press Ctrl+C
```

**Push changes to GitHub:**
```bash
cd "/Users/jitishkumar/Desktop/screen share3"
git add .
git commit -m "Your message here"
git push origin main
```

---

### On New Computer (Clone from GitHub):

**Clone:**
```bash
git clone https://github.com/Jitishkumar/SCREEN-SHARE3.git
cd SCREEN-SHARE3
```

**Install:**
```bash
cd server && npm install
cd ../desktop-app && npm install
cd ..
```

**Start:**
```bash
./start.sh
```

---

## 🔄 COMMON WORKFLOWS

### Workflow 1: Make Changes and Push

```bash
# 1. Make your code changes in editor

# 2. Test it works
./start.sh

# 3. Stop the app (Ctrl+C)

# 4. Push to GitHub
git add .
git commit -m "Added new feature"
git push origin main
```

---

### Workflow 2: Pull Latest Changes

If you're working from multiple computers:

```bash
# Get latest code from GitHub
git pull origin main

# Reinstall dependencies (if package.json changed)
cd server && npm install
cd ../desktop-app && npm install

# Start the app
cd ..
./start.sh
```

---

### Workflow 3: Fresh Install On New Computer

```bash
# 1. Clone
git clone https://github.com/Jitishkumar/SCREEN-SHARE3.git
cd SCREEN-SHARE3

# 2. Install Node.js (if needed)
# Download from https://nodejs.org

# 3. Install dependencies
cd server && npm install
cd ../desktop-app && npm install

# 4. Start
cd ..
./start.sh

# 5. Copy Mobile Link and Connection ID
# Use on your phone!
```

---

## ⚠️ IMPORTANT NOTES

### What Gets Pushed to GitHub:
✅ All source code (.js, .html files)
✅ Configuration files (package.json)
✅ Documentation (.md files)
✅ .gitignore file

### What DOESN'T Get Pushed:
❌ node_modules/ (too large, installed with npm install)
❌ .DS_Store (Mac system files)
❌ Log files
❌ Temporary files

### Why node_modules Is Not Pushed:
- `node_modules` is huge (200+ MB)
- GitHub has a 100MB file limit
- It's recreated with `npm install`
- That's why you must run `npm install` after cloning!

---

## 🛠️ TROUBLESHOOTING

### Error: "electron: command not found"
**Fix:**
```bash
cd desktop-app
npm install
```

### Error: "Cannot find module"
**Fix:**
```bash
cd server && npm install
cd ../desktop-app && npm install
```

### Error: "Port 3000 already in use"
**Fix:**
```bash
# Kill the process using port 3000
lsof -ti :3000 | xargs kill -9
```

### Error: Git push fails
**Check:**
```bash
git status
git remote -v
```

**If remote is correct, try:**
```bash
git pull origin main
git push origin main
```

---

## 📂 FOLDER STRUCTURE

```
SCREEN-SHARE3/
├── server/
│   ├── index.js           # Server code
│   ├── package.json       # Server dependencies
│   └── node_modules/      # (Not in Git, install with npm install)
├── desktop-app/
│   ├── src/
│   │   ├── main.js        # Electron main
│   │   ├── renderer.js    # Electron renderer
│   │   └── index.html     # Desktop UI
│   ├── package.json       # Desktop dependencies
│   └── node_modules/      # (Not in Git, install with npm install)
├── web-viewer/
│   └── index.html         # Mobile web interface
├── .gitignore             # Files to ignore
├── start.sh               # Startup script
└── *.md                   # Documentation
```

---

## 🎯 SUMMARY

### Current Computer (Your Mac):
```bash
# To use:
cd "/Users/jitishkumar/Desktop/screen share3" && ./start.sh

# To push changes:
git add . && git commit -m "message" && git push origin main
```

### New Computer:
```bash
# First time only:
git clone https://github.com/Jitishkumar/SCREEN-SHARE3.git
cd SCREEN-SHARE3
cd server && npm install
cd ../desktop-app && npm install

# Every time:
cd SCREEN-SHARE3 && ./start.sh
```

---

**That's everything! Simple and complete!** 🎉

Repository: https://github.com/Jitishkumar/SCREEN-SHARE3
