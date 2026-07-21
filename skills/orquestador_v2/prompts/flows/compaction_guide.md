# Compaction Awareness

Leer SOLO si detectas que perdiste contexto por compaction.

## Que hacer
1. Read .orquestador/state.yaml → estado completo (flow, impact, phase_order, current_index)
2. Read .orquestador/context.md → contexto relevante
3. state(projectPath=cwd) → state.phases.{current_phase} → estado de fase actual
4. Continua Protocolo de Bucle desde donde quedo

## Regla
EL ESTADO EN DISCO ES TU MEMORIA. No adivines. Si no puedes leer archivos, informa al usuario.
