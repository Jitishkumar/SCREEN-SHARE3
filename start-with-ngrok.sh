#!/bin/bash

echo "🚀 ScreenShare Pro - Starting with ngrok"
echo "========================================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed!"
    echo ""
    echo "Please install it:"
    echo "  brew install ngrok"
    echo ""
    echo "Or download from: https://ngrok.com/download"
    exit 1
fi

echo "✅ ngrok found!"
echo ""

# Start server in background
echo "📡 Starting server..."
cd server
npm start &
SERVER_PID=$!
sleep 3
cd ..

echo "✅ Server started (PID: $SERVER_PID)"
echo ""

# Start ngrok in background and capture output
echo "🌐 Starting ngrok tunnel..."
ngrok http 3000 --log=stdout > /tmp/ngrok.log &
NGROK_PID=$!
sleep 5

# Extract ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    echo "Please check /tmp/ngrok.log"
    kill $SERVER_PID $NGROK_PID
    exit 1
fi

echo "✅ ngrok tunnel created!"
echo ""
echo "========================================"
echo "📱 YOUR PUBLIC URL:"
echo "========================================"
echo ""
echo "   $NGROK_URL"
echo ""
echo "========================================"
echo ""

# Update web viewer
echo "📝 Updating web viewer with ngrok URL..."
sed -i '' "s|const SERVER_URL = '.*'|const SERVER_URL = '$NGROK_URL'|g" web-viewer/index.html
echo "✅ Web viewer updated!"
echo ""

# Restart server with new config
echo "🔄 Restarting server..."
kill $SERVER_PID
sleep 2
cd server
npm start &
SERVER_PID=$!
sleep 3
cd ..
echo "✅ Server restarted!"
echo ""

# Start desktop app
echo "🖥️  Starting desktop app..."
cd desktop-app
npm start &
DESKTOP_PID=$!
cd ..
echo "✅ Desktop app started!"
echo ""

echo "========================================"
echo "✅ EVERYTHING IS RUNNING!"
echo "========================================"
echo ""
echo "📱 On your phone:"
echo "   1. Open Chrome browser"
echo "   2. Go to: $NGROK_URL"
echo "   3. Click 'Visit Site' if you see ngrok warning"
echo "   4. Enter Connection ID from desktop app"
echo "   5. Tap 'Connect'"
echo "   6. SEE YOUR MAC SCREEN! 🎉"
echo ""
echo "🖥️  On your Mac:"
echo "   1. Desktop app window should be open"
echo "   2. Click 'Select' on 'Entire screen'"
echo "   3. Click 'Start Sharing'"
echo "   4. Note the Connection ID"
echo ""
echo "========================================"
echo "Press Ctrl+C to stop everything"
echo "========================================"
echo ""

# Keep script running
trap "echo ''; echo 'Stopping...'; kill $SERVER_PID $NGROK_PID $DESKTOP_PID 2>/dev/null; exit" INT
wait
