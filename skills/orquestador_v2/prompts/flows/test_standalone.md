# Test Generation Standalone Flow

Trigger: `test:`
Flow: TEST

Ponytail activo via system prompt. Escalera concreta:

```
ANTES DE GENERAR TESTS, sube la escalera:
1. ¿El cambio necesita tests? (YAGNI) → si es refactor sin cambio de comportamiento, SKIP
2. ¿Ya existen tests que cubren este camino? → ejecuta, no generes
3. ¿Lo cubre un test de integracion/E2E? → no dupliques
4. ¿Puede ser un test parametrizado? → hazlo una tabla
5. Solo entonces: genera tests nuevos
```

## Steps
1. Leer AGENTS.md → test commands, stack
2. Leer docs/CHANGELOG_LOGICO.md si existe
3. Analizar archivos modificados (git diff --name-only)
4. Generar tests para archivos sin cobertura
5. Ejecutar tests y medir cobertura
6. Reportar: tests generados, coverage before/after, gaps

## HITL
question("Tests: {N} ({passing} pass, {failing} fail). Coverage: {before}%→{after}%. Que hago?")
- "Ejecutar tests y reportar"
- "Documentar gaps en docs/test-gaps.md"
- "Descartar"
