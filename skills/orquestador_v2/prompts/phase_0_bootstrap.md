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
- Patrón Jira (`PROJ-123`, `APP02272-123`) → TRIGGER_MODE = "jira"
- Ninguno → TRIGGER_MODE = "fallback"

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
| `jira:` | COMPLETO | pregunta | no | no |
| `fallback` | inferido | pregunta | no | no |

### 1.3 Reanudación
`orquestador-state(project_path=cwd)` → verificar si existe pipeline activo:
- Si existe y NO está completo → leer `context.md`, saltar al Protocolo de Bucle
- Si existe y está completo → archivar a `history/{timestamp}/` antes de continuar
- Si no existe → continuar con bootstrap

### 1.4 Health check MCP
- `codebase-memory-mcp_index_status(project="health-check")` con timeout 5s
- Si responde → MCP vivo
- Si timeout → `mcp_available: false`, continuar sin grafo

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
    question: "¿Qué modelo para el agente deep?",
    header: "Modelo",
    options: [
      "opencode/gpt-5.1-codex (Recomendado)",
      "anthropic/claude-sonnet-4-20250514",
      "openai/gpt-4o"
    ]
  }
])
```

**Excepciones:**
- `analiza:` → Solo pregunta modelo, omite flow y change_type
- `feature:` / `fix:` / `refactor:` → Solo pregunta modelo, omite change_type
- `bugfix:` → Solo pregunta modelo (Phase 0.5 de bugfix_flow.md maneja la pregunta del checkpoint)
- `review:` / `test:` → Solo pregunta modelo
- `jira:` → Solo pregunta change_type y modelo

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
- `Write .orquestador/_pointer.json`
- `Write .orquestador/phases/<cada id>.json` con `status: "PENDING"`
- `Write .orquestador/summary.md` inicial
- `Write .orquestador/context.md` desde `prompts/context_template.md`
- `TodoWrite` con un item por fase

### 3.4 Verificar .gitignore
Si `.gitignore` existe y no contiene `.orquestador/`, agregarlo con `Edit`.

---

## Paso 4: INICIAR

Continuar inmediatamente al Protocolo de Bucle.
