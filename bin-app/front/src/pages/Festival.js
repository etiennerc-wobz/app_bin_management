import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival, getFestivalTraps, getFestivals, changeFavoriteFestival } from '../api';
import { Button, CircularProgress } from '@mui/material';
import CreateFestivalDialog from '../components/CreateFestivalDialog/CreateFestivalDialog';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import FestivalMenu from '../components/FestivalMenu/FestivalMenu';
import FestivalTraps from '../components/FestivalTraps/FestivalTraps';

const Festival = () => {
  const { user, token } = useContext(AuthContext);
  const [favoriteFestival, setFavoriteFestival] = useState(null);
  const [traps, setTraps] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchFavoriteFestival();
  }, [user, token]);

  const fetchFestivals = async () => {
    setLoading(true); 
    try {
      const festivals = await getFestivals(token);
      setFestivals(festivals);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    }
  };

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

  useEffect(() => {
    fetchFestivals();
  }, [token]);

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

  const bins = traps.reduce((acc, trap) => {
    if (!acc[trap.bin]) {
      acc[trap.bin] = [];
    }
    acc[trap.bin].push(trap.id);
    return acc;
  }, {});

  const handleFestivalChange = (festivalId) => {
    if (festivalId) {
      changeFavoriteFestival(user.id, festivalId, token).then(() => {
        setFavoriteFestival(festivals.find(festival => festival.id === festivalId));
        setSnackbarMessage('Festival favori modifié');
        setOpenSnackbar(true);
        fetchFestivals();
        fetchFavoriteFestival();
      });
    }
  };

  const handleCreateButton = () => {
    setOpenCreateDialog(true);
  };

  const handleFestivalCreated = (festival) => {
    fetchFestivals();
  };

  const handleTrapsUpdate = () => {
    fetchFestivalTraps();
    setSnackbarMessage("Traps modifiées");
    setOpenSnackbar(true);
  }

  return (
    <div className='min-h-screen flex flex-col items-center p-4 sm:p-10 sm:pt-28 space-y-10'>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <FestivalMenu
            festivalId={favoriteFestival ? favoriteFestival.id : null}
            festivals={festivals}
            onChangeFestival={handleFestivalChange}
          />
          <div className='flex flex-col sm:flex-row sm:space-x-10 space-y-10 sm:space-y-0 sm:h-52'>
            <div className='bg-gray-200 p-6 rounded-lg flex flex-col justify-center w-full sm:w-2/3'>
              {!favoriteFestival ? (
                <>
                  <h1 className='text-lg sm:text-2xl'>Vous n'avez pas de festival favori</h1>
                  <Button variant="contained" color="success" onClick={handleCreateButton} sx={{ marginTop: 4, borderRadius: 10 }}>
                    Créer un festival
                  </Button>
                </>
              ) : (
                <>
                  <h1 className='text-lg sm:text-2xl'>Votre festival favori est :</h1>
                  <p className='text-2xl sm:text-4xl pl-4'>{favoriteFestival.name}</p>
                  <h3 className='text-md sm:text-xl pt-2'>
                    Dates : {new Date(favoriteFestival.debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: '2-digit' })} - {new Date(favoriteFestival.fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: '2-digit' })}
                  </h3>
                  {traps.length > 0 ? (
                    null
                  ) : (
                    <h2 className='pt-10 text-md sm:text-lg'>Aucune trap pour ce festival</h2>
                  )}
                </>
              )}
            </div>
            <div className='w-full sm:w-2/3'>
              <FestivalTraps festivalId={favoriteFestival ? favoriteFestival.id : null} traps={traps} onUpdate={handleTrapsUpdate} />
            </div>
          </div>
        </>
      )}
      <CreateFestivalDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onFestivalCreated={handleFestivalCreated} />
      <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} color='success' />
    </div>
  );
};

export default Festival;
