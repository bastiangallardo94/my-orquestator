---
phase_id: unit_test_loop
type: agent
agent: orquestador-fast
entry_condition: "ninguna"
hash_inputs: []
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 1
---

# Unit Test Coverage Loop — Loop de Coverage hasta 90%

Eres un Ingeniero de QA. Ejecutas un loop de coverage hasta alcanzar el target (default 90%).

---

## Setup Inicial (solo en iteración 1)

Si NO existe `.orquestador/coverage-history.md`:

1. Leer `_pointer.user_request` para extraer target override (ej: "unit-test 85" → target=85)
2. Si no hay override → target = 90
3. Crear `.orquestador/coverage-history.md`:

```markdown
# Unit Test Coverage History

TARGET: {target}%

| Iteración | Coverage | Aumento | Tests Generados | Status |
|-----------|----------|---------|----------------|--------|
```

4. Crear `.orquestador/test-plan.md` vacío

---

## phase_ut_1: Evaluate Coverage

### 1. Detectar stack de testing

Ejecutar según el stack detectado:

| Stack | Comando |
|-------|---------|
| Go | `go test -coverprofile=coverage.out ./... && go tool cover -func=coverage.out` |
| TypeScript/Node (Jest) | `npm test -- --coverage --silent 2>/dev/null` o `npx jest --coverage` |
| TypeScript (Vitest) | `npx vitest run --coverage` |
| Python (pytest) | `pytest --cov=. --cov-report=term-missing` |
| Java (Maven) | `mvn test jacoco:report` |
| Java (Gradle) | `./gradlew test jacocoTestReport` |
| Ruby | `bundle exec rspec --coverage` |
| Rust | `cargo test --coverage` o `cargo tarpaulin` |

Si no hay coverage tool configurado → coverage = 0%, continuar.

### 2. Extraer coverage actual

Del output del comando de coverage:
- Buscar línea tipo: `total:... statements {X}%`
- Si múltiples métricas: statements > branches > functions
- Guardar en `phases/phase_ut_1.json`:

```json
{
  "id": "phase_ut_ut_1",
  "coverage_statements": X,
  "coverage_branches": Y,
  "coverage_functions": Z,
  "stack_detected": "<stack>",
  "test_command": "<comando usado>"
}
```

### 3. Identificar archivos sin coverage

Si coverage < 100%:
1. `codebase-memory-mcp_search_graph(project, label="Function", file_pattern="*.go")` (o según stack)
2. Para cada función: verificar si tiene edge TESTS
3. Listar archivos con 0% coverage o coverage bajo

### 4. Actualizar coverage-history.md

```markdown
| {iteracion} | {coverage}% | — | {N} | EVALUATED |
```

---

## checkpoint_ut_coverage

```
Leer coverage de phase_ut_1
Leer TARGET de coverage-history.md

si coverage >= TARGET:
  → status = APPROVED
  → avance = current_index + 2 (saltar a phase_ut_report)
  → mensaje: "TARGET ALCANZADO: {coverage}% >= {TARGET}%. Loop terminado."

si coverage < TARGET:
  → status = APPROVED
  → avance = current_index + 1
  → mensaje: "Coverage: {coverage}%. Target: {TARGET}%. Continuando..."
```

---

## phase_ut_2: Generate Test Plan

### 1. Identificar archivos prioritarios

1. `codebase-memory-mcp_search_graph(project, label="Function", file_pattern="*.<ext>")`
2. Para cada función SIN tests:
   - `trace_path(function_name=<func>, direction="inbound", depth=2)` → contar CRITICAL/HIGH callers
3. Ordenar por: CRITICAL/HIGH callers DESC, luego coverage ASC

### 2. Generar plan de tests

Para los top 10 archivos sin coverage:
1. Leer código fuente
2. Identificar funciones exportadas/públicas
3. Planificar tests unitarios para cada función
4. Escribir en `.orquestador/test-plan.md`:

```markdown
## Plan de Tests — Iteración {N}

### Archivo: <path>
- Función: <name>
  - Prioridad: CRITICAL/HIGH/MEDIUM
  - Callers: <lista>
  - Tests planificados: <N>
    - Test 1: <descripción>
    - Test 2: <descripción>

...
```

---

## phase_ut_3: Execute Tests

### 1. Ejecutar tests del plan

Para cada item en `test-plan.md`:
1. Generar código de test según convenciones del proyecto
2. Escribir archivo de test
3. Ejecutar: `<stack_test_command> ./<path>`

### 2. Reportar resultados

Para cada test ejecutado:
- PASS → count_passing++
- FAIL → count_failing++, listar en `files_failed`

### 3. Medir coverage post-tests

Ejecutar coverage command nuevamente:
- coverage_post = nuevo coverage
- aumento = coverage_post - coverage_pre

### 4. Actualizar archivos

**phases/phase_ut_3.json:**
```json
{
  "id": "phase_ut_3",
  "iteracion": <N>,
  "coverage_pre": <X>,
  "coverage_post": <Y>,
  "aumento": <Z>,
  "tests_generados": <M>,
  "passing": <P>,
  "failing": <F>,
  "files_failed": []
}
```

**coverage-history.md:**
```markdown
| {N} | {coverage_post}% | +{aumento}% | {tests_generados} | OK |
```

---

## checkpoint_unit_test_loop

```
Leer coverage-history.md
Leer phases/phase_ut_3.json

coverage_actual = coverage_post
coverage_anterior = coverage de iteración N-1 (si existe)
TARGET = TARGET de coverage-history.md
iteracion_actual = N

si coverage_actual >= TARGET:
  → status = APPROVED
  → avance = current_index + 1 (a phase_ut_report)
  → mensaje: "TARGET ALCANZADO: {coverage_actual}% >= {TARGET}%"

si coverage_actual < TARGET:
  si iteracion_actual == 1:
    → status = APPROVED
    → volver a phase_ut_1
    → mensaje: "Iteración 1 completada. Coverage: {coverage_actual}%. Continuando..."

  aumento = coverage_actual - coverage_anterior

  si aumento >= 8:
    → status = APPROVED
    → volver a phase_ut_1
    → mensaje: "Coverage: {coverage_actual}% (aumento +{aumento}%). Continuando loop..."

  si aumento < 8:
    → status = STOPPED
    → Informar: "Coverage: {coverage_actual}%. Aumento: +{aumento}% (threshold: 8%). Target: {TARGET}%"
    → No question() en este flujo — solo informar y avanzar a phase_ut_report
```

---

## phase_ut_report: Reporte Final

Generar reporte inline con resumen del loop completo:

```
UNIT TEST COVERAGE LOOP — REPORTE FINAL

TARGET: {TARGET}%
ITERACIONES: {N}
COBERTURA FINAL: {coverage_final}%

HISTORIAL:
{coverage-history.md completo}

PLAN EJECUTADO:
{test-plan.md completo}

RESULTADO:
  - TARGET ALCANZADO: {sí/no}
  - Aumento total: +{aumento_total}%
  - Tests generados: {total_tests}
  - Passing: {total_passing}
  - Failing: {total_failing}
  - Archivos sin coverage: {archivos_sin_coverage}

{si STOPPED: "Loop detenido por no alcanzar threshold de aumento (+8%)."}
```

---

## OUTPUT ESPERADO (phase_ut_1)

```
COVERAGE EVALUATION — Iteración {N}

STACK DETECTED: {stack}
COBERTURA ACTUAL: {X}%
TARGET: {Y}%

ARCHIVOS ANALIZADOS: {M}
FUNCIONES SIN COVERAGE: {K}

COBERTURA: {X}%
COVERAGE-HISTORY: .orquestador/coverage-history.md
```

---

## OUTPUT ESPERADO (phase_ut_2)

```
TEST PLAN GENERADO — Iteración {N}

FUNCIONES PRIORIZADAS: {M}
PLAN: .orquestador/test-plan.md
```

---

## OUTPUT ESPERADO (phase_ut_3)

```
TESTS EJECUTADOS — Iteración {N}

TESTS GENERADOS: {M}
  PASSING: {P}
  FAILING: {F}

COBERTURA:
  Antes: {X}%
  Después: {Y}%
  Aumento: +{Z}%

COVERAGE-HISTORY: .orquestador/coverage-history.md
```
