// UserProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [favoriteFestival, setFavoriteFestival] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoriteFestival = async () => {
            try {
                const festival = await getFavoriteFestival(user.id);
                setFavoriteFestival(festival);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching favorite festival:', error);
                setLoading(false);

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
            <p className='text-2xl sm:text-4xl mb-8'>{loading ? 'Loading...' : user ? user.name : 'Not logged in'}</p>
            <h2>Votre festival est :</h2>
            <p className='text-2xl sm:text-4xl'>{loading ? 'Loading...' : favoriteFestival ? favoriteFestival.name : 'Aucun favori'}</p>
        </div>
    );
};

export default UserProfile;