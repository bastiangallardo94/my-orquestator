# Detección Automática de Herramientas

## Flujo de detección
1. Al inicio de Phase 0: `list_mcp_resources()` → detectar servers disponibles
2. Guardar en `state.yaml.tools_detected`
3. Cada fase lee `tools_detected` y usa las herramientas automáticamente

## Mapeo de herramientas por fase

| Fase | BD MCP | REST Tester | Codegen (grafo) |
|------|--------|-------------|-----------------|
| phase_1_analyze | ✅ schema | ❌ | ✅ architecture |
| phase_2_backend | ❌ | ❌ | ✅ search_graph, get_code_snippet |
| phase_2_frontend | ❌ | ❌ | ✅ search_graph, get_code_snippet |
| phase_3_coding | ❌ | ❌ | ✅ search_graph, get_code_snippet, trace_path |
| phase_4_qa | ✅ auditoría | ✅ test endpoints | ✅ detect_changes |

## Reglas
1. NUNCA preguntar si quiere usar una herramienta → usarla automáticamente
2. Si falla → fallback silencio (no bloquear pipeline)
3. Si no está disponible → saltar sin informar
4. Leer `tools_detected` de `state.yaml` al inicio de cada fase

## Detección por nombre de server

| Patrón en nombre | Herramienta | Uso |
|------------------|-------------|-----|
| `*database*`, `*db*`, `*postgres*`, `*mysql*` | BD MCP | Consultar tablas, schema, auditoría |
| `*backend-api-qa*` | REST Tester | Probar endpoints GET/POST/PUT/DELETE |
| `*codegen*` | Codegen MCP | Generación de código |
| `*codebase-memory*` | Codegen via grafo | search_graph, get_code_snippet, trace_path |

## Ejemplo de uso en prompts

### phase_1_analyze
```
## AUDITORÍA BD (automática)
Si tools_detected.bd_mcp.available == true en state.yaml:
  - Usar el MCP server de BD para listar tablas y columnas relevantes
  - Si el cambio menciona entidades → consultar BD automáticamente
  - Guardar resultado en RAW_BD_SCHEMA
Si no disponible → saltar sin preguntar
```

### phase_3_coding
```
## CODEGEN (automático)
SIEMPRE usar codebase-memory-mcp (si disponible) para:
1. search_graph → encontrar archivos hermanos y replicar patrones
2. get_code_snippet → leer código existente antes de escribir nuevo
3. trace_path → verificar impacto antes de cambiar firmas
NO esperar a que el usuario lo pida. Es parte del flujo estándar.
Si no disponible → usar Glob/Read como fallback
```

### phase_4_qa
```
## TESTING API (automático)
Si tools_detected.rest_tester.available == true en state.yaml:
  - Usar backend-api-qa para probar endpoints creados
  - GET/POST/PUT/DELETE contra endpoints del openapi.yaml
  - Verificar responses coinciden con schemas
Si no disponible → saltar esta sección
```
