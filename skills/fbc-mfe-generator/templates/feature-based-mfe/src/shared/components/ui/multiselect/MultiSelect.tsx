import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import './MultiSelect.scss';

export interface MultiSelectProps<T> {
    label: string;
    selectedValues?: string[];
    options: T[];
    optionLabel: string;
    optionKey: string;
    disabled?: boolean;
    // eslint-disable-next-line no-unused-vars
    onChange: (selected: boolean, item: T) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 210,
    },
  },
};

export function MultiSelect<T extends Record<string, any>>({
  label,
  selectedValues = [],
  options,
  optionLabel,
  optionKey,
  disabled,
  onChange,
}: MultiSelectProps<T>) {

  const handleChange = (event: SelectChangeEvent<any[]>) => {
    const newValues = (event.target.value as string[]).map(v => v.toString());
    const prevValues = selectedValues.map(v => v.toString());

    // Added items
    newValues
      .filter(v => !prevValues.includes(v))
      .forEach(added => {
        const item = options.find(o => o[optionKey].toString() === added);
        if (item) onChange(true, item);
      });

    // Removed items
    prevValues
      .filter(v => !newValues.includes(v))
      .forEach(removed => {
        const item = options.find(o => o[optionKey].toString() === removed);
        if (item) onChange(false, item);
      });
  };

  return (
    <FormControl sx={{
                width: 210,
                "& .MuiInputLabel-root": {
                    color: "#333333",
                    fontFamily: "Lato, sans-serif",
                    fontSize: "16px",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#333333 !important", // force override
                },
            }}
            >
      <InputLabel id="multi-select-label">{label}</InputLabel>

      <Select
        multiple
        value={selectedValues.map(v => v.toString())}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        disabled={disabled}
        MenuProps={MenuProps}
        labelId='multi-select-label'
        renderValue={(selected) =>
          selected
            .map(v => options.find(o => o[optionKey].toString() === v)?.[optionLabel])
            .join(", ")
        }
            sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#C2C2C2", // idle
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#C2C2C2", // hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#333333 !important", // focused
                    borderWidth: "2px"
                },
            }}
      >
        {options.map(option => {
          const key = option[optionKey].toString();
          return (
            <MenuItem key={key} value={key}>
              <Checkbox checked={selectedValues.includes(key)} />
              <ListItemText primary={option[optionLabel]} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
