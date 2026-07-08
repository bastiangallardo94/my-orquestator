---
phase_id: phase_2_7_pic_deps
type: agent
agent: orquestador-fast
entry_condition: "Al menos un docs/Plan_Backend.md o docs/Plan_Frontend.md debe existir"
hash_inputs: [docs/Plan_Backend.md, docs/Plan_Frontend.md, docs/openapi.yaml, AGENTS.md]
exit_check: static
exit_files: [docs/pic-report.md, .orquestador/dependency-groups.json]
supports_partial_retry: false
max_retries: 2
---

Eres un validador de planes y analista de dependencias. Ejecutas PIC + Dependency Analysis en un solo paso.

LEE:
- docs/Plan_Backend.md (si existe)
- docs/Plan_Frontend.md (si existe)
- docs/openapi.yaml
- AGENTS.md
- .orquestador/_pointer.json (para codebase_project)

============================================================
## PARTE 1: PLAN INTEGRITY CHECK (PIC)
============================================================

PARA CADA ARCHIVO listado en los planes:
- Usa Glob para verificar si existe en el proyecto.
- Clasifica: EXISTE | NO_EXISTE (marcado como NEW) | NO_EXISTE (no marcado como NEW -> WARN)
- Si `codebase_project` (en .orquestador/_pointer.json) esta disponible y el item NO
  esta marcado como NEW (se asume que ya existe): refuerza la verificacion con
  `codebase-memory-mcp_search_graph(project, qn_pattern="<qualified_name esperado>")`.
  Si el archivo existe pero la funcion/clase especifica NO aparece en el grafo con ese
  nombre -> degrada el veredicto a WARN aunque Glob haya dado EXISTE (el archivo esta
  pero la entidad concreta no, o cambio de nombre).

PARA CADA ENDPOINT en openapi.yaml:
- Verifica que aparece en al menos un plan (Backend o Frontend).
- Si no aparece en ningun plan -> WARN.

PARA CADA TEST listado en los planes (lineas con "Test:"):
- Verifica que el archivo de test existe (o esta marcado como NEW).
- Verifica que el endpoint que prueba existe en openapi.yaml.

============================================================
## PARTE 2: DEPENDENCY ANALYSIS
============================================================

PARA CADA ARCHIVO listado en los planes:
1. Extraer imports/dependencias:
   - Si `codebase_project` (en .orquestador/_pointer.json) != "NO_DISPONIBLE":
     a. codebase-memory-mcp_search_graph(project, query="<nombre del archivo o funcion>")
       para ubicar la entidad en el grafo
     b. codebase-memory-mcp_trace_path(project, function_name=X, direction="inbound",
       depth=1) para ver que lo llama (dependencias inversas)
     c. codebase-memory-mcp_trace_path(project, function_name=X, direction="outbound",
       depth=1) para ver que llama (dependencias directas)
   - Si no disponible: leer archivo directamente (Read) y extraer imports manualmente

2. Clasificar nivel de dependencia segun la arquitectura del proyecto

### BACKEND (arquitectura hexagonal / clean architecture)
| Grupo | Contenido | Dependencias |
|-------|-----------|--------------|
| 0 | Models, Types, Interfaces, DTOs | Sin dependencias internas |
| 1 | Repository, Ports, Adapters | Depende de Grupo 0 |
| 2 | Use Cases, Services, Application | Depende de Grupo 1 |
| 3 | Handlers, Controllers, Routes | Depende de Grupo 2 |

### FRONTEND (feature-based / React)
| Grupo | Contenido | Dependencias |
|-------|-----------|--------------|
| 0 | Types, Interfaces, Schemas | Sin dependencias internas |
| 1 | Services, API clients | Depende de Grupo 0 |
| 2 | Hooks, Stores | Depende de Grupo 1 |
| 3 | Components, Pages | Depende de Grupo 2 |

### REGLAS DE PARALELIZACION
1. Archivos en el mismo grupo = INDEPENDIENTES entre si -> paralelizables
2. Archivos en grupos diferentes = SECUENCIALES -> grupo N+1 espera a N
3. BACKEND y FRONTEND = CAPAS INDEPENDIENTES -> paralelizables entre si
4. Si un archivo tiene dependencia circular con otro -> mismo grupo, paralelizables
5. Tests van en el grupo de su archivo bajo prueba (no grupo separado)

============================================================
## OUTPUT: PIC REPORT
============================================================

Genera docs/pic-report.md:

# Plan Integrity Check
**Ticket:** [ID]
**Resultado:** PASS | WARN | FAIL

## Archivos del Plan vs Realidad
| Archivo | Estado en Plan | Realidad | Veredicto |
|---------|---------------|----------|-----------|
| internal/x.go | MODIFY | EXISTE | ok |
| internal/y.go | CREATE | NO_EXISTE | ok (NEW esperado) |

## Endpoints openapi.yaml vs Plan
| Endpoint | En Plan? | Veredicto |
|----------|---------|-----------|
| GET /bff/x | Si (FE) | ok |

## Tests del Plan vs Existencia
| Test | Archivo Esperado | Existe? | Veredicto |
|------|-----------------|---------|-----------|
| TestCreate | create_test.go | No (NEW) | ok |

## Resumen
- Archivos: N/N consistentes
- Endpoints: N/N mapeados
- Tests: N/N verificados
- VEREDICTO: PASS (< 30% FAIL) | WARN (30-50%) | FAIL (>= 50%)

============================================================
## OUTPUT: DEPENDENCY GROUPS
============================================================

Escribe .orquestador/dependency-groups.json con esta estructura:

```json
{
  "backend": {
    "groups": [
      {
        "id": 0,
        "files": ["internal/domain/port.go"],
        "parallel": true,
        "depends_on": [],
        "description": "Models y tipos de dominio"
      }
    ],
    "total_groups": 1,
    "max_parallel_files": 1
  },
  "frontend": {
    "groups": [
      {
        "id": 0,
        "files": ["features/ports/api/service.types.ts"],
        "parallel": true,
        "depends_on": [],
        "description": "Tipos e interfaces"
      }
    ],
    "total_groups": 1,
    "max_parallel_files": 1
  },
  "cross_layer_parallel": true,
  "execution_plan": [
    {"step": 1, "backend_group": 0, "frontend_group": 0, "parallel": true, "description": "Tipos y modelos"}
  ],
  "estimated_speedup": "70%",
  "analysis_method": "codebase-memory-mcp | manual",
  "created_at": "ISO8601"
}
```

============================================================
## OUTPUT ESPERADO
============================================================

DEVUELVEME:
- PIC_STATUS: PASS | WARN | FAIL
- GROUPS_BACKEND: N grupos
- GROUPS_FRONTEND: M grupos (0 si solo backend)
- MAX_PARALLEL: N archivos maximo en paralelo
- CROSS_LAYER: true | false
- ESTIMATED_SPEEDUP: porcentaje estimado
- ANALYSIS_METHOD: codebase-memory-mcp | manual
- ERROR: solo si algo fallo
