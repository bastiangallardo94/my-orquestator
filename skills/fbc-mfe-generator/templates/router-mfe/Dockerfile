FROM node:20-alpine AS builder
WORKDIR /usr/src/app

ARG FAL_NPM_TOKEN
ENV FAL_NPM_TOKEN=$FAL_NPM_TOKEN

RUN npm install -g bun@1.3.14

# Bun usa .npmrc en la raiz para autenticarse contra registries privados.
COPY .npm/npmrc ./.npmrc
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY src ./src
COPY public ./public
COPY rspack.config.js ./rspack.config.js
COPY module-federation.config.js ./module-federation.config.js
COPY tsconfig.json ./tsconfig.json
COPY postcss.config.js ./postcss.config.js
COPY tailwind.config.js ./tailwind.config.js
RUN bun run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist ./

EXPOSE 80
