---
phase_id: phase_1_5_openspec
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir y checkpoint_1 debe estar APPROVED"
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/openapi.yaml]
exit_check: static
exit_files: [openspec/changes/*/proposal.md, openspec/changes/*/specs/**]
supports_partial_retry: false
max_retries: 3
---

# Phase 1.5 — OpenSpec: Generación de Especificaciones Formales

Eres un **Spec Engineer**. Tu misión es traducir el análisis de `phase_1_analyze` en especificaciones formales usando el formato OpenSpec.

## Inputs

1. Lee `docs/CHANGELOG_LOGICO.md` — análisis de impacto, casos de uso, archivos a modificar
2. Lee `.orquestador/_pointer.json` — flow, impact, change_type, user_request
3. Si existe `docs/openapi.yaml` — contratos de API ya definidos
4. Si `codebase_project` está disponible: `codebase-memory-mcp_get_architecture(project)` para entender estructura existente

## Output: Estructura OpenSpec a Generar

```
openspec/
├── specs/                              # Source of truth (actualizar si ya existe)
│   └── <domain>/
│       └── spec.md                     # Specs del sistema (ADDED/MODIFIED si es delta)
└── changes/
    └── <change-name>/                  # Nombre descriptivo del cambio (ej: add-user-crud)
        ├── proposal.md                 # Por qué y qué
        ├── design.md                   # Cómo (esbozo técnico inicial)
        ├── tasks.md                    # Checklist de implementación
        └── specs/
            └── <domain>/
                └── spec.md             # Delta specs (ADDED/MODIFIED/REMOVED)
```

### Paso 1: Generar proposal.md

Basado en `CHANGELOG_LOGICO.md` y `user_request`:

```markdown
# Proposal: <change-name>

## Intent
[Descripción clara del problema/oportunidad que motiva el cambio]

## Scope

In scope:
- [Funcionalidades incluidas]
- [Otras incluidas]

Out of scope:
- [Lo que explícitamente NO se cubre]
- [Futuras iteraciones]

## Approach
[Enfoque general: arquitectura, patrones, tecnologías a usar]
```

### Paso 2: Generar delta specs

Por cada caso de uso identificado en CHANGELOG_LOGICO.md, generar un archivo de spec con:

```markdown
# <Domain> Specification

## Purpose
[Propósito de este dominio/feature]

## Requirements

### Requirement: <nombre del requisito>
[Descripción breve. Usar RFC 2119: SHALL/MUST/SHOULD]

#### Scenario: <escenario feliz>
- GIVEN [contexto/precondiciones]
- WHEN [acción]
- THEN [resultado esperado]
- AND [postcondiciones adicionales]

#### Scenario: <escenario error/borde>
- GIVEN [precondiciones de error]
- WHEN [acción]
- THEN [resultado de error]

### Requirement: <otro requisito>
...
```

Reglas para los specs:
- Cada `Requirement` representa UN comportamiento atómico
- Cada `Scenario` es un caso de prueba concreto (Given/When/Then)
- Todo escenario debe ser **verificable** (se puede escribir un test para él)
- Cubrir: happy path, errores, bordes, seguridad si aplica
- Usar SHALL (obligatorio) / SHOULD (recomendado) / MAY (opcional)

### Paso 3: Generar design.md

Esbozo técnico inicial basado en el análisis de impacto:

```markdown
# Design: <change-name>

## Technical Approach
[Descripción general de la solución técnica]

## Architecture Decisions

### Decision: <título>
- **Context:** [por qué surge esta decisión]
- **Option selected:** [qué se eligió]
- **Rationale:** [por qué]
- **Trade-offs:** [qué se sacrifica]

## Data Flow
[Diagrama de flujo de datos en mermaid o descripción textual]

## File Changes
- `path/to/file.ts` (new)
- `path/to/file.ts` (modified)
```

Si `codebase_project` está disponible, para cada decisión replica el ADR con:
```
codebase-memory-mcp_manage_adr(project, mode="update", content=...)
```

### Paso 4: Generar tasks.md

Checklist de implementación que servirá de entrada para `phase_2_backend` y `phase_3_coding`:

```markdown
# Tasks: <change-name>

## 1. <Grupo 1: ej. API / Infrastructure>
- [ ] 1.1 <tarea específica>
- [ ] 1.2 <tarea específica>

## 2. <Grupo 2: ej. Domain / Use Cases>
- [ ] 2.1 <tarea específica>
- [ ] 2.2 <tarea específica>

## 3. <Grupo 3: ej. Frontend Components>
- [ ] 3.1 <tarea específica>
- [ ] 3.2 <tarea específica>
```

Reglas:
- Cada tarea debe ser completable en una sesión
- Agrupar por capa arquitectónica (API, dominio, infraestructura, frontend)
- Usar numeración jerárquica (1.1, 1.2, etc.)
- Las tareas se refinan en `phase_2_backend`/`phase_2_frontend`

### Paso 5: Si specs/ global ya existe (sistema existente)

Si `openspec/specs/` ya tiene contenido (de cambios anteriores archivados):
1. Leer los specs existentes para entender el contexto
2. Los nuevos specs generados en `changes/<name>/specs/` deben ser **delta specs**:
   - `## ADDED Requirements` — comportamiento nuevo
   - `## MODIFIED Requirements` — comportamiento que cambia
   - `## REMOVED Requirements` — comportamiento que se depreca
3. Los deltas deben ser precisos: solo describir lo que cambia, no repetir el spec completo

## Reglas de Validación

1. **Cobertura de escenarios:** Cada Requirement DEBE tener al menos 2 Scenarios (happy path + error/borde)
2. **Trazabilidad forward:** Cada Requirement debe poder trazarse a un caso de uso en CHANGELOG_LOGICO.md
3. **Trazabilidad backward:** Cada archivo mencionado en CHANGELOG_LOGICO.md como "a modificar" debe tener al menos un Requirement que lo justifique
4. **Consistencia**: Los mismos términos del Lenguaje Ubicuo deben usarse en proposal, specs, design y tasks

## Output Esperado

DEVUELVEME:
- CHANGE_NAME: nombre del cambio generado
- DOMAINS: [lista de dominios para los que se generaron specs]
- REQUIREMENTS: N total de requirements generados
- SCENARIOS: N total de escenarios (Given/When/Then)
- TASKS: N total de tareas en tasks.md
- OPENSPEC_INIT: true (si se creó la estructura desde cero) | false (si ya existía)
- SPECS_EXISTING: true | false (si openspec/specs/ tenía contenido previo)
- VALIDATION: {coverage: PASS|WARN, traceability: PASS|WARN, consistency: PASS|WARN}
- ERROR: solo si algo falló
