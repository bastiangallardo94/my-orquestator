# Search Strategy — Unified Code Search Protocol

Lee este modulo ANTES de cualquier busqueda de codigo.

## Regla Fundamental
SIEMPRE usar codebase-memory-mcp como primera opcion. Glob/grep es fallback SOLO para archivos no indexados.

## Mapa Necesidad → Tool

| Necesidad | Tool MCP | Fallback |
|-----------|----------|----------|
| "Existe esta funcion/clase?" | search_graph(name_pattern / query) | grep |
| "Donde se usa este string?" | search_code(pattern="X") | grep |
| "Que archivos matchean patron?" | search_code(mode="files") | Glob |
| "Quien llama a esta funcion?" | trace_path(direction="inbound") | grep -r |
| "Que llama esta funcion?" | trace_path(direction="outbound") | Read body |
| "Codigo de funcion especifica?" | get_code_snippet(qualified_name) | Read |
| "Metricas de complejidad?" | query_graph(Cypher) | N/A |
| "Archivo nuevo de este pipeline?" | **Glob** (no indexado) | Glob |
| "Config files?" (Docker/.env) | search_code(path_filter=...) | Glob |

## Flujo de Decision

```
1. codebase_project == "NO_DISPONIBLE"? → FALLBACK directo

2. Tipo de busqueda:
   A) FUNCION/CLASE/RUTA por nombre:
      search_graph(project, name_pattern=".*term.*")
      → Si 0: name_pattern="^term.*"
      → Si 0: query="term" (semantico)
      → Si 0: FALLBACK grep

   B) STRING LITERAL:
      search_code(project, pattern="term", mode="compact|full|files")
      → Si 0 tras 2 intentos: FALLBACK grep

   C) QUIEN LLAMA / QUE LLAMA:
      search_graph → trace_path(project, function_name, direction, depth=2, risk_labels=true)

   D) METRICAS:
      query_graph(project, "MATCH (f:Function) WHERE f.file_path CONTAINS 'X' RETURN ...")

3. Siempre verificar codebase_project en _pointer.json antes de llamar MCP.
```

## FALLBACK (cuando MCP no disponible o 0 resultados)

| Necesidad | Fallback |
|-----------|----------|
| Archivos por nombre | Glob("**/*pattern*") |
| Contenido por string | grep(pattern="str", include="*.ext") |
| Funciones/clases | grep(pattern="function|class|def|func") |
| Imports | grep(pattern="from.*file|import.*file") |
| Config files | Glob("**/Dockerfile*"), Glob("**/.env*") |
