# Estrategia de Busqueda Unificada

Este modulo se lee CUALQUIER vez que una fase necesite buscar codigo, archivos o relaciones.
TODA busqueda pasa por aqui antes de recurrir a Glob/grep directo.

---

## Regla Fundamental

**SIEMPRE usar codebase-memory-mcp como primera opcion.** Glob/grep es el fallback
SOLO para archivos que no estan indexados (nuevos, configs no-code, exit_files recien creados).

---

## Identificador del proyecto

`codebase_project` (guardado en `_pointer.json`) es el identificador a pasar en TODAS las llamadas.
Si vale `"NO_DISPONIBLE"`, saltar directo a la seccion FALLBACK al final de este documento.

---

## Mapa de Necesidades → Tool + Modo

| Necesidad | Tool MCP | Parametros clave | Reemplaza |
|-----------|----------|-------------------|-----------|
| "¿Existe esta funcion/clase/ruta?" | `search_graph` | `name_pattern=".*X.*"` o `query="X"` | grep por nombre |
| "¿Donde se usa este string literal?" | `search_code` | `pattern="X"` | grep |
| "¿Que archivos matchean este patron?" | `search_code` | `pattern="X", mode="files"` | Glob |
| "¿Que funciones/exportaciones hay en este archivo?" | `search_code` | `pattern="export\|func\|def", file_pattern="archivo.ts"` | grep + Read |
| "¿Quién llama a esta funcion?" | `search_graph` + `trace_path` | `direction="inbound"` | grep -r imports |
| "¿Que llama esta funcion?" | `search_graph` + `trace_path` | `direction="outbound"` | Read del body |
| "Dame el codigo de esta funcion" | `get_code_snippet` | `qualified_name="pkg.Func"` | Read de archivo |
| "¿Que metricas tiene esta funcion?" | `query_graph` | Cypher MATCH | N/A |
| "¿Existe este archivo nuevo creado en este pipeline?" | **Glob** | pattern | N/A (no indexado) |
| "¿Existe este config file?" (Dockerfile, .env, yaml) | `search_code` | `pattern="X", path_filter="^\\.\|docker\|deploy"` | Glob |

---

## Flujo de Decision

```
1. ¿codebase_project == "NO_DISPONIBLE"?
   → SI: ir a FALLBACK
   → NO: continuar

2. ¿Que tipo de busqueda necesitas?

   A) Encontrar una FUNCION/CLASE/RUTA por nombre:
      → search_graph(project, name_pattern=".*termino.*")
      → Si 0 resultados: search_graph(project, query="termino")
      → Si aun 0: FALLBACK a grep

   B) Encontrar un STRING LITERAL (mensaje de error, config, variable):
      → search_code(project, pattern="termino", mode="compact")
      → Devuelve funciones que contienen el string, deduplicado
      → Si necesitas ver el archivo completo: search_code(mode="full")
      → Si solo necesitas paths: search_code(mode="files")

   C) Encontrar ARCHIVOS por patron de nombre:
      → search_code(project, pattern="nombre", mode="files")
      → Ejemplo: search_code(pattern="Service.ts", mode="files")
      → Si 0 resultados: FALLBACK a Glob

   D) Encontrar CONFIG FILES (Dockerfile, .env, yaml, etc.):
      → search_code(project, pattern="FROM\|services\|env:", 
          path_filter="docker|deploy|k8s|\\.env", mode="files")
      → Si 0 resultados: FALLBACK a Glob

   E) Leer CODIGO de una funcion especifica:
      → Primero: search_graph para obtener qualified_name
      → Luego: get_code_snippet(project, qualified_name="pkg.Func")

   F) Saber QUIEN LLAMA a algo:
      → search_graph para ubicar la funcion
      → trace_path(project, function_name="Func", direction="inbound", 
          depth=2, risk_labels=true)

   G) Saber QUE LLAMA una funcion:
      → trace_path(project, function_name="Func", direction="outbound")

   H) Metricas de complejidad/cobertura:
      → query_graph(project, query="MATCH (f) WHERE f.qualified_name IN [lista]
          RETURN f.qualified_name, f.complexity, f.cognitive, ...")

3. Si el tool MCP devuelve 0 resultados tras 1-2 intentos:
   → FALLBACK a Glob/grep para esa busqueda especifica
   → NO abandonar MCP para las demas busquedas
```

---

## search_code — Tool Subutilizado (usar mas)

`search_code` es el tool mas versatil y esta infrautilizado. Esencialmente reemplaza a grep
con enriquecimiento del grafo.

### Modos

| Modo | Output | Uso |
|------|--------|-----|
| `compact` (default) | Firmas + metadata | Busqueda rapida, ver que existe |
| `full` | Con codigo fuente | Leer implementacion |
| `files` | Solo paths de archivos | Reemplaza Glob |

### Parametros utiles

| Parametro | Ejemplo | Para que sirve |
|-----------|---------|----------------|
| `pattern` | `"useQuery"` | String a buscar (regex soportado) |
| `file_pattern` | `"*.ts"` | Filtrar por extension |
| `path_filter` | `"^src/features"` | Regex en paths de resultado |
| `context` | `5` | Lineas de contexto alrededor del match |
| `limit` | `20` | Max resultados |

### Ejemplos concretos

```
# Encontrar todos los archivos que usan TanStack Query
search_code(project, pattern="useQuery", file_pattern="*.ts", mode="files")

# Encontrar handlers MSW de una feature
search_code(project, pattern="handlers", path_filter="mocks", mode="files")

# Ver que funciones hay en un archivo especifico
search_code(project, pattern="export", file_pattern="service.ts", mode="compact")

# Encontrar configuraciones de Docker
search_code(project, pattern="FROM|services|ports", 
  path_filter="docker|Dockerfile|compose", mode="files")

# Encontrar variables de entorno usadas
search_code(project, pattern="process.env|import.meta.env", mode="compact")
```

---

## FALLBACK — Cuando MCP no esta disponible

Si `codebase_project == "NO_DISPONIBLE"` o si un tool MCP devuelve 0 resultados:

| Necesidad | Fallback |
|-----------|----------|
| Archivos por nombre | `Glob("**/*patron*")` |
| Contenido por string | `grep(pattern="string", include="*.ext")` |
| Funciones/clases | `grep(pattern="function\|class\|def\|func", include="*.ext")` |
| Imports de un archivo | `grep(pattern="from.*archivo\|import.*archivo")` |
| Config files | `Glob("**/Dockerfile*")`, `Glob("**/.env*")`, `Glob("**/*.yaml")` |

---

## Config Map (generado en Phase 0)

El orquestador mantiene un mapa de configuraciones en `.orquestador/config-map.md`:

```markdown
# Config Map — {proyecto} — {fecha}

## Docker
- Dockerfile: [lista de paths]
- docker-compose: [lista con servicios detectados]

## Environment
- .env files: [lista con variables clave]

## CI/CD
- GitHub Actions: [workflows]
- Jenkins: [Jenkinsfile]

## Build
- Bundler: [webpack/rspack/vite]
- Config: [path al config file]

## K8s (si aplica)
- Deployments: [lista]
- Services: [lista]
```

Este mapa se consulta en fases posteriores para saber que servicios/existen
sin tener que re-escanear.

---

## Reglas de Uso por Fase

| Fase | Busquedas principales | Tools a usar |
|------|----------------------|--------------|
| phase_1_analyze | Entidades a tocar, callers, configs | search_graph, trace_path, search_code |
| phase_2_backend | Casos de uso similares, convenciones | search_graph, get_code_snippet |
| phase_2_frontend | Hooks/componentes similares, convenciones | search_graph, get_code_snippet, search_code |
| phase_3_coding | Archivos hermanos, imports, configs | search_code, search_graph, trace_path |
| phase_3_5_review | Complejidad, duplicacion, cobertura | query_graph, search_graph, search_code |
| phase_4_qa | Endpoints, schemas | search_code (openapi.yaml) |
