import { Route } from 'react-router-dom';
import { USER_ROLES, USER_STATUS } from '../../constants/user';
import PATH from '../../constants/path';
import ProtectedRoute from '../ProtectedRoute';
import LoadSpinner from '../../components/Loaders/LoadSpinner';
import Dashboard from '../../pages/Dean-and-Chairman/Dashboard';
import UnverifiedUsers from '../../pages/Dean-and-Chairman/UnverifiedUsers';
import VerifiedUsers from '../../pages/Dean-and-Chairman/VerifiedUsers';

const { 
  DASHBOARD, VERIFIED_USERS, 
  VERIFIED_USERS_ID, UNVERIFIED_USERS,
  UNVERIFIED_USERS_ID
} = PATH.ADMIN;
const { NOT_FOUND } = PATH.PUBLIC;
const { DEAN, CHAIRMAN, DEFAULT /* DEFAULT is for test. */ } = USER_ROLES;
const { PENDING, VERIFIED } = USER_STATUS;

const protectedRoutes = [
  {
    path: DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: VERIFIED_USERS,
    element: <VerifiedUsers />,
  },
  {
    path: UNVERIFIED_USERS,
    element: <UnverifiedUsers />,
  },
  {
    path: VERIFIED_USERS_ID,
    element: <UnverifiedUsers />,
  },
  {
    path: UNVERIFIED_USERS_ID,
    element: <UnverifiedUsers />,
  }
];

const Loader = (
  <div className="w-full h-screen flex items-center justify-center">
    <LoadSpinner height={'h-16'} width={'w-16'}/>
  </div> 
);

const deanChairmanRoutes = protectedRoutes.map(({ path, element }) => (
  <Route 
    key={path}
    path={path}
    element={
      <ProtectedRoute 
        allowedStatuses={[VERIFIED, PENDING]} /*PENDING is for test. */
        allowedRoles={[DEAN, CHAIRMAN, DEFAULT]} /*DEFAULT is for test. */
        fallbackRoute={NOT_FOUND}
        loader={Loader} 
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default deanChairmanRoutes;
