// FavoriteFestival.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import axios from 'axios';

const API_URL = 'http://10.58.131.69:4040'; 

const FavoriteFestival = () => {
  const { user } = useContext(AuthContext);
  const [favoriteFestival, setFavoriteFestival] = useState(null);

  useEffect(() => {
    const fetchFavoriteFestival = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${user.id}/favorite-festival`);
        setFavoriteFestival(response.data);
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
