import React, {useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom';
import {getBins, getFavoriteFestival, getFreeFestivalTraps, editBinLocation, getUserRole} from '../api';
import CircularProgressWithLabel from '../components/CircularProgressWithLabel/CircularProgressWithLabel';
import {CircularProgress, Menu, useMediaQuery, Button} from '@mui/material';
import StatusIndicator from '../components/StatusIndicator/StatusIndicator';
import Traps from '../components/Traps/Traps';
import AssignTrapsToBinDialog from '../components/AssignTrapsToBinDialog/AssignTrapsToBinDialog';
import {AuthContext} from '../components/AuthContext/AuthContext';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import EditBinDialog from '../components/EditBinDialog/EditBinDialog';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import BinDrawer from '../components/BinDrawer/BinDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import MapBinLocate from '../components/MapBinLocate/MapBinLocate';
import UnassignTrapsFromBinDialog from '../components/UnassignTrapsFromBinDialog/UnassignTrapsFromBinDialog';
import GlobalMenu from '../components/GlobalMenu/GlobalMenu';
import KitchenIcon from '@mui/icons-material/Kitchen';

const Bin = () => {
    const {id} = useParams(); // Get the bin ID from the URL parameters

    const [bins, setBins] = useState([]); // State to store all bins
    const [thisBin, setThisBin] = useState(null); // State to store the current bin
    const [error, setError] = useState(null); // State to store any error messages
    const isSmallScreen = useMediaQuery('(max-width:640px)'); // Check if the screen size is small
    const [thisStatus, setThisStatus] = useState(false); // State to store the status of the current bin
    const [binTraps, setBinTraps] = useState([]); // State to store traps associated with the current bin
    const [thisFestivalTraps, setThisFestivalTraps] = useState([]); // State to store traps available for the festival
    const [addTrapDialogOpen, setAddTrapDialogOpen] = useState(false); // State to control the visibility of the add trap dialog
    const [openSnackbar, setOpenSnackbar] = useState(false); // State to control the visibility of the snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State to store the snackbar message
    const [openEditBinDialog, setOpenEditBinDialog] = useState(false); // State to control the visibility of the edit bin dialog
    const [openDrawer, setOpenDrawer] = useState(false); // State to control the visibility of the drawer
    const [openMap, setOpenMap] = useState(false); // State to control the visibility of the map
    const [action, setAction] = useState(''); // State to store the current action
    const {user} = useContext(AuthContext); // Get the user context
    const isMobile = useMediaQuery('(max-width:640px)'); // Check if the device is mobile
    const [unassignTrapDialogOpen, setUnassignTrapDialogOpen] = useState(false); // State to control the visibility of the unassign trap dialog
    const [thisFestival, setThisFestival] = useState(null); // State to store the current festival
    const [myRole, setMyRole] = useState(''); // State to store the user's role

    // Fetch bins periodically
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!openMap) {
                fetchBins();
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [id, openMap]);

    // Fetch the user's favorite festival
    const fetchThisFestival = async () => {
        try {
            const festivalReturned = await getFavoriteFestival(user.id);
            setThisFestival(festivalReturned);
            fetchFestivalTraps(festivalReturned.id);
        } catch (error) {
            console.error('Error fetching favorite festival:', error);
        }
    };

    useEffect(() => {
        fetchThisFestival();
    }, []);

    // Fetch traps available for the festival
    const fetchFestivalTraps = async (festivalId) => {
        try {
            const traps = await getFreeFestivalTraps(festivalId);
            setThisFestivalTraps(traps);
        } catch (error) {
            console.error('Error fetching traps:', error);
        }
    };

    // Fetch all bins and set the current bin
    const fetchBins = async () => {
        try {
            const bins = await getBins();
            setBins(bins);
            const bin = bins.find(bin => String(bin.id) === String(id));
            if (!bin) {
                setError('Aucune bin avec cet ID n\'a été trouvée.');
            } else {
                setThisBin(bin);
                setThisStatus(bin.status === "connected" ? true : false);
            }
        } catch (error) {
            console.error('Error fetching bins:', error);
        }
    };

    useEffect(() => {
        fetchBins();
    }, [id]);

    // Fetch the user's role in the festival
    const fetchMyRole = async () => {
        try {
            if (!thisFestival) {
                return;
            }
            const role = await getUserRole(user.id, thisFestival.id);
            setMyRole(role);
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    useEffect(() => {
        fetchMyRole();
    }, [thisFestival, user]);

    // Show error message if any
    if (error) {
        return <div>{error}</div>;
    }

    // Show loading indicator if data is still being fetched
    if (!thisBin || !binTraps || !myRole) {
        return (
            <>
                <div id="pageHeader"
                     className="w-full flex items-center justify-between bg-wobzBlue p-4 fixed top-0 left-0 right-0 z-20">
                    <KitchenIcon className="text-white"/>
                    <h1 className="text-3xl text-white font-inter pr-44">Bin</h1>
                    <GlobalMenu/>
                </div>
                <div className='pt-40'>
                    <CircularProgress/>
                </div>
            </>
        );
    }

    // Handle add trap button click
    const handleAddTrapButtonClicked = () => {
        fetchThisFestival();
        setAddTrapDialogOpen(true);
    };

    // Handle traps update
    const handleTrapsUpdate = () => {
        setOpenSnackbar(true);
        setSnackbarMessage('Graals ajoutées avec succès');
        fetchThisFestival();
    };

    // Handle traps unassignment
    const handleTrapsUnAssignment = () => {
        fetchThisFestival();
        setOpenSnackbar(true);
        setSnackbarMessage('Graals supprimées avec succès');
        fetchThisFestival();
    };

    // Handle bin edit
    const handleBinEdited = () => {
        setOpenSnackbar(true);
        setSnackbarMessage('Bin modifiée avec succès');
        fetchBins();
    };

    // Handle different actions
    const handleAction = (action) => {
        if (action === 'gps') {
            setOpenMap(true);
        }
        if (action === 'edit') {
            setOpenEditBinDialog(true);
        }
        if (action === 'unassigntraps') {
            setUnassignTrapDialogOpen(true);
        }
    };

    // Handle bin location change
    const handleBinMoved = (location) => {
        editBinLocation(location[1], location[0], thisBin.id)
            .then(() => {
                setOpenSnackbar(true);
                setSnackbarMessage('Bin déplacée avec succès');
                fetchBins();
            })
            .catch((error) => {
                console.error('Error moving bin:', error);
                setOpenSnackbar(true);
                setSnackbarMessage('Erreur lors du déplacement de la bin');
            });
    };

    return (
        <div id="pageBin" className="flex flex-col items-start sm:items-center w-full h-full sm:pt-20">
            <div id="pageHeader"
                 className="w-full flex items-center justify-between bg-wobzBlue p-4 fixed top-0 left-0 right-0 z-20">
                <KitchenIcon className="text-white"/>
                <h1 className="text-3xl text-white font-inter pr-44">Bin</h1>
                <GlobalMenu/>
            </div>

            <div id="DivBin" className="w-full sm:w-2/3 flex flex-row justify-between items-center pt-20 px-4 ">
                <div className="flex flex-col items-start sm:mr-10 w-[16em] sm:w-11/12">
                    {!isMobile && (
                        <div className="mb-4">
                            <StatusIndicator isConnected={thisStatus}/>
                        </div>
                    )}
                    <div className="text-start" style={{fontSize: '32px'}}>
                        <span className=" sm:text-5xl">{thisBin.name}</span>
                    </div>
                    <div className="text-2xl sm:text-4xl text-start mt-4" style={{fontSize: '20px'}}>
                        <ShareLocationIcon className="mr-1 mb-1" style={{fontSize: 32}}/>
                        <span className="sm:text-4xl text-wobzBlue">{thisBin.zone}</span>
                    </div>
                </div>
                <div className='flex flex-col items-center sm:items-start sm:mr-10 sm:w-1/4'>
                    {isMobile && (
                        <div className="mb-2">
                            <StatusIndicator isConnected={thisStatus}/>
                        </div>
                    )}
                    <div className="mt-0 sm:mt-0">
                        <CircularProgressWithLabel value={thisBin.fillrate} size={isSmallScreen ? "2" : "3"}/>
                    </div>
                </div>
            </div>

            <div id="body" className="flex flex-col items-center w-full p-4 pb-32 sm:p-0 sm:pb-8 sm:mt-4">
                <Traps binId={thisBin.id} update={addTrapDialogOpen || unassignTrapDialogOpen}/>
                {(myRole.role === 'admin' || user.iswobzadmin) && (
                    <div
                        className='bg-gray-200 sm:bg-white p-4 sm:p-0 flex flex-col items-center w-3/4 text:sm border-4 sm:border-2 border-gray-400 rounded-full cursor-pointer sm:hover:bg-gray-400'
                        onClick={handleAddTrapButtonClicked}>
                        <p>Ajouter un graal</p>
                        {thisFestivalTraps.length > 0 &&
                            <p className="text-sm">({thisFestivalTraps.length} graals disponibles)</p>}
                    </div>
                )}
            </div>

            <div id="FAB" className="fixed bottom-16 right-4 sm:bottom-10 sm:right-20 sm:p-4 sm:p-0">
                <Button
                    onClick={() => setOpenDrawer(true)}
                    sx={{
                        color: 'white',
                        backgroundColor: '#74BDB6',
                        border: '2px solid #304f4c',
                        borderRadius: '50%',
                        minWidth: 'auto',
                        width: isMobile ? '50px' : '80px',
                        height: isMobile ? '50px' : '80px',
                        '&:hover': {
                            backgroundColor: '#0F4430',
                        },
                    }}
                >
                    <MenuIcon/>
                </Button>
            </div>

            <AssignTrapsToBinDialog traps={thisFestivalTraps} binId={thisBin.id} festivalId={user.festivalId}
                                    open={addTrapDialogOpen} onClose={() => setAddTrapDialogOpen(false)}
                                    onUpdate={handleTrapsUpdate}/>
            <EditBinDialog bin={thisBin} open={openEditBinDialog} onClose={() => setOpenEditBinDialog(false)}
                           onBinEdited={handleBinEdited}/>
            <UnassignTrapsFromBinDialog
                binId={thisBin.id}
                open={unassignTrapDialogOpen}
                onClose={() => setUnassignTrapDialogOpen(false)}
                onUpdate={handleTrapsUnAssignment}
            />

            <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage}
                           color="success"/>

            <BinDrawer open={openDrawer} isAdmin={myRole.role === 'admin' || user.iswobzadmin} setOpen={setOpenDrawer}
                       action={action} onAction={handleAction}/>
            <MapBinLocate open={openMap} bin={thisBin} onClose={() => setOpenMap(false)}
                          locationPicked={location => handleBinMoved(location)}/>
        </div>
    );
}

export default Bin;