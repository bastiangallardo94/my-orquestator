---
name: rspack-bun-migration
description: "Complete workflow to migrate frontend microfrontends to Rspack + Bun, adjusting scripts, CI/CD, Docker, lockfiles, and publishing changes to feature branch with PR. Includes troubleshooting for common Bun errors in pipelines and private registries."
---

# Rspack + Bun Migration Skill

## Overview

This skill provides a **complete, auditable, and repeatable workflow** for migrating frontend projects (especially microfrontends) from Webpack/NPM/Yarn to **Rspack + Bun**. It standardizes package management, build tooling, CI/CD pipelines, and Docker containerization, leaving your project production-ready.

**Key benefits:**
- **10-20x faster dependency installation** (Bun vs npm/yarn)
- **5-10x faster builds** (Rspack vs Webpack)
- **Unified tooling** across all microfrontends
- **Smaller Docker images** with optimized multi-stage builds
- **Consistent CI/CD pipelines** with proper Bun integration

---

## When to Use This Skill

Use this skill when:
- Migrating a microfrontend/SPA from Webpack + npm/yarn to Rspack + Bun
- Standardizing build tooling across multiple frontend projects
- Encountering `bun: command not found` in CI/CD pipelines
- Setting up Docker for production deployment with Bun
- Dealing with authentication issues in private npm registries with Bun
- Preparing a feature branch with PR for migration changes

---

## When NOT to Use This Skill

Skip this skill when:
- The repository is backend (Java/.NET/Python) without frontend bundler
- You only need Rspack migration without Bun (use `webpack-to-rspack` skill instead)
- You don't have permissions to push/create PRs (theoretical analysis only)
- The project doesn't use a web bundler (static HTML/CSS sites)

---

## Prerequisites

Before starting, ensure:
- ✅ Repository is a frontend project with `package.json`
- ✅ You have push/PR permissions on the repository
- ✅ Base branch name (e.g., `develop` or `main`)
- ✅ Feature branch naming convention (e.g., `feature/rspack-bun-migration`)
- ✅ Access credentials for private npm registries (if applicable)

---

## Recommended Versions (Tested & Production-Ready)

These versions have been validated in production environments and resolve known issues:

### Core Build Tools
- **Rspack**: `^2.0.4` (latest stable)
- **@rspack/cli**: `^2.0.4`
- **@rspack/core**: `^2.0.4`
- **@rspack/dev-server**: `^2.0.1`
- **@rspack/plugin-react-refresh**: `^2.0.0`

### Module Federation
- **@module-federation/enhanced**: `^2.5.0` (replaces `rspack.container.ModuleFederationPlugin`)

### Required Polyfills
- **process**: `^0.11.10` (runtime dependency, fixes "process is not defined" in Rspack 2.0+)

### Runtime
- **Node.js**: `>= 20.0.0` (NVM recommended)
- **Bun**: `>= 1.2.0` (latest stable)

### Common Dependencies
- **React**: `^18.3.1`
- **TypeScript**: `^5.9.3`
- **@types/node**: `^22.15.3`

**Important Notes:**
- ⚠️ Rspack 2.0+ requires `process` polyfill (add to `dependencies`, not `devDependencies`)
- ⚠️ Use `@module-federation/enhanced` for Module Federation (Rspack 2.0+ compatibility)
- ✅ `@rspack/dev-server` is now a separate package (required for `rspack serve`)
- ✅ All versions are compatible with Bun native package manager

---

## Migration Workflow

### Phase 1: Environment Setup

#### 1.1 Install Node 20 with NVM

```bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
node -v  # Should show v20.x.x
```

**Why Node 20?**
- Bun requires Node 18+ for optimal performance
- Rspack is optimized for modern Node runtimes
- Better native module compatibility

#### 1.2 Install Bun Globally

```bash
npm install -g bun@latest
bun -v  # Should show >= 1.2.x
which bun  # Verify installation path
```

**Validation:**
```bash
bun --help  # Should display Bun CLI help
```

---

### Phase 2: Package.json Migration

This phase aligns your `package.json` to use Bun commands while maintaining compatibility with CI/CD templates.

#### 2.1 Update Scripts to Use Bun

Replace all internal `npm run` and `yarn run` references with `bun run`:

**Before:**
```json
{
  "scripts": {
    "pre-commit": "npm run type-check && npm run lint && npm run test",
    "build": "webpack --mode production",
    "start": "webpack serve --mode development"
  }
}
```

**After:**
```json
{
  "scripts": {
    "pre-commit": "bun run type-check && bun run lint && bun run test",
    "build": "cross-env NODE_ENV=production rspack --mode production",
    "start": "cross-env NODE_ENV=development rspack serve --mode development",
    "test:coverage": "jest --coverage"
  }
}
```

**Key changes:**
- ✅ Replace `npm run` → `bun run` in script chains
- ✅ Replace `webpack` → `rspack` commands
- ✅ Add `test:coverage` if CI pipeline uses it
- ✅ Use `cross-env` for cross-platform env variable support

#### 2.2 Add Recommended Scripts

```json
{
  "scripts": {
    "install:yarn": "bun install --yarn",
    "clean": "rm -rf dist node_modules",
    "prebuild": "bun run clean",
    "postinstall": "bun run type-check"
  }
}
```

---

### Phase 3: Lockfile Strategy

Bun generates `bun.lock` by default, but many CI/CD pipelines still expect `yarn.lock`. Here's the recommended strategy:

#### 3.1 Generate Both Lockfiles

```bash
# Generate bun.lock
bun install

# Generate yarn.lock for CI compatibility
bun install --yarn
```

**Result:**
- `bun.lock` - Primary lockfile (Bun-native, fastest)
- `yarn.lock` - Secondary lockfile (CI/CD compatibility)
- `package-json.lock` - Auto-generated by Bun (should be ignored)

#### 3.2 Update .gitignore

Add to `.gitignore`:
```
# Lockfiles
package-json.lock

# Keep these tracked
!bun.lock
!yarn.lock
```

**Why?**
- `package-json.lock` is Bun internal state, not needed in git
- `bun.lock` ensures deterministic Bun installs
- `yarn.lock` ensures CI compatibility when templates don't support Bun yet

#### 3.3 Verify Lockfiles Are Tracked

```bash
git status
# Should show bun.lock and yarn.lock as tracked files
```

---

### Phase 4: CI/CD Pipeline Migration

This is the **most critical phase** where most teams encounter errors.

#### 4.1 Common CI/CD Error: `bun: command not found`

**Cause:** CI runners don't have Bun installed globally.

**Solution:** Use `npx -y bun@<version>` to download and run Bun on-the-fly.

#### 4.2 GitHub Actions Example

**Before (broken):**
```yaml
command_dependency: "bun install --yarn"
command_build: "bun run build"
```

**After (working):**
```yaml
command_dependency: "npx -y bun@1.3.14 install --yarn --ignore-scripts"
command_build: "npx -y bun@1.3.14 run build"
command_test: "npx -y bun@1.3.14 run test:coverage"
```

**Key points:**
- ✅ Pin Bun version for reproducibility (`@1.3.14`)
- ✅ Use `--ignore-scripts` to prevent lifecycle script failures
- ✅ Use `--yarn` to generate `yarn.lock` for template compatibility
- ⚠️ **Never chain commands with `&&`** in template fields (templates don't invoke shell)

#### 4.3 GitLab CI Example

**`.gitlab-ci.yml`:**
```yaml
include:
  - project: 'your-org/ci-templates'
    file: '.gitlab-ci-template-node.yml'
    ref: 'main'

variables:
  CI_LANGUAGE_IMAGE_DOCKER: "node:20-alpine"
  COMMAND_DEPENDENCY: "npx -y bun@1.3.14 install --yarn --ignore-scripts"
  COMMAND_BUILD: "npx -y bun@1.3.14 run build"
  COMMAND_TEST: "npx -y bun@1.3.14 run test:coverage"
```

**Key changes:**
- ✅ Use Node 20+ base image
- ✅ Execute Bun via `npx` in each command
- ✅ Don't use `&&` or `;` in COMMAND variables

#### 4.4 Private Registry Authentication

If using Google Artifact Registry or private npm:

**Option 1: NPM Token (GitHub Actions)**
```yaml
- name: Authenticate to registry
  run: |
    echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > .npmrc
```

**Option 2: Google Artifact Registry (GitLab CI)**
```yaml
before_script:
  - npx -y google-artifactregistry-auth
  - npx -y bun@1.3.14 install --yarn
```

**Common Error:**
```
error: GET https://npm.pkg.dev/project/registry/package/-/package-1.0.0.tgz - 401
```

**Solution:** Verify `.npmrc` contains correct token or run auth helper before `bun install`.

---

### Phase 5: Dockerfile Migration

Containerize your app with Bun for production deployment.

#### 5.1 Multi-Stage Dockerfile

**Create `Dockerfile`:**
```dockerfile
# ============================================
# Stage 1: Builder (Bun + Node)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install Bun
RUN npm install -g bun@1.3.14

# Copy registry authentication
COPY .npm/npmrc ./.npmrc

# Copy package files
COPY package.json bun.lock yarn.lock ./

# Install dependencies (frozen lockfile for reproducibility)
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src
COPY public ./public
COPY rspack.config.js module-federation.config.js tsconfig.json ./
COPY postcss.config.js tailwind.config.js ./

# Build application
RUN bun run build

# ============================================
# Stage 2: Production Runtime (Nginx)
# ============================================
FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Copy built assets from builder
COPY --from=builder /usr/src/app/dist ./

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Key principles:**
- ✅ **Stage 1 (Builder):** Install Bun, compile app with Rspack
- ✅ **Stage 2 (Runtime):** Lightweight Nginx serving static files
- ✅ Use `--frozen-lockfile` to ensure reproducible builds
- ✅ Copy only necessary files to each stage (smaller images)
- ⚠️ **Never use `rspack serve` in production** (dev server only)

#### 5.2 Build and Test Docker Image

```bash
# Build image
docker build -t my-app:latest .

# Run container
docker run -p 8080:80 my-app:latest

# Test
curl http://localhost:8080
```

**Expected result:** Your app served by Nginx on port 80.

---

### Phase 6: Environment Variables Pattern (CRITICAL)

**This is the STANDARD pattern for ALL Rspack projects. Follow it exactly.**

#### 6.1 File Structure

Create the following structure for environment variables:

```
├── .env.development              # Development variables (commiteado)
├── .env.production               # Production variables (commiteado)
├── .env.local                    # Local overrides (NO commiteado, opcional)
├── .env.local.example            # Template for .env.local
├── module-federation.config.js   # Module Federation config (separado)
├── rspack.config.js              # Rspack config principal
└── src/constants/
    ├── environment.config.js     # Lógica de variables (CommonJS)
    └── environment.config.ts     # Wrapper TypeScript con tipos
```

#### 6.2 Create .env.development

```bash
# Configuración de desarrollo para el microfrontend [APP_NAME]

# Configuración del Microfrontend
APP_NAME=importAppName
APP_PORT=8500
APP_URL=http://localhost:8500/
APP_PATH=/foreign-trade/app-name
BFF_URL=https://dev.fbusinesscenter.com/foreign-trade/bff
LOGIN_URL=https://dev.fbusinesscenter.com/login

# Integración con otros Microfrontends
AUTHENTICATION_APP=authentication@http://localhost:3001/remoteEntry.js

# Configuración de Desarrollo
APP_DEV=true
CONFIGURATION_STORE_NAME=template
IS_PRODUCTION=false
AUTH_CONFIG_CLIENT=portal
STORE_DEBUG=true

# Configuración del Menú Lateral
SIDEBAR_ENABLED=false
COMPACT_MENU_LABEL=App Name
```

#### 6.3 Create .env.production

```bash
# Configuración de producción para el microfrontend [APP_NAME]
# IMPORTANTE: Este archivo contiene valores de UAT por defecto
# En CI/CD, la variable CI_COMMIT_SHA debe ser reemplazada en el pipeline

# Configuración del Microfrontend
APP_NAME=importAppName
APP_PORT=8500
APP_URL=https://uat.fbusinesscenter.com/foreign-trade/frontend/app-name/
APP_PATH=/foreign-trade/app-name
BFF_URL=https://uat.fbusinesscenter.com/foreign-trade/bff
LOGIN_URL=https://uat.fbusinesscenter.com/login

# Integración con otros Microfrontends
AUTHENTICATION_APP=authentication@https://uat.fbusinesscenter.com/authentication/remoteEntry.js?v=${CI_COMMIT_SHA}

# Configuración de Producción
APP_DEV=false
CONFIGURATION_STORE_NAME=template
IS_PRODUCTION=true
AUTH_CONFIG_CLIENT=portal
STORE_DEBUG=false

# Configuración del Menú Lateral
SIDEBAR_ENABLED=false
COMPACT_MENU_LABEL=App Name
```

#### 6.4 Create src/constants/environment.config.js

```javascript
/**
 * Configuración de Variables de Entorno (CommonJS)
 * 
 * Este archivo provee la configuración para archivos de build (.js)
 * El archivo TypeScript (environment.config.ts) re-exporta esta lógica
 * para uso en código TypeScript de la aplicación.
 */

const ENV_CONFIG = {
    APP_NAME: { default: 'importAppName', type: 'string' },
    APP_PORT: { default: 8500, type: 'number' },
    APP_URL: { default: 'http://localhost:8500/', type: 'string' },
    APP_PATH: { default: '/foreign-trade/app-name', type: 'string' },
    BFF_URL: { default: 'https://dev.fbusinesscenter.com/foreign-trade/bff', type: 'string' },
    LOGIN_URL: { default: 'https://dev.fbusinesscenter.com/login', type: 'string' },
    AUTHENTICATION_APP: { default: 'authentication@http://localhost:3001/remoteEntry.js', type: 'string' },
    APP_DEV: { default: true, type: 'boolean' },
    CONFIGURATION_STORE_NAME: { default: 'template', type: 'string' },
    IS_PRODUCTION: { default: false, type: 'boolean' },
    AUTH_CONFIG_CLIENT: { default: 'portal', type: 'string' },
    STORE_DEBUG: { default: true, type: 'boolean' },
    SIDEBAR_ENABLED: { default: false, type: 'boolean' },
    COMPACT_MENU_LABEL: { default: 'App Name', type: 'string' },
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
```

#### 6.5 Create src/constants/environment.config.ts

```typescript
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
```

#### 6.6 Create module-federation.config.js

```javascript
// module-federation.config.js
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
    "react": {
      singleton: true,
      requiredVersion: getVersion(deps["react"]),
      strictVersion: true,
      eager: true,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: getVersion(deps["react-dom"]),
      strictVersion: true,
      eager: true,
    },

    // Single-spa - singleton obligatorio
    "single-spa": {
      singleton: true,
      requiredVersion: getVersion(deps["single-spa"]),
      strictVersion: true,
    },
    "single-spa-react": {
      singleton: true,
      requiredVersion: getVersion(deps["single-spa-react"]),
      strictVersion: true,
    },
    "redux-micro-frontend": {
      singleton: false,
      requiredVersion: getVersion(deps["redux-micro-frontend"]),
      strictVersion: false,
    },

    // Redux - singleton para compartir estado global
    "react-redux": {
      singleton: true,
      requiredVersion: getVersion(deps["react-redux"]),
      strictVersion: false,
    },
    "@reduxjs/toolkit": {
      singleton: true,
      requiredVersion: getVersion(deps["@reduxjs/toolkit"]),
      strictVersion: false,
    },
    "redux-persist": {
      singleton: true,
      requiredVersion: getVersion(deps["redux-persist"]),
      strictVersion: false,
    },

    // Navegación
    "react-router-dom": {
      singleton: true,
      requiredVersion: getVersion(deps["react-router-dom"]),
      strictVersion: false,
    },
  },
};

module.exports = { mfConfig };
```

#### 6.7 Update rspack.config.js

```javascript
/**
 * rspack.config.js
 *
 * Configuración de Rspack para microfrontends
 * Patrón estándar basado en proyecto inspection
 */

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');

// Carga el archivo .env.${NODE_ENV}
const envPath = path.join(
  __dirname,
  `.env.${process.env.NODE_ENV || 'development'}`
);

// =========================================
// 🔍 LOGGING: Validación de archivo .env
// =========================================
console.log('\n=========================================');
console.log('🔍 RSPACK ENV VARIABLES DEBUG');
console.log('=========================================');
console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📄 .env file path: ${envPath}`);
console.log(`📄 .env absolute path: ${path.resolve(envPath)}`);

const envFileExists = fs.existsSync(envPath);
console.log(`${envFileExists ? '✅' : '❌'} .env file exists: ${envFileExists}`);

if (!envFileExists) {
  console.log('⚠️  WARNING: .env file not found! Using default values from environment.config.js');
} else {
  console.log(`📁 Using file: ${path.basename(envPath)}`);
}

// Solo carga desde archivo si no existe la variable en el sistema
const dotenvResult = dotenv.config({ path: envPath, override: false });

if (dotenvResult.error && envFileExists) {
  console.log('❌ Error loading .env file:', dotenvResult.error.message);
} else if (!dotenvResult.error && envFileExists) {
  console.log('✅ .env file loaded successfully');
}

const { rspack } = require('@rspack/core');
const { defineConfig } = require('@rspack/cli');

// Configuración de Module Federation
const { mfConfig } = require('./module-federation.config.js');

// Objeto con las variables de entorno parseadas
const Environment = require('./src/constants/environment.config.js');

// Targets de browsers para el transpilador SWC
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];
const mode = process.env.NODE_ENV || "development";
const isDev = mode === 'development';
const isProduction = mode === "production";

module.exports = async () => {
  // Carga dinámica del plugin ESM
  let RefreshPlugin;
  if (isDev) {
    const { ReactRefreshRspackPlugin } = await import('@rspack/plugin-react-refresh');
    RefreshPlugin = ReactRefreshRspackPlugin;
  }

  return defineConfig({
    mode: mode,
    entry: './src/index.ts',
    output: {
      uniqueName: Environment.appName,
      publicPath: 'auto',
      path: path.resolve(process.cwd(), "dist"),
      clean: true,
      assetModuleFilename: "images/[hash][ext][query]",
      chunkFilename: "[name].[contenthash].js",
    },
    devtool: false,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        '@core': path.resolve(__dirname, 'src/core'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
      }
    },
    optimization: {
      removeAvailableModules: true,
      minimize: true,
    },
    devServer: {
      port: Environment.appPort,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: { fullySpecified: false }
        },
        {
          test: /\.json$/,
          type: "json",
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: [
            {
              loader: "builtin:lightningcss-loader",
              options: {
                implementation: require.resolve("lightningcss"),
              },
            },
            "postcss-loader"
          ],
          type: "css",
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: 'fonts/[hash][ext][query]' }
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev,
                }
              }
            },
            env: { targets }
          }
        }
      ]
    },

    plugins: [
      isDev ? new RefreshPlugin() : null,
      // ProvidePlugin para solucionar "process is not defined" en Rspack 2.0+
      new rspack.ProvidePlugin({
        process: require.resolve('process/browser'),
      }),
      // Inyecta variables de entorno como OBJETO (no individual)
      // IMPORTANTE: El formato de objeto permite acceso dinámico process.env[key]
      // mientras que el formato individual solo reemplaza literales exactos
      new rspack.DefinePlugin({
        'process.env': JSON.stringify(
          (() => {
            console.log('\n=========================================');
            console.log('📋 INJECTING ENVIRONMENT VARIABLES');
            console.log('=========================================');
            
            const finalVars = Object.keys(Environment.defaults).reduce((acc, key) => {
              const envValue = process.env[key];
              const defaultValue = Environment.defaults[key];
              const finalValue = envValue ?? defaultValue;
              
              acc[key] = finalValue;
              
              // Log each variable being injected
              console.log(`🔹 ${key}: ${finalValue} ${envValue ? '(from ENV)' : '(default)'}`);
              
              return acc;
            }, {});
            
            console.log('=========================================\n');
            return finalVars;
          })()
        )
      }),
      // Module Federation con @module-federation/enhanced (Rspack 2.0+)
      new ModuleFederationPlugin(mfConfig),
      new rspack.HtmlRspackPlugin({ template: './src/index.html' }),
      !isDev
        ? new rspack.SourceMapDevToolPlugin({
          noSources: false,
          filename: '../dist_sourcemaps/[file].map'
        })
        : null
    ].filter(Boolean)
  });
};
```

#### 6.8 Update src/types/env.d.ts

```typescript
/**
 * Declaración de tipos para variables de entorno
 */

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly APP_NAME: string;
    readonly APP_PORT: string;
    readonly APP_URL: string;
    readonly APP_PATH: string;
    readonly APP_DEV: string;
    readonly BFF_URL: string;
    readonly LOGIN_URL: string;
    readonly AUTHENTICATION_APP: string;
    readonly AUTH_CONFIG_CLIENT: string;
    readonly STORE_DEBUG: string;
    readonly SIDEBAR_ENABLED: string;
    readonly COMPACT_MENU_LABEL: string;
    readonly CONFIGURATION_STORE_NAME: string;
    readonly IS_PRODUCTION: string;
  }
}
```

#### 6.9 Usage in Code

```typescript
// ✅ Opción 1: camelCase (RECOMENDADO)
import Environment from '@core/constants/environment.config';

console.log(Environment.appUrl);        // string
console.log(Environment.appPort);       // number
console.log(Environment.isDevelopment); // boolean

// ✅ Opción 2: UPPER_CASE (compatible)
import { ENV } from '@core/constants/environment.config';

console.log(ENV.APP_URL);         // string
console.log(ENV.APP_PORT);        // number
console.log(ENV.isDevelopment);   // boolean
```

#### 6.10 Priority System

```
Variables del Sistema (CI/CD) > .env.${NODE_ENV} > Valores por defecto en ENV_CONFIG
```

Las variables definidas en GitLab CI/CD **siempre tienen máxima prioridad** y sobreescriben archivos `.env`.

---

### Phase 7: Documentation Updates

Update your `README.md` to reflect the new tooling:

**Example README section:**
```markdown
## Development Setup

### Prerequisites
- Node 20+
- Bun 1.2+

### Installation

```bash
# Install Bun globally
npm install -g bun@latest

# Install dependencies (generates bun.lock and yarn.lock)
bun install --yarn

# Start development server
bun run start
```

### Available Scripts

- `bun run start` - Start dev server (http://localhost:8500)
- `bun run build` - Build for production
- `bun run test` - Run tests
- `bun run test:coverage` - Run tests with coverage
- `bun run lint` - Lint code
- `bun run type-check` - TypeScript type checking

### Adding Dependencies

```bash
# Add dependency
bun add <package>

# Add dev dependency
bun add -d <package>

# Update lockfiles for CI
bun install --yarn
```
```

---

### Phase 8: Git Workflow & PR

#### 8.1 Create Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/rspack-bun-migration

# Verify branch
git branch
```

#### 8.2 Stage and Commit Changes

```bash
# Add all migration files
git add package.json bun.lock yarn.lock .gitignore rspack.config.js Dockerfile README.md .gitlab-ci.yml

# Commit with descriptive message
git commit -m "feat: migrate to rspack and bun for improved build performance

- Replace webpack with rspack (5-10x faster builds)
- Replace npm/yarn with bun (10-20x faster installs)
- Update CI/CD to use npx bun commands
- Add multi-stage Dockerfile with bun + nginx
- Generate bun.lock and yarn.lock for compatibility
- Update README with bun commands

BREAKING CHANGE: Requires Node 20+ and bun 1.2+"
```

#### 8.3 Push and Create PR

```bash
# Push to remote
git push -u origin feature/rspack-bun-migration

# Create PR using GitHub CLI
gh pr create \
  --title "feat: Migrate to Rspack + Bun" \
  --body "$(cat <<'EOF'
## Summary
- ✅ Migrated from Webpack to Rspack (5-10x faster builds)
- ✅ Migrated from npm/yarn to Bun (10-20x faster installs)
- ✅ Updated CI/CD pipelines to use Bun via npx
- ✅ Created production Dockerfile with Bun + Nginx
- ✅ Generated bun.lock and yarn.lock for compatibility

## Performance Improvements
- **Local builds:** Webpack 45s → Rspack 8s
- **CI builds:** 3m 20s → 45s
- **Dependency installs:** npm 1m 15s → bun 4s

## Testing Checklist
- [ ] Local dev server works (`bun run start`)
- [ ] Production build works (`bun run build`)
- [ ] CI pipeline passes
- [ ] Docker image builds and runs
- [ ] Module Federation remotes load correctly

## Breaking Changes
- Requires Node 20+
- Requires Bun 1.2+ for local development
- CI/CD pipelines updated to use `npx bun` commands

## Migration Guide
See updated README.md for new development setup instructions.
EOF
)" \
  --base develop
```

---

## Troubleshooting

### 1. `bun: command not found` in CI

**Symptom:**
```bash
/bin/sh: bun: command not found
```

**Solution:**
Use `npx -y bun@1.3.14` instead of `bun` in CI commands:
```yaml
command_dependency: "npx -y bun@1.3.14 install --yarn"
```

---

### 2. `EINVALIDTAGNAME` Error in CI

**Symptom:**
```bash
npm ERR! Invalid tag name "install && bun": Tags may not have any characters that encodeURIComponent encodes.
```

**Cause:** Template interprets `&&` as npm argument instead of shell operator.

**Solution:** Don't chain commands with `&&` in template fields:

**Before (broken):**
```yaml
command_dependency: "bun install --yarn && bun run build"
```

**After (working):**
```yaml
command_dependency: "npx -y bun@1.3.14 install --yarn"
command_build: "npx -y bun@1.3.14 run build"
```

---

### 3. 401 Unauthorized with Private Registry

**Symptom:**
```bash
error: GET https://npm.pkg.dev/project/registry/@scope/package/-/package-1.0.0.tgz - 401
```

**Solution:**

**Option A:** Add `.npmrc` with authentication token:
```ini
# .npmrc
@scope:registry=https://npm.pkg.dev/project/registry/
//npm.pkg.dev/project/registry/:_authToken=${NPM_TOKEN}
```

**Option B:** Use Google Artifact Registry auth helper:
```bash
npx -y google-artifactregistry-auth
```

**Option C:** Copy `.npmrc` from `.npm/` directory in builder stage (Dockerfile):
```dockerfile
COPY .npm/npmrc ./.npmrc
```

---

### 4. Old NPM Version Error (Node 12)

**Symptom:**
```bash
npm does not support Node.js v12.22.12
```

**Solution:** Switch to Node 20:
```bash
source ~/.nvm/nvm.sh
nvm use 20
```

---

### 5. Bun Lockfile Conflicts

**Symptom:** Merge conflicts in `bun.lock` or `yarn.lock`

**Solution:**
```bash
# Regenerate lockfiles
rm bun.lock yarn.lock
bun install --yarn

# Commit updated lockfiles
git add bun.lock yarn.lock
git commit -m "chore: regenerate lockfiles"
```

---

### 6. Module Federation Remotes Not Loading

**Symptom:** Console error: `Shared module is not available for eager consumption`

**Solution (Rspack 2.0+):** 

Use `@module-federation/enhanced` instead of `rspack.container.ModuleFederationPlugin`:

```javascript
// rspack.config.js
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');

plugins: [
  new ModuleFederationPlugin({
    name: 'myApp',
    filename: 'remoteEntry.js',
    shared: {
      react: { singleton: true, eager: false, strictVersion: false },
      'react-dom': { singleton: true, eager: false, strictVersion: false }
    }
  })
]
```

**For Rspack 1.x (legacy):**
```javascript
new rspack.container.ModuleFederationPlugin({
  name: 'myApp',
  filename: 'remoteEntry.js',
  shared: {
    react: { singleton: true, eager: false },
    'react-dom': { singleton: true, eager: false }
  }
})
```

---

### 7. Docker Build Fails on COPY

**Symptom:**
```
COPY failed: file not found in build context
```

**Solution:** Ensure files exist before COPY:
```dockerfile
# Check if config files exist, copy only if present
COPY package.json bun.lock ./
COPY --chown=node:node rspack.config.js* ./
```

Or use `.dockerignore` to exclude unnecessary files:
```
# .dockerignore
node_modules
dist
.git
.env*
```

---

### 8. Environment Variables Not Applied in Production Build ⚠️ CRITICAL

**Symptom:**
- Build succeeds but production deployment uses development values
- Environment variables from CI/CD are ignored
- `BFF_URL`, `LOGIN_URL`, etc. point to dev instead of prod
- `process.env.X` returns `undefined` in bundled code

**Root Cause:**

This happens when `DefinePlugin` uses **individual property definitions** instead of **object replacement**, combined with **dynamic access** to `process.env[key]` in the code.

**Why it fails:**

```javascript
// ❌ PROBLEMATIC: Individual properties (Rspack 2.0 default)
new rspack.DefinePlugin({
  'process.env.BFF_URL': JSON.stringify('https://prod.com'),
  'process.env.APP_NAME': JSON.stringify('myApp')
})

// Your code uses dynamic access:
const parseEnvValue = (key, config) => {
  const value = process.env[key];  // ❌ NOT replaced by DefinePlugin
  //            ^^^^^^^^^^^^^^^^
  // DefinePlugin only replaces LITERAL "process.env.BFF_URL"
  // but NOT dynamic access with variable [key]
}
```

**Solution:**

Use **object replacement** format in `rspack.config.js`:

```javascript
// ✅ CORRECT: Object replacement (works with dynamic access)
new rspack.DefinePlugin({
  'process.env': JSON.stringify({
    BFF_URL: process.env.BFF_URL ?? 'https://dev.com',
    APP_NAME: process.env.APP_NAME ?? 'myApp',
    // ... all other variables
  })
})
```

**Complete fix in rspack.config.js:**

```javascript
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');
const Environment = require('./src/constants/environment.config.js');

plugins: [
  // Add ProvidePlugin for Rspack 2.0+ (fixes "process is not defined")
  new rspack.ProvidePlugin({
    process: require.resolve('process/browser'),
  }),
  
  // DefinePlugin with OBJECT format (enables dynamic access)
  new rspack.DefinePlugin({
    'process.env': JSON.stringify(
      Object.keys(Environment.defaults).reduce((acc, key) => {
        acc[key] = process.env[key] ?? Environment.defaults[key];
        return acc;
      }, {})
    )
  }),
  
  new ModuleFederationPlugin(mfConfig),
  // ...
]
```

**Required dependency:**

Add to `package.json` dependencies (not devDependencies):
```json
{
  "dependencies": {
    "process": "^0.11.10"
  }
}
```

**How to verify:**

1. Set custom env var: `BFF_URL="https://test.com" bun run build`
2. Check build logs for: `🔹 BFF_URL: https://test.com (from ENV)`
3. Inspect bundled code: should contain the actual value, not `undefined`

**Related Issues:**
- Commit `e95a59b` introduced this bug by switching to individual properties
- Fixed in version 1.1.25 by reverting to object format
- See: [Rspack DefinePlugin docs](https://rspack.dev/config/plugins#defineplugin)

---

### 9. `process is not defined` Error in Browser (Rspack 2.0+)

**Symptom:**
```
Uncaught ReferenceError: process is not defined
```

**Cause:** Rspack 2.0+ removed automatic Node.js polyfills.

**Solution:**

1. Install `process` package:
```bash
bun add process
```

2. Add `ProvidePlugin` in `rspack.config.js`:
```javascript
new rspack.ProvidePlugin({
  process: require.resolve('process/browser'),
})
```

---

## Validation Checklist

Before creating PR, verify:

### Local Environment
- [ ] `bun -v` returns version >= 1.2.x
- [ ] `bun.lock` exists and is tracked in git
- [ ] `yarn.lock` exists (if CI requires it) and is tracked
- [ ] `.gitignore` contains `package-json.lock`
- [ ] `package.json` scripts use `bun run` (not `npm run` or `yarn run`)
- [ ] `test:coverage` script exists (if CI uses it)

### Environment Variables (CRITICAL)
- [ ] `.env.development` exists with all required variables
- [ ] `.env.production` exists with all required variables
- [ ] `.env.local.example` created as template
- [ ] `src/constants/environment.config.js` exists (CommonJS)
- [ ] `src/constants/environment.config.ts` exists (TypeScript wrapper)
- [ ] `module-federation.config.js` exists and uses Environment
- [ ] `rspack.config.js` loads variables with dotenv
- [ ] `rspack.config.js` shows logging output on build
- [ ] `src/types/env.d.ts` has all environment variables declared
- [ ] Variables can be accessed via `import Environment from '@core/constants/environment.config'`
- [ ] Build shows "✅ .env file loaded successfully" message

### Build & Development
- [ ] `bun install --yarn` completes successfully
- [ ] `bun run start` starts dev server without errors
- [ ] `bun run build` creates production bundle
- [ ] HMR (Hot Module Replacement) works in dev mode
- [ ] Module Federation remotes load correctly
- [ ] Environment variables log correctly on startup

### CI/CD
- [ ] CI commands use `npx -y bun@<version>` format
- [ ] No command chaining with `&&` in template fields
- [ ] Node version in CI is 20+
- [ ] Environment variables set in CI/CD settings (override .env files)
- [ ] Test pipeline passes in feature branch

### Docker
- [ ] Dockerfile uses multi-stage build (builder + nginx)
- [ ] Builder stage installs Bun with `npm install -g bun@<version>`
- [ ] `bun install --frozen-lockfile` in builder stage
- [ ] Only `dist/` copied to nginx stage (not dev dependencies)
- [ ] `docker build` succeeds
- [ ] `docker run` serves app correctly on port 80

### Documentation
- [ ] README updated with Bun commands
- [ ] README includes `bun install --yarn` workflow
- [ ] README documents `bun add <package>` for adding dependencies
- [ ] Documentation about environment variables usage added
- [ ] Migration notes added to CHANGELOG.md (optional)

### Git & PR
- [ ] Feature branch created from latest `develop`
- [ ] All changes committed with descriptive message
- [ ] Branch pushed to origin with `-u` flag
- [ ] PR created with summary of changes
- [ ] PR includes performance comparison (before/after)
- [ ] PR includes testing checklist

---

## Expected Output

After completing this skill, you should have:

1. **Updated package.json** with Bun-compatible scripts
2. **Lockfiles:** `bun.lock` and `yarn.lock` (both tracked)
3. **Updated .gitignore** with `package-json.lock`
4. **Environment variables system:**
   - `.env.development` and `.env.production`
   - `src/constants/environment.config.js` (CommonJS)
   - `src/constants/environment.config.ts` (TypeScript)
   - `module-federation.config.js`
   - Updated `rspack.config.js` with proper env loading
   - `src/types/env.d.ts` with type declarations
5. **CI/CD configuration** using `npx bun` commands
6. **Multi-stage Dockerfile** with Bun + Nginx
7. **Updated README** with Bun development instructions
8. **Feature branch** with all changes
9. **Pull Request** with migration summary and performance metrics

**Performance gains (typical):**
- **Local builds:** 5-10x faster (Webpack 45s → Rspack 8s)
- **CI builds:** 4-6x faster (3m 20s → 45s)
- **Dependency installs:** 15-20x faster (npm 1m 15s → bun 4s)
- **Docker image size:** 10-30% smaller (multi-stage build)

---

## Next Steps After Merge

1. **Monitor CI/CD:** Ensure builds pass consistently
2. **Update other MFEs:** Apply same migration to other microfrontends
3. **Update team docs:** Share migration guide with team
4. **Optimize further:** Consider Bun test runner (experimental)
5. **Track metrics:** Monitor build times, bundle sizes over time

---

## References

- [Bun Documentation](https://bun.sh/docs)
- [Bun in CI/CD](https://bun.sh/docs/install/ci)
- [Rspack Documentation](https://rspack.dev)
- [Rspack Migration Guide](https://rspack.dev/guide/migration/webpack)
- [Module Federation](https://module-federation.io)
- [Webpack to Rspack Skill](file://~/.agents/skills/webpack-to-rspack/SKILL.md)

---

## Skill Execution Flow

When this skill is invoked:

1. **Verify environment** - Check Node 20 + Bun installation
2. **Analyze repository** - Identify current setup (Webpack/npm/yarn)
3. **Plan migration** - Create checklist based on project complexity
4. **Update package.json** - Migrate scripts to Bun
5. **Generate lockfiles** - Create `bun.lock` and `yarn.lock`
6. **Update .gitignore** - Ensure correct files tracked
7. **Setup environment variables** - Create standard env files structure (Phase 6)
8. **Migrate CI/CD** - Update pipeline to use `npx bun`
9. **Create Dockerfile** - Multi-stage build with Bun + Nginx
10. **Update documentation** - README with Bun instructions
11. **Test locally** - Verify dev and prod builds work
12. **Create feature branch** - Commit and push changes
13. **Create PR** - With detailed summary and performance metrics
14. **Provide troubleshooting** - List common issues and solutions

**Always prioritize:**
- ✅ **Standard environment variables pattern** (Phase 6 - CRITICAL)
- ✅ Reproducible builds (`--frozen-lockfile`)
- ✅ CI/CD compatibility (`npx bun` not `bun`)
- ✅ Clear documentation (README updates)
- ✅ Performance validation (before/after metrics)
- ✅ Production readiness (Docker multi-stage build)

---

## Environment Variables Pattern Summary

**ALWAYS use this pattern for Rspack projects:**

### File Structure (Required)
```
.env.development              # Dev variables
.env.production              # Prod variables (UAT by default)
.env.local.example           # Template
module-federation.config.js  # MF config
src/constants/
  ├── environment.config.js  # CommonJS logic
  └── environment.config.ts  # TypeScript wrapper
src/types/env.d.ts          # Type declarations
```

### Priority System
```
CI/CD Variables > .env.${NODE_ENV} > ENV_CONFIG defaults
```

### Usage Pattern
```typescript
// ✅ RECOMMENDED
import Environment from '@core/constants/environment.config';
console.log(Environment.appUrl);        // camelCase, typed
console.log(Environment.isDevelopment); // boolean helpers

// ✅ ALTERNATIVE
import { ENV } from '@core/constants/environment.config';
console.log(ENV.APP_URL);         // UPPER_CASE
console.log(ENV.isDevelopment);   // boolean helpers
```

### Validation
Build output MUST show:
```
✅ .env file exists: true
✅ .env file loaded successfully
```

This pattern ensures:
- ✅ Type safety in TypeScript
- ✅ Centralized configuration
- ✅ CI/CD compatibility
- ✅ CommonJS/ESM interop
- ✅ Clear debugging logs
- ✅ Consistent across all microfrontends
