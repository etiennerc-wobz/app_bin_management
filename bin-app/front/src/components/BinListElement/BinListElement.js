import React, { useEffect, useRef, useState } from 'react';
import CircularProgressWithLabel from '../CircularProgressWithLabel/CircularProgressWithLabel';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import { getBinTraps } from '../../api';
import { Box, Icon } from '@mui/material';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Checkbox from '@mui/material/Checkbox';

const useResizeFont = (ref, containerRef, title) => {
  useEffect(() => {
    const adjustFontSize = () => {
      if (ref.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let fontSize = parseInt(window.getComputedStyle(ref.current).fontSize, 10);
        
        ref.current.style.whiteSpace = 'nowrap';
        while (ref.current.scrollWidth > containerWidth && fontSize > 10) {
          fontSize -= 1;
          ref.current.style.fontSize = `${fontSize}px`;
        }
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [ref, containerRef, title]); // Ajoutez 'title' aux dépendances
};

const BinListElement = ({ id, title, zone, traps, fillrate, status, onClick, unassignMode, selected, onCheckboxChange }) => {
  const baseStyle = "md:w-3/4 p-4 bg-secondary rounded-[2rem] mx-auto cursor-pointer flex items-center justify-between";
  const hoverStyle = "md:w-3/4 p-4 bg-secondary rounded-[2rem] mx-auto cursor-pointer flex items-center justify-between";
  const activeStyle = "md:w-3/4 p-4 bg-secondary rounded-[2rem] mx-auto cursor-pointer flex items-center justify-between"

  const myStatus = status === "connected";
  
  const titleRef = useRef(null);
  const containerRef = useRef(null);

  const [binTraps, setBinTraps] = useState();

  useEffect(() => {
    const fetchBinTraps = async () => {
      try {
        let binTraps = await getBinTraps(id);
        setBinTraps(binTraps);
      } catch (error) {
        console.error('Error fetching bin traps:', error);
      }
    };

    fetchBinTraps();
  }
  , [id]);

  useResizeFont(titleRef, containerRef, title); // Passez 'title' à useResizeFont



  return (
      <div className={`${baseStyle} ${hoverStyle} ${activeStyle}`} onClick={onClick}>
              {unassignMode && (
                <Checkbox
                  checked={selected}
                  onChange={() => onCheckboxChange(id)}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  sx={{
                    color: '#19423d',
                    '&.Mui-checked': {
                        color: '#19423d',
                    },
                  }}
                />
              )}

        <div className="flex items-center justify-between">

          <div className="flex items-center">
            <div className="ml-2 mr-2">
              <CircularProgressWithLabel value={fillrate} size="1" />
            </div>

            <div className="ml-4 sm:ml-10 flex flex-col items-start w-48 sm:w-80" ref={containerRef}>
              <h2 className="text-xl pb-1 font-bold sm:text-4xl sm:mr-2" ref={titleRef}>
                {title}
              </h2>
              <h3 className="text-sm sm:text-lg text-gray-600">
                <ShareLocationIcon className="text-gray-600 mr-2" />
                {zone}
              </h3>
            </div>
          </div>

          <KeyboardArrowRightIcon className="text-gray-600 " />
        </div>
      </div>

  );
};

export default BinListElement;
