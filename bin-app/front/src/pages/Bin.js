import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getBins, getBinTraps, getFavoriteFestival, getFreeFestivalTraps } from '../api';
import CircularProgressWithLabel from '../components/CircularProgressWithLabel/CircularProgressWithLabel';
import { Button, useMediaQuery } from '@mui/material';
import StatusIndicator from '../components/StatusIndicator/StatusIndicator';
import Traps from '../components/Traps/Traps';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import { getFreeTraps } from '../api';
import AssignTrapsToBinDialog from '../components/AssignTrapsToBinDialog/AssignTrapsToBinDialog';
import { AuthContext } from '../components/AuthContext/AuthContext';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import EditBinDialog from '../components/EditBinDialog/EditBinDialog';
import Slide from '@mui/material/Slide';

const Bin = () => {
    const { id } = useParams();

    const [bins, setBins] = useState([]);
    const [thisBin, setThisBin] = useState(null);
    const [error, setError] = useState(null);
    const isSmallScreen = useMediaQuery('(max-width:640px)');
    const [thisStatus, setThisStatus] = useState(false);
    const [binTraps, setBinTraps] = useState([]);
    const [thisFestivalTraps, SetThisFestivalTraps] = useState([]);
    const [addTrapDialogOpen, setAddTrapDialogOpen] = useState(false);
    const [updateTraps, setUpdateTraps] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [openEditBinDialog, setOpenEditBinDialog] = useState(false);

    const { user } = useContext(AuthContext);

    const fetchThisFestival = async () => {
        
        try {
            const festivalReturned = await getFavoriteFestival(user.id);
            
            SetThisFestivalTraps(festivalReturned);
            fetchFestivalTraps(festivalReturned.id)
        } catch (error) {
            console.error('Error fetching favorite festival:', error);
        }
    }


    const fetchFestivalTraps = async (festivalId) => {
        try {
            const traps = await getFreeFestivalTraps(festivalId);
            
            SetThisFestivalTraps(traps);
        } catch (error) {
            console.error('Error fetching traps:', error);
        }
    }

    const fetchBins = async () => {
        try {
            fetchThisFestival();
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
        fetchThisFestival();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!thisBin || !binTraps) {
        return <div>Loading...</div>;
    }

    const handleAddTrapButtonClicked = () => {
        
        setAddTrapDialogOpen(true);
    }

    const handleTrapsUpdate = () => {
        setOpenSnackbar(true);
        setSnackbarMessage('Traps ajoutées avec succès');
        setUpdateTraps(true);
    }

    const handleBinEdited = () => {
        setOpenSnackbar(true);
        setSnackbarMessage('Bin modifiée avec succès');        
        fetchBins();
    }

    return (
        <div id="pageBin" className="absolute flex flex-col items-start sm:items-center  h-full w-11/12 sm:pt-20 sm:px-10 ">
            <div id="header" className="fixed sm:relative top-0 left-0 flex flex-row justify-between items-center w-full bg-gray-200 sm:bg-white p-4 sm:p-0 z-10">
                <div className="flex flex-col items-start  sm:mr-10 w-48 sm:w-11/12 ">
                    <div className="mb-4">
                        <StatusIndicator isConnected={thisStatus} />
                    </div>
                    <div className="text-start">
                        <span className="font-bold text-xl sm:text-5xl">{thisBin.name}</span>
                    </div>
                    <div className="text-2xl sm:text-4xl text-start mt-4">
                        Zone : <span className="font-bold text-2xl sm:text-4xl">{thisBin.zone}</span>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0">
                    <CircularProgressWithLabel value={thisBin.fillrate} size={isSmallScreen ? "2" : "3"} />
                </div>
            </div>
            <div id="body" className="relative sm:static bottom-[-8rem] 
            flex flex-col items-center left-4 pb-20 sm:pt-0 sm:mt-0 w-11/12 ">
                
                <Traps binId={thisBin.id} update={updateTraps} />
                <div className='bg-gray-200 sm:bg-white p-4 sm:p-0 flex flex-col items-center w-3/4 
            text:sm border-8 sm:border-2 border-gray-300 rounded-full cursor-pointer sm:hover:bg-gray-400'
                    onClick={() => handleAddTrapButtonClicked()}>

                    <p>Ajouter une trap</p>
                    {thisFestivalTraps.length > 0 && <p className="text-sm">({thisFestivalTraps.length} trap disponibles)</p>}
                </div>


            </div>

            <AssignTrapsToBinDialog traps={thisFestivalTraps} binId={thisBin.id} festivalId={user.festivalId} open={addTrapDialogOpen} onClose={() => setAddTrapDialogOpen(false)} onUpdate={handleTrapsUpdate} />

            <EditBinDialog bin={thisBin} open={openEditBinDialog} onClose={() => setOpenEditBinDialog(false)} onBinEdited={handleBinEdited} />

            <div className="fixed bottom-20 right-4 sm:bottom-10 sm:right-20 sm:p-4 sm:p-0" onClick={() => setOpenEditBinDialog(true)}>
                <Fab color="success" aria-label="edit">
                    <EditIcon />
                </Fab>
            </div>
            <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} color="success" />
        </div>
    );
}

export default Bin;