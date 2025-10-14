import React from 'react'
import PATH from '../constants/path'
import Dashboard from '../pages/Task-Force/Dashboard';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import Accreditation from '../pages/Task-Force/Accreditation';
import { USER_ROLES } from '../constants/user';

const { 
  DASHBOARD,
  ACCREDITATION
} = PATH.TASK_FORCE;

const { LOGIN, NOT_FOUND_URL } = PATH.PUBLIC;

const protectedRoutes = [
  { path: DASHBOARD, element: <Dashboard />},
  { path: ACCREDITATION, element: <Accreditation />}
];

const Loader = (
  <div className="w-full h-screen flex items-center justify-center">
    <LoadSpinner height={'h-16'} width={'w-16'}/>
  </div> 
);

const taskForceRoutes = protectedRoutes.map(({ path, element }) => (
  <Route 
    key={path}
    path={path}
    element={
      <ProtectedRoute
        allowedRoles={[USER_ROLES.TASK_FORCE_CHAIR, USER_ROLES.TASK_FORCE_MEMBER]} // Allowed Role: Task Force
        loader={Loader}
        fallbackRoute={LOGIN}
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default taskForceRoutes;
