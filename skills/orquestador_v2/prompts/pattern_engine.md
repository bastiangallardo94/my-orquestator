# Motor de Patrones — Instrucciones para el Orquestador

Este modulo se lee cuando una fase necesita consultar o capturar patrones de conocimiento.

---

## Estructura del Knowledge Base

```
~/.config/opencode/knowledge/
├── patterns/          ← patrones probados (fichas .md)
├── anti-patterns/     ← anti-patrones documentados
├── templates/         ← plantillas completas reutilizables
└── registry.json      ← indice global
```

## Schema de registry.json

```json
{
  "version": "1.0",
  "patterns": [
    {
      "id": "frontend/data-fetching/tanstack-query-crud",
      "name": "TanStack Query CRUD",
      "category": "data-fetching",
      "stack": "react-18",
      "confidence": 0.92,
      "usage_count": 7,
      "last_used": "2026-07-08",
      "source": "auto-detected",
      "file": "patterns/frontend/data-fetching/tanstack-query-crud.md"
    }
  ],
  "anti_patterns": [
    {
      "id": "frontend/data-fetching/useeffect-for-fetching",
      "name": "useEffect para Fetching",
      "category": "data-fetching",
      "stack": "react-18",
      "severity": "FAIL",
      "file": "anti-patterns/frontend/useeffect-for-fetching.md"
    }
  ],
  "templates": [
    {
      "id": "feature-crud-react",
      "name": "Feature CRUD React",
      "stack": "react-18",
      "file": "templates/feature-crud-react.md"
    }
  ]
}
```

---

## Modo 1: CONSULTA (antes de codificar)

### Cuando
- phase_2_frontend (antes de escribir Plan_Frontend.md)
- phase_2_backend (antes de escribir Plan_Backend.md)
- phase_3_coding (antes de implementar cada archivo)

### Como
1. `Read ~/.config/opencode/knowledge/registry.json`
2. Filtrar por `stack` detectado en AGENTS.md
3. Filtrar por `category` relevante al archivo/feature
4. Para cada match:
   - `Read ~/.config/opencode/knowledge/{patron.file}`
   - Inyectar como "[PATRON PROBADO]" en el prompt del subagente
5. Si hay template relevante:
   - `Read ~/.config/opencode/knowledge/{template.file}`
   - Usar como base del plan en vez de generar desde cero

### Ejemplo de inyeccion en prompt
```
=== PATRONES PROBADOS DEL PROYECTO ===
Los siguientes patrones han sido exitosos en este proyecto.
Usalos como base y NO los desvies sin razon documentada.

[Patron: TanStack Query CRUD]
Category: data-fetching | Confidence: 92% | Usado: 7 veces
Resumen: Service -> Types -> Hook con invalidacion automatica
Codigo: {contenido de la ficha}

[Anti-patron: useEffect para fetching]
Severity: FAIL | Razon: Causa race conditions y no maneja cache
```

---

## Modo 2: CAPTURA (despues de codigo aprobado)

### Cuando
- phase_3_5_review -> CR >= 70 (codigo aprobado)
- checkpoint_3 -> APPROVED por el usuario

### Como
1. Analizar archivos creados en phase_3_coding
2. Para cada grupo de 3+ archivos con estructura similar:
   a. Extraer: imports comunes, hooks/patrones usados, estructura de carpetas
   b. Comparar con patrones existentes en registry.json
   c. Si es variacion de patron existente -> incrementar confidence + usage_count
   d. Si es patron nuevo -> generar candidata
3. Generar candidata en `/tmp/orquestador/pattern-candidate.md`
4. En checkpoint_3, preguntar:
   ```
   question(
     question: "Detecte un patron recurrente en {N} archivos: {descripcion}. ¿Lo guardo?",
     header: "Nuevo Patron",
     options: [
       "Guardar como patron probado (confidence: 0.7)",
       "Guardar como experimental (confidence: 0.4)",
       "No guardar"
     ]
   )
   ```
5. Si aprueba -> escribir ficha en knowledge/patterns/ + actualizar registry.json

### Deteccion automatica de patrones
El agente de review analiza:
- **Imports comunes**: Si 3+ archivos importan las mismas librerias -> posible patron de data-fetching/state/testing
- **Estructura de hooks**: Si 3+ hooks siguen el mismo patron (useQuery + invalidacion) -> patron de hooks
- **Estructura de componentes**: Si 3+ componentes tienen la misma jerarquia (Manager -> List -> Item) -> patron de componentes
- **Estructura de tests**: Si 3+ test files siguen el mismo describe/it pattern -> patron de testing

---

## Modo 3: VALIDACION (en code review)

### Cuando
- phase_3_5_review -> analisis de adherencia

### Como
1. Para cada archivo nuevo:
   - Buscar patron matching en registry.json (por stack + category + estructura)
   - Si matchea un patron -> verificar que sigue la estructura
   - Si se desvia -> WARN con "Desviacion del patron {id}: {razon}"
2. Para cada archivo nuevo vs anti-patrones:
   - Si usa un anti-patron -> FAIL con "Anti-patron detectado: {id}"
3. Incluir en code-review-report.md:
   ```
   ## Adherencia a Patrones
   - Patrones usados: [lista]
   - Desviaciones: [lista con severidad]
   - Anti-patrones detectados: [lista]
   - Patrones candidatos: [lista, si los hay]
   ```

---

## Inicializacion del Knowledge Base

Si `~/.config/opencode/knowledge/` no existe:
1. Crear estructura de directorios
2. Generar `registry.json` vacio
3. Importar patrones base desde skills existentes:
   - `vercel-react-best-practices` -> knowledge/patterns/frontend/performance/
   - `coder_agent/prompts/coder_frontend.md` -> knowledge/patterns/frontend/component-architecture/
   - `planner_front.md` -> knowledge/patterns/frontend/data-fetching/
   - `accessibility` -> knowledge/patterns/cross-cutting/accessibility-checklist.md

---

## Metricas del Knowledge Base

El orquestador mantiene metricas en `registry.json`:
- **confidence**: 0.0-1.0, incrementa con cada uso exitoso, decrementa con rechazo
- **usage_count**: numero de veces que el patron ha sido usado exitosamente
- **last_used**: fecha del ultimo uso
- **source**: `imported` (de skills existentes), `auto-detected` (por el motor), `manual` (por el usuario)

### Actualizacion de confidence
- Uso exitoso (CR >= 70): confidence += 0.05 (max 1.0)
- Uso rechazado (checkpoint rechazado): confidence -= 0.10
- Patron con confidence < 0.3: marcar como "experimental" en registry
- Patron con confidence >= 0.9: marcar como "probado" en registry
