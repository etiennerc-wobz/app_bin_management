import * as React from 'react';

export default function StatusIndicator({ isConnected }) {
    return (
        <span className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
            <span className={`w-3 h-3 me-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isConnected ? 'Connecté' : 'Non connecté'}
        </span>
    );
}