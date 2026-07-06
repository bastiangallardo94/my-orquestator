# Variables de Entorno - Inspection Microfrontend

Este documento describe cómo configurar las variables de entorno para diferentes ambientes.

## 📋 Estrategia de Variables de Entorno

### Prioridad de Valores

Las variables se resuelven en el siguiente orden (de mayor a menor prioridad):

1. **Variables del sistema/CI/CD** (GitLab CI, Docker, etc.)
2. **Archivo `.env.${NODE_ENV}`** (en `/packages/`)
3. **Valores por defecto** (en `src/constants/environment.config.js`)

### Archivos de Configuración

```
packages/
├── .env.development     # Valores para desarrollo local
├── .env.production      # Valores DEFAULT para producción
└── inspection/
    ├── rspack.config.js # Lee variables del sistema y archivos .env
    └── src/constants/
        └── environment.config.js # Define defaults y parseo
```

---

## 🔧 Configuración por Ambiente

### Development (Local)

**Archivo usado:** `packages/.env.development`

**NODE_ENV:** `development`

No requiere variables adicionales. Los valores del archivo son suficientes.

```bash
bun run dev
```

---

### UAT (User Acceptance Testing)

**Archivo usado:** `packages/.env.production` (como base)

**NODE_ENV:** `production`

**Variables a sobrescribir en GitLab CI:**

```bash
export NODE_ENV=production
export BFF_URL=https://uat.fbusinesscenter.com/foreign-trade/bff
export APP_URL=https://uat.fbusinesscenter.com/foreign-trade/inspection/
export LOGIN_URL=https://uat.fbusinesscenter.com/login
export AUTHENTICATION_APP=authentication@https://uat.fbusinesscenter.com/foreign-trade/authentication/remoteEntry.js
export IS_PRODUCTION=true
export APP_DEV=false
export STORE_DEBUG=false
```

#### Configuración en GitLab CI (.gitlab-ci.yml)

```yaml
deploy:uat:
  stage: deploy
  environment:
    name: uat
  variables:
    NODE_ENV: production
    BFF_URL: https://uat.fbusinesscenter.com/foreign-trade/bff
    APP_URL: https://uat.fbusinesscenter.com/foreign-trade/inspection/
    LOGIN_URL: https://uat.fbusinesscenter.com/login
    AUTHENTICATION_APP: authentication@https://uat.fbusinesscenter.com/foreign-trade/authentication/remoteEntry.js
    IS_PRODUCTION: "true"
    APP_DEV: "false"
    STORE_DEBUG: "false"
  script:
    - bun install
    - bun run build
  only:
    - uat
```

---

### Production

**Archivo usado:** `packages/.env.production` (valores por defecto)

**NODE_ENV:** `production`

**Variables opcionales** (si difieren del `.env.production`):

```bash
export NODE_ENV=production
export BFF_URL=https://fbusinesscenter.com/foreign-trade/bff
export APP_URL=https://fbusinesscenter.com/foreign-trade/inspection/
export LOGIN_URL=https://fbusinesscenter.com/login
export AUTHENTICATION_APP=authentication@https://fbusinesscenter.com/foreign-trade/authentication/remoteEntry.js
export IS_PRODUCTION=true
export APP_DEV=false
export STORE_DEBUG=false
```

#### Configuración en GitLab CI (.gitlab-ci.yml)

```yaml
deploy:production:
  stage: deploy
  environment:
    name: production
  variables:
    NODE_ENV: production
  script:
    - bun install
    - bun run build
  only:
    - main
    - master
```

---

## 📊 Tabla de Variables por Ambiente

| Variable | Development | UAT | Production |
|----------|-------------|-----|------------|
| `NODE_ENV` | `development` | `production` | `production` |
| `BFF_URL` | `https://dev.fbusinesscenter.com/foreign-trade/bff` | `https://uat.fbusinesscenter.com/foreign-trade/bff` | `https://fbusinesscenter.com/foreign-trade/bff` |
| `APP_URL` | `http://localhost:8500/` | `https://uat.fbusinesscenter.com/foreign-trade/inspection/` | `https://fbusinesscenter.com/foreign-trade/inspection/` |
| `LOGIN_URL` | `https://dev.fbusinesscenter.com/login` | `https://uat.fbusinesscenter.com/login` | `https://fbusinesscenter.com/login` |
| `AUTHENTICATION_APP` | `authentication@http://localhost:3001/remoteEntry.js` | `authentication@https://uat.fbusinesscenter.com/foreign-trade/authentication/remoteEntry.js` | `authentication@https://fbusinesscenter.com/foreign-trade/authentication/remoteEntry.js` |
| `IS_PRODUCTION` | `false` | `true` | `true` |
| `APP_DEV` | `true` | `false` | `false` |
| `STORE_DEBUG` | `true` | `false` | `false` |

---

## 🔍 Debugging

### Ver variables en runtime

```typescript
import { ENV } from '@core/constants/environment';

console.log('Current environment:', ENV);
console.log('BFF URL:', ENV.API_BASE_URL);
console.log('Is Production:', ENV.isProduction);
```

### Ver variables durante el build

```bash
# Desarrollo
NODE_ENV=development bun run build

# UAT (con override)
NODE_ENV=production BFF_URL=https://uat.fbusinesscenter.com/foreign-trade/bff bun run build

# Producción
NODE_ENV=production bun run build
```

---

## ⚠️ Notas Importantes

1. **NO commitear archivos `.env.local` o `.env.*.local`** - Estos son para overrides locales
2. **Las variables del sistema siempre tienen prioridad** sobre los archivos `.env`
3. **`NODE_ENV` debe ser `production` tanto para UAT como PROD** - La diferencia está en las URLs
4. **Los archivos `.env` en `packages/` son compartidos** por todos los microfrontends
5. **`rspack.config.js` usa `override: false`** para dar prioridad a variables del sistema

---

## 🚀 Quick Start

### Para desarrolladores locales

```bash
# Usar valores de desarrollo
bun run dev
```

### Para CI/CD (UAT)

```bash
# Exportar variables de UAT y construir
export NODE_ENV=production
export BFF_URL=https://uat.fbusinesscenter.com/foreign-trade/bff
# ... otras variables UAT
bun run build
```

### Para CI/CD (Production)

```bash
# Usa valores del archivo .env.production
export NODE_ENV=production
bun run build
```

---

## 📝 Changelog

- **2026-05-20**: Documentación inicial de estrategia de variables de entorno
- **2026-05-20**: Corregido `packages/.env.production` - BFF_URL apuntaba a dev
- **2026-05-20**: Actualizado `rspack.config.js` para priorizar variables del sistema
