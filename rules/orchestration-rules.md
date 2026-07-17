# Reglas de Orquestación

## Flujo de Orquestación con Validación de Mapas

El pipeline de `orquestador_v2` incluye validación automática de mapas de arquitectura:

```
Phase 0 (warm bootstrap: trigger, health check, confirm)
    ↓
Phase 0.5 (validar mapas: YAML → verificar vs código indexado)
    ↓
checkpoint_maps (auto-approve si coverage ≥80%, si no pregunta cada gap)
    ↓
Phase 1 (análisis de negocio + generación OpenSpec specs)
    ↓
checkpoint_1 (HITL: ¿lógica de negocio correcta?)
    ↓
Phase 2 Backend + Frontend (planes técnicos TDD, paralelos si fullstack)
    ↓
Phase 2.5 PIC+Conflictos (Plan Integrity Check + detección de conflictos cross-pipeline)
    ↓
checkpoint_2 (auto-approve si PIC PASS)
    ↓
Phase 3 (codificación TDD + code review + ponytail quality inline)
    ↓
checkpoint_3 (HITL: ¿apruebas codificación?)
    ↓
Phase 4 (QA con risk-based testing + API/BD audit + E2E)
    ↓
checkpoint_4 (HITL: ¿apruebas QA?)
    ↓
Phase 5 (documentación técnica, solo COMPLETO)
    ↓
Phase 6 (reporte final + telemetría, inline)
```

## API Surface Map

Después de Phase 0.5, se genera `.orquestador/api-surface.md` que documenta:
- Coverage por capa (Frontend→BFF, BFF→Backend)
- Paths confirmados vs. proyectados vs. missing
- Gaps pendientes de resolver

## Coverage Threshold

- ≥ 80% + gaps resueltos → checkpoint_maps auto-aprobado
- < 80% o gaps pendientes → pregunta por cada gap antes de continuar

## Mapa de Arquitectura (Opcional)

Si el proyecto usa multi-repo con BFF + Backend + Frontend:
- `service-map.yaml` — BFF → Backend MS (Feign clients, paths)
- `frontend-to-bff-service-map.yaml` — Frontend MFs → BFF paths

Ambos mapas se generan y mantienen en `.orquestador/` del proyecto principal.

## Trazado Cross-Service

Cuando `codebase-memory-mcp` no detecta arcos cross-repo automáticamente:
1. Leer mapas manuales en `.orquestador/`
2. Usar `trace_path(mode="cross_service")` para rastrear impacto
3. Res Frontend→BFF→Backend usando los mapas como guía
