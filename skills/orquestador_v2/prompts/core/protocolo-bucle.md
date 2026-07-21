# Protocolo de Bucle — Referencia

## Arquitectura de Estado

<proyecto>/.orquestador/
├── state.yaml              # Estado UNICO del pipeline
├── summary.md              # Checklist legible, regenerado tras cada fase
├── context.md              # Contexto compacto (~25 lineas)
├── dependency-groups.yaml  # Grupos de paralelizacion
├── api-surface.md          # De phase_0_5
├── cache/                  # Hash cache para saltar fases sin cambios
└── history/                # Pipelines anteriores archivados

### Schema state.yaml
```yaml
flow: TACTICO | COMPLETO | DRY_RUN | REVIEW | TEST | REFACTOR
impact: BACKEND | FRONTEND | FULLSTACK
change_type: feature | bug_fix | refactor
phase_order: [phase_1_analyze, checkpoint_1, ...]
current_index: 0
agent_override: orquestador-deep | orquestador-fast | null
codebase_project: project-name | NO_DISPONIBLE
mcp_available: true
tools_detected: {bd_mcp: {}, rest_tester: {}}
token_budget: {estimated: 0, consumed: 0, remaining: 0, ratio: 0, auto_degraded: false}
worktree: {name: null, path: null, is_worktree: false}
e2e_loop:
  iteration: 0
  max_iterations: 3
  last_failures: []
  phase_coding_index: 6
decisions:
  - checkpoint_id: checkpoint_1
    timestamp: "2026-07-20T21:00:00Z"
    decision: APPROVED | REJECTED | DEFERRED
    rationale: "Plan OK, sin observaciones"
phases:
  phase_1_analyze:
    status: PENDING | IN_PROGRESS | SUCCESS | SUCCESS_WITH_WARNINGS | FAILED
    retries: 0
    warnings: []
    files_created: [docs/analysis.md]
```

## Phase Order Dinamico

La tabla maestra de fases se genera DINAMICAMENTE desde `prompts/phase_templates.yaml` segun flow + impact + change_type.

```
orquestador → phase-order(projectPath="/path") → JSON con array phase_order
```

## Protocolo de Bucle Completo

### Paso 0 — Leer estado
```
state(projectPath=cwd) → contenido de state.yaml
summary(projectPath=cwd) → tabla de fases
```

### Paso 1 — Bifurcar segun PHASE.type
- **checkpoint** → prompts/core/checkpoints.md, question()
- **agent** → Ejecucion de Fase Agente (abajo)
- **report** → Phase 6: leer datos, generar reporte inline, archivar

### Paso 2 — Actualizar y comunicar
Tras cada paso: actualizar state.yaml (phases.{id}.status), regenerar summary.md, context.md.
Informar: "✅ {fase} → {status}. Siguiente: {fase_siguiente}."

## Ejecucion de Fase Agente

1. **HASH CHECK**: hash(projectPath=cwd, files=PHASE.hash_inputs)
   → Si cache_match == true: SKIP, avanzar current_index

2. **ENTRY CHECK**: entry-check(projectPath=cwd, condition=PHASE.entry_condition)

3. **ENSAMBLAR PROMPT**:
   Read prompts/phases/{id}.md
   - Si retries > 0: retry-report(projectPath=cwd, phaseId=PHASE.id)
   - Sustituye variables de contexto de state.yaml.phases previas
   - Si phase_3_coding/phase_4_qa: antepone Read .orquestador/context.md

4. **EJECUTAR**: task(subagent_type=resolve_agent(PHASE.agent, state.agent_override), ...)
   resolve_agent: agent_override > PHASE.agent > "orquestador-fast"

5. **EXIT CHECK**: verify(projectPath=cwd, exitFiles=PHASE.exit_files)
   → Si exit_check_passed == false: FAILED

6. **RETRY DECISION**:
   SUCCESS → guardar hash (si aplica), avanzar current_index
   PARTIAL/FAILED → retry o SKIPPED (ver prompts/flows/failure_handling.md)

### FULLSTACK
Phase 2_backend + 2_frontend en paralelo (mismo mensaje, dos task()).

### Engram (centralizado)
NO se guarda/busca Engram dentro de las fases. El orquestador lo maneja en los boundaries:
- Antes de fase: mem_search context
- Despues de fase SUCCESS: mem_save datos estructurados del output
- Checkpoint APPROVED: mem_save decision + git-checkpoint tool
- Pipeline completo: mem_session_summary + mem_session_end

## Modulos especializados (cargar bajo demanda)

| Modulo | Cuando | Archivo |
|--------|--------|---------|
| Token Budget | Phase 0 | prompts/core/07-token-budget.md |
| Cross-Pipeline Learning | Phase 0 | prompts/core/09-cross-pipeline-learning.md |
| Micro-Batches | Antes de next-batch | prompts/core/08-micro-batches.md |
| Custom Tools Ref | Protocolo de Bucle | prompts/core/06-custom-tools.md |
| Pattern Engine | Phase 2/3/3.5 | prompts/core/03-pattern-engine.md |
| Offsite Global | Si state.offsite == true | prompts/core/01-offsite-global.md |
