import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBins,getBinTraps } from '../api';
import CircularProgressWithLabel from '../components/CircularProgressWithLabel/CircularProgressWithLabel';
import { useMediaQuery } from '@mui/material';
import StatusIndicator from '../components/StatusIndicator/StatusIndicator';
import Traps from '../components/Traps/Traps';

const Bin = () => {
    const { id } = useParams();

    const [bins, setBins] = useState([]);
    const [thisBin, setThisBin] = useState(null);
    const [error, setError] = useState(null); 
    const isSmallScreen = useMediaQuery('(max-width:640px)');
    const [thisStatus, setThisStatus] = useState(false);
    const [binTraps, setBinTraps] = useState([]);

    useEffect(() => {

        const fetchBins = async () => {
            try {
                const bins = await getBins();
                setBins(bins);
                console.log('bins:', bins);
                console.log('id:', id);
                const bin = bins.find(bin => String(bin.id) === String(id));
                if (!bin) {
                    setError('Aucune bin avec cet ID n\'a été trouvée.'); 
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
    <div id="pageBin" className="flex flex-col items-start sm:items-center p-0 absolute top-10 sm:top-20 w-11/12 sm:px-20 overflow-hidden">
        <div className="fixed sm:relative top-0 left-0 flex flex-row justify-between items-center w-full bg-gray-200 sm:bg-white p-4 sm:p-0">
            <div className="flex flex-col items-start sm:mr-10 ">
                <div className="mb-4">
                    <StatusIndicator isConnected={thisStatus} />
                </div>

                <div className="text-start">
                    <span className="font-bold text-4xl sm:text-5xl">{thisBin.name}</span>
                </div>
                <div className="text-2xl sm:text-4xl text-start mt-4">
                    Zone : <span className="font-bold text-3xl sm:text-4xl">{thisBin.zone}</span>
                </div>
            </div>
            <div className="mt-4 sm:mt-0">
                <CircularProgressWithLabel value={thisBin.fillrate} size={isSmallScreen ? "2" : "3"} />
            </div>
        </div>
        <div className="pt-32 sm:pt-0 mt-8 sm:mt-0 w-full ">   
            <p className="text-2xl sm:text-4xl text-start">Bouches : </p>
            <Traps binId={thisBin.id} />
        </div>
    </div>
);
}

export default Bin;