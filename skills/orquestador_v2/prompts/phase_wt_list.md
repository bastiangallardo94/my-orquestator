---
phase_id: phase_wt_list
type: report
agent: null
entry_condition: "git worktree debe estar disponible"
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 0
---

# Phase WT3: Listar Worktrees — Reporte

## Objetivos
1. Listar todos los Git Worktrees del repositorio
2. Mostrar estado de cada pipeline del orquestador
3. Identificar worktrees huerfanos o con problemas

---

## Paso 1: Obtener Lista de Worktrees

```bash
git worktree list --porcelain
```

Parsear output para obtener:
- `worktree` → path absoluto
- `branch` → nombre de la rama

---

## Paso 2: Analizar Cada Worktree

Por cada worktree encontrado:

```bash
# Detectar si tiene pipeline
if [ -f "{worktree}/.orquestador/_pointer.json" ]; then
  # Leer estado del pipeline
  READ "{worktree}/.orquestador/_pointer.json"
  READ phases/{current_phase}.json
  
  status = pipeline.status
  current_phase = current_phase_id
  flow = _pointer.flow
else
  status = "SIN_PIPELINE"
fi
```

---

## Paso 3: Generar Tabla de Resumen

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    GIT WORKTREES                           ┃
┣━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┫
┃ Worktree      ┃ Rama        ┃ Pipeline   ┃ Status         ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━┩
│ feature-login │ feature/lgn │ TACTICO    │ ACTIVE (p_3)   │
│ feature-check │ feature/chk │ COMPLETO   │ COMPLETE       │
│ hotfix-urgent │ hotfix/123  │ TACTICO    │ FAILED (p_4)   │
│ review-pr-456 │ PR-456      │ —          │ SIN_PIPELINE   │
└───────────────┴─────────────┴────────────┴────────────────┘

📊 Resumen: 4 worktrees | 2 activos | 1 completo | 1 fallido | 1 sin pipeline
```

---

## Paso 4: Identificar Worktrees con Problemas

- **ORPHANED**: Worktree existe pero la rama fue eliminada
- **STALE**: Rama muy desactualizada vs main (>30 días)
- **CONFLICT**: Archivos en conflicto

```
⚠️  Worktrees con problemas:
  • hotfix-urgent: Rama 15 commits behind main
  • review-pr-456: Rama borrada en origin
```

---

## Paso 5: Acciones Sugeridas

Mostrar al usuario las acciones disponibles:

```
Acciones rápidas:
  [1] Eliminar worktree sin pipeline
  [2] Limpiar worktrees huerfanos
  [3] Crear nuevo worktree
  [4] Ir a worktree específico
```

---

## Formato de Salida

Este es un **report phase** — presenta inline, no crea archivos.
