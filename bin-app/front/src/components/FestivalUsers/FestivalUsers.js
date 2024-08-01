import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { getFestivalUsers, getUserRole, changeUserRole, removeUserFromFestival } from '../../api';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';
import Divider from '@mui/material/Divider';

import AddUsersToFestival from '../AddUsersToFestival/AddUsersToFestival';

export default function FestivalUsers({ festivalId, onUsersChanged }) {
  const [open, setOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success');
  const [addUsersDialogOpen, setAddUsersDialogOpen] = useState(false);
  const [myRole, setMyRole] = useState('');

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


  const fetchUserRole = async () => {
    try {
      const role = await getUserRole(user.id, festivalId);
      setMyRole(role.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };
  useEffect(() => {
    fetchUserRole();
  }, []);


  const handleClickOpen = (selectedUser) => {
    setSelectedUser(selectedUser);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };


  const handleUsersAdded = () => {
    fetchFestivalUsers();
    onUsersChanged();
    setOpenSnackbar(true);
    setSnackbarMessage('Utilisateurs ajoutés avec succès');

  };

  const handleAddUsers = () => {
    setAddUsersDialogOpen(true);
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

  const hasAdminRights = user?.iswobzadmin || users.some(u => u.id === user.id && u.role.role === 'admin');

  const sortUsers = (users) => {
    return users.sort((a, b) => {
      if (a.id === user.id) return -1;
      if (b.id === user.id) return 1;

      const roleOrder = {
        owner: 1,
        admin: 2,
        participant: 3,
        unknown: 4
      };

      if (roleOrder[a.role.role] !== roleOrder[b.role.role]) {
        return roleOrder[a.role.role] - roleOrder[b.role.role];
      }

      return a.name.localeCompare(b.name);
    });
  };

  return (
    <>
    <Box
      className="user-list-box font-sans"
      sx={{
        bgcolor: listOpen ? '#E6F4F2' : '#C1EAE5',
        pb: listOpen ? 0 : 0,
        transition: 'background-color 0.3s ease',
        width: 'full',
        borderRadius: '18px',
        fontFamily: 'Inter, sans-serif',
        maxHeight: '16rem',
      }}
    >
      <ListItemButton
        alignItems="flex-start"
        onClick={handleListClick}
        sx={{
          px: 3,
          pt: 2.5,
          pb: listOpen ? 1.5 : 2.5,
          borderRadius: '18px',
          backgroundColor: '#C1EAE5',
          '&:hover, &:focus': { backgroundColor: '#C1EAE5', borderRadius: '18px' },
          '@media (max-width: 600px)': {
            px: 2,
            pt: 2,
            pb: 2,
            borderRadius: '18px',
          },
        }}
      >
        <AccountCircleIcon sx={{ mr: 1 }} />
        <ListItemText
          primary="Utilisateurs"
          primaryTypographyProps={{
            fontFamily: 'Inter, sans-serif',
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
          <List dense style={{ maxHeight: '12rem', overflow: 'auto' }}>
            {sortUsers(users).map((mapUser, index) => (
              <React.Fragment key={index}>
                <ListItem
                  key={index}
                  className={hasAdminRights ? "hover:bg-wobzBlue hover:bg-opacity-10 rounded-2xl cursor-pointer" : ""}
                  onClick={() => handleClickOpen(mapUser)}
                  sx={{ paddingLeft: 3 }}
                >

                <ListItemText
                  sx={{ fontFamily: 'Inter, sans-serif' }}
                  primary={
                    <span style={{ fontWeight: user.id === mapUser.id ? 'bold' : 'normal', fontFamily: 'Inter, sans-serif' }}>
                      {`${mapUser.name} ${user.id === mapUser.id ? '(vous)' : ''}`}
                    </span>
                  }
                  secondary={
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>
                      {mapUser.role.role === 'owner' ? 'Propriétaire' :
                        mapUser.role.role === 'participant' ? 'Participant' :
                          mapUser.role.role === 'admin' ? 'Administrateur' :
                            'Unknown'}
                    </span>
                  }
                />
                </ListItem>
                {index < users.length - 1 && <Divider sx={{width: '90%', margin: 'auto'}} />}
              </React.Fragment>

            ))}

            {(user.iswobzadmin || myRole==='admin' || myRole==='owner')
             && (
              <AddCircleOutlineIcon
                variant="contained"
                onClick={handleAddUsers}
                sx={{ color: '#74BDB6', margin:1, fontSize: 40, margin: 'auto', display: 'block', cursor: 'pointer' }}
              />
                
            )}

          </List>

          {hasAdminRights && (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">
                <PersonIcon className="mr-2"
                />
                {selectedUser?.name}</DialogTitle>
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
                <Button onClick={handleExcludeUser} sx={{ color: '#74BDB6', fontSize: '0.9em' }}>
                  Exclure
                </Button>
                <Button onClick={handleClose} sx={{ color: '#19423d' }}>
                  Fermer
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} color={snackbarColor} />
        </Box>
      </Collapse>
    </Box>

    <AddUsersToFestival open={addUsersDialogOpen} onClose={() => setAddUsersDialogOpen(false)} festivalId={festivalId} onUsersAdded={handleUsersAdded} />
    </>

  );
}
