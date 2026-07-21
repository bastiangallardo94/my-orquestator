---
module_id: cross-pipeline-learning
load_on: [phase_0_bootstrap]
audience: orchestrator
description: Aprendizaje entre pipelines — analiza pipelines anteriores para mejorar el actual
---

## Concept

Cada pipeline deja trazas en `.orquestador/history/` y Engram. El nuevo pipeline las consulta antes de empezar para evitar errores previos.

## Protocol in Phase 0

```
1. Buscar pipeline anterior más similar en .orquestador/history/:
   - Leer history/*/state.yaml → match por change_type + feature name
   - Tomar el más reciente con mismo change_type

2. Analizar pipeline anterior:
   - Si tuvo retries frecuentes en phase_3_coding → inyectar alerta
   - Si tuvo Ponytail score < C → inyectar: "Priorizar calidad estructural"
   - Si tuvo CR_SCORE < 70 → inyectar: "Mejorar adherencia a patrones"

3. Buscar en Engram:
   mem_search(query="<change_name>", type="bugfix", limit=5)
   mem_search(query="<change_type>", type="learning", limit=3)

4. Si hay resultados relevantes:
   - Inyectar en context.md sección "## Cross-Pipeline Learning"
   - Incluir: fecha, issue, recomendación
```

## Format to inject in context.md

```markdown
## Cross-Pipeline Learning
- Pipeline anterior similar: {date} | {flow}
- Retries en coding: {N} (razón: {reason})
- Ponytail score: {score} (tech debt: {N}h)
- Bugs post-deploy: {count}
- Lecciones: {lista}
- ⚠️ Recomendación: {recomendación basada en análisis}
```

## Save at pipeline end (Phase 6)

```
mem_save(
  title="Pipeline completado: {feature_name}",
  content="## What\n{flow}/{impact} pipeline completado para {feature}\n## Why\n{user_request}\n## Where\n{archivos creados/modificados}\n## Learned\n{retries, issues, lecciones}",
  type="learning",
  topic_key="learning/{pipeline-tag}"
)
```

## Format for history analysis

- Pipeline anterior: leer state.yaml del history
- Extraer métricas: total_phases, retries, failed_phases, duración
- Score de salud: 100 - (retries * 10) - (failed_phases * 20)

Sin datos de pipeline anterior? No hacer nada — el pipeline continúa normalmente sin recomendaciones.
