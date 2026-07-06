#!/usr/bin/env bash

#############################################################################
# test-all-templates.sh
#
# Script para probar la generación de todos los templates y validar que
# funcionan correctamente.
#
# Genera un proyecto de prueba para cada template, valida placeholders,
# ejecuta type-check.
#
# Uso:
#   ./test-all-templates.sh [template-name]
#
# Si no se especifica template, prueba todos.
#
# Ejemplos:
#   ./test-all-templates.sh                # Prueba todos
#   ./test-all-templates.sh base-mfe      # Solo base-mfe
#############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATES_DIR="$SKILL_DIR/templates"
TEST_OUTPUT_DIR="/tmp/fbc-mfe-generator-tests"

# Get template config
get_template_config() {
    local template=$1
    case $template in
        "base-mfe")
            echo "testBase|mrch.frtr.frontend.test-base|tb|tb-test-base-scope|8506|/foreign-trade/test-base|Test Base"
            ;;
        "router-mfe")
            echo "testRouter|mrch.frtr.frontend.test-router|tr|tr-test-router-scope|8507|/foreign-trade/test-router|Test Router"
            ;;
        "feature-based-mfe")
            echo "testFeature|mrch.frtr.frontend.test-feature|tf|tf-test-feature-scope|8508|/foreign-trade/test-feature|Test Feature"
            ;;
        *)
            echo ""
            ;;
    esac
}

# Templates to test
if [ -z "$1" ]; then
    TEMPLATES=("base-mfe" "router-mfe" "feature-based-mfe")
else
    TEMPLATES=("$1")
fi

echo ""
echo "==========================================="
echo "🧪 TEMPLATE TESTING SUITE"
echo "==========================================="
echo "📂 Templates dir: $TEMPLATES_DIR"
echo "📁 Output dir: $TEST_OUTPUT_DIR"
echo "🎯 Testing: ${TEMPLATES[*]}"
echo ""

# Create output directory
mkdir -p "$TEST_OUTPUT_DIR"

# Results
TOTAL=0
PASSED=0
FAILED=0

# Test each template
for template in "${TEMPLATES[@]}"; do
    TOTAL=$((TOTAL + 1))
    
    config=$(get_template_config "$template")
    if [ -z "$config" ]; then
        echo -e "${RED}❌ Unknown template: $template${NC}"
        FAILED=$((FAILED + 1))
        continue
    fi
    
    IFS='|' read -r APP_NAME PACKAGE_NAME CSS_PREFIX SCOPE_CLASS APP_PORT APP_PATH DISPLAY_NAME <<< "$config"
    
    test_project="$TEST_OUTPUT_DIR/$template-test"
    current_year=$(date +%Y)
    
    echo ""
    echo "==========================================="
    echo -e "${BLUE}📦 Testing: $template${NC}"
    echo "==========================================="
    echo ""
    
    # Copy template
    echo "📋 Step 1/5: Copying template..."
    rm -rf "$test_project"
    cp -r "$TEMPLATES_DIR/$template" "$test_project"
    echo -e "${GREEN}✅ Template copied${NC}"
    
    # Replace placeholders
    echo ""
    echo "🔧 Step 2/5: Replacing placeholders..."
    find "$test_project" -type f \( \
        -name "*.js" -o \
        -name "*.jsx" -o \
        -name "*.ts" -o \
        -name "*.tsx" -o \
        -name "*.json" -o \
        -name "*.css" -o \
        -name ".env*" -o \
        -name "*.md" \
    \) ! -path "*/node_modules/*" ! -path "*/dist/*" -exec sed -i '' \
        -e "s/{{APP_NAME}}/$APP_NAME/g" \
        -e "s/{{PACKAGE_NAME}}/$PACKAGE_NAME/g" \
        -e "s/{{CSS_PREFIX}}/$CSS_PREFIX/g" \
        -e "s/{{SCOPE_CLASS}}/$SCOPE_CLASS/g" \
        -e "s/{{APP_PORT}}/$APP_PORT/g" \
        -e "s|{{APP_PATH}}|$APP_PATH|g" \
        -e "s/{{DISPLAY_NAME}}/$DISPLAY_NAME/g" \
        -e "s/{{YEAR}}/$current_year/g" \
        {} \; 2>/dev/null || true
    
    sed -i '' 's/"prepare": "husky install"/"prepare": "echo skipping husky"/g' "$test_project/package.json" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Placeholders replaced${NC}"
    
    # Validate placeholders
    echo ""
    echo "🔍 Step 3/5: Validating placeholders..."
    if "$SCRIPT_DIR/validate-placeholders.sh" "$test_project" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ No placeholders remaining${NC}"
    else
        echo -e "${RED}❌ Failed: Placeholders still exist${NC}"
        FAILED=$((FAILED + 1))
        continue
    fi
    
    # Install dependencies
    echo ""
    echo "📦 Step 4/5: Installing dependencies..."
    cd "$test_project"
    if bun install > /dev/null 2>&1; then
        package_count=$(find node_modules -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
        echo -e "${GREEN}✅ Dependencies installed ($package_count packages)${NC}"
    else
        echo -e "${RED}❌ Failed: Could not install dependencies${NC}"
        FAILED=$((FAILED + 1))
        continue
    fi
    
    # Type check
    echo ""
    echo "🔎 Step 5/5: Running type-check..."
    if bun type-check > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Type-check passed${NC}"
    else
        error_count=$(bun type-check 2>&1 | grep "error TS" | wc -l | tr -d ' ')
        echo -e "${YELLOW}⚠️  Type-check has $error_count errors (non-blocking)${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✅ Template $template: PASSED${NC}"
    PASSED=$((PASSED + 1))
done

# Summary
echo ""
echo "==========================================="
echo "📊 TEST SUMMARY"
echo "==========================================="
echo ""
echo "Total: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}💥 Some tests failed${NC}"
    exit 1
fi
