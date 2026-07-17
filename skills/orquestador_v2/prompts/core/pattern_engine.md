# Pattern Engine — Knowledge Base Protocol

## Structure
```
~/.config/opencode/knowledge/
├── patterns/      ← fichas .md de patrones probados
├── anti-patterns/ ← anti-patrones documentados
├── templates/     ← plantillas reutilizables
└── registry.json  ← indice global
```

## Mode 1: CONSULT (before coding)
- Before: phase_2_backend, phase_2_frontend, phase_3_coding
- Read registry.json → filtrar por stack + category
- Para cada match: inyectar como "[PATRON PROBADO]" en prompt del subagente
- Si hay template relevante: usar como base del plan

## Mode 2: CAPTURE (after approved code)
- After: phase_3_coding SUCCESS con CR >= 70
- Si 3+ archivos comparten estructura similar → extraer patron
- Preguntar en checkpoint_3: "Guardar patron?" → "Probado (0.7)" / "Experimental (0.4)" / "No"
- Si aprueba: escribir ficha + actualizar registry.json

Deteccion automatica:
- 3+ archivos con mismos imports → patron data-fetching/state/testing
- 3+ hooks misma estructura → patron hooks
- 3+ componentes misma jerarquia → patron componentes
- 3+ tests mismo describe/it → patron testing

## Mode 3: VALIDATE (in code review)
- Phase 3 coding (B4 step): cada archivo nuevo vs patrones
- Si desvia sin razon → WARN
- Si usa anti-patron → FAIL
- Incluir en output CR_SCORE, CR_STATUS

## Metrics
registry.json mantiene:
- confidence: 0.0-1.0 (uso exitoso +0.05, rechazo -0.10)
- usage_count: incrementa con cada uso exitoso
- last_used: fecha del ultimo uso
- source: imported | auto-detected | manual

## Init (one-time)
Si knowledge/ no existe:
1. Crear estructura
2. registry.json vacio
3. Importar patrones base desde skills existentes
