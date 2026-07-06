# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install Bun
RUN npm install -g bun@1.3.14

# Copy registry authentication (if using private registry)
# COPY .npm/npmrc ./.npmrc

# Copy package files
COPY package.json bun.lock yarn.lock ./

# Install dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# Remove .npmrc after install (security best practice)
# RUN rm -f ./.npmrc

# Copy source code and configuration files
COPY src ./src
COPY public ./public
COPY rspack.config.js module-federation.config.js tsconfig.json ./
COPY postcss.config.js tailwind.config.js ./

# Copy environment file for production
COPY .env.production .env

# Build application
RUN bun run build

# ============================================
# Stage 2: Production Stage
# ============================================
FROM nginx:1.27-alpine

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist .

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
