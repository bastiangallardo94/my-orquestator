# Compaction Awareness

Leer SOLO si detectas que perdiste contexto por compaction.

## Que hacer
1. Read .orquestador/_pointer.json → estado completo (flow, impact, phase_order, current_index)
2. Read .orquestador/context.md → contexto relevante
3. Read .orquestador/phases/{current_phase}.json → estado de fase actual
4. Continua Protocolo de Bucle desde donde quedo

## Regla
EL ESTADO EN DISCO ES TU MEMORIA. No adivines. Si no puedes leer archivos, informa al usuario.
