import { connectWebSocket } from "./socket";

export const messageHandler = (callback) => {
  const socket = connectWebSocket();

  const userUpdateHandler = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'user-update' && data.isUpdated) {
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