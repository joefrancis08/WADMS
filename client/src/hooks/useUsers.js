import { useEffect, useState } from "react";
import axios from 'axios';
import { fetchUserBy } from "../api/Users/userAPI";
import { messageHandler } from "../services/websocket/messageHandler";

export const useUsersBy = (key, value) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const res = await fetchUserBy(key, value, controller);
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

    const { cleanup } = messageHandler(fetchUsers)

    // Clean up on unmount
    return () => {
      console.log('Cleaning up WebSocket Connection.')
      cleanup();
      controller.abort();
    };
  }, [key, value]);

  return { users, loading, error };
};
