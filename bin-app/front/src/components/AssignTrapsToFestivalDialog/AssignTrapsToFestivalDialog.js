import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createFestival } from '../../api';

import { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { getBins } from '../../api';
import { getMyFestivalBins } from '../../api';
import { AuthContext } from '../AuthContext/AuthContext';
import { useContext } from 'react';
import { setFestivalBins } from '../../api';
import { getFreeTraps } from '../../api';
import { assignTrapsToFestival } from '../../api';

export default function AssignTrapsToFestivalDialog({ festivalId, open, onClose, onUpdate }) {

    const [selectedTraps, setSelectedTraps] = useState([]);
    const [freeTraps, setFreeTraps] = useState([]);
    const [myFestivalBins, setMyFestivalBins] = useState([]);
    const { user } = useContext(AuthContext);


    const handleClose = () => {
        onClose();
    };

    const handleCancel = () => {
        setSelectedTraps([]);
        onClose();
    }

    const fetchFreeTraps = async () => {
        try {
            const traps = await getFreeTraps();

            setFreeTraps(traps);
        } catch (error) {
            console.error('Error fetching traps:', error);
        }
    }



    const handleCheckboxChange = (event, trapId) => {
        if (event.target.checked) {

            setSelectedTraps([...selectedTraps, trapId]);
        } else {

            setSelectedTraps(selectedTraps.filter(id => id !== trapId));
        }
    }

    React.useEffect(() => {
        fetchFreeTraps();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            await assignTrapsToFestival(festivalId, selectedTraps);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error assigning traps to festival:', error);
        }
    }



    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
                <DialogTitle>Graals</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Liste des graals disponibles :
                    </DialogContentText>

                    <FormGroup>
                        {freeTraps.map((trap, index) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(event) => handleCheckboxChange(event, trap.id)}
                                        sx={{
                                            color: '#19423d',
                                            '&.Mui-checked': {
                                                color: '#19423d',
                                            },
                                        }}
                                    />
                                }
                                label={"Trap " + trap.id}
                                key={index}
                                checked={selectedTraps.includes(trap.id)}
                            />
                        ))}
                        {freeTraps.length === 0 &&
                            <DialogContentText
                                sx={{
                                    fontSize: '1.2em', // Augmente la taille de la police
                                    color: '#19423d', // Change la couleur du texte en rouge
                                }}
                            >
                                Aucun graal disponible
                            </DialogContentText>
                        }
                    </FormGroup>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} sx={{ color: '#19423d' }}
                    >Annuler
                    </Button>
                    <Button type="submit" sx={{ color: '#74BDB6' }}
                    >Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}