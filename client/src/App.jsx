import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/Register';
import Pending from './pages/Pending/Pending';
import NotFound from './pages/NotFound';
import PendingSkeleton from './pages/Pending/PendingSkeletonLoader';
import LandingRedirect from './pages/LandingRedirect';
import deanChairmanRoutes from './routes/Dean-and-Chairman/DeanChairmanRoute';

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
        <Route path='*' element={<NotFound />} />

        {deanChairmanRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
