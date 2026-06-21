const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const ALLOWED_MESSAGE_TYPES = new Set(["call", "dashboard"]);

app.use(express.static("public"));

const fs = require("fs");
const path = require("path");

// Return a JSON list of image filenames located in public/photos
app.get("/api/photos", (req, res) => {
  const photosDir = path.join(__dirname, "public", "photos");

  fs.readdir(photosDir, (err, files) => {
    if (err) {
      // If folder doesn't exist or other error, return empty list
      return res.json([]);
    }

    const images = files.filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f)).map((f) => 
      // Serve via the static middleware at /photos/<filename>
      `/photos/${encodeURIComponent(f)}`
    );

    res.json(images);
  });
});

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    let data;

    try {
      data = JSON.parse(msg.toString());
    } catch {
      return;
    }

    if (!data || !ALLOWED_MESSAGE_TYPES.has(data.type)) {
      return;
    }

    const payload = JSON.stringify({ type: data.type });

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Grandma portal running on http://0.0.0.0:3000");
});
