#### Go E2E (godog + Testcontainers)

Los tests E2E usan **Gherkin** (godog) para escenarios legibles por negocio y **Testcontainers** para PostgreSQL embebido — sin servidor externo, sin Docker Compose manual, sin 2 terminales.

##### TestMain con Testcontainers
```go
// test/e2e/steps/integration_test.go
package integrationtest

import (
    "context"
    "flag"
    "os"
    "testing"

    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/wait"
)

var integrationFlag = flag.Bool("integration", false, "run integration/E2E tests")

func TestMain(m *testing.M) {
    flag.Parse()
    if !*integrationFlag {
        os.Exit(0)
    }

    ctx := context.Background()

    // 1. Levantar PostgreSQL en contenedor (puerto aleatorio)
    req := testcontainers.ContainerRequest{
        Image:        "postgres:16-alpine",
        ExposedPorts: []string{"5432/tcp"},
        Env: map[string]string{
            "POSTGRES_USER":     "myuser",
            "POSTGRES_PASSWORD": "mysecretpassword",
            "POSTGRES_DB":       "port_db",
        },
        WaitingFor: wait.ForLog("database system is ready"),
    }
    pg, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
        ContainerRequest: req, Started: true,
    })
    if err != nil {
        os.Exit(1)
    }
    defer pg.Terminate(ctx)

    host, _ := pg.Host(ctx)
    port, _ := pg.MappedPort(ctx, "5432")

    // 2. Setear env vars para que la app se conecte a esta BD
    os.Setenv("DB_HOST", host)
    os.Setenv("DB_PORT", port.Port())
    os.Setenv("DB_USER", "myuser")
    os.Setenv("DB_PASSWORD", "mysecretpassword")
    os.Setenv("DB_NAME", "port_db")

    // 3. Ejecutar migraciones (goose up automático)
    runMigrations()

    // 4. Iniciar app embebida (httptest) o esperar servidor externo
    //    Si la app se inicia sincrónicamente, no necesita waitForApp

    os.Exit(m.Run())
}
```

##### Feature file (Gherkin)
```gherkin
# test/e2e/features/port.feature
Feature: Port management

  Scenario: List all ports
    When I request GET "/"
    Then the response status should be 200
    And the response should be a list

  Scenario: Create port successfully
    When I send POST to "/" with body '{ "nombre":"Valparaíso", "codigo":"CLVAP" }'
    Then the response status should be 201

  Scenario: Create duplicate port returns conflict
    Given a port with code "CLVAP" exists
    When I send POST to "/" with body '{ "codigo":"CLVAP" }'
    Then the response status should be 409

  Scenario: Get non-existent port
    When I request GET "/XXXXX"
    Then the response status should be 404
    And the response should contain an error message

  Scenario: Empty list when no ports
    Given the database is clean
    When I request GET "/"
    Then the response status should be 200
    And the response should be an empty list
```

##### Step definitions
```go
// test/e2e/steps/port_steps.go
package integrationtest

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
    "strings"
    "testing"
    "time"

    "github.com/cucumber/godog"
)

type PortFeature struct {
    baseURL      string
    response     *http.Response
    responseBody []byte
    t            *testing.T
}

func newPortFeature(t *testing.T) *PortFeature {
    baseURL := os.Getenv("APP_URL")
    if baseURL == "" {
        baseURL = "http://localhost:8082"
    }
    return &PortFeature{baseURL: baseURL, t: t}
}

func (f *PortFeature) iRequestGET(path string) error {
    var err error
    f.response, err = http.Get(f.baseURL + path)
    if err != nil {
        return err
    }
    f.responseBody, err = io.ReadAll(f.response.Body)
    _ = f.response.Body.Close()
    return err
}

func (f *PortFeature) theResponseStatusShouldBe(expected int) error {
    if f.response.StatusCode != expected {
        return fmt.Errorf("expected status %d, got %d: %s",
            expected, f.response.StatusCode, string(f.responseBody))
    }
    return nil
}

func (f *PortFeature) theResponseShouldBeAList() error {
    var result []interface{}
    return json.Unmarshal(f.responseBody, &result)
}

func (f *PortFeature) theResponseShouldBeAnEmptyList() error {
    var result []interface{}
    if err := json.Unmarshal(f.responseBody, &result); err != nil {
        return fmt.Errorf("expected JSON array, got: %s", string(f.responseBody))
    }
    if len(result) != 0 {
        return fmt.Errorf("expected empty array, got %d elements", len(result))
    }
    return nil
}

func (f *PortFeature) theResponseShouldContainAnErrorMessage() error {
    var result map[string]interface{}
    if err := json.Unmarshal(f.responseBody, &result); err != nil {
        return fmt.Errorf("expected JSON object, got: %s", string(f.responseBody))
    }
    if _, ok := result["message"]; !ok {
        return fmt.Errorf("expected 'message' field in error response")
    }
    return nil
}

func (f *PortFeature) iSendPOST(path string, body string) error {
    var err error
    f.response, err = http.Post(f.baseURL+path, "application/json", strings.NewReader(body))
    if err != nil {
        return err
    }
    f.responseBody, err = io.ReadAll(f.response.Body)
    _ = f.response.Body.Close()
    return err
}

func (f *PortFeature) aPortWithCodeExists(code string) error {
    // Seed data directamente via sqlx/pgx
    db := connectDB()
    _, err := db.Exec(context.Background(),
        `INSERT INTO ports (code, nombre, active) VALUES ($1, $2, true)
         ON CONFLICT (code) DO NOTHING`, code, "Puerto "+code)
    return err
}

func (f *PortFeature) theDatabaseIsClean() error {
    db := connectDB()
    _, err := db.Exec(context.Background(), "TRUNCATE TABLE ports CASCADE")
    return err
}

func TestIntegration_Ports(t *testing.T) {
    suite := godog.TestSuite{
        Name: "port-api",
        ScenarioInitializer: func(s *godog.ScenarioContext) {
            f := newPortFeature(t)
            s.Step(`^I request GET "([^"]*)"$`, f.iRequestGET)
            s.Step(`^the response status should be (\d+)$`, f.theResponseStatusShouldBe)
            s.Step(`^the response should be a list$`, f.theResponseShouldBeAList)
            s.Step(`^the response should be an empty list$`, f.theResponseShouldBeAnEmptyList)
            s.Step(`^the response should contain an error message$`, f.theResponseShouldContainAnErrorMessage)
            s.Step(`^I send POST to "([^"]*)" with body '([^']*)'$`, f.iSendPOST)
            s.Step(`^a port with code "([^"]*)" exists$`, f.aPortWithCodeExists)
            s.Step(`^the database is clean$`, f.theDatabaseIsClean)
        },
        Options: &godog.Options{
            Format: "pretty",
            Paths:  []string{"e2e/features"},
            TestingT: t,
        },
    }

    if suite.Run() != 0 {
        t.Fatal("E2E tests failed")
    }
}

func waitForApp(baseURL string, t *testing.T) {
    deadline := time.Now().Add(30 * time.Second)
    for time.Now().Before(deadline) {
        resp, err := http.Get(baseURL + "/status/liveness")
        if err == nil {
            isReady := resp.StatusCode == http.StatusOK
            resp.Body.Close()
            if isReady {
                return
            }
        }
        time.Sleep(500 * time.Millisecond)
    }
    t.Fatal("app did not become ready within 30 seconds")
}
```

##### Comandos
```bash
make test-features                          # go test -integration -run TestIntegration
make test-feature FEATURE=port.feature      # feature específica
make test-unit                              # go test ./... (sin -integration)
```
