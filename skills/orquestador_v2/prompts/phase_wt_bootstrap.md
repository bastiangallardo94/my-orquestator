---
phase_id: phase_wt_bootstrap
type: agent
agent: orquestador-fast
entry_condition: "worktree debe existir con .orquestador/ inicializado"
exit_check: static
exit_files: [worktrees/{name}/.orquestador/_pointer.json]
supports_partial_retry: false
max_retries: 1
---

# Phase WT2: Bootstrap Pipeline en Worktree

## Objetivos
1. Inicializar `.orquestador/` en el worktree recién creado
2. Copiar configuración base desde el repo principal
3. Iniciar el pipeline normal (phase_1_analyze)

---

## Paso 1: Verificar Worktree Existe

```bash
if [ ! -d "worktrees/{name}/" ]; then
  ERROR: "Worktree worktrees/{name}/ no existe"
fi
```

---

## Paso 2: Inicializar .orquestador/

```bash
mkdir -p worktrees/{name}/.orquestador/
mkdir -p worktrees/{name}/.orquestador/phases/
mkdir -p worktrees/{name}/.orquestador/cache/
```

---

## Paso 3: Copiar Configuración Compartible

Desde el repo principal (si existe):
- `.orquestador/config-map.yaml` → si existe
- `.orquestador/api-surface.md` → si existe
- `.orquestador/dependency-groups.json` → si existe

**NO copiar:**
- `_pointer.json` (único por pipeline)
- `phases/*.json` (únicos por pipeline)
- `summary.md`, `context.md` (se regeneran)
- `cache/*`

---

## Paso 4: Crear _pointer.json del Worktree

```json
{
  "flow": "TACTICO",
  "impact": "inferido_desde_repo",
  "user_request": "Pipeline en worktree {name}",
  "change_type": "feature",
  "phase_order": ["phase_1_analyze", "checkpoint_1", "phase_3_coding", "checkpoint_3", "phase_6_report"],
  "current_index": 0,
  "deep_model": "orquestador-deep",
  "worktree": {
    "name": "{name}",
    "path": "/path/absoluto/worktrees/{name}",
    "branch": "{branch}",
    "is_worktree": true,
    "parent_repo": "/path/absoluto/del/repo"
  },
  "mcp_available": null,
  "codebase_project": "inferido",
  "tools_detected": {},
  "created_at": "ISO8601"
}
```

---

## Paso 5: Actualizar Summary.md

```markdown
# Pipeline: Worktree {name}

**Rama:** {branch}
**Worktree:** worktrees/{name}/
**Inicio:** {timestamp}

## Progreso
| Fase | Status |
|------|--------|
| phase_1_analyze | PENDING |
```

---

## Paso 6: Informar

```
✅ Pipeline inicializado en worktree
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Worktree: worktrees/{name}/
Rama:     {branch}
Status:   LISTO para phase_1_analyze
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para continuar el pipeline:
  cd worktrees/{name}
  opencode orchestrate

O continuar aquí:
  [Continuar con Phase 1: Analyze]
```

---

## Exit Check
Verificar que `worktrees/{name}/.orquestador/_pointer.json` existe y es válido JSON.

---

## Retry Policy
- max_retries: 1
- Si falla por permisos → verificar que el worktree fue creado con permisos correctos
