# Pipeline Context

**Flow:** {FLOW} | **Impact:** {IMPACT} | **Project:** {codebase_project}
**MCP:** {available|unavailable} | **Tools:** bd={X} rest={Y} codegen={Z}
**Agent Override:** {agent_override} | **Created:** {created_at}

## Plan de Archivos
{lista compacta: ruta (NEW|MODIFY) — máximo 20 archivos, agrupados por capa}

## Estado por Fase
| Fase | Status | Archivos | Notas |
|------|--------|----------|-------|
| {phase_id} | {SUCCESS/FAILED/SKIPPED} | {count} | {breve nota} |

## Contexto Relevante (inyectado por última fase exitosa)
- IMPACTO: {BACKEND|FRONTEND|FULLSTACK}
- RIESGO_ROTURA: {funcionalidades o "NINGUNO"}
- ENDPOINTS: {endpoints relevantes o "N/A"}
- BD_SCHEMA: {tablas relevantes o "N/A"}
- ARCHIVOS_AFECTADOS: {callers con risk labels o "N/A"}

## Último Error (si aplica)
- Fase: {phase_id}
- Error: {detalle}
- Retry: {N}/{max}
