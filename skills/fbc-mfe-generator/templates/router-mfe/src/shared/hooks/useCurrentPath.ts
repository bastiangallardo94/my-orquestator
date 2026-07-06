import { useEffect, useState } from 'react';

/**
 * Hook para rastrear la ruta actual de la aplicación en un entorno de microfrontends
 * 
 * @description
 * - Escucha eventos de navegación de single-spa y del navegador
 * - Se actualiza automáticamente cuando cambia la ruta
 * - Compatible con SSR (verifica window !== undefined)
 * 
 * @returns {Object} Objeto con la ruta actual y función para actualizarla manualmente
 * @returns {string} currentPath - Ruta actual (ej: '/mf-template/home')
 * @returns {Function} setCurrentPath - Función para actualizar la ruta manualmente
 * 
 * @example
 * const { currentPath } = useCurrentPath();
 * // currentPath se actualiza automáticamente al navegar
 */
export function useCurrentPath() {
    const [currentPath, setCurrentPath] = useState<string>(typeof window !== 'undefined' ? window.location.pathname : '/');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleUrlChange = () => setCurrentPath(window.location.pathname);
        window.addEventListener('single-spa:routing-event', handleUrlChange);
        window.addEventListener('popstate', handleUrlChange);
        return () => {
            window.removeEventListener('single-spa:routing-event', handleUrlChange);
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    return { currentPath, setCurrentPath } as const;
}
