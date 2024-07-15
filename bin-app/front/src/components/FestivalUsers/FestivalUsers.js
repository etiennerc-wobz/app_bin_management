import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CommitIcon from '@mui/icons-material/Commit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { getFestivalUsers,getFestivalOwner } from '../../api';

import { useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';


export default function FestivalUsers({ festivalId }) {

  const [open, setOpen] = React.useState(false);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const { user } = useContext(AuthContext);
  const [ownerId, setOwnerId] = React.useState(null);

  const fetchFestivalOwner = async () => {
    try {
      const owner = await getFestivalOwner(festivalId);
      setOwnerId(owner.owner);
    } catch (error) {
      console.error('Error fetching festival owners:', error);
    }
  }

  const fetchFestivalUsers = async () => {
    try {
      const users = await getFestivalUsers(festivalId);

      setUsers(users);
    } catch (error) {
      console.error('Error fetching festival users:', error);
    }
  }

  React.useEffect(() => {
    fetchFestivalUsers();
    fetchFestivalOwner();
  }
    , []);



  return (

    <Box className="bg-green-900 bg-opacity-10 p-3 sm:w-11/12 rounded-3xl">
      <h3>Utilisateurs :</h3>
      <List dense={dense} style={{ maxHeight: '270px', }}>

        {users.map((mapUser, index) => (
          <ListItem
            key={index}
          >
            <ListItemAvatar>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${mapUser.name} ${user.id === mapUser.id ? '(vous)' : ''}`}
              {...(ownerId === mapUser.id ? { secondary: 'Propriétaire' } : { secondary: 'Participant' })}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
