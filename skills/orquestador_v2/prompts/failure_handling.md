# Manejo de Fallos

Este módulo se lee solo cuando ocurre un fallo o retry.

---

## Tabla de Situaciones

| Situación | Acción |
|---|---|
| Subagente dice SUCCESS pero archivo no existe | EXIT CHECK lo detecta → status real FAILED, cuenta como intento |
| Fase falla 3 veces (retries agotados) | SKIPPED, avanza, checkpoint siguiente informa al usuario |
| `orquestador-deep` falla por límite de tokens | Al reintentar, degradar a `orquestador-fast`, avísalo al usuario |
| Usuario rechaza un checkpoint | Retrocede a fase de contenido relacionada, resetea PENDING, retries=0 |
| Confluence no disponible | Subagente maneja fallback a docs locales; EXIT CHECK solo exige `.md` locales |
| Falta `shasum`/`sha256sum` | Hash check se omite (siempre MISS), pipeline sigue sin cache |
| codebase-memory-mcp no disponible | `codebase_project = "NO_DISPONIBLE"`, fases caen a Glob/grep |
| Sesión se reinicia a mitad | Phase 0 detecta `_pointer.json` incompleto → lee `context.md` → continúa |
| MCP server cae durante Phase 0.5+ | Generar api-surface.md con paths como UNVERIFIED, status PARTIAL |

---

## Decisión de Retry (en Ejecución de Fase Agente)

```
status == SUCCESS:
  → Guardar hash, re-indexar si phase_3_coding
  → Actualizar context.md
  → Avanzar current_index

status == PARTIAL o FAILED:
  Si retries + 1 < max_retries:
    → Incrementar retries, guardar files_failed/error
    → NO avanzar (reintentar próximo turno)
    → Si retries >= 2 Y agente era "orquestador-deep": degradar a "orquestador-fast"
  Si retries + 1 >= max_retries:
    → Marcar SKIPPED, guardar files_skipped
    → Avanzar current_index (checkpoint siguiente pregunta al usuario)
```

---

## Degradación Deep → Fast

Cuando `orquestador-deep` falla por límite de tokens en el último retry disponible:
1. Cambiar `PHASE.agent` de `"orquestador-deep"` a `"orquestador-fast"`
2. Informar al usuario: "⚠️ Degradando {fase} a modelo rápido por límite de tokens"
3. Reintentar con el modelo más barato
