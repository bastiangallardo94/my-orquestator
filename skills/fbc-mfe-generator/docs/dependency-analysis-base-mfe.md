# 📊 Análisis de Dependencias - base-mfe Template

## Resumen Ejecutivo

**Total dependencias**: 22 (dependencies)  
**No usadas**: 8 (36%)  
**Poco usadas**: 1 (5%)  
**Usadas activamente**: 13 (59%)  

**Potencial de optimización**: ~8 dependencias eliminables

---

## ❌ Dependencias NO Usadas (8)

### 1. @import/shipment-library-react (2.3.1)
**Categoría**: Librería custom de Falabella  
**Usos encontrados**: 0  
**Tamaño estimado**: ~500KB  
**Recomendación**: ✅ ELIMINAR

### 2. @nrwl/devkit (19.8.4)
**Categoría**: NX monorepo tooling  
**Usos encontrados**: 0  
**Tamaño estimado**: ~2MB  
**Recomendación**: ✅ ELIMINAR  
**Nota**: Solo necesario si usas NX workspace

### 3. @nrwl/tao (19.8.4)
**Categoría**: NX monorepo tooling  
**Usos encontrados**: 0  
**Tamaño estimado**: ~1.5MB  
**Recomendación**: ✅ ELIMINAR  
**Nota**: Solo necesario si usas NX workspace

### 4. @mui/x-date-pickers (8.27.2)
**Categoría**: MUI date pickers  
**Usos encontrados**: 0  
**Tamaño estimado**: ~800KB  
**Recomendación**: ✅ ELIMINAR  
**Nota**: Agregar solo si necesitas date pickers

### 5. @emotion/styled (11.14.1)
**Categoría**: CSS-in-JS  
**Usos encontrados**: 0  
**Tamaño estimado**: ~200KB  
**Recomendación**: ✅ ELIMINAR  
**Nota**: @emotion/react es suficiente si usas MUI

### 6. axios (1.13.2)
**Categoría**: HTTP client  
**Usos encontrados**: 0  
**Tamaño estimado**: ~150KB  
**Recomendación**: ✅ ELIMINAR  
**Nota**: Agregar solo si necesitas hacer HTTP requests (fetch nativo puede ser suficiente)

### 7. dayjs (1.11.19)
**Categoría**: Date manipulation  
**Usos encontrados**: 0  
**Tamaño estimado**: ~100KB  
**Recomendación**: ✅ ELIMINAR  
**Nota**: Agregar solo si necesitas manipulación avanzada de fechas

### 8. react-loading-skeleton (3.5.0)
**Categoría**: Loading skeletons  
**Usos encontrados**: 0  
**Tamaño estimado**: ~50KB  
**Recomendación**: ✅ ELIMINAR  
**Nota**: Agregar solo si necesitas skeletons

---

## ⚠️ Dependencias Poco Usadas (1)

### 1. @emotion/react (11.14.0)
**Usos encontrados**: 1 referencia  
**Tamaño estimado**: ~300KB  
**Usado en**: Probablemente en configuración de MUI  
**Recomendación**: ⚠️ MANTENER (requerido por @mui/material)  
**Nota**: Es peer dependency de MUI, aunque no se use directamente

---

## ✅ Dependencias Activamente Usadas (13)

### Core React
- ✅ react (74 refs) - ~120KB
- ✅ react-dom (6 refs) - ~130KB
- ✅ react-router-dom (7 refs) - ~60KB

### Estado
- ✅ @reduxjs/toolkit (9 refs) - ~180KB
- ✅ redux-persist (8 refs) - ~50KB
- ✅ react-redux (5 refs) - ~30KB
- ✅ redux-micro-frontend (3 refs) - ~20KB

### i18n
- ✅ i18next (10 refs) - ~80KB
- ✅ react-i18next (6 refs) - ~40KB

### Microfrontends
- ✅ single-spa (17 refs) - ~100KB
- ✅ single-spa-react (4 refs) - ~50KB

### Utilities
- ✅ jwt-decode (4 refs) - ~10KB
- ✅ @mui/material (3 refs) - ~1.2MB

---

## 📊 Análisis de MUI

### Uso Actual de MUI
```typescript
// Archivos que usan MUI:
1. src/context/Toast/toast.context.tsx
   - import { AlertColor } from '@mui/material/Alert/Alert'

2. src/context/Toast/toast.provider.tsx
   - import { AlertColor } from '@mui/material/Alert/Alert'

3. src/shared/components/ui/AccessDenied.tsx
   - import { Button } from '@mui/material'
```

### Recomendación sobre MUI
**Opción A - Mantener MUI** (Recomendado si vas a crear más componentes):
- Peso: ~1.2MB + ~300KB (@emotion/react)
- Ventaja: Componentes pre-hechos de calidad
- Desventaja: Peso considerable

**Opción B - Reemplazar MUI** (Si quieres template ultra-liviano):
- Reemplazar `AlertColor` con type custom
- Reemplazar `Button` con button HTML + Tailwind
- Ahorro: ~1.5MB
- Desventaja: Pierdes biblioteca de componentes

---

## 💾 Estimación de Ahorro

### Eliminando las 8 dependencias no usadas:

| Dependencia | Tamaño Estimado |
|-------------|-----------------|
| @import/shipment-library-react | ~500KB |
| @nrwl/devkit | ~2MB |
| @nrwl/tao | ~1.5MB |
| @mui/x-date-pickers | ~800KB |
| @emotion/styled | ~200KB |
| axios | ~150KB |
| dayjs | ~100KB |
| react-loading-skeleton | ~50KB |
| **TOTAL AHORRO** | **~5.3MB** |

### node_modules size:
- **Antes**: ~350MB (estimado)
- **Después**: ~345MB (estimado)
- **Reducción**: ~5MB en disk, ~1-2MB en bundle final

---

## 🎯 Recomendaciones Finales

### Acción Inmediata (Eliminar 8 dependencias):
```json
{
  "dependencies": {
    // ❌ ELIMINAR:
    // "@emotion/styled": "^11.14.1",
    // "@import/shipment-library-react": "2.3.1",
    // "@mui/x-date-pickers": "^8.27.2",
    // "@nrwl/devkit": "^19.8.4",
    // "@nrwl/tao": "^19.8.4",
    // "axios": "^1.13.2",
    // "dayjs": "^1.11.19",
    // "react-loading-skeleton": "^3.5.0",
    
    // ✅ MANTENER:
    "@emotion/react": "^11.14.0",  // Requerido por MUI
    "@mui/material": "^7.3.6",
    "@reduxjs/toolkit": "1.9.7",
    // ... resto
  }
}
```

### Acción Opcional (Optimización avanzada):

**Si quieres template ULTRA-LIVIANO**:
- Eliminar MUI y @emotion (~1.5MB)
- Crear componentes básicos con Tailwind
- Ahorro total: ~6.8MB

---

## 📝 Notas para Desarrolladores

### Dependencias que podrías necesitar agregar después:
- `axios` - Si necesitas HTTP client
- `dayjs` - Si necesitas manipulación de fechas
- `react-loading-skeleton` - Si necesitas loading states
- `@mui/x-date-pickers` - Si necesitas date pickers

### Dependencias que NO deberías agregar:
- `@nrwl/*` - Solo si usas NX monorepo
- `@import/shipment-library-react` - Librería custom específica

---

**Generado**: Mayo 26, 2025  
**Template**: base-mfe v1.0.1  
**Análisis**: Automático via grep/search
