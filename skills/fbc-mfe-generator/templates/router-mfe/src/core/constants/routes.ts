/**
 * Application routes constants
 */
import { ENV } from './environment';

/**
 * Determina el basename correcto:
 * - Si está corriendo standalone (desarrollo en localhost:8500 sin shell), usa '/'
 * - Si está dentro del shell single-spa, usa el APP_PATH configurado
 * 
 * Detectamos si está en single-spa verificando si window.singleSpaNavigate existe
 */
const isSingleSpaContext = typeof window !== 'undefined' && !!(window as any).singleSpaNavigate;
export const APP_PATH = isSingleSpaContext ? ENV.APP_PATH : '/';

export const ROUTES = {
    HOME: `/home`,
} as const;

