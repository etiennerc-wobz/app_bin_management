import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createBin, createBinDEMO } from '../../api';


export default function NewBinDialog({open, onClose, onBinAdded, festivalId}) {

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append('festival', festivalId);
    const formJson = Object.fromEntries(formData.entries());
    console.log('formJson:', formJson);
    try {
      const response = await createBinDEMO(formJson);
        console.log('response:', response);
        onBinAdded();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la création de la bin:', error);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          
        }}
      >
        <DialogTitle>Nouvelle Bin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez entrer les informations de la Bin
          </DialogContentText>

          <TextField
            required
            margin="dense"
            id="id"
            name="id"
            label="ID"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            required
            margin="dense"
            id="zone"
            name="zone"
            label="Zone"
            type="text"
            fullWidth
            variant="standard"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}