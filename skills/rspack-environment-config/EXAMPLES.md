# Examples - Rspack Environment Configuration

Real-world examples and use cases for environment configuration in Rspack projects.

---

## Example 1: Basic Setup

Minimal configuration for a simple React app.

### ENV_CONFIG

```javascript
const ENV_CONFIG = {
  APP_NAME: { default: 'myapp', type: 'string' },
  APP_PORT: { default: 3000, type: 'number' },
  APP_URL: { default: 'http://localhost:3000/', type: 'string' },
  IS_PRODUCTION: { default: false, type: 'boolean' },
};
```

### .env.development

```bash
APP_NAME=myapp-dev
APP_PORT=3000
APP_URL=http://localhost:3000/
IS_PRODUCTION=false
```

### .env.production

```bash
APP_NAME=myapp
APP_PORT=8080
APP_URL=https://myapp.com/
IS_PRODUCTION=true
```

### Usage

```typescript
import { ENV } from '@/constants/environment.config';

console.log(ENV.APP_NAME);       // 'myapp-dev' in dev
console.log(ENV.APP_PORT);       // 3000 (number)
console.log(ENV.IS_PRODUCTION);  // false
```

---

## Example 2: Module Federation Setup

Multi-remote configuration with environment-based URLs.

### ENV_CONFIG

```javascript
const ENV_CONFIG = {
  APP_NAME: { default: 'shell', type: 'string' },
  
  // Shell app
  SHELL_PORT: { default: 3000, type: 'number' },
  SHELL_URL: { default: 'http://localhost:3000/', type: 'string' },
  
  // Remote apps
  AUTH_REMOTE: { 
    default: 'auth@http://localhost:3001/remoteEntry.js', 
    type: 'string' 
  },
  DASHBOARD_REMOTE: { 
    default: 'dashboard@http://localhost:3002/remoteEntry.js', 
    type: 'string' 
  },
  PROFILE_REMOTE: { 
    default: 'profile@http://localhost:3003/remoteEntry.js', 
    type: 'string' 
  },
};
```

### .env.production

```bash
APP_NAME=shell-prod

SHELL_PORT=8080
SHELL_URL=https://app.example.com/

AUTH_REMOTE=auth@https://auth.example.com/remoteEntry.js
DASHBOARD_REMOTE=dashboard@https://dashboard.example.com/remoteEntry.js
PROFILE_REMOTE=profile@https://profile.example.com/remoteEntry.js
```

### module-federation.config.js

```javascript
const Environment = require('./src/constants/environment.config.js');

const mfConfig = {
  name: Environment.appName,
  filename: 'remoteEntry.js',
  remotes: {
    auth: Environment.authRemote,
    dashboard: Environment.dashboardRemote,
    profile: Environment.profileRemote,
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
};

module.exports = { mfConfig };
```

---

## Example 3: Multi-Environment API Configuration

Different API endpoints per environment.

### ENV_CONFIG

```javascript
const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: { 
    default: 'http://localhost:4000/api', 
    type: 'string' 
  },
  API_TIMEOUT: { default: 10000, type: 'number' },
  API_RETRY_ATTEMPTS: { default: 3, type: 'number' },
  
  // Feature Flags
  ENABLE_ANALYTICS: { default: false, type: 'boolean' },
  ENABLE_NEW_UI: { default: false, type: 'boolean' },
  
  // External Services
  SENTRY_DSN: { default: '', type: 'string' },
  GA_TRACKING_ID: { default: '', type: 'string' },
};
```

### .env.development

```bash
API_BASE_URL=http://localhost:4000/api
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=1

ENABLE_ANALYTICS=false
ENABLE_NEW_UI=true

SENTRY_DSN=
GA_TRACKING_ID=
```

### .env.staging

```bash
API_BASE_URL=https://staging-api.example.com/api
API_TIMEOUT=15000
API_RETRY_ATTEMPTS=2

ENABLE_ANALYTICS=true
ENABLE_NEW_UI=true

SENTRY_DSN=https://xxx@sentry.io/staging
GA_TRACKING_ID=UA-XXXXX-STAGING
```

### .env.production

```bash
API_BASE_URL=https://api.example.com/api
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3

ENABLE_ANALYTICS=true
ENABLE_NEW_UI=false

SENTRY_DSN=https://xxx@sentry.io/production
GA_TRACKING_ID=UA-XXXXX-PROD
```

### Usage in API Client

```typescript
import { ENV } from '@/constants/environment.config';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
});

// Retry logic
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    if (!config.retryCount) {
      config.retryCount = 0;
    }
    
    if (config.retryCount < ENV.API_RETRY_ATTEMPTS) {
      config.retryCount += 1;
      return apiClient(config);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Example 4: Feature Flags

Control feature rollout per environment.

### ENV_CONFIG

```javascript
const ENV_CONFIG = {
  // Features
  FEATURE_NEW_DASHBOARD: { default: false, type: 'boolean' },
  FEATURE_DARK_MODE: { default: false, type: 'boolean' },
  FEATURE_NOTIFICATIONS: { default: true, type: 'boolean' },
  FEATURE_BETA_API: { default: false, type: 'boolean' },
  
  // Limits
  MAX_UPLOAD_SIZE_MB: { default: 5, type: 'number' },
  SESSION_TIMEOUT_MINUTES: { default: 30, type: 'number' },
};
```

### Feature Flag Hook

```typescript
import { ENV } from '@/constants/environment.config';

export const useFeatureFlags = () => {
  return {
    newDashboard: ENV.FEATURE_NEW_DASHBOARD,
    darkMode: ENV.FEATURE_DARK_MODE,
    notifications: ENV.FEATURE_NOTIFICATIONS,
    betaApi: ENV.FEATURE_BETA_API,
  };
};
```

### Conditional Rendering

```tsx
import { ENV } from '@/constants/environment.config';

export const Dashboard = () => {
  return (
    <div>
      {ENV.FEATURE_NEW_DASHBOARD ? (
        <NewDashboard />
      ) : (
        <LegacyDashboard />
      )}
    </div>
  );
};
```

---

## Example 5: Computed Properties

Derive values from other environment variables.

### environment.config.js

```javascript
const Environment = {
  // Base values
  appName: get('APP_NAME'),
  appPort: get('APP_PORT'),
  appPath: get('APP_PATH'),
  isProduction: get('IS_PRODUCTION'),
  
  // Computed properties
  isDevelopment: !get('IS_PRODUCTION'),
  isStaging: get('ENV_NAME') === 'staging',
  
  // Constructed URLs
  appUrl: get('IS_PRODUCTION')
    ? `https://${get('APP_DOMAIN')}`
    : `http://localhost:${get('APP_PORT')}/`,
  
  apiUrl: `${get('API_BASE_URL')}/api/v${get('API_VERSION')}`,
  
  // Conditional debug settings
  storeDebug: get('IS_PRODUCTION') ? false : get('STORE_DEBUG'),
  logLevel: get('IS_PRODUCTION') ? 'error' : 'debug',
  
  // Feature detection
  hasAnalytics: Boolean(get('GA_TRACKING_ID')),
  hasSentry: Boolean(get('SENTRY_DSN')),
};
```

---

## Example 6: Monorepo with Shared Config

Share environment config across packages.

### packages/shared/environment.config.js

```javascript
// Shared base configuration
const SHARED_ENV_CONFIG = {
  IS_PRODUCTION: { default: false, type: 'boolean' },
  LOG_LEVEL: { default: 'info', type: 'string' },
  API_BASE_URL: { default: 'http://localhost:4000', type: 'string' },
};

module.exports = { SHARED_ENV_CONFIG };
```

### packages/app1/environment.config.js

```javascript
const { SHARED_ENV_CONFIG } = require('../shared/environment.config');

const ENV_CONFIG = {
  ...SHARED_ENV_CONFIG,
  
  // App-specific config
  APP_NAME: { default: 'app1', type: 'string' },
  APP_PORT: { default: 3001, type: 'number' },
};

// ... rest of the config
```

### packages/app2/environment.config.js

```javascript
const { SHARED_ENV_CONFIG } = require('../shared/environment.config');

const ENV_CONFIG = {
  ...SHARED_ENV_CONFIG,
  
  // App-specific config
  APP_NAME: { default: 'app2', type: 'string' },
  APP_PORT: { default: 3002, type: 'number' },
};

// ... rest of the config
```

---

## Example 7: Dynamic Remote Loading

Load remote apps based on environment.

### ENV_CONFIG

```javascript
const ENV_CONFIG = {
  // Remote URLs
  REMOTE_AUTH_URL: { 
    default: 'http://localhost:3001/remoteEntry.js', 
    type: 'string' 
  },
  REMOTE_DASHBOARD_URL: { 
    default: 'http://localhost:3002/remoteEntry.js', 
    type: 'string' 
  },
  
  // Optional remotes
  REMOTE_ADMIN_URL: { default: '', type: 'string' },
  REMOTE_REPORTS_URL: { default: '', type: 'string' },
};
```

### module-federation.config.js

```javascript
const Environment = require('./src/constants/environment.config.js');

// Build remotes object dynamically
const remotes = {
  auth: `auth@${Environment.remoteAuthUrl}`,
  dashboard: `dashboard@${Environment.remoteDashboardUrl}`,
};

// Add optional remotes if configured
if (Environment.remoteAdminUrl) {
  remotes.admin = `admin@${Environment.remoteAdminUrl}`;
}

if (Environment.remoteReportsUrl) {
  remotes.reports = `reports@${Environment.remoteReportsUrl}`;
}

const mfConfig = {
  name: Environment.appName,
  remotes,
  // ...
};

module.exports = { mfConfig };
```

---

## Example 8: TypeScript Strict Mode

Enforce type safety at compile time.

### environment.config.ts

```typescript
import EnvironmentJS from './environment.config.js';

// Strict interface with no optional properties
export interface IEnvironment {
  readonly appName: string;
  readonly appPort: number;
  readonly appUrl: string;
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
}

// Type guard to ensure all properties exist
function isValidEnvironment(env: any): env is IEnvironment {
  return (
    typeof env.appName === 'string' &&
    typeof env.appPort === 'number' &&
    typeof env.appUrl === 'string' &&
    typeof env.isProduction === 'boolean' &&
    typeof env.isDevelopment === 'boolean'
  );
}

// Validate at runtime
if (!isValidEnvironment(EnvironmentJS)) {
  throw new Error('Invalid environment configuration');
}

const Environment: IEnvironment = EnvironmentJS;

export default Environment;
```

---

## Best Practices from Examples

1. **Always provide defaults** - Never rely on undefined values
2. **Use semantic names** - `API_BASE_URL` not `URL1`
3. **Group related vars** - Keep API config together
4. **Compute when possible** - Derive `isDevelopment` from `isProduction`
5. **Validate types** - Use type guards for critical values
6. **Document in .env.example** - Help team understand required vars
7. **Keep secrets out of code** - Use .env.local for sensitive data
8. **Test all environments** - Verify dev, staging, production builds

---

## Testing Your Configuration

```typescript
// __tests__/environment.config.test.ts
import Environment, { ENV } from '@/constants/environment.config';

describe('Environment Configuration', () => {
  it('should have all required properties', () => {
    expect(Environment.appName).toBeDefined();
    expect(Environment.appPort).toBeTypeOf('number');
    expect(Environment.isProduction).toBeTypeOf('boolean');
  });
  
  it('should provide ENV with UPPER_CASE names', () => {
    expect(ENV.APP_NAME).toBe(Environment.appName);
    expect(ENV.APP_PORT).toBe(Environment.appPort);
  });
  
  it('should compute isDevelopment correctly', () => {
    expect(ENV.isDevelopment).toBe(!ENV.isProduction);
  });
});
```

---

Need more examples? Check the skill templates or create an issue with your use case!
