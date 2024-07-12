import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CommitIcon from '@mui/icons-material/Commit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { getFestivalUsers } from '../../api';


export default function FestivalUsers({ festivalId }) {

  const [open, setOpen] = React.useState(false);
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
    const [users, setUsers] = React.useState([]);

    const fetchFestivalUsers = async () => {
        try {
            const users = await getFestivalUsers(festivalId);

            setUsers(users);
        } catch (error) {
            console.error('Error fetching festival users:', error);
        }
    }

    React.useEffect (() => {
        fetchFestivalUsers();
    }
    , []);



  return (

        <Box>
          <List dense={dense} style={{ maxHeight: '270px', }}>

            {users.map((user, index) => (
              <ListItem
                key={index}
              >
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={user.name}
                />
              </ListItem>
            ))}
          </List>
        </Box>
  );
}
