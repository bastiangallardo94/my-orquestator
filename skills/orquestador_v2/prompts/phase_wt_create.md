---
phase_id: phase_wt_create
type: agent
agent: orquestador-fast
entry_condition: "git debe estar disponible y el repo no debe tener worktree con el mismo nombre"
exit_check: static
exit_files: [worktrees/{name}/.orquestador/_pointer.json]
supports_partial_retry: false
max_retries: 1
---

# Phase WT1: Crear Git Worktree

## Objetivos
1. Crear un nuevo Git Worktree con rama asociada
2. Inicializar el pipeline del orquestador en el worktree
3. Confirmar creación exitosa

---

## Paso 1: Validar Nombre

El `name` viene del trigger `worktree:create <nombre>` o de question().

**Validaciones:**
- Sin espacios: `name` → `feature-login` (reemplazar espacios con `-`)
- Sin caracteres especiales: solo `a-z0-9-`
- Longitud: 3-50 caracteres
- No debe existir ya: `git worktree list` → verificar que no exista `worktrees/{name}/`

Si nombre inválido → pedir correction con question()

---

## Paso 2: Determinar Rama Base

- Si especificado en trigger (`worktree:create nombre rama`) → usar esa
- Si no → preguntar con question()
  - Opción 1: Nueva rama `feature/{nombre}`
  - Opción 2: Nueva rama `bugfix/{nombre}`
  - Opción 3: Rama existente (pedir cual)
  - Opción 4: Usar `main` / `develop` (detectar cual existe)

---

## Paso 3: Crear Worktree

```bash
# Opción A: Nueva rama
git worktree add -b {branch_name} worktrees/{name}

# Opción B: Rama existente
git worktree add worktrees/{name} {branch_name}
```

**Manejo de errores:**
- Si la rama ya existe → usar `--force` o pedir confirmación
- Si el path ya existe → error, pedir nombre diferente

---

## Paso 4: Verificar Creación

```bash
git worktree list
```

Confirmar que `worktrees/{name}` aparece en la lista.

---

## Paso 5: Informar Resultado

```
✅ Worktree creado exitosamente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Path:     worktrees/{name}/
Rama:     {branch_name}
Branch:   {branch}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para iniciar el pipeline:
  cd worktrees/{name}
  opencode orchestrate

O iniciar directamente:
  opencode orchestrate --worktree {name}
```

---

## Exit Check
Verificar que `worktrees/{name}/` existe y contiene archivos del proyecto.

---

## Retry Policy
- max_retries: 1
- Si falla por nombre duplicado → pedir nuevo nombre
- Si falla por git error → reportar error tal cual
