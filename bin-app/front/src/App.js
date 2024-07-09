// src/App.js
import React, {  useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './components/AuthContext/AuthContext';
import './App.css';
import SimpleBottomNavigation from './components/BottomNavigation/BottomNavigation';

import Festival from './pages/Festival';
import MagicBins from './pages/MagicBins';
import Map from './pages/Map';
import Bin from './pages/Bin';
import ResponsiveAppBar from './components/TopNavigation/TopNavigation';
import Login from './components/Login/Login';
import UserProfile from './pages/UserProfile';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {  loading } = useContext(AuthContext);



  if(loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router className="overflow-hidden">
      {isMobile ? <SimpleBottomNavigation /> : <ResponsiveAppBar />}
      <div className="App flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<PrivateRoute><Festival /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/magic-bins" element={<PrivateRoute><MagicBins /></PrivateRoute>} />
          <Route path="/map" element={<PrivateRoute><Map /></PrivateRoute>} />
          <Route path="/magic-bins/:id" element={<PrivateRoute><Bin /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  return user && token ? children : <Navigate to="/login" />;
};

export default App;