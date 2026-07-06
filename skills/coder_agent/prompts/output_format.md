# output_format — Formato de salida estructurado del coder_agent

Inyectar SIEMPRE al final del prompt de codificación.

---

## Formato de Salida (DEBES devolver esto al orquestador)

```
ARCHIVOS:
  - ruta/archivo → [CREATED | MODIFIED | SKIP] (razón breve)
PROGRESO: N/M archivos totales del plan
PONYTAIL_SCORE: 🐴/5
  - 🐴 razón 1
  - 🐴 razón 2
YAGNI_CHECK: qué se evitó construir
REUSE_CHECK: qué se reusó
TESTS: N checks (solo si lógica no-trivial)
ERROR: [solo si hay inconsistencia insalvable]

# Si progreso < 100% (límite de contexto)
PROXIMO_ARCHIVO: ruta/archivo
RECUPERABLE: true
```
