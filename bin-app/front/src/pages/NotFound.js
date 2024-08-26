// NotFound.js
import React from 'react';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => {
    return (
        <div className="pt-40 text-center">
            <div className="fixed top-16 left-8 z-10">
                <ArrowBackIcon
                    style={{fontSize: 40, cursor: 'pointer', color: '#74BDB6'}}
                    onClick={() => window.history.back()}
                />
            </div>

            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl mb-8">Oops! La page que vous cherchez n'existe pas.</p>
            <Link to="/" className="text-blue-500 text-xl underline">
                Retour à l'accueil
            </Link>
        </div>
    );
};

export default NotFound;
