#!/usr/bin/env bash
set -euo pipefail

if [[ ${1:-} == "" || ${2:-} == "" ]]; then
  echo "Uso: $0 <gitlab_url> <github_url> [source_branch] [target_branch] [workdir]"
  exit 1
fi

GITLAB_URL="$1"
GITHUB_URL="$2"
SOURCE_BRANCH="${3:-develop}"
TARGET_BRANCH="${4:-$SOURCE_BRANCH}"
DEFAULT_WORKDIR="$HOME/tmp/gitlab-to-github-sync-$(date +%Y%m%d%H%M%S)"
WORKDIR="${5:-$DEFAULT_WORKDIR}"
REPO_DIR="$WORKDIR/repo-sync.git"

echo "==> Origen: $GITLAB_URL"
echo "==> Destino: $GITHUB_URL"
echo "==> Rama origen: $SOURCE_BRANCH"
echo "==> Rama destino: $TARGET_BRANCH"
echo "==> Workdir: $WORKDIR"

mkdir -p "$WORKDIR"

if [[ ! -d "$REPO_DIR" ]]; then
  echo "==> Clonando mirror de origen..."
  git clone --mirror "$GITLAB_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

# Asegura que origin y github queden apuntando a las URLs esperadas.
git remote set-url origin "$GITLAB_URL"
if git remote get-url github >/dev/null 2>&1; then
  git remote set-url github "$GITHUB_URL"
else
  git remote add github "$GITHUB_URL"
fi

echo "==> Remotos"
git remote -v

echo "==> Fetch remotos"
git fetch origin --prune
git fetch github --prune || true

if ! git show-ref --verify --quiet "refs/remotes/origin/$SOURCE_BRANCH"; then
  echo "ERROR: La rama origen '$SOURCE_BRANCH' no existe en GitLab"
  exit 2
fi

SOURCE_SHA="$(git rev-parse "origin/$SOURCE_BRANCH")"
TARGET_SHA=""
if git ls-remote --exit-code --heads github "$TARGET_BRANCH" >/dev/null 2>&1; then
  TARGET_SHA="$(git rev-parse "github/$TARGET_BRANCH")"
fi

echo "==> SHA origen ($SOURCE_BRANCH): $SOURCE_SHA"
if [[ "$TARGET_SHA" != "" ]]; then
  echo "==> SHA destino actual ($TARGET_BRANCH): $TARGET_SHA"
else
  echo "==> Rama destino '$TARGET_BRANCH' no existe en GitHub (se creara)"
fi

echo "==> Push directo"
set +e
git push github "origin/$SOURCE_BRANCH:refs/heads/$TARGET_BRANCH"
PUSH_EXIT=$?
set -e

if [[ $PUSH_EXIT -eq 0 ]]; then
  echo "OK: Push completado a $TARGET_BRANCH"
  git ls-remote --heads origin "$SOURCE_BRANCH"
  git ls-remote --heads github "$TARGET_BRANCH"
  exit 0
fi

echo "WARN: Push directo fallo (posible non-fast-forward o rama protegida)."
echo "Siguientes opciones:"
echo "1) Publicar rama de migracion para PR"
echo "   MIG_BRANCH=migration/${TARGET_BRANCH}-$(date +%Y%m%d)"
echo "   git push github origin/${SOURCE_BRANCH}:refs/heads/\$MIG_BRANCH"
echo "2) Sobrescribir destino con force-with-lease (solo con aprobacion)"
echo "   git push --force-with-lease=refs/heads/${TARGET_BRANCH} github origin/${SOURCE_BRANCH}:refs/heads/${TARGET_BRANCH}"

exit 3
