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
import { useNavigate } from 'react-router-dom';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

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

export default function GlobalMenu({  }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };





  const handleLogout = () => {
    setTimeout(() => {
      logout();
    }, 200);
  };

  const handleProfile = () => {
    navigate('/profile');
  }



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
        <MenuItem onClick={handleProfile}>
          <InsertEmoticonIcon />
          Mon profil
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <LogoutIcon />
          Se déconnecter
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          Plus
        </MenuItem>
      </StyledMenu>
    </>
  );
}