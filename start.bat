@echo off
echo Starting Chat App Server...

:: Start the Node.js unified server (HTTP + WebSocket)
start "Chat App - Node Server" cmd /c "npm install && npm start"

:: Wait a couple of seconds for server to start
timeout /t 5 /nobreak >nul

echo =======================================================
echo SERVER IS RUNNING!
echo To open on your PHONE, make sure you are on the same Wi-Fi
echo and use one of the IPv4 Addresses shown below followed by :3000
echo =======================================================
ipconfig | findstr IPv4

:: Open the app in the default web browser on this PC
start http://localhost:3000
pause
