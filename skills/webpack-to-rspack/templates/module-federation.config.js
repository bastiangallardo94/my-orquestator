const deps = require('./package.json').dependencies;
const Environment = require('./src/constants/environment.config').default;

/**
 * Helper to extract clean version number from semver string
 * Removes ^, ~, >=, etc. prefixes
 */
const getVersion = (versionString) => {
  if (!versionString) return false;
  return versionString.replace(/^[\^~>=<]+/, '');
};

/**
 * Module Federation Configuration
 * 
 * This configuration defines how this microfrontend integrates with others:
 * - name: Unique identifier for this microfrontend
 * - filename: Name of the remote entry file
 * - remotes: External microfrontends this app can consume
 * - exposes: Components/modules this app exposes to others
 * - shared: Dependencies shared across microfrontends
 */
const mfConfig = {
  name: Environment.appName,
  filename: 'remoteEntry.js',
  
  // Remote microfrontends this app consumes
  remotes: {
    authentication: Environment.authenticationApp
  },
  
  // Components/modules exposed to other microfrontends
  exposes: {
    './App': './src/App.tsx',
    // Add more exposed modules as needed
    // './ComponentName': './src/path/to/Component.tsx',
  },
  
  // Shared dependencies configuration
  shared: {
    // === REACT CORE (singleton required) ===
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
    
    // === SINGLE-SPA (singleton required) ===
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
    
    // === EMOTION (singleton for MUI compatibility) ===
    '@emotion/react': { 
      singleton: true,
      requiredVersion: getVersion(deps['@emotion/react']),
      strictVersion: false,
      eager: false
    },
    '@emotion/styled': { 
      singleton: true,
      requiredVersion: getVersion(deps['@emotion/styled']),
      strictVersion: false,
      eager: false
    },
    
    // === MATERIAL UI (singleton to avoid duplicate styles) ===
    '@mui/material': { 
      singleton: true,
      requiredVersion: getVersion(deps['@mui/material']),
      strictVersion: false,
      eager: false
    },
    
    // === REDUX (singleton for shared state) ===
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
    },
    
    // === ROUTING (singleton for navigation) ===
    'react-router-dom': { 
      singleton: true,
      requiredVersion: getVersion(deps['react-router-dom']),
      strictVersion: false,
      eager: false
    }
  }
};

module.exports = { mfConfig };
