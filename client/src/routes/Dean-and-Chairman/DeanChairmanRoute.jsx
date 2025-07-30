import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import LoadSpinner from '../../components/Loaders/LoadSpinner';
import Dashboard from '../../pages/Dean-and-Chairman/Dashboard';
import UnverifiedUsers from '../../pages/Dean-and-Chairman/UnverifiedUsers';
import VerifiedUsers from '../../pages/Dean-and-Chairman/VerifiedUsers';

const deanChairmanRoutes = [
  <Route 
    path="/admin"
    element={
      <ProtectedRoute 
        allowedStatuses={['Verified', 'Pending']} 
        allowedRoles={['Dean', 'Chairman', 'Unverified User']} 
        fallbackRoute='/not-found'
        loader={
          <div className="w-full h-screen flex items-center justify-center">
            <LoadSpinner height={'h-16'} width={'w-16'}/>
          </div>} 
      >
        <Dashboard />
      </ProtectedRoute>
    }
  />,

  <Route 
    path="/admin/verified-users"
    element={
      <ProtectedRoute 
        allowedStatuses={['Verified', 'Pending']} 
        allowedRoles={['Dean', 'Chairman', 'Unverified User']} 
        fallbackRoute='/not-found'
        loader={
          <div className="w-full h-screen flex items-center justify-center">
            <LoadSpinner height={'h-16'} width={'w-16'}/>
          </div>} 
      >
        <VerifiedUsers />
      </ProtectedRoute>
    }
  />,

  <Route 
    path="/admin/unverified-users"
    element={
      <ProtectedRoute 
        allowedStatuses={['Verified', 'Pending']} 
        allowedRoles={['Dean', 'Chairman', 'Unverified User']} 
        fallbackRoute='/not-found'
        loader={
          <div className="w-full h-screen flex items-center justify-center">
            <LoadSpinner height={'h-16'} width={'w-16'}/>
          </div>} 
      >
        <UnverifiedUsers />
      </ProtectedRoute>
    }
  />,

  <Route 
    path="/admin/unverified-users/:id"
    element={
      <ProtectedRoute 
        allowedStatuses={['Verified', 'Pending']} 
        allowedRoles={['Dean', 'Chairman', 'Unverified User']} 
        fallbackRoute='/not-found'
        loader={
          <div className="w-full h-screen flex items-center justify-center">
            <LoadSpinner height={'h-16'} width={'w-16'}/>
          </div>
        } 
      >
        <UnverifiedUsers />
      </ProtectedRoute>
    }
  />
];

export default deanChairmanRoutes;
