/**
 * Configuración de rutas de la aplicación
 * Define las rutas base del microfrontend
 * Usa ENV para acceso centralizado a variables de entorno
 */
import { ENV } from '../../constants/environment.config';

// Re-exportar APP_PATH para compatibilidad
export const APP_PATH = ENV.APP_PATH;

export const ROUTES = {
    // Rutas internas absolutas (con APP_PATH) — usar en Link/navigateToUrl
    HOME: `${ENV.APP_PATH}/home`,
    SCHEDULING: `${ENV.APP_PATH}/scheduling`,
    SCHEDULE_INSPECTION: `${ENV.APP_PATH}/scheduling/schedule-inspection`,
    SCHEDULED_INSPECTION: `${ENV.APP_PATH}/scheduling/inspection`,
    INSPECTOR: `${ENV.APP_PATH}/inspector`,
    INSPECTOR_REVIEW: `${ENV.APP_PATH}/inspector/review`,
    MY_SCHEDULE_REQUEST: `${ENV.APP_PATH}/scheduling/my-schedule-requests`,
    INSPECTION_MANAGEMENT: `${ENV.APP_PATH}/inspection-management`,
    PURCHASE_ORDER_INSPECTION: `${ENV.APP_PATH}/purchase-order-inspection`,

    // Rutas externas al MFE — salen del BrowserRouter
    FOREIGN_TRADE: "/foreign-trade",
    FBC_HOME: "/",

    // Rutas relativas al basename — usar solo en navigate() de React Router
    INSPECTION_MANAGEMENT_SUMMARY: `inspection-management/summary`,
    INSPECTION_MANAGEMENT_INTERNAL: `inspection-management`,
    INSPECTION_MANAGEMENT_MASSIVE: `inspection-management/massive`,
    PURCHASE_ORDER_INSPECTION_SUMMARY: `purchase-order-inspection/summary`,
    PURCHASE_ORDER_INSPECTION_INTERNAL: `purchase-order-inspection`,
    MY_SCHEDULE_REQUEST_INTERNAL: `scheduling/my-schedule-requests`,
} as const;
