@echo off
echo Starting Chat App Servers...

:: Start the WebSocket server in a new command window
start "Chat App - WebSocket Server" cmd /c "python server.py"

:: Start the HTTP server in a new command window
start "Chat App - HTTP Server" cmd /c "python http_server.py"

:: Wait a couple of seconds for servers to start
timeout /t 2 /nobreak >nul

echo =======================================================
echo SERVER IS RUNNING!
echo To open on your PHONE, make sure you are on the same Wi-Fi
echo and use one of the IPv4 Addresses shown below followed by :8000
echo =======================================================
ipconfig | findstr IPv4

:: Open the app in the default web browser on this PC
start http://localhost:8000
pause
