import { connectWebSocket } from "./socket";

export const messageHandler = (callback) => {
  // Create and connect to the WebSocket server
  const socket = connectWebSocket();

  // Log when the connection is successfully established
  // socket.addEventListener('open', () => {
  //   console.log('Websocket connected!');
  // });

  //  Handles all incoming WebSocket messages
  const messageHandler = (event) => {
    try {
      // Parse the incoming message as JSON
      const data = JSON.parse(event.data);

      // Only process messages flagged with "isUpdated"
      if (data.isUpdated && data.type) {
        // Decide what to do based on the "type" field
        switch (data.type) {
          case 'user-update':
            callback();
            break;

          case 'accreditation-levels-update':
            callback();
            break;

          case 'area-updates':
            callback();
            break;
          
          case 'info-level-program-update':
            callback();
            break;

          case 'accreditation-period-update':
            callback();
            break;

          case 'program-area-update':
            callback();
            break;

          case 'area-parameter-update':
            callback();
            break;

          case 'parameter-subparameter-update':
            callback();
            break;

          case 'subparam-indicator-update':
            callback();
            break;

          // For any unrecognized message type
          default:
            console.warn('Unhandled WebSocket message type:', data.type);
        }
      }

    } catch (error) {
      // If JSON parsing fails, log the error for debugging
      console.error('Failed to parse WebSocket message: ', error)
    }
  }

  // Attach the message handler
  socket.addEventListener('message', messageHandler);
  
  // Return the socket instance and a cleanup method
  // Cleanup ensures you properly remove the listener and close the socket
  return {
    socket,
    cleanup: () => {
      socket.removeEventListener('message', messageHandler);
      socket.close();
    }
  };
};