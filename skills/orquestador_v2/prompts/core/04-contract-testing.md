# Contract Testing — Validacion BFF↔Backend

Cargar desde phase_2_backend o phase_2_frontend cuando hay cambios de API.

## Deteccion de stack
- Java: buscar `@FeignClient`, `@GetMapping`, `WebClient` via search_graph/search_code
- Go: buscar funciones que importan `net/http`, `resty`, `gentleman`, o llaman a URLs del backend MS

## Steps
1. Extraer endpoints modificados del plan (docs/Plan_Backend.md o CHANGELOG_LOGICO.md)
2. En el proyecto BFF (codebase_project):
   - search_graph(label=Route, query="<path>") → rutas que matchean
   - O search_code(pattern="@FeignClient|<endpoint path>", mode="compact") → Feign clients / HTTP calls
3. Por cada Route/endpoint encontrado:
   - trace_path(mode="cross_service") → quien llama a este endpoint
   - Extraer schema de request/response de openapi.yaml
   - Validar backward compatibility:
     a. ¿Campos obligatorios agregados? → BREAKING
     b. ¿Tipos cambiados (String→Integer)? → BREAKING
     c. ¿Campos eliminados? → BREAKING
     d. ¿Endpoint eliminado? → BREAKING
4. Si hay BREAKING changes:
   - Documentar en docs/contract-impact.md
   - Marcar en output como CONTRACT_BREAKING > 0

## Output
- CONTRACT_BREAKING: 0 | N (si > 0, requiere aprobacion explicita en checkpoint_2)
- CONTRACT_REPORT: path a docs/contract-impact.md o "N/A (sin cambios de API)"
