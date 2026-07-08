# Uso de codebase-memory-mcp

Este modulo se lee solo cuando una fase necesita usar el grafo de codigo.

---

## Estrategia de Busqueda Unificada

**Lee `prompts/search_strategy.md`** antes de cualquier busqueda. Ese modulo define:
- Que tool MCP usar para cada tipo de busqueda
- Cuando y como usar `search_code` (reemplaza a grep)
- Cuando caer a Glob/grep como fallback
- El mapa de necesidades → tool + modo

---

## Identificador del proyecto

`codebase_project` (guardado en `_pointer.json`) es el identificador a pasar en TODAS las llamadas. Si vale `"NO_DISPONIBLE"`, salta directo a `search_strategy.md` → seccion FALLBACK.

---

## Prioridad de herramientas

Lee `prompts/search_strategy.md` para el flujo completo. Resumen rapido:

1. **`search_graph`** — encontrar funciones/clases/rutas por nombre (`name_pattern`) o lenguaje natural (`query`).

2. **`search_code`** — buscar strings literales, configs, contenido de archivos. Reemplaza a grep. Modos: `compact` (firmas), `full` (con source), `files` (solo paths, reemplaza Glob).

3. **`trace_path`** — quién llama a X / qué llama X. Con `risk_labels=true`.

4. **`get_code_snippet`** — leer código real de una función/clase.

5. **`query_graph`** — Cypher para métricas (complejidad, cobertura, etc.).

6. **`get_architecture`** — overview de paquetes/lenguajes/clusters.

---

## Cuándo caer a Glob/grep (ultimo recurso)

- Archivos creados en ESTE pipeline (no indexados aún)
- Verificar exit_files (archivos que el subagente acaba de crear)
- Strings en archivos no-código que no están en el grafo
- Cuando search_code devuelve 0 resultados tras 1-2 intentos

---

## Trazado cross-service (Frontend→BFF→Backend)

Cuando codebase-memory-mcp no detecta arcos cross-repo automáticamente:

**BFF→Backend:**
1. Read `.orquestador/service-map.yaml` → lista de services con feign_client/web_client
2. `trace_path(project=<project>, function_name=<ruta>, mode="cross_service")`

**Frontend→BFF→Backend (3 capas):**
1. Read `.orquestador/frontend-to-bff-service-map.yaml` → frontend_projects con calls
2. Para cada MF que llama un BFF path, resolver el backend MS
3. `trace_path(project=<backend_ms>, function_name=<backend_route>, mode="cross_service")`

---

## Mantenimiento del índice

- **Bootstrap:** una vez en Phase 0. Si ya indexado → usar directo. Si no → indexar automáticamente.
- **Re-indexado post-codificación:** después de phase_3_coding SUCCESS, antes de phase_3_5_review. Automático (sin preguntar). Si falla → continuar sin grafo.
  - **Optimizado:** NO hacer `mode="full"` post-coding. Usar:
    - Si < 20 archivos cambiados → `mode="fast"` (solo re-indexa archivos cambiados)
    - Si >= 20 archivos cambiados → `mode="moderate"`
    - Nunca `mode="full"` post-coding (solo en Phase 0 bootstrap)
  - Detectar archivos cambiados: `git diff --name-only HEAD~1`
- Si falla → `codebase_project: "NO_DISPONIBLE"` para el resto de la corrida.

---

## Cross-repo intelligence (autodetección)

Si el proyecto tiene `turbo.json`, `nx.json`, o `packages/*/package.json`:
1. Listar sub-directorios con `go.mod` o `package.json`
2. Indexar cada uno como proyecto separado
3. Ejecutar `index_repository(mode="cross-repo-intelligence", target_projects=["*"])`
4. Guardar resultados en `.orquestador/service-map.yaml`

Esto permite trace_path cross-service sin mapas manuales.

---

## ADRs en el grafo

Cuando una fase genera un ADR local (`docs/technical/adr/*.md`), replicar con `codebase-memory-mcp_manage_adr(project, mode="update", content=...)` para persistir entre sesiones.
