#!/bin/bash

# AdamGuard Pro Build Script
# This script builds the desktop application for different platforms

set -e

echo "🛡️ AdamGuard Pro Build Script"
echo "================================"
echo ""

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

# Parse arguments
PLATFORM=${1:-"all"}
VERSION=${2:-"2026.2.15"}

echo "📦 Building for platform: $PLATFORM"
echo "📌 Version: $VERSION"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Install Electron dependencies
if [ ! -d "electron/node_modules" ]; then
    echo "📥 Installing Electron dependencies..."
    npm install electron electron-builder electron-is-dev concurrently wait-on --save-dev
fi

# Build Next.js app
echo ""
echo "🔨 Building Next.js application..."
npm run build

# Create build directories
mkdir -p electron/build
mkdir -p dist

# Build for specific platform
case $PLATFORM in
    "win"|"windows")
        echo ""
        echo "🪟 Building Windows installer..."
        npx electron-builder --win --x64 --ia32
        echo "✅ Windows build complete!"
        echo "📁 Output: dist/AdamGuard-Pro-${VERSION}-x64-setup.exe"
        ;;
    "mac"|"macos"|"darwin")
        echo ""
        echo "🍎 Building macOS application..."
        npx electron-builder --mac --x64 --arm64
        echo "✅ macOS build complete!"
        echo "📁 Output: dist/AdamGuard-Pro-${VERSION}.dmg"
        ;;
    "linux")
        echo ""
        echo "🐧 Building Linux application..."
        npx electron-builder --linux
        echo "✅ Linux build complete!"
        echo "📁 Output: dist/AdamGuard-Pro-${VERSION}.AppImage"
        ;;
    "all")
        echo ""
        echo "🌍 Building for all platforms..."
        npx electron-builder --win --mac --linux
        echo "✅ All builds complete!"
        ;;
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Usage: ./build.sh [win|mac|linux|all] [version]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Build process completed!"
echo "📁 Check the 'dist' folder for output files."
