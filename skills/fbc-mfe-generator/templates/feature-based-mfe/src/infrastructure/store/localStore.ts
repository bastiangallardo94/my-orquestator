import { configureStore, Store } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/rootReducer";
import { RootState } from "./types";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["authentication", "config", "inspection", "purchaseOrder", "inspector"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const localInspectionStore: Store<RootState> = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: true,
});

export const persistor = persistStore(localInspectionStore);

export default localInspectionStore;
