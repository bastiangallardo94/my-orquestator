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

### 1.3 Resume detection
orquestador-state(project_path=cwd):
- Si pipeline activo incompleto → leer context.md, saltar a Protocolo de Bucle
- Si completo → archivar a history/ antes de continuar
- Si no existe → continuar

### 1.4 Quick Health Check
```
1. codebase-memory-mcp_list_projects() → detectar projecto
   - Si responde → mcp_available=true, project = matched
   - Si no → mcp_available=false, codebase_project=NO_DISPONIBLE

2. Buscar herramientas MCP (list_mcp_resources):
   - database/db/postgres → bd_mcp
   - backend-api-qa → rest_tester
   - Guardar en tools_detected

3. Verificar Engram:
   - Si hay tools mem_* → engram_available=true
   - Si no → engram_available=false

4. Verificar OpenSpec:
   - which openspec || npx openspec --version
   - Si no instalado → question() "instalar ahora? (recomendado) / continuar sin openspec"
   - Si instalado → openspec_available=true
```

### 1.5 Impact Inference
- Si codebase_project disponible: get_architecture(project) → languages, layers
- Si no: Glob rapido de carpetas (api/, frontend/, internal/)
- BACKEND (Go/Java) | FRONTEND (React/Angular) | FULLSTACK (ambos)

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

### 3.2 Build phase_order
Filtrar Tabla Maestra del SKILL.md segun flow+impact.

### 3.3 Write initial state
- Write .orquestador/_pointer.json (incluye offsite flag, engram_session_id si engram disponible)
- Write .orquestador/phases/<cada id>.json status=PENDING
- Write .orquestador/summary.md inicial
- Write .orquestador/context.md desde prompts/core/context_template.md
- TodoWrite con un item por fase
- Agregar .orquestador/ a .gitignore si no existe

### 3.4 Engram Session Start (si engram_available)
mem_session_start(directory=cwd) → guardar session_id en _pointer.json

============================================================
## STEP 4: CONTINUE TO BUCLE LOOP
============================================================
Avanza al Protocolo de Bucle definido en SKILL.md.
