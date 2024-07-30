import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx'
import LoginPage from './pages/Login.tsx'
import RegisterPage from './pages/RegisterPage.tsx';
import ProfilePage from './pages/Profile.tsx';
import CheckoutPage from './pages/Checkout.tsx';
import NotFoundPage from './pages/404.tsx'
import TestPage from './tests/testPage.tsx'
import { HandleMessages } from './styling/components.tsx';
import StaffHome from './pages/staffHome.tsx';

function App() {
  return (
    <HandleMessages>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/staff" element={<StaffHome/>}/>
            <Route path="/Profile" element={<ProfilePage/>}/>
            <Route path="/Checkout" element={<CheckoutPage/>}/>
            <Route path="/Login" element={<LoginPage/>}/>
            <Route path="/Register" element={<RegisterPage/>}/>
            {/*Remove for deployment*/}
            <Route path="/test" element={<TestPage/>}/>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </HandleMessages>
  )
}

export default App;