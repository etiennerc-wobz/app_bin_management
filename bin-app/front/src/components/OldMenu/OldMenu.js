import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { FormControl, InputLabel, Select } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../AuthContext/AuthContext';
import { useContext, useState, useEffect } from 'react';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import AddHomeIcon from '@mui/icons-material/AddHome';
import CreateFestivalDialog from '../CreateFestivalDialog/CreateFestivalDialog';
import EditFestivalDialog from '../EditFestivalDialog/EditFestivalDialog';
import AddUsersToFestival from '../AddUsersToFestival/AddUsersToFestival';
import PeopleIcon from '@mui/icons-material/People';
import { getUserRole } from '../../api';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(0.2),
    minWidth: 160,
    border: '0.1px solid',
    color: theme.palette.mode === 'light' ? 'rgb(56, 65, 81)' : theme.palette.grey[300],
    backgroundColor: theme.palette.mode === 'light' ? 'rgb(255, 255, 255)' : theme.palette.grey[800],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '12px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: '#00352c',
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
  },
}));

export default function OldMenu({ festival, festivals, onChangeFestival }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedFestival, setSelectedFestival] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [confirmationDialogMessage, setConfirmationDialogMessage] = useState('');
  const [dialogAnswer, setDialogAnswer] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditFestivalDialog, setOpenEditFestivalDialog] = useState(false);
  const [festivalId, setFestivalId] = useState(festival ? festival.id : null);
  const [openEditUsersDialog, setOpenEditUsersDialog] = useState(false);
  const [myRole, setMyRole] = useState('');

  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchMyRole = async () => {
    try {
      if (!festivalId) {
        return;
      }
      const role = await getUserRole(user.id, festivalId);
      setMyRole(role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    fetchMyRole();
  }, [festivalId, user]);

  const handleFestivalChange = (event) => {
    const selected = event.target.value;
    if (selected) {
      setSelectedFestival(selected.id);
      setConfirmationDialogMessage(`Voulez-vous vraiment changer de festival pour ${selected.name || 'aucun'} ?`);
      setConfirmationDialogOpen(true);
    }
  };

  const handleDialogClose = (answer) => {
    setConfirmationDialogOpen(false);
    setDialogAnswer(answer);

    if (answer) {
      onChangeFestival(selectedFestival);
    }
  };

  const handleFestivalCreated = (festivalId) => {
    setSelectedFestival(festivalId);
    onChangeFestival(festivalId);
  };

  const handleFestivalEdited = (festivalId) => {
    setSelectedFestival(festivalId);
    onChangeFestival(festivalId);
  };

  const handleLogout = () => {
    setTimeout(() => {
      logout();
    }, 200);
  };

  const handleCreateClick = () => {
    setOpenCreateDialog(true);
  };

  const handleUsersAdded = () => {
    onChangeFestival(festivalId);
  };

  return (
    <>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          minWidth: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          padding: 0,
          backgroundColor: 'transparent',
        }}
      >
        <MenuIcon sx={{ color: 'white' }} />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {(festivalId && user.iswobzadmin || myRole.role === 'admin') && (
          <>
            <MenuItem onClick={() => setOpenEditFestivalDialog(true)}>
              <EditIcon />
              Modifier infos festival
            </MenuItem>
            <MenuItem onClick={() => setOpenEditUsersDialog(true)}>
              <PeopleIcon />
              Gérer participants
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
          </>
        )}

        <MenuItem disableRipple>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 220 }} color={festivalId ? 'primary' : 'error'}>
            <InputLabel id="festival-select-label">Changer de festival</InputLabel>
            <Select labelId="festival-select-label" id="festival-select" value={selectedFestival} onChange={handleFestivalChange}>
              {festivalId && (
                <MenuItem value={{ id: -1, name: 'aucun' }} sx={{ color: 'red' }}>
                  <em>Aucun festival</em>
                </MenuItem>
              )}
              {festivals.map((mapFest) => {
                if (mapFest.id !== festivalId) {
                  return (
                    <MenuItem key={mapFest.id} value={mapFest}>
                      {mapFest.name}
                    </MenuItem>
                  );
                }
                return null;
              })}
              {!festivalId && festivals.length === 0 && (
                <p style={{ color: 'red', textAlign: 'center', margin: '0.5rem 0' }}>
                  Vous n'êtes inscrit à
                  <br />
                  aucun festival.
                </p>
              )}
            </Select>
          </FormControl>
        </MenuItem>

        {user.iswobzadmin && (
          <MenuItem onClick={handleCreateClick}>
            <AddHomeIcon />
            Créer un festival
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          Se déconnecter
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          Plus
        </MenuItem>
      </StyledMenu>
      <ConfirmationDialog open={confirmationDialogOpen} onClose={handleDialogClose} message={confirmationDialogMessage} />
      <CreateFestivalDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onFestivalCreated={handleFestivalCreated} />
      {festivalId && <EditFestivalDialog festival={festival} open={openEditFestivalDialog} onClose={() => setOpenEditFestivalDialog(false)} onFestivalEdited={handleFestivalEdited} />}
      {festivalId && <AddUsersToFestival festivalId={festivalId} open={openEditUsersDialog} onClose={() => setOpenEditUsersDialog(false)} onUsersAdded={handleUsersAdded} />}
    </>
  );
}