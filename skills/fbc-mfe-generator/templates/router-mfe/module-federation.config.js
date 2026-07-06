const deps = require("./package.json").dependencies;
const Environment = require('./src/constants/environment.config');

/**
 * Module Federation Configuration
 * Configuración centralizada para Module Federation Enhanced
 */
module.exports = (env) => {
  const { APP_NAME } = env || {};

  return {
    name: APP_NAME || Environment.appName,
    filename: "remoteEntry.js",
    
    // Configuración de runtime para evitar conflictos con HMR
    runtime: false,

    // REMOTES: MFEs que este router consume
    remotes: {
      authentication: Environment.authenticationApp,
      importMaintainerForwarders:
        process.env.FORWARDER_MFE_URL ||
        Environment.defaults.FORWARDER_MFE_URL,
      importMaintainerBondedWarehouses:
        process.env.EXTRAPORTUARIO_MFE_URL ||
        Environment.defaults.EXTRAPORTUARIO_MFE_URL,
      importMaintainerDocuments:
        process.env.DOCUMENTS_MFE_URL ||
        "importMaintainerDocuments@http://localhost:8503/remoteEntry.js",
      importMaintainerHsCodes:
        process.env.HSCODES_MFE_URL ||
        "importMaintainerHsCodes@http://localhost:8504/remoteEntry.js",
    },
    
    // Configuración de remotes para desarrollo: permitir que fallen sin romper la compilación
    dev: {
      // Los remotes que fallen en desarrollo no detendrán la app
      disableHostRemoteEntry: false,
    },

    // EXPOSES: Lo que este MFE expone a otros
    exposes: {
      "./App": "./src/App.tsx",
    },

    // SHARED: Dependencias compartidas entre MFEs
    shared: {
      // === DEPENDENCIAS CRÍTICAS (eager: true) ===
      react: {
        singleton: true,
        requiredVersion: deps["react"],
        strictVersion: true,
        eager: true,
      },
      "react-dom": {
        singleton: true,
        requiredVersion: deps["react-dom"],
        strictVersion: true,
        eager: true,
      },

      // === DEPENDENCIAS ARQUITECTURALES ===
      "single-spa": {
        singleton: true,
        requiredVersion: deps["single-spa"],
        strictVersion: true,
      },
      "single-spa-react": {
        singleton: true,
        requiredVersion: deps["single-spa-react"],
        strictVersion: true,
      },
      "redux-micro-frontend": {
        singleton: false,
        requiredVersion: deps["redux-micro-frontend"],
        strictVersion: false,
      },

      // === GESTIÓN DE ESTADO ===
      "react-redux": {
        singleton: true,
        requiredVersion: deps["react-redux"],
        strictVersion: false,
      },
      "@reduxjs/toolkit": {
        singleton: true,
        requiredVersion: deps["@reduxjs/toolkit"],
        strictVersion: false,
      },
      "redux-persist": {
        singleton: true,
        requiredVersion: deps["redux-persist"],
        strictVersion: false,
      },

      // === NAVEGACIÓN ===
      "react-router-dom": {
        singleton: true,
        requiredVersion: deps["react-router-dom"],
        strictVersion: false,
      },
    },
  };
};
