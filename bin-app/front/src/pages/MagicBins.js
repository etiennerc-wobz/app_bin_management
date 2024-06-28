// src/pages/MagicBins.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getBins } from '../api';
import BinListElement from '../components/BinListElement/BinListElement';
import SelectInput from '../components/SelectInput/SelectInput';
import ButtonBinList from '../components/ButtonBinList/ButtonBinList';

const MagicBins = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sort = queryParams.get('sort');
  const [tri, setTri] = useState(sort || '');

  const [bins, setBins] = useState([]);

  const [deleteMode, setDeleteMode] = useState(false);



  useEffect(() => {
    const fetchBins = async () => {
      try {
        let bins = await getBins();
        const triNumber = Number(tri);

        if (triNumber === 10) {
          bins.sort((a, b) => b.fillrate - a.fillrate);
        } else if (triNumber === 20) {
          bins.sort((a, b) => a.zone.localeCompare(b.zone));
        } else if (triNumber === 30) {
          bins.sort((a, b) => a.traps.length - b.traps.length);
        }

        setBins(bins);
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    };

    fetchBins();
  }, [tri]);


  const handleBinClick = (id) => {
    if(!deleteMode){
      navigate(`/magic-bins/${id}`);
    }
    else{
        // Implement your logic to confirm the deletion of the bin with the given id
        // For example, you can show a confirmation dialog and proceed with the deletion if the user confirms
        if (window.confirm('Voulez-vous supprimer la Bin ' + id + ' ?')) {
          // Call the deleteBin function with the id
          //deleteBin(id);
          console.log('delete bin:', id);
        }
      };
      setDeleteMode(false);
    }
  

  const handleTriChange = (newTri) => {
    setTri(newTri);
    navigate(`/magic-bins?sort=${newTri}`);
  };

  console.log('magicbins// bins: ', bins);

  return (
    <>
      <div className="w-full max-h-screen overflow-y-auto p-4 space-y-4 md:pt-24 pb-20 md:pb-6">
        <SelectInput onTriChange={handleTriChange}/>
        {bins.map((bin, index) => (
          <BinListElement key={index} title={bin.name} zone={bin.zone} traps={bin.traps} id={bin.id} fillrate={bin.fillrate} onClick={() => handleBinClick(bin.id)} deleteMode={deleteMode} />
        ))}
      </div>
      <ButtonBinList setDeleteMode={setDeleteMode} />
    </>
  );
};

export default MagicBins;