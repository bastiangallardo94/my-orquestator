# {{DISPLAY_NAME}}

Basic microfrontend generated with fbc-mfe-generator.

## Description

This is a minimal microfrontend with essential configuration. Perfect for simple applications or as a starting point that you can extend as needed.

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
├── core/                   # Core configuration
├── context/                # React Contexts (Error, Toast)
├── features/
│   └── home/              # Main home page (example)
├── shared/
│   ├── components/        # Reusable components
│   │   ├── auth/         # PrivateRoute, ProtectedRoute
│   │   ├── layouts/      # AppLayout
│   │   └── ui/           # UI components
│   ├── hooks/            # Custom hooks
│   ├── i18n/             # Internationalization
│   └── utils/            # Utilities
└── infrastructure/
    ├── services/         # HTTP, API clients
    └── store/            # Redux store
```

## Adding New Features

1. Create a new folder in `src/features/`
2. Add your page component
3. Add route in `src/App.tsx`

Example:
```bash
mkdir -p src/features/dashboard
```

```typescript
// src/features/dashboard/DashboardPage.tsx
export const DashboardPage = () => {
  return <div>Dashboard</div>;
};

// src/App.tsx
<Route path="/dashboard" element={
  <PrivateRoute>
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  </PrivateRoute>
} />
```

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

Edit `src/shared/i18n/locales/` to modify translations.

## State Management

Redux Toolkit configured with basic slices:
- `authentication` - User auth state
- `config` - App configuration
- `tenant` - Business unit and country

```typescript
import { useAppSelector } from '@infrastructure/store/hooks/useStore';

const MyComponent = () => {
  const token = useAppSelector(state => state.authentication.token);
  // ...
};
```

## Testing

```bash
# Run tests
bun test

# Watch mode
bun test:watch
```

## Build

```bash
bun build
```

## Docker

```bash
docker build -t {{APP_NAME}} .
docker run -p 80:80 {{APP_NAME}}
```

## Scaling Up

When your application grows, consider migrating to:
- **feature-based-mfe**: For apps with 5+ features
- Use the `_templates/` pattern from feature-based-mfe

## Tech Stack

- React 18.3.1
- TypeScript 5.9.3
- Rspack 2.0.4
- Redux Toolkit
- Material UI 7.3.6
- Tailwind CSS
- i18next
- Single-SPA + Module Federation

## License

Falabella Corp. - {{YEAR}}
