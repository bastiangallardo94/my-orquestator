# 🌐 Sistema de Internacionalización (i18n) - Arquitectura Modular

Esta carpeta contiene toda la configuración y archivos de traducción del microfrontend, organizados en una estructura modular y escalable.

## 📁 Estructura de Directorios

```
src/shared/i18n/
├── i18n.ts                          # Configuración principal de i18n
├── README.md                         # Documentación
└── locales/
    ├── es/                          # Español
    │   ├── index.ts                 # Agregador de traducciones ES
    │   └── modules/
    │       ├── common.ts            # Traducciones comunes
    │       └── forwarder.ts         # Traducciones feature forwarder
    ├── en/                          # English
    │   ├── index.ts                 # Aggregator EN
    │   └── modules/
    │       ├── common.ts            # Common translations
    │       └── forwarder.ts         # Forwarder feature translations
    └── zh/                          # 中文
        ├── index.ts                 # 聚合器 ZH
        └── modules/
            ├── common.ts            # 通用翻译
            └── forwarder.ts         # 货代功能翻译
```

## 🌐 Idiomas Soportados

- **Español (es)** - Idioma por defecto
- **Inglés (en)**
- **Chino (zh)**

## � Componentes Principales

### 1. **Módulo Common** (`modules/common.ts`)
Contiene palabras y frases reutilizables en toda la aplicación:
- Acciones: Save, Cancel, Delete, Edit, etc.
- Mensajes: Loading, Error, Success
- Navegación: Back, Next, Previous
- Estados: Available, Not Available, etc.

```typescript
// Uso en componentes
const { t } = useTranslation();
t('common.loading')  // "Cargando..."
t('common.save')     // "Guardar"
```

### 2. **Módulo Forwarder** (`modules/forwarder.ts`)
Agrupa todas las traducciones específicas del feature forwarder:
- **Errors**: Mensajes de error
- **Auth**: Autenticación y permisos
- **Portal**: Configuración del portal
- **Forwarder Config**: Configuración de forwarder
- **Scheduling**: Agendamiento de inspecciones
- **Maintainer**: Resultado de inspecciones
- **Setup Maintainer**: Preparación de inspecciones

```typescript
// Uso en componentes
t('forwarder_config.newConfigTitle')  // "Carga de asignación de configuraciones"
t('forwarder_filters.pol')            // "POL"
t('scheduling.title')                 // "Agendamiento de Inspecciones"
```

### 3. **Archivo Index** (`index.ts`)
Agregador de todos los módulos que exporta un objeto único con todas las traducciones:
```typescript
// Estructura plana para fácil acceso
export default {
  common: { ... },
  errors: { ... },
  auth: { ... },
  forwarder_config: { ... },
  scheduling: { ... },
  // ...
}
```

## 🎯 Uso en Componentes

### Uso básico

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <button>{t('common.save')}</button>
      <p>{t('forwarder_config.newConfigDesc')}</p>
    </div>
  );
}
```

### Con variables

```tsx
// En el módulo
{
  greeting: "Hola {{name}}, bienvenido"
}

// En el componente
<p>{t('greeting', { name: 'Juan' })}</p>
// Resultado: "Hola Juan, bienvenido"
```

### Cambiar idioma

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

## ➕ Cómo Agregar Nuevas Traducciones

### Opción A: Agregar a un módulo existente

1. Edita el archivo del módulo en los 3 idiomas:
   - `locales/es/modules/forwarder.ts`
   - `locales/en/modules/forwarder.ts`
   - `locales/zh/modules/forwarder.ts`

2. Agrega tu traducción en la estructura correspondiente
3. ¡Los archivos `index.ts` ya los exportan automáticamente!

### Opción B: Crear un nuevo módulo

1. Crea `modules/newFeature.ts` en cada idioma (es, en, zh)
2. Define tu estructura:

**es/modules/newFeature.ts**:
```typescript
export default {
  section1: {
    title: "Mi Funcionalidad",
    description: "Descripción",
  },
  section2: {
    button: "Botón",
  }
}
```

3. Actualiza los `index.ts` en cada idioma:
```typescript
import newFeature from './modules/newFeature';

export default {
  // ... otros módulos
  newFeature_section1: newFeature.section1,
  newFeature_section2: newFeature.section2,
};
```

4. Usa en componentes:
```tsx
t('newFeature_section1.title')
```

## ⚠️ Mejores Prácticas

### ✅ DO

1. **Mantener consistencia** entre idiomas (mismas claves)
2. **Organizar por módulos** (uno por feature)
3. **Usar nombres descriptivos** para las claves
4. **Agregar comentarios** sobre la sección
5. **Testear en todos los idiomas** antes de hacer commit
6. **Separación de responsabilidades** - cada módulo sus traducciones

### ❌ DON'T

1. ❌ No hardcodear textos en componentes
2. ❌ No mezclar múltiples features en un mismo módulo
3. ❌ No duplicar traducciones en varios módulos
4. ❌ No olvidar traducir a los 3 idiomas
5. ❌ No modificar directamente archivos `index.ts` (son agregadores)

## 🔄 Sincronización con el Portal

El idioma se sincroniza automáticamente escuchando eventos globales:

```typescript
// En i18n.ts (ya implementado)
window.addEventListener('portal-language-changed', (event) => {
  const newLanguage = event.detail?.language;
  i18n.changeLanguage(newLanguage);
});
```

## ✅ Checklist para Mantenimiento

- [ ] Traducción disponible en 3 idiomas (ES, EN, ZH)
- [ ] Claves nombradas descriptivamente
- [ ] Organizado en módulos por feature
- [ ] Comentarios explicativos en el archivo
- [ ] Index actualizado con nuevas traducciones
- [ ] Probado el cambio de idioma
- [ ] Sin caracteres especiales sin escapar

## 🚀 Ventajas de Esta Estructura

✨ **Escalabilidad**: Fácil agregar nuevos idiomas o features
🔧 **Mantenibilidad**: Cada módulo es responsable de sus propias traducciones
♻️ **Reutilización**: Traducciones comunes en un lugar centralizado
📖 **Claridad**: Estructura jerárquica y nombres descriptivos
👥 **Colaboración**: Múltiples equipos pueden trabajar en paralelo
⚡ **Performance**: Importaciones optimizadas por módulo

---

**Última actualización**: 19 de enero de 2026
**Versión**: 2.0 - Arquitectura Modular

## 📚 Recursos

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Pluralization Rules](https://www.i18next.com/translation-function/plurals)
- [Formatting](https://www.i18next.com/translation-function/formatting)
