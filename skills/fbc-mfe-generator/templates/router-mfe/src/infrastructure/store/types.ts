/**
 * Types del Store
 */

import type { Store } from "@reduxjs/toolkit";
import type rootReducer from "./reducers/rootReducer";

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = Store<RootState>;
export type AppDispatch = AppStore["dispatch"];
