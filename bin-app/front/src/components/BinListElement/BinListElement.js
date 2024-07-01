import React from 'react';
import CircularProgressWithLabel from '../CircularProgressWithLabel/CircularProgressWithLabel';
import StatusIndicator from '../StatusIndicator/StatusIndicator';

const BinListElement = ({ title, zone, traps, id, fillrate, status, onClick, deleteMode }) => {

  const baseStyle = "md:w-3/4 p-4 border-b border-gray-200 bg-gray-200 rounded-full mx-auto cursor-pointer flex items-center justify-between";
  const hoverStyle = deleteMode ? "hover:bg-red-500" : "hover:bg-gray-300";
  const activeStyle = deleteMode ? "bg-red-200" : "";

  const myStatus = status === "connected" ? true : false;

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${activeStyle}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="ml-2 mr-2">
          <CircularProgressWithLabel value={fillrate} size="1" />
        </div>

        <div className="ml-4 sm:ml-10 flex flex-col items-start">
            <h2 className="text-xl pb-1 font-bold sm:text-4xl sm:mr-24">{title}</h2>
            <StatusIndicator isConnected={myStatus} />
        </div>

      </div>
      <div className="text-right text-xs sm:text-base mr-2 sm:mr-10">
        <p className="text-gray-600">Zone : <span className="font-bold">{zone}</span></p>
        <p className="text-gray-600">Bouches : <span className="font-bold">{traps.length}</span></p>      </div>
    </div>
  );
};

export default BinListElement;