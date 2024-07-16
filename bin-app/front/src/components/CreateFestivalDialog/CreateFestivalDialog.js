import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createFestival } from '../../api';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { useState } from 'react';
import dayjs from 'dayjs';
import { frFR } from '@mui/x-date-pickers/locales';

import { useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

export default function CreateFestivalDialog({ open, onClose, onFestivalCreated }) {

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const {user} = useContext(AuthContext);

    const handleClose = () => {
        onClose();
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        if (date.isBefore(startDate)) {
            alert("La date de fin ne peut pas être avant la date de début");
        } else {
            setEndDate(date);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        if(startDate.isAfter(endDate)) {
            alert("La date de fin ne peut pas être avant la date de début");
            return;
        }
        
        formJson.userId = user.id;


        formJson.startDate = startDate.toISOString();
        formJson.endDate = endDate.toISOString();
        
        try {
            const response = await createFestival(formJson);
            
            onFestivalCreated(response.festivalId);
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la création du festival:', error);
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
                <DialogTitle>Nouveau festival</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Veuillez entrer les informations du Festival
                    </DialogContentText>


                    <TextField
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nom"
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ mb: 2 }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Date de début"
                            format="DD/MM/YYYY"
                            value={startDate}
                            onChange={handleStartDateChange}
                            sx={{ mb: 2 }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Date de fin"
                            format="DD/MM/YYYY"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </LocalizationProvider>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                    sx={{ color: '#44150F' }}
                    >Annuler</Button>
                    <Button type="submit"
                    sx={{ color: '#0F4430' }}
                    >Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}