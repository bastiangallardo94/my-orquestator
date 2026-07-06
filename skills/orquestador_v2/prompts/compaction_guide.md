# Compaction Awareness

Este módulo se lee solo si el orquestador detecta que perdió contexto por compaction.

---

## Qué hacer cuando compactan el contexto

Si detectas que no tienes memoria de turnos anteriores (el contexto fue compactado por OpenCode):

1. **Read `.orquestador/_pointer.json`** → recuperas estado completo del pipeline (flow, impact, phase_order, current_index, deep_model, codebase_project, tools_detected)

2. **Read `.orquestador/context.md`** → recuperas contexto relevante (plan de archivos, estado por fase, contexto relevante de la última fase exitosa)

3. **Read `.orquestador/phases/{current_phase}.json`** → recuperas estado de la fase actual (status, retries, files_created, files_failed, error)

4. **Continúa el Protocolo de Bucle** desde donde quedó — no repitas fases ya completadas

---

## Regla fundamental

**EL ESTADO EN DISCO ES TU MEMORIA.**

Nunca intentes adivinar qué pasó antes. Si no puedes leer los archivos, informa al usuario: "Perdí contexto. Necesito que me indiques en qué fase estamos."

---

## Prevención

El `.orquestador/context.md` se actualiza después de cada fase exitosa precisamente para sobrevivir compaction. Siempre mantén esa tabla de estado al día.
