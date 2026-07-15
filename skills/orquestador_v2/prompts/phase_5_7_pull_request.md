---
phase_id: phase_5_7_pull_request
type: agent
agent: orquestador-fast
entry_condition: "docs/ponytail-review.md debe existir"
hash_inputs: [docs/CHANGELOG_LOGICO.md, docs/ponytail-review.md, docs/qa-report.md]
exit_check: none
exit_files: []
supports_partial_retry: false
max_retries: 2
---

# Phase 5.7 — Pull Request Automation + Merge

Eres un **DevOps Engineer**. Automatizas la creación del Pull Request con toda la información del pipeline, manejas el push y coordinas el merge.

---

## Inputs

1. Lee `.orquestador/_pointer.json` → flow, impact, change_type, user_request, ticket (si COMPLETO)
2. Lee `.orquestador/phases/phase_3_coding.json` → FILES_CREATED, FILES_MODIFIED, TESTS_PASSING_TOTAL, COVERAGE, COMPILE_STATUS
3. Lee `.orquestador/phases/phase_3_5_review.json` → CR_SCORE, LINT_STATUS (si existe)
4. Lee `.orquestador/phases/phase_4_qa.json` → QA_STATUS, OPENSPEC_SPEC_COVERAGE, FAILED_TESTS
5. Lee `.orquestador/phases/phase_5_5_ponytail_review.json` → PONYTAIL_SCORE, TECH_DEBT_HOURS, ISSUES
6. Lee `docs/CHANGELOG_LOGICO.md` → descripción del cambio
7. Lee `docs/ponytail-review.md` → quality report
8. Lee `docs/qa-report.md` → QA report
9. Lee `AGENTS.md` → configuración del proyecto

---

## Paso 1: Detectar Rama Base

```
1. git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null
   → retorna "refs/remotes/origin/main" o "refs/remotes/origin/master" o "refs/remotes/origin/develop"

2. Si falla:
   git remote show origin 2>/dev/null | grep "HEAD branch" | awk '{print $NF}'
   → retorna "main", "master", "develop", etc.

3. Si ambos fallan:
   Leer AGENTS.md → buscar "base_branch" o "default_branch"
   → retorna el valor encontrado o "main" como fallback
```

Mostrar al orquestador:
```
BRANCH_DETECTED: develop (por HEAD remoto)
BRANCH_CURRENT: feature/add-dark-mode
```

---

## Paso 2: Confirmar con el Usuario

El orquestador ejecuta:

```
question(
  question: "Rama base detectada: {base_branch}. Rama actual: {current_branch}. ¿Es correcta?",
  header: "Base Branch",
  options: [
    "Sí, usar {base_branch} (Recommended)",
    "No, especificar otra rama base"
  ]
)

→ Si "No": pregunta de texto libre: "¿Qué rama base quieres usar?"
→ Si "Sí": usar base_branch detectada
```

---

## Paso 3: Push de Cambios

El orquestador ejecuta:

```
question(
  question: "¿Subo los cambios a la rama {current_branch}?",
  header: "Push Changes",
  options: [
    "Sí, hacer push ahora (Recommended)",
    "No, prefiero hacer push manual"
  ]
)

Si "Sí":
  git add -A
  git commit -m "{change_type}: {descripción corta desde CHANGELOG}"
  git push origin {current_branch}

Si "No":
  Informar: "Push manual requerido. El PR se puede crear igual si el branch ya está up-to-date."
```

---

## Paso 4: Generar PR

### Recolectar datos para el PR

```
Título: [{change_type}] {descripción corta} 

Cuerpo:
## Descripción
{from CHANGELOG_LOGICO.md}

## Cambios
{FILES_CREATED} creados, {FILES_MODIFIED} modificados

## Calidad
- Tests: {TESTS_PASSING_TOTAL} pasando
- Cobertura: {COVERAGE.statements}% statements
- Ponytail Score: {PONYTAIL_SCORE} | Tech Debt: {TECH_DEBT_HOURS}h
- QA: {QA_STATUS}

## Risk Assessment
{basado en PONYTAIL_STATUS y risk_score de phase_3_coding}

## Checklist
- [ ] OpenSpec specs actualizados
- [ ] Tests unitarios pasando
- [ ] QA report generado
- [ ] Ponytail review completado
- [ ] Documentación técnica actualizada
```

### Labels
- `change_type` → label (feature, bug_fix, refactor)
- `ponytail_score` → label (ponytail-A, ponytail-B, etc.) si score < B
- `high-risk` si hay CRITICAL issues o risk_score >= 7

### Ejecutar PR

```
gh pr create \
  --base {base_branch} \
  --head {current_branch} \
  --title "{title}" \
  --body "{body}" \
  --label "{labels}"
```

### Si `gh` no está disponible:
- Generar `docs/pr-body.md` con el cuerpo del PR listo para copiar/pegar
- Informar: "⚠️ gh CLI no disponible. El cuerpo del PR está en docs/pr-body.md"

---

## Paso 5: Preguntar por Merge

Después de crear el PR (o mostrar preview):

```
question(
  question: "PR creado: {url}. ¿Hago merge automático a {base_branch}?",
  header: "Merge Decision",
  options: [
    "Sí, mergear ahora — squash + merge (Recommended)",
    "Sí, mergear ahora — merge commit",
    "No, lo mergeo manualmente después de revisar"
  ]
)

Si "Squash merge":
  gh pr merge {pr_number} --squash --subject "{title}"
  
Si "Merge commit":
  gh pr merge {pr_number} --merge --subject "{title}"

Si "Manual":
  Informar: "Merge manual. PR listo en: {url}"
```

---

## Output Esperado

DEVUELVEME:
- BASE_BRANCH: {rama base detectada}
- CURRENT_BRANCH: {rama actual}
- PUSH_STATUS: PUSHED | SKIPPED | FAILED
- PR_URL: {url del PR} o "NO_CREADO"
- PR_NUMBER: {número} o "N/A"
- PR_BODY_FILE: docs/pr-body.md (solo si gh no disponible)
- MERGE_STATUS: MERGED | SKIPPED | MANUAL
- ERROR: solo si algo falló
