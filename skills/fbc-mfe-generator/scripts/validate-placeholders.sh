#!/bin/bash

#############################################################################
# validate-placeholders.sh
#
# Script de validación para verificar que todos los placeholders fueron
# reemplazados correctamente en un proyecto generado.
#
# Uso:
#   ./validate-placeholders.sh /path/to/generated/project
#
# Retorna:
#   0 - Si todos los placeholders fueron reemplazados
#   1 - Si quedan placeholders sin reemplazar
#
# Ejemplos:
#   ./validate-placeholders.sh /Users/bgallardoc/Documents/proyects/APP02696-mrch-frontend-cross-portal/packages/test-base-mfe
#############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if path argument is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: No path provided${NC}"
    echo "Usage: $0 <path-to-project>"
    echo "Example: $0 /Users/bgallardoc/Documents/proyects/APP02696-mrch-frontend-cross-portal/packages/test-base-mfe"
    exit 1
fi

PROJECT_PATH="$1"

# Check if path exists
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}❌ Error: Directory does not exist: $PROJECT_PATH${NC}"
    exit 1
fi

echo ""
echo "==========================================="
echo "🔍 PLACEHOLDER VALIDATION"
echo "==========================================="
echo "📂 Project: $PROJECT_PATH"
echo ""

# Change to project directory
cd "$PROJECT_PATH"

# Find all relevant files
echo "📝 Searching for placeholders..."
echo ""

# Search for placeholders in code files
# Exclude:
# - node_modules/
# - dist/
# - .git/
# - JavaScript object syntax like { key: value }
# - Style objects like style={{ }}
PLACEHOLDER_FILES=$(grep -r "{{[A-Z_]*}}" \
  --include="*.js" \
  --include="*.jsx" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.json" \
  --include=".env*" \
  --include="*.md" \
  --include="*.css" \
  --include="*.scss" \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=.git \
  --exclude-dir=bun.lockb \
  . | grep -v "{ {" | grep -v "{{ " || true)

# Count placeholders
PLACEHOLDER_COUNT=$(echo "$PLACEHOLDER_FILES" | grep -v "^$" | wc -l | tr -d ' ')

if [ "$PLACEHOLDER_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS: No placeholders found${NC}"
    echo ""
    echo "==========================================="
    echo "All placeholders have been replaced!"
    echo "==========================================="
    echo ""
    exit 0
else
    echo -e "${RED}❌ FAILED: Found $PLACEHOLDER_COUNT placeholder(s)${NC}"
    echo ""
    echo "==========================================="
    echo "Placeholders found:"
    echo "==========================================="
    echo ""
    echo "$PLACEHOLDER_FILES"
    echo ""
    echo "==========================================="
    echo "Please replace these placeholders:"
    echo "==========================================="
    echo ""
    
    # Extract unique placeholder names
    UNIQUE_PLACEHOLDERS=$(echo "$PLACEHOLDER_FILES" | grep -o "{{[A-Z_]*}}" | sort -u)
    echo "$UNIQUE_PLACEHOLDERS"
    echo ""
    
    # Show placeholder meanings
    echo "==========================================="
    echo "Placeholder meanings:"
    echo "==========================================="
    echo ""
    echo "  {{APP_NAME}}      - Application name (camelCase, e.g., testBase)"
    echo "  {{PACKAGE_NAME}}  - NPM package name (e.g., mrch.frtr.frontend.test-base)"
    echo "  {{CSS_PREFIX}}    - CSS class prefix (e.g., tb)"
    echo "  {{SCOPE_CLASS}}   - Tailwind scope class (e.g., tb-test-base-scope)"
    echo "  {{APP_PORT}}      - Development server port (e.g., 8506)"
    echo "  {{APP_PATH}}      - Application path (e.g., /foreign-trade/test-base)"
    echo "  {{DISPLAY_NAME}}  - Human-readable name (e.g., Test Base)"
    echo "  {{YEAR}}          - Current year (e.g., 2026)"
    echo ""
    
    exit 1
fi
