# Git Worktree Management — Protocolo de Paralelización

Este módulo se lee cuando el usuario quiere crear, listar, o gestionar Git Worktrees para correr múltiples instancias del orquestador en paralelo.

**Plugin:** `~/.config/opencode/plugins/orquestador-worktree.mjs`

---

## Concepto

Git Worktrees permiten tener múltiples ramas checkouteadas simultáneamente en el mismo repositorio. Cada worktree tiene su propio directorio de trabajo aislado pero comparte el mismo `.git/`.

**Casos de uso:**
- Feature A en `worktrees/feature-a/` mientras Feature B en `worktrees/feature-b/`
- Hotfix en `worktrees/hotfix-X/` mientras el desarrollo normal sigue en `main`
- Review de PR en `worktrees/review-PR-123/`

---

## Arquitectura de Worktrees en Orquestador

```
<repo-root>/
├── .git/                           # Repo principal (shared)
├── .orquestador/                   # Estado del repo principal
│   ├── _pointer.json
│   ├── api-surface.md              # Compartido
│   ├── dependency-groups.json      # Compartido
│   └── config-map.yaml             # Compartido
├── worktrees/                      # Directorio de worktrees
│   ├── .shared/                    # Archivos compartidos cache
│   ├── feature-login/              # Worktree para feature-login
│   │   ├── (archivos del proyecto)
│   │   └── .orquestador/           # Estado AISLADO del pipeline
│   ├── feature-checkout/           # Otro worktree
│   │   └── .orquestador/
│   └── hotfix-urgent/              # Worktree para hotfix
│       └── .orquestador/
└── .gitignore                      # Ignora worktrees/
```

**Regla de aislamiento:** Cada `.orquestador/` es independiente. Los worktrees NO comparten estado de pipeline pero SÍ comparten:
- Knowledge base (`~/.config/opencode/knowledge/`)
- Patrones y templates
- Archivos de configuracion via `worktree:sync`

---

## Entry Points (Comandos)

| Comando | Descripcion | Plugin Function |
|---------|-------------|-----------------|
| `worktree:feature <nombre>` | Crear WT + branch `feature/<nombre>` + init | `worktreeCreate()` |
| `worktree:fix <nombre>` | Crear WT + branch `bugfix/<nombre>` + init | `worktreeCreate()` |
| `worktree:orchestrate <nombre>` | Crear WT + iniciar phase_1 | `worktreeCreate()` |
| `worktree:list` | Dashboard de todos los WTs | `worktreeDashboard()` |
| `worktree:goto <nombre>` | Mostrar path para cd | `worktreeSwitch()` |
| `worktree:remove <nombre>` | Eliminar WT (con validaciones) | `worktreeRemove()` |
| `worktree:prune` | Limpiar WTs huérfanos | `git worktree prune` |
| `worktree:sync [nombre]` | Copiar shared files a WTs | `worktreeSync()` |

---

## Protocolo: `worktree:feature <nombre>`

```
1. DETECTAR NOMBRE
   - Si no especificado → question("Nombre del worktree?")
   - Validar: /^[a-zA-Z0-9_-]+$/
   - Path: worktrees/{nombre}/

2. DETERMINAR FLOW
   - worktree:feature → flow="TACTICO", change_type="feature"
   - worktree:fix → flow="TACTICO", change_type="bug_fix"

3. LLAMAR PLUGIN
   node orchestador-worktree.mjs create {nombre} feature/{nombre}

4. COPIAR ARCHIVOS COMPARTIDOS
   - .orquestador/api-surface.md → worktrees/{nombre}/.orquestador/
   - .orquestador/dependency-groups.json → worktrees/{nombre}/.orquestador/
   - .orquestador/config-map.yaml → worktrees/{nombre}/.orquestador/

5. INICIALIZAR _pointer.json EN WORKTREE
   {
     "flow": "TACTICO",
     "change_type": "feature",
     "worktree": {
       "name": "{nombre}",
       "path": "/path/worktrees/{nombre}",
       "branch": "feature/{nombre}",
       "is_worktree": true,
       "parent_repo": "/path/repo"
     }
   }

6. CONFIRMAR
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ Worktree creado
   Path:  worktrees/{nombre}/
   Rama:  feature/{nombre}
   Status: LISTO
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Para iniciar pipeline:
     cd worktrees/{nombre}
     opencode orchestrate
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Protocolo: `worktree:list` (Dashboard)

```
1. LLAMAR PLUGIN
   node orchestador-worktree.mjs dashboard <repo_path>

2. MOSTRAR OUTPUT
   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃                    GIT WORKTREES — Dashboard                  ┃
   ┣━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┫
   ┃ Worktree       ┃ Rama      ┃ Pipeline  ┃ Status           ┃
   ┡━━━━━━━━━━━━━━━╇━━━━━━━━━━═╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
   │ .               │ main      │ —          │ 🏠 MAIN         ┃
   │ feature-login  │ feature/l │ TACTICO    │ 🟢 ACTIVE (p_3) ┃
   └───────────────┴───────────┴───────────┴──────────────────┘

   📊 2 worktrees | 1 activo | 0 completos

3. SI HAY WARNINGS
   ⚠️  Worktrees con problemas:
     • feature-login: 12 commits behind main
```

---

## Protocolo: `worktree:goto <nombre>`

```
1. LLAMAR PLUGIN
   node orchestador-worktree.mjs switch {nombre} <repo_path>

2. MOSTRAR PATH
   cd worktrees/{nombre}

   Para verificar:
     pwd → debe mostrar .../worktrees/{nombre}
```

---

## Protocolo: `worktree:remove <nombre>`

```
1. VERIFICAR EXISTA
   node orchestador-worktree.mjs info worktrees/{nombre}
   → Si no existe: error "Worktree no existe"

2. CHECK PIPELINE STATUS
   - Si pipeline ACTIVE → WARNING + question()
   - Si pipeline COMPLETE → proceed
   - Si pipeline FAILED → proceed

3. CHECK CAMBIOS
   git status --porcelain worktrees/{nombre}
   - Si hay cambios → question("Descartar o comprometer?")

4. CONFIRMAR
   question("Eliminar worktree '{nombre}'?", [Cancelar, Eliminar])

5. LLAMAR PLUGIN
   node orchestador-worktree.mjs remove {nombre} <repo_path> [--force]

6. CONFIRMAR RESULTADO
   ✅ Worktree eliminado
```

---

## Protocolo: `worktree:sync [nombre]`

Sincroniza archivos compartidos del repo principal a los worktrees.

```
1. DETERMINAR WORKTREES DESTINO
   - Si nombre especificado → solo ese
   - Si no → todos los worktrees

2. COPIAR ARCHIVOS
   Archivos compartidos:
   - api-surface.md
   - dependency-groups.json
   - config-map.yaml

   Destino: worktrees/{wt}/.orquestador/

3. CONFIRMAR
   ✅ Sincronizado a N worktrees
   Archivos: api-surface.md, dependency-groups.json, config-map.yaml
```

---

## Configuracion de Shared Files

En `.orquestador/worktree.config.json` (repo principal):

```json
{
  "worktree": {
    "shared_dir": "worktrees/.shared",
    "shared_files": [
      "api-surface.md",
      "dependency-groups.json",
      "config-map.yaml"
    ],
    "auto_sync": false
  }
}
```

---

## Convenciones de Nombres

| Tipo | Branch Pattern | Worktree Path |
|------|----------------|---------------|
| Feature | `feature/<nombre>` | `worktrees/<nombre>` |
| Bug Fix | `bugfix/<nombre>` | `worktrees/<nombre>` |
| Hotfix | `hotfix/<nombre>` | `worktrees/<nombre>` |
| Chore | `chore/<nombre>` | `worktrees/<nombre>` |
| Release | `release/<version>` | `worktrees/<version>` |

**Validacion de nombre:** `^[a-zA-Z0-9_-]+$` (sin espacios, sin /)

---

## Estados de Pipeline por Worktree

| Status | Significado | Color |
|--------|-------------|-------|
| ACTIVE (phase_N) | Pipeline en ejecucion | 🟢 |
| PAUSED (phase_N) | Pausado en checkpoint | 🟡 |
| COMPLETE | Finalizado exitosamente | ✅ |
| FAILED (phase_N) | Fallo en alguna fase | ❌ |
| NO_PIPELINE | Worktree sin pipeline | ⚪ |
| ORPHANED | Rama eliminada en origin | ⚠️ |

---

## Integracion con Checkpoints

En checkpoints dentro de un worktree, mostrar informacion del WT:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKPOINT 1: Feature Login
📍 Worktree: feature-login | Rama: feature/login
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿La logica de negocio es correcta?
```

---

## Notas de Implementacion

1. **Aislamiento**: Cada `.orquestador/` es completamente independiente
2. **Git compartido**: Los worktrees comparten `.git/` - commits en uno son visibles en todos
3. **Conflictos**: Evitar working on the same files across worktrees (git advertira)
4. **Sincronizacion**: Para compartir estado de patterns, usar el knowledge base global
5. **Cleanup**: Los worktrees eliminados pierden su `.orquestador/` - los pipelines quedan huerfanos
