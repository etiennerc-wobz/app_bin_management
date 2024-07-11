import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationDialog({ open, onClose, message }) {
  const handleAgree = () => {
    onClose(true);
  };

  const handleDisagree = () => {
    onClose(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree} sx={{ color: '#2A0000' }}
          >Annuler</Button>
          <Button onClick={handleAgree} autoFocus sx={{ color: '#0D5200' }}
          >
            Valider
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
