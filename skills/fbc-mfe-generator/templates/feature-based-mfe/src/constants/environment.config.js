/**
 * Configuración de Variables de Entorno (CommonJS)
 * 
 * Este archivo provee la configuración para archivos de build (.js)
 * El archivo TypeScript (environment.config.ts) re-exporta esta lógica
 * para uso en código TypeScript de la aplicación.
 */

const ENV_CONFIG = {
    APP_NAME: { default: '{{APP_NAME}}', type: 'string' },
    APP_PORT: { default: {{APP_PORT}}, type: 'number' },
    APP_URL: { default: 'http://localhost:{{APP_PORT}}/', type: 'string' },
    APP_PATH: { default: '{{APP_PATH}}', type: 'string' },
    BFF_URL: { default: 'https://dev.fbusinesscenter.com/foreign-trade/bff', type: 'string' },
    LOGIN_URL: { default: 'https://dev.fbusinesscenter.com/login', type: 'string' },
    AUTHENTICATION_APP: { default: 'authentication@http://localhost:3001/remoteEntry.js', type: 'string' },
    APP_DEV: { default: true, type: 'boolean' },
    CONFIGURATION_STORE_NAME: { default: 'template', type: 'string' },
    IS_PRODUCTION: { default: false, type: 'boolean' },
    AUTH_CONFIG_CLIENT: { default: 'portal', type: 'string' },
    STORE_DEBUG: { default: true, type: 'boolean' },
    SIDEBAR_ENABLED: { default: false, type: 'boolean' },
    COMPACT_MENU_LABEL: { default: '{{DISPLAY_NAME}}', type: 'string' },
};

const parseEnvValue = (key, { default: defaultValue, type }) => {
    const value = process.env[key];

    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }

    switch (type) {
      case 'boolean':
        return value === 'true';
      case 'number':
        return Number(value);
      default:
        return value;
    }
};

const get = (key) => {
    if (!(key in ENV_CONFIG)) {
      throw new Error(
        `Environment variable "${key}" not found in ENV_CONFIG. Available keys: ${Object.keys(ENV_CONFIG).join(', ')}.`
      );
    }
    return parseEnvValue(key, ENV_CONFIG[key]);
};

const getDefaults = () => {
    const result = {};
    for (const [key, { default: defaultValue }] of Object.entries(ENV_CONFIG)) {
      result[key] = String(defaultValue);
    }
    return result;
};

const Environment = {
    appName: get('APP_NAME'),
    appPort: get('APP_PORT'),
    appUrl: get('APP_URL'),
    appPath: get('APP_PATH'),
    bffUrl: get('BFF_URL'),
    loginUrl: get('LOGIN_URL'),
    authenticationApp: get('AUTHENTICATION_APP'),
    appDev: get('APP_DEV'),
    configurationStoreName: get('CONFIGURATION_STORE_NAME'),
    isProduction: get('IS_PRODUCTION'),
    isDevelopment: !get('IS_PRODUCTION'),
    authConfigClient: get('AUTH_CONFIG_CLIENT'),
    storeDebug: get('STORE_DEBUG'),
    sidebarEnabled: get('SIDEBAR_ENABLED'),
    compactMenuLabel: get('COMPACT_MENU_LABEL'),
    defaults: getDefaults(),
};

module.exports = Environment;
module.exports.default = Environment;
