/**
 * Configuración de Variables de Entorno (TypeScript wrapper)
 * 
 * Este archivo provee tipos para la configuración de environment.
 * La lógica real está en environment.config.js para compatibilidad con CommonJS.
 * 
 * @module environment.config
 * @see environment.config.js - Implementation logic
 */

import EnvironmentJS from './environment.config.js';

/**
 * Environment Configuration Interface
 * 
 * Defines the shape of the Environment object with proper TypeScript types
 * All properties are typed based on ENV_CONFIG schema
 */
export interface IEnvironment {
  // ==========================================
  // App Configuration
  // ==========================================
  /** Application name used in Module Federation */
  appName: string;
  
  /** Development server port number */
  appPort: number;
  
  /** Base URL for the application */
  appUrl: string;
  
  /** Application path prefix (e.g., /foreign-trade/inspection) */
  appPath: string;
  
  // ==========================================
  // API Configuration
  // ==========================================
  /** Backend for Frontend base URL */
  bffUrl: string;
  
  /** Login page URL */
  loginUrl: string;
  
  // ==========================================
  // Module Federation
  // ==========================================
  /** Authentication remote app URL (format: name@url/remoteEntry.js) */
  authenticationApp: string;
  
  // ==========================================
  // Development Settings
  // ==========================================
  /** Development mode flag */
  appDev: boolean;
  
  /** Store configuration name */
  configurationStoreName: string;
  
  /** Production mode flag */
  isProduction: boolean;
  
  /** Development mode flag (computed from !isProduction) */
  isDevelopment: boolean;
  
  /** Authentication client configuration */
  authConfigClient: string;
  
  /** Redux store debug mode */
  storeDebug: boolean;
  
  // ==========================================
  // UI Settings
  // ==========================================
  /** Sidebar feature enabled/disabled */
  sidebarEnabled: boolean;
  
  /** Label for compact menu display */
  compactMenuLabel: string;
  
  // ==========================================
  // Utility
  // ==========================================
  /** All defaults as strings (for DefinePlugin) */
  defaults: Record<string, string>;
}

/**
 * Environment object with TypeScript types
 * 
 * Import the JavaScript implementation and cast to typed interface
 * This ensures type safety while maintaining CommonJS compatibility
 */
const Environment: IEnvironment = EnvironmentJS as IEnvironment;

/**
 * ENV object with UPPER_CASE naming convention
 * 
 * Provides an alternative API for accessing environment variables
 * Useful for compatibility with existing code that expects UPPER_CASE names
 * Object is frozen to prevent accidental modifications
 * 
 * @example
 * ```typescript
 * import { ENV } from './environment.config';
 * 
 * const apiUrl = ENV.API_BASE_URL;
 * const isDev = ENV.isDevelopment;
 * const port = ENV.APP_PORT;
 * ```
 */
export const ENV: Readonly<{
  /** Application name */
  APP_NAME: string;
  
  /** Application port (number type) */
  APP_PORT: number;
  
  /** Application URL */
  APP_URL: string;
  
  /** Application path prefix */
  APP_PATH: string;
  
  /** API base URL (alias for bffUrl) */
  API_BASE_URL: string;
  
  /** Authentication remote app URL */
  AUTHENTICATION_APP: string;
  
  /** Sidebar enabled flag */
  SIDEBAR_ENABLED: boolean;
  
  /** Compact menu label */
  COMPACT_MENU_LABEL: string;
  
  /** Is development environment */
  isDevelopment: boolean;
  
  /** Is production environment */
  isProduction: boolean;
  
  /** Development mode flag */
  APP_DEV: boolean;
  
  /** Store debug mode */
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

/**
 * Default export - Environment object with camelCase properties
 * 
 * @example
 * ```typescript
 * import Environment from './environment.config';
 * 
 * const port = Environment.appPort;
 * const isDev = Environment.isDevelopment;
 * ```
 */
export default Environment;
