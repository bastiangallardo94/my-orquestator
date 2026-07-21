---
module_id: token-budget
load_on: [phase_0_bootstrap]
audience: orchestrator
description: Estimación de tokens y auto-degradación proactiva deep→fast
---

## Concept

Token budget estimation avoids context window overflow mid-pipeline. Without proactive tracking, a deep pipeline can exhaust the available context window during a critical phase, causing truncation, silent data loss, or agent degradation at the worst possible moment.

The orchestrator estimates total token consumption before Phase 1 begins, monitors consumption after each phase, and auto-degrades from `deep` to `fast` when the budget is tight.

## Estimation Algorithm

```
Base overhead:      2000 tokens  (SKILL.md core + protocol)

Per-phase (each phase in the pipeline):
  agent type:       8000 tokens  (subagent task, result, file I/O)
  checkpoint type:  3000 tokens  (user interaction, approval)
  report type:      2000 tokens  (summary generation)

Retry penalty:      +50% tokens per retry (applied to phase base cost)

Total = base + sum(phase_costs) + retry_penalties
```

### Phase cost assignment

Each phase in the pipeline is classified by its primary action type:
- **agent**: Phase 1b (análisis), Phase 2 (codificación TDD), Phase 3 (QA), Phase 4 (deploy)
- **checkpoint**: Phase 1a (checkpoint con usuario), validaciones intermedias
- **report**: Phase 6 (reporte final), Phase 7 (documentación)

### Retry calculation

If a phase has been retried N times, its base cost is multiplied by (1 + 0.5 × N).

## Threshold Rules

| Ratio     | Action                                           |
|-----------|--------------------------------------------------|
| > 70%     | Auto-degradar agent_override a "orquestador-fast" |
| 50–70%    | Advertencia en bootstrap, mantener deep           |
| < 50%     | Sin acción                                       |

Ratio = (estimated / max_context_window) × 100, where `max_context_window` is the model's context limit (e.g., 128000 for Claude 4, 200000 for GPT-4o).

## Usage in Phase 0

```
1. estimate-tokens(projectPath=cwd) → {estimated, max, ratio, recommended}
2. Guardar en state.yaml: state.token_budget = {estimated, consumed: 0, remaining: estimated}
3. Si ratio > 70%: auto-set agent_override=orquestador-fast, notificar usuario
4. Si ratio > 50%: warning "Pipeline extenso, monitorear consumo"
```

## Post-Phase Update

After each phase completes:

```
1. Leer state.yaml → token_budget.consumed
2. Estimar tokens reales consumidos (basado en output del subagente)
3. Actualizar: consumed += real_cost
4. Actualizar: remaining = estimated - consumed
5. Si remaining < 10000 → alerta: "⚠️  Budget bajo: {remaining} tokens restantes"
```

Real cost estimation per subagent output:
- Agent output: count characters / 4 (rough tokenization)
- Checkpoint interaction: 3000 tokens flat
- Report: 2000 tokens flat

## Tracking Format in state.yaml

```yaml
token_budget:
  estimated: 85000
  consumed: 32000
  remaining: 53000
  ratio: 41
  auto_degraded: false
```

## Notes

- La estimación inicial se basa en el número y tipo de fases planificadas más el overhead del protocolo.
- El ratio se recalcula después de cada fase con `remaining / max_context_window`.
- Si `auto_degraded` pasa a `true`, el orquestador cambia el modo del pipeline a `fast` y omite fases no críticas (Phase 4, Phase 7).
- La alerta de budget bajo (remaining < 10000) se envía al usuario como advertencia, no como bloqueo.

Nota: Es una estimación, no una medición exacta. El consumo real puede variar ±20%.
