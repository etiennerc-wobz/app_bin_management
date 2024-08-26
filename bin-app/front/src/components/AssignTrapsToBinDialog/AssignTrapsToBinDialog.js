import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { getFreeFestivalTraps, getFavoriteFestival, assignTrapsToBin } from '../../api';
import { useState, useContext, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { AuthContext } from '../AuthContext/AuthContext';
import { Link } from 'react-router-dom';

export default function AssignTrapsToBinDialog({ binId, open, onClose, onUpdate }) {
    const [selectedTraps, setSelectedTraps] = useState([]);
    const [thisFestivalTraps, setThisFestivalTraps] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (open) {
            const fetchThisFestival = async () => {
                try {
                    const festivalReturned = await getFavoriteFestival(user.id);
                    fetchFestivalTraps(festivalReturned.id);
                } catch (error) {
                    console.error('Error fetching favorite festival:', error);
                }
            };

            const fetchFestivalTraps = async (festivalId) => {
                try {
                    const traps = await getFreeFestivalTraps(festivalId);
                    setThisFestivalTraps(traps);
                } catch (error) {
                    console.error('Error fetching traps:', error);
                }
            };

            fetchThisFestival();
        } else {
            setSelectedTraps([]);
        }
    }, [open, user.id]);

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
        } catch (error) {
            console.error('Error assigning traps to bin:', error);
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                    className: 'bg-white rounded-lg shadow-lg',
                }}
            >
                <DialogContent>


                    {thisFestivalTraps.length === 0 ? (
                        <p className='text-base text-gray-700'>
                            Aucun trap disponible associée à ce festival. <br/>
                            {user.iswobzadmin && (
                                <p>
                                    Veuillez en associer depuis la page <strong><Link to="/" style={{
                                    textDecoration: 'underline',
                                    color: '#19423d'
                                }}>Festival</Link></strong>.
                                </p>
                            )
                            }
                        </p>
                    ) : (
                        <>
                            <DialogContentText className='pb-4 text-xl font-semibold text-gray-800'>
                                Liste des traps disponibles associées à ce festival:
                            </DialogContentText>
                            <FormGroup>
                                {thisFestivalTraps.map((trap, index) => (
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
                                        label={`Trap ${trap.id}`}
                                        key={index}
                                        checked={selectedTraps.includes(trap.id)}
                                        className='text-gray-700'
                                    />
                                ))}

                                <DialogActions>
                                    <Button
                                        sx={{color: '#74BDB6'}}
                                        onClick={onClose}
                                        className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wobzBlue'
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        sx={{color: '#19423d'}}
                                        type="submit"
                                        className='px-4 py-2 text-sm font-medium text-white bg-wobzBlue rounded-md hover:bg-wobzBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wobzBlue'
                                    >
                                        Valider
                                    </Button>
                                </DialogActions>
                            </FormGroup>

                        </>
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
