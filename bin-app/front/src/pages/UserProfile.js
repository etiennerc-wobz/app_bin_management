// UserProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthContext/AuthContext';
import { getFavoriteFestival } from '../api';
import { getFestivalOwner } from '../api';
import { CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [favoriteFestival, setFavoriteFestival] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');

    const fetchUserRole = async () => {
        try {
            const owner = await getFestivalOwner(favoriteFestival.id);
            if (owner.owner === user.id) {
                setUserRole('Propriétaire');
            }else{
                setUserRole('Participant');
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    useEffect(() => {
        const fetchFavoriteFestival = async () => {
            try {
                const festival = await getFavoriteFestival(user.id);
                setFavoriteFestival(festival);
                setLoading(false);

            } catch (error) {
                console.error('Error fetching favorite festival:', error);

            }
        };

        if (user) {
            fetchFavoriteFestival();
        }
        
        
    }
        , [user]);

    useEffect(() => {
        if (favoriteFestival) {
            fetchUserRole();
        }
    }
        , [favoriteFestival]);
if(loading){
    return <div className='pt-40'>
        <CircularProgress />
    </div>
}

    return (
        <div className='pt-40'>
          <div className="fixed top-16 left-8 z-10">
            <ArrowBackIcon 
              style={{ fontSize: 40, cursor: 'pointer', color: '#74BDB6' }}
              onClick={() => window.history.back()}
            />
          </div>
    
          <h1>Vous êtes :</h1>
          <p className='text-2xl sm:text-4xl mb-1'>{loading ? 'Loading...' : user ? user.name : 'Not logged in'}</p>
          {user.iswobzadmin && <p className='text-m font-bold sm:text-4xl mb-8'>(Administrateur Wobz)</p>}
          <h2>Votre festival est :</h2>
          <p className='text-2xl sm:text-4xl mb-2'>{loading ? 'Loading...' : favoriteFestival ? favoriteFestival.name : 'Aucun favori'}</p>
          <h3>Rôle :</h3>
          <p className='text-2xl sm:text-4xl'>{loading ? 'Loading...' : favoriteFestival ? userRole : 'Aucun favori'}</p>
        </div>
      );
};

export default UserProfile;