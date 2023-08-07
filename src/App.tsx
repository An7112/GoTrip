import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css';
import Header from 'component/header/header';
import Home from 'pages/home/home';
import FilteredListPage from 'pages/filterpage/filtered-list-page';
import Booking from 'pages/booking/booking';
import ThanksYou from 'pages/thanks-you/thanks-you';

function App() {

  return (
    <BrowserRouter>
      <div className="container">
        <div className="main">
          <Header />
          <Routes>
            <Route path='/' element={<Navigate to='/Home' />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/filtered' element={<FilteredListPage />} />
            <Route path='/booking' element={<Booking />} />
            <Route path='/Thank-you' element={<ThanksYou />} />
          </Routes>
          {/* Footer */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
