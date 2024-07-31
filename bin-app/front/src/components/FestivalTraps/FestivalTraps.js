import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CommitIcon from '@mui/icons-material/Commit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignTrapsToFestivalDialog from '../AssignTrapsToFestivalDialog/AssignTrapsToFestivalDialog';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import { unassignTrapFromFestival } from '../../api';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

import InventoryIcon from '@mui/icons-material/Inventory';

export default function FestivalTraps({ festivalId, traps, onUpdate }) {
  const [open, setOpen] = React.useState(false);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = React.useState(false);
  const [confirmationDialogMessage, setConfirmationDialogMessage] = React.useState('');
  const [trapToUnassign, setTrapToUnassign] = React.useState(null);
  const { user } = useContext(AuthContext);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUnassignTrap = (trapId) => () => {
    const trap = traps.find((trap) => trap.id === trapId);
    setTrapToUnassign(trap);
    setConfirmationDialogMessage(`Voulez-vous vraiment supprimer la trap ${trapId} du festival ?`);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = async (answer) => {
    setConfirmationDialogOpen(false);

    if (answer && trapToUnassign) {
      try {
        await unassignTrapFromFestival(trapToUnassign.id);
        onUpdate();
      } catch (error) {
        console.error('Error unassigning trap:', error);
      }
    }

    setTrapToUnassign(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-list-box')) {
        setOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (festivalId === null) {
    return null;
  }

  return (
    <Box
      className="user-list-box font-sans"
      sx={{
        bgcolor: open ? '#d7f7f4' : '#C1EAE5',
        pb: open ? 0 : 0,
        transition: 'background-color 0.3s ease',
        width: '20rem',
        borderRadius: '18px',
        fontFamily: 'Inter, sans-serif',
        width: '100%',
      }}
    >
      <ListItemButton
        alignItems="flex-start"
        onClick={handleClick}
        sx={{
          px: 3,
          pt: 2.5,
          pb: open ? 2 : 2.5,
          borderRadius: '18px',
          '&:hover, &:focus': { backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: '18px' },
          '@media (max-width: 600px)': {
            px: 2,
            pt: 2,
            pb: 2,
            borderRadius: '18px',
          },
        }}
      >
        <InventoryIcon sx={{ mr: 1 }} />
        <ListItemText
          primary="Graals"
          primaryTypographyProps={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 15,
            fontWeight: 'medium',
            lineHeight: '20px',
            mb: '2px',
            borderRadius: '18px',
          }}
          secondary={open ? null : `${traps.length} graals associées`}
          secondaryTypographyProps={{
            noWrap: true,
            fontSize: 12,
            lineHeight: '16px',
            color: open ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.6)',
          }}
          sx={{ my: 0, borderRadius: '18px' }}
        />
        <KeyboardArrowDown
          sx={{
            ml: 1,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
          }}
        />
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>
          <List dense={dense} style={{ maxHeight: '270px', overflow: 'auto' }}>
            {user.iswobzadmin && (
              <Button
                variant="contained"
                onClick={handleDialogOpen}
                sx={{ mx: 1, my: 1, backgroundColor: '#1D7C58', color: 'white', '&:hover': { backgroundColor: '#186849' } }}
              >
                Ajouter traps au festival
              </Button>
            )}
            {traps.length === 0 && (
              <h4 style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)', margin: '1rem 0' }}>
                Aucune trap associée
              </h4>
            )}
            {traps.map((trap, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  user.iswobzadmin && (
                    <IconButton edge="end" aria-label="delete" onClick={handleUnassignTrap(trap.id)}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <CommitIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>
                      {`Trap ${trap.id}`}
                    </span>
                  }
                  secondary={secondary ? 'Secondary text' : null}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
      <AssignTrapsToFestivalDialog open={dialogOpen} onClose={handleDialogClose} festivalId={festivalId} onUpdate={onUpdate} />
      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={handleConfirmationDialogClose}
        message={confirmationDialogMessage}
      />
    </Box>
  );
}
