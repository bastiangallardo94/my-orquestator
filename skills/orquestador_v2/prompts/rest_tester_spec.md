# REST Tester MCP — Especificacion Esperada

Este modulo define la especificacion esperada del MCP server `backend-api-qa` para testing de APIs.

---

## Tools que debe exponer

| Tool | Parametros | Output |
|------|-----------|--------|
| `test_endpoint` | method, url, headers?, body? | {status, body, latency_ms} |
| `validate_schema` | response, schema_json | {valid, errors[]} |
| `run_collection` | openapi_path, endpoints[] | {results: [{endpoint, status, pass}]} |

---

## Uso en phase_4_qa

1. Leer openapi.yaml -> extraer endpoints
2. Para cada endpoint: `test_endpoint(method, url)`
3. Validar contra schema: `validate_schema(response, schema)`
4. Generar tabla de resultados en qa-report.md

---

## Si no disponible

-> Saltar "Testing API" sin preguntar
-> Marcar como "NO_DISPONIBLE" en el reporte
-> NO bloquear el pipeline

---

## Alternativas

Si `backend-api-qa` no esta disponible pero hay otro MCP con tools HTTP:
1. Buscar en `tools_detected` por capability `REST_TEST`
2. Si existe -> usar ese server como alternativa
3. Si no existe -> saltar completamente
