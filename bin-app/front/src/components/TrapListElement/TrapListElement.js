import React, { useEffect, useRef } from 'react';
import CircularProgressWithLabel from '../CircularProgressWithLabel/CircularProgressWithLabel';
import StatusIndicator from '../StatusIndicator/StatusIndicator';



const TrapListElement = ({ id,status }) => {

    const myStatus=status==="connected"?true:false;

  return (
    <div className="md:w-3/4 p-4 border-b border-gray-200 bg-gray-200 rounded-full mx-auto cursor-pointer flex items-center justify-between">
        <div className="flex items-center">
            <div className="ml-2 mr-2">
                <p className="text-xl pb-1 font-bold sm:text-4xl sm:mr-2">
                    {id}
                </p>
            </div>
            <div className="ml-4 sm:ml-10 flex flex-col items-start w-40 sm:w-80">
                <StatusIndicator isConnected={myStatus} />
            </div>
        </div>
    </div>

  );
};

export default TrapListElement;
