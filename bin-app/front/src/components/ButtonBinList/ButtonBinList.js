import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tooltip from '@mui/material/Tooltip';

const actions = [
  { icon: <SwapVertIcon />, name: 'Changer ordre' },
  { icon: <PlaylistAddIcon />, name: 'Ajouter une bin' },
  { icon: <DeleteForeverIcon />, name: 'Supprimer une bin' },
];


const theme = createTheme({
  components: {
    MuiFab: {
      styleOverrides: {
        primary: {
          backgroundColor: '#1D7C58',
          '&:hover': {
            backgroundColor: '#155A40',
          },
        },
      },
    },
  },
});



export default function ButtonBinList({ setUnassignMode, onAddBinClick }) {
  const defaultTheme = useTheme();
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));



  const handleIconClick = (action) => {

    if (action.name === 'Supprimer une bin') {
      setUnassignMode(true);
    }
    if (action.name === 'Ajouter une bin') {

      onAddBinClick();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: 20,
          height: 20,

          transform: 'translateZ(0px)',
          flexGrow: 1,
          position: 'fixed',
          top: { xs: 20, sm: 'auto' },
          bottom: { xs: 'auto', sm: 48 },
          right: { xs: 2, sm: 48 },
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial"
          sx={{
            position: 'fixed',
            right: 0,
            bottom: isMobile ? 'auto' : 0,
            transform: isMobile ? 'scale(0.7)' : 'scale(1.2)',
            '& .MuiSpeedDial-fab': {
              width: 80,
              height: 80,
            },
            '& .MuiSpeedDialAction-fab': {
              width: 60,
              height: 60,
            },

            marginTop: isMobile ? -6 : 0,


          }}
          icon={<SpeedDialIcon />}
          direction={isMobile ? 'down' : 'up'}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleIconClick(action)}
            />
          ))}
        </SpeedDial>
      </Box>
    </ThemeProvider>
  );
}
