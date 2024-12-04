@echo off
echo Starting Alrada server...
echo Note: This requires administrator privileges to use port 80
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    node server.js
) else (
    echo Error: Please run as administrator
    echo Right-click this file and select "Run as administrator"
    pause
) 