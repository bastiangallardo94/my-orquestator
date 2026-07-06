const ENV_CONFIG = {
  // Configuración del Microfrontend
  APP_NAME: { default: "{{APP_NAME}}", type: "string" },
  APP_PORT: { default: {{APP_PORT}}, type: "number" },
  APP_URL: { default: "http://localhost:{{APP_PORT}}/", type: "string" },
  APP_PATH: { default: "{{APP_PATH}}", type: "string" },
  BFF_URL: { default: "https://dev.fbusinesscenter.com/foreign-trade/bff", type: "string" },
  LOGIN_URL: { default: "https://dev.fbusinesscenter.com/login", type: "string" },

  // Integración con otros Microfrontends
  AUTHENTICATION_APP: { default: "authentication@http://localhost:3001/remoteEntry.js", type: "string" },
  
  // TODO: Configure your remote MFEs here
  // Example: FORWARDER_MFE_URL: { default: "importMaintainerForwarders@http://localhost:8501/remoteEntry.js", type: "string" },

  // Configuración de Desarrollo
  APP_DEV: { default: true, type: "boolean" },
  CONFIGURATION_STORE_NAME: { default: "template", type: "string" },
  IS_PRODUCTION: { default: false, type: "boolean" },
  AUTH_CONFIG_CLIENT: { default: "portal", type: "string" },
  STORE_DEBUG: { default: true, type: "boolean" },

  // Configuración del Menú Lateral
  SIDEBAR_ENABLED: { default: false, type: "boolean" },
  COMPACT_MENU_LABEL: { default: "{{DISPLAY_NAME}}", type: "string" },
};

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

const getDefaults = () => {
  const result = {};
  for (const [key, { default: defaultValue }] of Object.entries(ENV_CONFIG)) {
    result[key] = String(defaultValue);
  }
  return result;
};

const Environment = {
  appName: get("APP_NAME"),
  appPort: get("APP_PORT"),
  appUrl: get("APP_URL"),
  appPath: get("APP_PATH"),
  bffUrl: get("BFF_URL"),
  loginUrl: get("LOGIN_URL"),
  authenticationApp: get("AUTHENTICATION_APP"),
  forwarderMfeUrl: get("FORWARDER_MFE_URL"),
  extraportuarioMfeUrl: get("EXTRAPORTUARIO_MFE_URL"),
  appDev: get("APP_DEV"),
  configurationStoreName: get("CONFIGURATION_STORE_NAME"),
  isProduction: get("IS_PRODUCTION"),
  authConfigClient: get("AUTH_CONFIG_CLIENT"),
  storeDebug: get("STORE_DEBUG"),
  sidebarEnabled: get("SIDEBAR_ENABLED"),
  compactMenuLabel: get("COMPACT_MENU_LABEL"),
  defaults: getDefaults(),
};

module.exports = Environment;
module.exports.default = Environment;

