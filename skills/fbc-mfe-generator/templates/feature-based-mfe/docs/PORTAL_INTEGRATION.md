# Integración con el Portal

Este documento describe cómo el microfrontend se integra con el portal principal y accede a sus servicios compartidos.

## 🔗 Componentes de Integración

### 1. Global Store (Redux Micro Frontend)

El portal utiliza `redux-micro-frontend` para compartir estado entre microfrontends.

```typescript
// src/infrastructure/store/globalStore.ts
import { GlobalStore, IGlobalStore } from "redux-micro-frontend";

const globalStore: IGlobalStore = GlobalStore.Get(STORE_DEBUG);
```

#### Estado Global Compartido

```typescript
interface GlobalStoreState {
  authentication: {
    token: string;
    isLogged: boolean;
  };
  configuration: {
    language: string;
    selectedTenant: {
      country: { name: string };
      commerce: { name: string };
    };
  };
  ui?: {
    sidebarOpen?: boolean;
  };
}
```

### 2. Servicio de Estado Global

Suscribe el store local a cambios del store global del portal.

```typescript
// src/infrastructure/services/globalStateService.ts

// Suscribirse a cambios de autenticación
handleSubscribeToGlobalAuthenticationChange();

// Suscribirse a cambios de idioma
handleSubscribeToGlobalLanguageChange();

// Suscribirse a cambios de tenant/país
handleSubscribeToGlobalTenantAndCountryChange();

// Suscribirse a cambios del sidebar
handleSubscribeToGlobalSidebarChange();
```

## 🔐 Autenticación y Autorización

### Token JWT

El portal proporciona un token JWT que contiene información del usuario y sus roles.

#### Estructura del Token

```typescript
interface DecodedAuthToken {
  sub?: string;              // User ID
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, {
    roles?: string[];
  }>;
}
```

### Hook: useAppRoles

Obtiene los roles y datos del usuario desde el token.

```typescript
import { useAppRoles } from '@shared/hooks/useAppRoles';

function MyComponent() {
  const { 
    isAdmin,      // true si tiene rol de admin
    isUser,       // true si tiene rol de user
    roles,        // array con todos los roles
    username,     // nombre de usuario
    auditStamp    // datos para auditoría
  } = useAppRoles('ADMIN', 'USER', 'rim');
  
  if (isAdmin) {
    return <AdminPanel />;
  }
  
  return <UserPanel />;
}
```

#### Parámetros del Hook

- `adminRole`: Nombre del rol de administrador (default: 'ADMIN')
- `userRole`: Nombre del rol de usuario (default: 'USER')
- `clientId`: ID del cliente en Keycloak (default: 'rim')

### Utilidades de Token

```typescript
import {
  safeDecodeToken,
  extractRoles,
  extractUserInfo,
  buildAuditStamp
} from '@shared/utils/tokenUtils';

// Decodificar token
const decoded = safeDecodeToken(token);

// Extraer roles
const roles = extractRoles(decoded, 'rim');

// Extraer información del usuario
const user = extractUserInfo(decoded);
// { userId, email, name, username }

// Crear audit stamp para trazabilidad
const audit = buildAuditStamp(user, roles);
// { userId, email, name, roles }
```

## 🌍 Tenant y País

### Hook: useTenantParams

Obtiene el tenant (business unit) y país seleccionado en el portal.

```typescript
import { useTenantParams } from '@shared/hooks/useTenantParams';

function MyComponent() {
  const { 
    bu,              // Business Unit (commerce.name)
    country,         // País (country.name)
    selectedTenant,  // Objeto completo del tenant
    isReady          // true si bu y country están disponibles
  } = useTenantParams();
  
  // Esperar a que el tenant esté disponible
  if (!isReady) {
    return <Loading />;
  }
  
  // Usar en llamadas API
  const data = await fetchData(bu, country);
}
```

#### Ejemplo de uso en API

```typescript
async function fetchProducts() {
  const { bu, country, isReady } = useTenantParams();
  
  if (!isReady) {
    throw new Error('Tenant no disponible');
  }
  
  const response = await fetch(
    `/api/products?bu=${bu}&country=${country}`
  );
  return response.json();
}
```

## 🌐 Idioma (i18n)

### Context: LanguageContext

Sincroniza el idioma del microfrontend con el portal.

```typescript
import { useLanguageContext } from '@shared/context/LanguageContext';

function MyComponent() {
  const { currentLanguage, setLanguage } = useLanguageContext();
  
  return (
    <div>
      <p>Idioma actual: {currentLanguage}</p>
      <button onClick={() => setLanguage('en')}>
        Cambiar a inglés
      </button>
    </div>
  );
}
```

#### Idiomas soportados

- `es` - Español
- `en` - Inglés
- `zh` - Chino

### Integración con i18next

El `LanguageContext` dispara eventos que el sistema de i18next escucha automáticamente:

```typescript
// El cambio de idioma se propaga automáticamente
// No necesitas hacer nada adicional

// Usar traducciones normalmente
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.welcome')}</h1>;
}
```

## 🛡️ Protección de Rutas

### PrivateRoute

Protege rutas que requieren autenticación.

```tsx
import { PrivateRoute } from '@shared/components/auth/PrivateRoute';

<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
```

### ProtectedRoute

Protege rutas basándose en roles específicos.

```tsx
import { ProtectedRoute } from '@shared/components/auth/ProtectedRoute';

// Requiere rol de usuario
<Route
  path="/products"
  element={
    <PrivateRoute>
      <ProtectedRoute requiredRoles={['USER']}>
        <Products />
      </ProtectedRoute>
    </PrivateRoute>
  }
/>

// Requiere rol de administrador
<Route
  path="/admin"
  element={
    <PrivateRoute>
      <ProtectedRoute 
        requiredRoles={['ADMIN']}
        fallbackPath="/dashboard"
        adminRole="MY_ADMIN_ROLE"
        userRole="MY_USER_ROLE"
      >
        <AdminPanel />
      </ProtectedRoute>
    </PrivateRoute>
  }
/>
```

#### Props de ProtectedRoute

- `requiredRoles`: Array de roles requeridos
- `fallbackPath`: Ruta de redirección si no tiene permisos (default: '/')
- `adminRole`: Nombre del rol de admin personalizado
- `userRole`: Nombre del rol de user personalizado

## 📡 Eventos del Portal

### Eventos de Idioma

```typescript
// El portal dispara estos eventos cuando cambia el idioma
window.addEventListener('portal-language-changed', (event) => {
  console.log('Nuevo idioma:', event.detail.language);
});

// También se puede recibir por postMessage
window.addEventListener('message', (event) => {
  if (event.data?.type === 'LANGUAGE_CHANGE') {
    console.log('Nuevo idioma:', event.data.language);
  }
});
```

### Eventos del Sidebar

```typescript
// Sidebar abierto
window.addEventListener('sidebar-opened', (event) => {
  console.log('Sidebar abierto');
});

// Sidebar cerrado
window.addEventListener('sidebar-closed', (event) => {
  console.log('Sidebar cerrado');
});
```

## 🔄 Flujo de Inicialización

```
1. App.tsx se monta
   ↓
2. Se cargan suscripciones al Global Store
   ↓
3. Se recibe token de autenticación
   ↓
4. Se decodifica token y se extraen roles
   ↓
5. Se recibe configuración (idioma, tenant)
   ↓
6. Se sincronizan en el store local
   ↓
7. Los componentes pueden acceder a:
   - Autenticación (isLogged, token)
   - Usuario (roles, email, name)
   - Tenant (bu, country)
   - Idioma (currentLanguage)
```

## 📝 Ejemplo Completo

```tsx
import React, { useEffect } from 'react';
import { useAppRoles } from '@shared/hooks/useAppRoles';
import { useTenantParams } from '@shared/hooks/useTenantParams';
import { useLanguageContext } from '@shared/context/LanguageContext';

function MyFeaturePage() {
  // Obtener datos del usuario y roles
  const { isAdmin, roles, auditStamp } = useAppRoles();
  
  // Obtener tenant y país
  const { bu, country, isReady } = useTenantParams();
  
  // Obtener idioma actual
  const { currentLanguage } = useLanguageContext();
  
  useEffect(() => {
    if (isReady) {
      // Cargar datos con los parámetros del portal
      fetchData(bu, country, currentLanguage);
    }
  }, [bu, country, currentLanguage, isReady]);
  
  const handleSave = async (data: any) => {
    // Incluir audit stamp en operaciones críticas
    const payload = {
      ...data,
      audit: auditStamp,
      bu,
      country
    };
    
    await saveData(payload);
  };
  
  return (
    <div>
      <h1>Mi Feature</h1>
      {isAdmin && <AdminControls />}
      {/* UI */}
    </div>
  );
}
```

## 🔧 Configuración en App.tsx

```tsx
import { useEffect } from 'react';
import {
  handleSubscribeToGlobalAuthenticationChange,
  handleSubscribeToGlobalLanguageChange,
  handleSubscribeToGlobalTenantAndCountryChange,
} from '@infrastructure/services/globalStateService';

function App() {
  useEffect(() => {
    // Suscribirse a cambios del portal
    const unsubAuth = handleSubscribeToGlobalAuthenticationChange();
    const unsubLang = handleSubscribeToGlobalLanguageChange();
    const unsubTenant = handleSubscribeToGlobalTenantAndCountryChange();

    return () => {
      unsubAuth?.();
      unsubLang?.();
      unsubTenant?.();
    };
  }, []);

  return (
    <LanguageProvider>
      {/* Resto de la app */}
    </LanguageProvider>
  );
}
```

## 🎯 Mejores Prácticas

### ✅ DO

1. **Siempre verificar isReady** antes de usar tenant params
2. **Incluir auditStamp** en operaciones críticas (create, update, delete)
3. **Usar hooks de integración** en lugar de acceder directamente al store
4. **Proteger rutas** con PrivateRoute y ProtectedRoute
5. **Escuchar eventos del portal** para sincronizar UI

### ❌ DON'T

1. No acceder directamente a `globalStore.getState()`
2. No hardcodear valores de tenant o país
3. No ignorar el estado de autenticación
4. No decodificar el token manualmente, usar `tokenUtils`
5. No crear tu propio sistema de roles, usar el del portal

## 🐛 Debugging

### Verificar conexión con el portal

```typescript
import globalStore from '@infrastructure/store/globalStore';

// Verificar que el global store está disponible
console.log('Global Store:', globalStore);

// Ver estado global actual
globalStore.SubscribeToGlobalState('debug', (state) => {
  console.log('Estado Global:', state);
});
```

### Verificar token

```typescript
import { useAppSelector } from '@infrastructure/store/hooks/useStore';
import { safeDecodeToken } from '@shared/utils/tokenUtils';

const token = useAppSelector(state => state.authentication.token);
const decoded = safeDecodeToken(token);
console.log('Token decodificado:', decoded);
```

### Verificar tenant

```typescript
const { bu, country, selectedTenant, isReady } = useTenantParams();
console.log('Tenant params:', { bu, country, selectedTenant, isReady });
```

---

Para más información sobre arquitectura limpia, ver [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md)
