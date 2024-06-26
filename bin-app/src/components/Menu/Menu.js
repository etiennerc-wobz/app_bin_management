import React from 'react';

const Menu = () => {
    return (
        <div className="flex outline">
        <nav className="flex flex-col justify-between w-1/2">
            <a href="#" className="text-gray-800 hover:text-gray-600">Visualiser les bins</a>
            <a href="#" className="text-gray-800 hover:text-gray-600">Ajouter une bin</a>
            <a href="#" className="text-gray-800 hover:text-gray-600">Contact</a>
        </nav>
        </div>
    );
};

export default Menu;