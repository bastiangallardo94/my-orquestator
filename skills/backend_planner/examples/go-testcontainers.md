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
