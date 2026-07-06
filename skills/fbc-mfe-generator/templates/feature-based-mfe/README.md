# {{DISPLAY_NAME}}

Feature-based microfrontend generated with fbc-mfe-generator.

## Description

This microfrontend is designed for complex applications with multiple business features. It includes a complete example feature and templates for creating new features quickly.

## Requirements

- Node.js: 22.21.1 (use `nvm use`)
- Bun: >=1.3.14

## Quick Start

```bash
# Use correct Node version
nvm use

# Install dependencies
bun install

# Start development server
bun start

# Open browser
http://localhost:{{APP_PORT}}
```

## Available Scripts

- `bun start` - Start development server
- `bun build` - Build for production
- `bun lint` - Lint code
- `bun lint:fix` - Fix linting issues
- `bun test` - Run tests with coverage
- `bun type-check` - Check TypeScript types

## Project Structure

```
src/
├── core/                      # Core configuration
│   ├── config/               # Auth, app config
│   └── constants/            # Environment, roles, routes
├── context/                   # React Contexts
│   ├── ErrorContext.tsx
│   └── Toast/
├── features/                  # Business features
│   ├── home/                 # Example feature
│   └── _templates/           # ⭐ Templates for new features
│       ├── feature-template/ # Copy this to create features
│       └── README.md         # How to use templates
├── shared/                    # Shared resources
│   ├── components/           # Reusable components
│   │   ├── auth/            # PrivateRoute, ProtectedRoute
│   │   ├── layouts/         # AppLayout
│   │   └── ui/              # UI components
│   ├── hooks/               # Custom hooks
│   ├── i18n/                # Internationalization
│   └── utils/               # Utility functions
└── infrastructure/           # Infrastructure layer
    ├── services/            # HTTP, API clients
    └── store/               # Redux store
```

## Creating New Features

### Quick Method

```bash
# 1. Copy the template
cp -r src/features/_templates/feature-template src/features/dashboard

# 2. Rename files
cd src/features/dashboard
mv ExamplePage.tsx DashboardPage.tsx

# 3. Update component
# Edit DashboardPage.tsx and change component name

# 4. Add route in src/App.tsx
<Route path="/dashboard" element={
  <PrivateRoute>
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  </PrivateRoute>
} />
```

See `src/features/_templates/README.md` for detailed instructions.

## Configuration

### Environment Variables

Edit `src/constants/environment.config.js`:
- `APP_NAME`: {{APP_NAME}}
- `APP_PORT`: {{APP_PORT}}
- `APP_PATH`: {{APP_PATH}}

### Module Federation

This microfrontend:
- **Exposes**: `./App` (consumed by portal)
- **Consumes**: `authentication/App`

Edit `module-federation.config.js` to configure remotes.

## CSS Scoping

All Tailwind utilities use prefix: `{{CSS_PREFIX}}`  
All styles are scoped under: `.{{SCOPE_CLASS}}`

Example:
```tsx
<div className="{{SCOPE_CLASS}} {{CSS_PREFIX}}p-6">
  <h1 className="{{CSS_PREFIX}}text-2xl">Title</h1>
</div>
```

## Internationalization

Supported languages:
- Spanish (es) - Default
- English (en)
- Chinese (zh)

Edit translations in `src/shared/i18n/locales/`

## State Management

Redux Toolkit is configured with:
- **Global Store**: Shared with portal (auth, config, tenant)
- **Local Store**: Feature-specific state

Access with typed hooks:
```typescript
import { useAppSelector, useAppDispatch } from '@infrastructure/store/hooks/useStore';

const MyComponent = () => {
  const token = useAppSelector(state => state.authentication.token);
  const dispatch = useAppDispatch();
  // ...
};
```

## Testing

```bash
# Run all tests
bun test

# Watch mode
bun test:watch

# CI mode
bun test:ci
```

## Build for Production

```bash
bun build
```

Output will be in `./dist/`

## Docker

```bash
docker build -t {{APP_NAME}} .
docker run -p 80:80 {{APP_NAME}}
```

## Tech Stack

- React 18.3.1
- TypeScript 5.9.3
- Rspack 2.0.4
- Redux Toolkit + Redux Persist
- Material UI 7.3.6
- Tailwind CSS
- React Hook Form + Yup
- i18next
- Single-SPA + Module Federation

## License

Falabella Corp. - {{YEAR}}
