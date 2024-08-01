import React, { useEffect, useState } from 'react';
import TrapListElement from '../TrapListElement/TrapListElement';
import { getBinTraps } from '../../api';
import Slide from '@mui/material/Slide';
import { CircularProgress } from '@mui/material';

const Traps = ({ binId, update }) => {
    const [traps, setTraps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBinTraps = async (binId) => {
        try {
            const traps = await getBinTraps(binId);
            setTraps(traps);
        } catch (error) {
            console.error('Error fetching traps:', error);
        }
        setTimeout(() => {
        setLoading(false);
        }, 200);
    };
    useEffect(() => {
        fetchBinTraps(binId);
    }
        , [binId]);

    useEffect(() => {
        fetchBinTraps(binId);
    }, [update]);


    const updateTrap = () => {
        fetchBinTraps(binId);
    }


    return (
<>
  {loading ? (
    <div className="flex justify-center items-center p-4 pb-8 ">
      <CircularProgress />
    </div>
  ) : (
    <>
      <p className="text-2xl sm:text-4xl text-start pl-4">
        {traps.length > 0 ? 'Graals : ' : 'Aucun graal'}
      </p>
      <div className="w-11/12 grid grid-cols-1 lg:grid-cols-2 gap-2 pb-4">
        {traps.map((trap, index) => (
          <Slide
            direction="right"
            in={true}
            mountOnEnter
            unmountOnExit
            timeout={100 + index * 100}
            key={index} 
          >
            <div className="p-1.5">
              <TrapListElement trap={trap} onUpdateTrap={updateTrap} />
            </div>
          </Slide>
        ))}
      </div>
    </>
  )}
</>
    );
};

export default Traps;
