# Router Tests

## Tests Activos
- ✅ `EmptyState.test.tsx` - Tests del componente EmptyState (4/4 passing)

## Tests Deshabilitados
- ⏸️ `RouterPage.test.tsx.skip` - Test del componente RouterPage

### Por qué RouterPage.test está deshabilitado

El test de RouterPage está temporalmente deshabilitado porque:

1. **Module Federation Import**: El componente usa `import('importMaintainers/App')` que es un remote de Module Federation
2. **Complejidad de Mock**: Mockear imports dinámicos de Module Federation en Jest es extremadamente complejo
3. **Testing Alternativo**: La funcionalidad del Router se valida mejor con:
   - Tests E2E (Cypress/Playwright)
   - Testing manual en ambiente de desarrollo
   - Tests de integración con el MFE Forwarder corriendo

### Cómo testear el Router

**Desarrollo Local:**
```bash
# Terminal 1: MFE Forwarder
cd ~/Documents/Repositorios/mrch.frtr.frontend.maintainer-forwarders
yarn start  # Puerto 8501

# Terminal 2: MFE Router
cd ~/Documents/Repositorios/mrch.frtr.frontend.maintainers-router
yarn start  # Puerto 8500

# Navegador
http://localhost:8500/foreign-trade/maintainers/home
```

**Tests Manuales:**
1. Estado inicial: Ver empty state "Select an option"
2. Selector: Cambiar entre opciones
3. Forwarder: Verificar carga del MFE
4. Extraportuario: Ver placeholder "available soon"

### Ticket Futuro
Crear ticket para implementar tests E2E que validen:
- Selector funciona correctamente
- MFEs remotos se cargan sin errores
- Navegación entre estados funciona
- Integración completa Router ↔ MFE Forwarder

---

**Fecha:** 2026-02-06  
**Estado:** EmptyState tests passing (4/4) ✅

### Tests Manuales:
1. Estado inicial: Ver empty state "Select an option"
2. Selector: Cambiar entre opciones
3. Forwarder: Verificar carga del MFE
4. Extraportuario: Ver MFE Bonded Warehouse        ← era "placeholder available soon"
5. Documents: Ver guard de permisos (acceso / denegado)
6. HsCodes: Ver empty state "Coming soon"          ← nuevo
