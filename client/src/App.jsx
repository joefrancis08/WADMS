import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PATH from './constants/path';
import deanChairmanRoutes from './routes/DeanChairmanRoute';
import unverifiedUserRoute from './routes/UnverifiedUserRoute';
import publicRoute from './routes/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoute}
        {unverifiedUserRoute}
        {deanChairmanRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
