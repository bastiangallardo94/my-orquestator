// Declaraciones de módulos externos
declare module 'authentication/App';

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

export { };
