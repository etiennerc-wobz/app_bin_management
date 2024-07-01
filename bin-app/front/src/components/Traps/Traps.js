import * as React from 'react';
import TrapListElement from '../TrapListElement/TrapListElement';

export default function Traps({ traps }) {
    return (
        <div className="flex flex-wrap justify-center">
            {traps.map((trap, index) => (
                <TrapListElement key={index} id={trap.id} status={trap.status} />
            ))}
        </div>
    );
}
