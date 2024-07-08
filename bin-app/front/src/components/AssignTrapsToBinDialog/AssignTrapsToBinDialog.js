import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  getFreeFestivalTraps } from '../../api';

import { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { AuthContext } from '../AuthContext/AuthContext';
import { useContext, useEffect } from 'react';

import { getFavoriteFestival } from '../../api';    
import { assignTrapsToBin } from '../../api';

export default function AssignTrapsToBinDialog({ traps, binId, open, onClose, onUpdate }) {

    const [selectedTraps, setSelectedTraps] = useState([]);
    const [thisFestivalTraps, SetThisFestivalTraps] = useState([]);
    const [festival, setFestival] = useState('');

    const {user} = useContext(AuthContext);

    const handleClose = () => {
        onClose();
    };

    const handleCancel = () => {
        setSelectedTraps([]);
        onClose();
    }

    const fetchThisFestival = async () => {
        
        try {
            const festivalReturned = await getFavoriteFestival(user.id);
            
            setFestival(festivalReturned);
            fetchFestivalTraps(festivalReturned.id)
        } catch (error) {
            console.error('Error fetching favorite festival:', error);
        }
    }


    const fetchFestivalTraps = async (festivalId) => {
        try {
            const traps = await getFreeFestivalTraps(festivalId);
            
            SetThisFestivalTraps(traps);
            
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



    const handleSubmit = async (event) => {
        event.preventDefault();
        
        
        try {
            await assignTrapsToBin(binId, selectedTraps);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error assigning traps to bin:', error);
        }
    }

    useEffect(() => {
        fetchThisFestival();
    }
    , []);



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
                <DialogContent>
                <DialogContentText className='pb-2'>
                    Liste des traps disponibles pour ce festival: 
                </DialogContentText>

                {thisFestivalTraps.length === 0 ? (
                    <p>Aucun trap disponible pour ce festival. <br/> 
                        Veuillez en ajouter depuis la page <strong>Festival</strong>.</p>
                ) : (
                    <FormGroup>
                    {thisFestivalTraps.map((trap, index) => (
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
                )}
                </DialogContent>
                <DialogActions>
                    <Button sx={{color: '#2A0000'}} onClick={handleCancel}>Annuler</Button>
                    <Button sx={{color: '#0D5200'}} type="submit">Valider</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}