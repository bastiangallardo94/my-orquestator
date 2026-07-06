# Webpack to Rspack Migration Skill

A comprehensive skill for migrating JavaScript/TypeScript projects from Webpack to Rspack with optimized build performance.

## What is This Skill?

This skill provides step-by-step guidance for migrating existing Webpack-based projects to Rspack, a high-performance bundler written in Rust that offers 5-10x faster build times while maintaining compatibility with the Webpack ecosystem.

## When to Use This Skill

Invoke this skill when you need to:
- Migrate a project from Webpack to Rspack
- Optimize build performance
- Replace Webpack with a faster alternative
- Modernize bundler configuration
- Improve developer experience with faster rebuilds

## Triggers

- "migrate to rspack"
- "replace webpack with rspack"
- "upgrade to rspack"
- "convert to rspack"
- "optimize build performance"
- "faster builds"
- "switch bundler to rspack"

## What's Included

### Documentation
- **SKILL.md** - Complete migration guide with detailed workflows
- **COMPARISON.md** - Side-by-side Webpack vs Rspack comparison
- **MIGRATION_EXAMPLE.md** - Step-by-step real-world example
- **CICD_MIGRATION.md** - CI/CD pipeline migration guide
- **README.md** - This file

### Templates
- **rspack.config.js** - Full Rspack configuration with comments
- **module-federation.config.js** - Module Federation setup
- **environment.config.js** - Environment variable management
- **.env.development** - Development environment variables
- **.env.production** - Production environment variables
- **package.json.template** - Scripts and dependencies
- **.github/workflows/Pipeline.yml** - GitHub Actions workflow
- **.gitlab-ci.yml** - GitLab CI configuration

### Metadata
- **skill.json** - Skill configuration and metadata

## Key Features

### Performance Improvements
- **5-10x faster builds** compared to Webpack
- **50% lower memory usage**
- **Built-in SWC compiler** (no Babel needed)
- **Faster dev server startup**

### Feature Parity
- ✅ Full Module Federation support
- ✅ TypeScript compilation (via SWC)
- ✅ React Fast Refresh / HMR
- ✅ CSS/SASS processing
- ✅ Asset handling (images, fonts)
- ✅ Source maps
- ✅ Environment variables

### Developer Experience
- Clear migration path
- Minimal code changes required
- Better error messages
- Environment variable debugging
- Comprehensive documentation

## Quick Start

1. **Analyze your current Webpack setup**
   ```bash
   # Check your webpack.config.js
   # List dependencies in package.json
   ```

2. **Run the migration**
   - Uninstall Webpack packages
   - Install Rspack packages
   - Create rspack.config.js
   - Update package.json scripts

3. **Test the migration**
   ```bash
   npm run build      # Production build
   npm run start      # Development server
   ```

## Example Migration

### Before (Webpack)
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack serve --mode development"
  },
  "devDependencies": {
    "webpack": "5.89.0",
    "webpack-cli": "5.0.1",
    "babel-loader": "9.1.3",
    "html-webpack-plugin": "5.6.0"
  }
}
```

### After (Rspack)
```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production rspack --mode production",
    "start": "cross-env NODE_ENV=development rspack serve --mode development"
  },
  "devDependencies": {
    "@rspack/core": "^1.7.11",
    "@rspack/cli": "^1.7.11",
    "@rspack/plugin-react-refresh": "^2.0.0"
  }
}
```

## Project Structure

```
webpack-to-rspack/
├── SKILL.md                          # Complete migration guide (834 lines)
├── COMPARISON.md                     # Webpack vs Rspack comparison (526 lines)
├── MIGRATION_EXAMPLE.md              # Step-by-step example (572 lines)
├── CICD_MIGRATION.md                 # CI/CD pipeline migration (620+ lines)
├── README.md                         # This file
├── skill.json                        # Skill metadata
└── templates/
    ├── rspack.config.js              # Main config template
    ├── module-federation.config.js   # MF config template
    ├── environment.config.js         # Env vars template
    ├── .env.development              # Dev env template
    ├── .env.production               # Prod env template
    ├── package.json.template         # Scripts template
    └── .github/
        └── workflows/
            └── Pipeline.yml          # GitHub Actions template
    └── .gitlab-ci.yml                # GitLab CI template
```

## Real-World Example

This skill is based on the successful migration of the `import-inspection` microfrontend:

- **Original config:** `/Users/bgallardoc/Documents/proyects/mrch.frontend.cross.portal/packages/mrch.frtr.frontend.inspection/webpack.config.js`
- **Migrated config:** `/Users/bgallardoc/Documents/proyects/APP02696-mrch-frontend-cross-portal/packages/inspection/rspack.config.js`

### Results:
- Build time: **45s → 6s** (7.5x faster)
- Dev rebuild: **3s → 500ms** (6x faster)
- Memory usage: **800MB → 400MB** (50% reduction)

## Common Use Cases

### 1. React + TypeScript + Module Federation
Perfect for microfrontend architectures with:
- TypeScript compilation
- React Fast Refresh
- Module Federation
- Shared dependencies

### 2. Large Monorepos
Ideal for projects with:
- Multiple packages
- Slow build times
- High memory usage
- CI/CD bottlenecks

### 3. Legacy Webpack Projects
Great for modernizing:
- Old Webpack configs
- Babel-heavy setups
- Complex loader chains
- Slow dev servers

## Migration Checklist

- [ ] Backup webpack.config.js
- [ ] Document current build times
- [ ] Uninstall Webpack packages
- [ ] Install Rspack packages
- [ ] Create rspack.config.js
- [ ] Create module-federation.config.js (if using MF)
- [ ] Create environment.config.js
- [ ] Create .env files
- [ ] Update package.json scripts
- [ ] Test development build
- [ ] Test production build
- [ ] Verify HMR works
- [ ] Verify Module Federation works
- [ ] Check bundle sizes
- [ ] Measure performance improvements

## Troubleshooting

### CSS not loading?
Add `type: 'javascript/auto'` to CSS rules

### TypeScript errors?
Use `builtin:swc-loader` with proper parser config

### Environment variables undefined?
Check `dotenv.config()` and `DefinePlugin` setup

### Module Federation not working?
Ensure `publicPath: 'auto'` in output config

### React Refresh not working?
Import plugin dynamically and export async function

## Resources

- [Rspack Official Docs](https://rspack.dev)
- [Webpack to Rspack Migration Guide](https://rspack.dev/guide/migration/webpack)
- [SWC Documentation](https://swc.rs)
- [Module Federation](https://module-federation.io)

## Version

**1.0.0** - Based on Rspack 1.7.11

## Author

Created for OpenCode based on real-world migration experience.

## License

This skill is provided as-is for use with OpenCode.
