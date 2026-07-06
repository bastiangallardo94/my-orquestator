# Internacionalización (i18n)

La carpeta src/shared/i18n contiene toda la configuración y archivos de traducción del microfrontend.

## 📁 Estructura

```
src/shared/i18n/
├── i18n.ts                    # Configuración principal de i18next
├── locales/                   # Traducciones por idioma
│   ├── es/                   # Español
│   │   └── translation.json
│   ├── en/                   # Inglés
│   │   └── translation.json
│   └── zh/                   # Chino
│       └── translation.json
└── README.md                  # Este archivo
```

## 🌐 Idiomas Soportados

- **Español (es)** - Idioma por defecto
- **Inglés (en)**
- **Chino (zh)**

## 📝 Formato de Archivos de Traducción

Cada archivo `translation.json` sigue la siguiente estructura:

```json
{
  "common": {
    "loading": "...",
    "error": "...",
    "save": "..."
  },
  "errors": {
    "generic": "...",
    "network": "..."
  },
  "example": {
    "title": "...",
    "description": "..."
  },
  "auth": {
    "login": "...",
    "logout": "..."
  },
  "portal": {
    "tenant": "...",
    "country": "..."
  }
}
```

## 🔑 Categorías de Traducciones

### `common`
Traducciones comunes usadas en toda la aplicación:
- Botones (guardar, cancelar, editar, etc.)
- Estados (cargando, éxito, error)
- Acciones (buscar, filtrar, exportar)

### `errors`
Mensajes de error:
- Errores genéricos
- Errores de red
- Errores de autorización
- Errores de validación

### `example`
Traducciones del feature de ejemplo:
- Títulos y descripciones
- Mensajes específicos del feature

### `auth`
Traducciones relacionadas con autenticación:
- Login/Logout
- Mensajes de acceso denegado
- Roles de usuario

### `portal`
Traducciones de integración con el portal:
- Tenant y país
- Idioma
- Estados de carga

## 🎯 Uso en Componentes

### Uso básico

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('example.title')}</h1>
      <p>{t('example.description')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Con variables

```tsx
// En translation.json
{
  "greeting": "Hola {{name}}, bienvenido"
}

// En el componente
<p>{t('greeting', { name: 'Juan' })}</p>
// Resultado: "Hola Juan, bienvenido"
```

### Con pluralización

```tsx
// En translation.json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}

// En el componente
<p>{t('items', { count: 1 })}</p>  // "1 item"
<p>{t('items', { count: 5 })}</p>  // "5 items"
```

### Cambiar idioma manualmente

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();
  
  return (
    <div>
      <button onClick={() => i18n.changeLanguage('es')}>Español</button>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('zh')}>中文</button>
    </div>
  );
}
```

## 🔄 Sincronización con el Portal

El idioma se sincroniza automáticamente con el portal a través de i18next:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  // i18n.language se actualiza automáticamente cuando el portal cambia el idioma
  console.log('Idioma actual:', i18n.language);
}
```

## ➕ Agregar Nuevas Traducciones

### 1. Agregar claves en todos los idiomas

**es/translation.json:**
```json
{
  "myFeature": {
    "title": "Mi Nueva Funcionalidad",
    "save": "Guardar cambios"
  }
}
```

**en/translation.json:**
```json
{
  "myFeature": {
    "title": "My New Feature",
    "save": "Save changes"
  }
}
```

**zh/translation.json:**
```json
{
  "myFeature": {
    "title": "我的新功能",
    "save": "保存更改"
  }
}
```

### 2. Usar en el componente

```tsx
function MyFeature() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <button>{t('myFeature.save')}</button>
    </div>
  );
}
```

## 🔍 Traducciones Anidadas

Puedes crear estructuras más profundas:

```json
{
  "products": {
    "categories": {
      "electronics": "Electrónica",
      "clothing": "Ropa"
    },
    "actions": {
      "addToCart": "Agregar al carrito",
      "removeFromCart": "Quitar del carrito"
    }
  }
}
```

Uso:
```tsx
{t('products.categories.electronics')}
{t('products.actions.addToCart')}
```

## ⚠️ Mejores Prácticas

### ✅ DO

1. **Mantener consistencia** entre idiomas (mismas claves)
2. **Usar namespaces descriptivos** (common, errors, auth, etc.)
3. **Agregar contexto** en las claves (ej: `button.save` vs solo `save`)
4. **Testear en todos los idiomas** antes de hacer commit
5. **Usar variables** para textos dinámicos: `{t('greeting', { name })}`

### ❌ DON'T

1. No hardcodear textos en componentes
2. No duplicar claves en diferentes namespaces
3. No mezclar idiomas en un mismo archivo
4. No olvidar agregar traducciones en todos los idiomas
5. No usar caracteres especiales sin escapar

## 🔧 Configuración Avanzada

### Agregar nuevo idioma

1. Crear carpeta en `locales/` (ej: `pt/`)
2. Crear `translation.json` con todas las claves
3. Importar en `i18n.ts`:

```typescript
import translationPT from './locales/pt/translation.json';

const resources = {
  // ... otros idiomas
  pt: {
    translation: translationPT
  },
};
```

4. Actualizar `LanguageContext.tsx` para incluir el nuevo idioma

### Separar traducciones por feature

Si un feature tiene muchas traducciones, puedes crear archivos adicionales:

```
locales/
├── es/
│   ├── translation.json       # Traducciones comunes
│   ├── myFeature.json         # Traducciones del feature
│   └── anotherFeature.json
```

Luego importar en `i18n.ts`:
```typescript
import translationES from './locales/es/translation.json';
import myFeatureES from './locales/es/myFeature.json';

const resources = {
  es: {
    translation: translationES,
    myFeature: myFeatureES,
  },
};
```

Usar con namespace:
```tsx
const { t } = useTranslation('myFeature');
{t('title')}
```

## 📚 Recursos

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Pluralization Rules](https://www.i18next.com/translation-function/plurals)
- [Formatting](https://www.i18next.com/translation-function/formatting)
