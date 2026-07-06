# Changelog

## [1.1.15] - 2026-05-15
### Added
#### FSS-5338
- Add `CLASSIFY_PO_SUMMARY_DOWNLOAD` endpoint constant in `apiEndpoints.ts`
- Refactor `downloadInspectionSummary` to use `apiClient` with `documentSessionId` parameter and download as `.xlsx`

## [1.1.16] - 2026-05-18
### Changed
- Migración de componentes `@ui-kit/react-wrapper` a `@mui/material` (Button, Tabs, Chip, Dialog, icons)
- `ExceptionManagementPage`: botón "Excepción Masiva" habilitado solo con formulario válido, eliminado código demo
### Added
- `apiEndpoints.ts`: endpoints `CLASSIFY_PO_FILE_UPLOAD`, `CLASSIFY_PO_TEMPLATE_DOWNLOAD`, `CLASSIFY_PO_SUMMARY_DOWNLOAD`
- `purchaseOrderInspectionService.ts`: conexión real a endpoints classify-po (upload + summary download)
- `package.json`: dependencia `@mui/icons-material@^7.0.0`
### Fixed
- `InspectionReviewTable.tsx`: eliminado import duplicado de `Select`
- Tests actualizados para mockear `@mui/material` en lugar de `@ui-kit/react-wrapper`

## [1.1.15] - 2026-05-13
### Fixed
- Temporarily hide exception management home card until endpoints are available

## [1.1.14] - 2026-05-08
### Fixed
- Move horizontal scroll to PurchaseOrderTable component and remove redundant overflow from PurchaseOrders wrapper

## [1.1.13] - 2026-05-08
### Fixed
- Add horizontal scroll to Scheduled Inspections tab wrapper in ScheduleInspectionHomePage
- Add stage field to summary banner in ApproveSchedule page

## [1.1.12] - 2026-05-07
### Fixed
- Dash fallback and horizontal scroll extended to Inspecciones Agendadas and Gestión de inspecciones tables
- Backend error message in PurchaseOrder general search (usePurchaseOrderSearch)
- Hide schedule approval home card for Restrict Inspector role (HomePage)
### Added
- Unit tests for HomePage role guard, usePurchaseOrderSearch error handling and InspectionsTable dash fallback

## [1.1.11] - 2026-05-05
### Fixed
- Show backend error message instead of generic text when vendor PO search fails
- Add horizontal scroll to PO table in scheduling screen
- Hide approve/reject schedule screen for Restrict Inspector role
- Show inspector name with dash fallback in inspection review banner
- Add stage field to inspection execution banner
- Show dash instead of empty cells for cancelled inspections in inspector table
### Added
- excludedRoles prop in ProtectedRoute component
- RESTRICT_INSPECTOR role constant in USER_ROLES
- Unit tests for excludedRoles behavior in ProtectedRoute

## [1.1.10] - 2026-04-30
### Changed
- `MyScheduleRequestsPage`: filtros del formulario se restauran automáticamente al volver desde `ApproveSchedule` vía `location.state.filters`
- `MyScheduleRequestsPage`: tabla se refresca automáticamente al volver con `shouldRefresh: true` en el state (post-aprobación), limpiando el state de navegación para evitar refrescos duplicados
- `MyScheduleRequestsPage`: columna de selección reemplaza `isCheckbox: true` por un render manual que muestra checkbox únicamente en filas con `stage.code === 100`; eliminados `onToggleRow` e `isRowSelected` de `<Table>`
- `MyScheduleRequestsPage`: `approveScheduleRedirect` propaga `filters` actuales al navegar hacia `ApproveSchedule`
- `ApproveSchedule`: reemplazado `navigateToUrl` por `useNavigate` en `backClick` y `submitForm`; al volver restaura los filtros previos y al aprobar con éxito envía `shouldRefresh: true` junto con los filtros
- `environment.ts`: corregido valor por defecto de `APP_PATH` de `/foreign-trade/inspection` a `/inspection`

## [1.1.9] - 2026-04-10
### Changed
- Converted console.warn to console.error in catch blocks: MenuItem.tsx, ProtectedRoute.tsx, useGlobalDrawerState.ts, i18n.ts, globalStateService.ts
### Removed
- Removed console.warn noise from normal flow: tokenUtils.ts, exportUtils.ts, globalStateService.ts (APP_DEV guards)

## [1.1.8] - 2026-04-09
### Fixed
- Updated @import/shipment-library-react from ^2.1.0 to 2.3.1 to incorporate console.log removal from FSS-4747

## [1.1.7] - 2026-04-08
### Added
- Massive exception management upload screen with file selection and confirmation flow
- `uploadInspectionFile` service function with mock pending FSS-5234 endpoint
- `INSPECTION_MANAGEMENT_MASSIVE` route constant
### Fixed
- `ExceptionManagemetSummaryPage` breadcrumb using non-existent route constant
- `ExceptionManagementSummaryPage` test import typo
- `ExceptionManagementPage` navigate using hardcoded string instead of route constant

## [1.1.6] - 2026-04-06
### Fixed
- Remove console.log statements from i18n and ImageGallery components

## [1.1.5] - 2026-03-19
## FSS-5250
### Changed
- Replace warning icon with close-circle icon (FbcIcon) for error state in summary header
- Remove action subtitle from summary header, increase title font size
- Add formatInspectionType helper to display inspection codes with spaces and title case
- Update column definitions with minWidth for fixed columns and maxWidth with tooltip for dynamic columns
- Align processed counter color to mf-text-green-700 for consistency
- Show demo buttons in non-production environments using NODE_ENV condition
- Update demo button tests to reflect NODE_ENV condition
- Fix summary page tests after UI refactor (FbcIcon mock, color classes, formatted inspection types)
### Fixed
- yarn.lock missing after rebase causing CI --frozen-lockfile failure

## [1.1.4] - 2026-03-18
## FSS-5250
### Changed
- Align request and response types with confirmed backend contract (FSS-5297)
- Update ClassifyItem: purchaseOrderDetailId, action per item, inspectionTypeCode
- Add ClassifyUser to request (name, email from JWT)
- Update ClassifyResponseItem with camelCase fields aligned to BFF standard
- Add cacheId to response for backend-driven file download
- Update buildSummaryRows to use confirmed field names
- Add downloadInspectionSummary service function

## [1.1.3] - 2026-03-16
## FSS-5250
### Refactor
- Reemplazar ExpandableTable por patron tabla nativa HTML (mismo patron PurchaseOrderTable de scheduling)
- Corregir alineacion columnas dinamicas de tipos de inspeccion con colSpan={6}
- Colores InspectionTypeBadge adaptados a valores validos de FbcBadge
- InspectionManagementPage conectado a usePOInspectionSelection hook

## [1.1.2] - 2026-03-13
## FSS-5250
### Changed
- Migración POInspectionTable a ExpandableTable de @import/shipment-library-react
- Selección individual de SKUs via renderDetail con estado propio
- Checkbox OC padre expande sin preseleccionar SKUs
### Fixed
- Mock ExpandableTable en tests para entorno Jest
- Keys home.purchase_order_inspection en i18n es/en/zh para card del home

## [1.1.1] - 2026-03-13
## FSS-5250
### Added
- Componentes POInspectionTable, POInspectionRow, InspectionTypeBadge con selección múltiple
- Hook usePOInspectionSelection para manejo de selección por OC y detalle
- Mock purchaseOrderInspection.mock.ts con datos de prueba
### Changed
- InspectionManagementPage reemplaza placeholder por tabla real con columnas dinámicas
- Breadcrumb corregido a Inicio > Foreign Trade > Inspecciones > título
- Keys i18n purchase_order_inspection.table.* agregadas en es/en/zh
### Fixed
- Orden moduleNameMapper en jest.config.js para SVG mocks

## [1.1.0] - 2026-03-11

### Added
- Páginas `InspectionManagementPage` y `InspectionSummaryPage` para gestión de excepciones de inspección (Whitelist/Blacklist)
- Rutas `/purchase-order-inspection` y `/purchase-order-inspection/summary` registradas en `App.tsx`
- Tipos e interfaces en `purchaseOrderInspection.types.ts`
- Servicio mock `purchaseOrderInspectionService.ts`
- Keys i18n `purchase_order_inspection.*` en es/en/zh

## [1.0.3] - 2026-02-02
### Changed

-   El método `onSaveCategory` ahora muestra automáticamente un indicador de carga hasta que el servicio responda.

## [1.0.2] - 2025-12-17

### Added

-   Página de resumen de agendamiento (`SummarySchedulingPage`) que muestra el resumen de solicitudes de inspección.
-   Componente `Summary` para visualizar detalles de estilos, órdenes de compra, SKUs y tipo de inspección.
-   Nueva ruta `/summary` con protección de autenticación y roles.
-   Traducciones completas (español e inglés) para la sección de resumen de agendamiento.
-   Icono SVG `path.svg` para indicador visual de estilos.
-   Tabla Inspecciones Agendadas con detalle y navegación.

### Changed

-   `SetupInspectionPage` actualizado con flujo de navegación hacia página de resumen y manejo de estados de carga.
-   Configuración de Prettier agregada (`.prettierrc`) para mantener consistencia de código.


## [1.0.1] - 2025-11-12

### Added

-   MFE Inspections con funcionalidad completa para cargar órdenes de compra a las que se les puede agendar inspección.

## [1.0.0] - 2025-05-12

### Added

-   MFE Inspections con funcionalidad básica para cargar órdenes de compra a las que se les puede agendar inspección.
