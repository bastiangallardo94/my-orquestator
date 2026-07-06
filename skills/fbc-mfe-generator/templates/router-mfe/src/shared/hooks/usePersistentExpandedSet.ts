import { useCallback, useEffect, useRef, useState } from 'react';

/* global localStorage */

/**
 * Hook para gestionar un conjunto de items expandidos con persistencia en localStorage
 * 
 * @description
 * Mantiene un Set de IDs de items expandidos y lo sincroniza con localStorage.
 * Útil para recordar qué secciones de un menú o acordeón están abiertas.
 * 
 * @param {string} key - Clave para almacenar en localStorage
 * @param {string[]} defaultExpanded - IDs que estarán expandidos por defecto
 * 
 * @returns {Object} Controles del conjunto expandido
 * @returns {Set<string>} expanded - Set con los IDs actualmente expandidos
 * @returns {Function} toggle - Función para expandir/colapsar un item por ID
 * @returns {Function} ensureVisible - Función para asegurar que varios items estén expandidos
 * @returns {Function} setExpanded - Función para reemplazar todo el Set
 * @returns {boolean} storageDisabled - Indica si localStorage falló y está deshabilitado
 * 
 * @example
 * const { expanded, toggle, ensureVisible } = usePersistentExpandedSet('menu-state', ['home']);
 * const isExpanded = expanded.has('settings');
 * <button onClick={() => toggle('settings')}>Toggle Settings</button>
 */
export function usePersistentExpandedSet(key: string, defaultExpanded: string[] = []) {
    const storageFailedRef = useRef(false);
    const [expanded, setExpanded] = useState<Set<string>>(() => {
        if (typeof window === 'undefined') return new Set(defaultExpanded);
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return new Set(defaultExpanded);
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return new Set(parsed.filter(v => typeof v === 'string'));
            return new Set(defaultExpanded);
        } catch {
            storageFailedRef.current = true;
            return new Set(defaultExpanded);
        }
    });

    useEffect(() => {
        if (typeof window === 'undefined' || storageFailedRef.current) return;
        try {
            localStorage.setItem(key, JSON.stringify(Array.from(expanded)));
        } catch {
            storageFailedRef.current = true;
        }
    }, [expanded, key]);

    const toggle = useCallback((id: string) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const ensureVisible = useCallback((ids: string[]) => {
        setExpanded(prev => {
            const next = new Set(prev);
            ids.forEach(id => next.add(id));
            return next;
        });
    }, []);

    return { expanded, toggle, ensureVisible, setExpanded, storageDisabled: storageFailedRef.current } as const;
}
