#!/bin/bash

# ScreenShare Pro - Simple Startup Script
# This starts both the server and desktop app

echo ""
echo "=========================================="
echo "🚀 ScreenShare Pro - Starting..."
echo "=========================================="
echo ""

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start the server in background
echo -e "${YELLOW}📡 Starting server...${NC}"
cd "$DIR/server"
node index.js > /tmp/screenshare-server.log 2>&1 &
SERVER_PID=$!
echo -e "${GREEN}✅ Server started (PID: $SERVER_PID)${NC}"
echo ""

# Wait a moment for server to initialize
sleep 2

# Start the desktop app
echo -e "${YELLOW}🖥️  Starting desktop app...${NC}"
cd "$DIR/desktop-app"
npm start &
DESKTOP_PID=$!

echo ""
echo "=========================================="
echo "✅ Everything Started!"
echo "=========================================="
echo ""
echo "📋 What's Running:"
echo "   • Server PID: $SERVER_PID"
echo "   • Desktop App PID: $DESKTOP_PID"
echo ""
echo "📱 Next Steps:"
echo "   1. Look at the desktop app window"
echo "   2. Copy the Mobile Link and Connection ID"
echo "   3. Open the link on your phone"
echo "   4. Enter the Connection ID"
echo "   5. Start sharing!"
echo ""
echo "⏹️  To Stop Everything:"
echo "   Press Ctrl+C or run: kill $SERVER_PID $DESKTOP_PID"
echo ""
echo "=========================================="
echo ""

# Wait for user to press Ctrl+C
trap "echo ''; echo '⏹️  Stopping...'; kill $SERVER_PID $DESKTOP_PID 2>/dev/null; echo '✅ Stopped'; exit 0" INT

# Keep script running
wait
