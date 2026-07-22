@echo off
REM ============================================================
REM  Kodeon 1v1 Coding Arena - Windows launcher
REM  Double-click this file (or run it from CMD / PowerShell)
REM  to install dependencies and start the dev server.
REM ============================================================
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not on your PATH.
    echo         Download it from https://nodejs.org ^(LTS version^) and try again.
    pause
    exit /b 1
)

echo [1/3] Node.js found:
node --version

if not exist "node_modules" (
    echo [2/3] Installing dependencies - first run only, this can take a minute...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed. Check the output above.
        pause
        exit /b 1
    )
) else (
    echo [2/3] Dependencies already installed - skipping npm install.
)

echo [3/3] Starting the dev server at http://localhost:3000 ...
start "" http://localhost:3000
call npm run dev

pause
