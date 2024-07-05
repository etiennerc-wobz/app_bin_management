import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival, getFestivalTraps, getFestivals, changeFavoriteFestival } from '../api';
import { Button } from '@mui/material';
import CreateFestivalDialog from '../components/CreateFestivalDialog/CreateFestivalDialog';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import FestivalMenu from '../components/FestivalMenu/FestivalMenu';
import AssignBinDialog from '../components/AssignBinDialog/AssignBinDialog';

const Festival = () => {
  const { user, token } = useContext(AuthContext);
  const [favoriteFestival, setFavoriteFestival] = useState(null);
  const [traps, setTraps] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Fetch the user's favorite festival
  useEffect(() => {
    fetchFavoriteFestival();
  }, [user, token]);

  // Fetch the list of all festivals
  const fetchFestivals = async () => {
    try {
      const festivals = await getFestivals(token);
      setFestivals(festivals);
      console.log('Festivals:', festivals);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    }
  };

  const fetchFavoriteFestival = async () => {
    try {
      if (user) {
        const festival = await getFavoriteFestival(user.id, token);
        console.log('Festival favori:', festival);
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
        console.log('Traps du festival:', favoriteFestival.name, traps);
      }
    } catch (error) {
      console.error('Error fetching festival traps:', error);
    }
  };

  // Fetch traps for the selected festival
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
      console.log('Modification de festival favori pour user', user.id, 'festival id : ', festivalId);
      changeFavoriteFestival(user.id, festivalId, token).then(() => {
        setFavoriteFestival(festivals.find(festival => festival.id === festivalId));
        setOpenSnackbar(true);
        fetchFestivals();
        fetchFavoriteFestival();
      });
    }
  };

  // Open the dialog to create a new festival
  const handleCreateButton = () => {
    console.log('Création d\'un nouveau festival');
    setOpenCreateDialog(true);
  };

  // Refresh the festival list when a new festival is created
  const handleFestivalCreated = (festival) => {
    console.log('Festival créé :', festival);
    fetchFestivals();
  };

  return (
    <div className='fixed top-10 sm:top-32 space-y-10'>
      <FestivalMenu 
        festivalId={favoriteFestival ? favoriteFestival.id : null} 
        festivals={festivals}
        onChangeFestival={handleFestivalChange}
      />    

      <div className='bg-gray-200 p-10 rounded-lg'>
        {!favoriteFestival ? (
          <>
            <h1>Vous n'avez pas de festival favori</h1>
            <Button variant="contained" color="success" onClick={handleCreateButton} sx={{ marginTop:4, borderRadius: 10 }}>
              Créer un festival
            </Button>
          </>
        ) : (
          <>
            <h1>Votre festival favori est :</h1>
            <p className='text-2xl sm:text-4xl pl-4'>{favoriteFestival.name}</p>
            <h3>
              Dates : {new Date(favoriteFestival.debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: '2-digit' })} - {new Date(favoriteFestival.fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: '2-digit' })}
            </h3>
            {traps.length > 0 ? (
            <h2 className='pt-10'>Les cassettes de ce festival sont :</h2>
            ): 
            <h2 className='pt-10'>Aucune cassette pour ce festival</h2>
            }
            {Object.entries(bins).map(([bin, ids]) => (
              <div key={bin}>
                <h3><strong>Bin {bin} :</strong></h3>
                <p>{ids.join(' - ')}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <CreateFestivalDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onFestivalCreated={handleFestivalCreated} />
      <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message='Festival favori modifié' color='success' />
    </div>
  );
};

export default Festival;
