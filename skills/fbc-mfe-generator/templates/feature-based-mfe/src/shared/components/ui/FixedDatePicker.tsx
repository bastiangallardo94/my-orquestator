import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

type FixedWidth = 'search-form' | 'auto' | 'full';

interface FixedDatePickerProps extends Omit<DatePickerProps<Dayjs>, 'width'> {
  /**
   * Ancho predefinido del DatePicker
   * - "search-form": 200px (para filtros de búsqueda)
   * - "auto": minWidth del tema (210px) - DEFAULT
   * - "full": 100% del contenedor
   */
  width?: FixedWidth;
}

/**
 * DatePicker con soporte para anchos predefinidos.
 * 
 * @example
 * // Ancho fijo para formularios de búsqueda (200px)
 * <FixedDatePicker width="search-form" label="Cargo Ready Date" />
 * 
 * @example
 * // Ancho completo
 * <FixedDatePicker width="full" label="Fecha" />
 */
export const FixedDatePicker = ({
  width = 'auto',
  sx,
  ...props
}: FixedDatePickerProps) => {
  const getWidth = () => {
    switch (width) {
      case 'search-form':
        return 200;
      case 'full':
        return 1; // En MUI sx, 1 = 100%
      case 'auto':
      default:
        return undefined; // Usa minWidth del tema
    }
  };

  return (
    <DatePicker
      {...props}
      sx={{
        ...(getWidth() && { width: getWidth() }),
        ...sx,
      }}
    />
  );
};
