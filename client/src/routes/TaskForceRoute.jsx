import React from 'react'
import PATH from '../constants/path'
import Dashboard from '../pages/Task-Force/Dashboard';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadSpinner from '../components/Loaders/LoadSpinner';
import Accreditation from '../pages/Task-Force/Accreditation';
import { USER_ROLES } from '../constants/user';
import ProgramAreas from '../pages/Task-Force/ProgramAreas';
import AreaParameters from '../pages/Task-Force/AreaParameters';
import ParamSubparam from '../pages/Task-Force/ParamSubparam';
import SubparamIndicator from '../pages/Task-Force/SubparamIndicator';

const { 
  ACCREDITATION,
  PROGRAM_AREAS_TEMPLATE,
  AREA_PARAMETERS_TEMPLATE,
  PARAM_SUBPARAMS_TEMPLATE,
  SUBPARAM_INDICATORS_TEMPLATE
} = PATH.TASK_FORCE;

const { LOGIN, NOT_FOUND_URL } = PATH.PUBLIC;

const protectedRoutes = [
  { path: ACCREDITATION, element: <Accreditation />},
  { path: PROGRAM_AREAS_TEMPLATE, element: <ProgramAreas />},
  { path: AREA_PARAMETERS_TEMPLATE, element: <AreaParameters />},
  { path: PARAM_SUBPARAMS_TEMPLATE, element: <ParamSubparam />},
  { path: SUBPARAM_INDICATORS_TEMPLATE, element: <SubparamIndicator />}
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
        allowedRoles={[]} // Allowed Role: Task Force
        loader={Loader}
        fallbackRoute={LOGIN}
      >
        {element}
      </ProtectedRoute>
    }
  />
));

export default taskForceRoutes;
