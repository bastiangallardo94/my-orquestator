/**
 * Store de Redux
 * Configuración del store local del microfrontend
 */

import { configureStore, Store } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/rootReducer";
import { RootState } from "./types";

const persistConfig = {
    key: "maintainers-router-root",
    storage,
    whitelist: ["authentication", "config"], // Solo persiste estos slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store: Store<RootState> = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignora acciones de redux-persist
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;
