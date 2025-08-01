import { useEffect, useState } from "react";
import axios from 'axios';
import { connectWebSocket, sendMessage } from "../services/socket";

export const useUsersBy = (key, value) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const socket = connectWebSocket(() => {
      console.log('Websocket is ready.');
      sendMessage('This is from client');
    });

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-${key}`, {
          params: { [key]: value },
          signal: controller.signal // Attach signal
        });
        setUsers(res.data);

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request cancelled:', error.message);
        
        } else {
          setError(error.message);
        }
      
      } finally {
        setLoading(false);
      }
      
    };

    fetchUsers();

    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);

    // Clean up on unmount
    return () => {
      console.log('Cleaning up WebSocket Connection.')
      socket.close();
      controller.abort();
      clearInterval(interval);
    };
  }, [key, value]);

  return { users, loading, error };
};
