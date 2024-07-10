import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import NotFoundPage from './pages/404.tsx'
import TestPage from './tests/testPage.tsx'

function App() {

  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/test" element={<TestPage/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;