#!/bin/bash

set -euo pipefail

echo "Stopping Grandma Station..."

pkill -9 -f "chromium.*grandma.html" 2>/dev/null || true
pkill -9 -f "node server.js" 2>/dev/null || true

sleep 1

echo "Remaining listeners on 3000:"
ss -tulpn | grep :3000 || echo "Port 3000 is free"

echo "Done."