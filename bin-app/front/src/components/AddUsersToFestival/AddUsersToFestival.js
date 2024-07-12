import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthContext } from '../AuthContext/AuthContext';
import { useContext } from 'react';
import { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import { getUsers } from '../../api';
import { addUsersToFestival } from '../../api';
import { getFestivalUsers } from '../../api';
export default function AddUsersToFestival({ festivalId, open, onClose, onUsersAdded }) {

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { user } = useContext(AuthContext);
    const [myFestivalUsers, setMyFestivalUsers] = useState([]);

    const handleClose = () => {
        onClose();
    };


    const fetchUsers = async () => {
        try {
            const users = await getUsers();

            setUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const fetchFestivalUsers = async () => {
        try {
            const users = await getFestivalUsers(festivalId);
            setMyFestivalUsers(users);
        } catch (error) {
            console.error('Error fetching festival users:', error);
        }
    }


    const handleCheckboxChange = (event, userId) => {
        if (event.target.checked) {

            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    }

    React.useEffect(() => {
        fetchUsers();
        fetchFestivalUsers();
    }, []);



    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedUsersIds = selectedUsers.map(id => id);
        console.log('adding usersids:', selectedUsersIds)
        try {
            const response = await addUsersToFestival(festivalId, { usersIds: selectedUsersIds });
            console.log('response:', response);
            fetchFestivalUsers();
            onUsersAdded();
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
                <DialogTitle>Utilisateurs</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Veuillez sélectionner les utilisateurs à ajouter
                    </DialogContentText>

                    <FormGroup>
                        {users.filter(user => !myFestivalUsers.find(festivalUser => festivalUser.id === user.id)).map((user, index) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(event) => handleCheckboxChange(event, user.id)}
                                        sx={{
                                            color: '#0D5200',
                                            '&.Mui-checked': {
                                                color: '#0D5200',
                                            },
                                        }}
                                    />
                                }
                                label={user.name}
                                key={index}
                                checked={selectedUsers.includes(user.id)}
                            />
                        ))}
                    </FormGroup>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#2A0000' }}>Annuler</Button>
                    <Button type="submit" sx={{ color: '#0D5200' }}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}