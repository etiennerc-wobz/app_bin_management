import React from 'react';
import CircularProgressWithLabel from '../CircularProgressWithLabel/CircularProgressWithLabel';

const BinListElement = ({ title, zone, traps, id, fillrate, onClick, deleteMode }) => {

  const baseStyle = "lg:w-3/4 p-4 border-b border-gray-200 bg-gray-200 rounded-full mx-auto cursor-pointer flex items-center justify-between";
  const hoverStyle = deleteMode ? "hover:bg-red-500" : "hover:bg-gray-300";
  const activeStyle = deleteMode ? "bg-red-200" : "";

  return (
    <div 
      className={`${baseStyle} ${hoverStyle} ${activeStyle}`} 
      onClick={onClick}
    >
      <div className="flex items-center">
      <div className="ml-2 mr-2">
          <CircularProgressWithLabel value={fillrate} />
        </div>

        <h2 className="text-lg font-bold md:text-4xl ml-2 md:ml-10 md:mr-24">{title}</h2>

      </div>
      <div className="text-right text-xs md:text-base mr-2 md:mr-10">
        <p className="text-gray-600">Zone : {zone}</p>
        <p className="text-gray-600">Bouches : {traps.length}</p>
      </div>
    </div>
  );
};

export default BinListElement;