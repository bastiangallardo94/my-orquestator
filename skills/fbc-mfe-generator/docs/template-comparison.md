# Comparación de Templates

Guía completa para elegir el template correcto según tu caso de uso.

## Tabla Comparativa

| Característica | base-mfe | feature-based-mfe | router-mfe |
|----------------|----------|-------------------|------------|
| **Complejidad** | ⭐ Básica | ⭐⭐⭐ Alta | ⭐⭐ Media |
| **Features incluidas** | 1 (home) | 1 (home) + _templates/ | 1 (router) |
| **Basado en proyecto** | Simplificado | Inspection | Router |
| **Líneas de código** | ~500 | ~1,500 | ~800 |
| **Tiempo setup** | 2 min | 3 min | 2 min |
| **Curva aprendizaje** | Baja | Media | Media |

## base-mfe

### ¿Cuándo usar?

✅ **Usa base-mfe cuando:**
- Estás empezando un nuevo proyecto simple
- Necesitas un prototipo rápido
- Quieres el mínimo código boilerplate
- La aplicación tendrá 1-3 features simples
- Prefieres agregar complejidad gradualmente

❌ **NO uses base-mfe cuando:**
- Sabes que tendrás 5+ features
- Necesitas patterns complejos desde el inicio
- Quieres un ejemplo completo de CRUD

### Estructura

```
src/
├── core/                    # Config y constantes
├── context/                 # React Contexts (Error, Toast)
├── features/
│   └── home/               # Feature básica con TODOs
├── shared/
│   ├── components/         # PrivateRoute, ProtectedRoute, AppLayout
│   ├── hooks/              # useAppRoles, useTenantParams, etc.
│   ├── i18n/               # es, en, zh
│   └── utils/
├── infrastructure/
│   ├── services/           # HTTP, global state
│   └── store/              # Redux (auth, config, tenant)
└── types/
```

### Features

**Incluye:**
- ✅ Redux configurado (3 slices básicos)
- ✅ i18n (3 idiomas)
- ✅ Routing básico
- ✅ Auth components
- ✅ 5 hooks compartidos
- ✅ Testing setup
- ✅ Linting + Prettier
- ✅ Docker + CI/CD

**NO incluye:**
- ❌ Ejemplos de CRUD
- ❌ Formularios complejos
- ❌ Patterns avanzados
- ❌ Templates para copiar

### Código de Ejemplo

**HomePage.tsx:**
```typescript
export const HomePage: React.FC = () => {
  // TODO: Add your custom hooks
  
  return (
    <div className="base-p-6">
      <h1>Welcome to {{DISPLAY_NAME}}</h1>
      {/* TODO: Add your components */}
    </div>
  );
};
```

**Nivel de detalle:** Esqueleto con TODOs

### Ideal para

- Landing pages
- Dashboards simples
- Herramientas administrativas básicas
- POCs y demos
- Proyectos de aprendizaje

---

## feature-based-mfe

### ¿Cuándo usar?

✅ **Usa feature-based-mfe cuando:**
- Construirás una aplicación grande con múltiples dominios
- Necesitas arquitectura escalable desde el inicio
- Quieres ver patterns de código completos
- El proyecto tendrá 5+ features
- Necesitas templates para replicar structure

❌ **NO uses feature-based-mfe cuando:**
- El proyecto es muy simple (1-2 pantallas)
- Prefieres minimalismo absoluto
- No necesitas ejemplos de código

### Estructura

```
src/
├── core/
├── context/
├── features/
│   ├── home/                    # Feature de ejemplo funcional
│   │   ├── HomePage.tsx
│   │   ├── components/
│   │   │   └── WelcomeCard.tsx  # Componente de ejemplo
│   │   └── __tests__/
│   │
│   └── _templates/              # ⭐ Templates para copiar
│       ├── feature-template/
│       │   ├── ExamplePage.tsx
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── types/
│       │   ├── constants/
│       │   └── __tests__/
│       └── README.md            # Instrucciones
│
├── shared/                       # Igual que base-mfe +
│   └── components/ui/
│       └── Card.tsx              # Más componentes UI
├── infrastructure/               # Igual que base-mfe
└── types/
```

### Features

**Incluye TODO de base-mfe +:**
- ✅ Feature de ejemplo más completa (WelcomeCard component)
- ✅ Carpeta `_templates/` con estructura lista para copiar
- ✅ README con instrucciones de cómo crear features
- ✅ Componentes UI adicionales

**Arquitectura:**
- Basada en proyecto Inspection
- Separation of concerns
- Feature-based + layered architecture

### Código de Ejemplo

**HomePage.tsx:**
```typescript
import { WelcomeCard } from './components/WelcomeCard';

export const HomePage: React.FC = () => {
  return (
    <div className="feat-p-6">
      <h1>Welcome to {{DISPLAY_NAME}}</h1>
      <WelcomeCard 
        title="Getting Started"
        description="This is an example component"
      />
      {/* TODO: Add more components */}
    </div>
  );
};
```

**_templates/feature-template/ExamplePage.tsx:**
```typescript
// Template completo para copiar al crear nuevas features
export const ExamplePage: React.FC = () => {
  // TODO: Add your hooks
  // const { data, loading } = useExampleData();
  
  return (
    <div className="{{CSS_PREFIX}}p-6">
      <h1>{{CSS_PREFIX}}text-2xl">Example Feature</h1>
      {/* TODO: Add your components */}
    </div>
  );
};
```

**Nivel de detalle:** Esqueleto + ejemplos funcionales + templates

### Crear Nueva Feature

```bash
# 1. Copiar template
cp -r src/features/_templates/feature-template src/features/dashboard

# 2. Renombrar
mv src/features/dashboard/ExamplePage.tsx src/features/dashboard/DashboardPage.tsx

# 3. Actualizar imports y código

# 4. Agregar route en App.tsx
```

### Ideal para

- Aplicaciones enterprise grandes
- Sistemas con múltiples módulos/dominios
- Proyectos a largo plazo
- Equipos grandes
- Cuando necesitas consistencia en estructura

---

## router-mfe

### ¿Cuándo usar?

✅ **Usa router-mfe cuando:**
- Necesitas un orquestador de microfrontends
- Tu MFE carga otros MFEs dinámicamente
- Estás creando un punto de entrada/selector
- Implementas Module Federation pattern
- Necesitas agregar otros MFEs sin redeployar

❌ **NO uses router-mfe cuando:**
- Tu MFE no carga otros MFEs
- No usas Module Federation
- Prefieres routing estático

### Estructura

```
src/
├── core/
├── context/
├── features/
│   └── router/                          # ⭐ Feature completa funcional
│       ├── RouterPage.tsx               # Lógica de routing completa
│       ├── components/
│       │   ├── MfeSelector.tsx          # Select dropdown
│       │   ├── MfeContainer.tsx         # Container para MFE
│       │   └── EmptyState.tsx           # Empty state
│       ├── types/
│       │   └── router.types.ts
│       └── __tests__/
│           └── RouterPage.test.tsx
│
├── shared/                               # Igual que base-mfe
├── infrastructure/                       # Igual que base-mfe
└── types/
```

### Features

**Incluye TODO de base-mfe +:**
- ✅ Código completo de mount/unmount de parcels
- ✅ Error handling para remote loading
- ✅ Module Federation configurado con 2 remotes de ejemplo
- ✅ Componentes modulares (Selector, Container, EmptyState)
- ✅ Types para routing

**Configuración especial:**
- `module-federation.config.js` con remotes
- Import dinámico de MFEs remotos
- Cleanup automático de parcels

### Código de Ejemplo

**RouterPage.tsx** (COMPLETO y funcional):
```typescript
export const RouterPage: React.FC = () => {
  const [selectedMfe, setSelectedMfe] = useState<string>("");
  const parcelRef = useRef<Parcel | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedMfe || !containerRef.current) return;

    // Unmount previous
    if (parcelRef.current) {
      parcelRef.current.unmount();
      parcelRef.current = null;
    }

    // Load selected MFE
    const loadMfe = async () => {
      try {
        let mfeModule;
        
        if (selectedMfe === "remote1") {
          mfeModule = await import("exampleMfeAlpha/App");
        } else if (selectedMfe === "remote2") {
          mfeModule = await import("exampleMfeBeta/App");
        }

        if (mfeModule && containerRef.current) {
          const parcel = mountRootParcel(mfeModule, {
            domElement: containerRef.current
          });
          parcelRef.current = parcel;
        }
      } catch (error) {
        console.error("Error loading MFE:", error);
      }
    };

    loadMfe();

    return () => {
      if (parcelRef.current) {
        parcelRef.current.unmount();
      }
    };
  }, [selectedMfe]);

  return (
    <div className="router-scope">
      <MfeSelector value={selectedMfe} onChange={setSelectedMfe} />
      <MfeContainer ref={containerRef} />
      {!selectedMfe && <EmptyState />}
    </div>
  );
};
```

**Nivel de detalle:** Código completo y funcional

### Agregar Nuevo Remote

**1. Actualizar `module-federation.config.js`:**
```javascript
remotes: {
  myNewMfe: "myNewMfe@http://localhost:8503/remoteEntry.js"
}
```

**2. Actualizar `RouterPage.tsx`:**
```typescript
if (selectedMfe === "my-new-mfe") {
  mfeModule = await import("myNewMfe/App");
}
```

**3. Actualizar `MfeSelector.tsx`:**
```tsx
<MenuItem value="my-new-mfe">My New MFE</MenuItem>
```

### Ideal para

- Páginas de selección de módulos
- Entry points que agregan múltiples MFEs
- Menús de mantenedores
- Dashboards que cargan widgets remotos
- Arquitecturas de microfront ends complejas

---

## Matriz de Decisión

### Por Complejidad del Proyecto

| Complejidad | Template Recomendado | Razón |
|-------------|---------------------|-------|
| Simple (1-3 pantallas) | **base-mfe** | Mínimo boilerplate |
| Media (4-8 features) | **feature-based-mfe** | Escalable sin complejidad excesiva |
| Alta (9+ features) | **feature-based-mfe** | Arquitectura probada en Inspection |
| Orquestador | **router-mfe** | Diseñado para este propósito |

### Por Caso de Uso

| Caso de Uso | Template |
|-------------|----------|
| Landing page | base-mfe |
| Dashboard simple | base-mfe |
| CRUD application | feature-based-mfe |
| Gestión de inspecciones | feature-based-mfe |
| Selector de mantenedores | router-mfe |
| Portal de módulos | router-mfe |
| Herramienta admin | base-mfe |
| Sistema enterprise | feature-based-mfe |

### Por Equipo

| Tamaño/Tipo de Equipo | Template |
|-----------------------|----------|
| 1-2 devs | base-mfe |
| 3-5 devs | feature-based-mfe |
| 6+ devs | feature-based-mfe |
| Equipo nuevo | base-mfe (más fácil aprender) |
| Equipo experto | feature-based-mfe o router-mfe |

### Por Tiempo de Entrega

| Tiempo | Template |
|--------|----------|
| 1-2 semanas | base-mfe |
| 1-3 meses | feature-based-mfe |
| 3+ meses | feature-based-mfe |
| Tiempo variable (incrementos) | router-mfe (agregar MFEs gradualmente) |

---

## Migración entre Templates

### De base-mfe a feature-based-mfe

Si empezaste con base-mfe y necesitas escalar:

1. Copiar carpeta `_templates/` de feature-based-mfe template
2. Usar templates para nuevas features
3. Refactorizar features existentes gradualmente

### De feature-based-mfe a router-mfe

Si necesitas convertir un feature-based en orquestador:

1. Extraer features a MFEs separados
2. Crear nuevo router-mfe
3. Configurar remotes apuntando a features extraídas
4. Deprecar feature-based original

---

## Resumen Rápido

**¿Cuál elegir en 10 segundos?**

- **Simple y rápido** → base-mfe
- **App grande con muchas features** → feature-based-mfe
- **Carga otros MFEs** → router-mfe

**¿Dudas? Empieza con base-mfe.** Siempre puedes escalar después.

---

**Última actualización**: Mayo 2025
