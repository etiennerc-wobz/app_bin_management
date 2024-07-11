import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { getFreeFestivalTraps } from '../../api';
import { useState, useContext, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { AuthContext } from '../AuthContext/AuthContext';
import { getFavoriteFestival } from '../../api';
import { assignTrapsToBin } from '../../api';

export default function AssignTrapsToBinDialog({ traps, binId, open, onClose, onUpdate }) {
    const [selectedTraps, setSelectedTraps] = useState([]);
    const [thisFestivalTraps, SetThisFestivalTraps] = useState([]);
    const [festival, setFestival] = useState('');
    const { user } = useContext(AuthContext);

    const handleClose = () => {
        onClose();
    };

    const handleCancel = () => {
        setSelectedTraps([]);
        onClose();
    };

    const fetchThisFestival = async () => {
        try {
            const festivalReturned = await getFavoriteFestival(user.id);
            setFestival(festivalReturned);
            fetchFestivalTraps(festivalReturned.id);
        } catch (error) {
            console.error('Error fetching favorite festival:', error);
        }
    };

    const fetchFestivalTraps = async (festivalId) => {
        try {
            const traps = await getFreeFestivalTraps(festivalId);
            SetThisFestivalTraps(traps);
        } catch (error) {
            console.error('Error fetching traps:', error);
        }
    };

    const handleCheckboxChange = (event, trapId) => {
        if (event.target.checked) {
            setSelectedTraps([...selectedTraps, trapId]);
        } else {
            setSelectedTraps(selectedTraps.filter(id => id !== trapId));
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedTraps.length === 0) {
          onClose();
          return;
        }
        try {
          await assignTrapsToBin(binId, selectedTraps);
          onUpdate();
          onClose();
          console.log('Traps assigned to bin:', selectedTraps);
        } catch (error) {
          console.error('Error assigning traps to bin:', error);
        }
      };
      

    useEffect(() => {
        fetchThisFestival();
    }, [selectedTraps]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                    className: 'bg-white rounded-lg shadow-lg',
                }}
            >
                <DialogContent>
                    <DialogContentText className='pb-4 text-xl font-semibold text-gray-800'>
                        Liste des traps disponibles pour ce festival:
                    </DialogContentText>

                    {thisFestivalTraps.length === 0 ? (
                        <p className='text-base text-gray-700'>
                            Aucun trap disponible pour ce festival. <br />
                            Veuillez en ajouter depuis la page <strong>Festival</strong>.
                        </p>
                    ) : (
                        <FormGroup>
                            {thisFestivalTraps.map((trap, index) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={(event) => handleCheckboxChange(event, trap.id)}
                                            sx={{
                                                color: '#0D5200',
                                                '&.Mui-checked': {
                                                    color: '#0D5200',
                                                },
                                            }}
                                        />
                                    }
                                    label={`Trap ${trap.id}`}
                                    key={index}
                                    checked={selectedTraps.includes(trap.id)}
                                    className='text-gray-700'
                                />

                            ))}

                            <DialogActions>
                                <Button
                                    sx={{ color: '#2A0000' }}
                                    onClick={handleCancel}
                                    className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                >
                                    Annuler
                                </Button>
                                <Button
                                    sx={{ color: '#0D5200' }}
                                    type="submit"
                                    className='px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                >
                                    Valider
                                </Button>
                            </DialogActions>
                        </FormGroup>
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
