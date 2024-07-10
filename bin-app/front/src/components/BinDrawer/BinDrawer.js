import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import EditLocationIcon from '@mui/icons-material/EditLocation';

export default function BinDrawer({ open, setOpen, onAction }) {

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
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List
        sx={{
          paddingTop: { xs: 4, sm: 12 },
        }}
      >
          <ListItem disablePadding onClick={() => handleAction('elements1')}>
            <ListItemButton >
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Elements1" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => handleAction('gps')}>
            <ListItemButton >
              <ListItemIcon>
                <EditLocationIcon />
              </ListItemIcon>
              <ListItemText primary="Changer position" />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List>
        {['Elements2'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer 
      open={open} 
      onClose={toggleDrawer(false)}
      sx={{ zIndex: 2,
        '& .MuiDrawer-paper': { 
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#f0f0f0',
          color: 'black',
          border: 'none',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
        },
       }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
