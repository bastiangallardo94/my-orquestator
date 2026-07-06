# Troubleshooting Guide - Rspack + Bun Migration

This document covers common errors encountered during Rspack + Bun migration and their solutions.

---

## Table of Contents

1. [CI/CD Issues](#cicd-issues)
2. [Bun Installation Issues](#bun-installation-issues)
3. [Lockfile Issues](#lockfile-issues)
4. [Private Registry Authentication](#private-registry-authentication)
5. [Docker Build Issues](#docker-build-issues)
6. [Module Federation Issues](#module-federation-issues)
7. [Performance Issues](#performance-issues)

---

## CI/CD Issues

### Error: `bun: command not found`

**Symptom:**
```bash
/bin/sh: 1: bun: not found
error Command failed with exit code 127.
```

**Cause:** Bun is not installed globally in the CI runner.

**Solutions:**

**Option 1: Use npx (Recommended)**
```yaml
# GitHub Actions
command_dependency: "npx -y bun@1.3.14 install --yarn --ignore-scripts"
command_build: "npx -y bun@1.3.14 run build"

# GitLab CI
COMMAND_DEPENDENCY: "npx -y bun@1.3.14 install --yarn --ignore-scripts"
COMMAND_BUILD: "npx -y bun@1.3.14 run build"
```

**Option 2: Install Bun in before_script (GitLab CI)**
```yaml
before_script:
  - npm install -g bun@1.3.14
  - bun -v
```

**Option 3: Use Bun Docker image**
```yaml
image: oven/bun:1.3.14-alpine
```

---

### Error: `EINVALIDTAGNAME`

**Symptom:**
```bash
npm ERR! Invalid tag name "install && bun run build": Tags may not have any characters that encodeURIComponent encodes.
```

**Cause:** CI template doesn't invoke a shell, so `&&` is passed as an argument to npm.

**Solution:** Split commands into separate fields:

**Before (broken):**
```yaml
command_dependency: "bun install --yarn && bun run type-check"
```

**After (working):**
```yaml
command_dependency: "npx -y bun@1.3.14 install --yarn"
command_test: "npx -y bun@1.3.14 run type-check"
```

---

### Error: NPM version incompatible with Node

**Symptom:**
```bash
npm does not support Node.js v12.22.12
Required: node ^14.17.0 || ^16.13.0 || >=18.0.0
```

**Cause:** CI is using an old Node version.

**Solution:** Update Node version in CI configuration:

**GitHub Actions:**
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: '20'
```

**GitLab CI:**
```yaml
variables:
  CI_LANGUAGE_IMAGE_DOCKER: "node:20-alpine"
```

---

### Error: Test coverage not generated

**Symptom:**
```bash
Error: Unable to find coverage file
```

**Cause:** `test:coverage` script missing or uses wrong command.

**Solution:** Add coverage script to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage --coverageDirectory=coverage"
  }
}
```

And update CI command:
```yaml
command_test: "npx -y bun@1.3.14 run test:coverage"
```

---

## Bun Installation Issues

### Error: Bun install fails on macOS

**Symptom:**
```bash
zsh: command not found: bun
```

**Cause:** Bun not in PATH or installation failed.

**Solution:**

**Option 1: Install with curl (recommended)**
```bash
curl -fsSL https://bun.sh/install | bash

# Add to PATH
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Option 2: Install with npm**
```bash
npm install -g bun
```

**Option 3: Install with Homebrew**
```bash
brew tap oven-sh/bun
brew install bun
```

---

### Error: Bun version mismatch

**Symptom:**
```bash
warn: Bun version mismatch
Expected: 1.3.14
Got: 1.2.8
```

**Cause:** Old Bun version installed.

**Solution:**
```bash
bun upgrade
bun -v  # Verify version
```

Or reinstall:
```bash
npm uninstall -g bun
npm install -g bun@latest
```

---

## Lockfile Issues

### Error: Lockfile merge conflicts

**Symptom:**
```
CONFLICT (content): Merge conflict in bun.lock
```

**Cause:** Multiple developers generating different lockfiles.

**Solution:**

**Option 1: Regenerate lockfiles**
```bash
# Take incoming changes or discard yours
git checkout --theirs bun.lock yarn.lock

# Regenerate from package.json
rm bun.lock yarn.lock
bun install --yarn

# Verify and commit
git add bun.lock yarn.lock
git commit -m "chore: regenerate lockfiles after merge"
```

**Option 2: Use automatic merge strategy**
```bash
# Set merge strategy for lockfiles
git config merge.bun-lockfile.driver "bun install --yarn"
```

---

### Error: `package-json.lock` appearing in git

**Symptom:**
```bash
git status
# On branch feature/migration
# Untracked files:
#   package-json.lock
```

**Cause:** `.gitignore` missing entry for Bun's internal lockfile.

**Solution:**
```bash
# Add to .gitignore
echo "package-json.lock" >> .gitignore

# Remove from git if already tracked
git rm --cached package-json.lock
git commit -m "chore: ignore package-json.lock"
```

---

### Error: Lockfile out of sync

**Symptom:**
```bash
error: Lockfile is out of sync with package.json
```

**Cause:** `package.json` changed but lockfiles not regenerated.

**Solution:**
```bash
# Regenerate lockfiles
bun install --yarn

# In CI, use --frozen-lockfile to catch this
bun install --frozen-lockfile  # Will fail if out of sync
```

---

## Private Registry Authentication

### Error: 401 Unauthorized

**Symptom:**
```bash
error: GET https://npm.pkg.dev/project/registry/@scope/package/-/package-1.0.0.tgz - 401
```

**Cause:** Missing or invalid authentication token for private registry.

**Solutions:**

**Option 1: Create `.npmrc` with token**
```ini
# .npmrc
@scope:registry=https://npm.pkg.dev/project/registry/
//npm.pkg.dev/project/registry/:_authToken=${NPM_TOKEN}
```

Set token as environment variable:
```bash
export NPM_TOKEN="your-token-here"
```

**Option 2: Google Artifact Registry auth helper**
```bash
npx -y google-artifactregistry-auth
bun install
```

**Option 3: Copy existing `.npmrc` from `.npm/` directory**
```bash
cp .npm/npmrc ./.npmrc
bun install
```

**In Docker:**
```dockerfile
# Copy .npmrc before install
COPY .npm/npmrc ./.npmrc
RUN bun install --frozen-lockfile

# Remove .npmrc after install (security)
RUN rm .npmrc
```

**In CI:**
```yaml
# GitHub Actions
- name: Configure npm registry
  run: |
    echo "@scope:registry=https://npm.pkg.dev/project/registry/" >> .npmrc
    echo "//npm.pkg.dev/project/registry/:_authToken=${{ secrets.NPM_TOKEN }}" >> .npmrc

# GitLab CI
before_script:
  - echo "@scope:registry=https://npm.pkg.dev/project/registry/" >> .npmrc
  - echo "//npm.pkg.dev/project/registry/:_authToken=${NPM_TOKEN}" >> .npmrc
```

---

### Error: Registry timeout

**Symptom:**
```bash
error: Request timeout after 30000ms
```

**Cause:** Slow or unreachable registry.

**Solution:**

**Increase timeout:**
```bash
bun install --timeout 60000  # 60 seconds
```

**Use faster registry mirror (if available):**
```ini
# .npmrc
registry=https://registry.npmjs.org/  # Public packages
@scope:registry=https://npm.pkg.dev/project/registry/  # Private packages
```

---

## Docker Build Issues

### Error: `COPY failed: file not found`

**Symptom:**
```bash
COPY failed: file not found in build context or excluded by .dockerignore: stat rspack.config.js: file does not exist
```

**Cause:** File doesn't exist or is excluded by `.dockerignore`.

**Solution:**

**Check file exists:**
```bash
ls -la rspack.config.js
```

**Check .dockerignore:**
```
# .dockerignore - ensure config files are NOT ignored
!rspack.config.js
!module-federation.config.js
!tsconfig.json
```

**Use conditional COPY (optional):**
```dockerfile
# Copy only if exists
COPY package*.json bun.lock* yarn.lock* ./
```

---

### Error: Bun install fails in Docker

**Symptom:**
```bash
error: unable to resolve "bun"
```

**Cause:** Bun not installed in builder stage.

**Solution:**
```dockerfile
FROM node:20-alpine AS builder

# Install Bun
RUN npm install -g bun@1.3.14

# Verify installation
RUN bun -v
```

---

### Error: Docker image too large

**Symptom:**
```bash
docker images
REPOSITORY   TAG       SIZE
my-app       latest    1.2GB  # Too large!
```

**Cause:** Including `node_modules` or build artifacts in final image.

**Solution:** Use multi-stage build:

```dockerfile
# Stage 1: Builder (large)
FROM node:20-alpine AS builder
RUN npm install -g bun@1.3.14
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

# Stage 2: Runtime (small)
FROM nginx:1.27-alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
```

**Result:** Image size: ~50MB (nginx + static files only)

---

### Error: Permission denied in Docker

**Symptom:**
```bash
ERROR: failed to solve: failed to compute cache key: failed to copy files: operation not permitted
```

**Cause:** File permissions mismatch.

**Solution:**

**Option 1: Use --chown flag**
```dockerfile
COPY --chown=node:node package.json bun.lock ./
```

**Option 2: Change ownership after copy**
```dockerfile
COPY package.json bun.lock ./
RUN chown -R node:node /usr/src/app
USER node
```

---

## Module Federation Issues

### Error: Shared module not available

**Symptom:**
```bash
Uncaught Error: Shared module is not available for eager consumption
```

**Cause:** Module Federation shared config incorrect.

**Solution:**

**Update `rspack.config.js`:**
```javascript
new rspack.container.ModuleFederationPlugin({
  name: 'myApp',
  filename: 'remoteEntry.js',
  shared: {
    react: {
      singleton: true,
      eager: false,  // Important: set to false
      requiredVersion: '^18.0.0'
    },
    'react-dom': {
      singleton: true,
      eager: false,
      requiredVersion: '^18.0.0'
    }
  }
})
```

---

### Error: Remote entry not found

**Symptom:**
```bash
Loading script failed. (error: https://example.com/remoteEntry.js)
```

**Cause:** Incorrect remote URL or CORS issue.

**Solution:**

**Check remote URL in config:**
```javascript
// module-federation.config.js
remotes: {
  authentication: 'authentication@https://example.com/authentication/remoteEntry.js'
}
```

**Check CORS headers in dev server:**
```javascript
// rspack.config.js
devServer: {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  }
}
```

---

## Performance Issues

### Error: Build is slow (not faster than Webpack)

**Symptom:**
```bash
# Expected: 8 seconds
# Actual: 45 seconds (same as Webpack)
```

**Causes:**
1. Using `babel-loader` instead of `builtin:swc-loader`
2. Not using Rspack's built-in plugins
3. Source maps enabled in dev mode
4. Too many unoptimized assets

**Solutions:**

**1. Use builtin:swc-loader:**
```javascript
{
  test: /\.(j|t)sx?$/,
  loader: 'builtin:swc-loader',  // Not babel-loader!
  options: {
    jsc: {
      parser: { syntax: 'typescript', tsx: true }
    }
  }
}
```

**2. Use built-in plugins:**
```javascript
// Use this
new rspack.HtmlRspackPlugin({ template: './src/index.html' })

// Not this
const HtmlWebpackPlugin = require('html-webpack-plugin')
new HtmlWebpackPlugin({ template: './src/index.html' })
```

**3. Disable source maps in dev:**
```javascript
module.exports = {
  devtool: false,  // Disable in dev for speed
  plugins: [
    !isDev ? new rspack.SourceMapDevToolPlugin({ /* ... */ }) : null
  ]
}
```

**4. Optimize assets:**
```javascript
optimization: {
  minimize: mode === 'production',
  removeAvailableModules: true
}
```

---

### Error: Bun install slow (not faster than npm)

**Symptom:**
```bash
# Expected: 4 seconds
# Actual: 1 minute (same as npm)
```

**Causes:**
1. Not using lockfile cache
2. Installing over slow network
3. Running postinstall scripts
4. Large dependency tree with many small files

**Solutions:**

**1. Use lockfile for caching:**
```bash
bun install --frozen-lockfile  # Use existing lockfile
```

**2. Skip postinstall scripts:**
```bash
bun install --ignore-scripts  # Much faster
```

**3. Use Bun's binary lockfile:**
```bash
# Ensure bun.lock exists (not just yarn.lock)
bun install  # Generates bun.lock
```

**4. Enable global cache:**
```bash
# Bun automatically uses global cache at ~/.bun/install/cache
# Verify cache is working:
bun pm cache
```

---

### Error: High memory usage during build

**Symptom:**
```bash
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Cause:** Large bundle or too many parallel builds.

**Solution:**

**Option 1: Increase Node memory:**
```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--max-old-space-size=4096 rspack build"
  }
}
```

**Option 2: Reduce parallelization:**
```javascript
// rspack.config.js
module.exports = {
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxSize: 244000  // Limit chunk size
    }
  }
}
```

---

## General Debugging Tips

### Enable verbose logging

**Bun:**
```bash
bun install --verbose
```

**Rspack:**
```javascript
module.exports = {
  stats: 'verbose',
  infrastructureLogging: {
    debug: true
  }
}
```

### Check Bun cache

```bash
# View cache stats
bun pm cache

# Clear cache if corrupted
bun pm cache rm
```

### Validate configuration

```bash
# Check rspack config syntax
node -e "require('./rspack.config.js')"

# Check package.json syntax
bun pm verify
```

### Compare with working setup

```bash
# Copy working config from another project
cp ../working-project/rspack.config.js ./
cp ../working-project/.npmrc ./
```

---

## Getting Help

If you're still stuck:

1. **Check Bun issues:** https://github.com/oven-sh/bun/issues
2. **Check Rspack issues:** https://github.com/web-infra-dev/rspack/issues
3. **Enable verbose logging** and share output
4. **Compare with working example** in `~/.agents/skills/rspack-bun-migration/templates/`
5. **Ask in team chat** with error message and config files

---

## Prevention Checklist

To avoid common issues:

- [ ] Always pin Bun version in CI (`bun@1.3.14`, not `bun@latest`)
- [ ] Generate both `bun.lock` and `yarn.lock` for compatibility
- [ ] Use `npx -y bun@<version>` in CI, never assume Bun is installed
- [ ] Never chain commands with `&&` in CI template fields
- [ ] Always use `--frozen-lockfile` in CI/CD and Docker
- [ ] Copy `.npmrc` before install in Docker, remove after
- [ ] Use `builtin:swc-loader`, not `babel-loader`
- [ ] Use Rspack built-in plugins, not Webpack plugins
- [ ] Test locally before pushing to CI
- [ ] Validate Docker image size (should be <100MB for nginx runtime)
