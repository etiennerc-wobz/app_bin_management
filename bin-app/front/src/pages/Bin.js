import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBins } from '../api';


const Bin = () => {
    const { id } = useParams();

    const [bins, setBins] = useState([]);
    const [thisBin, setThisBin] = useState(null);

    useEffect(() => {

        const fetchBins = async () => {
            try {
                const bins = await getBins();
                setBins(bins);
                console.log('bins:', bins);
                console.log('id:', id);
                const bin = bins.find(bin => String(bin.id) === String(id));
                setThisBin(bin);
            } catch (error) {
                console.error('Error fetching bins:', error);
            }
        };
        fetchBins();
    }, [id]);



    if (!thisBin) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            Bin name: {thisBin.name}
            <br />
            Bin zone: {thisBin.zone}
        </div>
    );
}

export default Bin;