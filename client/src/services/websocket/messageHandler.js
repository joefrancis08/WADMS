import { connectWebSocket } from "./socket";

export const messageHandler = (callback) => {
  // Create and connect to the WebSocket server
  const socket = connectWebSocket();

  // Log when the connection is successfully established
  socket.addEventListener('open', () => {
    console.log('Websocket connected!');
  });

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
            console.log('User update received');
            callback(); // Trigger the callback (e.g., refetch data in React Query)
            break;

          case 'accreditation-levels-update':
            callback();
            break;
          
          case 'programs-to-be-accredited-update':
            console.log('Programs-to-be-accredited update received.');
            callback(); // Trigger the callback again for this case
            break;

          case 'programs-to-be-accredited-deleted':
            console.log('Programs-to-be-accredited delete update received.');
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