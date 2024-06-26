// src/components/BottomNavigation.js
import React from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FestivalIcon from '@mui/icons-material/Festival';

const SimpleBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToIndex = {
    '/': 0,
    '/magic-bins': 1,
    '/map': 2,
  };

  const [value, setValue] = React.useState(pathToIndex[location.pathname]);

  React.useEffect(() => {
    setValue(pathToIndex[location.pathname]);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/');
    } else if (newValue === 1) {
      navigate('/magic-bins');
    } else if (newValue === 2) {
      navigate('/map');
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction label="Festival" icon={<FestivalIcon />} />
        <BottomNavigationAction label="MagicBins" icon={<DeleteSweepIcon />} />
        <BottomNavigationAction label="Carte" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Box>
  );
};

export default SimpleBottomNavigation;