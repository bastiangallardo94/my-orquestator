# Guía de Personalización de MUI Chip

## Ubicación de la configuración

Los colores de MuiChip están configurados en:
```
src/shared/components/ui/MuiTheme.tsx
```

## Colores configurados actualmente

Los siguientes colores están disponibles para los chips en dos variantes: **filled** (relleno) y **outlined** (con borde).

### Primary (Azul claro - FBC Ice Blue)
- **Filled Background**: `#0d9bd3` (fbc-ice-06)
- **Filled Hover**: `#0c8dc0` (fbc-ice-07)
- **Filled Text**: `#ffffff` (blanco)
- **Outlined Border**: `#0d9bd3`
- **Outlined Text**: `#0d9bd3`

### Secondary (Azul oscuro - FBC Blue)
- **Filled Background**: `#0c2941` (fbc-blue-06)
- **Filled Hover**: `#0b253b` (fbc-blue-07)
- **Filled Text**: `#ffffff` (blanco)
- **Outlined Border**: `#0c2941`
- **Outlined Text**: `#0c2941`

### Error (Rojo)
- **Filled Background**: `#721c24` (alert-secondary)
- **Filled Hover**: `#5c161d`
- **Filled Text**: `#ffffff` (blanco)
- **Outlined Border**: `#721c24`
- **Outlined Text**: `#721c24`

### Warning (Amarillo/Naranja)
- **Filled Background**: `#856404` (warning-secondary)
- **Filled Hover**: `#6a5003`
- **Filled Text**: `#ffffff` (blanco)
- **Outlined Border**: `#856404`
- **Outlined Text**: `#856404`

### Info (Azul información)
- **Filled Background**: `#075574` (info-secondary)
- **Filled Hover**: `#05445d`
- **Filled Text**: `#ffffff` (blanco)
- **Outlined Border**: `#075574`
- **Outlined Text**: `#075574`

### Success (Verde)
- **Filled Background**: `#186f07` (success-secondary)
- **Filled Hover**: `#135906`
- **Filled Text**: `#ffffff` (blanco)
- **Outlined Border**: `#186f07`
- **Outlined Text**: `#186f07`

## Cómo usar los chips

### Uso básico

```tsx
import { Chip } from '@mui/material';

// Chip filled (relleno) con color primary
<Chip label="Primary" color="primary" />

// Chip outlined (con borde) con color secondary
<Chip label="Secondary" color="secondary" variant="outlined" />
```

### Chip clickeable

```tsx
const handleClick = () => {
    console.log('Chip clicked');
};

<Chip label="Clickable" color="primary" onClick={handleClick} />
```

### Chip eliminable

```tsx
const handleDelete = () => {
    console.log('Chip deleted');
};

<Chip label="Deletable" color="error" onDelete={handleDelete} />
```

### Chip clickeable y eliminable

```tsx
<Chip 
    label="Click & Delete" 
    color="primary" 
    onClick={handleClick} 
    onDelete={handleDelete} 
/>
```

### Chip con ícono

```tsx
import FaceIcon from '@mui/icons-material/Face';

<Chip icon={<FaceIcon />} label="With Icon" color="primary" />
```

### Chip con avatar

```tsx
import { Avatar } from '@mui/material';

<Chip avatar={<Avatar>M</Avatar>} label="Avatar" color="primary" />
```

### Chip de diferentes tamaños

```tsx
// Chip pequeño
<Chip label="Small" color="primary" size="small" />

// Chip mediano (por defecto)
<Chip label="Medium" color="primary" />
```

### Chip como enlace

```tsx
<Chip 
    label="Link" 
    color="primary"
    component="a" 
    href="/path" 
    clickable 
/>
```

## Cómo editar los colores globalmente

### Opción 1: Modificar el tema (Recomendado)

Edita el archivo `src/shared/components/ui/MuiTheme.tsx`:

```tsx
MuiChip: {
    styleOverrides: {
        filled: {
            '&.MuiChip-colorPrimary': {
                backgroundColor: '#TU_COLOR_AQUI',
                color: '#ffffff',
                '&:hover': {
                    backgroundColor: '#TU_COLOR_HOVER_AQUI',
                },
            },
            // ... otros colores
        },
        outlined: {
            '&.MuiChip-colorPrimary': {
                borderColor: '#TU_COLOR_AQUI',
                color: '#TU_COLOR_AQUI',
                '&:hover': {
                    backgroundColor: 'rgba(TU_COLOR, 0.08)',
                },
            },
            // ... otros colores
        },
    },
},
```

### Opción 2: Personalización individual con sx prop

Para personalizar un chip específico sin afectar a los demás:

```tsx
<Chip 
    label="Custom" 
    sx={{
        backgroundColor: '#FF5722',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#E64A19',
        }
    }}
/>
```

## Variantes de Chip

### Filled (Relleno)
Es la variante por defecto. El chip tiene fondo de color y texto blanco.

```tsx
<Chip label="Filled" color="primary" />
// o explícitamente:
<Chip label="Filled" color="primary" variant="filled" />
```

### Outlined (Con borde)
El chip tiene borde de color y el texto del mismo color, sin fondo.

```tsx
<Chip label="Outlined" color="primary" variant="outlined" />
```

## Personalizaciones adicionales disponibles

### Cambiar tamaño del chip

```tsx
<Chip 
    label="Custom Size" 
    color="primary"
    sx={{
        fontSize: '1rem',
        height: '40px',
        '& .MuiChip-label': {
            padding: '0 20px',
        }
    }}
/>
```

### Chip con borde personalizado

```tsx
<Chip 
    label="Custom Border" 
    color="primary"
    variant="outlined"
    sx={{
        borderWidth: '2px',
        borderStyle: 'dashed',
    }}
/>
```

### Chip multilínea

```tsx
<Chip
    label="This is a multiline chip with long text"
    color="primary"
    sx={{
        height: 'auto',
        '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
        },
    }}
/>
```

### Personalizar ícono de borrar

```tsx
import DoneIcon from '@mui/icons-material/Done';

<Chip 
    label="Custom Delete" 
    color="primary"
    onDelete={handleDelete}
    deleteIcon={<DoneIcon />}
/>
```

### Cambiar color del ícono de borrar

Por defecto, el ícono de borrar tiene un color blanco semitransparente. Puedes cambiarlo en el tema:

```tsx
MuiChip: {
    styleOverrides: {
        deleteIcon: {
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)',
            },
        },
    },
},
```

## Ejemplos de uso práctico

### Sistema de Tags

```tsx
<Stack direction="row" spacing={1} flexWrap="wrap">
    <Chip label="React" color="info" size="small" />
    <Chip label="TypeScript" color="primary" size="small" />
    <Chip label="MUI" color="secondary" size="small" />
</Stack>
```

### Estados de tareas

```tsx
import DoneIcon from '@mui/icons-material/Done';

// Pendiente
<Chip label="Pending" color="warning" />

// En progreso
<Chip label="In Progress" color="info" />

// Completado
<Chip label="Completed" color="success" icon={<DoneIcon />} />

// Rechazado
<Chip label="Rejected" color="error" />
```

### Filtros seleccionables

```tsx
const [selected, setSelected] = useState(false);

<Chip
    label="Filter"
    color={selected ? "primary" : "default"}
    variant={selected ? "filled" : "outlined"}
    onClick={() => setSelected(!selected)}
/>
```

### Lista de selecciones eliminables

```tsx
const [chips, setChips] = useState(['Angular', 'jQuery', 'React']);

const handleDelete = (chipToDelete) => () => {
    setChips((chips) => chips.filter((chip) => chip !== chipToDelete));
};

<Stack direction="row" spacing={1}>
    {chips.map((chip) => (
        <Chip
            key={chip}
            label={chip}
            color="primary"
            onDelete={handleDelete(chip)}
        />
    ))}
</Stack>
```

## Agregar un nuevo color personalizado al tema

Si necesitas agregar una variante de color completamente nueva:

1. Define el color en la paleta del tema:

```tsx
palette: {
    // ... otros colores
    custom: {
        main: '#FF6B6B',
        contrastText: '#ffffff',
    },
},
```

2. Agrega los estilos para el chip filled y outlined:

```tsx
MuiChip: {
    styleOverrides: {
        filled: {
            '&.MuiChip-colorCustom': {
                backgroundColor: '#FF6B6B',
                color: '#ffffff',
                '&:hover': {
                    backgroundColor: '#EE5A52',
                },
            },
        },
        outlined: {
            '&.MuiChip-colorCustom': {
                borderColor: '#FF6B6B',
                color: '#FF6B6B',
                '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.08)',
                },
            },
        },
    },
},
```

3. Extiende los tipos de TypeScript (si usas TypeScript):

```tsx
declare module '@mui/material/Chip' {
    interface ChipPropsColorOverrides {
        custom: true;
    }
}
```

## Referencia de clases CSS

Puedes usar estas clases CSS para personalizaciones más específicas:

- `.MuiChip-root` - Elemento raíz
- `.MuiChip-label` - Texto del chip
- `.MuiChip-icon` - Ícono del chip
- `.MuiChip-avatar` - Avatar del chip
- `.MuiChip-deleteIcon` - Ícono de borrar
- `.MuiChip-filled` - Chip con variante filled
- `.MuiChip-outlined` - Chip con variante outlined
- `.MuiChip-colorPrimary` - Chip con color primary
- `.MuiChip-colorSecondary` - Chip con color secondary
- `.MuiChip-colorError` - Chip con color error
- `.MuiChip-colorWarning` - Chip con color warning
- `.MuiChip-colorInfo` - Chip con color info
- `.MuiChip-colorSuccess` - Chip con color success
- `.MuiChip-clickable` - Chip clickeable
- `.MuiChip-deletable` - Chip eliminable
- `.MuiChip-sizeSmall` - Chip pequeño
- `.MuiChip-sizeMedium` - Chip mediano
- `.Mui-disabled` - Chip deshabilitado
- `.Mui-focusVisible` - Chip con foco de teclado

## Accesibilidad

Los chips son componentes accesibles por defecto:

- Los chips clickeables son enfocables con teclado (Tab)
- Presionar `Enter` o `Espacio` activa el onClick
- Presionar `Backspace` o `Delete` cuando está enfocado llama al onDelete
- Presionar `Escape` cuando está enfocado quita el foco

Para mejorar la accesibilidad:

```tsx
<Chip 
    label="Accessible Chip"
    color="primary"
    onClick={handleClick}
    aria-label="Descriptive label for screen readers"
/>
```

## Ejemplos de uso

Ver el archivo de ejemplos completos en:
```
src/shared/components/ui/Chip/ChipExamples.tsx
```

## Recursos adicionales

- [Documentación oficial de MUI Chip](https://mui.com/material-ui/react-chip/)
- [API Reference de Chip](https://mui.com/material-ui/api/chip/)
- [Material Design - Chips](https://m2.material.io/components/chips)
- [Customización de tema en MUI](https://mui.com/material-ui/customization/theming/)
