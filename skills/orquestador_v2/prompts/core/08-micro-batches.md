---
module_id: micro-batches
load_on: [protocol_bucle, phase_0_bootstrap]
audience: orchestrator
description: Agrupación de fases en micro-batches para reducir turnos totales
---

## Concept

Ejecutar 2+ fases compatibles en un solo turno para reducir el número total de turnos ~35%.
En lugar de un paso por turno, el orquestador agrupa fases que pueden ejecutarse de forma
segura en paralelo o en secuencia sin intervención humana intermedia.

## Safe batch pairs

| Fase A | Fase B | ¿Batch? | Razón |
|--------|--------|---------|-------|
| phase_2_7_pic_deps | phase_2_8_conflict_detection | ✅ Siempre | Ambos análisis, no mutan código |
| phase_4_qa | phase_4_5_telemetry | ✅ Siempre | QA + telemetría |
| phase_2_backend | phase_2_frontend | ✅ FULLSTACK | Paralelo nativo |
| phase_3_coding | phase_3_5_review | ❌ | Review necesita código COMPLETO |
| Cualquier agent | checkpoint | ❌ | Checkpoint requiere HITL |
| phase_5_5_ponytail | phase_5_7_pull_request | ⚠️ solo si checkpoint ponytail APPROVED | Secuencia natural |

## Configuration in state.yaml

```yaml
batch_map:
  phase_2_7: [phase_2_7_pic_deps, phase_2_8_conflict_detection]
  phase_4_combo: [phase_4_qa, phase_4_5_telemetry]
  phase_2_par: [phase_2_backend, phase_2_frontend]
```

## Protocol modification

```
1. next-batch(projectPath=cwd) → {batch, phases[], batch_name}
2. Si batch == true:
   a. Para cada fase en phases[]:
      - task() con prompt combinado
      - Ejecutar exit_check para cada fase
   b. Marcar TODAS las fases del batch como SUCCESS/FAILED
   c. current_index += phases.length
3. Si batch == false:
   a. Ejecutar fase normal (un paso por turno)
```

## Exception

Si cualquier fase en un batch FAILED, el batch completo se marca PARTIAL.
Se reintentan las fases individuales en el próximo turno (no el batch completo).

## Rule

"NUNCA hacer batch de un checkpoint con otra fase. Los checkpoints siempre son individuales."

---

Los micro-batches son una optimización opcional. El pipeline funciona correctamente sin ellos
(modo un-paso-por-turno clásico).
