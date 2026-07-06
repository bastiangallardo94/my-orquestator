---
name: playwright-e2e-agent
description: "Playwright E2E Test Agents — Setup, Planner, Generator y Healer para generacion automatica de tests E2E desde especificaciones en lenguaje natural."
---

# Skill: Playwright E2E Test Agents

## Rol

Ejecuta el ciclo completo de Playwright Test Agents (Planner, Generator, Healer) para generar tests E2E desde planes en lenguaje natural. Diseñado para microfrontends Angular que corren en modo standalone (sin portal).

## Modos de Operacion

| Modo | Proposito | Cuando se ejecuta |
|------|-----------|-------------------|
| **SETUP** | Instala Playwright, inicializa agent definitions, crea config | Phase 2.5 (pre-codificacion) |
| **PLANNER** | Genera `specs/*.md` explorando la app o leyendo el plan | Phase 2.5 (pre-codificacion) |
| **GENERATOR** | Convierte `specs/*.md` en `tests/*.spec.ts` verificando en vivo | Phase 3.5 (post-codificacion) |
| **HEALER** | Ejecuta tests y repara fallos (max 3 intentos por test) | Phase 3.5 (post-codificacion) |

---

## [SETUP] Instrucciones

```
1. npm install -D @playwright/test
2. npx playwright install chromium
3. npx playwright init-agents --loop=opencode
4. Crear playwright.config.ts con webServer apuntando al MFE standalone
5. Crear tests/seed.spec.ts con autenticacion via token + mount del MFE
```

### Estructura generada

```
.github/agents/           # Agent definitions (Planner, Generator, Healer)
specs/                    # Test plans en markdown
tests/
  seed.spec.ts            # Seed test con setup de auth + MFE
playwright.config.ts
```

### Template playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:2001',
    extraHTTPHeaders: {
      Authorization: 'Bearer test-token',
    },
  },
  webServer: {
    command: 'npm run start',
    port: 2001,
    reuseExistingServer: true,
  },
});
```

### Template seed.spec.ts
*El selector raíz se lee de AGENTS.md como `PLAYWRIGHT_ROOT_SELECTOR`. Default: `app-root` para Angular, `#root` para React.*

Si PLAYWRIGHT_ROOT_SELECTOR no está en AGENTS.md, detectar automáticamente:
- Si existe `angular.json` → usar `app-root`
- Si existe `package.json` con `react` → usar `#root`
- Default: `app-root`

```typescript
import { test } from '@playwright/test';

test('seed', async ({ page }) => {
  // Inyectar token antes de que la app cargue
  await page.addInitScript(() => {
    localStorage.setItem('auth_token', 'test-token');
  });
  await page.goto('/');
  // Esperar a que el microfrontend monte
  await page.waitForSelector(process.env.PLAYWRIGHT_ROOT_SELECTOR || 'app-root', { timeout: 10000 });
});
```

#### 2.5 MSW Configuration for E2E
Cuando los tests E2E requieren datos controlados (no depender del BFF real):

1. Agregar al inicio de `tests/seed.spec.ts` o `playwright.config.ts`:
```typescript
// playwright.config.ts - Agregar como globalSetup
import { setupMSW } from '../src/mocks/playwright-setup';

export default defineConfig({
  globalSetup: './tests/setup-msw.ts',
  // ...
});
```

2. Crear `tests/setup-msw.ts`:
```typescript
import { spawn } from 'child_process';

async function globalSetup() {
  // Iniciar MSW server standalone para E2E (puerto 3001)
  const msw = spawn('npx', ['msw', 'start', '--port', '3001'], {
    env: { ...process.env, MSW_E2E: 'true' },
  });
  
  return async () => {
    msw.kill();
  };
}
export default globalSetup;
```

3. En `playwright.config.ts`, configurar el MSW server como webServer adicional o inyectar via `page.route()`.

---

## [PLANNER] Instrucciones

El Planner genera planes de prueba en `specs/*.md`. Tiene dos sub-modos:

### Planner — Regresion (app existente)

Cuando la app ya existe y se quiere cubrir regresion:

1. Iniciar dev server: `npm run start`
2. Invocar al Planner con un prompt como:

> "Eres el 🎭 Planner de Playwright. Explora la aplicacion en http://localhost:2001 y genera un plan de tests E2E en `specs/regression-[area].md`. Identifica los flujos principales, elementos clave y estados. Usa `tests/seed.spec.ts` como seed test."

3. El Planner explorara la app y generara `specs/regression-*.md`

### Planner — Nueva feature (desde plan)

Cuando la feature no existe aun (Phase 2.5 pre-codificacion):

1. Leer `docs/Plan_Frontend.md` para conocer el comportamiento esperado
2. Invocar al Planner con un prompt como:

> "Eres el 🎭 Planner de Playwright. Tienes el plan de frontend en `docs/Plan_Frontend.md`. Genera un plan de tests E2E en `specs/[feature].md` basado en los escenarios descritos. Incluye: flujo feliz, estados vacio, error, y casos borde. No necesitas explorar la app — los escenarios estan definidos en el plan."

3. El Planner generara `specs/[feature].md` con los escenarios

---

## [GENERATOR] Instrucciones

El Generator convierte `specs/*.md` en tests Playwright ejecutables. **Requiere que la feature ya este implementada y el dev server corriendo.**

1. Asegurar que el dev server este corriendo: `npm run start`
2. Asegurar que `tests/seed.spec.ts` exista y funcione
3. Invocar al Generator con un prompt como:

> "Eres el 🎭 Generator de Playwright. Toma el plan en `specs/[feature].md` y genera tests Playwright en `tests/[feature].spec.ts`. Usa `tests/seed.spec.ts` como seed. Verifica los selectores y aserciones contra la app en http://localhost:2001."

4. El Generator creara `tests/[feature].spec.ts`

---

## [HEALER] Instrucciones

El Healer ejecuta los tests y repara fallos. **Politica de reintentos:** maximo 3 intentos por test fallido. Si tras 3 intentos un test sigue fallando, se pregunta al usuario.

### Flujo del Healer

```
1. Ejecutar: npx playwright test --reporter=list
2. Por cada test FAILED:
   a. Capturar stdout + stderr del test fallido (sin truncar).
   b. Invocar Healer con el error completo como contexto.
   c. Healer analiza el fallo, repara locators/flujos
   d. Re-ejecutar el test
   e. Si pasa → siguiente test
   f. Si falla → contador++ y repetir desde (a)
3. Si contador >= 3 para un test:
   ┌─────────────────────────────────────────────────────────┐
   │ ⚠️  El test [nombre] fallo tras 3 intentos del Healer. │
   │                                                        │
   │  1. Modificar manualmente y reintentar                 │
   │  2. Omitir test (agregar .skip)                        │
   │  3. Detener pipeline                                   │
   │                                                        │
   │  ¿Que deseas hacer? (1/2/3)                            │
   └─────────────────────────────────────────────────────────┘
4. Si elige 1: esperar a que el usuario edite, luego re-ejecutar
5. Si elige 2: modificar test con test.skip(...) y continuar
6. Si elige 3: detener y reportar error
```

### Prompt para invocar al Healer

> "Eres el 🎭 Healer de Playwright. El test [nombre del test] falló. Aquí está el error completo:
> ---
> {STDERR_DEL_TEST_FALLIDO}
>
> {STDOUT_DEL_TEST_FALLIDO}
> ---
> Analiza este error, inspecciona la UI en http://localhost:2001, y repara el test. Re-ejecuta `npx playwright test --reporter=list` para verificar."

---

## [VISUAL_TESTING] Snapshot Visual (Opcional)
Para proyectos que requieren verificación visual ademas de funcional:

### Configuración
- En `playwright.config.ts`, agregar `--update-snapshots` para modo de actualización.
- Los snapshots se almacenan en `tests/snapshots/`.

### Uso
1. Después de que el Generator cree los tests, ejecutar snapshot visual:
```bash
npx playwright test --update-snapshots
```
2. En CI, ejecutar sin flag:
```bash
npx playwright test
```
3. Si un snapshot falla en CI:
   - Revisar si el cambio es intencional (actualizar snapshot).
   - Si no es intencional: revertir el cambio de UI.

### Reglas
- Solo snapshot de componentes estables (evitar animaciones, datos dinámicos).
- Usar `@playwright/test` `expect(page).toHaveScreenshot()`.
- NO hacer snapshot de páginas completas — solo del contenedor del MFE.

---

## [TEST_DATA_FACTORIES] Data Factories for Tests
Para evitar datos hardcodeados en los specs, crear factories reutilizables:

### Estructura
```
tests/factories/
  └── [feature]Factory.ts    ← Builder pattern
```

### Template factory
```typescript
// tests/factories/portFactory.ts
import type { Port } from '../../src/features/ports/api/portService.types';

export function buildPort(overrides?: Partial<Port>): Port {
  return {
    id: 'port-1',
    name: 'Valparaíso',
    code: 'CLVAP',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

export function buildPortList(count: number): Port[] {
  return Array.from({ length: count }, (_, i) => buildPort({
    id: `port-${i + 1}`,
    name: `Port ${i + 1}`,
    code: `CODE${i + 1}`,
  }));
}
```

### Reglas
- Los factories son la ÚNICA fuente de datos de prueba. No hardcodees objetos en specs.
- Usar spread `...overrides` para personalizar por test.
- Los valores default deben ser válidos (pasan validación del schema).
- Crear `build[Entity]List(count)` para arrays.

---

## [PLANNER_FAST] Variante para orquestador-fast

Cuando el modelo rapido ejecuta el Planner (por degradacion), usar esta version simplificada que no explora la app sino que solo lee el plan y genera specs:

```
1. Lee docs/Plan_Frontend.md o docs/Plan_E2E.md
2. Extrae los escenarios listados (lineas con "- [ ] Test:")
3. Genera specs/[feature].md con formato:
   # [Feature] Test Plan
   ## Scenario 1: [nombre]
   - Given: [contexto]
   - When: [accion]
   - Then: [resultado esperado]
4. No necesita dev server corriendo
```

---

## [GENERATOR_FAST] Variante para orquestador-fast

Version simplificada del Generator que no verifica selectores en vivo:

```
1. Lee specs/[feature].md
2. Lee tests/seed.spec.ts como template
3. Genera tests/[feature].spec.ts con estructura:
   - test.describe('[feature]')
   - test('Scenario 1') con page.goto, page.locator, expect
4. Usa selectores por rol (getByRole, getByText, getByPlaceholder)
5. No necesita dev server (los selectores son heuristicos)
```
