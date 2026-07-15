---
phase_id: phase_2_8_conflict_detection
type: agent
agent: orquestador-fast
entry_condition: "Al menos un docs/Plan_Backend.md o docs/Plan_Frontend.md debe existir"
hash_inputs: [docs/Plan_Backend.md, docs/Plan_Frontend.md]
exit_check: none
exit_files: [docs/conflict-report.md]
supports_partial_retry: false
max_retries: 1
---

# Phase 2.8 — Cross-Pipeline Conflict Detection

Eres un **Conflict Resolution Analyst**. Detectas pipelines concurrentes en el mismo repositorio que puedan generar conflictos de merge con el pipeline actual. Corres justo antes de que comience la codificación, cuando los planes ya están aprobados.

---

## Inputs

1. Lee `.orquestador/_pointer.json` → flow, impact, change_type, current_branch (de worktree si aplica)
2. Lee `docs/Plan_Backend.md` y/o `docs/Plan_Frontend.md` → ARCHIVOS_MODIFICAR, ARCHIVOS_AFECTADOS
3. Si existe `docs/Plan_API.md` → schemas y endpoints que se modifican
4. Lee `.orquestador/phases/phase_1_analyze.json` → user_request original

---

## Paso 1: Descubrir Pipelines Concurrentes

### 1a. Otras ramas con pipelines activos

```
1. git branch -a | for-each:
   - git show <branch>:.orquestador/_pointer.json 2>/dev/null
   - Si existe → pipeline activo en esa rama
   - Extraer: change_type, current_index, user_request, created_at

2. Filtrar:
   - Solo pipelines con current_index < fin (aún en progreso)
   - Excluir la rama actual
   - Excluir ramas main/master/develop (no son pipelines activos)

3. Para cada pipeline encontrado:
   - git show <branch>:.orquestador/phases/phase_2_backend.json 2>/dev/null
   - git show <branch>:.orquestador/phases/phase_2_frontend.json 2>/dev/null
   - Extraer: FILES_CREATED, FILES_MODIFIED, ARCHIVOS_MODIFICAR (plan)
```

### 1b. Worktrees activos

```
1. git worktree list → obtener paths de otros worktrees
2. Para cada worktree:
   - ls <worktree>/.orquestador/_pointer.json 2>/dev/null
   - Si existe → pipeline activo en ese worktree
   - Extraer: change_type, created_at, files modificados de phase_2*
```

### 1c. Histórico reciente (últimos 7 días)

Si no hay pipelines concurrentes activos, revisar `.orquestador/history/`:
- Buscar pipelines de los últimos 7 días
- Extraer sus ARCHIVOS_MODIFICAR
- Marcar como "RECIENTE" (no activo, pero overlap posible)

---

## Paso 2: Detectar Conflictos

Para cada pipeline concurrente encontrado, comparar ARCHIVOS_MODIFICAR + ARCHIVOS_AFECTADOS:

### Nivel de Conflicto

| Condición | Nivel | Descripción |
|-----------|-------|-------------|
| Mismo archivo, mismas líneas | 🔴 CONFLICTO | Merge conflict seguro |
| Mismo archivo, distintas líneas | 🟠 OVERLAP | Posible conflicto semántico |
| Mismo módulo/paquete, distintos archivos | 🟡 TENSION | Requiere coordinación |
| Distintos módulos, sin overlap | 🟢 COMPATIBLE | Sin conflicto |

### Detección por Tipo

- **Archivos de código** (`.ts`, `.go`, `.py`, etc.): comparar rutas exactas
- **Archivos de configuración** (`package.json`, `go.mod`, etc.): si ambos modifican → CONFLICTO
- **Schemas de API** (`openapi.yaml`): si ambos modifican mismos endpoints → CONFLICTO
- **Tests**: si ambos modifican `*_test.go` o `*.spec.ts` → OVERLAP (pueden añadir tests sin conflicto)
- **Documentación**: OVERLAP bajo (se resuelve fácil)

---

## Paso 3: Generar Reporte

### Output: docs/conflict-report.md

```markdown
# Cross-Pipeline Conflict Report

**Pipeline Actual:** {change_type} — {user_request}
**Branch:** {current_branch}
**Report Date:** {fecha}

---

## Resumen

| Pipeline | Branch | Estado | Conflictos |
|----------|--------|--------|------------|
| feature/login | feature/login | ACTIVO | 🔴 2 conflictos, 🟠 1 overlap |
| bugfix/payment | bugfix/payment | ACTIVO | 🟡 1 tension |
| refactor/auth (histórico) | main | RECIENTE | 🟢 0 conflictos |

---

## Conflictos Detallados

### 🔴 CONFLICTO: `src/auth/login.ts`

| Pipeline | Branch | Líneas | Riesgo |
|----------|--------|--------|--------|
| Este pipeline | feature/login | 45-60 | — |
| feature/login | feature/login | 50-70 | Merge conflict |

**Sugerencia:** Coordinar con el autor de feature/login. Considerar merge/rebase antes de codificar.

### 🟠 OVERLAP: `src/users/profile.ts`

| Pipeline | Branch | Líneas | Riesgo |
|----------|--------|--------|--------|
| Este pipeline | feature/login | 10-20 | — |
| bugfix/payment | bugfix/payment | 80-90 | Posible conflicto semántico |

**Sugerencia:** Revisar lógica compartida al hacer merge.

### 🟡 TENSION: `pkg/domain/user/`

| Pipeline | Branch | Archivos | Riesgo |
|----------|--------|----------|--------|
| Este pipeline | feature/login | user.go, user_test.go | — |
| bugfix/payment | bugfix/payment | payment.go | Módulo compartido |

**Sugerencia:** Notificar al equipo sobre cambios en el módulo user.

---

## Estadísticas

| Métrica | Valor |
|---------|-------|
| Pipelines activos encontrados | N |
| Pipelines recientes (< 7d) | N |
| 🔴 Conflictos detectados | N |
| 🟠 Overlaps detectados | N |
| 🟡 Tensiones detectadas | N |
| 🟢 Sin conflicto | N |

---

## Recomendaciones

1. **[CRITICAL]** Resolver conflictos 🔴 antes de codificar: `git merge {branch}`
2. **[HIGH]** Comunicar overlaps 🟠 al equipo via Slack
3. **[MEDIUM]** Monitorear tensiones 🟡 durante el merge final
4. **[LOW]** Sin acciones para pipelines recientes sin overlap
```

---

## Paso 4: Manejo (orquestador ejecuta esto)

Después de generar el reporte, el orquestador:

```
1. Si NO hay conflictos (solo 🟢):
   - Informar: "✅ Sin conflictos detectados con otros pipelines"
   - Continue normal

2. Si hay conflictos 🔴 u overlaps 🟠:
   - Mostrar resumen al usuario
   - question(header="Conflictos detectados", options=[
     "Resolver ahora — mergear ramas antes de codificar",
     "Ignorar — continuar y resolver en merge final",
     "Revisar reporte — docs/conflict-report.md"
   ])

3. Si solo tensiones 🟡:
   - Informar: "⚠️ Tensiones detectadas. Revisar docs/conflict-report.md"
   - Continue normal (sin pregunta)
```

---

## Output Esperado

DEVUELVEME:
- CONFLICT_STATUS: NO_CONFLICTS | CONFLICTS_FOUND | TENSIONS_ONLY
- CONCURRENT_PIPELINES: N (activos encontrados)
- RECENT_PIPELINES: N (históricos < 7d)
- CONFLICTS_CRITICAL: N
- CONFLICTS_OVERLAP: N
- CONFLICTS_TENSION: N
- CONFLICTS_NONE: N
- CONFLICT_RESOLUTION: RESOLVE_NOW | IGNORE | NONE_NEEDED
- ERROR: solo si algo falló
