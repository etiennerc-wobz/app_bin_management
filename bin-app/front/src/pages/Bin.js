import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBins } from '../api';
import CircularProgressWithLabel from '../components/CircularProgressWithLabel/CircularProgressWithLabel';
import { useMediaQuery } from '@mui/material';
import StatusIndicator from '../components/StatusIndicator/StatusIndicator';

const Bin = () => {
    const { id } = useParams();

    const [bins, setBins] = useState([]);
    const [thisBin, setThisBin] = useState(null);
    const [error, setError] = useState(null); 
    const isSmallScreen = useMediaQuery('(max-width:640px)');
    const [thisStatus, setThisStatus] = useState(false);

    useEffect(() => {

        const fetchBins = async () => {
            try {
                const bins = await getBins();
                setBins(bins);
                console.log('bins:', bins);
                console.log('id:', id);
                const bin = bins.find(bin => String(bin.id) === String(id));
                if (!bin) {
                    setError('Aucune bin avec cet ID n\'a été trouvée.'); // Définir le message d'erreur si la bin n'est pas trouvée
                } else {
                    setThisBin(bin);
                    setThisStatus(bin.status==="connected" ? true : false);
                    console.log('thisBin:', thisBin);
                    console.log('thisStatus:', thisStatus);
                }
            } catch (error) {
                console.error('Error fetching bins:', error);
            }
        };
        fetchBins();
    }, [id]);

    if (error) {
        return <div>{error}</div>; 
    }

    if (!thisBin) {
        return <div>Loading...</div>;
    }



    return (
        <>
            <div className="absolute top-8 sm:top-28 left-0 sm:left-10 h-40 w-56 sm:w-auto">
                <div className="top-10 sm:top-32 left-20 sm:text-2xl p-0 flex justify-center">
                    <StatusIndicator isConnected={thisStatus} />
                </div>
    
                <div className="top-10 sm:top-32 left-10 text-2xl p-2 sm:pt-6">
                    <span className="font-bold text-4xl sm:text-5xl">{thisBin.name}</span>
                </div>
                <div className="top-24 sm:top-44 left-10 text-2xl sm:text-4xl p-2">
                    Zone : <span className="font-bold text-3xl sm:text-4xl">{thisBin.zone}</span>
                </div>
            </div>
            <div className="absolute top-10 right-4 sm:top-24 sm:right-20 text-xl p-2">
                <CircularProgressWithLabel value={thisBin.fillrate} size={isSmallScreen ? "2" : "3"}/>
            </div>
        </>
    );
}

export default Bin;