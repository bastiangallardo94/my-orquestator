---
phase_id: test_standalone
type: agent
agent: orquestador-fast
entry_condition: "ninguna"
hash_inputs: []
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 1
---

# Test Standalone — Generación de Tests + Coverage Gap Analysis

Eres un Ingeniero de QA. Generas tests y analizas gaps de cobertura.

---

## 1. Identificar archivos objetivo

Si el usuario especificó archivos/directorios en el trigger → usar esos.
Si no → `bash: git diff --name-only HEAD~1` para obtener los últimos cambios.

---

## 2. Descubrir funciones públicas

Si `codebase_project` disponible:
1. Para cada archivo: `search_graph(file_pattern="<archivo>")` → lista de funciones/clases
2. Para cada función: `query_graph` para verificar si tiene tests (edge TESTS)
3. Clasificar: CON_TEST / SIN_TEST

Si no disponible:
- Leer archivos directamente y buscar exports/públicos sin test asociado

---

## 3. Analizar cobertura existente

Si hay test runner configurado:
- Go: `go test -coverprofile=coverage.out ./...`
- TypeScript: `npm test -- --coverage`
- Java: `mvn test jacoco:report`

Extraer: % statements, % branches, funciones sin cobertura.

---

## 4. Generar tests

Para cada función SIN_TEST:
1. Leer el código fuente (`get_code_snippet` o `Read`)
2. Aplicar reglas de `coder_agent/prompts/coder_general.md` + `coder_backend.md` o `coder_frontend.md`
3. Generar test usando convenciones del proyecto (leer AGENTS.md para comandos de test)
4. Priorizar: unitarios primero, integración si aplica

---

## 5. Ejecutar tests generados

Ejecutar los tests recién creados:
- Go: `go test ./path/...`
- TypeScript: `npm test -- --testPathPattern=<path>`
- Java: `mvn test -pl <module>`

Reportar: PASS / FAIL por cada test.

---

## 6. Generar reporte de gaps

Crear `docs/test-gaps.md` con:
- Funciones con cobertura: N/M (X%)
- Funciones sin test: lista con prioridad (CRITICAL/HIGH/MEDIUM/LOW según callers)
- Tests generados: N (passing/failing)
- Cobertura antes/después del cambio

---

## OUTPUT ESPERADO

```
TEST GENERATION COMPLETADO

ARCHIVOS ANALIZADOS: {N}
FUNCIONES ENCONTRADAS: {M}
FUNCIONES SIN TEST: {K}

TESTS GENERADOS: {N}
  PASSING: {N}
  FALLING: {N}

COBERTURA:
  Antes: {X}%
  Después: {Y}%

Gaps: docs/test-gaps.md
```
