/**
 * Tenant Slice
 * Gestiona el estado del tenant y país seleccionado
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TenantShape {
    country?: { name?: string };
    commerce?: { name?: string };
    [key: string]: any;
}

export interface TenantState {
    selectedTenant: TenantShape;
}

const initialState: TenantState = {
    selectedTenant: { country: { name: "" }, commerce: { name: "" } },
};

const tenantSlice = createSlice({
    name: "tenant",
    initialState,
    reducers: {
        setTenantSelected: (state, action: PayloadAction<TenantShape>) => {
            state.selectedTenant = action.payload;
        },
    },
});

export const { setTenantSelected } = tenantSlice.actions;
export default tenantSlice.reducer;
