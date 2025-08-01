import { useEffect, useState } from "react";
import axios from 'axios';
import { connectWebSocket, receiveMessage } from "../services/socket";

export const useUsersBy = (key, value) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const socket = connectWebSocket();

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

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'user-update' && data.isUpdated) {
        fetchUsers();
      }
    };

    // Clean up on unmount
    return () => {
      console.log('Cleaning up WebSocket Connection.')
      socket.close();
      controller.abort();
    };
  }, [key, value]);

  return { users, loading, error };
};
