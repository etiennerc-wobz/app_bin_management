// Import necessary libraries and components
import React, {useContext} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthContext} from './components/AuthContext/AuthContext';
import './App.css';
import SimpleBottomNavigation from './components/BottomNavigation/BottomNavigation';
import Festival from './pages/Festival';
import MagicBins from './pages/MagicBins';
import Map from './pages/Map';
import Bin from './pages/Bin';
import ResponsiveAppBar from './components/TopNavigation/TopNavigation';
import Login from './components/Login/Login';
import UserProfile from './pages/UserProfile';
import {useMediaQuery} from '@mui/material';
import {useTheme} from '@mui/material/styles';

const App = () => {
    const theme = useTheme(); // Get the current theme
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the device is mobile
    const {loading, user, token} = useContext(AuthContext); // Get authentication context

    // Show loading screen if data is still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router className="overflow-hidden ">
            {/* Show navigation bar based on user authentication and device type */}
            {user && token && (isMobile ? <SimpleBottomNavigation/> : <ResponsiveAppBar/>)}
            <div className="App flex flex-col min-h-screen font-inter">
                <Routes>
                    {/* Define routes for the application */}
                    <Route path="/" element={<PrivateRoute><Festival/></PrivateRoute>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/magic-bins" element={<PrivateRoute><MagicBins/></PrivateRoute>}/>
                    <Route path="/map" element={<PrivateRoute><Map/></PrivateRoute>}/>
                    <Route path="/magic-bins/:id" element={<PrivateRoute><Bin/></PrivateRoute>}/>
                    <Route path="/profile" element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
                </Routes>
            </div>
        </Router>
    );
};

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({children}) => {
    const {user, token} = useContext(AuthContext); // Get authentication context
    return user && token ? children : <Navigate to="/login"/>; // Redirect to login if not authenticated
};

export default App;