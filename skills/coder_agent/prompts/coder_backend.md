# coder_backend — Reglas específicas de backend

Inyectar DESPUÉS de `coder_general.md` cuando el impacto sea BACKEND o FULLSTACK.

---

## Stack: Go / Java — Arquitectura Hexagonal + TDD

### Phase 1: READ (backend)

1. Lee `docs/Plan_Backend.md` — tu única fuente de verdad.
2. Lee `docs/openapi.yaml` para contratos exactos de API.
3. Lee `docs/Plan_E2E.md` si existe (escenarios de regresión).
4. Lee `AGENTS.md` para stack, comandos, convenciones de formato (`gofmt`, `checkstyle`).
5. **Traza el flujo real:** desde el handler HTTP → use case → repositorio → BD.
6. Si es bug fix: identifica la capa donde realmente está el error (nunca asumas que es donde se manifiesta).
7. Ejecuta `git log -5 --oneline <archivo>` antes de modificar archivos existentes (si es bug fix).

### Phase 2: PONYTAIL LADDER (backend edition)

Además de la escalera general:

- **¿El endpoint ya existe?** No crees uno nuevo si puedes extender el existente con un query param opcional.
- **¿El repositorio ya tiene el método que necesitas?** Tal vez solo falta exponerlo en el use case.
- **¿Puedes reusar la misma migración SQL para dos features?**分开 si es trivial.
- **¿Un middleware existente ya hace la validación?** Reúsalo antes de escribir uno nuevo.

### Phase 3: RED — Tests mínimos (backend)

```go
// Un test por caso de uso. Sin testify si no está en el proyecto.
func TestSomething(t *testing.T) {
    t.Run("success", func(t *testing.T) {
        result, err := useCase.Execute(ctx, input)
        if err != nil {
            t.Fatalf("unexpected error: %v", err)
        }
        if result != expected {
            t.Fatalf("got %v, want %v", result, expected)
        }
    })

    t.Run("error - invalid input", func(t *testing.T) {
        _, err := useCase.Execute(ctx, invalidInput)
        if err == nil {
            t.Fatal("expected error, got nil")
        }
    })
}
```

```java
@Test
void success() {
    var result = useCase.execute(input);
    assertEquals(expected, result);
}

@Test
void errorWhenInvalidInput() {
    assertThrows(ValidationException.class, () -> useCase.execute(invalidInput));
}
```

**Reglas:**
- Mockear el repositorio (puerto), no la BD real.
- No uses frameworks de fixtures (JSONTest, etc.) si no están en el proyecto.
- Una aserción significativa por test > múltiples aserciones difusas.

### Phase 4: GREEN — Implementación (backend)

**Arquitectura Hexagonal (estricta):**

```
┌──────────────┐
│   Handler    │  ← Capa de entrada (HTTP, gRPC, CLI)
├──────────────┤
│  Use Case    │  ← Lógica de negocio (Application)
├──────────────┤
│   Puerto     │  ← Interface (ports/repository.go)
├──────────────┤
│ Adaptador BD │  ← Implementación SQL (adapters/)
└──────────────┘
```

- **Dominio:** `internal/domain/entity.go` — Estructuras de negocio puras. Sin tags de BD, sin anotaciones de frameworks.
- **Puertos:** `internal/ports/repository.go` — Interfaces. Sin lógica.
- **Aplicación:** `internal/application/usecase.go` — Lógica de negocio. Solo depende de puertos.
- **Adaptadores:** `internal/adapters/postgres_repo.go` — SQL real. Mapeo de errores.

**Manejo de errores:**
- Nunca ignores un error. Cada error ignorado es un bug durmiendo.
- Contextualiza hacia arriba: `fmt.Errorf("creating user %s: %w", email, err)`
- En Go: `errors.Is`/`errors.As` para errores centinela. No type-assertion de errores.
- En Java: excepciones de negocio checked vs runtime según la arquitectura del proyecto.

**BD:**
- Migración SQL exacta: `db/migrations/xxx_desc.sql`
- `sql.Rows` scan: controla `NULL` con `sql.NullString`, `sql.NullTime`, etc.
- Named parameters (`:$1`, `@p1`) sobre concatenación de strings.

### Phase 5: VALIDATE (backend)

- [ ] ¿El handler HTTP valida input en trust boundary?
- [ ] ¿Los errores de BD no se filtran al cliente? (wrap, no exponer)
- [ ] ¿La migración SQL es forward-only y reversible?
- [ ] ¿Coincide con los contratos de `openapi.yaml`?
- [ ] ¿Tests existentes del plan se implementaron?
