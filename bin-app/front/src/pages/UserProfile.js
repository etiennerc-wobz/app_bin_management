// UserProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';

const UserProfile = () => {
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
    }
        , [user]);


    return (
        <div>
            <h1>Vous êtes :</h1>
            <p className='text-2xl sm:text-4xl mb-8'>{user? user.name: 'Loading...'}</p>
            <h2>Votre festival est :</h2>
            <p className='text-2xl sm:text-4xl'>{favoriteFestival ? favoriteFestival.name : 'Loading...'}</p>
        </div>
    );
};

export default UserProfile;