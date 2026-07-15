---
phase_id: checkpoint_ponytail
type: checkpoint
agent: null
entry_condition: "docs/ponytail-review.md debe existir"
hash_inputs: []
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 1
---

# Checkpoint Ponytail — Plan de Acción sobre Calidad de Código

Este checkpoint presenta los resultados del Ponytail Review y pregunta al usuario qué hacer con los hallazgos.

---

## Protocolo

```
1. Leer fases anteriores:
   - .orquestador/phases/phase_5_5_ponytail_review.json → PONYTAIL_SCORE, ISSUES, TECH_DEBT_HOURS, MUST_FIX
   - .orquestador/phases/phase_3_coding.json → FILES_CREATED, FILES_MODIFIED
   - docs/ponytail-review.md

2. Si MUST_FIX == true:
   - Mostrar advertencia: "⚠️ Hay issues CRITICAL que requieren corrección antes de continuar."
   - Las opciones [2] y [3] se deshabilitan (solo se puede corregir)

3. Armar resumen para el usuario:
```

```
┌──────────────────────────────────────────────────────────────┐
│  PONYTAIL CODE QUALITY REVIEW                                │
│                                                              │
│  Score: {A|B|C|D|F}  |  Tech Debt: {N}h  |  Issues: {N}    │
│                                                              │
│  Resumen:                                                    │
│  ├── CRITICAL: {N} — {descripción rápida}                    │
│  ├── HIGH: {N}     — {descripción rápida}                    │
│  ├── MEDIUM: {N}   — {descripción rápida}                    │
│  └── LOW: {N}      — {descripción rápida}                    │
│                                                              │
│  Complejidad promedio: {MCC}  |  Duplicación: {N} bloques   │
│  Escenarios OpenSpec: {N}% cubiertos                         │
│                                                              │
│  {Ver reporte completo en docs/ponytail-review.md}           │
│                                                              │
│  ¿Plan de acción?                                            │
└──────────────────────────────────────────────────────────────┘
```

```
4. question(question="¿Qué hacemos con los hallazgos del Ponytail Review?", header="Ponytail Review", options=[
  "Corregir issues ahora — aplicar fixes automáticos y re-verificar",
  "Documentar en docs/ponytail-review.md y continuar (se corrige después)",
  "Ignorar — aceptar deuda técnica y continuar"
])

5. Interpretar respuesta:

   a. "Corregir issues ahora":
      - Write status=APPROVED, current_index++
      - AGREGAR phase_5_5_1_corrections al phase_order (insertar después de este checkpoint)
      - Informar: "🛠️ Ejecutando correcciones automáticas..."
      - La siguiente fase será phase_5_5_1_corrections

   b. "Documentar y continuar":
      - Write status=APPROVED, current_index++
      - docs/ponytail-review.md ya existe → se pasa al PR phase para incluirlo
      - Informar: "📝 Hallazgos documentados. Se incluirán en el PR. Continuando..."

   c. "Ignorar":
      - Write status=APPROVED, current_index++
      - Informar: "✅ Deuda técnica aceptada. Continuando..."
```

---

## Corrección Automática (sub-fase)

Cuando se elige "Corregir issues ahora", se ejecuta **phase_5_5_1_corrections**:

```yaml
---
phase_id: phase_5_5_1_corrections
type: agent
agent: orquestador-fast
entry_condition: "docs/ponytail-review.md debe existir"
exit_check: verify_reported_files
exit_files: []  # los mismos archivos de phase_3_coding, ahora corregidos
max_retries: 2
---
```

Instrucciones:
1. Lee `docs/ponytail-review.md` → issues a corregir (solo CRITICAL/HIGH)
2. Por cada issue, aplica el fix sugerido:
   - Complejidad alta → extraer funciones, simplificar lógica
   - Duplicación → crear función compartida
   - Anti-patrones → refactorizar según el patrón correcto
   - Escenarios sin test → agregar tests faltantes
3. No modifiques archivos que no tengan issues
4. Después de corregir, re-ejecuta lint + compile para verificar
5. Actualiza `docs/ponytail-review.md` con los cambios aplicados
6. Reporta qué se corrigió y qué quedó pendiente

Después de phase_5_5_1_corrections, el pipeline vuelve a phase_5_5_ponytail_review para re-verificar.

**Máximo 3 ciclos** corrección → re-verify. Si después de 3 ciclos aún hay CRITICAL/HIGH,
preguntar al usuario si acepta o aborta.
