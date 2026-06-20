#!/bin/bash

echo "===================================="
echo "Starting Grandma Station..."
echo "===================================="

pkill -f "chromium.*grandma.html" 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true

sleep 2

cd /home/samtari/Desktop/grandma-call

echo "Starting Node server..."

nohup node server.js > server.log 2>&1 &

sleep 3

if lsof -i:3000 >/dev/null; then
    echo "Server running on port 3000"
else
    echo "ERROR: Server failed to start"
    exit 1
fi

echo "Launching Dashboard..."

chromium \
  --kiosk \
  --no-first-run \
  --disable-session-crashed-bubble \
  --disable-infobars \
  http://localhost:3000/grandma.html &

echo "Grandma Station Ready!"
