---
name: generate-agents-md
description: >-
  Genera o actualiza AGENTS.md en la raíz del proyecto con información
  completa del stack, arquitectura, convenciones y reglas que una IA
  debe conocer para trabajar efectivamente en el proyecto.
---

# Generate AGENTS.md

## Cuándo usar este skill

Usa este skill cuando el usuario pida explícitamente:
- "genera AGENTS.md"
- "actualiza AGENTS.md"
- "setup project rules"
- "configura las reglas del proyecto"
- "/init" (equivalente a opencode /init)

## Flujo de trabajo

### Fase 0: Verificar AGENTS.md existente

1. Verificar si ya existe `AGENTS.md` en la raíz del proyecto.
2. Si existe, leerlo completo para entender lo que ya contiene y decidir si actualizar o reemplazar.
3. Preguntar al usuario si quiere sobrescribir o complementar el existente.

### Fase 1: Análisis del proyecto

El skill DEBE analizar el proyecto leyendo los siguientes archivos en orden:

#### 1. Archivo de módulo/dependencias
- Go: `go.mod` → Go version, module name, dependencias directas
- Node.js: `package.json` → name, scripts, dependencias
- Python: `pyproject.toml` o `requirements.txt`
- Rust: `Cargo.toml`
- Java/Kotlin: `pom.xml` o `build.gradle`

#### 2. Estructura de directorios
Usar `read` en la raíz y subdirectorios clave para entender la estructura.

#### 3. Archivos de configuración del proyecto
- `Dockerfile`, `docker-compose*.yml`
- `.env.example` o `.env`
- `Makefile`
- Archivos de CI/CD (`.github/workflows/`, `.gitlab-ci.yml`)
- Configuración de infraestructura (Kustomize, Helm, Terraform)

#### 4. Configuración del lenguaje/herramientas
- Go: `sqlc.yaml`, `.golangci.yml`
- TypeScript/JavaScript: `tsconfig.json`, `.eslintrc`, `.prettierrc`
- Python: `setup.cfg`, `ruff.toml`
- Rust: `rustfmt.toml`, `clippy.toml`

#### 5. Código fuente (arquitectura)
- Entrypoints (`cmd/`, `src/main.ts`, `src/index.ts`, `main.py`)
- Capas/Directorios de dominio/negocio
- Interfaces/contratos
- Implementaciones de infraestructura
- Tests existentes → identificar framework y patrones

#### 6. Base de datos
- Migraciones (`db/migrations/`)
- Queries (`db/queries/`)
- Archivos ORM/schema

#### 7. Despliegue
- Manifiestos Kubernetes (Kustomize, Helm)
- Scripts de deploy
- Configuración por ambiente

### Fase 2: Generar AGENTS.md

Generar el archivo `AGENTS.md` en la raíz del proyecto con la siguiente estructura. **NO incluir comentarios de sección vacía si no hay información disponible.**

```markdown
# <Project Name>

## Project Overview
- Propósito del proyecto (una línea)
- Estado actual (features implementadas vs planificadas)

## Tech Stack
- Lenguaje, versión
- Framework / Web server
- Base de datos, ORM/query builder
- Librerías clave (trazabilidad, logging, auth, etc.)
- Herramientas de build (Makefile, Docker multi-stage, etc.)
- Infraestructura cloud (GCP/AWS/Azure + servicios usados)
- CI/CD platform

## Project Structure
Explicar cada directorio raíz con su propósito. Usar lista:
- `cmd/` - Entrypoints de la aplicación
- `internal/` - Código interno (no exportable)
- ...

## Architecture
Describir la arquitectura y el flujo de dependencias.

Ejemplo para Clean/Hexagonal:
```
cmd/ (entrypoint)
  → internal/app/ (composición de dependencias / DI)
    → internal/services/ (casos de uso)
      → internal/ports/ (interfaces / contratos)
        → internal/adapters/ (implementaciones)
        → internal/domain/ (entidades + reglas de negocio)
```

## Domain Model
Entidades principales, relaciones y reglas de negocio críticas.

## Code Conventions
- Convenciones de nomenclatura
- Patrón de errores (sentinel errors, error wrapping)
- Patrón de repositorios con interfaces
- Manejo de transacciones
- Concurrencia (optimistic locking, version fields)
- Validación de dominio

## Database
- Motor y versión
- Driver
- Herramienta de migraciones
- Configuración de pool de conexiones
- Tablas principales (con nombres y propósito breve)

## Testing
- Framework de testing
- Patrones (table-driven tests, suites, mocks)
- Cobertura esperada
- Comandos para correr tests

## Environment Variables
Listar variables de entorno clave con descripción y default.

## Critical Rules for AI
Reglas NO negociables que la IA debe seguir al trabajar en el proyecto:
- NO modificar archivos generados automáticamente (sqlc, protobuf, graphql)
- NO romper la dirección de dependencias de la arquitectura
- Usar exclusivamente los patrones de error definidos en el dominio
- Seguir las convenciones de naming del proyecto
- NO agregar dependencias externas sin aprobación
```

### Fase 3: Escribir o actualizar el archivo

1. Usar `write` para crear/sobrescribir `AGENTS.md` si el usuario lo autorizó.
2. O usar `edit` para complementar el archivo existente si corresponde.

### Fase 4: Mostrar resumen

Al finalizar, mostrar al usuario:
- Ruta del archivo generado/actualizado
- Secciones incluidas
- Sugerencia de commit si aplica

## Ejemplo de salida parcial

Para un proyecto Go con Clean Architecture, PostgreSQL y sqlc, el AGENTS.md generado incluiría:

```markdown
# Booking Request Container

## Project Overview
Microservicio para distribución de mercancía en contenedores (booking request container distribution).
Implementa asignación de ítems PO-SKU, prepacks, cartones y pallets en contenedores de envío.

## Tech Stack
- Go 1.26
- Internal framework: go-kit (HTTP server, middleware auth/tracing/logger)
- PostgreSQL 16, pgx/v5
- sqlc v1.30 (type-safe query generation)
- goose v3 (migrations)
- DataDog APM (dd-trace-go)
- GCP: Secret Manager, Artifact Registry, GKE
- Docker multi-stage (distroless/static)
- Kustomize (dev/uat/prod overlays)
- GitHub Actions CI/CD

## Architecture
Clean / Hexagonal Architecture:
- `internal/domain/` — Entidades + reglas de negocio (sin imports de infraestructura)
- `internal/ports/` — Interfaces de repositorio y casos de uso
- `internal/adapters/` — Implementaciones (HTTP, PostgreSQL)
- `internal/services/` — Casos de uso / servicios de aplicación
- `internal/app/` — DI manual con provider functions
- `cmd/` — Entrypoints (API server + migration runner)

## Critical Rules
- NO modificar archivos en `internal/adapters/outbound/postgres/sqlc/` (generados por sqlc)
- Las entidades de dominio NO deben importar nada de infraestructura
- Usar `errors.Is()` para comparar sentinel errors definidos en `internal/domain/errors.go`
- Las entidades tienen validación embebida (métodos Validate, ValidateDistribution)
- Usar campos `Version` para optimistic concurrency control
```

## Notas adicionales

- Este skill es genérico: analiza el proyecto que tenga enfrente y genera AGENTS.md acorde.
- Si el proyecto usa un framework o patrón no reconocido, describirlo lo mejor posible basado en lo que se observa en el código.
- AGENTS.md debe ser conciso pero completo: suficiente para que una IA entienda el proyecto sin tener que leer cientos de archivos.
