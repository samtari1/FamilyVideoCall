const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const ALLOWED_MESSAGE_TYPES = new Set(["call", "dashboard"]);

app.use(express.static("public"));

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
