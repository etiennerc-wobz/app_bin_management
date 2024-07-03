// Festival.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';
import { getFestivalTraps } from '../api';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button } from '@mui/material';
import { getFestivals } from '../api';
import { changeFavoriteFestival } from '../api';

const FavoriteFestival = () => {
  const { user , token } = useContext(AuthContext);
  const [favoriteFestival, setFavoriteFestival] = useState(null);
  const [traps, setTraps] = useState([]);
  const [festivalInput, setFestivalInput] = useState('');
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFavoriteFestival = async () => {
      try {
        if (user){
          const festival = await getFavoriteFestival(user.id, token);
          setFavoriteFestival(festival);
        }
      } catch (error) {
        console.error('Error fetching favorite festival:', error);
      }
    };
    fetchFavoriteFestival();
  }, [user, token]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const festivals = await getFestivals(token);
        setFestivals(festivals);
        console.log('festivals:', festivals);
      } catch (error) {
        console.error('Error fetching festivals:', error);
      }
    }
    fetchFestivals();
  }
  , [token]);

  useEffect(() => {
    const fetchFestivalTraps = async () => {
      try {
        if (favoriteFestival){
          const traps = await getFestivalTraps(favoriteFestival.id, token);
          setTraps(traps);
          console.log('traps du festival:', favoriteFestival.name, traps);
        }
      } catch (error) {
        console.error('Error fetching festival traps:', error);
      }
    }
    fetchFestivalTraps();
  }, [favoriteFestival, token]);

  if (!favoriteFestival) {
    return <div>Loading...</div>;
  }

  // Créer un objet pour regrouper les trap.id par trap.bin
  const bins = traps.reduce((acc, trap) => {
    if (!acc[trap.bin]) {
      acc[trap.bin] = [];
    }
    acc[trap.bin].push(trap.id);
    return acc;
  }, {});

  const handleFestivalInput = (event) => {
    setFestivalInput(event.target.value);
  };

  const handleButton = () => {
    if(festivalInput){
      console.log('Modification de festival favori pour user', user.id, 'festival id : ', festivalInput);
      changeFavoriteFestival(user.id, festivalInput, token).then(() => {
        setFavoriteFestival(festivals.find(festival => festival.id === festivalInput));
      });
    }
  }

  return (
    <div>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 180 }}>
        <InputLabel id="demo-simple-select-filled-label">{favoriteFestival.name}</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={festivalInput}
          onChange={handleFestivalInput}
        >
          <MenuItem value="">
            <em>{favoriteFestival.name}</em>
          </MenuItem>
          {festivals.map((festival) => (
            festival.id !== favoriteFestival.id && <MenuItem key={festival.id} value={festival.id}>{festival.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={() => {handleButton()}}>
        Valider
      </Button>

      <h1>Votre festival favori est :</h1>
      <p className='text-2xl sm:text-4xl text-start pl-4'
      >{favoriteFestival.name}</p>
      <h3>Dates : {new Date(favoriteFestival.debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: '2-digit' })} - {new Date(favoriteFestival.fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: '2-digit' })}</h3>      <h2>Les cassettes de ce festival sont :</h2>
      {Object.entries(bins).map(([bin, ids]) => (
        <div key={bin}>
          <h3>Bin {bin} :</h3>
          <ul>
            {ids.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  );
};

export default FavoriteFestival;