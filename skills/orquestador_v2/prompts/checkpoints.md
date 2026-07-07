# Checkpoints — Reglas y Tabla de Referencia

Este módulo se lee solo cuando `PHASE.type == "checkpoint"`.

---

## REGLA DE BLINDAJE (obligatoria para todos los checkpoints)

1. **TODO checkpoint DEBE llamar a `question()`.** No existe auto-approve para checkpoint_1, checkpoint_2, checkpoint_3 ni checkpoint_4. Solo checkpoint_maps puede auto-aprobarse (coverage >= 80%).

2. **Si llegas a un checkpoint sin haber llamado `question()`** en el turno anterior, el pipeline esta corrupto. RETROCEDE el current_index y RE-EJECUTA el checkpoint.

3. **NUNCA asumas aprobacion.** Respuestas anteriores del usuario no constituyen aprobacion implicita para checkpoints futuros.

---

## Regla Fundamental

Un checkpoint SOLO pregunta y registra. Nunca ejecutes una fase de contenido en el mismo turno que un checkpoint.

---

## Protocolo de Checkpoint

```
1. Read .orquestador/summary.md + archivos relevantes de la fase anterior
2. Arma las opciones según el tipo de checkpoint (ver tabla)
3. question(question="...", header="Checkpoint", options=[...])
4. Interpreta la respuesta:
   - Aprobación → Write phases/{checkpoint_id}.json status=APPROVED. current_index++.
   - Rechazo → Write status=REJECTED con feedback en PHASE.error.
     Retrocede current_index a la fase de CONTENIDO relacionada.
     Resetea esa fase a status=PENDING, retries=0 (corrección deliberada).
5. TodoWrite: marca checkpoint como completed. Regenera summary.md.
```

---

## Tabla de Checkpoints

| checkpoint_id | Pregunta | Opciones | Condicional |
|---|---|---|---|
| checkpoint_maps | "¿Validamos los mapas de arquitectura?" | Ver detalles / Ignorar gaps | Auto-approve si coverage ≥ 80% |
| checkpoint_1 | "¿La lógica de negocio y casos de uso son correctos?" | Aprobar / Rechazar / Ver detalle | No — BLINDAJE ACTIVO |
| checkpoint_2 | "¿Apruebas el plan técnico para comenzar codificación?" | Aprobar / Rechazar / Ver plan | No — BLINDAJE ACTIVO |
| checkpoint_3 | Mostrar resumen real: archivos, tests, cobertura, compile, lint, CR. Luego: "¿Apruebas?" | Aprobar / Ver detalle CR / Rechazar | No |
| checkpoint_4 | "¿Apruebas QA para pasar a documentación/reporte?" | Aprobar / Revisar fallidos / Known issues | No |
| checkpoint_review | "¿Qué hago con los hallazgos del review?" | Ejecutar correcciones / Solo documentar / Descartar | Solo flujo REVIEW |
| checkpoint_test | "¿Qué hago con los tests?" | Ejecutar tests generados / Solo documentar gaps / Descartar | Solo flujo TEST |
| checkpoint_bugfix_analyze | Mostrar docs/bugfix-analysis.md. "¿La hipótesis de causa raíz es correcta?" | Sí, continuar / Buscar en otro lado / Cerrar | Solo flujo BUGFIX |
| checkpoint_bugfix | Mostrar docs/bugfix-results.md. "¿El fix resolvió el bug?" | Aprobar / Iterar fix / Descartar | Solo flujo BUGFIX |

---

## checkpoint_3 (con datos reales)

Antes de preguntar, lee resultados de fases anteriores:
1. `phases/phase_3_coding.json` → TESTS_PASSING_TOTAL, COVERAGE, FILES_CREATED, COMPILE_STATUS
2. `phases/phase_3_5_review.json` → LINT_STATUS, COMPILE_STATUS, CR_SCORE, CR_STATUS

Muestra resumen:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKPOINT 3: Resumen de Codificación

ARCHIVOS: {N} creados, {M} modificados
TESTS: {X}/{Y} pasando ({Z}%)
COBERTURA: {A}% statements, {B}% branches
COMPILE: {status}
LINT: {status} ({N} warnings)
CODE REVIEW: {score}/100 ({status})

[Ver detalle]  [Aprobar]  [Rechazar y relanzar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## checkpoint_maps (especial)

- Read `phases/phase_0_5_validate_maps.json` → gaps[], coverage
- Si coverage.bff_to_backend.pct >= 80 Y coverage.frontend_to_bff.pct >= 80 Y todos los gaps resueltos → auto-APPROVE
- Si gaps pendientes: POR CADA gap, `question()` con opciones:
  - "Verificar ahora" → re-ejecutar phase_0_5
  - "Marcar como PROYECTADO" → path existe pero BFF/MS no lo expone así
  - "Ignorar gap" → excluir de trace_path
  - "Detener pipeline" → FAILED

---

## check_review (flujo REVIEW standalone)

```
question(
  question: "Hallazgos del code review: {N} issues ({critical} críticos, {warning} warnings). ¿Qué hago?",
  header: "Code Review",
  options: [
    "Generar plan de correcciones y ejecutar",
    "Solo documentar hallazgos en docs/review-plan.md",
    "Descartar"
  ]
)
```

- "Ejecutar" → aplica correcciones, re-review para verificar
- "Documentar" → genera `docs/review-plan.md` con hallazgos
- "Descartar" → no hace nada

---

## check_test (flujo TEST standalone)

```
question(
  question: "Tests generados: {N} ({passing} pasando, {failing} fallando). Cobertura: {before}% → {after}%. ¿Qué hago?",
  header: "Test Generation",
  options: [
    "Ejecutar tests y reportar resultados",
    "Solo documentar gaps de cobertura en docs/test-gaps.md",
    "Descartar"
  ]
)
```

- "Ejecutar" → ejecuta tests, reporta resultados
- "Documentar" → genera `docs/test-gaps.md` con funciones sin cobertura
- "Descartar" → no hace nada

---

## PIC (phase_2_7_pic) — NO es checkpoint

El PIC se ejecuta como fase de agente. Resultado inline:
- PASS → continuar
- WARN → continuar
- FAIL → retroceder a phase_2_backend/frontend

---

## Bugfix Checkpoints (flujo BUGFIX_TACTICO)

El flujo completo de bugfix está en `prompts/bugfix_flow.md`. Aquí la referencia de sus HITL:

### checkpoint_bugfix_analyze
```
question(
  question: "Análisis completado. Hipótesis: {resumen}. ¿Continuamos?",
  header: "Bugfix Analyze",
  options: [
    "Sí, el bug está en {archivos} — continuar con fix",
    "No, buscar en otro lugar — iterar analyze",
    "Cerrar — no era un bug del pipeline"
  ]
)
```

### checkpoint_bugfix (final)
```
question(
  question: "Fix aplicado y revalidado. Veredicto: {veredicto}. ¿Qué hacemos?",
  header: "Bugfix Complete",
  options: [
    "Aprobar — el bug está resuelto",
    "Iterar fix — el veredicto es NEEDS_WORK",
    "Descartar — revertir cambios"
  ]
)
```
