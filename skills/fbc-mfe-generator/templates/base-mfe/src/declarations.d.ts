// Declaraciones de módulos externos
declare module 'authentication/App';

// TODO: Add your remote MFE declarations here
// Example:
// declare module 'otherMfe/App';


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


