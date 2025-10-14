import React from 'react'
import PATH from '../constants/path'
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import Accreditation from '../pages/Task-Force/Accreditation';
import { USER_ROLES } from '../constants/user';
import Dashboard from '../pages/Internal-Assessor/Dashboard';

const { 
  DASHBOARD
} = PATH.INTERNAL_ASSESSOR;

const { LOGIN, NOT_FOUND_URL } = PATH.PUBLIC;

const protectedRoutes = [
  { path: DASHBOARD, element: <Dashboard />},
];

const Loader = (
  <div className="w-full h-screen flex items-center justify-center">
    <LoadSpinner height={'h-16'} width={'w-16'}/>
  </div> 
);

const internalAssessorRoutes = protectedRoutes.map(({ path, element }) => (
  <Route 
    key={path}
    path={path}
    element={
      <ProtectedRoute
        allowedRoles={[]} // Allowed Role: Internal Assessor
        loader={Loader}
        fallbackRoute={LOGIN}
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default internalAssessorRoutes;
