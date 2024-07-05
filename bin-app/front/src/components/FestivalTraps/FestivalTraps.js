import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CommitIcon from '@mui/icons-material/Commit';
import Button from '@mui/material/Button';
import AssignTrapsDialog from '../AssignTrapsDialog/AssignTrapsDialog';
import { unassignTrapFromFestival } from '../../api';

export default function FestivalTraps({ festivalId, traps, onUpdate }) {
  const [open, setOpen] = React.useState(false);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleUnassignTrap = (trapId) => async () => {
    if (window.confirm('Voulez-vous vraiment supprimer la trap ' + trapId + ' du festival ?')) {
      try {
        await unassignTrapFromFestival(trapId);
        console.log('Trap unassigned:', trapId);
        onUpdate();
      } catch (error) {
        console.error('Error unassigning trap:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        bgcolor: open ? 'rgba(71, 98, 130, 0.2)' : null,
        pb: open ? 2 : 0,
        transition: 'background-color 0.3s ease',
      }}
    >
      <ListItemButton
        alignItems="flex-start"
        onClick={handleClick}
        sx={{
          px: 3,
          pt: 2.5,
          pb: open ? 0 : 2.5,
          '&:hover, &:focus': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
          '@media (max-width: 600px)': {
            px: 2,
            pt: 2,
            pb: open ? 0 : 2,
          },
        }}
      >
        <ListItemText
          primary="Voir traps"
          primaryTypographyProps={{
            fontSize: 15,
            fontWeight: 'medium',
            lineHeight: '20px',
            mb: '2px',
          }}
          secondary={open ? null : 'Cliquez pour voir les traps'}
          secondaryTypographyProps={{
            noWrap: true,
            fontSize: 12,
            lineHeight: '16px',
            color: open ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.6)',
          }}
          sx={{ my: 0 }}
        />
        <KeyboardArrowDown
          sx={{
            ml: 1,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
          }}
        />
      </ListItemButton>
      {open && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
            sx={{ mx: 2, my: 1 }}
          >
            Ajouter traps au festival
          </Button>
          <List dense={dense} style={{ maxHeight: '270px', overflowY: 'scroll' }}>
            {traps.map((trap, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={handleUnassignTrap(trap.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <CommitIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={'Trap ' + trap.id}
                  secondary={secondary ? 'Secondary text' : null}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <AssignTrapsDialog open={dialogOpen} onClose={handleDialogClose} festivalId={festivalId} onUpdate={onUpdate} />
    </Box>
  );
}
