# Test Generation Standalone Flow

Trigger: `test:`
Flow: TEST

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
