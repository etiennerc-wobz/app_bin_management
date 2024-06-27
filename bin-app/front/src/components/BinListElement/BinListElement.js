import React from 'react';
import CircularProgressWithLabel from '../CircularProgressWithLabel/CircularProgressWithLabel';


const BinListElement = ({ title, zone, traps, id, fillrate, onClick }) => {
  return (
    <div className="lg:w-3/4 p-4 border-b border-gray-200 bg-gray-200 rounded-full hover:bg-gray-300 mx-auto cursor-pointer" onClick={onClick}>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600">Zone : {zone}</p>
      <p className="text-gray-600">Nombre de bouches : {traps.length}</p>
      <div className="text-gray-600 align-middle flex items-center justify-center">
        Remplissage : 
        <CircularProgressWithLabel value={fillrate} />
      </div>
    </div>
  );
};

export default BinListElement;