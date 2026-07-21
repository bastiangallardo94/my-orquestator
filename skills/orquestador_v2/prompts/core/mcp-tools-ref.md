# MCP Tools — Referencia Rapida

Todas las tools se llaman via MCP. El server esta registrado en `opencode.json > mcp.orquestador`.

| Tool | Args | Uso |
|------|------|-----|
| `state` | projectPath | Leer state.yaml |
| `summary` | projectPath, verbose? | Tabla de fases |
| `verify` | projectPath, exitFiles[], validateContent? | EXIT CHECK (existencia + contenido opcional) |
| `entry-check` | projectPath, condition | Verificar precondiciones |
| `hash` | projectPath, files[] | Hash check para cache |
| `phase-order` | projectPath | Generar phase_order dinamico |
| `next-batch` | projectPath | Verificar micro-batch |
| `estimate-tokens` | projectPath | Estimar tokens del pipeline |
| `git-checkpoint` | projectPath, checkpointName, approved? | Tag checkpoint post-approval |
| `context-update` | projectPath, content | Actualizar context.md |
| `retry-report` | projectPath, phaseId | Si retries > 0 |
| `cleanup` | projectPath, maxHistory? | Archivar a history/ (+ poda, default 5) |
| `dep-groups` | projectPath | Leer dependency-groups.yaml |
| `diff-summary` | projectPath | Clasificar archivos cambiados |
| `apply-fix` | projectPath, patternId, filePath | Aplicar fix automatico |
| `gitignore-add` | projectPath, entries[] | Agregar entradas a .gitignore |
| `log-decision` | projectPath, checkpointId, decision, rationale? | Registrar decision en state.yaml |
| `project-cache` | projectPath, mode, projectName?, mcpAvailable?, ttlHours? | Cache codebase-memory-mcp en .project-cache |
