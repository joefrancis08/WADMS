import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import deanRoutes from './routes/DeanRoute';
import publicRoute from './routes/PublicRoute';
import taskForceRoutes from './routes/TaskForceRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoute}
        {deanRoutes}
        {taskForceRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
