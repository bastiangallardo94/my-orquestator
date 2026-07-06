---
name: gitlab-to-github-branch-sync
description: "Workflow skill para sincronizar una rama desde GitLab a GitHub, con rama parametrizable (por defecto develop), validacion de HEAD, push directo y alternativas seguras para non-fast-forward."
---

# GitLab to GitHub Branch Sync

## Objetivo

Estandarizar el traspaso de una rama desde GitLab (origen) hacia GitHub (destino), usando `develop` por defecto o cualquier rama indicada por quien use la skill.

## Cuándo usar este skill

- Cuando se necesita publicar `develop` desde GitLab a GitHub.
- Cuando se necesita publicar otra rama (por ejemplo `release/x`, `feature/y`) desde GitLab a GitHub.
- Cuando se quiere validar SHA y resultado de push de forma auditable.

## No usar este skill cuando

- No existe acceso de lectura al origen o escritura al destino.
- Se requiere reescritura de historial sin aprobacion explicita.
- Se necesita migracion completa de todas las ramas/tags (usar flujo mirror total).

## Entradas requeridas

- URL repositorio GitLab (origen).
- URL repositorio GitHub (destino).
- Rama origen (default: `develop`).
- Rama destino (default: misma rama origen).
- Confirmacion de permisos de escritura en GitHub.

## Reglas de seguridad

- No usar `--force` por defecto.
- Si se requiere sobreescribir rama destino, usar `--force-with-lease` y solo con aprobacion explicita.
- Registrar SHA origen/destino antes y despues del push.

## Flujo recomendado

### 1) Preparación

```bash
git clone --mirror <GITLAB_URL> repo-sync.git
cd repo-sync.git
git remote add github <GITHUB_URL>
git fetch origin --prune
git fetch github --prune
```

### 2) Push de rama (develop por defecto)

```bash
SOURCE_BRANCH=${SOURCE_BRANCH:-develop}
TARGET_BRANCH=${TARGET_BRANCH:-$SOURCE_BRANCH}

git push github origin/${SOURCE_BRANCH}:refs/heads/${TARGET_BRANCH}
```

### 3) Verificación

```bash
git ls-remote --heads origin ${SOURCE_BRANCH}
git ls-remote --heads github ${TARGET_BRANCH}
```

## Manejo de non-fast-forward

Si el push directo falla por `non-fast-forward`:

1. Opcion segura sin sobreescritura: publicar rama de migracion para PR.

```bash
MIG_BRANCH=migration/${TARGET_BRANCH}-$(date +%Y%m%d)
git push github origin/${SOURCE_BRANCH}:refs/heads/${MIG_BRANCH}
```

2. Opcion de sobreescritura controlada (solo aprobada):

```bash
git push --force-with-lease=refs/heads/${TARGET_BRANCH} github origin/${SOURCE_BRANCH}:refs/heads/${TARGET_BRANCH}
```

## Automatización con script

Script incluido en esta skill:

- `sync-branch-gitlab-to-github.sh`

Uso:

```bash
./sync-branch-gitlab-to-github.sh <gitlab_url> <github_url> [source_branch] [target_branch] [workdir]
```

Ejemplo (develop -> develop):

```bash
cd /Users/crepobleteli/Desktop/SODIMAC/skills/gitlab-to-github-branch-sync
./sync-branch-gitlab-to-github.sh \
  https://gitlab.example.com/group/repo.git \
  https://github.com/org/repo.git \
  develop \
  develop
```

Ejemplo (release -> release-candidate):

```bash
./sync-branch-gitlab-to-github.sh \
  https://gitlab.example.com/group/repo.git \
  https://github.com/org/repo.git \
  release/1.2.0 \
  release-candidate/1.2.0
```

## Checklist de validación

- [ ] Remoto `origin` apunta a GitLab correcto.
- [ ] Remoto `github` apunta a GitHub correcto.
- [ ] Rama origen existe en GitLab.
- [ ] Push a rama destino ejecutado.
- [ ] SHA final origen/destino reportado.
- [ ] Si hubo non-fast-forward, se aplico estrategia acordada (PR o force-with-lease aprobado).

## Salida esperada del skill

- Rama sincronizada (develop o rama indicada).
- SHA origen y destino comparables.
- Evidencia de push y estado final.
- Recomendacion clara si hubo bloqueo por politicas o divergencia de historial.
