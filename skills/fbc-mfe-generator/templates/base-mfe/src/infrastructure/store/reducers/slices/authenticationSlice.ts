/**
 * Authentication Slice
 * Gestiona el estado de autenticación del usuario
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthTokenState {
    isLogged: boolean;
    token?: string;
}

//TODO: revisar el valor por defecto.
const initialState: AuthTokenState = {
    isLogged: false,
    token: undefined,
};

const authSlice = createSlice({
    name: "authentication",
    initialState,
    reducers: {
        logInAction: (state, { payload }: PayloadAction<{ token: string }>) => {
            state.isLogged = true;
            state.token = payload.token;
        },
        logOutAction: (state) => {
            state.isLogged = false;
            state.token = undefined;
        },
    },
});

export const { logInAction, logOutAction } = authSlice.actions;
export default authSlice.reducer;
