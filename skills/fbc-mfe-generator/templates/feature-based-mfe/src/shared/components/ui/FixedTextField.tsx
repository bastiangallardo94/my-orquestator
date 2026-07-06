import { TextField, TextFieldProps } from '@mui/material';

type FixedWidth = 'search-form' | 'auto' | 'full';

interface FixedTextFieldProps extends Omit<TextFieldProps, 'width'> {
  /**
   * Ancho predefinido del TextField
   * - "search-form": 200px (para filtros de búsqueda)
   * - "auto": minWidth del tema (210px) - DEFAULT
   * - "full": 100% del contenedor
   */
  width?: FixedWidth;
}

/**
 * TextField con soporte para anchos predefinidos.
 * 
 * @example
 * // Ancho fijo para formularios de búsqueda (200px)
 * <FixedTextField width="search-form" label="PO Number" />
 * 
 * @example
 * // Ancho automático (minWidth del tema: 210px)
 * <FixedTextField label="Nombre" />
 * 
 * @example
 * // Ancho completo
 * <FixedTextField width="full" label="Descripción" />
 */
export const FixedTextField = ({ 
  width = 'auto',
  sx,
  ...props 
}: FixedTextFieldProps) => {
  const getWidth = () => {
    switch (width) {
      case 'search-form':
        return '200px';
      case 'full':
        return '100%';
      case 'auto':
      default:
        return undefined; // Usa minWidth del tema (210px)
    }
  };

  return (
    <TextField
      {...props}
      sx={{
        ...(getWidth() && { width: getWidth() }),
        ...sx,
      }}
    />
  );
};
