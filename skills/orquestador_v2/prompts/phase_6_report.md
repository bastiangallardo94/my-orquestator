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

# Phase 6 — Reporte Final

Esta fase la ejecuta el orquestador directamente (no se delega a un subagente vía `task()`).

## Pasos

1. `Glob .orquestador/phases/*.json` → lee TODOS los archivos encontrados.
2. Para cada uno, extrae: `id`, `status`, `retries`, `started_at`, `completed_at`, `files_created`, `files_modified`, `files_skipped`.
3. Calcula duración por fase si `started_at`/`completed_at` están presentes (`completed_at - started_at`).
4. Arma la tabla de métricas (ver plantilla al final).
5. Usa la plantilla de reporte según `POINTER.flow` (COMPLETO o TÁCTICO) de más abajo, sustituyendo los placeholders `{...}` con los valores reales leídos de `phases/*.json` y `_pointer.json`.
6. Presenta el reporte inline en tu respuesta al usuario (no crear archivo separado salvo pedido explícito).
7. `Write .orquestador/phases/phase_6_report.json` con `status=SUCCESS`.
8. Mueve `.orquestador/{_pointer.json,phases,cache,summary.md}` a `.orquestador/history/{timestamp}/` (usa la fecha actual en formato `YYYY-MM-DDTHH-mm-ss`).
9. `TodoWrite`: marca todos los items restantes como `completed`.

---

## Plantilla — Si `flow == COMPLETO`:

```
========================================
   CICLO DE DESARROLLO COMPLETADO
========================================
Flujo:          COMPLETO (Jira)
Impacto:        {BACKEND | FRONTEND | FULLSTACK}

Checkpoint 1 (Analisis):           {✅ Aprobado | ❌ Rechazado N veces}
Checkpoint 2 (Plan Tecnico):       {✅ Aprobado | ❌ Rechazado N veces}
Checkpoint 3 (Codificacion+E2E):   {✅ Aprobado}
Checkpoint 4 (QA+Trazabilidad):    {✅ Aprobado}
PIC:                              {✅ PASS | ⚠️ WARN | ❌ FAIL (informado inline)}

Artefactos:
  📄 CHANGELOG_LOGICO.md
  📄 openapi.yaml
  📄 Plan_Backend.md / Plan_Frontend.md
  📄 specs/*.md (test plans generados por Playwright Planner)
  📄 tests/*.spec.ts (tests generados por Playwright Generator)
  📄 pic-report.md
  📄 qa-report.md

Docs Tecnicos (incrementales):
  📄 docs/technical/api.md
  📄 docs/technical/changelog.md
  📄 docs/technical/architecture.md / components.md
  📄 docs/technical/tests.md
  📄 docs/technical/README.md (consolidado)
  📄 docs/technical/adr/001*.md, 002*.md

QA: {SUCCESS | FAILED (intento N/3)}
Trazabilidad:   {X%} tests del plan verificados
Fallidos:       [ids o "ninguno"]
Phase 3 (Agente): {Coding: FULL/PARCIAL | E2E: N/M pasando | Omitidos: N}
Quality Docs:   {PASS | WARN | FAIL}
Confluence:     {Link | NO_DISPONIBLE}
========================================
```

## Plantilla — Si `flow == TACTICO`:

```
========================================
   CICLO DE DESARROLLO TÁCTICO
========================================
Flujo:          TÁCTICO (tarea libre)
Impacto:        {BACKEND | FRONTEND | FULLSTACK}

Checkpoint 1 (Analisis):        {✅ Aprobado | ❌ Rechazado N veces}
Checkpoint 2 (Plan Tecnico):    {✅ Aprobado | ❌ Rechazado N veces}
Checkpoint 3 (Codificacion):    {✅ Aprobado}
Checkpoint 4 (QA+Trazabilidad):  {✅ Aprobado}
PIC:                           {✅ PASS | ⚠️ WARN | ❌ FAIL (informado inline)}

Artefactos:
  📄 CHANGELOG_LOGICO.md
  📄 openapi.yaml (si aplica)
  📄 Plan_Backend.md / Plan_Frontend.md
  📄 qa-report.md

QA: {SUCCESS | FAILED (intento N/3)}
Trazabilidad:   {X%} tests del plan verificados
Fallidos:       [ids o "ninguno"]
Confluence:     ❌ No aplica (Táctico)
========================================
```

## Bloque de Métricas (agregar SIEMPRE después de la plantilla, ambos flujos)

Construido leyendo `.orquestador/phases/*.json`:

```
## Metricas del Pipeline
| Fase | Estado | Reintentos | Duracion |
|------|--------|------------|----------|
| phase_1_analyze              | ✅ SUCCESS | 0 | {Xs} |
| phase_2_backend              | ✅ SUCCESS | 1 | {Xs} |
| phase_2_7_pic                | ✅ SUCCESS | 0 | {Xs} |
| phase_2_8_dependency_analysis | ✅ SUCCESS | 0 | {Xs} |
| phase_3_coding               | ⚠️ PARTIAL→SUCCESS | 2 | {Xs} |
| phase_3_5_review             | ✅ SUCCESS | 0 | {Xs} |
| phase_4_qa                   | ✅ SUCCESS | 0 | {Xs} |

Resumen: {N}/{M} fases exitosas, {K} archivos omitidos (FILES_SKIPPED de todas las
fases), {R} reintentos totales.
```

Si alguna fase quedó en `SKIPPED` (retries agotados), agrega una sección adicional:

```
## ⚠️ Elementos Omitidos (requieren atención manual)
- {phase_id}: archivos omitidos: {files_skipped}. Motivo: {error}
```
