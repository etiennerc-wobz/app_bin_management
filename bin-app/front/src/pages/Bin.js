import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getBins, getBinTraps, getFavoriteFestival, getFreeFestivalTraps } from '../api';
import CircularProgressWithLabel from '../components/CircularProgressWithLabel/CircularProgressWithLabel';
import { CircularProgress, Menu, useMediaQuery } from '@mui/material';
import StatusIndicator from '../components/StatusIndicator/StatusIndicator';
import Traps from '../components/Traps/Traps';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import AssignTrapsToBinDialog from '../components/AssignTrapsToBinDialog/AssignTrapsToBinDialog';
import { AuthContext } from '../components/AuthContext/AuthContext';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import EditBinDialog from '../components/EditBinDialog/EditBinDialog';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import BinDrawer from '../components/BinDrawer/BinDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MapBinLocate from '../components/MapBinLocate/MapBinLocate';

import { editBinLocation } from '../api';

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
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [action, setAction] = useState('');
  const { user } = useContext(AuthContext);

  const isMobile = useMediaQuery('(max-width:640px)');

  const containerRef = useRef(null);

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
    return (
      <div className='pt-20'>
        <CircularProgress />
      </div>);
  }

  const handleAddTrapButtonClicked = () => {
    setAddTrapDialogOpen(true);
  }

  const handleTrapsUpdate = () => {
    setOpenSnackbar(true);
    setSnackbarMessage('Traps ajoutées avec succès');
    fetchThisFestival();
    setUpdateTraps(true);
  }

  const handleBinEdited = () => {
    setOpenSnackbar(true);
    setSnackbarMessage('Bin modifiée avec succès');
    fetchBins();
  }

  const handleAction = (action) => {
    if (action === 'gps') {
      console.log('La bin', thisBin.id, 'veut changer sa pos');
      setOpenMap(true);
    }
    if (action === 'edit') {
      setOpenEditBinDialog(true);
    }
  }

  const handleBinMoved = (location) => {
    console.log('La bin', thisBin.id, 'a été déplacée à', location);
    
    editBinLocation(location[1], location[0],thisBin.id)
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
  }

  return (
    <div id="pageBin" className="flex flex-col items-start sm:items-center w-full h-full sm:pt-20">
      <div id="header" className="w-full bg-gray-200 sm:bg-white p-4 sm:p-0 flex flex-row justify-between items-center sm:w-11/12">
        <div className="flex flex-col items-start sm:mr-10 w-[16em] sm:w-11/12" ref={containerRef}>
          <Button onClick={() => setOpenDrawer(true)} sx={{
            marginBottom: { xs: 2, sm: 4 }, color: 'green', backgroundColor: 'lightgreen'
            , border: '1px solid green', borderRadius: '14px'
          }}
          >
            <MenuIcon />
          </Button>
          {!isMobile && (
            <div className="mb-4">
              <StatusIndicator isConnected={thisStatus} />
            </div>
          )}

          <div className="text-start" style={{ fontSize: '32px' }}>
            <span className=" sm:text-5xl">{thisBin.name}</span>
          </div>
          <div className="text-2xl sm:text-4xl text-start mt-4" style={{ fontSize: '20px' }}>
            <ShareLocationIcon className="mr-1 mb-1" style={{ fontSize: 32 }} />
            <span className="sm:text-4xl"><i>{thisBin.zone}</i></span>
          </div>
        </div>
        <div className='flex flex-col items-center sm:items-start sm:mr-10 sm:w-1/4'>
          {isMobile && (
            <div className="mb-4">
              <StatusIndicator isConnected={thisStatus} />
            </div>
          )}
          <div className="mt-4 sm:mt-0">
            <CircularProgressWithLabel value={thisBin.fillrate} size={isSmallScreen ? "2" : "3"} />
          </div>
        </div>
      </div>
      <div id="body" className="flex flex-col items-center w-full p-4 pb-32 sm:p-0 sm:mt-4">
        <Traps binId={thisBin.id} update={updateTraps} />
        <div className='bg-gray-200 sm:bg-white p-4 sm:p-0 flex flex-col items-center w-3/4 text:sm border-4 sm:border-2 border-gray-400 rounded-full cursor-pointer sm:hover:bg-gray-400' onClick={() => handleAddTrapButtonClicked()}>
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

      <BinDrawer open={openDrawer} setOpen={setOpenDrawer} action={action} onAction={handleAction} />
      <MapBinLocate open={openMap} bin={thisBin} onClose={() => setOpenMap(false)} locationPicked={location => handleBinMoved(location)} />
    </div>
  );
}

export default Bin;
