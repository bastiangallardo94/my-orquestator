---
module_id: engram-memory
load_on: [phase_0_bootstrap, phase_3_5_review, phase_6_report]
audience: orchestrator
description: Memoria persistente a largo plazo con Engram
---

## Diagrama de Arquitectura

```
.orquestador/        → Estado del pipeline (temporal)
knowledge/           → Patrones locales (fallback)
Engram               → Memoria a largo plazo (persistente)
codebase-memory      → Código indexado (se mantiene)
```

Cuatro capas de memoria con alcance y persistencia distintos. Engram es la capa principal para recordar decisiones entre sesiones.

## Configuración

Para habilitar Engram, agregar al `opencode.json`:

```jsonc
{
  "mcpServers": {
    "engram": {
      "disabled": false,
      "autoApprove": [
        "mem_save",
        "mem_search",
        "mem_context",
        "mem_session_summary"
      ]
    }
  }
}
```

## Tipos de Observación

| type          | Descripción                   | Cuándo guardar                 |
|---------------|-------------------------------|--------------------------------|
| architecture  | Decisiones arquitectónicas    | Phase 1, Phase 3.5             |
| pattern       | Patrones de código exitosos   | Phase 3.5                      |
| bugfix        | Soluciones a bugs             | Phase B3, Phase 4              |
| decision      | Decisiones con tradeoffs      | Checkpoints aprobados          |
| config        | Configuraciones importantes   | Phase 0, Phase 2               |
| discovery     | Descubrimientos del codebase  | Phase 1                        |
| learning      | Lecciones aprendidas          | Phase 6                        |

## Topic Keys

Formato: `family/description`

```
architecture/auth-model
architecture/hexagonal-layers
pattern/crud-repository
pattern/error-middleware
bugfix/n+1-query
bugfix/fts5-sanitization
decision/bff-split-vs-monolith
discovery/legacy-scheduler
learning/mcp-timeout-handling
```

## Puntos de Integración por Fase

| Fase           | Acción Engram                                                    |
|----------------|------------------------------------------------------------------|
| Phase 0        | `mem_session_start` — iniciar sesión                             |
| Phase 1        | `mem_search` (memoria previa) + `mem_save` (descubrimientos)     |
| Phase 1.5      | `mem_search` — buscar specs de cambios similares                 |
| Phase 3.5      | `mem_search` (patrones) + conflict detection + `mem_save` (patrones) |
| Phase 6        | `mem_session_summary` + `mem_session_end`                        |

## Detección de Conflictos

Cuando `mem_save` detecta que una nueva observación podría contradecir una existente, responde con `judgment_required=true` y una lista de `candidates[]`.

Flujo de resolución:

```
mem_save(title="...", type="...", content="...")
  ↓
response.judgment_required === true ?
  ↓ sí
foreach candidate in response.candidates[]:
  mem_judge(
    judgment_id=candidate.judgment_id,
    relation="supersedes|conflicts_with|related|compatible|scoped|not_conflict",
    reason="...",
    confidence=0.8
  )
  ↓
Relación persistida — fila marcada como judged
```

Regla heurística:

| Condición                                         | Acción                                          |
|---------------------------------------------------|-------------------------------------------------|
| confidence >= 0.7 AND relation ≠ supersedes/conflicts_with | Resolver en silencio sin preguntar al usuario   |
| confidence < 0.7                                  | Preguntar al usuario antes de resolver          |
| relation = supersedes/conflicts_with AND type in {architecture, policy, decision} | Preguntar al usuario antes de resolver |
| resto                                             | Resolver en silencio                            |

## Búsqueda de Memoria

```typescript
// Buscar decisiones arquitectónicas previas
mem_search(query="arquitectura auth", type="architecture", limit=5)

// Buscar patrones CRUD en el proyecto orquestador
mem_search(query="patrones CRUD", project="orquestador", limit=10)

// Buscar bugs similares
mem_search(query="null pointer gateway", type="bugfix", limit=5)

// Buscar lecciones aprendidas sobre testing
mem_search(query="testing mocks", type="learning", project="orquestador", limit=10)
```

## Fallback

Si Engram no está disponible, el pipeline funciona sin él usando `knowledge/registry.json` como fallback.
