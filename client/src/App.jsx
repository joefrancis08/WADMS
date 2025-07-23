import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/Register';
import Pending from './pages/Pending/Pending';
import NotFound from './pages/NotFound';
import PendingSkeleton from './pages/Pending/PendingSkeletonLoader';
import LandingRedirect from './pages/LandingRedirect';
import AdminHome from './pages/Dean-and-Chairman/adminHome';
import AdminUsers from './pages/Dean-and-Chairman/AdminUsers';
import AdminUnverifiedUsers from './pages/Dean-and-Chairman/AdminUnverifiedUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingRedirect />}/>
        <Route 
          path="/pending-verification"
          element={
            <ProtectedRoute 
              allowedStatuses={['Pending']} 
              allowedRoles={['Unverified User']} 
              fallbackRoute='/register'
              loader={<PendingSkeleton />} 
            >
              <Pending />
            </ProtectedRoute>
          }
        />

        {/* Routes for admin */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute 
              allowedStatuses={['Verified', 'Pending']} 
              allowedRoles={['Dean', 'Chairman', 'Unverified User']} 
              fallbackRoute='/not-found'
              loader={<div>Loading...</div>} 
            >
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/users"
          element={
            <ProtectedRoute 
              allowedStatuses={['Verified', 'Pending']} 
              allowedRoles={['Dean', 'Chairman', 'Unverified User']} 
              fallbackRoute='/not-found'
              loader={<div>Loading...</div>} 
            >
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/users/unverified"
          element={
            <ProtectedRoute 
              allowedStatuses={['Verified', 'Pending']} 
              allowedRoles={['Dean', 'Chairman', 'Unverified User']} 
              fallbackRoute='/not-found'
              loader={<div>Loading...</div>} 
            >
              <AdminUnverifiedUsers />
            </ProtectedRoute>
          }
        />

        <Route path='/register' element={<Register />}/>
        <Route path='/pending-verification' element={<Pending />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
