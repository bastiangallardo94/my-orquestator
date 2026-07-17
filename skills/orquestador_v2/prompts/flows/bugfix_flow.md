---
phase_id: phase_bugfix_analyze
type: agent
agent: orquestador-deep
entry_condition: "trigger == bugfix:"
hash_inputs: []
exit_check: static
exit_files: [docs/bugfix-analysis.md]
max_retries: 2
---

# Bugfix Flow

Usado para recovery desde checkpoint. El pipeline anterior fue SUCCESS pero lo desplegado provoco un bug.

## Phase B1: Bugfix Analyze
1. Encontrar ultimo checkpoint git: `git tag --list 'checkpoint-*' --sort=-version:refname`
2. Preguntar al usuario: "Bug ocurrio despues del checkpoint {X}. Usar ese diff?"
3. git diff HEAD <checkpoint> → ver cambios exactos
4. Root cause analysis:
   - trace_path de funciones modificadas
   - Buscar cambio que introdujo el bug
5. Output: docs/bugfix-analysis.md con hipotesis de causa raiz

## checkpoint_bugfix_analyze
question("Hipotesis: {resumen}. Continuamos?")

## Phase B3: Bugfix Fix
1. Aplicar fix minimo (solo lo necesario para resolver el bug)
2. Tests de regresion + flujo afectado
3. Output: fix + docs/bugfix-results.md

## Phase B4: Bugfix Revalidate
1. Ejecutar tests del area afectada
2. Verificar que no hay regression
3. Output: veredicto PASS/NEEDS_WORK

## checkpoint_bugfix
question("Fix aplicado. Veredicto: {veredicto}. Aprobar?")
