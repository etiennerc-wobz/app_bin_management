// src/pages/MagicBins.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBins } from '../api';
import BinListElement from '../components/BinListElement/BinListElement';
import SelectInput from '../components/SelectInput/SelectInput';

const MagicBins = () => {

  const [bins, setBins] = useState([]);
  const [tri, setTri] = React.useState('');


  useEffect(() => {
    const fetchBins = async () => {
      try {
        let bins = await getBins();
        
        if (tri === 10) {
          bins.sort((a, b) => b.fillrate - a.fillrate);
        } else if (tri === 20) {
          bins.sort((a, b) => a.zone.localeCompare(b.zone));
        } else if (tri === 30) {
          bins.sort((a, b) => a.traps.length - b.traps.length);
        }
  
        setBins(bins);
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    };
  
    fetchBins();
  }, [tri]);

  const navigate = useNavigate();

  const handleBinClick = (id) => {
    navigate(`/magic-bins/${id}`);
  };

  const handleTriChange=(newTri)=>{
    setTri(newTri);
  }


  return (
    <div className="w-full max-h-screen overflow-y-auto p-4 space-y-4 md:pt-24 pb-20 md:pb-6">
      <SelectInput onTriChange={handleTriChange}/>
    {bins.map((bin, index) => (
        <BinListElement key={index} title={bin.name} zone={bin.zone} traps={bin.traps} id={bin.id} fillrate={bin.fillrate} onClick={() => handleBinClick(bin.id)}/>
      ))}
    </div>
  );
};

export default MagicBins;