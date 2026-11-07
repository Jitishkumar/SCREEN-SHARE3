#!/bin/bash

# ScreenShare Pro - Quick Start Script
# This script helps you set up and run the entire system

set -e  # Exit on error

echo "🚀 ScreenShare Pro - Quick Start"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo ""

# Function to check if npm dependencies are installed
check_dependencies() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies in $dir...${NC}"
        cd "$dir"
        npm install
        cd - > /dev/null
        echo -e "${GREEN}✅ Dependencies installed in $dir${NC}"
    else
        echo -e "${GREEN}✅ Dependencies already installed in $dir${NC}"
    fi
}

# Check what to run
echo "What would you like to do?"
echo ""
echo "1) Setup all components (first time)"
echo "2) Run server only"
echo "3) Run desktop app only"
echo "4) Run everything (server + desktop app)"
echo "5) Get my Mac's IP address"
echo "6) Check system requirements"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}📦 Setting up all components...${NC}"
        echo ""
        
        # Server
        echo "Setting up server..."
        check_dependencies "server"
        echo ""
        
        # Desktop app
        echo "Setting up desktop app..."
        check_dependencies "desktop-app"
        echo ""
        
        echo -e "${GREEN}✅ All components set up!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Run this script again and choose option 4 to start everything"
        echo "2. Set up the mobile app (see SETUP.md for instructions)"
        ;;
        
    2)
        echo ""
        echo -e "${YELLOW}🚀 Starting server...${NC}"
        check_dependencies "server"
        echo ""
        echo -e "${GREEN}Server starting on http://localhost:3000${NC}"
        echo "Press Ctrl+C to stop"
        echo ""
        cd server
        npm start
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}🖥️  Starting desktop app...${NC}"
        check_dependencies "desktop-app"
        echo ""
        echo -e "${GREEN}Desktop app starting...${NC}"
        echo "Make sure the server is running!"
        echo ""
        cd desktop-app
        npm start
        ;;
        
    4)
        echo ""
        echo -e "${YELLOW}🚀 Starting server and desktop app...${NC}"
        echo ""
        
        # Check dependencies
        check_dependencies "server"
        check_dependencies "desktop-app"
        echo ""
        
        # Start server in background
        echo -e "${GREEN}Starting server on http://localhost:3000${NC}"
        cd server
        npm start &
        SERVER_PID=$!
        cd ..
        
        # Wait for server to start
        echo "Waiting for server to start..."
        sleep 3
        
        # Start desktop app
        echo ""
        echo -e "${GREEN}Starting desktop app...${NC}"
        cd desktop-app
        npm start &
        DESKTOP_PID=$!
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ Both components running!${NC}"
        echo ""
        echo "Server PID: $SERVER_PID"
        echo "Desktop PID: $DESKTOP_PID"
        echo ""
        echo "Press Ctrl+C to stop all"
        
        # Wait for Ctrl+C
        trap "echo ''; echo 'Stopping...'; kill $SERVER_PID $DESKTOP_PID 2>/dev/null; exit" INT
        wait
        ;;
        
    5)
        echo ""
        echo -e "${YELLOW}🌐 Finding your Mac's IP address...${NC}"
        echo ""
        
        # Get IP addresses
        if command -v ipconfig &> /dev/null; then
            # macOS
            IP=$(ipconfig getifaddr en0 2>/dev/null)
            if [ -z "$IP" ]; then
                IP=$(ipconfig getifaddr en1 2>/dev/null)
            fi
        fi
        
        if [ -z "$IP" ]; then
            # Fallback method
            IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
        fi
        
        if [ -z "$IP" ]; then
            echo -e "${RED}❌ Could not find IP address${NC}"
            echo "Try running: ifconfig | grep inet"
        else
            echo -e "${GREEN}Your Mac's local IP address:${NC}"
            echo ""
            echo -e "${YELLOW}$IP${NC}"
            echo ""
            echo "Use this in your mobile app:"
            echo -e "${GREEN}http://$IP:3000${NC}"
            echo ""
            echo "Make sure your phone is on the same WiFi network!"
        fi
        ;;
        
    6)
        echo ""
        echo -e "${YELLOW}🔍 Checking system requirements...${NC}"
        echo ""
        
        # Check Node.js
        if command -v node &> /dev/null; then
            echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
        else
            echo -e "${RED}❌ Node.js: Not installed${NC}"
        fi
        
        # Check npm
        if command -v npm &> /dev/null; then
            echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
        else
            echo -e "${RED}❌ npm: Not installed${NC}"
        fi
        
        # Check macOS version
        if [ "$(uname)" == "Darwin" ]; then
            VERSION=$(sw_vers -productVersion)
            echo -e "${GREEN}✅ macOS: $VERSION${NC}"
            
            # Check if version is 12.3+ (for ScreenCaptureKit)
            if [[ $(echo "$VERSION 12.3" | awk '{print ($1 >= $2)}') == 1 ]]; then
                echo -e "${GREEN}   ScreenCaptureKit supported ✅${NC}"
            else
                echo -e "${YELLOW}   ⚠️  ScreenCaptureKit requires macOS 12.3+${NC}"
            fi
        fi
        
        # Check screen recording permission
        echo ""
        echo -e "${YELLOW}📋 Required Permissions:${NC}"
        echo "1. Screen Recording"
        echo "2. Microphone (for transcription)"
        echo ""
        echo "To grant permissions:"
        echo "System Preferences > Security & Privacy > Privacy"
        echo "Enable for ScreenShare Pro"
        ;;
        
    *)
        echo ""
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Done! 🎉"
