# Review Standalone Flow

Trigger: `review:`
Flow: REVIEW

Ponytail mode activo via system prompt — revisa por sobre-ingenieria, no solo por bugs.

## Steps
1. Leer AGENTS.md → stack, lint/compile commands
2. Ejecutar lint: comando segun stack
3. Verificar compilacion
4. Code review del diff actual (git diff HEAD~1)
   - Si codebase_project disponible: query_graph para metricas de complejidad
5. **Ponytail Over-Engineering Check**:
   - Por cada archivo nuevo/modificado: ¿cada linea es necesaria? ¿hay abstracciones no pedidas? ¿boilerplate eliminable?
   - ¿Se pudo resolver con stdlib, nativo, o una linea?
   - ¿Hay `ponytail:` comments en simplificaciones deliberadas?
   - Reportar como "SIMPLIFICACIONES POSIBLES: [lista]"
6. Generar reporte con hallazgos

## HITL
question("Hallazgos: {N} issues ({critical} criticos, {simplifications} simplificaciones posibles). Que hago?")
- "Generar correcciones y ejecutar" → aplica fixes, re-review
- "Solo documentar en docs/review-plan.md"
- "Descartar"
