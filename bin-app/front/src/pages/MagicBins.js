// src/pages/MagicBins.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getBins } from '../api';
import BinListElement from '../components/BinListElement/BinListElement';
import SelectInput from '../components/SelectInput/SelectInput';
import ButtonBinList from '../components/ButtonBinList/ButtonBinList';
import { deleteBin } from '../api';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';
import NewBinDialog from '../components/NewBinDialog/NewBinDialog';

const MagicBins = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sort = queryParams.get('sort');
  const [tri, setTri] = useState(sort || '');

  const [bins, setBins] = useState([]);

  const [deleteMode, setDeleteMode] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openNewBinDialog, setOpenNewBinDialog] = useState(false);
  const [search, setSearch] = useState(''); // Nouvel état pour la recherche




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
        console.log('bins:', bins);

        setBins(bins);
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    };

    fetchBins();
  }, [tri]);


  const handleBinClick = (id) => {
    if (!deleteMode) {
      navigate(`/magic-bins/${id}`);
    }
    else {
      const binName = bins.find(bin => bin.id === id).name;
      if (window.confirm('Voulez-vous supprimer la Bin : ' + binName + ' ?')) {

        //deleteBin(id);
        console.log('delete bin:', id);
        deleteBin(id).then(() => {
          setBins(bins.filter(bin => bin.id !== id));
          setSnackbarMessage('Bin supprimée avec succès');
          setOpenSnackbar(true); 
        }
        );

      }
    };
    setDeleteMode(false);
  }

  const handleAddBinClick = () => {
    setOpenNewBinDialog(true);
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleBinAdded = () => {
    const fetchBins = async () => {
      try {
        let bins = await getBins();
        setBins(bins);
        setSnackbarMessage('Bin ajoutée avec succès');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error fetching bins:', error);
      }
    };

    fetchBins();
  }


  const handleTriChange = (newTri) => {
    setTri(newTri);
    navigate(`/magic-bins?sort=${newTri}`);
    setSnackbarMessage('Tri effectué avec succès');
    setOpenSnackbar(true); 

  };


  
  return (
    <>
      <div className="w-full max-h-screen overflow-y-auto p-4 space-y-4 sm:pt-24 pb-20 sm:pb-6 self-start">
        <div className=" flex flex-row items-center ">
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={handleSearchChange}
            className="w-36 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-blue outline"
          />
          <SelectInput onTriChange={handleTriChange} />
        </div>
        {bins.filter(bin => bin.name.toLowerCase().includes(search.toLowerCase())).map((bin, index) => (
          <BinListElement key={index} title={bin.name} zone={bin.zone} traps={bin.traps} id={bin.id} fillrate={bin.fillrate} status={bin.status} onClick={() => handleBinClick(bin.id)} deleteMode={deleteMode} />
        ))}
      </div>
      <ButtonBinList setDeleteMode={setDeleteMode} onAddBinClick={handleAddBinClick} />
      <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} />
      <NewBinDialog open={openNewBinDialog} onClose={() => setOpenNewBinDialog(false)} onBinAdded={handleBinAdded}/>
    </>
  );
};

export default MagicBins;