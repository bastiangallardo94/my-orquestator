# Rspack Environment Configuration

> Production-ready environment variable management for Rspack projects with TypeScript support

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)]()
[![Rspack](https://img.shields.io/badge/Rspack-1.0+-orange.svg)]()

---

## Features

✅ **Type-Safe** - Full TypeScript support with autocomplete  
✅ **Zero Runtime Overhead** - Build-time injection via DefinePlugin  
✅ **Multi-Environment** - Support for dev, staging, production  
✅ **Module Federation Ready** - Environment-based remote URLs  
✅ **Validation Built-in** - Throws errors on missing variables  
✅ **CommonJS/ESM Compatible** - Works in build configs and app code  
✅ **Battle-Tested** - Production-proven pattern  

---

## Quick Start

### 1. Install Dependencies

```bash
npm install dotenv
# or
bun add dotenv
```

### 2. Copy Template Files

Copy from `templates/` directory:

- `environment.config.js` → `src/constants/environment.config.js`
- `environment.config.ts` → `src/constants/environment.config.ts`
- `.env.development` → `.env.development`
- `.env.production` → `.env.production`

### 3. Configure ENV_CONFIG

Edit `src/constants/environment.config.js`:

```javascript
const ENV_CONFIG = {
  APP_NAME: { default: 'myApp', type: 'string' },
  APP_PORT: { default: 3000, type: 'number' },
  IS_PRODUCTION: { default: false, type: 'boolean' },
};
```

### 4. Update rspack.config.js

```javascript
const dotenv = require('dotenv');
const path = require('path');
const { rspack } = require('@rspack/core');

// Load .env file
const envPath = path.join(
  __dirname,
  `.env.${process.env.NODE_ENV || 'development'}`
);
dotenv.config({ path: envPath, override: false });

// Import environment config
const Environment = require('./src/constants/environment.config.js');

module.exports = {
  // Use in config
  devServer: {
    port: Environment.appPort,
  },
  
  plugins: [
    // Inject at build time
    new rspack.DefinePlugin({
      'process.env': JSON.stringify(Environment.defaults),
    }),
  ],
};
```

### 5. Use in Your App

```typescript
import { ENV } from '@/constants/environment.config';

// Typed access with autocomplete
console.log(ENV.APP_NAME);       // string
console.log(ENV.APP_PORT);       // number
console.log(ENV.IS_PRODUCTION);  // boolean
```

---

## Documentation

- **[SKILL.md](SKILL.md)** - Complete guide and best practices
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and decisions  
- **[EXAMPLES.md](EXAMPLES.md)** - Real-world use cases
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and fixes

---

## Why This Pattern?

### The Problem

Most Rspack projects struggle with environment variables:

```typescript
// ❌ Problems:
// - No type safety
// - String instead of proper types
// - Scattered throughout codebase
// - No validation
const port = process.env.PORT || '3000';
const isDev = process.env.NODE_ENV !== 'production';
```

### The Solution

```typescript
// ✅ Benefits:
// - Fully typed
// - Centralized
// - Validated
// - Proper types (number, boolean)
import { ENV } from '@/constants/environment.config';

const port = ENV.APP_PORT;        // number
const isDev = ENV.isDevelopment;  // boolean
```

---

## Architecture

### Two-File System

```
environment.config.js   ← Logic (CommonJS for build configs)
         ↑
         └─── imported by
                ↓
environment.config.ts   ← Types (ES Modules for app code)
```

**Why?** Build configs can't import TypeScript directly, but app code needs types.

---

## Environment Files

```bash
.env.development     # Local development
.env.staging        # Staging environment
.env.production     # Production environment
.env.local          # Local overrides (gitignored)
.env.example        # Template for team
```

### Priority Order

```
CI/CD Variables (highest)
    ↓
.env.{environment}
    ↓
ENV_CONFIG defaults (lowest)
```

---

## Common Use Cases

### Module Federation

```javascript
const ENV_CONFIG = {
  AUTH_REMOTE: { 
    default: 'auth@http://localhost:3001/remoteEntry.js', 
    type: 'string' 
  },
};

// module-federation.config.js
const Environment = require('./src/constants/environment.config.js');

const mfConfig = {
  remotes: {
    auth: Environment.authRemote,
  },
};
```

### Feature Flags

```javascript
const ENV_CONFIG = {
  FEATURE_NEW_UI: { default: false, type: 'boolean' },
  FEATURE_DARK_MODE: { default: true, type: 'boolean' },
};

// In your app
if (ENV.FEATURE_NEW_UI) {
  return <NewUI />;
}
```

### API Configuration

```javascript
const ENV_CONFIG = {
  API_BASE_URL: { default: 'http://localhost:4000/api', type: 'string' },
  API_TIMEOUT: { default: 10000, type: 'number' },
};

// In API client
const client = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
});
```

---

## TypeScript Support

### Full Type Safety

```typescript
import { ENV } from '@/constants/environment.config';

// ✅ TypeScript knows the types
ENV.APP_PORT           // number
ENV.APP_NAME           // string
ENV.IS_PRODUCTION      // boolean

// ✅ Autocomplete works
ENV.  // IDE shows all available variables

// ✅ Compile-time errors
const port: string = ENV.APP_PORT;  // ❌ Error: Type 'number' is not assignable
```

### Custom Interfaces

```typescript
export interface IEnvironment {
  appName: string;
  appPort: number;
  isProduction: boolean;
  // ... all your env vars
}
```

---

## Best Practices

### ✅ DO

- Define all variables in ENV_CONFIG
- Provide sensible defaults
- Use semantic names
- Group related variables
- Keep .env.example updated
- Validate required variables
- Use types (string, number, boolean)

### ❌ DON'T

- Commit secrets to git
- Use process.env directly
- Hardcode values in multiple places
- Skip validation
- Mix build and runtime config
- Forget to document variables

---

## Migration Guide

### From Create React App

```typescript
// Before
process.env.REACT_APP_API_URL

// After
ENV.API_BASE_URL
```

Update `ENV_CONFIG` with `REACT_APP_` prefix variables.

### From webpack

```javascript
// Before: webpack.DefinePlugin
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
});

// After: Rspack with Environment
new rspack.DefinePlugin({
  'process.env': JSON.stringify(Environment.defaults),
});
```

---

## Examples

See [EXAMPLES.md](EXAMPLES.md) for:

- Basic setup
- Module Federation
- Multi-environment APIs
- Feature flags
- Computed properties
- Monorepo setup
- Dynamic remote loading
- TypeScript strict mode

---

## Troubleshooting

Common issues:

- **Cannot use import statement** → Check you're importing `.js` not `.ts` in build configs
- **Environment.defaults is undefined** → Verify `getDefaults()` is called
- **Types don't match** → Check ENV_CONFIG types match interface
- **Variables not updating** → Check priority order and .env file name

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for complete guide.

---

## FAQ

**Q: Why two files (.js and .ts)?**  
A: Build configs can't import TypeScript without transpilation. The `.js` file works everywhere, the `.ts` file adds types for app code.

**Q: Can I use only JavaScript?**  
A: Yes! Just use `environment.config.js`. You'll lose type safety but it works fine.

**Q: How do I add a new environment variable?**  
A: Add to `ENV_CONFIG`, update `.env` files, use in code.

**Q: Do I need DefinePlugin?**  
A: Yes, for build-time optimization and tree-shaking. Without it, you'll have larger bundles.

**Q: Can I use this in a monorepo?**  
A: Yes! Share `environment.config.js` or create per-package configs.

---

## Checklist

- [ ] Installed dotenv
- [ ] Created `environment.config.js`
- [ ] Created `environment.config.ts`
- [ ] Created `.env.development`
- [ ] Created `.env.production`
- [ ] Updated `rspack.config.js`
- [ ] Configured DefinePlugin
- [ ] Updated `.gitignore`
- [ ] Tested development build
- [ ] Tested production build

---

## Related Skills

- **rspack-bun-migration** - Migrate to Rspack + Bun
- **typescript-advanced-types** - Advanced TypeScript patterns
- **nodejs-best-practices** - Node.js configuration

---

## Contributing

Found an issue or have an improvement?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review [EXAMPLES.md](EXAMPLES.md)
3. Read [ARCHITECTURE.md](ARCHITECTURE.md)
4. Open an issue with details

---

## License

MIT - Use freely in your projects!

---

## Support

- 📚 [Full Documentation](SKILL.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 📝 [Examples](EXAMPLES.md)
- 🔧 [Troubleshooting](TROUBLESHOOTING.md)

---

**Remember:** Good environment configuration is the foundation of maintainable applications. Set it up right once, benefit forever!
