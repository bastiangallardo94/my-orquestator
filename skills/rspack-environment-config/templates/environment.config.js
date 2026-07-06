/**
 * Configuración de Variables de Entorno (CommonJS)
 * 
 * Este archivo provee la configuración para archivos de build (.js)
 * El archivo TypeScript (environment.config.ts) re-exporta esta lógica
 * para uso en código TypeScript de la aplicación.
 * 
 * @see templates/environment.config.ts - TypeScript wrapper with types
 */

/**
 * ENV_CONFIG Schema
 * Define all environment variables with their types and default values
 * 
 * Supported types:
 * - 'string': Text values
 * - 'number': Numeric values (ports, timeouts, etc)
 * - 'boolean': True/false flags
 */
const ENV_CONFIG = {
  // ==========================================
  // App Configuration
  // ==========================================
  APP_NAME: { default: 'importInspection', type: 'string' },
  APP_PORT: { default: 8500, type: 'number' },
  APP_URL: { default: 'http://localhost:8500/', type: 'string' },
  APP_PATH: { default: '/foreign-trade/inspection', type: 'string' },
  
  // ==========================================
  // API Configuration
  // ==========================================
  BFF_URL: { default: 'https://dev.fbusinesscenter.com/foreign-trade/bff', type: 'string' },
  LOGIN_URL: { default: 'https://dev.fbusinesscenter.com/login', type: 'string' },
  
  // ==========================================
  // Module Federation - Remote Apps
  // ==========================================
  AUTHENTICATION_APP: { default: 'authentication@http://localhost:3001/remoteEntry.js', type: 'string' },
  
  // ==========================================
  // Development Settings
  // ==========================================
  APP_DEV: { default: true, type: 'boolean' },
  CONFIGURATION_STORE_NAME: { default: 'template', type: 'string' },
  IS_PRODUCTION: { default: false, type: 'boolean' },
  AUTH_CONFIG_CLIENT: { default: 'portal', type: 'string' },
  STORE_DEBUG: { default: true, type: 'boolean' },
  
  // ==========================================
  // UI Settings
  // ==========================================
  SIDEBAR_ENABLED: { default: false, type: 'boolean' },
  COMPACT_MENU_LABEL: { default: 'Imports Inspections', type: 'string' },
};

/**
 * Parse environment variable value to specified type
 * 
 * @param {string} key - Environment variable key
 * @param {Object} config - Config object with default value and type
 * @param {*} config.default - Default value if env var not set
 * @param {'string'|'number'|'boolean'} config.type - Expected type
 * @returns {string|number|boolean} Parsed value
 * 
 * @example
 * parseEnvValue('APP_PORT', { default: 3000, type: 'number' })
 * // Returns: 3000 (number) if APP_PORT not set
 * // Returns: 8080 (number) if process.env.APP_PORT = '8080'
 */
const parseEnvValue = (key, { default: defaultValue, type }) => {
  const value = process.env[key];

  // Use default if not set or empty
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  // Convert string to appropriate type
  switch (type) {
    case 'boolean':
      return value === 'true';
    case 'number':
      return Number(value);
    default:
      return value;
  }
};

/**
 * Get environment variable with validation
 * 
 * @param {string} key - Key from ENV_CONFIG
 * @returns {*} Parsed environment value
 * @throws {Error} If key doesn't exist in ENV_CONFIG
 * 
 * @example
 * get('APP_PORT') // Returns 8500 or process.env.APP_PORT as number
 */
const get = (key) => {
  if (!(key in ENV_CONFIG)) {
    throw new Error(
      `Environment variable "${key}" not found in ENV_CONFIG. Available keys: ${Object.keys(ENV_CONFIG).join(', ')}.`
    );
  }
  return parseEnvValue(key, ENV_CONFIG[key]);
};

/**
 * Get all defaults as strings for DefinePlugin injection
 * 
 * @returns {Object.<string, string>} All config keys with stringified defaults
 * @example
 * getDefaults() // { APP_NAME: 'myApp', APP_PORT: '3000', IS_PRODUCTION: 'false' }
 */
const getDefaults = () => {
  const result = {};
  for (const [key, { default: defaultValue }] of Object.entries(ENV_CONFIG)) {
    result[key] = String(defaultValue);
  }
  return result;
};

/**
 * Environment Configuration Object
 * 
 * Main export with all environment variables parsed and ready to use
 * Properties use camelCase naming convention
 * 
 * @type {Object}
 * @property {string} appName - Application name
 * @property {number} appPort - Development server port
 * @property {string} appUrl - Application base URL
 * @property {string} appPath - Application path prefix
 * @property {string} bffUrl - Backend for Frontend URL
 * @property {string} loginUrl - Login page URL
 * @property {string} authenticationApp - Authentication remote app URL
 * @property {boolean} appDev - Development mode flag
 * @property {string} configurationStoreName - Store configuration name
 * @property {boolean} isProduction - Production mode flag
 * @property {boolean} isDevelopment - Development mode flag (computed)
 * @property {string} authConfigClient - Auth client configuration
 * @property {boolean} storeDebug - Store debug mode
 * @property {boolean} sidebarEnabled - Sidebar feature flag
 * @property {string} compactMenuLabel - Compact menu label text
 * @property {Object.<string, string>} defaults - All defaults as strings
 */
const Environment = {
  // App Configuration
  appName: get('APP_NAME'),
  appPort: get('APP_PORT'),
  appUrl: get('APP_URL'),
  appPath: get('APP_PATH'),
  
  // API Configuration
  bffUrl: get('BFF_URL'),
  loginUrl: get('LOGIN_URL'),
  
  // Remote Apps
  authenticationApp: get('AUTHENTICATION_APP'),
  
  // Development Settings
  appDev: get('APP_DEV'),
  configurationStoreName: get('CONFIGURATION_STORE_NAME'),
  isProduction: get('IS_PRODUCTION'),
  isDevelopment: !get('IS_PRODUCTION'), // Computed property
  authConfigClient: get('AUTH_CONFIG_CLIENT'),
  storeDebug: get('STORE_DEBUG'),
  
  // UI Settings
  sidebarEnabled: get('SIDEBAR_ENABLED'),
  compactMenuLabel: get('COMPACT_MENU_LABEL'),
  
  // Utility
  defaults: getDefaults(),
};

// CommonJS exports
module.exports = Environment;
module.exports.default = Environment;
