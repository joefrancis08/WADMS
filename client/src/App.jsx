import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import Pending from './pages/Pending';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PendingSkeleton from './components/Pending-Page/PendingSkeletonLoader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
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
