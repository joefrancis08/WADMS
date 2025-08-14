import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PATH from './constants/path';
import deanRoutes from './routes/DeanRoute';
import unverifiedUserRoute from './routes/UnverifiedUserRoute';
import publicRoute from './routes/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoute}
        {unverifiedUserRoute}
        {deanRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
