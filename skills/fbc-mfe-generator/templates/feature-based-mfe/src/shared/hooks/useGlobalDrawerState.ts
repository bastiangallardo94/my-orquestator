import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook que sincroniza el estado del drawer lateral con el portal global
 * 
 * @description
 * - Se suscribe al GlobalStoreInstance del portal para recibir actualizaciones del drawer
 * - Persiste el estado en localStorage para evitar flicker en la carga inicial
 * - Ignora actualizaciones undefined para mantener el último estado válido
 * - Limpia automáticamente la suscripción al desmontar
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.namespace - Namespace en el store global (default: 'template')
 * @param {string} options.storageKey - Clave para localStorage (default: 'mf-template-drawer-open')
 * @param {boolean} options.defaultOpen - Estado por defecto si no hay valor guardado (default: false)
 * 
 * @returns {Object} Estado del drawer
 * @returns {boolean} isOpen - Estado actual del drawer (abierto/cerrado)
 * 
 * @example
 * const { isOpen } = useGlobalDrawerState({ namespace: 'myApp', defaultOpen: true });
 * return <div className={isOpen ? 'ml-64' : 'ml-0'}>Content</div>;
 */
export function useGlobalDrawerState(options?: { namespace?: string; storageKey?: string; defaultOpen?: boolean }) {
    const namespace = options?.namespace ?? 'template';
    const storageKey = options?.storageKey ?? 'mf-template-drawer-open';
    const defaultOpen = options?.defaultOpen ?? false;

    const hydratedInitial = (() => {
        if (typeof window === 'undefined') return defaultOpen;
        try {
            const saved = window.localStorage.getItem(storageKey);
            if (saved === 'true') return true;
            if (saved === 'false') return false;
        } catch (error) {
            console.error('[useGlobalDrawerState] Failed to read from localStorage:', error);
        }
        return defaultOpen;
    })();

    const [isOpen, setIsOpen] = useState<boolean>(hydratedInitial);
    const lastValid = useRef(isOpen);

    const apply = useCallback((value: unknown) => {
        if (typeof value === 'boolean') {
            lastValid.current = value;
            setIsOpen(value);
            try {
                window.localStorage.setItem(storageKey, String(value));
            } catch (error) {
                console.error('[useGlobalDrawerState] Failed to save to localStorage:', error);
            }
        }
    }, [storageKey]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const globalStoreInstance = (window as any)?.GlobalStoreInstance;
        if (!globalStoreInstance?.SubscribeToGlobalState) return undefined;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let unsub: any;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unsub = globalStoreInstance.SubscribeToGlobalState(namespace, (slice: any) => {
                const candidate = slice?.configuration?.openDrawer;
                apply(candidate);
            });
        } catch { /* ignore */ }

        return () => {
            if (typeof unsub === 'function') {
                try { unsub(); } catch { /* ignore */ }
            }
        };
    }, [namespace, apply]);

    const setOpen = useCallback((next: boolean) => apply(next), [apply]);
    const toggle = useCallback(() => setOpen(!lastValid.current), [setOpen]);
    const forceClose = useCallback(() => apply(false), [apply]);

    return { isOpen, setOpen, toggle, forceClose } as const;
}
