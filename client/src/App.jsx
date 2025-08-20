import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import deanRoutes from './routes/DeanRoute';
import publicRoute from './routes/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoute}
        {deanRoutes}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
