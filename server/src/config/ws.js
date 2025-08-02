import { WebSocketServer } from 'ws';

let wss;

const setupWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  console.log('WebSocket is setup.');

  wss.on('connection', (ws) => {
    console.log('WS Server: Client connected.');

    ws.on('message', (message) => {
      console.log(`WS Server: Received message: ${message}`);
      ws.send(`This is from server.`);
    });

    ws.on('close', () => {
      console.log('WS Server: Client disconnected');
    })
  });
};

export default setupWebSocket;

export const getWSS = () => {
  return wss;
};