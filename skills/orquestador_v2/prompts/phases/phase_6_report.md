---
phase_id: phase_6_report
type: report
agent: null
entry_condition: "ninguna (fase final)"
hash_inputs: []
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 1
---

# Phase 6 — Reporte Final (+ Pipeline Telemetry)

Esta fase la ejecuta el orquestador directamente (no se delega a subagente).

============================================================
## STEP 0: PIPELINE TELEMETRY (inline, antes del reporte)
============================================================

Lee `.orquestador/state.yaml` → phases{} y compila metricas:

### A. Duracion
Para cada fase: `duration = completed_at - started_at`
Total: sum(duration) de todas las fases

### B. Metricas de Codigo
- Archivos creados/modificados: sum de todas las fases
- Tests totales: de state.phases.phase_3_coding (si existe)
- Cobertura: de state.phases.phase_3_coding
- Compilacion: OK / FAILED
- Code Review Score: de state.phases.phase_3_coding (si existe)

### C. Quality & Risk
- RBT Distribution: de state.phases.phase_4_qa
- QA Status: de state.phases.phase_4_qa
- Scenario Coverage: de state.phases.phase_4_qa (SCENARIO_COVERAGE)

### D. Efficiency Score (0-100)
```
efficiency = 100
if retries > 0:   -5 * retries
if lint FAIL:     -10
if compile FAIL:  -15
if QA retries > 1: -10
```

Score 90-100 🟢 Optimo | 70-89 🟡 Aceptable | 50-69 🟠 Mejorable | <50 🔴 Ineficiente

### E. Trend (history)
Si existe pipeline anterior en `.orquestador/history/`:
- Comparar duracion, tests, cobertura vs actual
- Generar delta

============================================================
## STEP 1: GATHER PHASE DATA
============================================================
1. `state(projectPath=cwd)` → lee state.yaml → phases{}
2. Extrae por fase: id, status, retries, started_at, completed_at, files_created, files_modified, files_skipped
3. Calcula duracion por fase

============================================================
## STEP 2: GENERATE REPORT (inline)
============================================================

Usa la plantilla segun state.flow. Rellena con datos reales de state.phases{}.

### Plantilla TACTICO:
```
========================================
   CICLO DE DESARROLLO TACTICO
========================================
Flujo:          TACTICO
Impacto:        {BACKEND | FRONTEND | FULLSTACK}

Checkpoint 1 (Analisis):       {✅ | ❌}
Checkpoint 2 (Plan Tecnico):   {✅ | ❌}
Checkpoint 3 (Codificacion):   {✅ | ❌}
Checkpoint 4 (QA):             {✅ | ❌}

Artefactos:
  📄 CHANGELOG_LOGICO.md
  📄 Plan_Backend.md / Plan_Frontend.md
  📄 qa-report.md

QA: {SUCCESS | FAILED}
Trazabilidad: {X%} tests del plan verificados
Fallidos: [ids o ninguno]
========================================
```

### Plantilla COMPLETO (incluye docs tecnicos):
Misma estructura + docs/technical/*.

### Bloque de Metricas (SIEMPRE):
```
## Metricas del Pipeline
| Fase | Estado | Reintentos | Duracion |
|------|--------|------------|----------|

## Telemetry Dashboard
Duration: {N}min {N}s
Efficiency: {N}/100 ({etiqueta})
Total Phases: {N} ({N} OK, {N} failed)
Total Files Created: {N}
Total Files Modified: {N}
Tests: {passing}/{total}
Coverage: {N}%
RBT Distribution: 🔴{N} 🟠{N} 🟡{N} 🟢{N}
QA Status: {status}
Trend: {vs previo o N/A}

Resumen: {N}/{M} fases exitosas, {R} reintentos totales.
```

============================================================
## STEP 3: ENGRAM (delegado a protocolo centralizado)
============================================================
Seguir prompts/core/engram_protocol.md → Session Lifecycle (Phase 6).
NO dupliques pasos aqui — el protocolo centralizado es la unica fuente de verdad.

============================================================
## STEP 4: CLEANUP
============================================================
1. Actualizar state.phases.phase_6_report.status=SUCCESS via state tool
2. Archivar .orquestador/ a .orquestador/history/{timestamp}/ via cleanup tool
3. TodoWrite: todos marcados completed
4. Presentar reporte inline al usuario
