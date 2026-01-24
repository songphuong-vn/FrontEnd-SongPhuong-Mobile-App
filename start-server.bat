@echo off
echo ========================================
echo   Song Phuong Login System - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking MongoDB...
REM Check if MongoDB is running (optional - will show warning if not)
mongosh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB CLI (mongosh) not found!
    echo Make sure MongoDB is installed and running.
    echo.
)

echo [2/4] Installing server dependencies...
cd server
if not exist node_modules (
    call npm install
) else (
    echo Dependencies already installed.
)

echo [3/4] Creating .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo.
    echo IMPORTANT: Please edit server\.env file and configure:
    echo   - MONGODB_URI: Your MongoDB connection string
    echo   - JWT_SECRET: A strong random secret key
    echo   - CORS_ORIGIN: Your frontend URL (default: http://localhost:8000)
    echo.
    pause
) else (
    echo .env file already exists.
)

echo [4/4] Starting server...
echo.
echo ========================================
echo Server will start at: http://localhost:5000
echo Frontend should run at: http://localhost:8000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
