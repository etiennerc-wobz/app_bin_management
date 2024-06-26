import React from 'react';

const BinListElement = ({ title, description }) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-200 rounded-full hover:bg-gray-300">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default BinListElement;