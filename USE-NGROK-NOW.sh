#!/bin/bash

echo "🚀 Installing and Starting ngrok..."
echo ""

# Install ngrok if not installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 Installing ngrok..."
    brew install ngrok
    echo "✅ ngrok installed!"
else
    echo "✅ ngrok already installed!"
fi

echo ""
echo "🔗 Starting ngrok tunnel..."
echo ""

# Start ngrok
ngrok http 3000 --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

echo "⏳ Waiting for tunnel to start..."
sleep 5

# Get the URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    echo "Please run manually: ngrok http 3000"
    exit 1
fi

echo ""
echo "════════════════════════════════════════"
echo "✅ YOUR PERMANENT URL:"
echo "════════════════════════════════════════"
echo ""
echo "   $NGROK_URL"
echo ""
echo "════════════════════════════════════════"
echo ""
echo "📱 Use this URL on your phone!"
echo "📱 It won't change while ngrok is running!"
echo ""
echo "💡 To make it TRULY permanent:"
echo "   Sign up at ngrok.com (free)"
echo "   Run: ngrok config add-authtoken YOUR_TOKEN"
echo "   Then you get a static domain! ($8/month)"
echo ""
echo "Press Ctrl+C to stop ngrok"
echo ""

# Keep running
trap "kill $NGROK_PID 2>/dev/null; exit" INT
wait $NGROK_PID
