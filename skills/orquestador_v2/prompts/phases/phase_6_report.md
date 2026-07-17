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

Lee TODOS `.orquestador/phases/*.json` y compila metricas:

### A. Duracion
Para cada fase: `duration = completed_at - started_at`
Total: sum(duration) de todas las fases

### B. Metricas de Codigo
- Archivos creados/modificados: sum de todas las fases
- Tests totales: de phase_3_coding.json
- Cobertura: de phase_3_coding.json
- Compilacion: OK / FAILED
- Code Review Score: de phase_3_coding.json (si existe)

### C. Quality & Risk
- RBT Distribution: de phase_4_qa.json
- QA Status: de phase_4_qa.json
- OpenSpec Coverage: de phase_4_qa.json

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
1. Glob .orquestador/phases/*.json → lee TODOS
2. Extrae por fase: id, status, retries, started_at, completed_at, files_created, files_modified, files_skipped
3. Calcula duracion por fase

============================================================
## STEP 2: OPENSPEC ARCHIVE (si aplica)
============================================================
Si openspec_available == true en _pointer.json:
1. Leer openspec/changes/*/specs/ → delta specs del cambio activo
2. Mergear deltas a openspec/specs/:
   - ADDED → agregar al spec global
   - MODIFIED → reemplazar en spec global
   - REMOVED → eliminar del spec global
3. openspec archive (o mv manual a archive/)

============================================================
## STEP 3: GENERATE REPORT (inline)
============================================================

Usa la plantilla segun POINTER.flow. Rellena con datos reales de phases/*.json.

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
  📄 openspec/changes/*/proposal.md
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
## STEP 4: ENGRAM (centralized — see core/engram_protocol.md)
============================================================
1. Guardar resumen del pipeline como learning
2. Guardar decisiones arquitectonicas consolidadas como decision
3. Guardar patrones descubiertos como pattern
4. mem_session_summary + mem_session_end

============================================================
## STEP 5: CLEANUP
============================================================
1. Write .orquestador/phases/phase_6_report.json status=SUCCESS
2. Archivar .orquestador/ a .orquestador/history/{timestamp}/
3. TodoWrite: todos marcados completed
4. Presentar reporte inline al usuario
