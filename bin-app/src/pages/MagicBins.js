// src/pages/MagicBins.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BinListElement from '../components/BinListElement/BinListElement';

const MagicBins = () => {
  const navigate = useNavigate();
  const items = [
    { title: 'Bin 1', description: 'Description for item 1', props:40 , id:1},
    { title: 'Bin 2', description: 'Description for item 2', props:20 , id:2},
    { title: 'Bin 3', description: 'Description for item 3', props:60 , id:3},
    { title: 'Bin 4', description: 'Description for item 4', props:80 , id:4},
    { title: 'Bin 5', description: 'Description for item 5', props:90 , id:5}
  ];

  const handleBinClick = (id) => {
    navigate(`/magic-bins/${id}`);
  };

  return (
    <div className="w-full max-h-screen overflow-y-auto p-4 space-y-4 pb-20">
      {items.map((item, index) => (
        <BinListElement key={index} title={item.title} description={item.description} props={item.props} id={item.id} onClick={() => handleBinClick(item.id)}/>
      ))}
    </div>
  );
};

export default MagicBins;