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
import DeleteIcon from '@mui/icons-material/Delete';
import AssignTrapsToFestivalDialog from '../AssignTrapsToFestivalDialog/AssignTrapsToFestivalDialog';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import { unassignTrapFromFestival } from '../../api';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

import InventoryIcon from '@mui/icons-material/Inventory';
import Divider from '@mui/material/Divider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function FestivalTraps({ festivalId, traps, onUpdate }) {
  const [open, setOpen] = React.useState(false);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = React.useState(false);
  const [confirmationDialogMessage, setConfirmationDialogMessage] = React.useState('');
  const [graalToUnassign, setGraalToUnassign] = React.useState(null);
  const { user } = useContext(AuthContext);
  const graals = traps;

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUnassignGraal = (graalId) => () => {
    const graal = graals.find((graal) => graal.id === graalId);
    setGraalToUnassign(graal);
    setConfirmationDialogMessage(`Voulez-vous vraiment supprimer la graal ${graalId} du festival ?`);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationDialogClose = async (answer) => {
    setConfirmationDialogOpen(false);

    if (answer && graalToUnassign) {
      try {
        await unassignTrapFromFestival(graalToUnassign.id);
        onUpdate();
      } catch (error) {
        console.error('Error unassigning graal:', error);
      }
    }

    setGraalToUnassign(null);
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
          secondary={open ? null : `${graals.length} graals associées`}
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

            {graals.length === 0 && (
              <h4 style={{ textAlign: 'center', color: 'rgba(0,0,0,0.6)', margin: '1rem 0' }}>
                Aucune graal associée
              </h4>
            )}
            {graals.map((graal, index) => (
              <React.Fragment key={index}>
                <ListItem
                  key={index}
                  secondaryAction={
                    user.iswobzadmin && (
                      <IconButton edge="end" aria-label="delete" onClick={handleUnassignGraal(graal.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                <ListItemText
                  sx={{ fontFamily: 'Inter, sans-serif' , paddingLeft: 2}}
                  primary={
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>
                      {`Graal ${graal.id}`}
                    </span>
                  }
                  secondary={secondary ? 'Secondary text' : null}
                />
              </ListItem>
              {index < graals.length - 1 && <Divider sx={{ width: '90%', margin: 'auto' }} />}
              </React.Fragment>
            ))}

            {user.iswobzadmin && (
              <AddCircleOutlineIcon
                variant="contained"
                onClick={handleDialogOpen}
                sx={{ color: '#74BDB6', margin:1, fontSize: 40, margin: 'auto', display: 'block', cursor: 'pointer' }}
              />
                
            )}

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
