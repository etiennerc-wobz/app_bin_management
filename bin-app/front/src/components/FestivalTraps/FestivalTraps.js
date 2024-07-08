import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import CommitIcon from '@mui/icons-material/Commit';
import Button from '@mui/material/Button';
import AssignTrapsToFestivalDialog from '../AssignTrapsToFestivalDialog/AssignTrapsToFestivalDialog';
import { unassignTrapFromFestival } from '../../api';
import Collapse from '@mui/material/Collapse';

export default function FestivalTraps({ festivalId, traps, onUpdate }) {
    const [open, setOpen] = React.useState(false);
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleUnassignTrap = (trapId) => async () => {
        if (window.confirm('Voulez-vous vraiment supprimer la trap ' + trapId + ' du festival ?')) {
            try {
                await unassignTrapFromFestival(trapId);

                onUpdate();
            } catch (error) {
                console.error('Error unassigning trap:', error);
            }
        }
    };

    if (festivalId === null) {
        return (
            null
        );
    }



    return (
        <Box
            sx={{
                bgcolor: open ? 'rgba(17, 110, 83, 0.2)' : null,
                pb: open ? 0 : 0,
                transition: 'background-color 0.3s ease',
                width: '20rem',
                borderRadius: '18px',
            }}
        >
            <ListItemButton
                alignItems="flex-start"
                onClick={handleClick}
                sx={{
                    px: 3,
                    pt: 2.5,
                    pb: open ? 2 : 2.5,
                    '&:hover, &:focus': { backgroundColor: 'rgba(0, 0, 0, 0.09)', borderRadius: '18px' },
                    '@media (max-width: 600px)': {
                        px: 2,
                        pt: 2,
                        pb: 2,
                    },
                }}
            >
                <ListItemText
                    primary="Voir traps"
                    primaryTypographyProps={{
                        fontSize: 15,
                        fontWeight: 'medium',
                        lineHeight: '20px',
                        mb: '2px',
                    }}
                    secondary={open ? null : traps.length + ' traps associées'}
                    secondaryTypographyProps={{
                        noWrap: true,
                        fontSize: 12,
                        lineHeight: '16px',
                        color: open ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.6)',
                    }}
                    sx={{ my: 0 ,
                    }}
                />
                <KeyboardArrowDown
                    sx={{
                        ml: 1,
                        transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box>
                        <List dense={dense} style={{ maxHeight: '270px', overflowY: 'scroll' }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleDialogOpen}
                                sx={{ mx: 2, my: 1 }}
                            >
                                Ajouter traps au festival
                            </Button>
                            {traps.map((trap, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={handleUnassignTrap(trap.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <CommitIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={'Trap ' + trap.id}
                                        secondary={secondary ? 'Secondary text' : null}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Collapse>
            <AssignTrapsToFestivalDialog open={dialogOpen} onClose={handleDialogClose} festivalId={festivalId} onUpdate={onUpdate} />
        </Box>
    );
}
