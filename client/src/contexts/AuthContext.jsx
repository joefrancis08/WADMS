import { createContext, useContext, useState, useEffect } from 'react';
import { getUserSession } from '../api/Users/userAPI';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
        const user = await getUserSession();
        const { email, fullName, role, status } = user ?? {};
        if (user) setUser({ email, fullName, role, status });

      } catch (error) {
        console.error('Error: ', error);
        
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

