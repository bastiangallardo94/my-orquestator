# Rspack Environment Configuration Skill

**Version:** 1.0.0  
**Status:** Production Ready

## Overview

This skill provides a comprehensive, production-tested pattern for managing environment variables in Rspack projects with:

- ✅ **Type-safe environment variables** (TypeScript + JSDoc)
- ✅ **CommonJS/ES Module compatibility** (works in build configs and app code)
- ✅ **Multi-environment support** (.env files per environment)
- ✅ **Automatic type conversion** (string, number, boolean)
- ✅ **Build-time injection** via DefinePlugin
- ✅ **Module Federation ready**
- ✅ **Validation and error handling**

---

## When to Use This Skill

Use this skill when you need to:

- Set up environment configuration for a new Rspack project
- Migrate from webpack environment config to Rspack
- Centralize scattered environment variables
- Add type safety to environment variables
- Configure Module Federation with environment-based URLs
- Support multiple environments (dev, staging, production)
- Fix CommonJS/ES Module compatibility issues

---

## Architecture

### Two-File System

The pattern uses **two files working together**:

1. **`src/constants/environment.config.js`** (CommonJS)
   - Pure JavaScript, no TypeScript syntax
   - Contains all environment logic
   - Used by build configuration files (rspack.config.js, module-federation.config.js)
   - Exports via `module.exports`

2. **`src/constants/environment.config.ts`** (TypeScript Wrapper)
   - Imports and re-exports from `.js` file
   - Adds TypeScript types and interfaces
   - Used by application code (.ts, .tsx files)
   - Provides type safety and autocomplete

### Why Two Files?

**Problem:** Build config files (`.js`) can't directly import TypeScript (`.ts`) files without transpilation.

**Solution:** Keep logic in `.js`, wrap with types in `.ts`.

---

## Core Concepts

### 1. ENV_CONFIG Schema

Define all environment variables with types and defaults:

```javascript
const ENV_CONFIG = {
  APP_NAME: { default: 'myApp', type: 'string' },
  APP_PORT: { default: 3000, type: 'number' },
  IS_PRODUCTION: { default: false, type: 'boolean' },
};
```

### 2. Type Parsing

Automatic conversion from string (process.env) to typed values:

```javascript
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
```

### 3. Getter with Validation

Safe access to environment variables:

```javascript
const get = (key) => {
  if (!(key in ENV_CONFIG)) {
    throw new Error(`Environment variable "${key}" not found`);
  }
  return parseEnvValue(key, ENV_CONFIG[key]);
};
```

### 4. Environment Object Export

```javascript
const Environment = {
  appName: get('APP_NAME'),
  appPort: get('APP_PORT'),
  isProduction: get('IS_PRODUCTION'),
  isDevelopment: !get('IS_PRODUCTION'),
  defaults: getDefaults(),
};

module.exports = Environment;
module.exports.default = Environment;
```

---

## File Structure

```
project/
├── src/
│   └── constants/
│       ├── environment.config.js    ← CommonJS implementation
│       └── environment.config.ts    ← TypeScript wrapper
├── .env.development                 ← Dev environment vars
├── .env.production                  ← Production environment vars
├── .env.example                     ← Template for team
├── rspack.config.js                 ← Imports .js file
└── module-federation.config.js      ← Imports .js file
```

---

## Step-by-Step Implementation

### Step 1: Create environment.config.js

See template: `templates/environment.config.js`

Key sections:
- ENV_CONFIG schema definition
- parseEnvValue function
- get() function with validation
- getDefaults() for build-time injection
- Environment object construction
- CommonJS exports

### Step 2: Create environment.config.ts

See template: `templates/environment.config.ts`

Key sections:
- Import from .js file
- IEnvironment interface
- ENV object (UPPER_CASE naming)
- Type-safe exports

### Step 3: Create .env Files

**`.env.development`:**
```bash
APP_PORT=3000
APP_URL=http://localhost:3000/
IS_PRODUCTION=false
```

**`.env.production`:**
```bash
APP_PORT=8080
APP_URL=https://app.example.com/
IS_PRODUCTION=true
```

### Step 4: Update rspack.config.js

```javascript
const dotenv = require('dotenv');
const path = require('path');
const { rspack } = require('@rspack/core');

// Load .env file based on NODE_ENV
const envPath = path.join(
  __dirname,
  `.env.${process.env.NODE_ENV || 'development'}`
);

dotenv.config({ path: envPath, override: false });

const Environment = require('./src/constants/environment.config.js');

module.exports = {
  // ... other config
  
  devServer: {
    port: Environment.appPort,
    // ...
  },
  
  plugins: [
    // Inject environment variables at build time
    new rspack.DefinePlugin({
      'process.env': JSON.stringify(Environment.defaults),
    }),
    
    // Module Federation with environment-based URLs
    new rspack.container.ModuleFederationPlugin({
      name: Environment.appName,
      remotes: {
        auth: Environment.authRemoteUrl,
      },
      // ...
    }),
  ],
};
```

### Step 5: Update module-federation.config.js

```javascript
const Environment = require('./src/constants/environment.config.js').default;

const mfConfig = {
  name: Environment.appName,
  remotes: {
    authentication: Environment.authenticationApp,
  },
  // ...
};

module.exports = { mfConfig };
```

### Step 6: Use in Application Code

```typescript
// TypeScript/TSX files
import { ENV } from '@/constants/environment.config';

// Type-safe access with autocomplete
const apiUrl = ENV.API_BASE_URL;
const isDev = ENV.isDevelopment;

// Or use default export
import Environment from '@/constants/environment.config';

const port = Environment.appPort; // number type
```

---

## Best Practices

### ✅ DO

1. **Always define defaults** - Never leave config without fallback
2. **Use semantic names** - `APP_PORT` not `PORT1`
3. **Group related vars** - Add comments to organize sections
4. **Document required vars** - Use .env.example
5. **Validate on startup** - Throw errors for missing critical vars
6. **Use type-specific parsing** - Boolean from string, number from string
7. **Keep .js file pure** - No TypeScript syntax in .js file
8. **Export both formats** - camelCase and UPPER_CASE

### ❌ DON'T

1. **Don't commit secrets** - Use .env.local for sensitive data
2. **Don't use process.env directly** - Always go through Environment object
3. **Don't mix responsibilities** - Keep build config separate from app config
4. **Don't hardcode in multiple places** - Single source of truth
5. **Don't assume types** - Always parse from string
6. **Don't skip validation** - Throw errors for missing required vars
7. **Don't import .ts from .js** - Will fail at runtime

---

## Common Patterns

### Pattern 1: Computed Properties

```javascript
const Environment = {
  appName: get('APP_NAME'),
  appPort: get('APP_PORT'),
  appUrl: get('APP_URL'),
  
  // Computed from other values
  isDevelopment: !get('IS_PRODUCTION'),
  isStaging: get('ENV_NAME') === 'staging',
  
  // Combined values
  apiEndpoint: `${get('API_BASE_URL')}/api/v1`,
};
```

### Pattern 2: Conditional Configuration

```javascript
const Environment = {
  // ...
  storeDebug: get('IS_PRODUCTION') ? false : get('STORE_DEBUG'),
  logLevel: get('IS_PRODUCTION') ? 'error' : 'debug',
};
```

### Pattern 3: Feature Flags

```javascript
const ENV_CONFIG = {
  FEATURE_NEW_UI: { default: false, type: 'boolean' },
  FEATURE_BETA_API: { default: false, type: 'boolean' },
  SIDEBAR_ENABLED: { default: true, type: 'boolean' },
};
```

### Pattern 4: Module Federation URLs

```javascript
const ENV_CONFIG = {
  SHELL_APP: { 
    default: 'shell@http://localhost:3000/remoteEntry.js', 
    type: 'string' 
  },
  AUTH_APP: { 
    default: 'auth@http://localhost:3001/remoteEntry.js', 
    type: 'string' 
  },
};
```

---

## Environment File Strategy

### Development (.env.development)
- Local development defaults
- Points to local services
- Debug mode enabled
- Detailed logging

### Staging (.env.staging)
- Staging server URLs
- Production-like settings
- Some debugging enabled
- Test data

### Production (.env.production)
- Production URLs
- Optimized settings
- Minimal logging
- Real data

### Local Overrides (.env.local)
- Never committed to git
- Developer-specific overrides
- Secrets and tokens
- Local testing values

---

## Integration with CI/CD

### Environment Variables Priority

```
1. CI/CD Environment Variables (highest)
2. .env.{environment} file
3. ENV_CONFIG defaults (lowest)
```

### GitHub Actions Example

```yaml
env:
  NODE_ENV: production
  APP_URL: https://app.example.com
  API_BASE_URL: https://api.example.com
  
steps:
  - name: Build
    run: npm run build
```

### GitLab CI Example

```yaml
variables:
  NODE_ENV: "production"
  APP_URL: "https://app.example.com"
  
build:
  script:
    - npm run build
```

---

## Troubleshooting

See `TROUBLESHOOTING.md` for detailed solutions.

### Quick Fixes

**Error: Cannot use import statement outside a module**
- ✅ Make sure build configs import `.js` not `.ts`
- ✅ Check `module.exports` in .js file

**Error: Cannot convert undefined or null to object**
- ✅ Verify `defaults` property exists in Environment object
- ✅ Check `getDefaults()` is called

**Error: process.env.XXX is undefined at runtime**
- ✅ Add DefinePlugin to rspack.config.js
- ✅ Verify .env file is loaded correctly

**TypeScript: Cannot find module**
- ✅ Check import paths use correct extension
- ✅ Verify TypeScript can resolve .js imports

---

## Examples

See `EXAMPLES.md` for complete working examples.

---

## Checklist

Use this checklist when implementing:

- [ ] Created `src/constants/environment.config.js` with ENV_CONFIG schema
- [ ] Created `src/constants/environment.config.ts` TypeScript wrapper
- [ ] Created `.env.development` file
- [ ] Created `.env.production` file
- [ ] Created `.env.example` template
- [ ] Updated `.gitignore` to exclude `.env.local`
- [ ] Updated `rspack.config.js` to load .env files
- [ ] Updated `rspack.config.js` to import from `.js` file
- [ ] Updated `module-federation.config.js` to import from `.js` file
- [ ] Configured DefinePlugin for build-time injection
- [ ] Updated application imports to use new config
- [ ] Tested development build
- [ ] Tested production build
- [ ] Verified TypeScript compilation
- [ ] Documented custom environment variables

---

## Next Steps

After implementing this pattern:

1. **Centralize all environment access** - Replace scattered `process.env` calls
2. **Add validation** - Throw errors on missing critical variables
3. **Document variables** - Keep .env.example up to date
4. **Review security** - Ensure no secrets in version control
5. **Test all environments** - Verify dev, staging, production builds

---

## Related Skills

- `rspack-bun-migration` - Migrate to Rspack + Bun
- `typescript-advanced-types` - Advanced TypeScript patterns
- `nodejs-best-practices` - Node.js configuration best practices

---

**Remember:** Environment configuration is the foundation of your build system. Get it right once, benefit forever.
