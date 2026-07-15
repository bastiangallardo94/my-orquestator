---
phase_id: phase_2_frontend
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir. El orquestador ya debe haber resuelto el Modo A/B via question() antes de ensamblar este prompt."
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/openapi.yaml, AGENTS.md, openspec/changes/*/specs/**, openspec/changes/*/tasks.md]
exit_check: static
exit_files: [docs/Plan_Frontend.md]
supports_partial_retry: false
max_retries: 3
---

{contenido_inyectado_desde_planner_front.md}

## Input: OpenSpec Specs

Antes de escribir el plan, lee los artefactos OpenSpec generados en phase_1_5:

1. `Glob openspec/changes/*/specs/**` → specs del cambio (requirements + scenarios)
2. `Glob openspec/changes/*/tasks.md` → tareas de implementación
3. `Glob openspec/changes/*/proposal.md` → contexto del cambio

Para cada Requirement en los specs, identifica:
- ¿Qué componentes frontend toca? (pages/components/hooks/stores)
- ¿Qué escenarios (Given/When/Then) deben ser verificables por tests de frontend?
- ¿Qué archivos nuevos o modificaciones implica?

**Salida de trazabilidad:** el Plan_Frontend.md debe incluir una sección que trace cada Requirement de OpenSpec a los tests que lo cubrirán:

```markdown
## Trazabilidad OpenSpec → Tests Frontend

| Requirement | Escenario | Test Planificado | Componente |
|------------|-----------|-----------------|------------|
| Dark Mode | Toggle activa dark theme | ThemeToggle.test.tsx:TestToggleDark | ThemeToggle |
| Dark Mode | Persiste en localStorage | useTheme.test.ts:TestLocalStorage | useTheme |
```

## Consulta de Patrones Probados (antes de escribir el plan)
1. `Read ~/.config/opencode/knowledge/registry.json` → buscar patrones frontend
2. Para cada patron relevante (por stack y category):
   - `Read ~/.config/opencode/knowledge/{patron.file}`
   - Inyectar como referencia en el plan
3. Si el plan propone un enfoque que contradice un patron probado:
   - Documentar por que se desvia
   - Marcar como "desviacion deliberada" en el plan

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
4. Para buscar strings literales, configs o imports especificos:
   usar `search_code(pattern="...", mode="compact")` — ver search_strategy.md
Si `codebase_project` no esta disponible, proceder con search_strategy.md → FALLBACK (Glob/Read).

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
