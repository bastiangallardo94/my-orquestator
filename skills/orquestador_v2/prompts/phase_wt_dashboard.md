---
phase_id: phase_wt_dashboard
type: report
agent: null
entry_condition: "git worktree debe estar disponible"
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 0
---

# Phase WTD: Dashboard Multi-Worktree

## Objetivos
1. Mostrar estado de todos los worktrees del repositorio
2. Identificar pipelines activos, completados, fallidos
3. Alertar sobre worktrees huerfanos o desactualizados
4. Proponer acciones rapidas

---

## Paso 1: Generar Dashboard

```bash
node ~/.config/opencode/plugins/orquestador-worktree.mjs dashboard <repo_path>
```

Esto retorna una tabla formateada:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    GIT WORKTREES — Dashboard                  ┃
┣━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┫
┃ Worktree       ┃ Rama      ┃ Pipeline  ┃ Status               ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━═╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━┩
│ .               │ main      │ —          │ 🏠 MAIN              ┃
│ feature-login  │ feature/l │ TACTICO    │ 🟢 ACTIVE (p_3)     ┃
│ feature-check  │ feature/ch│ TACTICO    │ 🟡 PAUSED (p_2)     ┃
│ hotfix-urgent  │ hotfix/ut │ TACTICO    │ ✅ COMPLETE          ┃
└───────────────┴───────────┴───────────┴─────────────────────┘

📊 4 worktrees | 2 activos | 1 completo | 0 fallidos | 1 sin pipeline
```

---

## Paso 2: Verificar Health

El plugin automaticamente verifica:
- Commits behind/before main (>10 = warning)
- Branch not pushed to origin
- Conflictos con otros worktrees

Si hay warnings, mostrarlos:

```
⚠️  Worktrees con problemas:
  • feature-checkout: 15 commits behind main
  • hotfix-urgent: Branch not pushed to origin
```

---

## Paso 3: Proponer Acciones

Despues del dashboard, ofrecer acciones rapidas:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Acciones rápidas:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] Ir a worktree específico
[2] Crear nuevo worktree (feature/fix)
[3] Eliminar worktree sin pipeline
[4] Sincronizar archivos compartidos
[5] Limpiar worktrees huerfanos
[6] Continuar con pipeline principal
```

---

## Formato de Salida

**Este es un report phase** — presenta inline en el chat, no crea archivos.

El dashboard se genera completamente via plugin, sin manipulacion adicional de archivos.

---

## Ejecucion

Se invoca automaticamente cuando el trigger es `worktree:list`, o manualmente via:
```
opencode
> worktree:list
```
