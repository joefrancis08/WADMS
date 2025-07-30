import { useEffect, useState } from "react";
import axios from 'axios';

export const useUsersByRole = (role) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-role`, {
          params: { role },
          signal: controller.signal // Attach signal
        });
        setUsers(res.data)

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
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return { users, loading, error };
};

