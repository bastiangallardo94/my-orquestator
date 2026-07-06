# FBC MFE Generator

Skill para generar proyectos React microfrontend basados en templates de Falabella Business Center.

## Descripción

Esta skill crea proyectos microfrontend completamente configurados y ejecutables, listos para desarrollo inmediato. Elimina toda la configuración inicial permitiéndote enfocarte directamente en desarrollar features de negocio.

## Templates Disponibles

### 1. base-mfe
Microfrontend básico con configuración esencial.

**Características:**
- 1 feature (home) con código esqueleto
- Redux configurado (auth, config, tenant)
- i18n (español, inglés, chino)
- Routing básico
- Testing configurado
- Docker + GitHub Actions

**Ideal para:**
- Aplicaciones simples
- Punto de partida para nuevos proyectos
- Prototipos y POCs

### 2. feature-based-mfe
Microfrontend complejo para múltiples features.

**Características:**
- Basado en proyecto Inspection
- 1 feature de ejemplo (home)
- Carpeta `_templates/` para copiar al crear nuevas features
- Arquitectura por features + capas
- Todo lo de base-mfe +  estructura para apps grandes

**Ideal para:**
- Aplicaciones grandes con múltiples dominios
- Proyectos con muchas features de negocio
- Arquitectura escalable

### 3. router-mfe
Orquestador que carga otros microfrontends dinámicamente.

**Características:**
- Basado en proyecto Maintainers Router
- Código completo de routing con mount/unmount
- Configuración de Module Federation lista
- 2 remotes de ejemplo configurados
- Error handling incluido

**Ideal para:**
- Puntos de entrada que agregan otros MFEs
- Páginas de selección de módulos
- Orchestrators

## Uso

### Invocar la Skill

Simplemente di a OpenCode:

```
"Crea un nuevo microfrontend"
"Genera un proyecto MFE base"
"Create a feature-based microfrontend"
"Necesito un router MFE"
```

### Flujo de Creación

1. **Selección de template**: Elige base-mfe, feature-based-mfe, o router-mfe
2. **Configuración**: Responde 8-9 preguntas simples
3. **Generación**: La skill copia el template y reemplaza placeholders
4. **Instalación**: Opcionalmente instala dependencias con Bun
5. **¡Listo!**: Navega al proyecto y ejecuta `bun start`

### Preguntas que se Harán

1. **Template Type**: ¿Qué tipo de proyecto? (base-mfe, feature-based-mfe, router-mfe)
2. **Project Location**: ¿Dónde crear el proyecto? (path absoluto)
3. **APP_NAME**: Nombre técnico (PascalCase, ej: `importInspections`)
4. **PACKAGE_NAME**: Nombre del paquete NPM (ej: `mrch.frtr.frontend.inspections`)
5. **CSS_PREFIX**: Prefijo de Tailwind (ej: `insp-`)
6. **PORT**: Puerto de desarrollo (default: 8500)
7. **APP_PATH**: Path en el portal (ej: `/foreign-trade/inspections`)
8. **REMOTES** (solo router): Lista de MFEs remotos (opcional)
9. **Install Dependencies**: ¿Instalar dependencias ahora?

## Requisitos

- **Node.js**: 22.21.1 (usa `nvm use 22.21.1`)
- **Bun**: >=1.3.14 (instalar desde [bun.sh](https://bun.sh))
- **Git**: Para control de versiones (opcional)

## Estructura de la Skill

```
~/.agents/skills/fbc-mfe-generator/
├── SKILL.md                          # Workflow de OpenCode
├── README.md                         # Esta documentación
├── scripts/                          # Scripts de validación y testing
│   ├── validate-placeholders.sh      # Valida placeholders en proyecto generado
│   ├── test-all-templates.sh         # Prueba todos los templates
│   └── project-summary.sh            # Muestra resumen post-generación
├── templates/                        # Templates completos
│   ├── base-mfe/                     # Template básico (17 deps)
│   ├── feature-based-mfe/            # Template complejo (30 deps)
│   └── router-mfe/                   # Template orchestrator (17 deps)
└── docs/                             # Documentación adicional
    ├── template-comparison.md        # Comparación detallada de templates
    ├── dependency-profiles-guide.md  # Guía de perfiles de dependencias
    ├── fase1-completed.md            # Resumen de Fase 1
    └── ...                           # Otros documentos
```

## Stack Tecnológico (Todos los Templates)

### Core
- React 18.3.1
- TypeScript 5.9.3 (strict mode)
- Node 22.21.1

### Build & Tooling
- Rspack 2.0.4 (bundler)
- Bun (package manager)
- Module Federation (microfrontends)
- Single-SPA 6.0.3

### Estado y Datos
- Redux Toolkit 1.9.7
- Redux Persist 6.0.0
- Redux Micro Frontend 1.3.0
- Axios 1.13.2

### UI
- Material UI 7.3.6
- Emotion 11.14.0 (CSS-in-JS)
- Tailwind CSS 3.0.0 (con prefix personalizable)

### i18n
- i18next 25.6.0
- react-i18next 16.1.3
- Idiomas: es, en, zh

### Formularios
- React Hook Form 7.72.1
- Yup 1.7.1

### Testing
- Jest 29.7.0
- React Testing Library 14.2.1
- ts-jest 29.1.2

### Linting
- ESLint 8.57.1
- TypeScript ESLint 7.18.0
- Prettier (configurado)

### DevOps
- Docker (multi-stage builds)
- GitHub Actions / GitLab CI
- Husky (pre-commit hooks)

## Path Aliases (Todos los Templates)

Los 7 path aliases configurados:

```typescript
"@core/*"           → "src/core/*"
"@context/*"        → "src/context/*"
"@features/*"       → "src/features/*"
"@shared/*"         → "src/shared/*"
"@infrastructure/*" → "src/infrastructure/*"
"@services/*"       → "src/services/*"
"@types/*"          → "src/types/*"
```

Configurados en:
- `tsconfig.json`
- `rspack.config.js`
- `jest.config.js`

## Ejemplo de Uso

```bash
# En OpenCode
"Crea un feature-based microfrontend"

# La skill pregunta:
# Template Type: feature-based-mfe
# Project Location: /Users/bgallardoc/Documents/proyects/my-inspections
# APP_NAME: importInspections
# PACKAGE_NAME: mrch.frtr.frontend.inspections
# CSS_PREFIX: insp-
# PORT: 8500
# APP_PATH: /foreign-trade/inspections
# Install Dependencies: yes

# ✅ Proyecto creado!

# Navegar y ejecutar
cd /Users/bgallardoc/Documents/proyects/my-inspections
bun start

# Abrir navegador
# http://localhost:8500
```

## Personalización Post-Generación

### Agregar una nueva feature (feature-based-mfe)

```bash
# Copiar template
cp -r src/features/_templates/feature-template src/features/my-new-feature

# Renombrar archivos
mv src/features/my-new-feature/ExamplePage.tsx src/features/my-new-feature/MyNewFeaturePage.tsx

# Actualizar imports

# Agregar ruta en src/App.tsx
<Route path="/my-new-feature" element={
  <PrivateRoute>
    <AppLayout>
      <MyNewFeaturePage />
    </AppLayout>
  </PrivateRoute>
} />
```

### Agregar un remote (router-mfe)

1. Editar `module-federation.config.js`:
```javascript
remotes: {
  myNewRemote: "myNewRemote@http://localhost:8503/remoteEntry.js"
}
```

2. Actualizar `src/features/router/RouterPage.tsx`:
```typescript
if (selectedMfe === "new-remote") {
  mfeModule = await import("myNewRemote/App");
}
```

### Cambiar puerto

1. Editar `src/constants/environment.config.js`:
```javascript
APP_PORT: { default: 8600, type: "number" }
```

2. Actualizar `.env.development`:
```
APP_PORT=8600
```

### Registrar en el App Shell

Todos los templates incluyen un archivo `apps.json` para facilitar el registro en el app-shell del portal.

**Ubicación**: `/apps.json` (raíz del proyecto)

**Contenido** (con placeholders ya reemplazados):
```json
[
  {
    "appName": "importInspections",
    "componentImport": "importInspections/App",
    "routes": "['/foreign-trade/inspections']",
    "show": "showWhenPrefix",
    "appRemoteName": "importInspections",
    "remote": "http://localhost:8000/remoteEntry.js"
  }
]
```

**Campos**:
- `appName`: Identificador único del MFE (igual a APP_NAME)
- `componentImport`: Module Federation import (`{APP_NAME}/App`)
- `routes`: Rutas que activan este MFE (array como string)
- `show`: Estrategia de visibilidad (`showWhenPrefix` es estándar)
- `appRemoteName`: Nombre del remote (igual a APP_NAME)
- `remote`: URL del `remoteEntry.js` (puerto 8000 por defecto)

**Para registrar tu MFE en el portal**:

1. Copia el contenido de `apps.json`
2. Pégalo en `packages/mrch.frontend.cross.app-shell/apps.json` del portal
3. Ajusta el puerto `remote` al puerto real de tu MFE (ej: 8500)
4. Reinicia el app-shell

**Ejemplo de múltiples MFEs**:
```json
[
  {
    "appName": "importInspections",
    "componentImport": "importInspections/App",
    "routes": "['/foreign-trade/inspections']",
    "show": "showWhenPrefix",
    "appRemoteName": "importInspections",
    "remote": "http://localhost:8500/remoteEntry.js"
  },
  {
    "appName": "importMaintainersRouter",
    "componentImport": "importMaintainersRouter/App",
    "routes": "['/foreign-trade/maintainers']",
    "show": "showWhenPrefix",
    "appRemoteName": "importMaintainersRouter",
    "remote": "http://localhost:8501/remoteEntry.js"
  }
]
```

## Scripts Disponibles

Todos los proyectos generados incluyen:

```json
{
  "start": "Inicia dev server",
  "build": "Build de producción",
  "build:dev": "Build de desarrollo",
  "lint": "Ejecuta ESLint",
  "lint:fix": "Fix automático de linting",
  "test": "Ejecuta tests con coverage",
  "test:watch": "Tests en watch mode",
  "test:ci": "Tests para CI/CD",
  "type-check": "Verifica tipos TypeScript"
}
```

Ejecución con Bun:
```bash
bun start
bun test
bun lint
```

## Scripts de Validación y Testing

La skill incluye scripts automatizados para validar y probar templates:

### 1. validate-placeholders.sh

Valida que todos los placeholders fueron reemplazados correctamente en un proyecto generado.

**Ubicación**: `~/.agents/skills/fbc-mfe-generator/scripts/validate-placeholders.sh`

**Uso**:
```bash
./scripts/validate-placeholders.sh /path/to/generated/project

# Ejemplo
./scripts/validate-placeholders.sh /Users/bgallardoc/Documents/proyects/my-new-mfe
```

**Qué valida**:
- Busca placeholders `{{XXX}}` en archivos relevantes
- Excluye node_modules, dist, .git
- Excluye objetos JavaScript (`{ {`, `{{ `)
- Muestra ubicaciones de placeholders restantes
- Explica el significado de cada placeholder

**Salida exitosa**:
```
✅ SUCCESS: No placeholders found
All placeholders have been replaced!
```

**Salida con errores**:
```
❌ FAILED: Found 5 placeholder(s)

Placeholders found:
./src/App.tsx:10:  name: "{{APP_NAME}}"
./package.json:2:  "name": "{{PACKAGE_NAME}}"

Please replace these placeholders:
{{APP_NAME}}
{{PACKAGE_NAME}}

Placeholder meanings:
  {{APP_NAME}}      - Application name (camelCase)
  {{PACKAGE_NAME}}  - NPM package name
  ...
```

**Exit codes**:
- `0` - No placeholders found (success)
- `1` - Placeholders still exist (failure)

---

### 2. test-all-templates.sh

Prueba la generación completa de todos (o algunos) templates, validando que funcionan correctamente.

**Ubicación**: `~/.agents/skills/fbc-mfe-generator/scripts/test-all-templates.sh`

**Uso**:
```bash
# Probar todos los templates
./scripts/test-all-templates.sh

# Probar solo un template
./scripts/test-all-templates.sh base-mfe

# Probar múltiples
./scripts/test-all-templates.sh base-mfe router-mfe
```

**Qué hace** (para cada template):
1. **Copia template** → `/tmp/fbc-mfe-generator-tests/{template}-test`
2. **Reemplaza placeholders** (8 valores de prueba)
3. **Valida placeholders** (usando validate-placeholders.sh)
4. **Instala dependencias** (bun install)
5. **Ejecuta type-check** (bun type-check)

**Configuración de prueba**:
```bash
base-mfe:
  APP_NAME: testBase
  PACKAGE_NAME: mrch.frtr.frontend.test-base
  CSS_PREFIX: tb
  SCOPE_CLASS: tb-test-base-scope
  APP_PORT: 8506
  APP_PATH: /foreign-trade/test-base
  DISPLAY_NAME: Test Base

router-mfe:
  APP_NAME: testRouter
  APP_PORT: 8507
  ...

feature-based-mfe:
  APP_NAME: testFeature
  APP_PORT: 8508
  ...
```

**Salida**:
```
🧪 TEMPLATE TESTING SUITE
📂 Templates dir: ~/.agents/skills/fbc-mfe-generator/templates
📁 Output dir: /tmp/fbc-mfe-generator-tests
🎯 Testing: base-mfe

📦 Testing: base-mfe
  ✅ Step 1/5: Template copied
  ✅ Step 2/5: Placeholders replaced
  ✅ Step 3/5: No placeholders remaining
  ✅ Step 4/5: Dependencies installed (634 packages)
  ✅ Step 5/5: Type-check passed
  
✅ Template base-mfe: PASSED

📊 TEST SUMMARY
Total: 1
Passed: 1
Failed: 0

🎉 All tests passed!
```

**Exit codes**:
- `0` - All tests passed
- `1` - Some tests failed

**Dependencias**:
- bash
- sed
- find
- bun
- grep

**Duración aproximada**:
- base-mfe: ~10s (copy + replace + install + type-check)
- router-mfe: ~10s
- feature-based-mfe: ~20s

---

### 3. project-summary.sh

Muestra un resumen detallado del proyecto generado al finalizar la creación.

**Ubicación**: `~/.agents/skills/fbc-mfe-generator/scripts/project-summary.sh`

**Uso** (llamado automáticamente por SKILL.md):
```bash
./scripts/project-summary.sh \
  /path/to/project \
  template-name \
  app-name \
  app-port \
  "Display Name"

# Ejemplo
./scripts/project-summary.sh \
  /Users/bgallardoc/Documents/proyects/my-new-mfe \
  base-mfe \
  myApp \
  8500 \
  "My New App"
```

**Qué muestra**:
```
╔════════════════════════════════════════════════════╗
║      🎉 PROJECT GENERATED SUCCESSFULLY! 🎉         ║
╚════════════════════════════════════════════════════╝

📦 PROJECT INFORMATION
  Name:         My New App
  Location:     /Users/.../my-new-mfe
  Template:     base-mfe
  App Name:     myApp
  Port:         8500

📊 PROJECT STATISTICS
  Total files:              152
  TypeScript files:         69
  Dependencies declared:    91
  Packages installed:       962
  Estimated install time:   ~2s

🚀 NEXT STEPS
  1. Navigate to your project:
     cd /Users/.../my-new-mfe
  
  2. Install dependencies:
     bun install
  
  3. Start development server:
     bun start
  
  4. Open in browser:
     http://localhost:8500
  
  5. Start coding!
     Edit src/features/home/pages/HomePage.tsx

⚡ USEFUL COMMANDS
  Development:
    bun start              # Start dev server
    bun start:live         # Start with hot reload

  Building:
    bun build              # Production build
    bun serve              # Serve production build

  Quality:
    bun type-check         # TypeScript validation
    bun lint               # ESLint check
    bun test               # Run tests

📚 IMPORTANT FILES
  Configuration:
    .env.development
    rspack.config.js
    module-federation.config.js
    apps.json

  Entry Points:
    src/index.tsx
    src/App.tsx
    src/features/home/

💡 TIPS FOR BASE-MFE
  • Simple and clean structure - perfect starting point
  • Add new features in src/features/
  • Update routes in src/App.tsx
  • Customize colors in tailwind.config.js

╔════════════════════════════════════════════════════╗
║               Happy coding! 🚀                     ║
╚════════════════════════════════════════════════════╝
```

**Características**:
- Output con colores (verde, azul, amarillo, cyan)
- Estadísticas del proyecto
- Pasos claros para empezar
- Comandos útiles categorizados
- Tips específicos por template
- Archivos importantes destacados

---

### Cuándo Usar Cada Script

| Script | Cuándo Usar | Frecuencia |
|--------|-------------|------------|
| `validate-placeholders.sh` | Después de generar un proyecto | Cada generación |
| `test-all-templates.sh` | Antes de commit, después de cambios | Semanal / antes de release |
| `project-summary.sh` | Automático al finalizar generación | Cada generación |

**Recomendación**: Ejecuta `test-all-templates.sh` antes de hacer cambios importantes en los templates para asegurar que todo sigue funcionando.

---

### Integración con Workflow de Desarrollo

**Workflow sugerido para mantener la skill**:

1. **Hacer cambios en templates**
   ```bash
   # Editar archivos en templates/base-mfe/
   vim ~/.agents/skills/fbc-mfe-generator/templates/base-mfe/src/App.tsx
   ```

2. **Probar cambios**
   ```bash
   # Ejecutar test suite
   ~/.agents/skills/fbc-mfe-generator/scripts/test-all-templates.sh base-mfe
   ```

3. **Si pasa, commit**
   ```bash
   git add templates/base-mfe/
   git commit -m "feat: update base-mfe template"
   ```

4. **Si falla, arreglar y repetir**

---

## Scripts Disponibles (CONTINUACIÓN)

## Troubleshooting

### Error: Node version mismatch
```bash
# Solución
nvm use 22.21.1
```

### Error: Bun not found
```bash
# Instalar Bun
curl -fsSL https://bun.sh/install | bash
```

### Error: Port already in use
```bash
# Cambiar puerto en .env.development
APP_PORT=8501
```

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules bun.lockb
bun install
```

## Mantenimiento de la Skill

### Actualizar Templates

Cuando actualices los proyectos originales (Inspection, Router):

1. Copia archivos actualizados a `templates/{template-name}/`
2. Reemplaza valores hardcodeados con placeholders:
   - Nombres → `{{APP_NAME}}`
   - Puertos → `{{APP_PORT}}`
   - Paths → `{{APP_PATH}}`
   - CSS → `{{CSS_PREFIX}}`, `{{SCOPE_CLASS}}`
3. Verifica que Dockerfile y GitHub Actions se copian sin modificar
4. Prueba generando un proyecto

### Agregar Nuevo Template

1. Crea carpeta en `templates/nuevo-template/`
2. Copia proyecto base
3. Reemplaza valores con placeholders
4. Actualiza SKILL.md con descripción del nuevo template
5. Prueba generación

## Soporte

Para reportar issues o sugerencias sobre esta skill, contacta al equipo de desarrollo.

## License

Uso interno - Falabella Business Center

---

**Versión**: 2.0.0  
**Última actualización**: Mayo 2026 
**Autor**: Falabella Tech Team

### Changelog

#### v2.0.0 (Mayo 2026)
- ✅ Fase 2 completada (Should Have)
- ✅ Template selection helper con tabla comparativa
- ✅ Project summary report al finalizar generación
- ✅ Dependency profiles guide (minimal/standard/full)
- ✅ Scripts de validación documentados (validate-placeholders.sh, test-all-templates.sh)

#### v1.0.0 (Mayo 2025)
- ✅ Fase 1 completada (Must Have)
- ✅ 3 templates funcionales (base-mfe, router-mfe, feature-based-mfe)
- ✅ Scripts de validación (validate-placeholders.sh, test-all-templates.sh)
- ✅ Documentación completa
