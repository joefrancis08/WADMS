import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import deanRoutes from './routes/DeanRoute';
import publicRoute from './routes/PublicRoute';
import taskForceRoutes from './routes/TaskForceRoute';
import unverifiedUserRoutes from './routes/UnverifiedUserRoute';
import internalAssessorRoutes from './routes/InternalAssessor';
import verifiedUserRoutes from './routes/VerifiedUserRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoute}
        {unverifiedUserRoutes}
        {verifiedUserRoutes}
        {deanRoutes}
        {taskForceRoutes}
        {internalAssessorRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
