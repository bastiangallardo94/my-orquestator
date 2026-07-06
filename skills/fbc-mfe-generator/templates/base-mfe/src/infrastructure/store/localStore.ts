import { configureStore, Store } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/rootReducer";
import { RootState } from "./types";

const persistConfig = {
    key: "maintainers-router-root",
    storage,
    whitelist: ["authentication", "config"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const localMaintainersStore: Store<RootState> = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(localMaintainersStore);
export default localMaintainersStore;