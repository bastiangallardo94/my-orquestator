# Checkpoints — Protocolo Centralizado

## REGLA DE BLINDAJE
TODO checkpoint DEBE llamar a question(). No existe auto-approve excepto checkpoint_maps (coverage >= 80%) y checkpoint_2 (PIC PASS sin WARNs).

NUNCA asumas aprobacion. NUNCA ejecutes contenido en el mismo turno que un checkpoint.

## Protocolo
```
1. Read .orquestador/summary.md + fase anterior
2. Arma opciones segun tipo (ver tabla)
3. question(question="...", header="Checkpoint", options=[...])
4. Interpreta:
   - Aprobacion → status=APPROVED, current_index++
   - Rechazo → status=REJECTED, retroceder a fase de contenido, resetear PENDING
5. TodoWrite + summary.md
```

Si offsite activo → skills/offsite_slack.md reemplaza question() con slack_bridge_*

## Tabla de Checkpoints

| checkpoint_id | Pregunta | Opciones | Condicional |
|---|---|---|---|
| checkpoint_maps | "Validar mapas de arquitectura?" | Ver detalles / Ignorar gaps | Auto-approve si coverage ≥ 80% |
| checkpoint_1 | "Logica de negocio y casos de uso correctos?" | Aprobar / Rechazar / Ver detalle | BLINDAJE ACTIVO |
| checkpoint_2 | "Apruebas plan tecnico para codificar?" | Aprobar / Rechazar / Ver plan | Auto-approve si PIC PASS sin WARNs |
| checkpoint_3 | Mostrar resumen: archivos, tests, cobertura, compile, lint, CR. "Apruebas?" | Aprobar / Ver detalle CR / Rechazar | BLINDAJE ACTIVO |
| checkpoint_4 | "Apruebas QA para pasar a PR?" | Aprobar / Revisar fallidos / Known issues | BLINDAJE ACTIVO |

### Checkpoints eliminados en v3
- checkpoint_1_5 (OpenSpec) → absorbido por checkpoint_1
- checkpoint_ponytail (Ponytail) → absorbido por checkpoint_3

## checkpoint_3 (con datos reales)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKPOINT 3: Resumen de Codificacion
ARCHIVOS: {N} creados, {M} modificados
TESTS: {X}/{Y} pasando ({Z}%)
COBERTURA: {A}% statements
COMPILE: {status}
LINT: {status} ({N} warnings)
CODE REVIEW: {score}/100 ({status})
TECH DEBT: {N}h estimada
SPEC COVERAGE: {N}%
[Ver detalle] [Aprobar] [Rechazar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Offsite Mode
Si offsite=true en _pointer.json:
- slack_bridge_send_checkpoint(checkpoint_id, title, summary, question, project_name)
- slack_bridge_wait_for_checkpoint(checkpoint_id)
- Botones Approve/Reject

Fallback a question() si bridge caido.
