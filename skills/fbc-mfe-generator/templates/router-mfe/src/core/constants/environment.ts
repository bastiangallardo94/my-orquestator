/**
 * Variables de entorno
 * Centraliza el acceso a las variables de entorno en un único objeto
 * Mantiene exports nombrados para compatibilidad hacia atrás.
 */
const appName = process.env.APP_NAME ?? 'importMaintainersRouter';
const appPort = process.env.APP_PORT ?? '8502';
const appUrl = process.env.APP_URL ?? `http://localhost:${appPort}/`;
const apiBaseUrl = process.env.BFF_URL ?? 'https://dev.fbusinesscenter.com/foreign-trade/bff'
const appPath = process.env.APP_PATH ?? '/foreign-trade/{{APP_NAME}}';
const authenticationApp = process.env.AUTHENTICATION_APP ?? 'authentication@http://localhost:3001/remoteEntry.js';
// const sidebarEnabled = process.env.SIDEBAR_ENABLED !== 'false'; // Default true, false only if explicitly set to 'false'
const sidebarEnabled = false;
const compactMenuLabel = process.env.COMPACT_MENU_LABEL ?? 'Pre-shipment Maintainers Router';
const dev = process.env.NODE_ENV === 'development';
const prod = process.env.NODE_ENV === 'production';

export interface IEnv {
    APP_NAME: string;
    APP_PORT: string;
    APP_URL: string;
    APP_PATH: string;
    API_BASE_URL: string;
    AUTHENTICATION_APP: string;
    SIDEBAR_ENABLED: boolean;
    COMPACT_MENU_LABEL: string;
    isDevelopment: boolean;
    isProduction: boolean;
    APP_DEV: boolean;
    STORE_DEBUG: boolean;
}

export const ENV: Readonly<IEnv> = Object.freeze({
    APP_NAME: appName,
    APP_PORT: appPort,
    APP_URL: appUrl,
    APP_PATH: appPath,
    API_BASE_URL: apiBaseUrl,
    AUTHENTICATION_APP: authenticationApp,
    SIDEBAR_ENABLED: sidebarEnabled,
    COMPACT_MENU_LABEL: compactMenuLabel,
    isDevelopment: dev,
    isProduction: prod,
    APP_DEV: dev,
    STORE_DEBUG: dev,
});

export type Env = Readonly<IEnv>;
