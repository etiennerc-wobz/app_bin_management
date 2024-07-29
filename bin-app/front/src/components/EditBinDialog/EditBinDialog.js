import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createBin, createBinDEMO } from '../../api';
import { editBinInformations } from '../../api';


export default function EditBinDialog({bin, open, onClose, onBinEdited}) {

  const handleClose = () => {
    onClose();
  };

    const handleSubmit = async () => {
        const name = document.getElementById('name').value;
        const zone = document.getElementById('zone').value;
        try {
            await editBinInformations(name, zone,bin.id);
            onBinEdited();
            onClose();
        } catch (error) {
            console.error('Error editing bin:', error);
        }
    }



  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Modifier les infos de la Bin</DialogTitle>
        <DialogContent>
            <DialogContentText className="pb-4">
                Nom
          <TextField
            autoFocus
            margin="dense"
            id="name"
            placeholder={bin.name}
            type="text"
            fullWidth
            autoComplete='off'
          />
          </DialogContentText>
          <DialogContentText>
                Zone
          <TextField
            margin="dense"
            id="zone"
            placeholder={bin.zone}
            type="text"
            fullWidth
            autoComplete='off'
            />
            </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{color: 'darkred'}}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="success">
            Enregistrer
          </Button>
        </DialogActions>

      </Dialog>
    </React.Fragment>
  );
}