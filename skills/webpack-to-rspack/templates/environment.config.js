/**
 * Environment Configuration
 * 
 * This file centralizes environment variable management with:
 * - Type-safe parsing (string, number, boolean)
 * - Default values for all environments
 * - Runtime validation
 * - Easy access via Environment object
 * 
 * Usage:
 *   const Environment = require('./environment.config');
 *   console.log(Environment.appName); // 'myApp'
 *   console.log(Environment.appPort); // 8500 (number)
 *   console.log(Environment.isProduction); // true/false (boolean)
 */

const ENV_CONFIG = {
  // Microfrontend Configuration
  APP_NAME: { default: "myApp", type: "string" },
  APP_PORT: { default: 8500, type: "number" },
  APP_URL: { default: "http://localhost:8500/", type: "string" },
  APP_PATH: { default: "/app-path", type: "string" },
  
  // Backend URLs
  BFF_URL: { default: "https://dev.example.com/bff", type: "string" },
  LOGIN_URL: { default: "https://dev.example.com/login", type: "string" },
  
  // Module Federation
  AUTHENTICATION_APP: { 
    default: "authentication@http://localhost:3001/remoteEntry.js", 
    type: "string" 
  },
  
  // Feature Flags
  APP_DEV: { default: true, type: "boolean" },
  IS_PRODUCTION: { default: false, type: "boolean" },
  STORE_DEBUG: { default: true, type: "boolean" },
  
  // Optional Configuration
  CONFIGURATION_STORE_NAME: { default: "app", type: "string" },
  AUTH_CONFIG_CLIENT: { default: "portal", type: "string" },
  SIDEBAR_ENABLED: { default: false, type: "boolean" },
  COMPACT_MENU_LABEL: { default: "My App", type: "string" },
};

/**
 * Parse environment variable value based on configured type
 */
const parseEnvValue = (key, { default: defaultValue, type }) => {
  const value = process.env[key];
  
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  switch (type) {
    case "boolean":
      return value === "true";
    case "number":
      return Number(value);
    default:
      return value;
  }
};

/**
 * Get a single environment variable with validation
 */
const get = (key) => {
  if (!(key in ENV_CONFIG)) {
    throw new Error(
      `Environment variable "${key}" not found in ENV_CONFIG. Available keys: ${Object.keys(
        ENV_CONFIG
      ).join(", ")}.`
    );
  }
  return parseEnvValue(key, ENV_CONFIG[key]);
};

/**
 * Get all default values as strings (for DefinePlugin)
 */
const getDefaults = () => {
  const result = {};
  for (const [key, { default: defaultValue }] of Object.entries(ENV_CONFIG)) {
    result[key] = String(defaultValue);
  }
  return result;
};

/**
 * Main Environment object - use this in your app
 */
const Environment = {
  // Microfrontend
  appName: get("APP_NAME"),
  appPort: get("APP_PORT"),
  appUrl: get("APP_URL"),
  appPath: get("APP_PATH"),
  
  // Backend
  bffUrl: get("BFF_URL"),
  loginUrl: get("LOGIN_URL"),
  
  // Module Federation
  authenticationApp: get("AUTHENTICATION_APP"),
  
  // Feature Flags
  appDev: get("APP_DEV"),
  isProduction: get("IS_PRODUCTION"),
  storeDebug: get("STORE_DEBUG"),
  
  // Optional
  configurationStoreName: get("CONFIGURATION_STORE_NAME"),
  authConfigClient: get("AUTH_CONFIG_CLIENT"),
  sidebarEnabled: get("SIDEBAR_ENABLED"),
  compactMenuLabel: get("COMPACT_MENU_LABEL"),
  
  // Export defaults for DefinePlugin
  defaults: getDefaults(),
};

module.exports = Environment;
module.exports.default = Environment;
