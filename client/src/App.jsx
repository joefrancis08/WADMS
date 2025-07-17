import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import Pending from './pages/Pending/Pending';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import PendingSkeleton from './pages/Pending/PendingSkeletonLoader';
import LandingRedirect from './pages/LandingRedirect';

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

        <Route path='/register' element={<Register />}/>
        <Route path='/pending-verification' element={<Pending />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
