# Dockerfile Patterns for Rspack + Bun

This guide provides production-ready Dockerfile patterns for deploying frontend applications built with Rspack + Bun.

---

## Table of Contents

1. [Basic Multi-Stage Build](#basic-multi-stage-build)
2. [With Private Registry](#with-private-registry)
3. [With Environment Variables](#with-environment-variables)
4. [With Custom Nginx Config](#with-custom-nginx-config)
5. [Development Dockerfile](#development-dockerfile)
6. [Monorepo Setup](#monorepo-setup)
7. [Optimization Tips](#optimization-tips)

---

## Basic Multi-Stage Build

**Use case:** Simple SPA with public npm packages.

```dockerfile
# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install Bun
RUN npm install -g bun@1.3.14

# Copy package files
COPY package.json bun.lock yarn.lock ./

# Install dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# ============================================
# Stage 2: Production Stage
# ============================================
FROM nginx:1.27-alpine

# Copy built files from builder
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist .

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Key points:**
- ✅ Uses Node 20 Alpine (small base image)
- ✅ Installs Bun globally in builder stage
- ✅ Uses `--frozen-lockfile` for reproducible builds
- ✅ Final image only contains static files + nginx (~50MB)

**Build and run:**
```bash
docker build -t my-app:latest .
docker run -p 8080:80 my-app:latest
```

---

## With Private Registry

**Use case:** Project uses private npm packages from Google Artifact Registry, Artifactory, or GitHub Packages.

```dockerfile
# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install Bun
RUN npm install -g bun@1.3.14

# Copy registry authentication BEFORE package.json
COPY .npm/npmrc ./.npmrc

# Copy package files
COPY package.json bun.lock yarn.lock ./

# Install dependencies (will use .npmrc for auth)
RUN bun install --frozen-lockfile

# Remove .npmrc after install (security best practice)
RUN rm -f ./.npmrc

# Copy source code
COPY src ./src
COPY public ./public
COPY rspack.config.js module-federation.config.js tsconfig.json ./
COPY postcss.config.js tailwind.config.js ./

# Build application
RUN bun run build

# ============================================
# Stage 2: Production Stage
# ============================================
FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Creating `.npm/npmrc`:**

```ini
# .npm/npmrc
@scope:registry=https://npm.pkg.dev/your-project/npm-registry/
//npm.pkg.dev/your-project/npm-registry/:_authToken=${NPM_TOKEN}
```

**Build with token:**
```bash
# Pass token as build arg
docker build --build-arg NPM_TOKEN=your-token .

# Or use environment variable
export NPM_TOKEN=your-token
docker build -t my-app:latest .
```

**Alternative: Use build secrets (Docker 18.09+):**

```dockerfile
# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder

WORKDIR /usr/src/app
RUN npm install -g bun@1.3.14

# Mount secret at build time (not stored in image layers)
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    cp package.json bun.lock yarn.lock ./ && \
    bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM nginx:1.27-alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build with secret:**
```bash
docker build --secret id=npmrc,src=.npm/npmrc -t my-app:latest .
```

---

## With Environment Variables

**Use case:** Application needs environment-specific configuration injected at build time.

```dockerfile
# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

# Accept build arguments
ARG NODE_ENV=production
ARG APP_URL
ARG BFF_URL
ARG LOGIN_URL

# Set environment variables
ENV NODE_ENV=${NODE_ENV}
ENV APP_URL=${APP_URL}
ENV BFF_URL=${BFF_URL}
ENV LOGIN_URL=${LOGIN_URL}

WORKDIR /usr/src/app

# Install Bun
RUN npm install -g bun@1.3.14

# Copy package files
COPY package.json bun.lock yarn.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code and config files
COPY src ./src
COPY public ./public
COPY rspack.config.js module-federation.config.js tsconfig.json ./
COPY postcss.config.js tailwind.config.js ./

# Copy environment-specific .env file (optional)
COPY .env.${NODE_ENV} .env

# Build application (env vars injected via rspack.DefinePlugin)
RUN bun run build

# ============================================
# Stage 2: Production Stage
# ============================================
FROM nginx:1.27-alpine

# Copy built files
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist .

# Optionally pass runtime env vars to nginx
ENV APP_URL=${APP_URL}

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build with environment variables:**
```bash
docker build \
  --build-arg NODE_ENV=production \
  --build-arg APP_URL=https://prod.example.com \
  --build-arg BFF_URL=https://prod.example.com/api \
  --build-arg LOGIN_URL=https://prod.example.com/login \
  -t my-app:prod \
  .
```

**For multiple environments:**
```bash
# Development
docker build --build-arg NODE_ENV=development -t my-app:dev .

# UAT
docker build --build-arg NODE_ENV=uat -t my-app:uat .

# Production
docker build --build-arg NODE_ENV=production -t my-app:prod .
```

---

## With Custom Nginx Config

**Use case:** Need custom routing, caching, or headers for SPA.

**Create `nginx.conf`:**

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable caching for index.html (always get latest)
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires 0;
    }

    # SPA routing: fallback to index.html for all non-file requests
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
```

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
RUN npm install -g bun@1.3.14
COPY package.json bun.lock yarn.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.27-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Development Dockerfile

**Use case:** Run dev server in Docker for local development.

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Install Bun
RUN npm install -g bun@1.3.14

# Copy package files
COPY package.json bun.lock yarn.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose dev server port
EXPOSE 8500

# Start dev server
CMD ["bun", "run", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "8500:8500"
    volumes:
      # Mount source code for hot reload
      - ./src:/usr/src/app/src
      - ./public:/usr/src/app/public
      # Exclude node_modules from mount
      - /usr/src/app/node_modules
    environment:
      - NODE_ENV=development
      - APP_URL=http://localhost:8500
```

**Run:**
```bash
docker-compose up
```

---

## Monorepo Setup

**Use case:** Microfrontend in a monorepo (Nx, Turborepo, Lerna).

**Project structure:**
```
monorepo/
├── packages/
│   ├── app1/
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── app2/
│   └── shared/
├── package.json
└── bun.lock
```

**Dockerfile for `packages/app1`:**

```dockerfile
# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/monorepo

# Install Bun
RUN npm install -g bun@1.3.14

# Copy root package files (entire monorepo)
COPY package.json bun.lock yarn.lock ./

# Copy workspace packages
COPY packages ./packages

# Install all dependencies (root + workspaces)
RUN bun install --frozen-lockfile

# Navigate to specific package
WORKDIR /usr/src/monorepo/packages/app1

# Build this package
RUN bun run build

# ============================================
# Stage 2: Production Stage
# ============================================
FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/monorepo/packages/app1/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build from monorepo root:**
```bash
# Build specific package
docker build -f packages/app1/Dockerfile -t app1:latest .

# Or from package directory
cd packages/app1
docker build -f Dockerfile -t app1:latest ../..
```

---

## Optimization Tips

### 1. Leverage Docker Layer Caching

**Bad (cache invalidated on any file change):**
```dockerfile
COPY . .
RUN bun install
```

**Good (cache only invalidated when package.json changes):**
```dockerfile
COPY package.json bun.lock yarn.lock ./
RUN bun install
COPY . .
```

### 2. Use .dockerignore

Create `.dockerignore` to exclude unnecessary files:

```
# .dockerignore
node_modules
dist
.git
.github
.vscode
.idea
*.log
*.md
.env*
!.env.production
coverage
.DS_Store
```

### 3. Minimize Final Image Size

**Check image sizes:**
```bash
docker images my-app
```

**Target size:**
- ✅ **Good:** 50-100MB (nginx + static files)
- ⚠️ **OK:** 100-200MB (includes some extras)
- ❌ **Bad:** 500MB+ (likely including node_modules)

**Ways to reduce:**
```dockerfile
# Use alpine base images
FROM node:20-alpine  # ~40MB vs node:20 (~900MB)
FROM nginx:1.27-alpine  # ~40MB vs nginx:1.27 (~150MB)

# Remove unnecessary files after build
RUN bun run build && \
    rm -rf node_modules src public

# Use multi-stage build (only copy dist/)
COPY --from=builder /usr/src/app/dist .
```

### 4. Parallelize Builds in CI

**GitHub Actions:**
```yaml
jobs:
  build-images:
    strategy:
      matrix:
        app: [app1, app2, app3]
    steps:
      - uses: docker/build-push-action@v5
        with:
          context: .
          file: packages/${{ matrix.app }}/Dockerfile
          tags: ${{ matrix.app }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 5. Use BuildKit Features

Enable BuildKit for faster builds:

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Or use buildx
docker buildx build -t my-app:latest .
```

**BuildKit features:**
- Parallel layer builds
- Better caching
- Build secrets (for .npmrc)
- SSH mounts (for private git repos)

### 6. Health Checks

Add health check to Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
```

Or in docker-compose:

```yaml
services:
  frontend:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

---

## Testing Dockerfiles

### Local Testing

```bash
# Build
docker build -t my-app:test .

# Run
docker run -d -p 8080:80 --name my-app-test my-app:test

# Test
curl http://localhost:8080

# Check logs
docker logs my-app-test

# Inspect image
docker inspect my-app:test

# Check size
docker images my-app:test

# Clean up
docker stop my-app-test
docker rm my-app-test
```

### Automated Testing

**test-docker.sh:**
```bash
#!/bin/bash
set -e

echo "Building Docker image..."
docker build -t my-app:test .

echo "Starting container..."
docker run -d -p 8080:80 --name my-app-test my-app:test

echo "Waiting for container to start..."
sleep 5

echo "Testing health endpoint..."
curl --fail http://localhost:8080/health || exit 1

echo "Testing index.html..."
curl --fail http://localhost:8080 | grep -q "<title>" || exit 1

echo "Testing static assets..."
curl --fail -I http://localhost:8080/remoteEntry.js || exit 1

echo "Cleaning up..."
docker stop my-app-test
docker rm my-app-test

echo "✅ All tests passed!"
```

---

## Production Deployment Patterns

### Kubernetes Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: gcr.io/my-project/my-app:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
```

### Cloud Run Deployment

```bash
# Build and push to GCR
docker build -t gcr.io/my-project/my-app:latest .
docker push gcr.io/my-project/my-app:latest

# Deploy to Cloud Run
gcloud run deploy my-app \
  --image gcr.io/my-project/my-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

---

## Troubleshooting Docker Builds

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#docker-build-issues) for common Docker errors and solutions.

**Quick checklist:**
- [ ] Using Node 20+ in builder stage
- [ ] Bun installed with `npm install -g bun@<version>`
- [ ] `.npmrc` copied before `bun install` (for private registries)
- [ ] `.npmrc` removed after install (security)
- [ ] Using `--frozen-lockfile` for reproducible builds
- [ ] Only copying `dist/` to final stage (not `node_modules`)
- [ ] Final image < 100MB (for nginx runtime)
- [ ] Health check endpoint configured
- [ ] `.dockerignore` excludes `node_modules`, `dist`, `.git`
