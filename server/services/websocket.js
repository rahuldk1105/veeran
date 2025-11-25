const { WebSocketServer } = require('ws');

let wss;

const initWebSocket = (server) => {
  wss = new WebSocketServer({ 
    server,
    path: '/',
    perMessageDeflate: false,
  });

  wss.on('connection', (ws, req) => {
    console.log(`Client connected to WebSocket from ${req.socket.remoteAddress}`);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log(`Received message:`, data);
      } catch (e) {
        console.log(`Received raw message: ${message}`);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket Server initialized on path /');
};

const broadcast = (data) => {
  if (!wss) {
    console.error('WebSocket server not initialized');
    return;
  }

  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
};

module.exports = {
  initWebSocket,
  broadcast,
};
