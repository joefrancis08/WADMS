import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Create from './components/Create'
import Edit from './components/Edit'
import Read from './components/Read'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Create />} />
        <Route path='/home' element = {<Home />} />
        <Route path='/edit/:id' element = {<Edit />} />
        <Route path='/read/:id' element = {<Read />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
