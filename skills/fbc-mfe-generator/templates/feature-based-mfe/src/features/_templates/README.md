# Feature Templates

This folder contains templates to help you create new features quickly and consistently.

## How to Create a New Feature

### 1. Copy the Template

```bash
cp -r src/features/_templates/feature-template src/features/my-new-feature
```

### 2. Rename Files

```bash
cd src/features/my-new-feature
mv ExamplePage.tsx MyNewFeaturePage.tsx
mv types/example.types.ts types/myNewFeature.types.ts
```

### 3. Update Component Names

Edit `MyNewFeaturePage.tsx` and update:
- Component name: `ExamplePage` → `MyNewFeaturePage`
- Imports
- Logic

### 4. Add Route in App.tsx

```typescript
import { MyNewFeaturePage } from '@features/my-new-feature/MyNewFeaturePage';

// In your routes:
<Route 
  path="/my-new-feature" 
  element={
    <PrivateRoute>
      <AppLayout>
        <MyNewFeaturePage />
      </AppLayout>
    </PrivateRoute>
  } 
/>
```

### 5. Develop Your Feature

- Add components in `components/`
- Add custom hooks in `hooks/`
- Add TypeScript types in `types/`
- Add constants in `constants/`
- Add tests in `__tests__/`

## Feature Structure

```
my-new-feature/
├── MyNewFeaturePage.tsx      # Main page component
├── components/               # Feature-specific components
│   ├── MyComponent.tsx
│   └── AnotherComponent.tsx
├── hooks/                    # Custom hooks for this feature
│   └── useMyFeatureData.ts
├── types/                    # TypeScript types/interfaces
│   └── myNewFeature.types.ts
├── constants/                # Feature constants
│   └── myNewFeature.constants.ts
└── __tests__/               # Unit tests
    ├── MyNewFeaturePage.test.tsx
    └── components/
        └── MyComponent.test.tsx
```

## Best Practices

1. **Keep features self-contained**: Each feature should have everything it needs
2. **Use shared components**: Import from `@shared/components` for common UI
3. **Use shared hooks**: Import from `@shared/hooks` for common logic
4. **Type everything**: Add proper TypeScript types in types/
5. **Write tests**: Add tests for components and hooks
6. **Follow naming conventions**: Use PascalCase for components, camelCase for hooks

## Examples

See the `home/` feature for a working example.

## Need Help?

Check the project README.md or ask your team lead.
