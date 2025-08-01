const VITE_WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

let socket;

export const connectWebSocket = (onOpenCallback) => {
  socket = new WebSocket(VITE_WS_BASE_URL);

  socket.onopen = () => {
    console.log('WS: Connected to the server.')
    if (onOpenCallback) onOpenCallback();
  };

  socket.onmessage = (event) => {
    console.log('WS: Message from server:', event.data);
  };

  socket.onclose = () => {
    console.log('WS: Disconnected from server');
    // Attempt reconnect here
  };

  socket.onerror = (error) => {
    console.error('WS: Error', error);
  };

  return socket;
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);

  } else {
    console.warn('WS: Connection not open. Cannot send message.')
  }
};