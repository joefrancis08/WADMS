import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const register = (email, fullName, role, status) => {
    setUser({ email, fullName, role, status });
  }

  const login = (email, fullName, role, status) => {
    setUser({ email, fullName, role, status });
  };

  const logout = () => {
    setUser(null);
  };

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/session`, { withCredentials: true });
        const user = res.data.user;
        const { email, fullName, role, status } = user;
        if (user) setUser({ email, fullName, role, status });

      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      { children }
    </AuthContext.Provider>
  );
};

// Create custom hook for easy use
export const useAuth = () => {
  return useContext(AuthContext);
}

