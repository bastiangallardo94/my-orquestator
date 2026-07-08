---
phase_id: phase_2_backend
type: agent
agent: orquestador-deep
entry_condition: "docs/CHANGELOG_LOGICO.md debe existir"
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/openapi.yaml, AGENTS.md]
exit_check: static
exit_files: [docs/Plan_Backend.md]
supports_partial_retry: false
max_retries: 3
---

# Phase 2 BACKEND — Planificación Técnica

## Consulta de Patrones Probados (antes de escribir el plan)
1. `Read ~/.config/opencode/knowledge/registry.json` → buscar patrones backend
2. Para cada patron relevante (por stack y category):
   - `Read ~/.config/opencode/knowledge/{patron.file}`
   - Inyectar como referencia en el plan
3. Si hay template relevante (ej: feature-crud-go):
   - `Read ~/.config/opencode/knowledge/{template.file}`
   - Usar como base del plan en vez de generar desde cero

## Descubrimiento de Convenciones (codebase-memory-mcp, antes de escribir el plan)
Si `codebase_project` (en .orquestador/_pointer.json) esta disponible:
1. `codebase-memory-mcp_search_graph(project, query="<caso de uso/handler similar al
   que vas a crear, ej. 'CRUD use case'>")` para encontrar un caso de uso/handler/
   repositorio ya existente con un proposito parecido.
2. `codebase-memory-mcp_get_code_snippet(project, qualified_name=<resultado>)` para
   leer un ejemplo REAL del proyecto y replicar su patron exacto (nombres de campos,
   manejo de errores, estructura de capas) en vez de inventar convenciones nuevas.
3. Si es la primera vez que planificas en este proyecto, `codebase-memory-mcp_
   get_architecture(project)` para entender `packages`/`clusters` antes de decidir en
   que carpeta va el codigo nuevo.
4. Si el archivo a MODIFICAR (no crear) ya existe, `codebase-memory-mcp_trace_path(
   project, function_name=X, direction="inbound", risk_labels=true)` para saber
   cuantos callers tiene — si son muchos (CRITICAL/HIGH), anota en el plan una nota
   de precaucion sobre breaking changes de firma.

Si `codebase_project` no esta disponible, procede solo con lectura de archivos (Read/Glob) como referencia de convenciones.

Lee el prompt completo de planificación backend desde su fuente oficial:

```
Read ~/.config/opencode/skills/backend_planner/SKILL.md
```

Usa las siguientes secciones del skill:
- **Stack Target:** Para validar el stack tecnológico (Go vs Java).
- **Flujo de Trabajo:** Pasos 1-3 (Lectura de Contexto, Diseño de Pruebas TDD, Estructura de Carpetas).
- **Plantilla Go o Java:** Según el stack detectado, usar la plantilla correspondiente (sección 9 del skill).

### Reglas específicas del orquestador (adicionales al skill):

## Tests de Regresión
Basado en ARCHIVOS_AFECTADOS y RIESGO_ROTURA del analisis de impacto (Phase 1), identifica:
- Tests existentes que ejercitan los archivos afectados y deben seguir pasando.
- Tests nuevos a crear para blindar el cambio y prevenir regresion.

- `[test existente]` (REGRESION):
  - [ ] Verificar que [funcionalidad existente] sigue funcionando tras el cambio.
- `[test existente]` (REGRESION):
  - [ ] Verificar que [otra funcionalidad] no se ve afectada.

## DOCUMENTACION INCREMENTAL
Ademas del plan, genera estos docs parciales en markdown:
- `docs/technical/architecture.md` — Arquitectura hexagonal: dominio, puertos, aplicacion, adaptadores.
- `docs/technical/adr/002-tech.md` — ADR de decisiones tecnicas y alternativas consideradas.
  Si `codebase_project` esta disponible, replica el mismo contenido con
  `codebase-memory-mcp_manage_adr(project, mode="update", content=...)`.
No publiques en Confluence. Solo escribe local.
