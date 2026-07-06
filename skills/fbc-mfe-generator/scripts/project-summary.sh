#!/bin/bash

#############################################################################
# project-summary.sh
#
# Muestra un resumen detallado del proyecto generado con estadísticas,
# siguiente pasos, y comandos útiles.
#
# Uso:
#   ./project-summary.sh <project-path> <template-name> <app-name> <app-port> <display-name>
#
# Ejemplo:
#   ./project-summary.sh /path/to/test-base base-mfe testBase 8506 "Test Base"
#############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Arguments
PROJECT_PATH="${1}"
TEMPLATE_NAME="${2:-unknown}"
APP_NAME="${3:-app}"
APP_PORT="${4:-8000}"
DISPLAY_NAME="${5:-Application}"

# Validate project path
if [ ! -d "$PROJECT_PATH" ]; then
    echo "Error: Project path does not exist: $PROJECT_PATH"
    exit 1
fi

# Get project stats
PROJECT_NAME=$(basename "$PROJECT_PATH")
FILE_COUNT=$(find "$PROJECT_PATH" -type f ! -path "*/node_modules/*" ! -path "*/dist/*" ! -path "*/.git/*" | wc -l | tr -d ' ')
TS_FILE_COUNT=$(find "$PROJECT_PATH" -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l | tr -d ' ')

# Count dependencies if package.json exists
if [ -f "$PROJECT_PATH/package.json" ]; then
    DEP_COUNT=$(grep -c '".*":' "$PROJECT_PATH/package.json" | tr -d ' ' || echo "0")
    
    # Try to get installed packages count
    if [ -d "$PROJECT_PATH/node_modules" ]; then
        INSTALLED_COUNT=$(find "$PROJECT_PATH/node_modules" -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
        INSTALLED_COUNT=$((INSTALLED_COUNT - 1)) # Remove node_modules itself
    else
        INSTALLED_COUNT="not installed yet"
    fi
else
    DEP_COUNT="N/A"
    INSTALLED_COUNT="N/A"
fi

# Installation time estimation
case $TEMPLATE_NAME in
    "base-mfe"|"router-mfe")
        INSTALL_TIME="~2s"
        ;;
    "feature-based-mfe")
        INSTALL_TIME="~7s"
        ;;
    *)
        INSTALL_TIME="~5s"
        ;;
esac

# Clear screen for better presentation
clear

# Header
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}║          ${BOLD}🎉 PROJECT GENERATED SUCCESSFULLY! 🎉${NC}${GREEN}             ║${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Project Info
echo -e "${BOLD}📦 PROJECT INFORMATION${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Name:${NC}         ${DISPLAY_NAME}"
echo -e "  ${BOLD}Location:${NC}     ${PROJECT_PATH}"
echo -e "  ${BOLD}Template:${NC}     ${TEMPLATE_NAME}"
echo -e "  ${BOLD}App Name:${NC}     ${APP_NAME}"
echo -e "  ${BOLD}Port:${NC}         ${APP_PORT}"
echo ""

# Statistics
echo -e "${BOLD}📊 PROJECT STATISTICS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Total files:${NC}              ${FILE_COUNT}"
echo -e "  ${BOLD}TypeScript files:${NC}         ${TS_FILE_COUNT}"
echo -e "  ${BOLD}Dependencies declared:${NC}    ${DEP_COUNT}"
echo -e "  ${BOLD}Packages installed:${NC}       ${INSTALLED_COUNT}"
echo -e "  ${BOLD}Estimated install time:${NC}   ${INSTALL_TIME}"
echo ""

# Next Steps
echo -e "${BOLD}🚀 NEXT STEPS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}1.${NC} Navigate to your project:"
echo -e "     ${YELLOW}cd ${PROJECT_PATH}${NC}"
echo ""
echo -e "  ${BOLD}2.${NC} Install dependencies (if not done already):"
echo -e "     ${YELLOW}bun install${NC}"
echo ""
echo -e "  ${BOLD}3.${NC} Start development server:"
echo -e "     ${YELLOW}bun start${NC}"
echo ""
echo -e "  ${BOLD}4.${NC} Open in browser:"
echo -e "     ${YELLOW}http://localhost:${APP_PORT}${NC}"
echo ""
echo -e "  ${BOLD}5.${NC} Start coding!"
echo -e "     ${YELLOW}Edit src/features/home/pages/HomePage.tsx${NC}"
echo ""

# Useful Commands
echo -e "${BOLD}⚡ USEFUL COMMANDS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Development:${NC}"
echo -e "    bun start              ${BLUE}# Start dev server${NC}"
echo -e "    bun start:live         ${BLUE}# Start with hot reload${NC}"
echo ""
echo -e "  ${BOLD}Building:${NC}"
echo -e "    bun build              ${BLUE}# Production build${NC}"
echo -e "    bun build:dev          ${BLUE}# Development build${NC}"
echo -e "    bun serve              ${BLUE}# Serve production build${NC}"
echo ""
echo -e "  ${BOLD}Quality:${NC}"
echo -e "    bun type-check         ${BLUE}# TypeScript validation${NC}"
echo -e "    bun lint               ${BLUE}# ESLint check${NC}"
echo -e "    bun lint:fix           ${BLUE}# Auto-fix lint issues${NC}"
echo -e "    bun test               ${BLUE}# Run tests${NC}"
echo -e "    bun test:watch         ${BLUE}# Tests in watch mode${NC}"
echo ""
echo -e "  ${BOLD}Analysis:${NC}"
echo -e "    bun analyze            ${BLUE}# Bundle size analysis${NC}"
echo ""

# Important Files
echo -e "${BOLD}📚 IMPORTANT FILES${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Configuration:${NC}"
echo -e "    .env.development             ${BLUE}# Dev environment variables${NC}"
echo -e "    .env.production              ${BLUE}# Prod environment variables${NC}"
echo -e "    rspack.config.js             ${BLUE}# Rspack bundler config${NC}"
echo -e "    module-federation.config.js  ${BLUE}# Module Federation setup${NC}"
echo -e "    apps.json                    ${BLUE}# App Shell registration${NC}"
echo ""
echo -e "  ${BOLD}Entry Points:${NC}"
echo -e "    src/index.tsx                ${BLUE}# Application entry${NC}"
echo -e "    src/App.tsx                  ${BLUE}# Main component${NC}"
echo -e "    src/features/home/           ${BLUE}# Home feature${NC}"
echo ""

# Template-specific tips
TEMPLATE_UPPER=$(echo "$TEMPLATE_NAME" | tr '[:lower:]' '[:upper:]')
echo -e "${BOLD}💡 TIPS FOR ${TEMPLATE_UPPER}${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

case $TEMPLATE_NAME in
    "base-mfe")
        echo -e "  • Simple and clean structure - perfect starting point"
        echo -e "  • Add new features in ${YELLOW}src/features/${NC}"
        echo -e "  • Update routes in ${YELLOW}src/App.tsx${NC}"
        echo -e "  • Customize colors in ${YELLOW}tailwind.config.js${NC}"
        ;;
    "router-mfe")
        echo -e "  • Configure remotes in ${YELLOW}module-federation.config.js${NC}"
        echo -e "  • Add MFE options in ${YELLOW}src/features/router/types/router.types.ts${NC}"
        echo -e "  • Update role guards in ${YELLOW}src/features/router/RouterPage.tsx${NC}"
        echo -e "  • Test with multiple MFEs running locally"
        ;;
    "feature-based-mfe")
        echo -e "  • Use ${YELLOW}src/features/_templates/${NC} to create new features"
        echo -e "  • Complex UI components available in ${YELLOW}src/shared/components/${NC}"
        echo -e "  • Form validation with yup + react-hook-form"
        echo -e "  • Check ${YELLOW}TableSkeleton${NC} for loading states"
        ;;
    *)
        echo -e "  • Explore the codebase and have fun coding!"
        ;;
esac

echo ""

# Documentation
echo -e "${BOLD}📖 DOCUMENTATION${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Project README:${NC}    ${PROJECT_PATH}/README.md"
echo -e "  ${BOLD}Module Federation:${NC} Check apps.json for app-shell integration"
echo -e "  ${BOLD}Environment:${NC}       See .env.development for configuration"
echo ""

# Footer
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}║                    ${BOLD}Happy coding! 🚀${NC}${GREEN}                           ║${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
