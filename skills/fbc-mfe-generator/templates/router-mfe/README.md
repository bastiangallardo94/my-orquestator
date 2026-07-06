# {{DISPLAY_NAME}}

Router microfrontend generated with fbc-mfe-generator.

## Description

This microfrontend acts as an orchestrator that loads other microfrontends dynamically using Module Federation and single-spa.

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

## Configuration

### Environment Variables

Edit `src/constants/environment.config.js` to configure:
- `APP_NAME`: {{APP_NAME}}
- `APP_PORT`: {{APP_PORT}}
- `APP_PATH`: {{APP_PATH}}

### Module Federation

Remote MFEs are configured in `module-federation.config.js`.

**Current remotes:**
```javascript
remotes: {
  {{REMOTES}}
}
```

To add a new remote MFE:

1. Edit `module-federation.config.js`:
```javascript
remotes: {
  myNewMfe: "myNewMfe@http://localhost:8503/remoteEntry.js"
}
```

2. Update `src/features/router/RouterPage.tsx`:
```typescript
if (selectedMfe === "my-new-mfe") {
  mfeModule = await import("myNewMfe/App");
}
```

3. Update selector options in `src/features/router/components/MfeSelector.tsx`

## Project Structure

```
src/
├── core/                   # Core configuration
├── context/                # React Contexts
├── features/
│   └── router/            # Main routing feature (complete)
│       ├── RouterPage.tsx
│       ├── components/
│       └── types/
├── shared/
│   ├── components/        # Shared components
│   ├── hooks/             # Custom hooks
│   ├── i18n/              # Internationalization
│   └── utils/
└── infrastructure/
    ├── services/          # HTTP services
    └── store/             # Redux store
```

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

Change language files in `src/shared/i18n/locales/`

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
# Build
bun build

# The output will be in ./dist/
```

## Docker

```bash
# Build image
docker build -t {{APP_NAME}} .

# Run container
docker run -p 80:80 {{APP_NAME}}
```

## Tech Stack

- React 18.3.1
- TypeScript 5.9.3
- Rspack 2.0.4
- Redux Toolkit
- Material UI 7.3.6
- Tailwind CSS
- Single-SPA
- Module Federation

## License

Falabella Corp. - {{YEAR}}
