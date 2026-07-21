# Backend E2E Suite — Smoke + Integration Tests

Cargar desde phase_4_qa STEP 2.5 cuando el cambio tiene impacto BACKEND o FULLSTACK.
Valida que los endpoints backend funcionan en conjunto (sin mockear), no solo unitariamente.

## Deteccion de stack

Revisar AGENTS.md y archivos de build en la raiz del proyecto:
- Si build.gradle / pom.xml / settings.gradle → Java/Spring Boot
- Si go.mod → Go
- Si ambos → ejecutar ambas estrategias

## Estrategias por stack

### Java/Spring Boot: @SpringBootTest + TestRestTemplate
```
1. Buscar tests existentes en src/test/java/ que usen @SpringBootTest
2. Para endpoints CRITICAL/HIGH del RBT:
   - Si no existe test, generar @SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
   - Usar TestRestTemplate para requests HTTP reales
   - Validar: status code, response body contra schema esperado
3. Ejecutar: ./gradlew test --tests "*E2E*" o mvn test -Dtest="*E2E*"
4. Si falla → reportar como BACKEND_E2E_FAILING
```

### Go: httptest.Server
```
1. Buscar tests existentes en *_test.go que usen httptest.NewServer
2. Para endpoints CRITICAL/HIGH del RBT:
   - Si no existe test, generar test con:
     - httptest.NewServer(handler) con handlers reales
     - Requests HTTP con net/http
     - Validar: status code, response body
3. Ejecutar: go test ./... -run "E2E" -v
4. Si falla → reportar como BACKEND_E2E_FAILING
```

### Para flujos que cruzan BFF → Backend MS
- Si hay docker-compose.yml → levantar dependencias: docker compose up -d
- Si hay testcontainers (Java) → @Testcontainers con contenedores reales
- Si no hay ni docker ni testcontainers → validar solo el servicio modificado

## Output
- BACKEND_E2E_STATUS: PASS | FAIL | N/A (sin endpoints CRITICAL/HIGH)
- BACKEND_E2E_TESTED: [lista de endpoints probados]
- BACKEND_E2E_PASSING: N/TOTAL
- BACKEND_E2E_FAILING: [lista de endpoints que fallaron]
