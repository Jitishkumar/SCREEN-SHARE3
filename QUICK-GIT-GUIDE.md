# 📋 QUICK GIT GUIDE

## ✅ Your Repo Is Now Live!

**GitHub URL:** https://github.com/Jitishkumar/SCREEN-SHARE3

---

## Daily Git Workflow:

### 1. Make Changes
- Edit your code files
- Test everything works

### 2. Check What Changed
```bash
git status
```

### 3. Add Changes
```bash
# Add all files
git add .

# Or add specific file
git add server/index.js
```

### 4. Commit
```bash
git commit -m "Brief description of what you changed"
```

### 5. Push to GitHub
```bash
git push origin main
```

Done! ✅

---

## Common Commands:

### See your changes:
```bash
git status          # What files changed
git diff            # See exact changes
```

### Undo changes:
```bash
git checkout .      # Undo all local changes (careful!)
git restore file.js # Undo changes to one file
```

### See history:
```bash
git log             # See all commits
git log --oneline   # Short version
```

### Pull latest from GitHub:
```bash
git pull origin main
```

---

## `.gitignore` Is Protecting You!

These are **automatically excluded** from Git:
- ✅ `node_modules/` - Never uploaded again!
- ✅ `.DS_Store` - Mac system files
- ✅ `*.log` - Log files
- ✅ `.env` - Secret environment variables
- ✅ Large binary files

You can edit `.gitignore` anytime to add more exclusions.

---

## Clone On Another Computer:

```bash
# Download repository
git clone https://github.com/Jitishkumar/SCREEN-SHARE3.git

# Enter folder
cd SCREEN-SHARE3

# Install dependencies
cd server && npm install
cd ../desktop-app && npm install

# Done! Now start the app
```

---

## Pro Tips:

1. **Commit often** - Small frequent commits are better than big ones
2. **Use clear messages** - "Fixed chat bug" is better than "updates"
3. **Pull before push** - If others are contributing, pull first
4. **Don't force push** - Only use `--force` in emergencies
5. **Never commit secrets** - API keys, passwords go in `.env` (which is gitignored)

---

## Common Commit Message Examples:

```bash
git commit -m "Add password protection to disconnect button"
git commit -m "Fix chat formatting to preserve line breaks"
git commit -m "Update README with installation instructions"
git commit -m "Improve server performance"
git commit -m "Fix bug where IP address was hardcoded"
```

---

## If You Get Stuck:

### Already committed but want to undo?
```bash
git reset HEAD~1      # Undo last commit (keep changes)
git reset --hard HEAD~1  # Undo last commit (delete changes)
```

### Accidentally added wrong files?
```bash
git reset            # Unstage all
git reset file.js    # Unstage one file
```

### Want to see what's on GitHub vs local?
```bash
git fetch origin
git status
```

---

**You're all set! Your code is safely backed up on GitHub!** 🎉

Repository: https://github.com/Jitishkumar/SCREEN-SHARE3
