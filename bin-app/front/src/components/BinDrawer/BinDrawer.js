import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import LockIcon from '@mui/icons-material/Lock';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import { useMediaQuery } from '@mui/material';

export default function BinDrawer({ open, setOpen, onAction }) {

  const isMobile = useMediaQuery('(max-width:640px)');

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  }


  const handleAction = (actionDone) => {
    onAction(actionDone);
  }

  const DrawerList = (
    <Box sx={{ width: isMobile ? 240 : 290 }}
      role="presentation" onClick={toggleDrawer(false)}>
      <List
        sx={{
          paddingTop: { xs: 0, sm: 2 },
        }}
      >

        <ListItem disablePadding onClick={() => handleAction('gps')}>
          <ListItemButton >
            <ListItemIcon>
              <EditLocationIcon />
            </ListItemIcon>
            <ListItemText primary="Changer position" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleAction('edit')}>
          <ListItemButton >
            <ListItemIcon>
              <SpellcheckIcon />
            </ListItemIcon>
            <ListItemText primary="Renommer nom/zone" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleAction('unassigntraps')}>
          <ListItemButton >
            <ListItemIcon>
              <PlaylistRemoveIcon />
            </ListItemIcon>
            <ListItemText primary="Retirer traps" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding onClick={() => handleAction('closeLeftDoor')}>
          <ListItemButton >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Verrouiller porte Gauche" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleAction('closeRightDoor')}>
          <ListItemButton >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Verrouiller porte Droite" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          zIndex: 2,
          '& .MuiDrawer-paper': {
            width: isMobile ? 240 : 290,
            boxSizing: 'border-box',
            backgroundColor: '#f0f0f0',
            color: 'black',
            border: 'none',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
          },
        }}
        anchor='right'
      >
        <div className="text-white p-4 text-center bg-green-800 mb-2 sm:mt-16">
          Menu Bin
        </div>
        {DrawerList}
      </Drawer>
    </div>
  );

}
