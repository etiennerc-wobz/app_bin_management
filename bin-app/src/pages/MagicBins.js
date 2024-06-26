// src/pages/MagicBins.js
import React from 'react';
import BinListElement from '../components/BinListElement/BinListElement';

const MagicBins = () => {
  const items = [
    { title: 'Bin 1', description: 'Description for item 1' },
    { title: 'Bin 2', description: 'Description for item 2' },
    { title: 'Bin 3', description: 'Description for item 3' },
    // Ajoutez plus d'éléments ici
  ];

  return (
    <div className="max-h-screen overflow-y-auto p-4 space-y-4">
      {items.map((item, index) => (
        <BinListElement key={index} title={item.title} description={item.description} />
      ))}
    </div>
  );
};

export default MagicBins;