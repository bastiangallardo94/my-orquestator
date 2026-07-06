/**
 * Global Store
 * Instancia del store global compartido entre microfrontends
 */

import { GlobalStore, IGlobalStore } from "redux-micro-frontend";

const STORE_DEBUG = process.env.NODE_ENV === 'development';

let globalStore: IGlobalStore;
globalStore = GlobalStore.Get(STORE_DEBUG);

export default globalStore;
