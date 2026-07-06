---
phase_id: phase_2_frontend
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir. El orquestador ya debe haber resuelto el Modo A/B via question() antes de ensamblar este prompt."
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/openapi.yaml, AGENTS.md]
exit_check: static
exit_files: [docs/Plan_Frontend.md]
supports_partial_retry: false
max_retries: 3
---

{contenido_inyectado_desde_planner_front.md}

## Descubrimiento de Convenciones (codebase-memory-mcp, antes de escribir el plan)
Si `codebase_project` (en .orquestador/_pointer.json) esta disponible:
1. `codebase-memory-mcp_search_graph(project, query="<feature/hook/componente similar
   al que vas a crear>")` para encontrar un hook/componente ya existente con proposito
   parecido (ej. otro feature con lista+filtro+CRUD).
2. `codebase-memory-mcp_get_code_snippet(project, qualified_name=<resultado>)` para
   leer el patron real (estructura de hooks TanStack Query, manejo de estados LEES,
   convenciones de props) y replicarlo en vez de inventar uno nuevo.
3. Si vas a MODIFICAR un componente/hook existente (no crearlo), `codebase-memory-mcp_
   trace_path(project, function_name=X, direction="inbound", risk_labels=true)` para
   saber que otros componentes lo consumen antes de cambiar su firma/props.
Si `codebase_project` no esta disponible, procede solo con lectura de archivos (Read/Glob).

## Tests de Regresión
Basado en ARCHIVOS_AFECTADOS y RIESGO_ROTURA del analisis de impacto (Phase 1), identifica:
- Tests existentes que ejercitan los componentes o servicios afectados.
- Tests de componentes conectados al mismo hook/store que podrian romperse.

- `[test existente]` (REGRESION):
  - [ ] Verificar que [funcionalidad existente] sigue funcionando tras el cambio.
- `[test existente]` (REGRESION):
  - [ ] Verificar que [otra funcionalidad] no se ve afectada.

## DOCUMENTACION INCREMENTAL
Ademas del plan, genera estos docs parciales en markdown:
- docs/technical/components.md — Arbol de componentes, props y estados LEES.
- docs/technical/adr/002-tech.md — ADR de decisiones tecnicas y alternativas consideradas.
  Si `codebase_project` esta disponible, replica el mismo contenido con
  `codebase-memory-mcp_manage_adr(project, mode="update", content=...)`.
No publiques en Confluence. Solo escribe local.
