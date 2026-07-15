---
phase_id: checkpoint_1_5
type: checkpoint
agent: null
entry_condition: "openspec/changes/*/proposal.md debe existir"
hash_inputs: []
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 1
---

# Checkpoint 1.5 — Validación de Especificaciones OpenSpec

Este checkpoint presenta al usuario los artefactos OpenSpec generados y pide aprobación antes de continuar con la planificación técnica.

## Protocolo

```
1. Leer fases anteriores:
   - .orquestador/phases/phase_1_5_openspec.json → CHANGE_NAME, DOMAINS, REQUIREMENTS, SCENARIOS, TASKS, VALIDATION
   - .orquestador/summary.md

2. Leer los artefactos generados:
   - Glob openspec/changes/*/proposal.md → leer proposal
   - Glob openspec/changes/*/specs/** → leer specs (1-3 principales)
   - Glob openspec/changes/*/tasks.md → leer tasks
   - Glob openspec/changes/*/design.md → leer design

3. Armar resumen para el usuario:
```

```
┌──────────────────────────────────────────────────────────────┐
│  CHECKPOINT 1.5: Especificaciones OpenSpec                   │
│                                                              │
│  Cambio: {CHANGE_NAME}                                       │
│  Dominios: {DOMAINS}                                         │
│  Requirements: {N} | Escenarios: {M} | Tasks: {K}           │
│                                                              │
│  Validación:                                                 │
│  ├── Cobertura: {coverage}                                   │
│  ├── Trazabilidad: {traceability}                            │
│  └── Consistencia: {consistency}                             │
│                                                              │
│  Resumen del proposal:                                       │
│  {primeras 5 líneas del proposal.md}                         │
│                                                              │
│  Primer spec:                                                │
│  {primer requirement + primer scenario de cada spec}         │
│                                                              │
│  [Ver proposal completo]  [Ver specs]  [Aprobar]  [Rechazar] │
└──────────────────────────────────────────────────────────────┘
```

```
4. question(question="¿Las especificaciones OpenSpec cubren correctamente el cambio?", header="Checkpoint 1.5", options=[
   "Aprobar — specs correctos, continuar con plan técnico",
   "Ver proposal completo (abrir openspec/changes/*/proposal.md)",
   "Ver specs completo (abrir openspec/changes/*/specs/)",
   "Rechazar — necesito ajustar los specs"
 ])

5. Interpretar respuesta:
   - "Aprobar" → Write status=APPROVED, current_index++.
     Informar: "✅ Especificaciones aprobadas. Continuando con planificación técnica..."
   - "Ver proposal/specs" → Mostrar contenido completo en la respuesta.
     NO avanzar. El usuario debe decidir después de leer.
   - "Rechazar" → Write status=REJECTED.
     Retrocede current_index a phase_1_5_openspec.
     Resetea esa fase a status=PENDING, retries=0.
     Informar: "❌ Especificaciones rechazadas. Iterando sobre los specs..."
     Incluir el feedback del usuario como contexto para el reintento.
```

## Reglas Especiales

- Las especificaciones son la base de TODO el pipeline. Si están mal, el código saldrá mal.
- Incentivar al usuario a leer al menos el proposal + el primer spec antes de aprobar.
- Si VALIDATION tiene algún WARN, mencionarlo explícitamente y recomendar revisar.
- Si VALIDATION tiene FAIL, el checkpoint debe rechazar automáticamente con el mensaje de error.
