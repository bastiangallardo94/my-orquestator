# Uso de codebase-memory-mcp

Este módulo se lee solo cuando una fase necesita usar el grafo de código.

---

## Identificador del proyecto

`codebase_project` (guardado en `_pointer.json`) es el identificador a pasar en TODAS las llamadas. Si vale `"NO_DISPONIBLE"`, salta directo a `Glob`/`grep`.

---

## Prioridad de herramientas

Para cualquier pregunta sobre "qué existe", "quién llama a qué" o "qué se rompe si cambio X":

1. **`search_graph`** — encontrar funciones/clases/rutas por patrón (`name_pattern`) o lenguaje natural (`query`). Usa `qn_pattern` para verificar un `qualified_name` exacto.

2. **`trace_path`** — quién llama a X (`direction="inbound"`) / qué llama X (`direction="outbound"`). Con `risk_labels=true` devuelve CRITICAL/HIGH/MEDIUM/LOW por cada caller según distancia de hop.

3. **`get_code_snippet`** — leer código real de una función/clase antes de planificar o codificar (para replicar convenciones existentes).

4. **`query_graph`** — Cypher para métricas objetivas. Cada Function/Method trae `complexity`, `cognitive`, `loop_depth`, `transitive_loop_depth`, `linear_scan_in_loop`, `param_count`. El edge TESTS conecta un test con la función que cubre.

5. **`get_architecture`** — overview de paquetes/lenguajes/clusters (comunidades Leiden) y hotspots (funciones con fan_in alto = mayor riesgo).

---

## Cuándo caer a Glob/grep

- Strings literales, mensajes de error, valores de config
- Archivos no-código (Dockerfiles, YAML de CI/CD)
- Cuando el grafo devuelve 0 resultados tras 1-2 intentos

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
