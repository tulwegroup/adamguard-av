# AdamGuard Pro Build Script for Windows
# This script builds the desktop application for Windows

param(
    [string]$Platform = "win",
    [string]$Version = "2026.2.15"
)

Write-Host "🛡️ AdamGuard Pro Build Script" -ForegroundColor Green
Write-Host "================================"
Write-Host ""

# Check for required tools
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is required but not installed." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is required but not installed." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building for platform: $Platform"
Write-Host "📌 Version: $Version"
Write-Host ""

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installing dependencies..."
    npm install
}

# Install Electron dependencies
Write-Host "📥 Ensuring Electron dependencies are installed..."
npm install electron electron-builder electron-is-dev concurrently wait-on --save-dev

# Build Next.js app
Write-Host ""
Write-Host "🔨 Building Next.js application..." -ForegroundColor Yellow
npm run build

# Create build directories
New-Item -ItemType Directory -Force -Path "electron/build" | Out-Null
New-Item -ItemType Directory -Force -Path "dist" | Out-Null

# Build based on platform
switch ($Platform) {
    "win" {
        Write-Host ""
        Write-Host "🪟 Building Windows installer..." -ForegroundColor Yellow
        npx electron-builder --win --x64 --ia32
        Write-Host "✅ Windows build complete!" -ForegroundColor Green
        Write-Host "📁 Output: dist/AdamGuard-Pro-$Version-x64-setup.exe"
    }
    "mac" {
        Write-Host ""
        Write-Host "🍎 Building macOS application..." -ForegroundColor Yellow
        npx electron-builder --mac --x64 --arm64
        Write-Host "✅ macOS build complete!" -ForegroundColor Green
    }
    "linux" {
        Write-Host ""
        Write-Host "🐧 Building Linux application..." -ForegroundColor Yellow
        npx electron-builder --linux
        Write-Host "✅ Linux build complete!" -ForegroundColor Green
    }
    "all" {
        Write-Host ""
        Write-Host "🌍 Building for all platforms..." -ForegroundColor Yellow
        npx electron-builder --win --mac --linux
        Write-Host "✅ All builds complete!" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Unknown platform: $Platform" -ForegroundColor Red
        Write-Host "Usage: .\build.ps1 -Platform [win|mac|linux|all] -Version [version]"
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Build process completed!" -ForegroundColor Green
Write-Host "📁 Check the 'dist' folder for output files."

# Open dist folder
explorer dist
