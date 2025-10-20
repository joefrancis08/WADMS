import React from 'react'
import PATH from '../constants/path'
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import { USER_ROLES } from '../constants/user';
import VerifiedPage from '../pages/Verified/VerifiedPage';

const { VERIFIED_TEMPLATE } = PATH.VERIFIED_USER;
const { REGISTER } = PATH.PUBLIC;
const { 
  UU, TASK_FORCE_CHAIR, TASK_FORCE_MEMBER, IA, ACCREDITOR, DEAN 
} = USER_ROLES;

const protectedRoutes = [
  { path: VERIFIED_TEMPLATE, element: <VerifiedPage /> }
];

const Loader = (
  <div className="w-full h-screen flex items-center justify-center">
    <LoadSpinner height={'h-16'} width={'w-16'}/>
  </div> 
);

const verifiedUserRoutes = protectedRoutes.map(({
path, element }) => (
  <Route 
    key={path}
    path={path}
    element={
      <ProtectedRoute
        allowedRoles={[]} // Allowed all: 
        loader={Loader}
        fallbackRoute={REGISTER}
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default verifiedUserRoutes;
