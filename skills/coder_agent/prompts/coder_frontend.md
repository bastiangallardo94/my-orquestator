# coder_frontend — Reglas específicas de frontend

Inyectar DESPUÉS de `coder_general.md` cuando el impacto sea FRONTEND o FULLSTACK.

---

## Stack: React 18 / Angular legacy (solo mantenimiento)

### Phase 1: READ (frontend)

1. Lee `docs/Plan_Frontend.md` — tu única fuente de verdad.
2. Lee `docs/Plan_Backend.md` si existe (para entender el modelo).
3. Lee `docs/openapi.yaml` para endpoints y tipos de respuesta.
4. Lee `docs/Plan_E2E.md` si existe.
5. Lee `AGENTS.md` para stack, comandos, convenciones.
6. Lee `REACT_RULES.md` si existe (reglas específicas del proyecto).
7. **Traza el flujo:** componente → hook → servicio API → MSW handler (dev) o BFF real.
8. Detecta si hay `src/mocks/handlers/` existentes para reusar.
9. Ejecuta `git log -5 --oneline <archivo>` antes de modificar archivos existentes (si es bug fix).

### Phase 2: PONYTAIL LADDER (frontend edition)

- **¿El hook ya existe?** No crees un hook nuevo si puedes componer con `useQuery` + select.
- **¿El MSW handler ya cubre el endpoint?** Extiéndelo con datos nuevos, no dupliques.
- **¿El tipo ya está en openapi.yaml?** Genera tipos desde ahí en vez de escribirlos a mano.
- **¿Un componente existente ya renderiza este layout?** Reusa con props, no copies el template.
- **¿El endpoint ya existe en el BFF?** No crees un wrapper nuevo, usa `api` de `@/lib/api`.

### Phase 3: RED — Tests mínimos (frontend)

```tsx
// Un test por estado LEES. Vitest + Testing Library.
describe('FeaturePage', () => {
  it('renders loading state', () => {
    render(<FeaturePage />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders empty state', async () => {
    server.use(http.get('/bff/recurso', () => HttpResponse.json({ data: [] })))
    render(<FeaturePage />)
    expect(await screen.findByText(/sin resultados/i)).toBeInTheDocument()
  })

  it('renders error state', async () => {
    server.use(http.get('/bff/recurso', () => HttpResponse.error()))
    render(<FeaturePage />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
```

**Reglas:**
- Un `describe` por feature, un `it` por estado LEES.
- Reusa MSW handlers de `src/mocks/handlers/` — no re-definas mocks en cada test.
- Usa `server.use()` para sobreescribir handlers específicos del test.
- No tests de snapshot a menos que el proyecto los use consistentemente.

### Phase 4: GREEN — Implementación (frontend)

**React moderno (feature-based structure):**

```
src/features/[nombre]/
├── api/
│   ├── [feature]Service.ts        ← fetch wrapper
│   └── [feature]Service.types.ts  ← interfaces/z.infer
├── hooks/
│   └── use[Feature].ts            ← TanStack Query hooks
├── components/
│   ├── [Feature]List.tsx          ← presentacional
│   └── [Feature]Manager.tsx       ← contenedor (orquestador)
├── schemas/
│   └── [recurso].schema.ts        ← Zod schemas (si forms)
├── [Feature]Page.tsx              ← página (conectada a ruta)
└── [Feature]Page.test.tsx         ← tests LEES
```

**Reglas:**
- **TanStack Query** para toda llamada a API. `useQuery`/`useMutation`. NO `useState+useEffect` para fetching.
- **4 estados LEES** en cada componente que consuma datos: Loading → Empty → Error → Success.
- **MSW** handlers en `src/mocks/handlers/` que sirvan para dev standalone + tests.
- **React Hook Form + Zod** con `z.infer` para formularios.
- **i18n:** claves `[feature]:tipo.mensaje`.
- **MUI + Tailwind** con prefijo de aislamiento (según proyecto).

**Componentes presentacionales:**
- Props tipadas explícitamente. Sin lógica de fetching.
- Loading: skeleton o spinner (según diseño del proyecto).
- Empty: componente vacío con mensaje i18n.
- Error: alerta con mensaje y botón de retry.
- Success: datos renderizados.

**Angular legacy (solo mantenimiento):**
- NgModules existentes. No crear nuevos módulos.
- HttpClient + servicios con BehaviorSubject.
- Tests con Jest + jest-preset-angular + TestBed.
- NO crear nuevas features. Solo modificar existentes.

### Phase 5: VALIDATE (frontend)

- [ ] ¿El componente maneja los 4 estados LEES?
- [ ] ¿Los hooks cargan datos con TanStack Query (no fetch en useEffect)?
- [ ] ¿Coinciden los tipos con `openapi.yaml`?
- [ ] ¿Los MSW handlers están en `src/mocks/handlers/`?
- [ ] ¿No hay código hardcodeado de i18n? (usa claves)
- [ ] ¿Tests existentes del plan se implementaron?
- [ ] ¿Menor diff posible? (reusa componentes existentes antes de crear nuevos)
