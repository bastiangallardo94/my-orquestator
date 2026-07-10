---
phase_id: phase_wt_sync
type: agent
agent: orquestador-fast
entry_condition: "Debe existir al menos un worktree con .orquestador/"
exit_check: static
exit_files: []
supports_partial_retry: true
max_retries: 2
---

# Phase WTS: Sincronizar Archivos Compartidos

## Objetivos
1. Copiar archivos compartidos del repo principal a los worktrees
2. Mantener consistencia de configuracion entre pipelines
3. Reducir duplicacion de trabajo de planificacion

---

## Archivos Compartidos por Defecto

| Archivo | Descripcion | Frecuencia de Cambio |
|---------|-------------|---------------------|
| `api-surface.md` | Mapa de APIs del sistema | Baja |
| `dependency-groups.json` | Grupos de paralelizacion | Baja |
| `config-map.yaml` | Configuracion de servicios | Baja |

---

## Paso 1: Verificar Configuracion

```bash
READ .orquestador/worktree.config.json
```

Si no existe, crear con defaults:

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

## Paso 2: Obtener Lista de Worktrees

```bash
node ~/.config/opencode/plugins/orquestador-worktree.mjs list <repo_path>
```

Filtrar solo worktrees (excluir repo principal `.`).

---

## Paso 3: Determinar Destino

- Si `targetWt` especificado → solo ese worktree
- Si no → todos los worktrees

---

## Paso 4: Copiar Archivos

```bash
for wt in worktrees/*/; do
  for file in api-surface.md dependency-groups.json config-map.yaml; do
    src=".orquestador/$file"
    dst="$wt.orquestador/$file"
    if [ -f "$src" ]; then
      cp "$src" "$dst"
    fi
  done
done
```

---

## Paso 5: Confirmar

```
✅ Sincronizado a 3 worktrees
   • feature-login
   • feature-checkout
   • hotfix-urgent

Archivos sincronizados:
   api-surface.md (45 lines)
   dependency-groups.json (12 lines)
   config-map.yaml (8 lines)
```

---

## Caso: Sync Especifico

Para sincronizar solo un worktree:

```
worktree:sync feature-login
```

Output:
```
✅ Sincronizado a feature-login
Archivos: api-surface.md, dependency-groups.json, config-map.yaml
```

---

## Configuracion Auto-Sync

Si `worktree.config.json` tiene `"auto_sync": true`:

Despues de phase_2_7_pic_deps en cualquier worktree:
1. Copiar `api-surface.md` y `dependency-groups.json` a todos los otros worktrees
2. No copiar si el worktree destino esta en phase_3 o posterior

---

## Exit Check

Verificar que al menos un archivo fue copiado a un worktree.

---

## Retry Policy

- max_retries: 2
- Si falla por permisos → verificar ownership del directorio
- Si falla por archivo inexistente → skip ese archivo, continuar con otros

---

## Nota

Este fase es opcional y manual. No se ejecuta automaticamente en el pipeline standard. Solo se invoca via `worktree:sync [nombre]`.
