// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Button from './components/Button/Button';
import Menu from './components/Menu/Menu';
import SimpleBottomNavigation from './components/BottomNavigation/BottomNavigation';

import Festival from './pages/Festival';
import MagicBins from './pages/MagicBins';
import Map from './pages/Map';
import Bin from './pages/Bin';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="App flex items-center justify-center min-h-screen bg-gray-100">

    <Routes>
      <Route path="/" element={<Festival />} />
      <Route path="/magic-bins" element={<MagicBins />} />
      <Route path="/map" element={<Map />} /> 
      <Route path="/magic-bins/:id" element={<Bin />} />
    </Routes>

      </div>
      <SimpleBottomNavigation />



    </Router>
  );
};

export default App;