# Review Standalone Flow

Trigger: `review:`
Flow: REVIEW

## Steps
1. Leer AGENTS.md → stack, lint/compile commands
2. Ejecutar lint: comando segun stack
3. Verificar compilacion
4. Code review del diff actual (git diff HEAD~1)
   - Si codebase_project disponible: query_graph para metricas de complejidad
5. Generar reporte con hallazgos

## HITL
question("Hallazgos: {N} issues ({critical} criticos). Que hago?")
- "Generar correcciones y ejecutar" → aplica fixes, re-review
- "Solo documentar en docs/review-plan.md"
- "Descartar"
