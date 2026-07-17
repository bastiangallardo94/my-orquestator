---
phase_id: phase_2_frontend
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir y openspec/changes/*/proposal.md debe existir"
hash_inputs: [docs/CHANGELOG_LOGICO.md, AGENTS.md, openspec/changes/*/specs/, openspec/changes/*/proposal.md]
exit_check: static
exit_files: [docs/Plan_Frontend.md]
supports_partial_retry: false
max_retries: 3
---

# Phase 2 FRONTEND — Planificacion Tecnica

## Input: OpenSpec + Design References
Antes de escribir el plan:
1. Glob openspec/changes/*/specs/ → requirements + scenarios
2. Glob openspec/changes/*/proposal.md → contexto del cambio
3. Leer REF_DISENO de phase_1_analyze.json (si existe) → modo A/B de diseno

## Modo Frontend (A/B)
Si hay REF_DISENO en phase_1_analyze.json:
- Preguntar Modo A/B con question()
- Si no hay: preguntar con question()
- Leer planners/planner_front.md para elegir modo

## Output: docs/Plan_Frontend.md
Incluye:
1. Arquitectura de componentes (arbol de componentes)
2. Archivos a crear/modificar
3. Tests planificados (trazados a Requirements OpenSpec)
4. Checklist de implementacion

NOTA: Engram se maneja centralizadamente (core/engram_protocol.md). No guardes memoria aqui.

## Output Esperado
DEVUELVEME:
- PLAN_STATUS: SUCCESS | FAILED
- FILES_PLANNED: [lista]
- TESTS_PLANNED: N
- MODO_DISENO: A | B
- ERROR: solo si algo fallo
