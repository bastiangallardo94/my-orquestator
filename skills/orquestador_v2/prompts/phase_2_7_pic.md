---
phase_id: phase_2_7_pic
type: agent
agent: orquestador-fast
entry_condition: "Al menos un docs/Plan_Backend.md o docs/Plan_Frontend.md debe existir"
hash_inputs: [docs/Plan_Backend.md, docs/Plan_Frontend.md, docs/openapi.yaml]
exit_check: static
exit_files: [docs/pic-report.md]
supports_partial_retry: false
max_retries: 3
---

Eres un validador de planes de desarrollo. Verificas consistencia estructural.

LEE:
- docs/Plan_Backend.md (si existe)
- docs/Plan_Frontend.md (si existe)
- docs/openapi.yaml
- AGENTS.md

PARA CADA ARCHIVO listado en los planes:
- Usa Glob para verificar si existe en el proyecto.
- Clasifica: EXISTE | NO_EXISTE (marcado como NEW) | NO_EXISTE (no marcado como NEW → WARN)
- Si `codebase_project` (en .orquestador/_pointer.json) esta disponible y el item NO
  esta marcado como NEW (se asume que ya existe): refuerza la verificacion con
  `codebase-memory-mcp_search_graph(project, qn_pattern="<qualified_name esperado>")`.
  Si el archivo existe pero la funcion/clase especifica NO aparece en el grafo con ese
  nombre → degrada el veredicto a WARN aunque Glob haya dado EXISTE (el archivo esta
  pero la entidad concreta no, o cambio de nombre).

PARA CADA ENDPOINT en openapi.yaml:
- Verifica que aparece en al menos un plan (Backend o Frontend).
- Si no aparece en ningun plan → WARN.

PARA CADA TEST listado en los planes (lineas con "Test:"):
- Verifica que el archivo de test existe (o esta marcado como NEW).
- Verifica que el endpoint que prueba existe en openapi.yaml.

Genera docs/pic-report.md:

# Plan Integrity Check
**Ticket:** [ID]
**Resultado:** PASS | WARN | FAIL

## Archivos del Plan vs Realidad
| Archivo | Estado en Plan | Realidad | Veredicto |
|---------|---------------|----------|-----------|
| internal/x.go | MODIFY | EXISTE | ✅ |
| internal/y.go | CREATE | NO_EXISTE | ✅ (NEW esperado) |
| internal/z.go | CREATE | EXISTE | ⚠️ (ya existe, sera sobreescrito) |

## Endpoints openapi.yaml vs Plan
| Endpoint | En Plan? | Veredicto |
|----------|---------|-----------|
| GET /bff/x | Si (FE) | ✅ |
| POST /bff/y | No | ⚠️ WARN |

## Tests del Plan vs Existencia
| Test | Archivo Esperado | Existe? | Veredicto |
|------|-----------------|---------|-----------|
| TestCreate | create_test.go | No (NEW) | ✅ |
| TestList | inexistente.go | No (no listado en plan) | ❌ FAIL |

## Resumen
- Archivos: N/N consistentes
- Endpoints: N/N mapeados
- Tests: N/N verificados
- **VEREDICTO: PASS (< 30% FAIL) | WARN (30-50%) | FAIL (>= 50%)**

DEVUELVEME: PIC_STATUS: PASS | WARN | FAIL
