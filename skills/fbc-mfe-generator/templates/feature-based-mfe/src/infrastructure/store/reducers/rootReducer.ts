/**
 * Root Reducer
 * Combina todos los reducers de la aplicación
 */

import { combineReducers } from "@reduxjs/toolkit";
import authenticationReducer from "./slices/authenticationSlice";
import configReducer from "./slices/configSlice";
import tenantReducer from "./slices/tenantSlice";

const rootReducer = combineReducers({
    authentication: authenticationReducer,
    config: configReducer,
    tenant: tenantReducer,
    // TODO: Agrega aquí más reducers según necesites
});

export default rootReducer;
