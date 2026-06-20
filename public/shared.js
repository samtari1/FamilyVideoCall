const WS_PROTOCOL = location.protocol === "https:" ? "wss:" : "ws:";
const WS_URL = `${WS_PROTOCOL}//${location.host}`;

function connectSocket(onMessage) {
  let socket = null;
  const connection = {
    get readyState() {
      return socket ? socket.readyState : WebSocket.CONNECTING;
    },
    send(payload) {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        return false;
      }

      socket.send(payload);
      return true;
    }
  };

  function createSocket() {
    socket = new WebSocket(WS_URL);

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data, connection);
      } catch {
        return;
      }
    });

    socket.addEventListener("close", () => {
      setTimeout(() => {
        createSocket();
      }, 1000);
    });

    return socket;
  }

  createSocket();
  return connection;
}

function sendMessage(socket, data) {
  if (socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  socket.send(JSON.stringify(data));
  return true;
}