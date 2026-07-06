import React from 'react';
import { createRoot } from 'react-dom/client';
import { bootstrap as mfeBootstrap, mount as mfeMount } from './App';

// Bootstrap the single-spa lifecycle
mfeBootstrap().then(() => {
    const appElement = document.getElementById('app');
    if (appElement) {
        // Mount the MFE in standalone mode for local development
        mfeMount({
            domElement: appElement,
            singleSpa: null,
            mountParcel: null,
            name: '{{APP_NAME}}',
        });
    } else {
        console.error('[MF {{APP_NAME}} Bootstrap] ❌ No se encontró elemento #app');
    }
});
