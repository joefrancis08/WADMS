import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Register />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
