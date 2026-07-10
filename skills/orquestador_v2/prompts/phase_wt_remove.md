---
phase_id: phase_wt_remove
type: agent
agent: orquestador-fast
entry_condition: "git worktree debe estar disponible"
exit_check: static
exit_files: []
supports_partial_retry: false
max_retries: 2
---

# Phase WT4: Eliminar Worktree

## Objetivos
1. Eliminar un Git Worktree específico
2. Confirmar que no tenga cambios sin comprometer
3. Manejar el caso de pipeline activo con confirmación

---

## Paso 1: Validar Nombre

El `name` viene del trigger `worktree:remove <nombre>`.

**Validaciones:**
- Nombre requerido → si no especificado, pedir con question()
- Debe existir: `git worktree list` → verificar que `worktrees/{name}/` exista

Si no existe → error, listar worktrees disponibles.

---

## Paso 2: Verificar Cambios Sin Comprometer

```bash
cd worktrees/{name}
git status --porcelain
```

**Si hay cambios:**
```
⚠️  Worktree tiene cambios sin comprometer:
    • 3 archivos modificados
    • 1 archivo nuevo (sin trackear)

Cambios se perderán al eliminar.
```

**Opciones con question():**
1. "Comprometer cambios primero" → git add + git commit + retry
2. "Descartar cambios y eliminar" → eliminar igual
3. "Cancelar" → abortar

---

## Paso 3: Verificar Pipeline Activo

Si `worktrees/{name}/.orquestador/` existe:

```bash
READ worktrees/{name}/.orquestador/_pointer.json
```

**Si pipeline está ACTIVE o IN_PROGRESS:**
```
⚠️  Pipeline activo detectado en este worktree:
    Flow: TACTICO | Phase: phase_3_coding (IN_PROGRESS)
    
¿Continuar con eliminación?
```

**Si pipeline está COMPLETE:**
- Mostrar warning suave pero permitir

**Si pipeline está FAILED:**
- Mostrar que hay worktree con pipeline fallido
- Ofrecer eliminar o investigar

---

## Paso 4: Confirmación Final

```bash
question(
  question: "Eliminando worktree 'feature-login'. Esta acción no se puede deshacer.",
  header: "Confirmar eliminación",
  options: [
    "Cancelar (Recommended)",
    "Eliminar worktree"
  ]
)
```

---

## Paso 5: Eliminar Worktree

```bash
git worktree remove worktrees/{name}
```

**Flags opcionales:**
- `--force`: si hay cambios sin comprometer (los descarta)
- `--expire`: para trabajos pendientes

---

## Paso 6: Verificar Eliminación

```bash
git worktree list
```

Confirmar que `worktrees/{name}` NO aparece.

---

## Paso 7: Reportar Resultado

```
✅ Worktree eliminado
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Worktree: feature-login
Rama eliminada: feature/login (si fue creada por nosotros)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Manejo de Errores

| Error | Acción |
|-------|--------|
| Worktree no existe | Listar disponibles |
| Rama tiene commits no empujados | Advertir, ofrecer forzar |
| Git error genérico | Reportar error, no eliminar |

---

## Retry Policy
- max_retries: 2
- Si falla por permisos → verificar ownership
- Si falla por git internal error → abortar y reportar
