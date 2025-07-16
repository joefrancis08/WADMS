import { useAuth } from "../contexts/AuthContext";
import NotFound from "../pages/NotFound";
import Pending from "../pages/Pending";
import Register from "../pages/Register";

const { user } = useAuth();

export const routes = [
  {
    path: '/',
    element: <Pending />
  },
  {
    path: '/pending-verification',
    element: <Register />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

