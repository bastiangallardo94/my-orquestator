/**
 * Configuración de Variables de Entorno (TypeScript wrapper)
 * 
 * Este archivo provee tipos para la configuración de environment
 * La lógica real está en environment.config.js para compatibilidad con CommonJS
 */

import EnvironmentJS from './environment.config.js';

/**
 * Interface para el objeto Environment exportado
 */
export interface IEnvironment {
  // App Configuration
  appName: string;
  appPort: number;
  appUrl: string;
  appPath: string;
  bffUrl: string;
  loginUrl: string;
  
  // Remote Apps
  authenticationApp: string;
  
  // Development Settings
  appDev: boolean;
  configurationStoreName: string;
  isProduction: boolean;
  isDevelopment: boolean;
  authConfigClient: string;
  storeDebug: boolean;
  
  // UI Settings
  sidebarEnabled: boolean;
  compactMenuLabel: string;
  
  // Utility
  defaults: Record<string, string>;
}

/**
 * Objeto Environment con tipado
 */
const Environment: IEnvironment = EnvironmentJS as IEnvironment;

/**
 * Objeto ENV con nombres de constantes en UPPER_CASE (para compatibilidad)
 */
export const ENV: Readonly<{
  APP_NAME: string;
  APP_PORT: number;
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
}> = Object.freeze({
  APP_NAME: Environment.appName,
  APP_PORT: Environment.appPort,
  APP_URL: Environment.appUrl,
  APP_PATH: Environment.appPath,
  API_BASE_URL: Environment.bffUrl,
  AUTHENTICATION_APP: Environment.authenticationApp,
  SIDEBAR_ENABLED: Environment.sidebarEnabled,
  COMPACT_MENU_LABEL: Environment.compactMenuLabel,
  isDevelopment: Environment.isDevelopment,
  isProduction: Environment.isProduction,
  APP_DEV: Environment.appDev,
  STORE_DEBUG: Environment.storeDebug,
});

// Export por defecto
export default Environment;
