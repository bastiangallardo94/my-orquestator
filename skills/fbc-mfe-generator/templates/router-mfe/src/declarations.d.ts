// Declaraciones de módulos externos
declare module 'authentication/App';
declare module 'importMaintainerForwarders/App';
declare module 'importMaintainerBondedWarehouses/App';
declare module 'importMaintainerDocuments/App';
declare module 'importMaintainerHsCodes/App';

// Declaración básica para papaparse
declare module 'papaparse' {
    const Papa: any;
    export = Papa;
}

// Declaraciones globales
declare global {
    interface Window {
        [key: string]: any;
    }
}


