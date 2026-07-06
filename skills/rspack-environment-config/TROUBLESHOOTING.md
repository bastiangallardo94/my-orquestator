# Troubleshooting - Rspack Environment Configuration

Common issues and solutions when working with environment variables in Rspack projects.

---

## Build Errors

### Error: Cannot use import statement outside a module

**Symptom:**
```
SyntaxError: Cannot use import statement outside a module
    at Module._compile (node:internal/modules/cjs/loader:1369:14)
```

**Cause:** Build configuration file (`.js`) is trying to import TypeScript file (`.ts`)

**Solution:**
```javascript
// ❌ WRONG
const Environment = require('./src/constants/environment.config.ts');

// ✅ CORRECT
const Environment = require('./src/constants/environment.config.js');
```

**Files to check:**
- `rspack.config.js`
- `module-federation.config.js`
- Any other `.js` configuration files

---

### Error: Cannot convert undefined or null to object

**Symptom:**
```
TypeError: Cannot convert undefined or null to object
    at Function.keys (<anonymous>)
```

**Cause:** `Environment.defaults` is undefined or null

**Solution:** Verify `getDefaults()` is called in environment.config.js:

```javascript
const Environment = {
  // ... all other properties
  defaults: getDefaults(), // ← Make sure this exists
};
```

---

### Error: Environment variable "XXX" not found in ENV_CONFIG

**Symptom:**
```
Error: Environment variable "MY_VAR" not found in ENV_CONFIG. 
Available keys: APP_NAME, APP_PORT, ...
```

**Cause:** Trying to access a variable not defined in ENV_CONFIG

**Solution:** Add the variable to ENV_CONFIG:

```javascript
const ENV_CONFIG = {
  // ... existing config
  MY_VAR: { default: 'defaultValue', type: 'string' },
};
```

---

## Runtime Errors

### Error: process.env.XXX is undefined

**Symptom:** Environment variables are undefined when accessed at runtime

**Cause:** DefinePlugin not configured or .env file not loaded

**Solution 1:** Configure DefinePlugin in rspack.config.js:

```javascript
const { rspack } = require('@rspack/core');

module.exports = {
  plugins: [
    new rspack.DefinePlugin({
      'process.env': JSON.stringify(Environment.defaults),
    }),
  ],
};
```

**Solution 2:** Verify .env file is loaded:

```javascript
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(
  __dirname,
  `.env.${process.env.NODE_ENV || 'development'}`
);

console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath, override: false });

if (result.error) {
  console.error('Error loading .env:', result.error);
}
```

---

### Wrong type returned (string instead of number/boolean)

**Symptom:**
```typescript
Environment.appPort // Returns "3000" (string) instead of 3000 (number)
```

**Cause:** Type not specified correctly or parseEnvValue not working

**Solution:** Check ENV_CONFIG type definition:

```javascript
// ❌ WRONG
APP_PORT: { default: 3000, type: 'string' },

// ✅ CORRECT
APP_PORT: { default: 3000, type: 'number' },
```

Verify parseEnvValue logic:

```javascript
switch (type) {
  case 'boolean':
    return value === 'true'; // ← Returns actual boolean
  case 'number':
    return Number(value);    // ← Returns actual number
  default:
    return value;            // ← Returns string
}
```

---

## TypeScript Errors

### Error: Cannot find module './environment.config'

**Symptom:**
```
TS2307: Cannot find module './environment.config' or its corresponding type declarations.
```

**Cause:** Import path missing `.js` extension

**Solution:**
```typescript
// ❌ WRONG
import Environment from './environment.config';

// ✅ CORRECT (in .ts files importing .js)
import Environment from './environment.config.js';
```

---

### Error: Type 'X' is not assignable to type 'Y'

**Symptom:**
```typescript
Type 'string' is not assignable to type 'number'
```

**Cause:** IEnvironment interface doesn't match actual types

**Solution:** Ensure interface matches ENV_CONFIG:

```typescript
export interface IEnvironment {
  appPort: number;  // ← Must match ENV_CONFIG type
  // not: appPort: string;
}
```

---

## .env File Issues

### .env file not loading

**Symptom:** Environment always uses defaults, never reads from .env

**Cause 1:** Wrong file name

```bash
# ❌ WRONG
.env

# ✅ CORRECT (must include environment)
.env.development
.env.production
```

**Cause 2:** Wrong NODE_ENV value

```bash
# Check current NODE_ENV
echo $NODE_ENV

# Set correctly
export NODE_ENV=development  # or production
npm run dev
```

**Cause 3:** dotenv.config() not called

**Solution:** Add to rspack.config.js:

```javascript
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(
  __dirname,
  `.env.${process.env.NODE_ENV || 'development'}`
);

dotenv.config({ path: envPath, override: false });
```

---

### .env variables not overriding defaults

**Symptom:** Changing .env values has no effect

**Cause:** `override: true` in dotenv.config()

**Solution:**
```javascript
// ❌ WRONG - System env vars won't override file
dotenv.config({ path: envPath, override: true });

// ✅ CORRECT - System env vars have priority
dotenv.config({ path: envPath, override: false });
```

**Priority order (correct):**
1. CI/CD Environment Variables (highest)
2. System environment variables
3. .env file values
4. ENV_CONFIG defaults (lowest)

---

## Module Federation Issues

### Remote URL not updating from environment

**Symptom:** Module Federation always uses default URL

**Cause:** Not using Environment object in module-federation.config.js

**Solution:**

```javascript
// ❌ WRONG - Hardcoded
const mfConfig = {
  remotes: {
    auth: 'auth@http://localhost:3001/remoteEntry.js',
  },
};

// ✅ CORRECT - From Environment
const Environment = require('./src/constants/environment.config.js');

const mfConfig = {
  remotes: {
    auth: Environment.authenticationApp,
  },
};
```

---

## CI/CD Issues

### Build fails in CI but works locally

**Symptom:** `npm run build` works locally but fails in CI

**Cause 1:** Missing .env file in CI

**Solution:** Set environment variables in CI configuration:

**GitHub Actions:**
```yaml
env:
  NODE_ENV: production
  APP_URL: https://app.example.com
  IS_PRODUCTION: true
```

**GitLab CI:**
```yaml
variables:
  NODE_ENV: "production"
  APP_URL: "https://app.example.com"
  IS_PRODUCTION: "true"
```

**Cause 2:** Wrong Node.js version

**Solution:** Specify Node version in CI:

```yaml
# GitHub Actions
- uses: actions/setup-node@v3
  with:
    node-version: '20'

# GitLab CI
image: node:20
```

---

## Debugging Tips

### Enable verbose logging

Add to rspack.config.js:

```javascript
console.log('=========================================');
console.log('🔍 ENVIRONMENT DEBUG');
console.log('=========================================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Environment object:', Environment);
console.log('Defaults:', Environment.defaults);
console.log('=========================================');
```

### Check what's being injected

```javascript
new rspack.DefinePlugin({
  'process.env': JSON.stringify(Environment.defaults),
  // Add this to debug:
  '__DEBUG_ENV__': JSON.stringify({
    defaults: Environment.defaults,
    nodeEnv: process.env.NODE_ENV,
  }),
}),
```

Then in your app:
```typescript
console.log('Injected env:', __DEBUG_ENV__);
```

### Verify .env file contents

```bash
# Check file exists
ls -la .env.*

# View contents
cat .env.development
cat .env.production

# Check for hidden characters
cat -A .env.development
```

---

## Common Mistakes

### 1. Importing .ts from .js file

```javascript
// ❌ WRONG
const Environment = require('./environment.config.ts');

// ✅ CORRECT
const Environment = require('./environment.config.js');
```

### 2. Using process.env directly

```typescript
// ❌ WRONG - No type safety, no defaults
const port = process.env.APP_PORT;

// ✅ CORRECT - Typed, with defaults
import { ENV } from './environment.config';
const port = ENV.APP_PORT;
```

### 3. Forgetting .default for require()

```javascript
// ❌ WRONG - May be undefined
const Environment = require('./environment.config');

// ✅ CORRECT - Explicitly get default export
const Environment = require('./environment.config').default;
// OR
const Environment = require('./environment.config.js');
```

### 4. Not freezing ENV object

```typescript
// ❌ WRONG - Can be mutated
export const ENV = {
  APP_NAME: Environment.appName,
};

// ✅ CORRECT - Immutable
export const ENV = Object.freeze({
  APP_NAME: Environment.appName,
});
```

---

## Getting Help

If you're still stuck:

1. Check file extensions (`.js` vs `.ts`)
2. Verify import paths
3. Check NODE_ENV value
4. Verify .env file name matches NODE_ENV
5. Add console.log() debugging
6. Check rspack build output for warnings
7. Verify TypeScript compilation

Still not working? Create an issue with:
- Error message (full stack trace)
- Your rspack.config.js
- Your environment.config.js
- Your .env file (without secrets)
- Output of `node --version` and `npm list rspack`
