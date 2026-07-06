/**
 * useTenantParams Hook
 * Hook para obtener los parámetros del tenant seleccionado (businessUnit y country)
 */

import { useAppSelector } from '@infrastructure/store/hooks/useStore';

/**
 * Hook para obtener parámetros del tenant seleccionado desde el store global
 * 
 * @description
 * Extrae businessUnit y país del tenant seleccionado en Redux.
 * No aplica valores por defecto: retorna strings vacíos si no hay tenant.
 * 
 * @returns {Object} Parámetros del tenant
 * @returns {string} bu - Nombre de la Business Unit (vacío si no hay tenant)
 * @returns {string} country - Nombre del país (vacío si no hay tenant)
 * @returns {Object} selectedTenant - Objeto completo del tenant seleccionado
 * @returns {boolean} isReady - true si tanto bu como country están disponibles
 * 
 * @example
 * const { bu, country, isReady } = useTenantParams();
 * useEffect(() => {
 *   if (isReady) fetchData(bu, country);
 * }, [bu, country, isReady]);
 */
export const useTenantParams = () => {
    const selectedTenant = useAppSelector((s: any) => s.tenant?.selectedTenant);
    const bu: string = selectedTenant?.commerce?.name?.trim() || '';
    const country: string = selectedTenant?.country?.name?.trim() || '';
    const isReady = !!(bu && country);
    return { bu, country, selectedTenant, isReady };
};
