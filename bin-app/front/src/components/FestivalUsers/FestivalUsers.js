import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ListItemButton from '@mui/material/ListItemButton';

import { getFestivalUsers, getFestivalOwner, changeUserRole, getUserRole, removeUserFromFestival } from '../../api';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';

export default function FestivalUsers({ festivalId, onUsersChanged }) {
  const [open, setOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');

  const fetchFestivalUsers = async () => {
    try {
      const users = await getFestivalUsers(festivalId);
      const usersWithRoles = await Promise.all(users.map(async (user) => {
        const role = await getUserRole(user.id, festivalId);
        return { ...user, role };
      }));
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching festival users:', error);
    }
  };

  useEffect(() => {
    fetchFestivalUsers();
  }, []);

  const handleClickOpen = (selectedUser) => {
    setSelectedUser(selectedUser);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChange = async (event) => {
    const newRole = event.target.value;
    try {
      await changeUserRole(selectedUser.id, festivalId, newRole);
      setUsers(users.map((user) =>
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      ));
      fetchFestivalUsers();
      onUsersChanged();
      setOpen(false); 
      setOpenSnackbar(true);
      setSnackbarMessage('Rôle modifié avec succès');
    } catch (error) {
      console.error('Error changing user role:', error);
    }
  };

  const handleExcludeUser = async () => {
    try {
      await removeUserFromFestival(selectedUser.id, festivalId);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      fetchFestivalUsers();
      onUsersChanged();
      setOpen(false); 
      setOpenSnackbar(true);
      setSnackbarMessage('Utilisateur exclu avec succès');
    } catch (error) {
      console.error('Error excluding user:', error);
    }
    setOpen(false);
    setSelectedUser(null);
  };

  const handleListClick = () => {
    setListOpen(!listOpen);
  };

  return (
    <Box
      sx={{
        bgcolor: listOpen ? 'rgba(17, 110, 83, 0.2)' : null,
        pb: listOpen ? 0 : 0,
        transition: 'background-color 0.3s ease',
        width: '20rem',
        borderRadius: '18px',
      }}
    >
      <ListItemButton
        alignItems="flex-start"
        onClick={handleListClick}
        sx={{
          px: 3,
          pt: 2.5,
          pb: listOpen ? 2 : 2.5,
          '&:hover, &:focus': { backgroundColor: 'rgba(0, 0, 0, 0.09)', borderRadius: '18px' },
          '@media (max-width: 600px)': {
            px: 2,
            pt: 2,
            pb: 2,
            borderRadius: '18px',
          },
        }}
      >
        <ListItemText
          primary="Voir users"
          primaryTypographyProps={{
            fontSize: 15,
            fontWeight: 'medium',
            lineHeight: '20px',
            mb: '2px',
            borderRadius: '18px',
          }}
          secondary={listOpen ? null : `${users.length} utilisateurs associés`}
          secondaryTypographyProps={{
            noWrap: true,
            fontSize: 12,
            lineHeight: '16px',
            color: listOpen ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.6)',
          }}
          sx={{ my: 0 }}
        />
        <KeyboardArrowDown
          sx={{
            ml: 1,
            transform: listOpen ? 'rotate(-180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
          }}
        />
      </ListItemButton>
      <Collapse in={listOpen} timeout="auto" unmountOnExit>
        <Box>
          <List dense style={{ maxHeight: '270px', overflow: 'auto' }}>
            {users.map((mapUser, index) => (
              <ListItem
                key={index}
                className="hover:bg-green-800 hover:bg-opacity-10 rounded-2xl cursor-pointer"
                onClick={() => handleClickOpen(mapUser)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${mapUser.name} ${user.id === mapUser.id ? '(vous)' : ''}`}
                  secondary={
                    mapUser.role.role === 'owner' ? 'Propriétaire' :
                    mapUser.role.role === 'participant' ? 'Participant' :
                    mapUser.role.role === 'admin' ? 'Administrateur' :
                    'Unknown'
                  }
                />
              </ListItem>
            ))}
          </List>

          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{selectedUser?.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Modifier le rôle de l'utilisateur ou l'exclure du festival.
              </DialogContentText>
              <Select
                labelId="role-select-label"
                id="role-select"
                placeholder='Rôle'
                value={selectedUser?.role.role || ''}
                onChange={handleRoleChange}
                fullWidth
              >
                <MenuItem value="participant">Participant</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleExcludeUser} color="secondary">
                Exclure
              </Button>
              <Button onClick={handleClose} color="primary">
                Fermer
              </Button>
            </DialogActions>
          </Dialog>
          <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} color={snackbarColor} />
        </Box>
      </Collapse>
    </Box>
  );
}
