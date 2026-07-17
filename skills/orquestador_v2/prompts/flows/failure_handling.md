# Manejo de Fallos

Leer SOLO cuando ocurre un fallo o retry.

## Tabla de Situaciones

| Situacion | Accion |
|-----------|--------|
| Subagente SUCCESS pero archivo no existe | EXIT CHECK detecta → FAILED, cuenta como intento |
| Fase falla 3 veces (retries agotados) | SKIPPED, avanza, checkpoint informa al usuario |
| deep falla por tokens | Degradar a fast, avisar al usuario |
| Usuario rechaza checkpoint | Retrocede a fase de contenido, resetea PENDING |
| codebase-memory-mcp no disponible | codebase_project=NO_DISPONIBLE, caer a Glob/grep |
| Compaction | Leer compaction_guide.md y recuperar estado |

## Decision de Retry
```
SUCCESS: guardar hash (si aplica), avanzar current_index
PARTIAL/FAILED:
  retries < max: incrementar, reintentar (degradar deep→fast si retries >= 2)
  retries >= max: SKIPPED, guardar files_skipped, avanzar
```

## Degradacion Deep → Fast
Cuando deep falla en el ultimo retry disponible:
1. Cambiar PHASE.agent a "orquestador-fast"
2. Avisar al usuario
3. Reintentar con modelo barato
