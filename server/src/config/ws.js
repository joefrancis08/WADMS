import { WebSocketServer } from 'ws';

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  console.log('WebSocket server is setup.');

  wss.on('connection', (ws) => {
    console.log('WS: Client connected.');

    ws.on('message', (message) => {
      console.log(`WS: Received message: ${message}`);
      ws.send(`WS: Echo: ${message}`);
    });

    ws.on('close', () => {
      console.log('WS: Client disconnected');
    })
  });
};

export default setupWebSocket;