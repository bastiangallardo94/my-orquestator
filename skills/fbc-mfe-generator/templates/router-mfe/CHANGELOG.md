# Changelog
All notable changes to this project will be documented in this file.

## [1.0.4] - 2026-04-30
### Fixed
- Maintainer select options now update when language changes using i18n translations

## [1.0.3] - 2026-04-15

### Added
- Opciones Mantenedor de Documentos y Mantenedor de HS Codes en el selector de mantenedores
- Guard de roles para Documentos (`view documents maintainer`, `update documents maintainer`)
- Guard de roles para HS Codes (`view hscodes maintainer`, `update hscodes maintainer`)
- Constantes de roles nuevos en `roles.ts`
- Traducciones ES/EN/ZH para mensaje de acceso denegado

### Changed
- `MaintainerType` extendido con `documents` y `hscodes`
- Remotes `importMaintainerDocuments` y `importMaintainerHsCodes` agregados en webpack

## [1.0.2] - 2026-04-10

### Changed
- Converted console.warn to console.error in catch blocks: toast.context.tsx, ProtectedRoute.tsx, useGlobalDrawerState.ts, i18n.ts, globalStateService.ts

### Removed
- Removed console.warn noise from normal flow: tokenUtils.ts, globalStateService.ts (APP_DEV guards)

## [1.0.1] - 2026-04-07
### Fixed
- Remove console.log statements from i18n.ts (language initialization traces)
- Remove console.log examples from tokenUtils.ts JSDoc

## [1.0.0] - 2026-02-06

### Added
- Implementación inicial del MFE Router de Mantenedores
- Selector de tipo de mantenedor (Forwarder, Extraportuario)
- Carga dinámica de MFE Forwarder mediante Module Federation
- Componente EmptyState reutilizable para estados vacíos
- Configuración de webpack con Module Federation remotes
- Integración con Global Store de Falabella
- Soporte de i18n (EN, ES, ZH)
- Breadcrumb navigation component
- Tests unitarios (4/4 passing, EmptyState 100% coverage)
- CHANGELOG.md y README.md completos

### Architecture
- **Routing Distribuido:** Router sin BrowserRouter propio, MFEs hijos con MemoryRouter independiente
- **Module Federation:** Consumo de remote MFE Forwarder
- **Autonomía:** Cada MFE es completamente independiente y se puede desarrollar/deployar por separado

### Technical Stack
- React 18.3.1 con TypeScript
- Webpack 5.89.0 con Module Federation
- Falabella UI Kit (@ui-kit/react-wrapper 3.1.2)
- Redux Toolkit 1.9.7 para state management
- React Router DOM 6.16.0 (MemoryRouter en MFEs hijos)
- i18next 25.6.0 para internacionalización

### Configuration
- **Puerto desarrollo:** 8500
- **Ruta base:** `/foreign-trade/maintainers`
- **Remote MFE:** `importMaintainers@http://localhost:8501/remoteEntry.js`

### Removed (Code Cleanup)
- 33 archivos TypeScript eliminados (-45% del código base)
- Componentes UI específicos de forwarder (DataTable, FileUploader, SummaryBanner, etc.)
- Hooks legacy (useAppRoles, useAuditInfo, useCurrentPath, etc.)
- Utils innecesarios (exportUtils, fileValidationUtils, tokenUtils, etc.)
- Services específicos de forwarder (countryService, facilitiesService, userService)
- Tipos y constantes legacy no utilizados
- Traducciones del módulo forwarder

### Fixed
- Errores de Module Federation con async boundary (index.tsx → bootstrap.tsx)
- Imports de i18n que referenciaban módulos eliminados
- Configuración correcta de remotes en webpack.config.js
- Tipos de imports en infrastructure services (default vs named)

---

## Notes

### Known Issues
- **RouterPage tests deshabilitados:** El test de RouterPage está temporalmente deshabilitado debido a la complejidad de mockear imports dinámicos de Module Federation. La funcionalidad se valida mediante tests E2E y testing manual.

---
