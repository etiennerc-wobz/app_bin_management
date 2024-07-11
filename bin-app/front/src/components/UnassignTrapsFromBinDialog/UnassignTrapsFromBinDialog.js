import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { getBinTraps, unassignTrapsFromBin } from '../../api';
import { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

export default function UnassignTrapsFromBinDialog({ binId, open, onClose, onUpdate }) {
    const [selectedTraps, setSelectedTraps] = useState([]);
    const [thisBinTraps, setThisBinTraps] = useState([]);

    const handleClose = () => {
        onClose();
    };

    const handleCancel = () => {
        setSelectedTraps([]);
        onClose();
    };

    const fetchBinTraps = async (binId) => {
        try {
            console.log('Fetching traps for bin:', binId);
            const returnedTraps = await getBinTraps(binId);
            console.log('Traps:', returnedTraps);
            setThisBinTraps(returnedTraps);
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
            await unassignTrapsFromBin(binId, selectedTraps);
            onUpdate(); // Ensure onUpdate is called to trigger Bin component update
            fetchBinTraps(binId); // Fetch updated traps after unassignment
            onClose();
            console.log('Traps unassigned from bin:', selectedTraps);
        } catch (error) {
            console.error('Error unassigning traps from bin:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchBinTraps(binId);
        } else {
            setSelectedTraps([]);
        }
    }, [open, binId]);

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
                    <DialogContentText className='pb-4 text-xl font-semibold text-gray-800'>
                        Traps associées à cette bin:
                    </DialogContentText>

                    {thisBinTraps.length === 0 ? (
                        <p className='text-base text-gray-700'>
                            Aucun trap associée.
                        </p>
                    ) : (
                        <FormGroup>
                            {thisBinTraps.map((trap, index) => (
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
                                    onClick={onClose}
                                    className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                >
                                    Annuler
                                </Button>
                                <Button
                                    sx={{ color: '#0D5200' }}
                                    type="submit"
                                    className='px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                >
                                    Désassigner
                                </Button>
                            </DialogActions>
                        </FormGroup>
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
