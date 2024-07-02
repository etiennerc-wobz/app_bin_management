// Festival.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';

const FavoriteFestival = () => {
  const { user } = useContext(AuthContext);
  const [favoriteFestival, setFavoriteFestival] = useState(null);

  useEffect(() => {
    const fetchFavoriteFestival = async () => {
      try {
        const festival = await getFavoriteFestival(user.id); 
        setFavoriteFestival(festival);
      } catch (error) {
        console.error('Error fetching favorite festival:', error);
      }
    };

    if (user) {
      fetchFavoriteFestival();
    }
  }, [user]);

  if (!favoriteFestival) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Votre festival favori est :</h1>
      <p className='text-2xl sm:text-4xl text-start pl-4'
      >{favoriteFestival.name}</p>
    </div>
  );
};

export default FavoriteFestival;