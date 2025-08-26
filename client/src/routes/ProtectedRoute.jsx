import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [],
  fallbackRoute,
  loader
}) => {
  // const { user, isLoading } = useAuth();

  // 1. Wait for loading
  // if (isLoading) {
  //   return <div>{loader}</div>;
  // }

  // 2. Redirect if no user
  // if (!user) {
  //   return <Navigate to={fallbackRoute} replace />;
  // }

  // 3. Safe to read status and role
  // const isRoleAllowed = allowedRoles.length === 0 || allowedRoles.includes(user.role);

  // if (!isRoleAllowed) {
  //   return <Navigate to={fallbackRoute} replace />;
  // }

  // 4. Render protected content
  return children;
};

export default ProtectedRoute;
