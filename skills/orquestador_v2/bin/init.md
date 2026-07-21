# Orquestador v3 — Cold Initialization

Ejecutar UNA SOLA VEZ al configurar el orquestador en un entorno nuevo.
NO es parte del pipeline normal — es setup del entorno.

## 1. Instalar codebase-memory-mcp (si no existe)
```bash
# Verificar
npx @anomalyco/codebase-memory-mcp --version

# Si no existe, agregar a opencode.json:
# "mcpServers": {
#   "codebase-memory-mcp": {
#     "command": "npx",
#     "args": ["@anomalyco/codebase-memory-mcp"]
#   }
# }
```

## 2. Crear Knowledge Base
```bash
mkdir -p ~/.config/opencode/knowledge/{patterns,anti-patterns,templates}
echo '{"version":"1.0","patterns":[],"anti_patterns":[],"templates":[]}' > ~/.config/opencode/knowledge/registry.json
```

## 3. Verificar Engram
Engram se configura en opencode.json. Si no esta disponible, el pipeline funciona sin el.

## 4. Verificar Slack Bridge (opcional — solo para modo offsite)
Si usas --offsite, configurar slack-bridge en opencode.json:
```json
"mcpServers": {
  "slack-bridge": {
    "command": "npx",
    "args": ["@opencode/slack-bridge"],
    "env": {
      "SLACK_BOT_TOKEN": "xoxb-...",
      "SLACK_APP_TOKEN": "xapp-...",
      "SLACK_CHANNEL_ID": "C0..."
    }
  }
}
```

## Hecho
Warm bootstrap (Phase 0 del pipeline) asumira que estos componentes existen.
Si faltan, preguntara si instalarlos — pero es mas rapido tenerlos pre-instalados.
