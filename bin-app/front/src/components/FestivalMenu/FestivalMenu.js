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
    marginTop: theme.spacing(1),
    minWidth: 160,
    border: '1px solid',
    color: theme.palette.mode === 'light' ? 'rgb(56, 65, 81)' : theme.palette.grey[300],
    backgroundColor: theme.palette.mode === 'light' ? 'rgb(255, 255, 255)' : theme.palette.grey[800],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),

      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function FestivalMenu({ festivalId, festivals, onChangeFestival }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openBinsDialog, setOpenBinsDialog] = React.useState(false);
  const [selectedFestival, setSelectedFestival] = React.useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFestivalChange = (event) => {
    setSelectedFestival(event.target.value.id);
    handleValidateChange(event.target.value);
  };

  const handleValidateChange = (selectedFestival) => {
    if(selectedFestival===-1) {
      if(window.confirm('Voulez-vous vraiment changer de festival pour aucun ?')) {
        onChangeFestival(-1);
      }
    } 
    if(window.confirm('Voulez-vous vraiment changer de festival pour ' + selectedFestival.name + ' ?')) {
      onChangeFestival(selectedFestival.id);
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<MenuIcon />}
        sx = {{ borderRadius: 10 ,backgroundColor: '#08852E', color: 'white', '&:hover': { backgroundColor: '#388e3c' } }}
      >
        Menu
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
        <MenuItem onClick={handleClose} disableRipple>
          <EditIcon />
          Renommer festival
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />
        <MenuItem disableRipple>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 220 }}>
            <InputLabel id="festival-select-label">Changer de festival</InputLabel>
            <Select
              labelId="festival-select-label"
              id="festival-select"
              value={selectedFestival}
              onChange={handleFestivalChange}
            >
              {festivalId && (
                <MenuItem value={-1} sx={{ color: 'red' }} >
                  <em>Aucun festival</em>
                </MenuItem>
              )}
              {festivals.map((festival) => (
                <MenuItem key={festival.id} value={festival}>
                  {festival.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          Plus
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
