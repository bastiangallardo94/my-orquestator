# Webpack to Rspack Migration Skill

**Description:** Migrate JavaScript/TypeScript projects from Webpack to Rspack with optimized build performance. Use when asked to "migrate to rspack", "replace webpack with rspack", "upgrade to rspack", "switch bundler to rspack", or "optimize build with rspack".

**Triggers:**
- "migrate from webpack to rspack"
- "replace webpack"
- "convert to rspack"
- "upgrade bundler"
- "optimize build performance"
- "faster builds"

---

## Overview

Rspack is a high-performance JavaScript bundler written in Rust, designed as a drop-in replacement for Webpack with significantly faster build times. This skill guides you through migrating existing Webpack projects to Rspack while maintaining feature parity.

## Key Benefits of Rspack

- **5-10x faster build times** compared to Webpack
- **Built-in SWC compiler** (no need for babel-loader for most cases)
- **Compatible with Webpack ecosystem** (most loaders and plugins work)
- **Lower memory consumption**
- **Full Module Federation support**

---

## Migration Workflow

### Phase 1: Analysis & Preparation

1. **Identify Current Webpack Setup**
   - Read `webpack.config.js`
   - Analyze loaders, plugins, and configurations
   - Check for custom Webpack plugins that may need alternatives
   - Document environment variable handling (dotenv-webpack, DefinePlugin)

2. **Analyze Dependencies**
   - Identify Webpack-specific dependencies in `package.json`
   - List loaders (babel-loader, css-loader, style-loader, etc.)
   - List plugins (HtmlWebpackPlugin, ModuleFederationPlugin, etc.)
   - Check for TypeScript configuration

3. **Check Compatibility**
   - ✅ Module Federation - Fully supported
   - ✅ CSS/SASS - Fully supported
   - ✅ TypeScript - Use builtin:swc-loader (faster than babel)
   - ✅ Asset modules - Native support
   - ⚠️ Some custom Webpack plugins may need Rspack equivalents

### Phase 2: Package Installation

#### Remove Webpack Dependencies
```bash
npm uninstall webpack webpack-cli webpack-dev-server \
  babel-loader \
  dotenv-webpack \
  html-webpack-plugin \
  @types/webpack \
  @types/webpack-dev-server
```

#### Install Rspack Dependencies
```bash
npm install --save-dev \
  @rspack/core@^1.7.11 \
  @rspack/cli@^1.7.11 \
  @rspack/plugin-react-refresh@^2.0.0
```

#### Additional Dependencies (if needed)
```bash
# For SASS support
npm install --save-dev sass-embedded@^1.99.0 sass-loader@^16.0.7

# For cross-platform env vars
npm install --save-dev cross-env@^7.0.3

# For environment variables
npm install dotenv@^17.4.2
```

### Phase 3: Configuration Migration

#### 1. Create `rspack.config.js`

**Key Differences from Webpack:**

| Webpack | Rspack | Notes |
|---------|--------|-------|
| `babel-loader` | `builtin:swc-loader` | Built-in, faster, no Babel needed for TS/JSX |
| `dotenv-webpack` | `dotenv` + `DefinePlugin` | Use dotenv.config() + rspack.DefinePlugin |
| `HtmlWebpackPlugin` | `rspack.HtmlRspackPlugin` | Built-in plugin |
| `ModuleFederationPlugin` | `rspack.container.ModuleFederationPlugin` | Built-in, same API |
| `devtool: 'source-map'` | `SourceMapDevToolPlugin` | More control over sourcemaps |

#### 2. Basic Rspack Config Template

```javascript
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env file based on NODE_ENV
const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath, override: false });

const { rspack } = require('@rspack/core');
const { defineConfig } = require('@rspack/cli');

const Environment = require('./src/constants/environment.config');
const { mfConfig } = require('./module-federation.config.js');

const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];
const mode = process.env.NODE_ENV || "development";
const isDev = mode === 'development';

module.exports = async () => {
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
    devtool: false, // Use SourceMapDevToolPlugin instead
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        '@context': path.resolve(__dirname, 'src/context'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@types': path.resolve(__dirname, 'src/types')
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
        // ESM modules
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: { fullySpecified: false }
        },
        // CSS
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
          type: 'javascript/auto'
        },
        // SASS/SCSS
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern-compiler',
                implementation: require.resolve('sass-embedded')
              }
            }
          ],
          type: 'javascript/auto'
        },
        // Images
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource'
        },
        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: 'fonts/[hash][ext][query]' }
        },
        // TypeScript (.ts) - Use builtin:swc-loader instead of babel
        {
          test: /\.(j|t)s$/,
          exclude: /node_modules/,
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: { syntax: 'typescript' },
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
        },
        // TypeScript with JSX (.tsx)
        {
          test: /\.(j|t)sx$/,
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
                  // For Emotion (Material UI v7)
                  importSource: '@emotion/react'
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
      // DefinePlugin for environment variables
      new rspack.DefinePlugin({
        'process.env': JSON.stringify(
          Object.keys(Environment.defaults).reduce((acc, key) => {
            acc[key] = process.env[key] ?? Environment.defaults[key];
            return acc;
          }, {})
        )
      }),
      // Module Federation
      new rspack.container.ModuleFederationPlugin(mfConfig),
      // HTML Plugin
      new rspack.HtmlRspackPlugin({ template: './src/index.html' }),
      // Source Maps (production only)
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

#### 3. Module Federation Config (Separate File)

Create `module-federation.config.js`:

```javascript
const deps = require('./package.json').dependencies;
const Environment = require('./src/constants/environment.config').default;

const getVersion = (versionString) => {
  if (!versionString) return false;
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
  shared: {
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
    '@mui/material': { 
      singleton: true,
      requiredVersion: getVersion(deps['@mui/material']),
      strictVersion: false,
      eager: false
    },
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
    }
  }
};

module.exports = { mfConfig };
```

#### 4. Environment Configuration

Create `src/constants/environment.config.js`:

```javascript
const ENV_CONFIG = {
  APP_NAME: { default: "myApp", type: "string" },
  APP_PORT: { default: 8500, type: "number" },
  APP_URL: { default: "http://localhost:8500/", type: "string" },
  APP_PATH: { default: "/app-path", type: "string" },
  BFF_URL: { default: "https://dev.example.com/bff", type: "string" },
  LOGIN_URL: { default: "https://dev.example.com/login", type: "string" },
  AUTHENTICATION_APP: { default: "authentication@http://localhost:3001/remoteEntry.js", type: "string" },
  APP_DEV: { default: true, type: "boolean" },
  IS_PRODUCTION: { default: false, type: "boolean" },
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
    throw new Error(`Environment variable "${key}" not found in ENV_CONFIG`);
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
  appDev: get("APP_DEV"),
  isProduction: get("IS_PRODUCTION"),
  defaults: getDefaults(),
};

module.exports = Environment;
module.exports.default = Environment;
```

### Phase 4: Update package.json Scripts

Replace Webpack commands with Rspack:

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production rspack --mode production",
    "build:dev": "cross-env NODE_ENV=development rspack --mode development",
    "start": "cross-env NODE_ENV=development rspack serve --mode development",
    "dev": "cross-env NODE_ENV=development rspack serve",
    "serve": "cross-env NODE_ENV=production rspack serve",
    "clean": "rm -rf dist",
    "analyze": "cross-env NODE_ENV=production rspack --mode production --analyze"
  }
}
```

### Phase 5: Environment Files

Create `.env.development` and `.env.production` in the project root:

**.env.development:**
```env
APP_NAME=myApp
APP_PORT=8500
APP_URL=http://localhost:8500/
APP_PATH=/app-path
BFF_URL=https://dev.example.com/bff
LOGIN_URL=https://dev.example.com/login
AUTHENTICATION_APP=authentication@http://localhost:3001/remoteEntry.js
APP_DEV=true
IS_PRODUCTION=false
```

**.env.production:**
```env
APP_NAME=myApp
APP_PORT=8500
APP_URL=https://prod.example.com/app/
APP_PATH=/app-path
BFF_URL=https://prod.example.com/bff
LOGIN_URL=https://prod.example.com/login
AUTHENTICATION_APP=authentication@https://prod.example.com/authentication/remoteEntry.js
APP_DEV=false
IS_PRODUCTION=true
```

### Phase 6: Testing & Validation

1. **Test development build:**
   ```bash
   npm run start
   ```

2. **Test production build:**
   ```bash
   npm run build
   ```

3. **Verify:**
   - Hot Module Replacement (HMR) works
   - Module Federation remotes load correctly
   - Environment variables are injected properly
   - TypeScript compilation works
   - CSS/SASS processing works
   - Assets (images, fonts) load correctly
   - Source maps generate correctly

4. **Performance check:**
   - Compare build times (should be 5-10x faster)
   - Check bundle sizes (should be similar or smaller)
   - Verify dev server startup time

### Phase 7: CI/CD Pipeline Migration

After successfully migrating your local build, update your CI/CD pipelines to use Rspack.

#### GitHub Actions

1. **Update Node version** to 18+ in workflow files:
   ```yaml
   - uses: actions/setup-node@v3
     with:
       node-version: '20'  # Rspack recommended
   ```

2. **Update workflow file** (`.github/workflows/Pipeline.yml`):
   ```yaml
   jobs:
     build:
       uses: your-org/templates/.github/workflows/build-node-generic.yml@main
       with:
         container_image: "node:20"
         command_build: "npm run build"  # Same command
   ```

3. **No changes needed** to build commands (still `npm run build`)

#### GitLab CI

1. **Update template reference** in `.gitlab-ci.yml`:
   ```yaml
   include:
     - project: 'your-org/templates'
       file: '.gitlab-ci-template-bun-rspack.yml'  # Changed from webpack
       ref: 'main'
   ```

2. **Update Docker image** to Node 18+:
   ```yaml
   variables:
     CI_LANGUAGE_IMAGE_DOCKER: gcr.io/pipeline-node-sdk:18
   ```

3. **Set environment variables** in CI/CD settings:
   - `NODE_ENV=production`
   - `APP_NAME`, `APP_URL`, `BFF_URL`, etc.

#### Key Points

- ✅ Build commands stay the same (`npm run build`)
- ✅ Environment variable injection works the same
- ✅ Deployment steps unchanged
- ✅ Expect 6-10x faster builds in CI/CD
- ✅ Lower memory usage (~50% less)

#### Template Files

Copy CI/CD templates from skill:
```bash
# GitHub Actions
cp ~/.agents/skills/webpack-to-rspack/templates/.github/workflows/Pipeline.yml \
   .github/workflows/Pipeline.yml

# GitLab CI
cp ~/.agents/skills/webpack-to-rspack/templates/.gitlab-ci.yml \
   .gitlab-ci.yml
```

**For detailed CI/CD migration guide, see:** [CICD_MIGRATION.md](./CICD_MIGRATION.md)

---

## Common Migration Issues & Solutions

### Issue 1: Babel Configuration Not Working

**Problem:** `.babelrc` or `babel.config.js` is ignored

**Solution:** Rspack uses SWC by default. Most Babel transforms are not needed:
- ✅ TypeScript: Built-in via `builtin:swc-loader`
- ✅ JSX: Built-in via `builtin:swc-loader`
- ✅ Modern JS: Built-in via `env.targets`
- ⚠️ Custom Babel plugins: May need SWC equivalents or keep babel-loader

If you need Babel for specific plugins:
```javascript
{
  test: /\.(j|t)sx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-react', '@babel/preset-typescript']
    }
  }
}
```

### Issue 2: Environment Variables Not Loading

**Problem:** `dotenv-webpack` plugin replaced, variables undefined

**Solution:** Use native `dotenv` + `rspack.DefinePlugin`:
```javascript
const dotenv = require('dotenv');
dotenv.config({ path: '.env.production', override: false });

new rspack.DefinePlugin({
  'process.env': JSON.stringify(process.env)
})
```

### Issue 3: CSS/SASS Not Processing

**Problem:** Styles not loading or Tailwind not working

**Solution:** Ensure correct loader order and `type: 'javascript/auto'`:
```javascript
{
  test: /\.css$/i,
  use: ['style-loader', 'css-loader', 'postcss-loader'],
  type: 'javascript/auto'
}
```

### Issue 4: Module Federation Remote Not Loading

**Problem:** Remote entry fails to load or version mismatch

**Solution:** 
- Ensure `publicPath: 'auto'` in output config
- Verify remote URL is accessible
- Check shared dependencies versions match
- Use `strictVersion: false` for flexibility

### Issue 5: Source Maps Not Generating

**Problem:** `devtool: 'source-map'` not working in production

**Solution:** Use `SourceMapDevToolPlugin`:
```javascript
new rspack.SourceMapDevToolPlugin({
  noSources: false,
  filename: '../dist_sourcemaps/[file].map'
})
```

### Issue 6: HMR/Fast Refresh Not Working

**Problem:** Changes require full page reload

**Solution:** Install and configure React Refresh plugin:
```javascript
const { ReactRefreshRspackPlugin } = await import('@rspack/plugin-react-refresh');

plugins: [
  isDev ? new ReactRefreshRspackPlugin() : null
]
```

---

## Migration Checklist

### Pre-Migration
- [ ] Backup current webpack.config.js
- [ ] Document current build times for comparison
- [ ] List all custom Webpack plugins used
- [ ] Identify environment variable usage
- [ ] Review Module Federation setup (if applicable)

### Installation
- [ ] Uninstall Webpack packages
- [ ] Install Rspack core packages
- [ ] Install React Refresh plugin
- [ ] Install SASS loader (if needed)
- [ ] Install cross-env for scripts

### Configuration
- [ ] Create rspack.config.js
- [ ] Create module-federation.config.js (if using MF)
- [ ] Create environment.config.js
- [ ] Create .env.development
- [ ] Create .env.production
- [ ] Update package.json scripts
- [ ] Configure builtin:swc-loader for TS/JSX
- [ ] Configure CSS/SASS loaders
- [ ] Configure asset modules
- [ ] Set up DefinePlugin for env vars
- [ ] Configure HtmlRspackPlugin
- [ ] Set up SourceMapDevToolPlugin

### Testing
- [ ] Test development build (`npm run start`)
- [ ] Test production build (`npm run build`)
- [ ] Verify HMR works
- [ ] Verify Module Federation works
- [ ] Verify environment variables inject correctly
- [ ] Check bundle sizes
- [ ] Verify source maps generate
- [ ] Test in target browsers

### Performance Validation
- [ ] Measure build time improvement
- [ ] Measure dev server startup time
- [ ] Compare bundle sizes
- [ ] Test application runtime performance
- [ ] Verify memory usage

### CI/CD Pipeline Migration
- [ ] Update GitHub Actions workflows (if applicable)
  - [ ] Update Node version to 18+
  - [ ] Verify build commands
  - [ ] Test in feature branch
- [ ] Update GitLab CI configuration (if applicable)
  - [ ] Change template to Rspack version
  - [ ] Update Docker image to Node 18+
  - [ ] Set environment variables
  - [ ] Test in feature branch
- [ ] Verify environment variables in CI/CD
- [ ] Test build in CI/CD environment
- [ ] Measure CI/CD build time improvement
- [ ] Update deployment scripts (if needed)

### Documentation
- [ ] Document migration changes
- [ ] Update team documentation
- [ ] Update CI/CD pipeline documentation
- [ ] Update deployment scripts
- [ ] Document new build times and performance gains

---

## Advanced Patterns

### Custom Environment Variable Logging

Add debugging for environment variables:

```javascript
console.log('\n=========================================');
console.log('🔍 RSPACK ENV VARIABLES DEBUG');
console.log('=========================================');
console.log(`📂 Environment: ${process.env.NODE_ENV}`);
console.log(`📄 .env file path: ${envPath}`);
console.log(`✅ .env file exists: ${fs.existsSync(envPath)}`);

const dotenvResult = dotenv.config({ path: envPath, override: false });

if (!dotenvResult.error) {
  console.log('📋 Variables loaded from .env:');
  Object.keys(dotenvResult.parsed || {}).forEach(key => {
    console.log(`  - ${key}: ${dotenvResult.parsed[key]}`);
  });
}
console.log('=========================================\n');
```

### Multi-Environment Support

Support multiple environments (dev, uat, prod):

```javascript
const environments = {
  development: '.env.development',
  uat: '.env.uat',
  production: '.env.production'
};

const envFile = environments[process.env.NODE_ENV] || environments.development;
const envPath = path.join(__dirname, envFile);
```

### Conditional Plugin Loading

Load plugins based on environment:

```javascript
plugins: [
  isDev ? new ReactRefreshRspackPlugin() : null,
  isProduction ? new BundleAnalyzerPlugin() : null,
  new rspack.DefinePlugin({ /* ... */ }),
  // ... other plugins
].filter(Boolean)
```

---

## Performance Optimization Tips

1. **Use builtin:swc-loader instead of babel-loader**
   - 10-20x faster TypeScript compilation
   - No need for separate transpilation

2. **Enable minimize in production**
   ```javascript
   optimization: {
     minimize: true,
     removeAvailableModules: true
   }
   ```

3. **Use proper browser targets**
   ```javascript
   env: { 
     targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'] 
   }
   ```

4. **Optimize Module Federation shared dependencies**
   - Use `eager: true` for critical dependencies
   - Use `singleton: true` for React, Redux
   - Set `strictVersion: false` for flexibility

5. **Configure proper dev server settings**
   ```javascript
   devServer: {
     hot: true, // Enable HMR
     historyApiFallback: true, // SPA routing
     compress: true // Gzip compression
   }
   ```

---

## References

- [Rspack Official Documentation](https://rspack.dev)
- [Webpack to Rspack Migration Guide](https://rspack.dev/guide/migration/webpack)
- [SWC Documentation](https://swc.rs)
- [Module Federation Docs](https://module-federation.io)

---

## Skill Execution Flow

When this skill is invoked:

1. **Analyze** the current Webpack configuration
2. **Plan** the migration steps based on project complexity
3. **Install** required Rspack packages
4. **Create** rspack.config.js with equivalent configuration
5. **Update** package.json scripts
6. **Create** environment files (.env.development, .env.production)
7. **Test** development and production builds
8. **Validate** that all features work correctly
9. **Measure** performance improvements
10. **Document** changes and provide migration summary

Always prioritize:
- Feature parity with existing Webpack setup
- Performance optimization
- Developer experience (HMR, fast rebuilds)
- Clear error messages and debugging
- Production readiness
