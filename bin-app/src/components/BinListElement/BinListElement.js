import React from 'react';
import CircularProgressWithLabel from '../CircularProgressWithLabel/CircularProgressWithLabel';

const BinListElement = ({ title, description, props, id, onClick }) => {
  return (
    <div className="lg:w-3/4 p-4 border-b border-gray-200 bg-gray-200 rounded-full hover:bg-gray-300 mx-auto cursor-pointer" onClick={onClick}>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default BinListElement;