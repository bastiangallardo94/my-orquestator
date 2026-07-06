// config/module-federation.config.js
const deps = require('./package.json').dependencies;
const Environment = require('./src/constants/environment.config.js').default;

// Helper para extraer solo el número de versión
const getVersion = (versionString) => {
  if (!versionString) return false;
  // Elimina ^, ~, >= y otros prefijos de semver
  return versionString.replace(/^[\^~>=<]+/, '');
};

const mfConfig = {
  name: Environment.appName,
  filename: 'remoteEntry.js',
  remotes: {
    authentication: Environment.authenticationApp
  },
  exposes: {
    './App': './src/App.tsx'
  },
  // Dependencias compartidas entre microfrontends
  shared: {
    // React core - singleton para evitar múltiples instancias
    react: { 
      singleton: true, 
      requiredVersion: getVersion(deps['react']),
      strictVersion: false,
      eager: false
    },
    'react-dom': { 
      singleton: true, 
      requiredVersion: getVersion(deps['react-dom']),
      strictVersion: false,
      eager: false
    },
    
    // Single-spa - singleton obligatorio
    'single-spa': { 
      singleton: true, 
      requiredVersion: getVersion(deps['single-spa']),
      strictVersion: false,
      eager: false
    },
    'single-spa-react': { 
      singleton: true, 
      requiredVersion: getVersion(deps['single-spa-react']),
      strictVersion: false,
      eager: false
    },
    
    // Emotion - singleton para que MUI funcione correctamente
    '@emotion/react': { 
      singleton: true,
      requiredVersion: getVersion(deps['@emotion/react']),
      strictVersion: false,
      eager: false
    },
    
    // MUI Material - singleton para evitar duplicados de estilos
    '@mui/material': { 
      singleton: true,
      requiredVersion: getVersion(deps['@mui/material']),
      strictVersion: false,
      eager: false,
      // Especificar versión explícitamente para evitar warning
      version: getVersion(deps['@mui/material']),
      packageName: '@mui/material'
    },
    
    // Redux - singleton para compartir estado global
    '@reduxjs/toolkit': { 
      singleton: true,
      requiredVersion: getVersion(deps['@reduxjs/toolkit']),
      strictVersion: false,
      eager: false
    },
    'react-redux': { 
      singleton: true,
      requiredVersion: getVersion(deps['react-redux']),
      strictVersion: false,
      eager: false
    },
    'redux-micro-frontend': { 
      singleton: true, 
      requiredVersion: getVersion(deps['redux-micro-frontend']),
      strictVersion: false,
      eager: false
    }
  }
};

module.exports = { mfConfig };
