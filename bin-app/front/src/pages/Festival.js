import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../components/AuthContext/AuthContext';
import {
    getFavoriteFestival,
    getFestivalTraps,
    getUserRole,
    getFestivals,
    getMyFestivals,
    changeFavoriteFestival,
    editFestivalInformations
} from '../api';
import {Button, CircularProgress} from '@mui/material';
import CreateFestivalDialog from '../components/CreateFestivalDialog/CreateFestivalDialog';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import GlobalMenu from '../components/GlobalMenu/GlobalMenu';
import FestivalTraps from '../components/FestivalTraps/FestivalTraps';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FestivalUsers from '../components/FestivalUsers/FestivalUsers';
import FestivalIcon from '@mui/icons-material/Festival';
import PlaceIcon from '@mui/icons-material/Place';
import EditIcon from '@mui/icons-material/Edit';
import EditFestivalDialog from '../components/EditFestivalDialog/EditFestivalDialog';
import ChangeFestivalMenu from '../components/ChangeFestivalMenu/ChangeFestivalMenu';

const Festival = () => {
    const {user, token} = useContext(AuthContext); // Get user and token from AuthContext
    const [favoriteFestival, setFavoriteFestival] = useState(null); // State to store the favorite festival
    const [traps, setTraps] = useState([]); // State to store traps
    const [festivals, setFestivals] = useState([]); // State to store festivals
    const [openCreateDialog, setOpenCreateDialog] = useState(false); // State to control the visibility of the create festival dialog
    const [openSnackbar, setOpenSnackbar] = useState(false); // State to control the visibility of the snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State to store the snackbar message
    const [snackbarColor, setSnackbarColor] = useState('success'); // State to store the snackbar color
    const [loading, setLoading] = useState(true); // State to control the loading state
    const [allFestivals, setAllFestivals] = useState([]); // State to store all festivals
    const [myRole, setMyRole] = useState(null); // State to store the user's role
    const [openEditDialog, setOpenEditDialog] = useState(false); // State to control the visibility of the edit festival dialog
    const [openChangeFestivalMenu, setOpenChangeFestivalMenu] = useState(false); // State to control the visibility of the change festival menu

    // Fetch the user's favorite festival
    useEffect(() => {
        fetchFavoriteFestival();
    }, [user, token]);

    // Update festivals state when festivals change
    useEffect(() => {
        setFestivals(festivals);
    }, [festivals]);

    // Fetch the user's festivals
    const fetchMyFestivals = async () => {
        setLoading(true);
        try {
            const festivals = await getMyFestivals(user.id);
            setFestivals(festivals);
        } catch (error) {
            console.error('Error fetching festivals:', error);
            if (error.message === 'Network Error') {
                setSnackbarColor('error');
                setSnackbarMessage('Impossible de joindre le serveur');
                setOpenSnackbar(true);
                setTimeout(() => {
                    setSnackbarColor('success');
                }, 3500);
            }
        }
    };

    // Fetch all festivals
    const fetchAllFestivals = async () => {
        setLoading(true);
        try {
            const festivals = await getFestivals();
            setAllFestivals(festivals);
        } catch (error) {
            console.error('Error fetching festivals:', error);
        }
    };

    // Fetch the user's favorite festival
    const fetchFavoriteFestival = async () => {
        try {
            if (user) {
                const festival = await getFavoriteFestival(user.id, token);
                setFavoriteFestival(festival);
            }
        } catch (error) {
            console.error('Error fetching favorite festival:', error);
        }
    };

    // Fetch the user's festivals and all festivals if the user is an admin
    useEffect(() => {
        fetchMyFestivals();
        if (user) {
            if (user.iswobzadmin) {
                fetchAllFestivals();
            }
        }
    }, [user, token]);

    // Fetch the user's role in the favorite festival
    const fetchMyRole = async () => {
        try {
            if (!favoriteFestival) {
                return;
            }
            const role = await getUserRole(user.id, favoriteFestival.id);
            setMyRole(role.role);
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };
    useEffect(() => {
        fetchMyRole();
    }, [favoriteFestival, user]);

    // Fetch traps for the favorite festival
    const fetchFestivalTraps = async () => {
        try {
            if (favoriteFestival) {
                const traps = await getFestivalTraps(favoriteFestival.id, token);
                setTraps(traps);
            }
        } catch (error) {
            console.error('Error fetching festival traps:', error);
        }
        setTimeout(() => {
            setLoading(false);
        }, 200);
    };

    useEffect(() => {
        fetchFestivalTraps();
    }, [favoriteFestival, token]);

    // Group traps by bin
    const bins = traps.reduce((acc, trap) => {
        if (!acc[trap.bin]) {
            acc[trap.bin] = [];
        }
        acc[trap.bin].push(trap.id);
        return acc;
    }, {});

    // Handle festival change
    const handleFestivalChange = (festivalId) => {
        if (festivalId) {
            changeFavoriteFestival(user.id, festivalId, token).then(() => {
                setFavoriteFestival(festivals.find(festival => festival.id === festivalId));
                setSnackbarMessage('Festival favori modifié');
                setOpenSnackbar(true);
                fetchMyFestivals();
                fetchFavoriteFestival();
            });
        }
    };

    // Handle festival update
    const handleFestivalUpdated = () => {
        fetchFavoriteFestival();
        fetchMyFestivals();
        setSnackbarMessage('Festival modifié');
        setOpenSnackbar(true);
    };

    // Handle create button click
    const handleCreateButton = () => {
        setOpenCreateDialog(true);
    };

    // Handle festival creation
    const handleFestivalCreated = (newFestivalId) => {
        fetchMyFestivals().then(() => {
            changeFavoriteFestival(user.id, newFestivalId, token).then(() => {
                setFavoriteFestival(festivals.find(festival => festival.id === newFestivalId));
                setSnackbarMessage('Festival créé et défini comme favori');
                setOpenSnackbar(true);
                fetchFavoriteFestival();
            });
        });
    }

    // Handle traps update
    const handleTrapsUpdate = () => {
        fetchFestivalTraps();
        setSnackbarMessage("Graals modifiées");
        setOpenSnackbar(true);
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-0 sm:p-10 sm:pt-28">

            <div id="pageHeader" className="w-full flex items-center justify-between bg-wobzBlue p-4 ">
                <FestivalIcon className="text-white"/>
                <h1 className="text-3xl text-white font-inter ">Festival</h1>
                <ChangeFestivalMenu festival={favoriteFestival ? favoriteFestival : null}
                                    festivals={user.iswobzadmin ? allFestivals : festivals}
                                    onChangeFestival={handleFestivalChange}/>

                <GlobalMenu
                    festival={favoriteFestival ? favoriteFestival : null}
                    festivals={user.iswobzadmin ? allFestivals : festivals}
                    onChangeFestival={handleFestivalChange}
                />
            </div>

            {loading ? (
                <div className="pt-12">
                    <CircularProgress/>
                </div>
            ) : (
                <>
                    {(!favoriteFestival && !loading) ? (
                        <div
                            className="bg-gray-200 p-6 rounded-lg flex flex-col justify-center items-center w-full px-4">
                            <h1 className="text-lg sm:text-2xl">Vous n'avez pas de festival favori</h1>
                            <h2 className="text-md sm:text-lg pt-8">Veuillez en sélectionner un dans le menu.</h2>
                        </div>
                    ) : (
                        <div
                            className="w-full flex flex-col sm:flex-row sm:space-x-10 space-y-10 sm:space-y-0 pt-4 px-4">
                            <div id="DivFestival" className="w-full sm:w-2/3 flex flex-col">
                                <div className="bg-white py-6 px-2 rounded-lg space-y-2 flex items-center">
                                    <div className="flex-1 space-y-2">
                                        <p id="festival-name"
                                           className="text-3xl sm:text-4xl text-left font-inter">{favoriteFestival.name.toUpperCase()}</p>
                                        <h3 id="date" className="text-md sm:text-xl text-left text-wobzBlue">
                                            <CalendarMonthIcon className="inline-block mr-2 text-black"/>
                                            {new Intl.DateTimeFormat('fr-FR', {
                                                day: '2-digit',
                                                month: 'long'
                                            }).format(new Date(favoriteFestival.start_date))}
                                            {new Date().getFullYear() !== new Date(favoriteFestival.start_date).getFullYear() ? ` ${new Date(favoriteFestival.start_date).getFullYear()}` : ''}
                                            <span> - </span>
                                            {new Intl.DateTimeFormat('fr-FR', {
                                                day: '2-digit',
                                                month: 'long'
                                            }).format(new Date(favoriteFestival.end_date))}
                                            {new Date().getFullYear() !== new Date(favoriteFestival.end_date).getFullYear() ? ` ${new Date(favoriteFestival.end_date).getFullYear()}` : ''}
                                        </h3>
                                        <h3 id="location" className="text-md sm:text-xl text-left text-wobzBlue">
                                            <PlaceIcon className="inline-block mr-2 text-black"/>
                                            {favoriteFestival.location}
                                        </h3>
                                        {traps.length > 0 && loading === false ? (
                                            null
                                        ) : (
                                            <h2 className="pt-10 text-md sm:text-lg text-left">Aucun graal pour ce
                                                festival</h2>
                                        )}
                                    </div>
                                    {myRole === 'admin' &&
                                        <div className="ml-4">
                                            <EditIcon className="text-black"
                                                      onClick={() => {
                                                          setOpenEditDialog(true);
                                                      }}
                                            />
                                        </div>
                                    }

                                </div>
                            </div>

                            <div className="flex flex-col items-center space-y-10 w-full sm:w-1/3">
                                <div className="w-full rounded-lg">
                                    <FestivalUsers festivalId={favoriteFestival ? favoriteFestival.id : null}
                                                   onUsersChanged={() => fetchFestivalTraps()}/>
                                </div>
                                <div className="w-full">
                                    <FestivalTraps festivalId={favoriteFestival ? favoriteFestival.id : null}
                                                   traps={traps} onUpdate={handleTrapsUpdate}/>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <CreateFestivalDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}
                                  onFestivalCreated={(festivalId) => handleFestivalCreated(festivalId)}/>
            {favoriteFestival &&
                <EditFestivalDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}
                                    festival={favoriteFestival} onFestivalEdited={() => handleFestivalUpdated()}/>
            }

            <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage}
                           color={snackbarColor}/>
        </div>
    );
};

export default Festival;