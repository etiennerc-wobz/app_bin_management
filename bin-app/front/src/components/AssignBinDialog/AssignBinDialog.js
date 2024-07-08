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

export default function AssignBinDialog({ festivalId, open, onClose, onAssignment }) {

    const [bins, setBins] = useState([]);
    const [myFestivalBins, setMyFestivalBins] = useState([]);
    const [selectedBins, setSelectedBins] = useState([]);
    const {user} = useContext(AuthContext);

    const handleClose = () => {
        onClose();
    };


    const fetchBins = async () => {
        try {
            const bins = await getBins();
            console.log('Bins:', bins);
            setBins(bins);
        } catch (error) {
            console.error('Error fetching bins:', error);
        }
    }
    const fetchMyFestivalBins = async () => {
        try {
            const bins = await getMyFestivalBins(user.id);
            console.log('MyFestivalBins:', bins);
            setMyFestivalBins(bins);
            setSelectedBins(bins.map(bin => bin.id));
        } catch (error) {
            console.error('Error fetching bins:', error);
        }
    }

    const handleCheckboxChange = (event, binId) => {
        if (event.target.checked) {
            console.log('checked:', binId);
            setSelectedBins([...selectedBins, binId]);
        } else {
            console.log('unchecked:', binId);
            setSelectedBins(selectedBins.filter(id => id !== binId));
        }
    }

    React.useEffect(() => {
        fetchBins();
        fetchMyFestivalBins();
    }, []);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedBinsIds = selectedBins.map(id => ({ bin_id: id }));

        try {
            console.log('Appel API assignment, festivalId:', festivalId, 'selectedBinsIds:', selectedBinsIds);
            const response= await setFestivalBins(festivalId.id, selectedBinsIds);
            console.log('response:', response);
            onAssignment();
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la création du festival:', error);
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
                        Veuillez sélectionner les Bins à assigner
                    </DialogContentText>

                    <FormGroup>
                    {bins.map((bin, index) => (
                        <FormControlLabel
                        control={
                            <Checkbox 
                            onChange={(event) => handleCheckboxChange(event, bin.id)}
                            />
                        }
                        label={ "Bin " + bin.id + " - " + bin.name }
                        key={index}
                        checked={selectedBins.includes(bin.id)}
                        />
                    ))}
                    </FormGroup>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button type="submit">Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}