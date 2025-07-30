import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  allowedStatuses = [], 
  allowedRoles = [],
  fallbackRoute, 
  loader
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>{loader}</div>
  if (!user) return <Navigate to={fallbackRoute} />

  // If allowedStatuses are not empty, allow only the status that are in the list/array, if empty, allow any status.
  const isStatusAllowed = allowedStatuses.length === 0 || allowedStatuses.includes(user.status);
  // If isRoleAllowed are not empty, allow only the role that are in the list/array, if empty allow any role.
  const isRoleAllowed = allowedRoles.length === 0 || allowedRoles.includes(user.role);

  if (!isStatusAllowed && !isRoleAllowed) {
    return <Navigate to={fallbackRoute} replace />
  }

  return children;
};

export default ProtectedRoute;
