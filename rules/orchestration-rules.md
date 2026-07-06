# Reglas de Orquestación

## Flujo de Orquestación con Validación de Mapas

El pipeline de `orquestador_v2` incluye validación automática de mapas de arquitectura:

```
Phase 0 (bootstrap MCP + detección repos)
    ↓
Phase 0.5 (validar mapas: YAML → verificar vs código indexado)
    ↓
checkpoint_maps (por cada gap: preguntar resolución al usuario)
    ↓
Phase 1b / 1_tactico (análisis con api-surface.md activo)
    ...
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
