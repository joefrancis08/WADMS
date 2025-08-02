import { Route } from 'react-router-dom';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import ProtectedRoute from './ProtectedRoute';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import Dashboard from '../pages/Dean-and-Chairman/Dashboard';
import UnverifiedUsers from '../pages/Dean-and-Chairman/UnverifiedUser';
import VerifiedUsers from '../pages/Dean-and-Chairman/VerifiedUsers';
import VerifiedUserDetail from '../pages/Dean-and-Chairman/VerifiedUserDetail';

const { 
  DASHBOARD, VERIFIED_USERS, 
  VERIFIED_USER_DETAIL_TEMPLATE, UNVERIFIED_USERS,
  UNVERIFIED_USERS_ID
} = PATH.ADMIN;
const { NOT_FOUND } = PATH.PUBLIC;
const { DEAN, CHAIRMAN, UNVERIFIED_USER } = USER_ROLES; // UNVERIFIED_USER is for test.
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
    path: VERIFIED_USER_DETAIL_TEMPLATE,
    element: < VerifiedUserDetail/>,
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
        allowedRoles={[DEAN, CHAIRMAN, UNVERIFIED_USER]} /*UNVERIFIED_USER is for test. */
        fallbackRoute={NOT_FOUND}
        loader={Loader} 
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default deanChairmanRoutes;
