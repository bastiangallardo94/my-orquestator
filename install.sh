#!/bin/bash
set -e

REPO_DIR="$HOME/my-orquestator"
CONFIG_DIR="$HOME/.config/opencode"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  My Orquestator — Instalador"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Clone repo if not exists
if [ ! -d "$REPO_DIR" ]; then
  echo "📥 Clonando repositorio..."
  git clone https://github.com/bastiangallardo94/my-orquestator.git "$REPO_DIR"
else
  echo "✅ Repositorio encontrado en $REPO_DIR"
fi

# 2. Ensure config dir exists
mkdir -p "$CONFIG_DIR"

# 3. Create symlinks
create_link() {
  local src="$1"
  local dst="$2"

  if [ -L "$dst" ]; then
    rm "$dst"
  elif [ -d "$dst" ]; then
    echo "⚠️  $dst ya existe como directorio. Renombrando a ${dst}.bak"
    mv "$dst" "${dst}.bak"
  fi

  ln -s "$src" "$dst"
  echo "  ✅ $dst → $src"
}

echo ""
echo "🔗 Creando symlinks..."

create_link "$REPO_DIR/agents"        "$CONFIG_DIR/agents"
create_link "$REPO_DIR/skills"        "$CONFIG_DIR/skills"
create_link "$REPO_DIR/commands"      "$CONFIG_DIR/command"
create_link "$REPO_DIR/tools"         "$CONFIG_DIR/tools"
create_link "$REPO_DIR/rules"         "$CONFIG_DIR/rules"
create_link "$REPO_DIR/mcp-servers"   "$CONFIG_DIR/mcp-servers"

# Plugins go inside .opencode/
mkdir -p "$CONFIG_DIR/.opencode"
create_link "$REPO_DIR/plugins"       "$CONFIG_DIR/.opencode/plugins"

# 4. Copy example configs if real ones don't exist
echo ""
if [ ! -f "$CONFIG_DIR/opencode.json" ]; then
  cp "$REPO_DIR/opencode.json.example" "$CONFIG_DIR/opencode.json"
  echo "📝 opencode.json creado desde example"
  echo "   ⚠️  Edita $CONFIG_DIR/opencode.json con tus API keys y paths"
else
  echo "ℹ️  opencode.json ya existe (no sobrescrito)"
fi

if [ ! -f "$CONFIG_DIR/AGENTS.md" ]; then
  cp "$REPO_DIR/AGENTS.md.example" "$CONFIG_DIR/AGENTS.md"
  echo "📝 AGENTS.md creado desde example"
else
  echo "ℹ️  AGENTS.md ya existe (no sobrescrito)"
fi

# 5. Done
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Instalación completa!"
echo ""
echo "  Para actualizar:"
echo "    cd $REPO_DIR && git pull"
echo ""
echo "  Para configurar:"
echo "    Editar $CONFIG_DIR/opencode.json"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
