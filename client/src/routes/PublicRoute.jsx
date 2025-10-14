import { Route, Navigate } from "react-router-dom";
import PATH from "../constants/path";
import LandingRedirect from "../pages/LandingRedirect";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import EmailConfirmation from "../pages/EmailConfirmation";
import Login from "../pages/Login";
import PublicRouteWrapper from "../wrapper/PublicRouteWrapper";
import Pending from "../pages/Pending/Pending";
import SharePage from "../pages/SharePage";

const { DEFAULT_PATH, REGISTER, LOGIN, EMAIL_CONFIRMATION, NOT_FOUND_DEFAULT, NOT_FOUND_URL, SHARE_PAGE } = PATH.PUBLIC;

const publicRouteArray = [
  {
    path: DEFAULT_PATH,
    element: <LandingRedirect />
  },
  {
    path: REGISTER,
    element: 
      <PublicRouteWrapper restricted={true}>
        <Register />
      </PublicRouteWrapper>
  },
  {
    path: LOGIN,
    element:
      <PublicRouteWrapper restricted={true}>
         <Login />
      </PublicRouteWrapper> 
  },
  {
    path: EMAIL_CONFIRMATION,
    element:
    <PublicRouteWrapper>
      <EmailConfirmation />
    </PublicRouteWrapper> 
  },
  {
    path: SHARE_PAGE,
    element: <SharePage />
  },
  {
    path: NOT_FOUND_URL,
    element: <NotFound />
  },
  {
    path: NOT_FOUND_DEFAULT,
    element: <Navigate to={NOT_FOUND_URL} replace/>
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