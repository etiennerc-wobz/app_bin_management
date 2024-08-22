import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {editFestivalInformations} from '../../api';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {MobileDatePicker} from '@mui/x-date-pickers/MobileDatePicker';

import {useState} from 'react';
import dayjs from 'dayjs';
import {frFR} from '@mui/x-date-pickers/locales';


export default function EditFestivalDialog({festival, open, onClose, onFestivalEdited}) {

    const [startDate, setStartDate] = useState(dayjs(festival.start_date));
    const [endDate, setEndDate] = useState(dayjs(festival.end_date));


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

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const start_Date = dayjs(startDate);
        const end_Date = dayjs(endDate);

        start_Date.locale('fr', frFR);
        end_Date.locale('fr', frFR);


        if (!startDate || !endDate) {
            alert("Veuillez renseigner les dates");
            return;
        }
        if (startDate.isAfter(endDate)) {
            alert("La date de fin ne peut pas être avant la date de début");
            return;
        }
        const dates = {
            start: start_Date.format(),
            end: end_Date.format()
        }
        try {
            await editFestivalInformations(name, dates, festival.id);
            onFestivalEdited(festival.id);
            onClose();
        } catch (error) {
            console.error('Error editing fest:', error);
        }
    }

    if (festival.id === -1) {
        return null;
    } else {
        return (
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Modifier les infos du Festival</DialogTitle>
                    <DialogContent>

                        <TextField

                            margin="dense"
                            id="name"
                            placeholder={festival.name}
                            type="Nom"
                            fullWidth
                            autoComplete='off'
                            sx={{mb: 2}}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Date de début"
                                format="DD/MM/YYYY"
                                value={startDate}
                                onChange={handleStartDateChange}
                                sx={{mb: 2}}
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
                        <Button onClick={handleClose} sx={{color: '#19423d'}}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit} sx={{color: '#74BDB6'}}>
                            Enregistrer
                        </Button>
                    </DialogActions>

                </Dialog>
            </React.Fragment>
        );
    }

}