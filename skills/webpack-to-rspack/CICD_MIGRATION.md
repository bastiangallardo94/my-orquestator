# CI/CD Pipeline Migration for Rspack

This document covers the necessary changes to CI/CD pipelines when migrating from Webpack to Rspack.

## Table of Contents

1. [Overview](#overview)
2. [GitHub Actions](#github-actions)
3. [GitLab CI](#gitlab-ci)
4. [Environment Variables](#environment-variables)
5. [Build Commands](#build-commands)
6. [Caching Strategies](#caching-strategies)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

---

## Overview

When migrating from Webpack to Rspack, your CI/CD pipelines need minimal changes since the build commands remain largely the same. However, there are some important considerations:

### Key Changes

1. **Build commands** - Usually no change (still `npm run build`)
2. **Dependencies** - Rspack packages instead of Webpack
3. **Node version** - Recommend Node 18+ for best performance
4. **Build time** - Expect 5-10x faster builds
5. **Memory usage** - ~50% less memory consumption
6. **Cache strategy** - May need adjustment for faster builds

### No Changes Required

- ✅ Deployment commands
- ✅ Test commands
- ✅ Environment variable injection
- ✅ Artifact upload/download
- ✅ Docker build processes

---

## GitHub Actions

### Before (Webpack)

```yaml
name: Pipeline CI Microservice
on:
  push:
    branches: [develop, main, uat]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
```

### After (Rspack)

```yaml
name: Pipeline CI Microservice
on:
  push:
    branches: [develop, main, uat]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'  # Rspack works best with Node 18+
          
      - name: Install dependencies
        run: npm install
        
      - name: Build with Rspack
        run: npm run build
        env:
          NODE_ENV: production
```

### Key Differences

| Aspect | Webpack | Rspack | Notes |
|--------|---------|--------|-------|
| Node version | 16+ | 18+ recommended | Better performance |
| Build command | `npm run build` | `npm run build` | Same command |
| Build time | ~45s | ~6s | 7.5x faster |
| Memory limit | May need 4GB | 2GB sufficient | Lower requirements |

### Complete GitHub Actions Example

```yaml
name: Pipeline CI Microservice

on:
  push:
    branches:
      - develop
      - feature/**
      - uat
      - release/**
      - main
      - master
      - hotfix/**
      - "v*.*.*"
    tags:
      - "v*.*.*"
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    uses: falabella-stores-and-merchandise/FTI00382-merch-store-template/.github/workflows/build-node-generic-gcp-artefactory.yml@main
    secrets: inherit
    with:
      # Node 20 recommended for Rspack
      container_image: "gcr.io/fal-corp-stro-ops-prd/pipeline-node-sdk:20"
      
      # Install dependencies
      command_dependency: "yarn install --ignore-scripts"
      
      # Build with Rspack (same command as Webpack)
      command_build: "yarn run build"
      
      # Run tests
      command_test: "npm run test:coverage"
      
      # Runners
      runners: ${{ vars.RUNNER_MERCH }}

  deploy:
    needs: build
    permissions:
      id-token: write
      contents: write
      issues: write
    uses: falabella-stores-and-merchandise/FTI00382-merch-store-template/.github/workflows/deploy-cloud-storage-generic.yml@main
    secrets: inherit
    with:
      language: "node"
      country: "CL"
      business: "FA"
      runners: ${{ vars.RUNNER_MERCH }}
      retail_type: "merch"
```

---

## GitLab CI

### Before (Webpack)

```yaml
include:
  - project: 'your-org/templates'
    file: '.gitlab-ci-template-webpack.yml'
    ref: 'main'

variables:
  CI_LANGUAGE_IMAGE_DOCKER: node:18
  PRODUCT_NAME: 'my-app'
```

### After (Rspack)

```yaml
include:
  - project: 'rtl/merchandise-ti-corp/foundational/portal/configuration/template-cicd'
    # Use Rspack-specific template
    file: 'dev/cloud-storage/.gitlab-ci-template-bun-rspack.yml'
    ref: 'feature/datadog-sourcemaps'

variables:
  # Node 18+ for Rspack
  CI_LANGUAGE_IMAGE_DOCKER: gcr.io/fal-corp-stro-ops-prd/pipeline-node-sdk:18
  
  # Enable React deployment
  DEPLOY_STORAGE_REACT_ENABLED: true
  
  # GCP Artifacts Registry
  GCP_ARTIFACTS_REGISTRY: true
  
  # Product name
  PRODUCT_NAME: 'imports-inspections'
```

### Key Changes

1. **Template file** - Change from webpack template to rspack template
   - Before: `.gitlab-ci-template-webpack.yml`
   - After: `.gitlab-ci-template-bun-rspack.yml`

2. **Docker image** - Use Node 18+ for better performance
   - Before: `node:16`
   - After: `gcr.io/fal-corp-stro-ops-prd/pipeline-node-sdk:18`

3. **Build command** - Usually stays the same in package.json
   ```json
   {
     "scripts": {
       "build": "cross-env NODE_ENV=production rspack --mode production"
     }
   }
   ```

### Complete GitLab CI Example

```yaml
## Import template
include:
  - project: 'rtl/merchandise-ti-corp/foundational/portal/configuration/template-cicd'
    file: 'dev/cloud-storage/.gitlab-ci-template-bun-rspack.yml'
    ref: 'feature/datadog-sourcemaps'

variables:
  ## Docker Image
  CI_LANGUAGE_IMAGE_DOCKER: gcr.io/fal-corp-stro-ops-prd/pipeline-node-sdk:18
  
  ## Deployment Configuration
  DEPLOY_STORAGE_REACT_ENABLED: true
  GCP_ARTIFACTS_REGISTRY: true
  
  ## Product Configuration
  PRODUCT_NAME: 'imports-inspections'
  
  ## Optional: Override build command
  # BUILD_COMMAND: 'npm run build'
  
  ## Optional: Node environment
  # NODE_ENV: 'production'
  
  ## Optional: Enable source maps upload to Datadog
  # DATADOG_SOURCEMAPS_ENABLED: true
  # DATADOG_API_KEY: $DATADOG_API_KEY
  # DATADOG_SITE: datadoghq.com

## Custom stages (if needed)
stages:
  - install
  - test
  - build
  - deploy

## Optional: Custom build job with Rspack-specific settings
build:custom:
  stage: build
  image: gcr.io/fal-corp-stro-ops-prd/pipeline-node-sdk:18
  script:
    - echo "Building with Rspack..."
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - .rspack_cache/  # Rspack cache directory
```

---

## Environment Variables

### Required Environment Variables

These environment variables should be set in your CI/CD pipeline:

```yaml
# Production
NODE_ENV=production

# Application configuration
APP_NAME=myApp
APP_PORT=8500
APP_URL=https://prod.example.com/app/
APP_PATH=/app-path

# Backend URLs
BFF_URL=https://prod.example.com/bff
LOGIN_URL=https://prod.example.com/login

# Module Federation
AUTHENTICATION_APP=authentication@https://prod.example.com/authentication/remoteEntry.js

# Feature flags
APP_DEV=false
IS_PRODUCTION=true
STORE_DEBUG=false

# Optional: Git commit SHA for cache busting
CI_COMMIT_SHA=${CI_COMMIT_SHA}
```

### GitHub Actions Example

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    APP_NAME: ${{ vars.APP_NAME }}
    APP_URL: ${{ vars.APP_URL }}
    BFF_URL: ${{ secrets.BFF_URL }}
    CI_COMMIT_SHA: ${{ github.sha }}
```

### GitLab CI Example

```yaml
variables:
  NODE_ENV: "production"
  APP_NAME: "myApp"
  APP_URL: "https://prod.example.com/app/"
  BFF_URL: "https://prod.example.com/bff"
```

### Environment-Specific Variables

Create different variable sets for each environment:

#### Development
```yaml
variables:
  NODE_ENV: "development"
  APP_URL: "http://localhost:8500/"
  BFF_URL: "https://dev.example.com/bff"
```

#### UAT
```yaml
variables:
  NODE_ENV: "production"
  APP_URL: "https://uat.example.com/app/"
  BFF_URL: "https://uat.example.com/bff"
```

#### Production
```yaml
variables:
  NODE_ENV: "production"
  APP_URL: "https://prod.example.com/app/"
  BFF_URL: "https://prod.example.com/bff"
```

---

## Build Commands

### Package.json Scripts

Ensure your `package.json` has the correct Rspack commands:

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production rspack --mode production",
    "build:dev": "cross-env NODE_ENV=development rspack --mode development",
    "build:uat": "cross-env NODE_ENV=production rspack --mode production",
    "start": "cross-env NODE_ENV=development rspack serve --mode development",
    "test": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx"
  }
}
```

### CI/CD Build Steps

```yaml
# Install dependencies
- run: npm ci  # or yarn install --frozen-lockfile

# Type checking (optional but recommended)
- run: npm run type-check

# Linting (optional)
- run: npm run lint

# Tests
- run: npm run test:ci

# Build
- run: npm run build
```

### Build Output

Rspack outputs to `dist/` by default (same as Webpack):

```
dist/
├── index.html
├── remoteEntry.js           # Module Federation entry
├── 323.a214de51f46e8388.js  # Main bundle
├── 535.9cf401803adb492a.js  # Vendor bundle
├── images/                  # Assets
└── fonts/                   # Fonts
```

---

## Caching Strategies

### Node Modules Cache

Cache `node_modules/` to speed up dependency installation:

#### GitHub Actions
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

#### GitLab CI
```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
```

### Rspack Build Cache

Rspack has built-in caching. You can optionally cache the `.rspack_cache/` directory:

```yaml
cache:
  paths:
    - node_modules/
    - .rspack_cache/  # Rspack cache
```

### Cache Invalidation

Clear cache when:
- Upgrading Rspack version
- Changing build configuration
- Experiencing build issues

```yaml
# GitHub Actions
- name: Clear cache
  run: rm -rf node_modules .rspack_cache

# GitLab CI
before_script:
  - rm -rf node_modules .rspack_cache
```

---

## Performance Optimization

### Build Time Comparison

| Environment | Webpack | Rspack | Improvement |
|-------------|---------|--------|-------------|
| Local (cold) | 45s | 6s | 7.5x |
| Local (hot) | 3s | 500ms | 6x |
| CI/CD (no cache) | 60s | 10s | 6x |
| CI/CD (cached) | 30s | 5s | 6x |

### Memory Optimization

Rspack uses significantly less memory:

```yaml
# Webpack - might need memory limits
- run: node --max-old-space-size=4096 node_modules/.bin/webpack

# Rspack - no special limits needed
- run: npm run build
```

### Parallel Jobs

With faster builds, you can run more parallel jobs:

```yaml
# Before (Webpack) - limit parallelism due to memory
strategy:
  max-parallel: 2

# After (Rspack) - can increase parallelism
strategy:
  max-parallel: 4
```

### CI/CD Runner Selection

With Rspack's lower resource requirements:

```yaml
# Can use smaller runners
runs-on: ubuntu-latest  # 2-core, 7GB RAM is enough

# Instead of
runs-on: ubuntu-latest-4-cores  # 4-core, 16GB RAM
```

---

## Troubleshooting

### Issue 1: Build Fails in CI but Works Locally

**Cause:** Environment variables not set in CI/CD

**Solution:** 
```yaml
# Ensure all required env vars are set
env:
  NODE_ENV: production
  APP_NAME: ${{ vars.APP_NAME }}
  # ... all other vars
```

### Issue 2: "Cannot find module '@rspack/core'"

**Cause:** Dependencies not installed or cache corrupted

**Solution:**
```yaml
- run: rm -rf node_modules
- run: npm ci
```

### Issue 3: Build Succeeds but App Doesn't Work

**Cause:** Environment variables not injected correctly

**Solution:** Check `rspack.config.js` DefinePlugin:
```javascript
new rspack.DefinePlugin({
  'process.env': JSON.stringify({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    // ... all vars
  })
})
```

### Issue 4: Module Federation Remote Not Loading

**Cause:** `publicPath` not set to 'auto'

**Solution:** In `rspack.config.js`:
```javascript
output: {
  publicPath: 'auto',  // Critical for Module Federation
  // ...
}
```

### Issue 5: Source Maps Not Generated

**Cause:** SourceMapDevToolPlugin not configured

**Solution:**
```javascript
plugins: [
  new rspack.SourceMapDevToolPlugin({
    noSources: false,
    filename: '../dist_sourcemaps/[file].map'
  })
]
```

### Issue 6: CI Build Slower Than Expected

**Possible causes:**
- Not using Node 18+
- Cache not configured
- Too many parallel jobs

**Solution:**
```yaml
# Use Node 20
- uses: actions/setup-node@v3
  with:
    node-version: '20'

# Enable caching
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

---

## Migration Checklist

### Pre-Migration

- [ ] Document current CI/CD build times
- [ ] Identify all environment variables used
- [ ] Review pipeline configuration files
- [ ] Check for custom build scripts

### GitHub Actions Migration

- [ ] Update Node version to 18+ in workflows
- [ ] Verify build commands still work
- [ ] Update caching strategy (optional)
- [ ] Test in feature branch first
- [ ] Monitor build times after migration

### GitLab CI Migration

- [ ] Change template to Rspack version
  - [ ] Update `file:` path to rspack template
- [ ] Update `CI_LANGUAGE_IMAGE_DOCKER` to Node 18+
- [ ] Verify build commands in `package.json`
- [ ] Test in feature branch first
- [ ] Update caching configuration (optional)

### Environment Variables

- [ ] Document all required env vars
- [ ] Set vars in CI/CD settings
- [ ] Create environment-specific var sets (dev, uat, prod)
- [ ] Test variable injection in build

### Testing

- [ ] Run build in CI/CD
- [ ] Verify build artifacts are correct
- [ ] Test deployed application
- [ ] Check Module Federation remotes load
- [ ] Verify source maps upload (if applicable)

### Performance Validation

- [ ] Measure new build times
- [ ] Compare memory usage
- [ ] Verify build artifacts size
- [ ] Check deployment times

### Documentation

- [ ] Update README with new build commands
- [ ] Document environment variables
- [ ] Update deployment documentation
- [ ] Notify team of changes

---

## Example: Complete Migration

### Step 1: Update `.github/workflows/Pipeline.yml`

```bash
# Copy template
cp ~/.agents/skills/webpack-to-rspack/templates/.github/workflows/Pipeline.yml \
   .github/workflows/Pipeline.yml

# Or update manually:
# 1. Change Node version to 20
# 2. Verify command_build uses 'npm run build'
# 3. No other changes needed
```

### Step 2: Update `.gitlab-ci.yml`

```bash
# Copy template
cp ~/.agents/skills/webpack-to-rspack/templates/.gitlab-ci.yml \
   .gitlab-ci.yml

# Or update manually:
# 1. Change template file to rspack version
# 2. Update CI_LANGUAGE_IMAGE_DOCKER to Node 18+
# 3. Set PRODUCT_NAME variable
```

### Step 3: Set Environment Variables

In GitHub Actions / GitLab CI settings:

```
NODE_ENV=production
APP_NAME=myApp
APP_URL=https://prod.example.com/app/
BFF_URL=https://prod.example.com/bff
# ... other vars
```

### Step 4: Test Build

```bash
# Push to feature branch
git checkout -b feature/migrate-to-rspack
git add .github/ .gitlab-ci.yml
git commit -m "chore: migrate CI/CD to Rspack"
git push origin feature/migrate-to-rspack

# Monitor pipeline
# Verify build succeeds
# Check build time improvements
```

### Step 5: Deploy and Validate

```bash
# If build succeeds, merge to develop/main
# Deploy to UAT environment
# Test application
# Monitor for any issues
```

---

## Summary

Migrating CI/CD pipelines from Webpack to Rspack is straightforward:

### Required Changes
1. ✅ Update Node version to 18+ (recommended)
2. ✅ Change CI template to Rspack version (GitLab)
3. ✅ Verify build commands in `package.json`

### Optional Changes
4. ⚡ Optimize caching strategy
5. ⚡ Increase parallel jobs (due to faster builds)
6. ⚡ Use smaller CI runners (due to lower memory usage)

### No Changes Needed
- ❌ Build command (usually stays `npm run build`)
- ❌ Deploy commands
- ❌ Test commands
- ❌ Environment variable injection

### Expected Results
- **6-10x faster builds** in CI/CD
- **~50% lower memory usage**
- **Lower CI/CD costs** (faster builds = less runner time)
- **Better developer experience** (faster feedback)

The migration typically takes **less than 1 hour** and provides immediate performance benefits.
