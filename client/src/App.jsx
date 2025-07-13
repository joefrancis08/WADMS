import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import Pending from './pages/Pending';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Register />} />
        <Route path='/pending-verification' element={<Pending />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
