---
phase_id: phase_5_7_pull_request
type: agent
agent: orquestador-fast
entry_condition: "checkpoint_4 debe estar APPROVED"
hash_inputs: [docs/CHANGELOG_LOGICO.md]
exit_check: static
exit_files: [docs/pr-body.md]
supports_partial_retry: false
max_retries: 2
---

# Phase 5.7 — Pull Request + Merge

Automatiza la creacion del PR con toda la informacion del pipeline.

## Inputs
1. .orquestador/_pointer.json → flow, change_type
2. .orquestador/phases/phase_3_coding.json → files, tests, coverage
3. .orquestador/phases/phase_4_qa.json → QA_STATUS, RBT
4. .orquestador/phases/phase_6_report.json → telemetry metrics
5. docs/CHANGELOG_LOGICO.md → descripcion del cambio

## Steps
1. Detectar rama base: HEAD remoto → AGENTS.md → fallback "main"
2. Confirmar con question() — permite override manual
3. Preguntar antes de push: question() "Pushear cambios?"
4. Recolectar artefactos para el cuerpo del PR:
   - CHANGELOG_LOGICO.md → descripcion
   - phase_3_coding.json → archivos, tests, cobertura
   - phase_4_qa.json → QA status
   - phase_6_report → telemetry y efficiency
5. gh pr create con labels automaticos
6. Fallback: docs/pr-body.md si gh CLI no disponible
7. Preguntar merge: squash / merge commit / manual

(Memoria Engram: no es necesario aqui — la pipeline ya persistio en phase_6)
