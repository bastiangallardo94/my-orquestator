# 📦 Dependency Profiles Guide

This guide explains the dependency structure of each template and how to customize them for your needs.

---

## Overview

Each template comes with a **standard** set of dependencies that work for most use cases. However, you can customize your project by removing optional dependencies based on your requirements.

---

## Base-MFE Dependencies (17 total)

### 🔴 Core Dependencies (REQUIRED - 11)

These dependencies are **essential** and should NOT be removed:

| Dependency | Purpose | Remove? |
|------------|---------|---------|
| `react` | React library | ❌ Required |
| `react-dom` | React DOM rendering | ❌ Required |
| `single-spa` | Microfrontend framework | ❌ Required |
| `single-spa-react` | Single-spa React integration | ❌ Required |
| `@rspack/cli` | Bundler CLI | ❌ Required |
| `@rspack/core` | Bundler core | ❌ Required |
| `@emotion/react` | CSS-in-JS (required by MUI) | ❌ Required |
| `@mui/material` | UI component library | ❌ Required |
| `@reduxjs/toolkit` | State management | ❌ Required |
| `react-redux` | Redux React bindings | ❌ Required |
| `redux-micro-frontend` | Redux for MFE | ❌ Required |

### 🟡 Standard Dependencies (RECOMMENDED - 4)

These are included by default and recommended for most projects:

| Dependency | Purpose | Remove? | Alternative |
|------------|---------|---------|-------------|
| `@import/shipment-library-react` | Falabella UI library | ⚠️ Team-specific | Custom components |
| `react-router-dom` | Client-side routing | ⚠️ If no routing needed | None |
| `i18next` + `react-i18next` | Internationalization | ⚠️ If single language | Hardcode strings |
| `jwt-decode` | JWT token decoding | ⚠️ If not using JWT | None |

### 🟢 Optional Dependencies (OPTIONAL - 2)

These can be added/removed based on your needs:

| Dependency | Purpose | When to Keep | When to Remove |
|------------|---------|--------------|----------------|
| `@mui/x-date-pickers` | Date picker components | Need date inputs | No date functionality |
| `dayjs` | Date manipulation | Need date logic | Use native Date |
| `redux-persist` | Persist Redux state | Need state persistence | Stateless app |

---

## Router-MFE Dependencies (17 total)

Same as base-mfe, plus specific routing logic.

### Additional Considerations

- Keep all base-mfe core dependencies
- Router-specific logic in `src/features/router/`
- MUI Select component used for MFE switching

---

## Feature-Based-MFE Dependencies (30 total)

### 🔴 Core Dependencies (REQUIRED - 11)

Same as base-mfe.

### 🟡 Standard Dependencies (RECOMMENDED - 10)

Same as base-mfe, plus:

| Dependency | Purpose | Remove? |
|------------|---------|---------|
| `react-hook-form` | Form management | ⚠️ If no complex forms |
| `yup` | Schema validation | ⚠️ If no form validation |
| `react-select` | Advanced select inputs | ⚠️ If not using selects |
| `papaparse` | CSV parsing | ⚠️ If no CSV import/export |

### 🟢 Optional Dependencies (OPTIONAL - 9)

| Dependency | Purpose | When to Keep | When to Remove |
|------------|---------|--------------|----------------|
| `react-loading-skeleton` | Loading skeletons | Using TableSkeleton component | Use Tailwind pulse |
| `axios` | HTTP client | Complex API calls | Use fetch |
| `react-datepicker` | Alternative date picker | Need different date picker | Use MUI DatePicker |

---

## Dependency Profiles

### Profile 1: Minimal (~700 packages)

**For**: Simple applications, learning, prototypes

**Remove from base-mfe**:
```bash
bun remove @mui/x-date-pickers dayjs redux-persist i18next react-i18next
```

**Result**: ~700 packages, faster install, smaller bundle

**Trade-offs**:
- ❌ No date pickers
- ❌ No state persistence
- ❌ No i18n support
- ✅ Faster development
- ✅ Smaller bundle

---

### Profile 2: Standard (~962 packages) ⭐ RECOMMENDED

**For**: Most production applications

**Current state**: Already configured in templates

**Includes**:
- ✅ All core dependencies
- ✅ Date pickers (optional use)
- ✅ State persistence
- ✅ i18n support
- ✅ Routing

**Use when**: Building a typical microfrontend

---

### Profile 3: Full (~1,499 packages)

**For**: Complex applications with advanced features

**Use template**: feature-based-mfe

**Includes everything from Standard, plus**:
- ✅ Form management (react-hook-form + yup)
- ✅ Advanced UI components (tables, selects)
- ✅ CSV handling
- ✅ Loading skeletons
- ✅ HTTP client (axios)

**Use when**: Building feature-rich applications

---

## How to Switch Profiles

### After Generation: Downgrade to Minimal

1. Generate project with base-mfe
2. Remove optional dependencies:
   ```bash
   cd your-project
   bun remove @mui/x-date-pickers dayjs redux-persist i18next react-i18next
   ```
3. Remove related code:
   - Delete `src/shared/i18n/` folder
   - Remove `persistor` from `src/infrastructure/store/store.ts`
   - Remove `LocalizationProvider` from `src/App.tsx`
4. Update imports and clean up

**Time**: ~15 minutes  
**Savings**: ~260 packages, ~50MB disk space

---

### After Generation: Upgrade to Full

1. Generate project with base-mfe
2. Add advanced dependencies:
   ```bash
   cd your-project
   bun add react-hook-form yup react-select papaparse react-loading-skeleton axios
   ```
3. Copy components from feature-based-mfe template if needed

**Time**: ~30 minutes (+ component migration)  
**Cost**: ~537 packages, ~150MB disk space

---

## Recommended Workflow

### For Most Developers ⭐

1. **Start with base-mfe (Standard profile)**
   - Includes everything you might need
   - Easy to remove what you don't use
   - ~962 packages

2. **Remove unused dependencies later**
   - After 1-2 weeks of development
   - When you know what you actually need
   - Use `bun remove <package>`

3. **Add advanced dependencies as needed**
   - Only when you need them
   - Keeps bundle size optimal

---

### For Experienced Teams

1. **Choose template based on complexity**:
   - Simple app → base-mfe
   - Orchestrator → router-mfe
   - Complex app → feature-based-mfe

2. **Customize immediately** if you know your needs:
   - Remove i18n if single language
   - Remove date pickers if no date inputs
   - Add form libraries if needed

---

## Quick Reference

### Remove Date Functionality
```bash
bun remove @mui/x-date-pickers dayjs
# Remove LocalizationProvider from App.tsx
```

### Remove i18n
```bash
bun remove i18next react-i18next
# Remove i18n imports from App.tsx
# Delete src/shared/i18n/ folder
```

### Remove State Persistence
```bash
bun remove redux-persist
# Remove persistor from store.ts
# Remove PersistGate from App.tsx
```

### Add Form Libraries
```bash
bun add react-hook-form yup
# Import and use in your forms
```

### Add Advanced UI
```bash
bun add react-loading-skeleton
# Import Skeleton component
```

---

## Dependency Size Reference

| Package | Installed Size | Bundle Impact |
|---------|----------------|---------------|
| `@mui/material` | ~5MB | ~200KB (tree-shaken) |
| `@mui/x-date-pickers` | ~800KB | ~100KB |
| `dayjs` | ~100KB | ~20KB |
| `i18next` + `react-i18next` | ~300KB | ~50KB |
| `redux-persist` | ~50KB | ~10KB |
| `react-hook-form` | ~150KB | ~30KB |
| `yup` | ~200KB | ~50KB |
| `axios` | ~150KB | ~30KB |

**Note**: Bundle sizes are approximate and depend on tree-shaking and actual usage.

---

## Summary

### Default Templates

```
base-mfe:         17 deps →  ~962 packages → Standard profile
router-mfe:       17 deps →  ~962 packages → Standard profile  
feature-based-mfe: 30 deps → ~1,499 packages → Full profile
```

### Customization Options

```
Minimal:   Remove 5 optional → ~700 packages  (for simple apps)
Standard:  Keep as-is        → ~962 packages  (recommended)
Full:      Use feature-mfe   → ~1,499 packages (for complex apps)
```

### Recommendation

✅ **Start with Standard** (base-mfe or router-mfe)  
✅ **Remove later** if you don't need something  
✅ **Add on demand** when you need advanced features  

This approach gives you flexibility without complexity upfront.
