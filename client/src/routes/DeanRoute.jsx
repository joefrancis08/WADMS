import { Route } from 'react-router-dom';
import { USER_ROLES, USER_STATUS } from '../constants/user';
import PATH from '../constants/path';
import ProtectedRoute from './ProtectedRoute';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import Dashboard from '../pages/Dean/Dashboard';
import UnverifiedUsers from '../pages/Dean/UnverifiedUser';
import TaskForce from '../pages/Dean/TaskForce';
import Documents from '../pages/Dean/Documents';
import TaskForceDetail from '../pages/Dean/TaskForceDetail';

const { 
  DASHBOARD, TASK_FORCE_DETAIL_TEMPLATE, UNVERIFIED_USERS,
  UNVERIFIED_USERS_ID, TASK_FORCE, DOCUMENTS
} = PATH.DEAN;
const { NOT_FOUND_URL } = PATH.PUBLIC;
const { DEAN, UNVERIFIED_USER } = USER_ROLES; // UNVERIFIED_USER is for test.
const { PENDING, VERIFIED } = USER_STATUS;

const protectedRoutes = [
  {
    path: DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: TASK_FORCE,
    element: <TaskForce />,
  },
  {
    path: UNVERIFIED_USERS,
    element: <UnverifiedUsers />,
  },
  {
    path: TASK_FORCE_DETAIL_TEMPLATE,
    element: <TaskForceDetail />,
  },
  {
    path: UNVERIFIED_USERS_ID,
    element: <UnverifiedUsers />,
  },
  {
    path: DOCUMENTS,
    element: <Documents />
  }
];

const Loader = (
  <div className="w-full h-screen flex items-center justify-center">
    <LoadSpinner height={'h-16'} width={'w-16'}/>
  </div> 
);

const deanRoutes = protectedRoutes.map(({ path, element }) => (
  <Route 
    key={path}
    path={path}
    element={
      <ProtectedRoute 
        allowedRoles={[]} // Allowed Role: Dean
        loader={Loader} 
        fallbackRoute={NOT_FOUND_URL}
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default deanRoutes;
