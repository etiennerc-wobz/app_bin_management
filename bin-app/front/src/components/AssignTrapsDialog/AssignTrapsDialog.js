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
import {setFestivalBins} from '../../api';
import { getFreeTraps } from '../../api';
import { assignTrapsToFestival } from '../../api';

export default function AssignTrapsDialog({ festivalId, open, onClose, onUpdate }) {

    const [selectedTraps, setSelectedTraps] = useState([]);
    const [freeTraps, setFreeTraps] = useState([]);
    const [myFestivalBins, setMyFestivalBins] = useState([]);
    const {user} = useContext(AuthContext);


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
            console.log('traps:', traps);
            setFreeTraps(traps);
        } catch (error) {
            console.error('Error fetching traps:', error);
        }
    }

    

    const handleCheckboxChange = (event, trapId) => {
        if (event.target.checked) {
            console.log('checked:', trapId);
            setSelectedTraps([...selectedTraps, trapId]);
        } else {
            console.log('unchecked:', trapId);
            setSelectedTraps(selectedTraps.filter(id => id !== trapId));
        }
    }

    React.useEffect(() => {
        fetchFreeTraps();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log('selectedTraps:', selectedTraps);
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
                <DialogTitle>Traps</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Liste des traps connectés :
                    </DialogContentText>

                    <FormGroup>
                    {freeTraps.map((trap, index) => (
                        <FormControlLabel
                        control={
                            <Checkbox 
                            onChange={(event) => handleCheckboxChange(event, trap.id)}
                            />
                        }
                        label={ "Trap " + trap.id  }
                        key={index}
                        checked={selectedTraps.includes(trap.id)}
                        />
                    ))}
                    </FormGroup>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Annuler</Button>
                    <Button type="submit">Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}