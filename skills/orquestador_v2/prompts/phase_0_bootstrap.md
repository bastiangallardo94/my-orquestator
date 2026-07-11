# Phase 0 — Bootstrap del Pipeline

Este módulo se lee UNA VEZ al inicio del pipeline. Ejecútalo cuando no exista `.orquestador/_pointer.json` o el pipeline anterior esté completo.

---

## Paso 1: DETECTAR

### 1.1 Detección de Trigger
- `orquesta:` → TRIGGER_MODE = "orquesta"
- `feature:` → TRIGGER_MODE = "feature"
- `fix:` → TRIGGER_MODE = "fix"
- `analiza:` → TRIGGER_MODE = "analiza"
- `review:` → TRIGGER_MODE = "review"
- `test:` → TRIGGER_MODE = "test"
- `refactor:` → TRIGGER_MODE = "refactor"
- `bugfix:` → TRIGGER_MODE = "bugfix"
- `unit-test:` → TRIGGER_MODE = "unit_test"
- Patrón Jira (`PROJ-123`, `APP02272-123`) → TRIGGER_MODE = "jira"
- Ninguno → TRIGGER_MODE = "fallback"

### 1.1.5 Normalización de typos en trigger

Antes de matchear el trigger, normalizar strings mal tipeados comunes:

| Typo | Correcto |
|------|----------|
| `feaute:` | `feature:` |
| `orquestar:` | `orquesta:` |
| `analizr:` | `analiza:` |
| `test:` | `test:` |
| `refacor:` | `refactor:` |
| `fix::` | `fix:` |
| `revie:` | `review:` |

Aplicar el mapa antes de la detección. Si después de normalizar el trigger matchea uno válido, usar ese. Si no matchea ninguno, caer a fallback.

### 1.1.6 Detección de `--offsite`

Antes de detectar el trigger, verificar si `user_request` contiene `--offsite`:

1. Si `user_request` contiene `--offsite` → extraerlo y guardar `ORQUESTADOR_OFFSITE=true`
2. Si además `user_request` contiene `@orquestador` → extraerlo también (no afecta al trigger)
3. El texto restante (sin `--offsite` ni `@orquestador`) se usa para la detección de trigger normal
4. Ejemplos:
   - `@orquestador --offsite feature: login` → trigger=`feature:`, offsite=true
   - `--offsite orquesta: hola` → trigger=`orquesta:`, offsite=true
   - `feature: login` → trigger=`feature:`, offsite=false

### 1.1.7 Health Check del Bridge (si `--offsite` activo)

Si `ORQUESTADOR_OFFSITE=true` después del paso 1.1.6:

1. Listar MCP servers disponibles: buscar `slack-bridge` en las herramientas del contexto.
2. Si `slack-bridge` está disponible:
   - Ejecutar `slack_bridge_status()` para verificar conexión activa.
   - Si `status == "running"` y `slack_connected == true`:
     - Mostrar: `✅ Slack bridge OK — canal: {channel_id} | ngrok: {ngrok_url}`
     - Continuar bootstrap normalmente.
   - Si `slack_connected == false` o error:
     - Mostrar: `❌ Slack bridge caído.`
     - Hacer `question()` con opciones:
       - "Intentar de nuevo" → re-ejecutar health check
       - "Usar question() en terminal (fallback)" → `ORQUESTADOR_OFFSITE=false`, continuar
       - "Ver instrucciones de configuración" → mostrar guía rápida:
         ```
         Para configurar slack-bridge:
         1. Agregar a opencode.json:
            "mcpServers": {
              "slack-bridge": {
                "command": "npx",
                "args": ["@opencode/slack-bridge"],
                "env": {
                  "SLACK_BOT_TOKEN": "xoxb-...",
                  "SLACK_APP_TOKEN": "xapp-...",
                  "SLACK_CHANNEL_ID": "C0..."
                }
              }
            }
         2. O clonar y ejecutar localmente desde:
            github.com/anomalyco/slack-bridge
         ```
3. Si `slack-bridge` NO está disponible en las herramientas:
   - Mostrar: `ℹ️ slack-bridge no está configurado como MCP server.`
   - Hacer `question()` con opciones:
     - "Usar question() en terminal (fallback)" → continuar sin offsite
     - "Mostrar instrucciones de configuración" → ver guía arriba
     - "Omitir y seguir igual (fallback automático)" → continuar sin offsite

### 1.2 Configuración por trigger

| Trigger | Flow | change_type | skip_tipo_cambio | skip_phase_0_5 |
|---------|------|-------------|:---:|:---:|
| `orquesta:` | inferido | pregunta | no | no |
| `feature:` | TACTICO | "feature" | sí | no |
| `fix:` | TACTICO | "bug_fix" | sí | no |
| `analiza:` | DRY_RUN | — | sí | sí |
| `review:` | REVIEW | — | sí | sí |
| `test:` | TEST | — | sí | sí |
| `refactor:` | REFACTOR | "refactor" | sí | no |
| `bugfix:` | BUGFIX_TACTICO | "bug_fix" | sí | sí (usa bugfix_flow.md) |
| `unit-test:` | UNIT_TEST | — | sí | sí |
| `jira:` | COMPLETO | pregunta | no | no |
| `fallback` | inferido | pregunta | no | no |

### 1.3 Reanudación
`orquestador-state(project_path=cwd)` → verificar si existe pipeline activo:
- Si existe y NO está completo → leer `context.md`, saltar al Protocolo de Bucle
- Si existe y está completo → archivar a `history/{timestamp}/` antes de continuar
- Si no existe → continuar con bootstrap

### 1.4 Health check MCP
- Derivar project name desde `cwd`: `cwd.replace(/^\//, '').replace(/\//g, '-')`
- `codebase-memory-mcp_list_projects()` → si el project name derivado está en la lista, usarlo
- Si no está en la lista, intentar con el project name derivado (puede que no esté indexado aún)
- `codebase-memory-mcp_index_status(project=<derived_project_name>)` con timeout 5s
- Si responde → MCP vivo
- Si timeout o error de proyecto → intentar con `list_projects` para verificar otros proyectos, `mcp_available: true` (el MCP está vivo, solo el proyecto no está indexado)
- Si `list_projects` también falla → `mcp_available: false`, continuar sin grafo

### 1.5 Inferencia de impacto
- Si `codebase_project` disponible: `codebase-memory-mcp_get_architecture(project)` → languages, layers, packages
- Si no: `Glob` rápido de carpetas del proyecto
- Detectar: BACKEND (Go/Java), FRONTEND (React/Angular), FULLSTACK (ambos)

### 1.6 Detección multi-repo
Si el proyecto parece multi-repo (`turbo.json`, `nx.json`, `packages/*/package.json`):
- `codebase-memory-mcp_index_repository(mode="cross-repo-intelligence", target_projects=["*"])`
- Buscar mapas: `~/.config/opencode/maps/` → `.orquestador/`

### 1.7 Detección de herramientas MCP
`list_mcp_resources()` → detectar (ver `prompts/mcp_capabilities.md` para detección semántica):
- "database"/"db"/"postgres"/"mysql" → `bd_mcp: true`
- "backend-api-qa" → `rest_tester: true`
- "codebase_memory" → `codegen: true`

### 1.8 Detección de Knowledge Base
- `Glob ~/.config/opencode/knowledge/registry.json`
  - Si existe → `knowledge_available: true`, leer patrones disponibles
  - Si no existe → `knowledge_available: false`, crear estructura básica:
    ```
    mkdir -p ~/.config/opencode/knowledge/{patterns,anti-patterns,templates}
    Write ~/.config/opencode/knowledge/registry.json con estructura vacia
    ```
- Si hay patrones con `confidence < 0.5` → marcar como "experimentales"
- Guardar `knowledge_available` en `_pointer.json`

### 1.9 Detección de Worktree

#### 1.9.1 Detectar si estamos en un worktree
```bash
git rev-parse --is-inside-work-tree
git worktree list --porcelain
```

#### 1.9.2 Extraer información del worktree actual
- `worktree_name`: basename del directorio actual
- `worktree_path`: path absoluto
- `worktree_branch`: rama actual (`git branch --show-current`)
- `is_main_repo`: true si NO es un worktree (directorio root)

#### 1.9.3 Estructura _pointer.json con worktree info
```json
{
  "worktree": {
    "name": "feature-login",
    "path": "/Users/repo/worktrees/feature-login",
    "branch": "feature/login",
    "is_worktree": true,
    "parent_repo": "/Users/repo"
  }
}
```

#### 1.9.4 Para worktree:list
Si el trigger es `worktree:list`:
- Ejecutar `git worktree list --porcelain`
- Por cada worktree, detectar si tiene `.orquestador/_pointer.json`
- Si tiene: leer flow, phase actual, status
- Si no: marcar como "sin pipeline"
- Generar tabla de resumen

#### 1.9.5 Para worktree:create
Si el trigger es `worktree:create`:
- Ir a protocolo de creación en `prompts/worktree_management.md`
- NO continuar con bootstrap normal

---

## Paso 2: CONFIRMAR

Una sola llamada a `question()` con todas las preguntas:

```
question(questions=[
  {
    question: "Detecté: {FLUJO} / {IMPACTO} — basado en: {evidencia}. ¿Confirmas o ajusto?",
    header: "Flow e Impacto",
    options: [
      "Sí, correcto (Recomendado)",
      "Cambiar a COMPLETO (tengo ticket Jira)",
      "Cambiar a TÁCTICO (sin Jira)",
      "Cambiar impacto a FULLSTACK",
      "Activar DRY_RUN (solo análisis)"
    ]
  },
  {
    question: "¿Este cambio es una feature nueva o un ajuste/corrección?",
    header: "Tipo de cambio",
    options: [
      "Feature nueva (tests completos: unitarios + E2E)",
      "Ajuste/corrección (validar solo lo tocado + regresión)"
    ],
    // Solo si skip_tipo_cambio == false
  },
  {
    question: "¿Qué tipo de subagente usar para fases deep?",
    header: "Subagente deep",
    options: [
      "orquestador-deep (Recomendado — análisis profundo, planificación, codificación TDD)",
      "orquestador-fast (rápido — QA, playwright, reporting)"
    ]
  }
])
```

**Excepciones:**
- `analiza:` → Solo pregunta subagente, omite flow y change_type
- `feature:` / `fix:` / `refactor:` → Solo pregunta subagente, omite change_type
- `bugfix:` → Solo pregunta subagente (Phase 0.5 de bugfix_flow.md maneja la pregunta del checkpoint)
- `review:` / `test:` → Solo pregunta subagente
- `unit-test:` → Solo pregunta target coverage override (opcional, default 90%)
- `jira:` → Solo pregunta change_type y subagente

---

## Paso 3: BOOTSTRAP

### 3.1 Indexar si necesario
- Si `mcp_available == true` y proyecto no indexado → `codebase-memory-mcp_index_repository(repo_path=cwd, mode="fast")`
- Si falla → `codebase_project: "NO_DISPONIBLE"`, continuar sin grafo

### 3.2 Generar Config Map (si MCP disponible)
- Si `codebase_project != "NO_DISPONIBLE"`:
  1. `search_code(project, pattern="FROM|services|ports|image:", 
       path_filter="docker|Dockerfile|compose", mode="files")` → Docker files
  2. `search_code(project, pattern="process.env|import.meta.env|VITE_|REACT_APP_",
       mode="compact", limit=20)` → Variables de entorno
  3. `Glob("**/.env*")` + `Glob("**/Dockerfile*")` + `Glob("**/*docker-compose*")` → Fallback configs
  4. `Glob("**/.github/workflows/*")` + `Glob("**/Jenkinsfile")` → CI/CD
  5. Escribir `.orquestador/config-map.md` con el mapa de configuraciones
- Si MCP no disponible → usar solo Glob para detectar configs basicos

### 3.3 Construir phase_order
Filtrar la Tabla Maestra según flow+impact confirmados.

### 3.4 Escribir estado inicial
- `Write .orquestador/_pointer.json` incluyendo `offsite: true/false` según detección en 1.1.6
- `Write .orquestador/phases/<cada id>.json` con `status: "PENDING"`
- `Write .orquestador/summary.md` inicial
- `Write .orquestador/context.md` desde `prompts/context_template.md`
- `TodoWrite` con un item por fase

### 3.4 Verificar .gitignore
Si `.gitignore` existe y no contiene `.orquestador/`, agregarlo con `Edit`.

---

## Paso 4: INICIAR

Continuar inmediatamente al Protocolo de Bucle.
