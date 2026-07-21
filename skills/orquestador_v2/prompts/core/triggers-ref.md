# Entry Points y Referencias — Tabla Maestra

## Flujos especializados (no pipeline estandar)

| Trigger | Flow | Referencia |
|---------|------|------------|
| bugfix: | BUGFIX_TACTICO | prompts/flows/bugfix_flow.md |
| review: | REVIEW | prompts/flows/review_standalone.md |
| test: | TEST | prompts/flows/test_standalone.md |
| unit-test: | UNIT_TEST | prompts/flows/unit_test_loop.md |
| worktree:* | — | skills/worktree_management.md |

## Entry Points (14 triggers → 4 categorias)

### Pipeline completo
- `orquesta:` → inferir flow, preguntar change_type
- `feature:` → TACTICO, feature
- `fix:` → TACTICO, bug_fix
- `analiza:` → DRY_RUN
- `refactor:` → REFACTOR, refactor
- Jira ID (`PROJ-123`) → COMPLETO

### Standalone
- `review:` → REVIEW (lee flows/review_standalone.md)
- `test:` → TEST (lee flows/test_standalone.md)
- `bugfix:` → BUGFIX_TACTICO (lee flows/bugfix_flow.md)
- `unit-test:` → UNIT_TEST (lee flows/unit_test_loop.md)

### Worktree
- `worktree:list`, `worktree:create`, `worktree:remove`, `worktree:goto`, `worktree:sync`, `worktree:prune`
- Si trigger es worktree:* → cargar skills/worktree_management.md

### Offsite
- `--offsite` en cualquier trigger → activa skills/offsite_slack.md

## Referencias rapidas a sub-skills y protocolos

| Cuando | Leer |
|--------|------|
| Buscar codigo | prompts/core/search_strategy.md |
| Checkpoint | prompts/core/checkpoints.md |
| Fallo/retry | prompts/flows/failure_handling.md |
| Compaction | prompts/flows/compaction_guide.md |
| Manejar Engram | prompts/core/engram_protocol.md |
| Patrones de codigo | prompts/core/pattern_engine.md |
| Bugfix flow | prompts/flows/bugfix_flow.md |
| Review standalone | prompts/flows/review_standalone.md |
| Test standalone | prompts/flows/test_standalone.md |
| Unit test loop | prompts/flows/unit_test_loop.md |
| Offsite mode | skills/offsite_slack.md |
| Worktree | skills/worktree_management.md |
| Init (cold) | bin/init.md |
| Protocolo de bucle | prompts/core/protocolo-bucle.md |
| MCP tools | prompts/core/mcp-tools-ref.md |
