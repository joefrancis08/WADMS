import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadSpinner from "../components/Loaders/LoadSpinner";
import { LoaderCircle } from "lucide-react";
import { USER_ROLES } from "../constants/user";

const PublicRouteWrapper = ({ children, restricted = false }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center">
        <LoaderCircle 
          className="h-16 w-16 animate-spin text-slate-800"
        />
      </div>
    );
  }

  if (user && user.role !== USER_ROLES.UU && restricted) {
    // Redirect to the page they were on
    return <Navigate to='/' replace />;
  }

  return children;
};

export default PublicRouteWrapper;
