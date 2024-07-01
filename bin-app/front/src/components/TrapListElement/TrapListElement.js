import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@mui/material';
import CircularProgressWithLabel from '../CircularProgressWithLabel/CircularProgressWithLabel';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import { openTrap, closeTrap } from '../../api';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const TrapListElement = ({ trap, onUpdateTrap }) => {
    const [thisTrap, setThisTrap] = useState(trap);
    const [currentMode, setCurrentMode] = useState(trap.mode);

    useEffect(() => {
        setThisTrap(trap);
        setCurrentMode(trap.mode);
    }, [trap]);

    const handleTrapClick = async (trapId) => {
        try {
            let newTrap = {};
            if (currentMode === "open") {
                newTrap = await closeTrap(trapId);
            } else {
                newTrap = await openTrap(trapId);
            }
            console.log('newTrap:', newTrap);
            setThisTrap(newTrap);
            onUpdateTrap(newTrap);  // Appel de la fonction de rappel pour mettre à jour l'état du parent
        } catch (error) {
            console.error("Failed to update trap", error);
        }
    };

    const myStatus = thisTrap.status === "connected";
    const myMode = thisTrap.mode === "open" ? "Actif" : "Verrouillé";

    return (
        <div className="p-4 border-b border-gray-200 bg-gray-200 rounded-full mx-auto flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
                <p className="text-xl pb-1 font-bold ml-2 mr-2 sm:text-4xl sm:mr-2">
                    {thisTrap.id}
                </p>

                <div className="flex flex-col items-center pl-4 sm:pl-10 pr-8">
                    <div className="">
                        <p className="text-lg sm:text-2xl ">{myMode}</p>
                    </div>
                    <div className="mt-2">
                        <Tooltip title={currentMode === "open" ? "Fermer la bouche" : "Ouvrir la bouche"} placement="bottom">
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    borderRadius: '50px',
                                    backgroundColor: '#4D3407',
                                    fontSize: '0.6rem',
                                    '&:active': {
                                        backgroundColor: '#78510A',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#78510A',
                                    },
                                }}
                                onClick={() => handleTrapClick(thisTrap.id)}
                            >
                                {currentMode === "open" ? <LockIcon />: <LockOpenIcon />}
                                {currentMode === "open" ? "Fermer" : "Ouvrir"}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="sm:pl-10">
                <StatusIndicator isConnected={myStatus} />
            </div>
        </div>
    );
};

export default TrapListElement;
