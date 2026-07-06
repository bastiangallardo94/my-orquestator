# FBC MFE Generator Skill

## Description

Generates React microfrontend projects based on Falabella Business Center templates. Creates fully configured and executable projects ready for development with minimal configuration needed.

Supports 3 project types:
- **base-mfe**: Basic microfrontend with essential setup
- **feature-based-mfe**: Complex microfrontend for multiple features (based on Inspection project)
- **router-mfe**: Orchestrator that loads other microfrontends dynamically (based on Router project)

## Trigger

Use this skill when the user requests:
- "Create a new microfrontend"
- "Generate an MFE project"
- "Create [base/feature-based/router] microfrontend"
- "New FBC project"
- "Scaffold React MFE"
- "Generate microfrontend from template"

## Prerequisites

Before running this skill, verify:
- Node.js version 22.21.1 is installed (`node -v`)
- Bun is installed (`bun -v`)
- User has access to project creation location

## Workflow

### Step 1: Ask User for Project Configuration

Ask the user the following questions to configure the project:

**Question 1: Template Type**

Show the user this comparison table to help them choose:

```
┌─────────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature             │ base-mfe     │ router-mfe   │ feature-mfe  │
├─────────────────────┼──────────────┼──────────────┼──────────────┤
│ Complexity          │ ⭐ Simple     │ ⭐⭐ Medium   │ ⭐⭐⭐ High    │
│ Features included   │ 1 (Home)     │ 1 (Router)   │ 1 + template │
│ Routing             │ Basic        │ Advanced     │ Advanced     │
│ Module Federation   │ Basic        │ 2+ remotes   │ 2+ remotes   │
│ Dependencies        │ ~962 pkg     │ ~962 pkg     │ ~1,499 pkg   │
│ UI Components       │ Basic        │ Basic        │ Advanced     │
│ Forms support       │ No           │ No           │ Yes (yup)    │
│ Date pickers        │ Optional     │ Optional     │ Included     │
│ Data tables         │ No           │ No           │ Yes          │
│ Best for            │ New MFE      │ Orchestrator │ Complex app  │
│ Learning curve      │ Easy         │ Medium       │ Steep        │
│ Time to first page  │ 5 min        │ 10 min       │ 15 min       │
└─────────────────────┴──────────────┴──────────────┴──────────────┘

Detailed descriptions:

1. base-mfe (Recommended for most cases)
   ✅ Lightweight and fast
   ✅ Clean structure to build upon
   ✅ All essentials included (Redux, i18n, MUI, Tailwind)
   ✅ Easy to understand and extend
   📦 17 dependencies
   💡 Perfect for: New microfrontends, simple features, learning

2. router-mfe
   ✅ Built-in dynamic MFE loading
   ✅ Routing orchestration pattern
   ✅ Select dropdown to switch between MFEs
   ✅ Good for entry points
   📦 17 dependencies
   💡 Perfect for: Entry pages that load other MFEs dynamically

3. feature-based-mfe
   ✅ Advanced UI components (tables, forms, datepickers)
   ✅ Feature template in _templates/ folder
   ✅ Complex state management examples
   ✅ More utilities and helpers
   📦 30 dependencies
   ⚠️  Heavier bundle size
   💡 Perfect for: Complex applications with multiple features

👉 Recommendation: Start with base-mfe unless you specifically need 
   router orchestration or advanced UI components.

Please enter: base-mfe, feature-based-mfe, or router-mfe
```

**Question 2: Project Location**
```
Where do you want to create the project? (absolute path)

Example: /Users/bgallardoc/Documents/proyects/my-new-mfe

Enter the full path:
```

**Question 3: APP_NAME**
```
Technical name for the application (PascalCase, will be used for Module Federation)

Examples:
  - importInspections
  - importMaintainersRouter
  - importDashboard

This will be used as:
  - Module Federation remote name
  - Application identifier

Enter APP_NAME:
```

**Question 4: PACKAGE_NAME**
```
NPM package name (lowercase with dots)

Examples:
  - mrch.frtr.frontend.inspections
  - mrch.frtr.frontend.maintainers-router

Suggestion: mrch.frtr.frontend.{your-project-name}

Enter PACKAGE_NAME:
```

**Question 5: CSS_PREFIX**
```
Tailwind CSS prefix to avoid style conflicts (lowercase with dash)

Examples:
  - insp- (for inspections)
  - maint- (for maintainers)
  - dash- (for dashboard)

Suggestion: Use first 4 letters of your project + dash

Enter CSS_PREFIX:
```

**Question 6: PORT**
```
Development server port

Default: 8500
Common ports: 8500, 8501, 8502, 8503, 8504

Enter PORT (or press Enter for 8500):
```

**Question 7: APP_PATH**
```
URL path in the portal

Examples:
  - /foreign-trade/inspections
  - /foreign-trade/maintainers
  - /foreign-trade/dashboard

This is where your MFE will be mounted in the portal.

Enter APP_PATH:
```

**Question 8: REMOTES (only if router-mfe selected)**
```
List of remote MFEs to consume (you can edit this later in module-federation.config.js)

Format: remoteName@url

Examples:
  - importMaintainerForwarders@http://localhost:8501/remoteEntry.js
  - importMaintainerWarehouses@http://localhost:8502/remoteEntry.js

Enter remotes (comma-separated, or press Enter to skip):
```

**Question 9: Install Dependencies**
```
Do you want to install dependencies now? (This will run 'bun install')

Enter 'yes' or 'no':
```

### Step 2: Validate Inputs

Perform the following validations:

1. **Project Location**
   - Check if parent directory exists
   - Check if target directory already exists (warn user)
   - Verify write permissions

2. **APP_NAME**
   - Validate PascalCase format
   - No spaces or special characters

3. **PACKAGE_NAME**
   - Validate format (lowercase, dots allowed, no spaces)

4. **CSS_PREFIX**
   - Validate format (lowercase, ends with dash)
   - No special characters except dash

5. **PORT**
   - Validate is a number between 3000-9999
   - Optionally check if port is in use

6. **APP_PATH**
   - Validate starts with `/`
   - No trailing slash

If any validation fails, re-ask the question with error message.

### Step 3: Generate Derived Variables

From the user inputs, generate:

```javascript
const SCOPE_CLASS = APP_NAME.toLowerCase() + '-scope';
// Example: importInspections → inspections-scope

const DISPLAY_NAME = APP_NAME
  .replace(/^import/, '')
  .replace(/([A-Z])/g, ' $1')
  .trim();
// Example: importInspections → Inspections

const CURRENT_YEAR = new Date().getFullYear();
// Example: 2025
```

### Step 4: Copy Template

Copy the selected template to the target location:

```bash
cp -r ~/.agents/skills/fbc-mfe-generator/templates/{selected-template}/ {PROJECT_LOCATION}/
```

### Step 5: Replace Placeholders

Search and replace the following placeholders in ALL files with these extensions:
- `.ts`, `.tsx`, `.js`, `.mjs`, `.jsx`
- `.json`
- `.md`
- `.css`, `.scss`
- `.yml`, `.yaml`
- `.html`
- `.env`, `.env.development`, `.env.production`

**Placeholders to replace:**

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `{{APP_NAME}}` | User's APP_NAME | `importInspections` |
| `{{PACKAGE_NAME}}` | User's PACKAGE_NAME | `mrch.frtr.frontend.inspections` |
| `{{CSS_PREFIX}}` | User's CSS_PREFIX | `insp-` |
| `{{SCOPE_CLASS}}` | Generated SCOPE_CLASS | `inspections-scope` |
| `{{APP_PORT}}` | User's PORT | `8500` |
| `{{APP_PATH}}` | User's APP_PATH | `/foreign-trade/inspections` |
| `{{DISPLAY_NAME}}` | Generated DISPLAY_NAME | `Inspections` |
| `{{YEAR}}` | Current year | `2025` |
| `{{REMOTES}}` | User's remotes (router only) | See below |

**For REMOTES placeholder (router-mfe only):**

If user provided remotes, generate the remotes object:
```javascript
// Input: "importMaintainerForwarders@http://localhost:8501/remoteEntry.js,importMaintainerWarehouses@http://localhost:8502/remoteEntry.js"

// Output in module-federation.config.js:
remotes: {
  importMaintainerForwarders: "importMaintainerForwarders@http://localhost:8501/remoteEntry.js",
  importMaintainerWarehouses: "importMaintainerWarehouses@http://localhost:8502/remoteEntry.js"
}
```

If user didn't provide remotes, use default example remotes:
```javascript
remotes: {
  exampleMfeAlpha: "exampleMfeAlpha@http://localhost:8501/remoteEntry.js",
  exampleMfeBeta: "exampleMfeBeta@http://localhost:8502/remoteEntry.js"
}
```

**Files to exclude from replacement:**
- `node_modules/` (if exists)
- `.git/` (if exists)
- Binary files
- `Dockerfile` (copy as-is)
- `.github/workflows/` (copy as-is)
- `.gitlab-ci.yml` (copy as-is)

### Step 6: Install Dependencies (if requested)

If user answered 'yes' to install dependencies:

```bash
cd {PROJECT_LOCATION}
bun install
```

Show progress to user:
```
📦 Installing dependencies with Bun...
This may take a few minutes...
```

### Step 7: Display Success Message

Show the following success message:

```
✅ Project created successfully!

📦 Project Details:
   Name: {APP_NAME}
   Package: {PACKAGE_NAME}
   Template: {selected-template}

📍 Location: {PROJECT_LOCATION}

🌐 Configuration:
   Port: {APP_PORT}
   Path: {APP_PATH}
   CSS Prefix: {CSS_PREFIX}
   Scope Class: {SCOPE_CLASS}

🚀 Next Steps:

1. Navigate to project:
   cd {PROJECT_LOCATION}

{If dependencies not installed:}
2. Install dependencies:
   bun install

3. Start development server:
   bun start

4. Open in browser:
   http://localhost:{APP_PORT}

📚 Documentation:
   - README.md: Project overview and setup instructions
   - src/features/_templates/: Templates for new features (feature-based-mfe only)
   - docs/: Additional guides

📋 App Shell Registration:
   - apps.json: Contains configuration for registering this MFE in the portal
   - Copy its content to the app-shell's apps.json to register this MFE
   - Update the remote port from 8000 to {APP_PORT}

💡 Tips:
   - Use 'nvm use' to ensure Node 22.21.1 is active
   - Run 'bun test' to verify tests pass
   - Run 'bun lint' to check code quality

Happy coding! 🎉
```

### Step 8: Show Project Summary Report

After successful generation, run the project summary script to show the user a beautiful report:

```bash
~/.agents/skills/fbc-mfe-generator/scripts/project-summary.sh \
  <PROJECT_PATH> \
  <TEMPLATE_NAME> \
  <APP_NAME> \
  <APP_PORT> \
  <DISPLAY_NAME>
```

This will display:
- Project information (name, location, template, port)
- Statistics (files, dependencies, install time)
- Next steps (numbered list of what to do)
- Useful commands (development, building, quality checks)
- Important files (configuration, entry points)
- Template-specific tips
- Documentation links

The report is colorful and well-formatted to provide an excellent onboarding experience.

### Step 9: Post-Generation Validation (Optional)

Optionally verify the generated project:

1. Check that key files exist:
   - `package.json`
   - `tsconfig.json`
   - `src/App.tsx`
   - `src/index.ts`
   - `apps.json`

2. Validate `package.json`:
   - Name matches PACKAGE_NAME
   - Scripts are present

3. If dependencies were installed, check that `node_modules/` exists

If any validation fails, warn the user but don't fail the generation.

## Success Criteria

The skill execution is successful when:

1. ✅ Template was copied to target location
2. ✅ All placeholders were replaced correctly
3. ✅ No placeholder remains in any file (verify with grep)
4. ✅ Dependencies installed successfully (if requested)
5. ✅ Project directory structure is correct
6. ✅ User can navigate to the directory and run `bun start`

## Error Handling

If any error occurs during the process:

1. **Location doesn't exist**: Ask user to verify the path or create parent directories
2. **Permission denied**: Inform user about permission issues
3. **Placeholder replacement fails**: Show which file failed and why
4. **Bun install fails**: Show the error and suggest manual installation
5. **Port already in use**: Warn user but continue (they can change it later)

Always provide clear, actionable error messages.

## Template Descriptions

### base-mfe
- **Purpose**: Minimal microfrontend for simple applications
- **Features**: 1 feature (home) with skeleton code
- **Use when**: Starting a new simple MFE, prototype, or POC
- **Structure**: Basic folder structure with all configs ready

### feature-based-mfe
- **Purpose**: Complex microfrontend for multiple business features
- **Features**: 1 example feature (home) + _templates/ folder
- **Use when**: Building large applications with multiple domains
- **Based on**: Inspection project architecture
- **Extra**: Includes template folder for copying when creating new features

### router-mfe
- **Purpose**: Orchestrator that loads other MFEs dynamically
- **Features**: Complete routing logic with mount/unmount
- **Use when**: Creating entry points that aggregate other MFEs
- **Based on**: Maintainers Router project
- **Extra**: Fully functional parcel mounting code included

## Notes

- All templates use **Bun** as package manager
- All templates require **Node 22.21.1** (enforced via .nvmrc)
- All templates include 7 path aliases configured
- All templates have Redux, i18n, testing, and linting pre-configured
- Dockerfile and CI/CD configs are copied as-is from original projects
- CSS is scoped using Tailwind prefix + scope class to avoid conflicts

## Maintenance

To update templates:
1. Update the source projects (Inspection, Router)
2. Copy updated files to template folders
3. Replace hardcoded values with placeholders
4. Test generation with a sample project
