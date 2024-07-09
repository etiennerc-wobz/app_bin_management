// src/pages/MagicBins.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getBins } from '../api';
import BinListElement from '../components/BinListElement/BinListElement';
import SelectInput from '../components/SelectInput/SelectInput';
import ButtonBinList from '../components/ButtonBinList/ButtonBinList';
import { unAssignBinFromFestival } from '../api';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';

import { getMyFestivalBins } from '../api';

import { AuthContext } from '../components/AuthContext/AuthContext';

import { getFavoriteFestival } from '../api';

import AssignBinDialog from '../components/AssignBinDialog/AssignBinDialog';

import Slide from '@mui/material/Slide';


const MagicBins = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sort = queryParams.get('sort');
  const [tri, setTri] = useState(sort || '');

  const [bins, setBins] = useState([]);

  const [unassignMode, setUnassignMode] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openAssignBinDialog, setOpenAssignBinDialog] = useState(false);
  const [search, setSearch] = useState(''); // Nouvel état pour la recherche

  const { user } = useContext(AuthContext);
  const [FavoriteFestival, setFavoriteFestival] = useState('');


  const fetchBins = async () => {
    try {
      let bins = await getMyFestivalBins(user.id);

      if (!tri) {
        bins.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        const triNumber = Number(tri);

        if (triNumber === 10) {
          bins.sort((a, b) => b.fillrate - a.fillrate);
        } else if (triNumber === 20) {
          bins.sort((a, b) => a.zone.localeCompare(b.zone));
        } else if (triNumber === 30) {
          bins.sort((a, b) => a.traps.length - b.traps.length);
        }
      }

      setBins(bins);
    } catch (error) {
      console.error('Error fetching bins:', error);
    }
  };

  useEffect(() => {
    fetchBins();

    const fetchFavoriteFestival = async () => {
      try {
        const festival = await getFavoriteFestival(user.id);

        setFavoriteFestival(festival);
      } catch (error) {
        console.error('Error fetching favorite festival:', error);
      }
    }
    fetchFavoriteFestival();
  }, [tri]);




  const handleBinClick = (id) => {
    if (!unassignMode) {
      navigate(`/magic-bins/${id}`);
    }
    else {
      const binName = bins.find(bin => bin.id === id).name;
      if (window.confirm('Voulez-vous supprimer la Bin : ' + binName + ' ?')) {

        //deleteBin(id);

        unAssignBinFromFestival(id).then(() => {
          setBins(bins.filter(bin => bin.id !== id));
          setSnackbarMessage('Bin supprimée avec succès');
          setOpenSnackbar(true);
        }
        );

      }
    };
    setUnassignMode(false);
  }

  const handleAddBinClick = () => {
    setOpenAssignBinDialog(true);
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleBinAssignment = () => {

    fetchBins();
  }

  const handleBinAdded = () => {
    const fetchBins = async () => {
      try {
        let bins = await getMyFestivalBins(user.id);
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

  if (!FavoriteFestival) {
    return (
      <div className="w-full max-h-screen overflow-y-auto p-4 space-y-4 sm:pt-24 pb-20 sm:pb-6 self-start">
        <h1 className="text-xl sm:text-3xl w-52 pl-4 sm:w-fit bg-gray-100
        rounded-full shadow-md sm:text-center sm:mx-auto sm:my-4 sm:p-4
        ">Aucun festival favori</h1>
        <div className=" flex flex-row items-center sm:pl-56">
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={handleSearchChange}
            className="w-36 sm:w-48 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-blue outline"
          />
          <SelectInput onTriChange={handleTriChange} />
        </div>
        <h1>Veuillez sélectionner un festival dans l'onglet <Link to="/" className="text-green-800 font-bold underline">Festival</Link></h1>
      </div>
    );
  }


  return (
    <>
      <div className="w-full max-h-screen overflow-y-auto p-4 space-y-4 sm:pt-24 pb-20 sm:pb-6 self-start">

        <div className=" flex flex-row items-center sm:pl-56">
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={handleSearchChange}
            className="w-36 sm:w-48 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-md focus:outline-blue outline"
          />
          <SelectInput onTriChange={handleTriChange} />
        </div>
        {bins.length === 0 && <h1>Aucune Bin pour ce festival</h1>}
        {bins
          .filter(bin => bin.name.toLowerCase().includes(search.toLowerCase()))
          .map((bin, index) => (
            <Slide
              key={index}
              in={true}
              direction='right'
              timeout={100 + index * 100}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <BinListElement key={index} title={bin.name} zone={bin.zone} traps={bin.traps} id={bin.id} fillrate={bin.fillrate} status={bin.status} onClick={() => handleBinClick(bin.id)} unassignMode={unassignMode} />
              </div>
            </Slide>
          ))}
      </div>
      <ButtonBinList setUnassignMode={setUnassignMode} onAddBinClick={handleAddBinClick} />
      <SnackbarAlert open={openSnackbar} onClose={() => setOpenSnackbar(false)} message={snackbarMessage} color="success" />
      <AssignBinDialog festivalId={FavoriteFestival} open={openAssignBinDialog} onClose={() => setOpenAssignBinDialog(false)} onAssignment={handleBinAssignment} />

    </>
  );
};


export default MagicBins;