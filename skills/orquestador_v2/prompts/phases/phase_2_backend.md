---
phase_id: phase_2_backend
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir y contener seccion ## Especificaciones con al menos un REQ-XXX"
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/openapi.yaml, AGENTS.md]
exit_check: static
exit_files: [docs/Plan_Backend.md]
supports_partial_retry: false
max_retries: 3
---

# Phase 2 BACKEND — Planificacion Tecnica

## Input: CHANGELOG_LOGICO.md con Especificaciones
NOTA: CHANGELOG_LOGICO.md acumula entradas historicas. La seccion activa es siempre la **primera** `## Especificaciones` del archivo (entrada mas reciente). Ignora las anteriores.

Antes de escribir el plan, lee:
1. docs/CHANGELOG_LOGICO.md → primera seccion ## Especificaciones con REQ-XXX y SC-XXX
2. Extrae contexto del cambio de la primera seccion de impacto
3. Si hay cambios de API (openapi.yaml o nuevos endpoints): Read prompts/core/04-contract-testing.md

Para cada REQ-XXX, identifica:
- Que capas toca? (API/application/domain/infrastructure)
- Que SC-XXX son verificables por tests backend?
- Que archivos nuevos/modificaciones implica?

## Output: docs/Plan_Backend.md

Incluye:
1. Arquitectura propuesta (capas, dependencias)
2. Archivos a crear/modificar (lista completa)
3. Tests planificados (trazados a REQ-XXX)
4. Checklist de implementacion (tareas)

Cada REQ-XXX debe tener su test correspondiente en el plan.

NOTA: Engram se maneja centralizadamente (core/engram_protocol.md). No guardes memoria aqui.

## Output Esperado
DEVUELVEME:
- PLAN_STATUS: SUCCESS | FAILED
- FILES_PLANNED: [lista de archivos en el plan]
- TESTS_PLANNED: N
- REQ_COVERED: N/M (REQ-XXX trazados al plan)
- ERROR: solo si algo fallo
