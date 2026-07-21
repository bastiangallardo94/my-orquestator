# Phase 0 — Bootstrap (Warm)

Ejecutar UNA VEZ al inicio. NO incluye cold-init (auto-installs, KB creation — eso es bin/init.md).

============================================================
## STEP 1: DETECT
============================================================

### 1.1 Trigger Detection (with typo normalization)

| Typo | Correcto |
|------|----------|
| feaute: | feature: |
| orquestar: | orquesta: |
| analizr: | analiza: |
| refacor: | refactor: |
| fix:: | fix: |
| revie: | review: |

| Trigger | Flow | change_type | skip_0_5 |
|---------|------|-------------|:---:|
| orquesta: | inferido | pregunta | no |
| feature: | TACTICO | feature | no |
| fix: | TACTICO | bug_fix | no |
| analiza: | DRY_RUN | — | si |
| review: | REVIEW | — | si |
| test: | TEST | — | si |
| refactor: | REFACTOR | refactor | no |
| bugfix: | BUGFIX_TACTICO | bug_fix | si (lee bugfix_flow.md) |
| unit-test: | UNIT_TEST | — | si |
| Jira ID | COMPLETO | pregunta | no |
| worktree:* | — | — | si (lee skills/worktree_management.md) |
| fallback | inferido | pregunta | no |

### 1.2 --offsite detection
Si user_request contiene `--offsite` → extraerlo, leer skills/offsite_slack.md para health check.
SINO → continuar sin offsite.

### 1.3 Quick Health Check (saltado si SKILL.md ya resumio pipeline)
Lanza EN PARALELO (4 calls concurrentes, NO secuencial):

1. `project-cache(projectPath=cwd, mode=read)` → cache hit?
   - Si hit fresco → project = project_name, mcp_available = cached, **saltar list_projects()**
   - Si miss o stale → `codebase-memory-mcp_list_projects()` + `project-cache(projectPath=cwd, mode=write, projectName=matched, mcpAvailable=true)`

2. `mem_context()` → verificar Engram disponible:
   - Si responde → engram_available=true
   - Si no → engram_available=false

3. [EN PARALELO con 1/2] Impact Inference:
   - Si codebase_project disponible: get_architecture(project) → languages, layers
   - Si no: Glob rapido de carpetas (api/, frontend/, internal/)
   - BACKEND | FRONTEND | FULLSTACK

Recolectar resultados cuando todos respondan. Si alguno falla → graceful degradation, NO bloquear.

============================================================
## STEP 2: CONFIRM (single question)
============================================================

```
question(questions=[
  {
    question: "Confirmo: {FLOW} / {IMPACTO}. {subagente}. OK?",
    header: "Bootstrap",
    options: [
      "Si, correcto (Recommended)",
      "Cambiar flow/impacto",
      "Activar DRY_RUN (solo analisis)"
    ]
  }
])
```

Excepciones por trigger:
- feature:/fix:/refactor: → pregunta solo subagente
- analiza: → pregunta solo subagente
- unit-test: → pregunta target coverage (default 90%)
- bugfix: → pregunta solo subagente (usa bugfix_flow.md)

============================================================
## STEP 3: BOOTSTRAP
============================================================

### 3.1 Index if needed
- Si mcp_available=true y proyecto no indexado → index_repository(repo_path=cwd, mode="fast")
- Si falla → codebase_project=NO_DISPONIBLE, continuar sin grafo

### 3.2 Build phase_order + state_yaml (un solo paso)
- `phase-order(projectPath=cwd)` → recibe `{phase_order, state_yaml}`
- `state_yaml` ya incluye TODAS las fases pre-rellenas como PENDING

### 3.3 Write initial state (escritura atomica)
- **Escribir `state_yaml` completo a `.orquestador/state.yaml` (UN SOLO WRITE)**
- Write `.orquestador/summary.md` desde `state_yaml`
- Write `.orquestador/context.md` desde `prompts/core/context_template.md`
- TodoWrite con un item por fase
- Ejecutar `gitignore-add(projectPath=cwd, entries=[".orquestador/"])`

### 3.4 Engram Session Start (si engram_available)
mem_session_start(directory=cwd) → guardar session_id en state.yaml

============================================================
## STEP 4: CONTINUE TO BUCLE LOOP
============================================================
Avanza al Protocolo de Bucle definido en SKILL.md.
