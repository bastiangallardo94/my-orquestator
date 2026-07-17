---
phase_id: phase_2_backend
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir y openspec/changes/*/proposal.md debe existir"
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/openapi.yaml, AGENTS.md, openspec/changes/*/specs/, openspec/changes/*/proposal.md]
exit_check: static
exit_files: [docs/Plan_Backend.md]
supports_partial_retry: false
max_retries: 3
---

# Phase 2 BACKEND — Planificacion Tecnica

## Input: OpenSpec Specs
Antes de escribir el plan, lee:
1. Glob openspec/changes/*/specs/ → requirements + scenarios
2. Glob openspec/changes/*/proposal.md → contexto del cambio

Para cada Requirement, identifica:
- Que capas toca? (API/application/domain/infrastructure)
- Que escenarios son verificables por tests backend?
- Que archivos nuevos/modificaciones implica?

## Output: docs/Plan_Backend.md

Incluye:
1. Arquitectura propuesta (capas, dependencias)
2. Archivos a crear/modificar (lista completa)
3. Tests planificados (trazados a Requirements OpenSpec)
4. Checklist de implementacion (tareas)

Cada Requirement de OpenSpec debe tener su test correspondiente en el plan.

NOTA: Engram se maneja centralizadamente (core/engram_protocol.md). No guardes memoria aqui.

## Output Esperado
DEVUELVEME:
- PLAN_STATUS: SUCCESS | FAILED
- FILES_PLANNED: [lista de archivos en el plan]
- TESTS_PLANNED: N
- OPENSPEC_REQUIREMENTS_COVERED: N/M
- ERROR: solo si algo fallo
