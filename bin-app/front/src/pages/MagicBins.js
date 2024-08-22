import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {
    getBins,
    getMyFestivalBins,
    unAssignBinFromFestival,
    getFavoriteFestival,
    stopUsingFestivalBin,
    getUserRole
} from '../api';
import BinListElement from '../components/BinListElement/BinListElement';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import AssignBinDialog from '../components/AssignBinDialog/AssignBinDialog';
import Slide from '@mui/material/Slide';
import {CircularProgress, Button} from '@mui/material';
import {AuthContext} from '../components/AuthContext/AuthContext';
import ConfirmationDialog from '../components/ConfirmationDialog/ConfirmationDialog';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import GlobalMenu from '../components/GlobalMenu/GlobalMenu';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const MagicBins = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sort = queryParams.get('sort');
    const [tri, setTri] = useState(sort || '');

    const [bins, setBins] = useState([]);
    const [unassignMode, setUnassignMode] = useState(false);
    const [selectedBins, setSelectedBins] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openAssignBinDialog, setOpenAssignBinDialog] = useState(false);
    const [search, setSearch] = useState('');
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [confirmationDialogMessage, setConfirmationDialogMessage] = useState('');
    const [binToUnassign, setBinToUnassign] = useState(null);

    const {user} = useContext(AuthContext);
    const [FavoriteFestival, setFavoriteFestival] = useState('');
    const [loading, setLoading] = useState(true);
    const [myRole, setMyRole] = useState('');

    // Fetch bins periodically
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchBins();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [tri]);

    // Fetch bins and sort them based on the selected criteria
    const fetchBins = async () => {
        try {
            let bins = await getMyFestivalBins(user.id);
            let triNumber = 10;
            if (tri) {
                triNumber = Number(tri);
            }
            if (triNumber === 10) {
                bins.sort((a, b) => b.fillrate - a.fillrate);
            } else if (triNumber === 20) {
                bins.sort((a, b) => a.zone.localeCompare(b.zone));
            } else if (triNumber === 30) {
                bins.sort((a, b) => a.traps.length - b.traps.length);
            }

            setBins(bins);
            if (FavoriteFestival) {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching bins:', error);
        }
    };

    // Fetch the user's favorite festival and role
    useEffect(() => {
        fetchBins();
        const fetchFavoriteFestival = async () => {
            try {
                const festival = await getFavoriteFestival(user.id);
                setFavoriteFestival(festival);
                fetchMyRole();
            } catch (error) {
                console.error('Error fetching favorite festival:', error);
            }
            if (bins) {
                setLoading(false);
            }
        };
        fetchFavoriteFestival();
    }, []);

    // Fetch the user's role in the favorite festival
    const fetchMyRole = async () => {
        try {
            if (!FavoriteFestival) {
                return;
            }
            const role = await getUserRole(user.id, FavoriteFestival.id);
            setMyRole(role);
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    useEffect(() => {
        fetchMyRole();
    }, [FavoriteFestival]);

    // Handle bin click event
    const handleBinClick = (id) => {
        if (!unassignMode) {
            navigate(`/magic-bins/${id}`);
        }
    };

    // Handle checkbox change event for bin selection
    const handleCheckboxChange = (id) => {
        setSelectedBins((prevSelectedBins) =>
            prevSelectedBins.includes(id)
                ? prevSelectedBins.filter((binId) => binId !== id)
                : [...prevSelectedBins, id]
        );
    };

    // Stop unassign mode
    const handleUnassignModeStop = () => {
        setSelectedBins([]);
        setUnassignMode(false);
    };

    // Unassign selected bins
    const handleUnassignSelectedBins = async () => {
        try {
            await Promise.all(selectedBins.map((id) => stopUsingFestivalBin(id)));
            setBins(bins.filter((bin) => !selectedBins.includes(bin.id)));
            setSnackbarMessage('Bins désactivées avec succès');
            setOpenSnackbar(true);
            setSelectedBins([]);
            setUnassignMode(false);
        } catch (error) {
            console.error('Error unassigning bins:', error);
        }
    };

    // Handle dialog close event
    const handleDialogClose = async (answer) => {
        setConfirmationDialogOpen(false);

        if (answer && binToUnassign) {
            try {
                await stopUsingFestivalBin(binToUnassign.id);
                setBins(bins.filter((bin) => bin.id !== binToUnassign.id));
                setSnackbarMessage('Bin supprimée avec succès');
                setOpenSnackbar(true);
            } catch (error) {
                console.error('Error unassigning bin:', error);
            }
        }
        setBinToUnassign(null);
        setUnassignMode(false);
    };

    // Handle minus button click event
    const handleMinusClick = () => {
        if (unassignMode) {
            handleUnassignModeStop();
        } else {
            setUnassignMode(true);
        }
    }

    // Handle add bin button click event
    const handleAddBinClick = () => {
        setOpenAssignBinDialog(true);
    };

    // Handle search input change event
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    // Handle bin assignment event
    const handleBinAssignment = () => {
        fetchBins();
        setOpenSnackbar(true);
        setSnackbarMessage('Bins activées avec succès');
    };

    // Handle sorting change event
    const handleTriChange = (newTri) => {
        setTri(newTri);
        navigate(`/magic-bins?sort=${newTri}`);
        setSnackbarMessage('Tri effectué avec succès');
        setOpenSnackbar(true);
    };

    return (
        <>
            {loading ? (
                <>
                    <div id="pageHeader"
                         className="w-full flex items-center justify-between bg-wobzBlue p-4 fixed top-0 left-0 right-0 z-10">
                        <DeleteSweepIcon className="text-white"/>
                        <h1 className="text-3xl text-white font-inter pr-24">MagicBins</h1>
                        <GlobalMenu/>
                    </div>
                    <div className="pt-40">
                        <CircularProgress/>
                    </div>
                </>
            ) : (
                <>
                    {!FavoriteFestival ? (
                        <div
                            className="w-full flex flex-col items-center max-h-screen overflow-y-auto p-4 space-y-4 sm:pt-24 pb-20 sm:pb-6 self-start">
                            <div id="pageHeader"
                                 className="w-full flex items-center justify-between bg-wobzBlue p-4 fixed top-0 left-0 right-0 z-10">
                                <DeleteSweepIcon className="text-white"/>
                                <h1 className="text-3xl text-white font-inter pr-24">MagicBins</h1>
                                <GlobalMenu/>
                            </div>
                            <h1 className="text-xl sm:text-3xl w-52 sm:w-fit text-center my-12 sm:mx-auto sm:my-12 p-2 sm:p-4 font-bold pt-20">
                                Aucun festival favori
                            </h1>
                            <h1>
                                Veuillez sélectionner un festival dans l'onglet{' '}
                                <Link to="/" className="text-wobzBlue font-bold underline">
                                    Festival
                                </Link>
                            </h1>
                        </div>
                    ) : (
                        <>
                            <div id="pageHeader"
                                 className="w-full flex items-center justify-between bg-wobzBlue p-4 fixed top-0 left-0 right-0 z-10">
                                <DeleteSweepIcon className="text-white"/>
                                <h1 className="text-3xl text-white font-inter pr-24">MagicBins</h1>
                                <GlobalMenu/>
                            </div>

                            <div
                                className="w-full max-h-screen overflow-y-auto px-2 space-y-4 sm:pt-24 pb-44 pt-24 sm:pb-6 self-start">
                                {(bins.length === 0 && !loading) && (
                                    <h1 className="pt-20 sm:text-4xl">
                                        Aucune Bin assignée à <strong>{FavoriteFestival.name}</strong>
                                    </h1>
                                )}
                                {bins
                                    .filter((bin) => bin.name.toLowerCase().includes(search.toLowerCase()))
                                    .filter(bin => bin.used === true)
                                    .map((bin, index) => (
                                        <Slide key={index} in={true} direction="right" timeout={100 + index * 100}
                                               mountOnEnter unmountOnExit>
                                            <div>
                                                <BinListElement
                                                    key={index}
                                                    title={bin.name}
                                                    zone={bin.zone}
                                                    traps={bin.traps}
                                                    id={bin.id}
                                                    fillrate={bin.fillrate}
                                                    status={bin.status}
                                                    onClick={() => handleBinClick(bin.id)}
                                                    unassignMode={unassignMode}
                                                    selected={selectedBins.includes(bin.id)}
                                                    onCheckboxChange={handleCheckboxChange}
                                                />
                                            </div>
                                        </Slide>
                                    ))}

                                {myRole.role === 'admin' || user.iswobzadmin ? (
                                    <div className='flex flex-row justify-center items-center space-x-8 pt-4 h-[3rem]'>
                                        <AddCircleOutline className='text-wobzBlue' sx={{fontSize: 60}}
                                                          onClick={handleAddBinClick}
                                        />
                                        <RemoveCircleOutlineIcon className='text-[#bd7a74] ' sx={{fontSize: 60}}
                                                                 onClick={handleMinusClick}
                                        />
                                    </div>
                                ) : null}
                            </div>

                            {unassignMode && (
                                <div
                                    className="fixed flex flex-row space-x-2 bottom-32 left-1/2 transform -translate-x-1/2 z-10">
                                    <Button variant="contained" sx={{backgroundColor: '#74BDB6', borderRadius: '2rem'}}
                                            onClick={handleUnassignSelectedBins}>
                                        Valider
                                    </Button>
                                    <Button variant="contained" sx={{backgroundColor: '#2b7068', borderRadius: '2rem'}}
                                            onClick={handleUnassignModeStop}>
                                        Annuler
                                    </Button>
                                </div>
                            )}

                            <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)}
                                           message={snackbarMessage} color="success"/>
                            <AssignBinDialog
                                festivalId={FavoriteFestival}
                                open={openAssignBinDialog}
                                onClose={() => setOpenAssignBinDialog(false)}
                                onAssignment={handleBinAssignment}
                            />
                            <ConfirmationDialog
                                open={confirmationDialogOpen}
                                onClose={handleDialogClose}
                                message={confirmationDialogMessage}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default MagicBins;