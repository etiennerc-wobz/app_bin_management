import React, { useEffect, useState } from 'react';
import TrapListElement from '../TrapListElement/TrapListElement';
import { getBinTraps } from '../../api';

const Traps = ({ binId }) => {
    const [traps, setTraps] = useState([]);

    const fetchBinTraps = async (binId) => {
        try {
            const traps = await getBinTraps(binId);
            setTraps(traps);
        } catch (error) {
            console.error('Error fetching traps:', error);
        }
    };
    useEffect(() => {
        fetchBinTraps(binId);
    }
    , [binId]);
    

    const updateTrap =() => {
        fetchBinTraps(binId);
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-16">
            {traps.map((trap, index) => (
                <div key={index} className="p-1.5">
                    <TrapListElement trap={trap} onUpdateTrap={updateTrap} />
                </div>
            ))}
        </div>
    );
};

export default Traps;
