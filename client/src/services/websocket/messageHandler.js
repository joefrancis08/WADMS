import { connectWebSocket } from "./socket";

export const messageHandler = (callback) => {
  const socket = connectWebSocket();

  socket.open = () => {
    console.log('Websocket connected!');
  };

  const userUpdateHandler = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received WS message:', data);

    if (data.isUpdated) {
      callback();
    }
  };

  socket.addEventListener('message', userUpdateHandler);

  return {
    socket,
    cleanup: () => {
      socket.removeEventListener('message', userUpdateHandler);
      socket.close();
    }
  };
};