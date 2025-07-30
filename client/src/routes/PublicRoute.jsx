import { Route } from "react-router-dom";
import PATH from "../constants/path";
import LandingRedirect from "../pages/LandingRedirect";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

const { DEFAULT_PATH, REGISTER, NOT_FOUND } = PATH.PUBLIC;

const publicRouteArray = [
  {
    path: DEFAULT_PATH,
    element: <LandingRedirect />
  },
  {
    path: REGISTER,
    element: <Register />
  },
  {
    path: NOT_FOUND,
    element: <NotFound />
  }
];

const publicRoute = publicRouteArray.map(({ path, element }) => (
    <Route 
      key={path}
      path={path} 
      element={element}
    />
));

export default publicRoute;