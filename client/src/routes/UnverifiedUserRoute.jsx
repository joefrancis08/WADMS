import React from 'react'
import PATH from '../constants/path'
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import { USER_ROLES } from '../constants/user';
import Pending from '../pages/Pending/Pending';
import Register from '../pages/Register';

const { PENDING } = PATH.UNVERIFIED_USER;

const { REGISTER } = PATH.PUBLIC;

const protectedRoutes = [
  { path: PENDING, element: <Pending /> }
];

const Loader = (
  <div className="w-full h-screen flex items-center justify-center">
    <LoadSpinner height={'h-16'} width={'w-16'}/>
  </div> 
);

const unverifiedUserRoutes = protectedRoutes.map(({ path, element }) => (
  <Route 
    key={path}
    path={path}
    element={
      <ProtectedRoute
        allowedRoles={[USER_ROLES.UU]} // Allowed Role: Unverified User
        loader={Loader}
        fallbackRoute={REGISTER}
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default unverifiedUserRoutes;
