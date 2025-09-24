import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadSpinner from "../components/Loaders/LoadSpinner";

const PrivateRouteWrapper = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div><LoadSpinner width={16} height={16}/></div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRouteWrapper;
