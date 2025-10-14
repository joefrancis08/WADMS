import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import deanRoutes from './routes/DeanRoute';
import publicRoute from './routes/PublicRoute';
import taskForceRoutes from './routes/TaskForceRoute';
import unverifiedUserRoutes from './routes/UnverifiedUserRoute';
import internalAssessorRoutes from './routes/InternalAssessor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoute}
        {unverifiedUserRoutes}
        {deanRoutes}
        {taskForceRoutes}
        {internalAssessorRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
