// Festival.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';
import { getFestivalTraps } from '../api';

const FavoriteFestival = () => {
  const { user , token } = useContext(AuthContext);
  const [favoriteFestival, setFavoriteFestival] = useState(null);
  const [traps, setTraps] = useState([]);

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

  return (
    <div>

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