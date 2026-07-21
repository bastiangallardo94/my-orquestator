# MCP Capabilities Registry

Este modulo define como detectar y usar las capabilities de los MCP servers.

---

## Deteccion semantica (no solo por nombre)

| Capability | Deteccion | Fallback |
|-----------|-----------|----------|
| BD_READ | `list_mcp_resources()` -> resource con schema SQL | Saltar auditoria BD |
| BD_WRITE | Tool `execute_query` disponible | Solo lectura |
| REST_TEST | Tool `test_endpoint` o `http_request` disponible | Saltar testing API |
| CODE_GRAPH | Tool `search_graph` + `trace_path` | Glob/grep |
| CODE_SNIPPET | Tool `get_code_snippet` | Read directo |

---

## Cache de capabilities

Guardado en `.orquestador/state.yaml` bajo `tools_detected`:

```json
{
  "tools_detected": {
    "bd_mcp": {
      "available": true,
      "server_name": "postgres-mcp",
      "capabilities": ["BD_READ"],
      "last_check": "ISO8601"
    },
    "rest_tester": {
      "available": false,
      "server_name": null,
      "capabilities": [],
      "last_check": "ISO8601"
    },
    "code_graph": {
      "available": true,
      "server_name": "codebase-memory-mcp",
      "capabilities": ["CODE_GRAPH", "CODE_SNIPPET"],
      "last_check": "ISO8601"
    }
  }
}
```

---

## Deteccion por nombre de server (fallback)

| Patron en nombre | Herramienta | Uso |
|------------------|-------------|-----|
| `*database*`, `*db*`, `*postgres*`, `*mysql*` | BD MCP | Consultar tablas, schema, auditoria |
| `*backend-api-qa*` | REST Tester | Probar endpoints GET/POST/PUT/DELETE |
| `*codegen*` | Codegen MCP | Generacion de codigo |
| `*codebase-memory*` | Codegen via grafo | search_graph, get_code_snippet, trace_path |

---

## Health check por fase

Antes de cada fase que use MCP:
1. Leer `tools_detected` de `state.yaml`
2. Si `last_check` > 5 minutos -> re-ejecutar health check rapido (timeout 2s)
3. Si falla -> actualizar `available: false`
4. Si cambia -> informar al usuario: "⚠️ MCP {server} caido, usando fallback"

---

## Ejemplo de uso en prompts

### phase_1_analyze
```
## AUDITORIA BD (automatica)
Si tools_detected.bd_mcp.available == true en state.yaml:
  - Usar el MCP server de BD para listar tablas y columnas relevantes
  - Si el cambio menciona entidades -> consultar BD automaticamente
  - Guardar resultado en RAW_BD_SCHEMA
Si no disponible -> saltar sin preguntar
```

### phase_3_coding
```
## CODEGEN (automatico)
SIEMPRE usar codebase-memory-mcp (si disponible) para:
1. search_graph -> encontrar archivos hermanos y replicar patrones
2. get_code_snippet -> leer codigo existente antes de escribir nuevo
3. trace_path -> verificar impacto antes de cambiar firmas
NO esperar a que el usuario lo pida. Es parte del flujo estandar.
Si no disponible -> usar Glob/Read como fallback
```

### phase_4_qa
```
## TESTING API (automatico)
Si tools_detected.rest_tester.available == true en state.yaml:
  - Usar backend-api-qa para probar endpoints creados
  - GET/POST/PUT/DELETE contra endpoints del openapi.yaml
  - Verificar responses coinciden con schemas
Si no disponible -> saltar esta seccion
```
