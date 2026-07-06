/**
 * Config Slice
 * Gestiona la configuración global de la aplicación
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigState {
    language: string;
}

const initialState: ConfigState = {
    language: "es",
};

const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        languageChange: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },
    },
});

export const { languageChange } = configSlice.actions;
export default configSlice.reducer;
