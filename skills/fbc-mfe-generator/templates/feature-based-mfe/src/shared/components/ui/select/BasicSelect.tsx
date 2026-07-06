import { FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

type FixedWidth = 'search-form' | 'auto' | 'full';

export interface BasicSelectProps<T> {
  label: string;
  selectedValue?: string;
  options: T[];
  optionLabel: string;
  optionKey: string;
  onChange: (itemKey: string) => void;
  error?: boolean;
  disabled?: boolean;
  disabledOptions?: string[];
  /**
   * Ancho predefinido del Select
   * - "search-form": 200px (para filtros de búsqueda)
   * - "auto": 210px (default actual)
   * - "full": 100% del contenedor
   */
  width?: FixedWidth;
}

export function BasicSelect<T extends Record<string, any>>({
  label,
  selectedValue,
  options,
  optionLabel,
  optionKey,
  onChange,
  error = false,
  disabled = false,
  disabledOptions = [],
  width = 'auto',
}: BasicSelectProps<T>) {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = React.useState<string>();

  const getWidth = (widthProp: FixedWidth): number | string => {
    switch (widthProp) {
      case 'search-form':
        return 200;
      case 'full':
        return '100%';
      case 'auto':
      default:
        return 210; // Valor actual default
    }
  };

  React.useEffect(() => {
    if (selectedValue) {
      setSelectedItem(selectedValue);
    }
  }, [selectedValue]);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedItemID = event.target.value as string;
    setSelectedItem(selectedItemID);
    onChange(selectedItemID);
  };

  return (
    <Box>
      <FormControl
        sx={{
          width: getWidth(width),
          "& .MuiInputLabel-root": {
            color: "#333333",
            fontFamily: "Lato, sans-serif",
            fontSize: "16px",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#333333 !important",
          },
        }}
      >
        <InputLabel id="simple-select-label">{label}</InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={selectedItem ?? ''}
          label={label}
          onChange={handleChange}
          error={error}
          disabled={disabled}
        >
          {options.map((option, key) => {
            const value = option[optionKey];
            const isDisabled = disabledOptions.includes(value.toString());
            return (
              <MenuItem key={key} value={value} disabled={isDisabled}>
                {option[optionLabel]}
              </MenuItem>
            );
          })}
        </Select>
        {error && (
          <FormHelperText style={{ color: '#f44336' }}>
            {t('errors.required') || 'This field is required.'}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
}
