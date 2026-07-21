# Unit Test Loop Flow

Trigger: `unit-test: [target%]`
Flow: UNIT_TEST

Ponytail activo via system prompt. Escalera concreta:

```
ANTES DE GENERAR TESTS, sube la escalera:
1. ¿El codigo ya tiene cobertura aceptable? → target alcanzado, detente
2. ¿Los tests necesarios ya existen? → solo ejecuta, no generes
3. ¿Lo cubre un test de integracion existente? → no dupliques con unit
4. ¿Puede ser un test parametrizado (table-driven)? → hazlo una tabla
5. Solo entonces: genera tests nuevos
```

## Phase U1: Generate Tests
1. Analizar cobertura actual
2. Generar tests para archivos sin cobertura
3. Ejecutar tests
4. Reportar coverage

## checkpoint_unit_test_loop
- Leer coverage-history.md
- coverage >= target → stopped (success)
- Aumento >= 8% desde iteracion anterior → continuar loop
- Aumento < 8% → question("Coverage: {X}%. Aumento: +{Y}% (threshold: 8%). Target: {target}%. Que hacemos?")
  - "Reducir target a {X}%"
  - "Continuar sin threshold"
  - "Detener"

## Phase U2-U4: Iterate
Repetir U1 hasta target alcanzado o 5 iteraciones maximo.

## Phase U6: Report
Mostrar history final de coverage.
