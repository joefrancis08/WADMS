import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { USER_ROLES, USER_STATUS } from './constants/user';
import PATH from './constants/path';
import ProtectedRoute from './routes/ProtectedRoute';
import Register from './pages/Register';
import Pending from './pages/Pending/Pending';
import NotFound from './pages/NotFound';
import PendingSkeleton from './pages/Pending/PendingSkeletonLoader';
import LandingRedirect from './pages/LandingRedirect';
import deanChairmanRoutes from './routes/Dean-and-Chairman/DeanChairmanRoute';

const { PUBLIC, UNVERIFIED_USER } = PATH;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PUBLIC.DEFAULT} element={<LandingRedirect />}/>
        <Route 
          path={UNVERIFIED_USER.PENDING}
          element={
            <ProtectedRoute 
              allowedStatuses={[USER_STATUS.PENDING]} 
              allowedRoles={[USER_ROLES.DEFAULT]} 
              fallbackRoute={PUBLIC.REGISTER}
              loader={<PendingSkeleton />} 
            >
              <Pending />
            </ProtectedRoute>
          }
        />

        <Route path={PUBLIC.REGISTER} element={<Register />}/>
        <Route path={PUBLIC.NOT_FOUND} element={<NotFound />} />

        {deanChairmanRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
