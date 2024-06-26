import React from 'react';
import { useParams } from 'react-router-dom';

const Bin = () => {
    const {id} = useParams();

    return (
        <div>
            Bin Page {id}
        </div>
    );
}

export default Bin;