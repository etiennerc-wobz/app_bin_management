import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createFestival, startUsingFestivalBins } from '../../api';

import { useState } from 'react';
import { Checkbox, Divider, FormControlLabel, FormGroup } from '@mui/material';
import { getBins } from '../../api';
import { getMyFestivalBins } from '../../api';
import { AuthContext } from '../AuthContext/AuthContext';
import { useContext } from 'react';
import { setFestivalBins } from '../../api';
import { getFreeBins } from '../../api';

export default function AssignBinDialog({ festivalId, open, onClose, onAssignment }) {

    const [bins, setBins] = useState([]);
    const [myFestivalBins, setMyFestivalBins] = useState([]);
    const [selectedBins, setSelectedBins] = useState([]);
    const { user } = useContext(AuthContext);
    const [freeBins, setFreeBins] = useState([]);
    const [unusedFestivalBins, setunusedFestivalBins] = useState([]);

    const handleClose = () => {
        onClose();
    };


    const fetchBins = async () => {
        try {
            const bins = await getBins();

            setBins(bins);
        } catch (error) {
            console.error('Error fetching bins:', error);
        }
    }
    const fetchFreeBins = async () => {
        try {
            const freeBins = await getFreeBins();
            setFreeBins(freeBins);
        } catch (error) {
            console.error('Error fetching free bins:', error);
        }
    }


    const fetchMyFestivalBins = async () => {
        try {
            const bins = await getMyFestivalBins(user.id);

            setMyFestivalBins(bins);
            setSelectedBins(bins
                .filter (bin => bin.used)
                .map(bin => bin.id));
        } catch (error) {
            console.error('Error fetching bins:', error);
        }
    }

    const handleCheckboxChange = (event, binId) => {
        if (event.target.checked) {

            setSelectedBins([...selectedBins, binId]);
        } else {

            setSelectedBins(selectedBins.filter(id => id !== binId));
        }
    }

    React.useEffect(() => {
        fetchBins();
        fetchFreeBins();
        fetchMyFestivalBins();
    }, []);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedBinsIds = selectedBins.map(id => ({ bin_id: id }));

        try {
            console.log('selectedBinsIds:', selectedBinsIds);
            const response = await startUsingFestivalBins(festivalId.id, selectedBinsIds);
            
            onAssignment();
            handleClose();
        } catch (error) {
            console.error('Erreur lors de lactivation des bins:', error);
        }
    };

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
                <DialogTitle>Bins</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Veuillez sélectionner les Bins à utiliser
                    </DialogContentText>
                    <br />
                    <FormGroup>

                        <h3>Bins non utilisées assignées à ce festival : </h3>
                        {myFestivalBins.filter(bin => !bin.used ).map((bin, index) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(event) => handleCheckboxChange(event, bin.id)}
                                        sx={{
                                            color: '#19423d',
                                            '&.Mui-checked': {
                                                color: '#19423d',
                                            },
                                        }}
                                    />
                                }
                                label={"Bin " + bin.id + " (" + bin.name + ")"}
                                key={index}
                                checked={selectedBins.includes(bin.id)}
                            />
                        ))}
                        {user.iswobzadmin && (
                            <>
                                <Divider />
                                <h3>Bins non assignées à ce festival : </h3>
                                {freeBins.filter(bin => !myFestivalBins.some(festivalBin => festivalBin.id === bin.id)).map((bin, index) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(event) => handleCheckboxChange(event, bin.id)}
                                                sx={{
                                                    color: '#19423d',
                                                    '&.Mui-checked': {
                                                        color: '#19423d',
                                                    },
                                                }}
                                            />
                                        }
                                        label={"Bin " + bin.id + " (" + bin.name + ")"}
                                        key={index}
                                        checked={selectedBins.includes(bin.id)}
                                    />
                                ))}
                            </>
                        )
                        }


                    </FormGroup>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#74BDB6' }}>Annuler</Button>
                    <Button type="submit" sx={{ color: '#19423d' }}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}