import { FormControl, FormControlProps } from '@mui/material';

type FixedWidth = 'search-form' | 'auto' | 'full';

interface FixedFormControlProps extends Omit<FormControlProps, 'width'> {
  /**
   * Ancho predefinido del FormControl
   * - "search-form": 200px (para filtros de búsqueda)
   * - "auto": sin ancho fijo
   * - "full": 100% del contenedor
   */
  width?: FixedWidth;
  children: React.ReactNode;
}

/**
 * FormControl con soporte para anchos predefinidos.
 * 
 * @example
 * <FixedFormControl width="search-form">
 *   <InputLabel>País</InputLabel>
 *   <Select>...</Select>
 * </FixedFormControl>
 */
export const FixedFormControl = ({
  width = 'auto',
  sx,
  children,
  ...props
}: FixedFormControlProps) => {
  const getWidth = () => {
    switch (width) {
      case 'search-form':
        return 200;
      case 'full':
        return '100%';
      case 'auto':
      default:
        return undefined;
    }
  };

  return (
    <FormControl
      {...props}
      sx={{
        ...(getWidth() && { width: getWidth() }),
        ...sx,
      }}
    >
      {children}
    </FormControl>
  );
};
