# Git Worktree Management — Sub-skill

Cargado solo cuando el trigger es worktree:* o se detecta un worktree activo.
Plugin: `~/.config/opencode/plugins/orquestador-worktree.mjs`

## Concepto
Git Worktrees permiten multiples ramas checkout simultaneas, compartiendo .git/.
Cada worktree tiene su propio .orquestador/ aislado.

```
<repo>/
├── .orquestador/                        # Estado del repo principal
├── worktrees/feature-login/.orquestador/ # Pipeline A
├── worktrees/feature-checkout/           # Pipeline B
└── .gitignore (ignora worktrees/)
```

## Entry Points

| Trigger | Accion |
|---------|--------|
| `worktree:create <name> [branch]` | Crear worktree + rama + iniciar pipeline |
| `worktree:list` | Dashboard multi-worktree |
| `worktree:remove <name>` | Eliminar worktree (con confirmacion) |
| `worktree:prune` | Limpiar huerfanos |
| `worktree:sync [name]` | Sincronizar archivos compartidos |
| `worktree:goto <name>` | Retornar path absoluto para cd |
| `worktree:orchestrate <name>` | Worktree + bootstrap |
| `wt:new <name>` | Alias para create |

### workflow:create
1. git worktree add worktrees/<name> feature/<name>
2. Crear .orquestador/ en el worktree
3. Copiar shared files (api-surface.md, dependency-groups.yaml)
4. Iniciar pipeline TACTICO

### workflow:list
- Ejecutar git worktree list --porcelain
- Por cada worktree, detectar .orquestador/state.yaml
- Si tiene: flow, phase actual, status
- Si no: "sin pipeline"
- Generar tabla de resumen

### workflow:remove
- Si pipeline activo → question() warning
- Si cambios sin commit → offer to commit o force
- Si completo/fallido → eliminacion directa

## Deteccion Automatica
En Phase 0 Bootstrap, detectar si estamos en worktree:
- git rev-parse --is-inside-work-tree
- git worktree list --porcelain
- Si es worktree: mostrar "📍 Worktree: {name} | Rama: {branch}"
- Guardar en state.yaml.worktree

## Shared Files
- api-surface.md
- dependency-groups.yaml
- config-map.yaml

Se sincronizan con `worktree:sync` (desde repo principal a worktrees).

## Custom Tools (plugin MCP)
| Tool | Descripcion |
|------|-------------|
| worktreeList(repoPath) | Listar todos los worktrees |
| worktreeInfo(path) | Metadata del worktree actual |
| worktreeCreate(options) | Crear WT + branch |
| worktreeSwitch(name, repoPath) | Path absoluto |
| worktreeRemove(options) | Eliminar WT con validaciones |
| worktreeDashboard(repoPath) | Tabla formateada |
| worktreeSync(options) | Copiar shared files |
