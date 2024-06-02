import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import NotFoundPage from './pages/404.tsx'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route exact path="/" element={<Login/>}/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;