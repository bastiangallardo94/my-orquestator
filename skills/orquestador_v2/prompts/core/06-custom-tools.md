---
module_id: custom-tools
load_on: [protocol_bucle]
audience: orchestrator
description: Referencia de MCP tools del orquestador (via server mcp.orquestador)
---

# Custom Tools — MCP Server orquestador

Las tools del orquestador ahora se llaman via MCP. El server esta registrado en `opencode.json > mcp.orquestador`.

**NO uses CLI commands.** Usa siempre las MCP tool names directamente.

Ver `prompts/core/mcp-tools-ref.md` para la tabla completa con nombres MCP, argumentos y uso.

## Detalle por tool

### state
**Uso:** Paso 0 de cada turno del protocolo de bucle. Lee el state YAML del pipeline, valida consistencia y retorna la fase activa.

### summary
**Uso:** Paso 0 — vision general del pipeline. Muestra todas las fases con su estado, la fase activa, y el progreso.

### entry-check
**Uso:** Antes de ejecutar una fase, verifica que se cumplan las precondiciones definidas en el phase YAML.

### hash
**Uso:** Calcula el hash SHA256 de los archivos de entrada para detectar cambios entre ejecuciones y validar cache.

### verify
**Uso:** EXIT CHECK obligatorio al finalizar cada fase. Verifica que los artefactos esperados existan (y opcionalmente que tengan contenido valido).
**Args:** `projectPath` + `exitFiles[]` + `validateContent` (boolean, default false)
- Si `validateContent=false`: solo verifica existencia del archivo
- Si `validateContent=true`: verifica existencia + contenido no vacio + parseo YAML/JSON segun extension

### retry-report
**Uso:** Cuando retry_count > 0, genera un bloque estructurado con errores previos, diff de cambios, y recomendaciones para reintentar.

### dep-groups
**Uso:** En phase_3_coding, lee los grupos de dependencias del analysis/plan para determinar el orden optimo de implementacion.

### diff-summary
**Uso:** En code review, genera un diff clasificado (added/modified/deleted).

### context-update
**Uso:** Agrega una entrada al context.md del pipeline evitando duplicados.

### cleanup
**Uso:** En Phase 6, archiva el pipeline actual a history/ y poda los archivos mas antiguos.
**Args:** `projectPath` + `maxHistory` (number, default 5)
**Output:** `{success, archive, timestamp, max_history, pruned: [archivos eliminados]}`

### git-checkpoint
**Uso:** Post-checkpoint — crea un tag semantico en git.

### estimate-tokens
**Uso:** Estima el budget de tokens del contexto actual.

### phase-order
**Uso:** Genera el array phase_order en state.yaml basado en reglas de dependencia.

### next-batch
**Uso:** Verifica si hay un micro-batch disponible y retorna sus archivos.

### gitignore-add
**Uso:** Agrega entradas a .gitignore del proyecto solo si no existen ya.
**Args:** `projectPath` + `entries[]` (array de strings)
**Output:** `{added: [".orquestador/"], skipped: [], file: "/path/.gitignore"}`

### project-cache
**Uso:** Lee/escribe cache de codebase-memory-mcp para evitar `list_projects()` repetido.
**Args:** `projectPath` + `mode` (read|write) + `projectName?` + `mcpAvailable?` + `ttlHours?` (default 24)
**Output (read):** `{hit: true, project_name, mcp_available, cached_at}` o `{hit: false, stale?: true}`
**Output (write):** `{written: true, project_name, mcp_available, cached_at}`

### log-decision
**Uso:** Registra una decision de checkpoint en state.yaml para audit trail.
**Args:** `projectPath` + `checkpointId` + `decision` (APPROVED|REJECTED|OVERRIDEN|DEFERRED) + `rationale?`
**Output:** `{logged: true, total_decisions: N}`

### apply-fix
**Uso:** En code review, aplica un auto-fix parametrizado sobre un archivo.
