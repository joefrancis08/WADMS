import { createContext, useContext, useState, useEffect } from 'react';
import { getUserSession } from '../api-calls/users/userAPI';

// Create Context
const AuthContext = createContext();

// Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const register = (userId, userUUID, email, fullName, profilePicPath, role, status) => {
    setUser({ userId, userUUID, email, fullName, profilePicPath, role, status });
  }

  const login = (userId, userUUID, email, fullName, profilePicPath, role, status) => {
    setUser({ userId, userUUID, email, fullName, profilePicPath, role, status });
  };

  const logout = () => {
    setUser(null);
  };

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await getUserSession();
        const { userId, userUUID, email, fullName, profilePicPath, role, status } = user ?? {};
        if (user) setUser({ userId, userUUID, email, fullName, profilePicPath, role, status });

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

