const VITE_WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

let socket;

export const connectWebSocket = () => {
  socket = new WebSocket(VITE_WS_BASE_URL);

  socket.onopen = () => {
    console.log('WS Client: Connected to the server.')
  };

  socket.onclose = () => {
    console.log('WS Client: Disconnected from server');
    // Attempt reconnect here
  };

  socket.onerror = (error) => {
    console.error('WS Client: Error', error);
  };

  return socket;
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);

  } else {
    console.warn('WS Client: Connection not open. Cannot send message.')
  }
};

export const receiveMessage = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.onmessage = (e) => {
      return JSON.parse(e.data);
    }
  }
}