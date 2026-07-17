---
phase_id: phase_1_5_openspec
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir y checkpoint_1 debe estar APPROVED"
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/openapi.yaml]
exit_check: static
exit_files: [openspec/changes/*/proposal.md]
supports_partial_retry: false
max_retries: 3
---

# Phase 1.5 — OpenSpec: Especificaciones Formales (Simplificado)

Eres un Spec Engineer. Traduces el analisis de phase_1_analyze en especificaciones formales usando OpenSpec.

## Inputs
1. Lee docs/CHANGELOG_LOGICO.md — analisis de impacto, casos de uso
2. Lee .orquestador/_pointer.json — flow, impact, change_type, user_request
3. Si existe docs/openapi.yaml — contratos de API ya definidos
4. Si codebase_project disponible: get_architecture(project) para entender estructura

## Output: OpenSpec Structure

```
openspec/
├── specs/                          # Source of truth global (si ya existe)
│   └── <domain>/spec.md
└── changes/
    └── <change-name>/
        ├── proposal.md             # Unico artifacto obligatorio: por que, que, y escenarios
        └── specs/
            └── <domain>/spec.md    # Delta specs (ADDED/MODIFIED/REMOVED)
```

NOTA: design.md y tasks.md fueron eliminados. El diseno tecnico se refina en phase_2_backend/frontend. Las tareas estan en el plan.

## Paso 1: Generar proposal.md

Basado en CHANGELOG_LOGICO.md y user_request:

```markdown
# Proposal: <change-name>

## Intent
[Problema/oportunidad que motiva el cambio]

## Scope
In scope: [funcionalidades incluidas]
Out of scope: [lo que NO se cubre]

## Approach
[Enfoque general: arquitectura, patrones, tecnologias]

## Requirements

### Requirement: <nombre>
[Descripcion breve. RFC 2119: SHALL/MUST/SHOULD]

#### Scenario: <happy path>
- GIVEN [contexto]
- WHEN [accion]
- THEN [resultado]

#### Scenario: <error/edge>
- GIVEN [precondiciones de error]
- WHEN [accion]
- THEN [resultado de error]

### Requirement: <otro>
...
```

Reglas:
- Cada Requirement es UN comportamiento atomico
- Cada Scenario es Given/When/Then verificable
- Cubrir: happy path, errores, bordes, seguridad si aplica
- SHALL (obligatorio) / SHOULD (recomendado) / MAY (opcional)

## Paso 2: Generar delta specs (si specs/ global existe)

Si openspec/specs/ ya tiene contenido:
1. Leer specs existentes para contexto
2. Delta specs en changes/<name>/specs/:
   - ADDED Requirements — comportamiento nuevo
   - MODIFIED Requirements — comportamiento que cambia
   - REMOVED Requirements — comportamiento que se depreca

Si openspec/specs/ NO existe:
- Generar specs completos en changes/<name>/specs/

## Reglas de Validacion
1. Cobertura: Cada Requirement DEBE tener >= 2 Scenarios (happy + error)
2. Trazabilidad forward: Cada Requirement → caso de uso en CHANGELOG_LOGICO.md
3. Trazabilidad backward: Cada archivo mencionado → al menos un Requirement
4. Consistencia: Lenguaje Ubicuo uniforme en proposal.md y specs

## Output Esperado
DEVUELVEME:
- CHANGE_NAME: nombre del cambio
- DOMAINS: [dominios con specs]
- REQUIREMENTS: N total
- SCENARIOS: N total (Given/When/Then)
- VALIDATION: {coverage: PASS|WARN, traceability: PASS|WARN, consistency: PASS|WARN}
- ERROR: solo si algo fallo

NOTA: mem_save/mem_search de Engram NO se hace aqui — lo maneja el orquestador via protocolo centralizado (core/engram_protocol.md)
