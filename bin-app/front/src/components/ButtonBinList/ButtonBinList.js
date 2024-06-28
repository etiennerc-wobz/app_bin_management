import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { createTheme } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
          backgroundColor: '#008000',
          '&:hover': {
            backgroundColor: '#079c07',
          },
        },
      },
    },
  },
});



export default function ButtonBinList({setDeleteMode}) {
  const defaultTheme = useTheme();  // Ensure the theme is applied
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));



  const handleIconClick = (action) => {
    console.log(action.name);
    if(action.name === 'Supprimer une bin') {
        setDeleteMode(true);
    }
};

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: 10,
          transform: 'translateZ(0px)',
          flexGrow: 1,
          position: 'fixed',
          top: { xs: 20, sm: 'auto' },
          bottom: { xs: 'auto', sm: 70 },
          right: 20,
        }}
      >
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'fixed', right: 4 }}
          icon={<SpeedDialIcon />}
          direction={isMobile ? 'down' : 'left'}
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
