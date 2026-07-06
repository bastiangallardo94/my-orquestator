# Bugfix TÁCTICO — Flujo de Recovery desde Checkpoint

Este módulo se activa con el trigger `bugfix:`. El pipeline anterior fue SUCCESS pero lo que se desplegó provocó un bug. Se usa el último checkpoint como contexto para encontrar la causa raíz y aplicar un fix mínimo.

---

## Regla Fundamental

`bugfix:` usa SU PROPIA tabla de fases (no comparte las de TÁCTICO `fix:`). Es un flujo independiente que arranca desde un checkpoint git existente.

---

## Phase 0.5 — Detectar Checkpoint Git

```
1. execSync("git tag --list 'checkpoint_*' --sort=-creatordate")
   → Lista de tags checkpoint_* ordenados por fecha
2. Tomar el primero (más reciente)
3. Si NO hay ningún checkpoint tag:
   → Error: "No hay contexto de pipeline previo en git."
   → question(): [
       "Usar fix: (analizar desde cero)",
       "Descartar bugfix"
     ]
4. Si hay checkpoint:
   → checkpoint_name = tag más reciente
   → checkpoint_info = git log -1 --format="%H %s" del tag
   → Preguntar con question():
     "¿Encontré el checkpoint {checkpoint_name}. ¿Analizo desde ahí?"
     - "Sí, continuar"
     - "Usar fix: en vez"
     - "Descartar"
```

---

## Tabla de Fases — Bugfix TÁCTICO

| # | phase_id | tipo | agent | Entry condition | Exit check | Exit files |
|---|----------|------|-------|----------------|------------|------------|
| B1 | `phase_bugfix_analyze` | agent | deep | Siempre (checkpoint ya validado) | static | `docs/bugfix-analysis.md` |
| B2 | `checkpoint_bugfix_analyze` | checkpoint | — | — | — | — |
| B3 | `phase_bugfix_fix` | agent | fast | checkpoint_bugfix_analyze APPROVED | verify | `docs/bugfix-fix.md` |
| B4 | `phase_bugfix_revalidate` | agent | fast | phase_bugfix_fix SUCCESS | static | `docs/bugfix-results.md` |
| B5 | `checkpoint_bugfix` | checkpoint | — | — | — | — |

---

## Phase B1 — Bugfix Analyze

**Prompt del agente (orquestador-deep):**

```
## Rol: Investigador de Bugs — Análisis de Causa Raíz

## Contexto
El último pipeline fue SUCCESS y se desplegó. El usuario reporta el siguiente bug:

---
{mensaje del usuario}
---

## Checkpoint de referencia
Último checkpoint: {checkpoint_name}
Commit: {checkpoint_hash}

## Tu tarea
1. Ejecutar: `git diff {checkpoint_name} HEAD --stat`
2. Leer: `git log {checkpoint_name}..HEAD --oneline`
3. Para cada archivo modificado desde el checkpoint:
   - Leer el archivo
   - Identificar: ¿Este cambio puede causar el bug reportado?
4. Consultar el grafo si `codebase-memory-mcp` disponible:
   - `trace_path()` sobre las funciones modificadas
   - ¿Hay paths que rompan con el bug reportado?
5. Generar `docs/bugfix-analysis.md` con:

## Template de docs/bugfix-analysis.md
# Bug Analysis — {breve descripción del bug}

## Bug reportado por el usuario
> {mensaje verbatim del usuario}

## Archivos cambiados desde {checkpoint_name}
{Lista de archivos con diff stat}

## Hipótesis de causa raíz
{Descripción: en qué archivo/función está el bug y por qué}

## Evidencia
- {Archivo 1}: {línea/función específica} → {por qué lo hace fallar}
- {Archivo 2}: ...

## Archivos que requieren fix
{Lista exacta de archivos a modificar}

## Tests a ejecutar para validar
{Tests de regresión + tests del área afectada}
```

**Exit check:** `orchestrator-verify(project_path, phase_id=phase_bugfix_analyze, exit_files=[docs/bugfix-analysis.md])`

---

## Phase B2 — Checkpoint Bugfix Analyze

**HITL:** Mostrar `docs/bugfix-analysis.md` generado.

```
question(
  question: "Análisis completado. Hipótesis: {resumen de hipótesis}. ¿Continuamos?",
  header: "Bugfix Analyze",
  options: [
    "Sí, el bug está en {archivos} — continuar con fix",
    "No, buscar en otro lugar — iterar analyze",
    "Cerrar — no era un bug del pipeline"
  ]
)
```

- **Aprobar** → Escribir `phases/phase_bugfix_analyze.json` status=APPROVED, avanzar
- **Iterar** → status=IN_PROGRESS, retries++, volver a phase_bugfix_analyze
- **Cerrar** → Escribir status=SKIPPED, `orchestrator-cleanup`, fin del pipeline

---

## Phase B3 — Bugfix Fix

**Prompt del agente (orquestador-fast):**

```
## Rol: Bug Fix Engineer

## Bug report
> {mensaje del usuario}

## Análisis previo
{docs/bugfix-analysis.md — sección Archivos que requieren fix}

## Instrucciones
1. Modificar SOLO los archivos listados en "Archivos que requieren fix"
2. NO modificar nada más
3. Aplicar el fix mínimo necesario para resolver el bug
4. NO re-hacer arquitectura, refactorizar, o agregar features
5. Registrar cada archivo modificado en:
   - `phases/phase_bugfix_fix.json` → files_modified
   - `phases/phase_bugfix_fix.json` → files_created (si corresponde)

## Exit criteria
- Archivos de "Archivos que requieren fix" fueron modificados
- El código compila
- Tests del área afectada pasan
```

**Exit check:** `orchestrator-verify` sobre los archivos listados en `docs/bugfix-analysis.md` → sección "Archivos que requieren fix"

---

## Phase B4 — Bugfix Revalidate

**Prompt del agente (orquestador-fast):**

```
## Rol: QA — Revalidación post-fix

## Bug
> {mensaje del usuario}

## Fix aplicado
Archivos modificados: {lista de phase_bugfix_fix.files_modified}

## Instrucciones
1. Ejecutar tests de regresión: {tests listados en docs/bugfix-analysis.md}
2. Ejecutar tests del área afectada
3. Verificar compilación: {comando según stack}
4. Si hay lint: ejecutar y reportar
5. Generar `docs/bugfix-results.md`:

## Template de docs/bugfix-results.md
# Bugfix Results — {breve descripción}

## Bug
> {mensaje del usuario}

## Fix aplicado
- {archivo}: {descripción del cambio}

## Resultados de revalidación
- Compilación: PASS / FAIL
- Lint: PASS / FAIL ({n} warnings)
- Tests de regresión: {N} passing, {M} failing
- Tests área afectada: {N} passing, {M} failing

## Veredicto
{PASS / FAIL / NEEDS_WORK}
```

---

## Phase B5 — Checkpoint Bugfix (Final)

**HITL:** Mostrar `docs/bugfix-results.md`.

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

- **Aprobar** → `orchestrator-git-checkpoint(checkpoint_name=checkpoint_bugfix, approved=true)`, avanzar
- **Iterar** → status=IN_PROGRESS, retries++, volver a phase_bugfix_fix
- **Descartar** → `git checkout -- {files_modified}`, `orchestrator-cleanup`, fin

---

## Retry — Bugfix

- **phase_bugfix_analyze retry:** Limitar a 3. Si se agotan → preguntar al usuario si continuar con la mejor hipótesis o cerrar.
- **phase_bugfix_fix retry:** Limitar a 3. Si se agotan → checkpoint_bugfix pregunta: "¿Iterar o descartar?"
- **phase_bugfix_revalidate retry:** Limitar a 2. Solo re-ejecuta los tests, no modifica código.

---

## Cierre del Pipeline

Cuando `checkpoint_bugfix` es APPROVED:
1. `orchestrator-git-checkpoint(checkpoint_name=checkpoint_bugfix, approved=true, notes="Bug: {breve descripción}. Fix: {archivos}")`
2. `orchestrator-cleanup(project_path=cwd)` (archiva el pipeline bugfix a history/)
3. `TodoWrite` → todos como completed
4. Reporte inline con métricas
