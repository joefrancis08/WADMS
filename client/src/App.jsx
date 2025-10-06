import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import deanRoutes from './routes/DeanRoute';
import publicRoute from './routes/PublicRoute';
import taskForceRoutes from './routes/TaskForceRoute';
import unverifiedUserRoutes from './routes/UnverifiedUserRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoute}
        {unverifiedUserRoutes}
        {deanRoutes}
        {taskForceRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
