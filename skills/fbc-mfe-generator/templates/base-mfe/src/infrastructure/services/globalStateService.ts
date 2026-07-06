/**
 * Global State Service
 * Servicio para suscribirse a cambios del estado global compartido entre microfrontends
 */
import globalStore from "@infrastructure/store/globalStore";
import { logInAction } from "@infrastructure/store/reducers/slices/authenticationSlice";
import { languageChange } from "@infrastructure/store/reducers/slices/configSlice";
import { setTenantSelected } from "@infrastructure/store/reducers/slices/tenantSlice";
import { GlobalStoreState } from "@infrastructure/store/states/globalStoreState";
import localStore from "@infrastructure/store/store";

const APP_NAME = process.env.APP_NAME ?? "{{APP_NAME}}";

/**
 * Suscribe el store local a cambios de autenticación del store global
 *
 * FIX: Lee el estado actual del GlobalStore al momento de suscribirse
 * para evitar el problema de timing donde el token ya fue despachado
 * antes de que el MFE se monte y suscriba.
 *
 * Dos pasos:
 * 1. Lectura inmediata: cubre el caso donde el portal ya autenticó antes del mount del MFE
 * 2. Suscripción a cambios futuros: cubre login/logout mientras el MFE está montado
 */
export const handleSubscribeToGlobalAuthenticationChange = () => {
  // Paso 1: Leer estado actual inmediatamente al suscribirse
  try {
    const currentState = globalStore.GetGlobalState() as GlobalStoreState;
    if (
      currentState?.authentication?.token &&
      currentState.authentication.token !== localStore.getState().authentication.token
    ) {
      localStore.dispatch(logInAction(currentState.authentication));
    }
  } catch (e) {
      // silently ignore — non-critical startup condition
  }

  // Paso 2: Suscribirse a cambios futuros
  return globalStore.SubscribeToGlobalState(
    APP_NAME,
    ({ authentication }: GlobalStoreState) => {
      if (authentication.token !== localStore.getState().authentication.token) {
        localStore.dispatch(logInAction(authentication));
      }
    },
  );
};

/**
 * Suscribe el store local a cambios de idioma del store global
 */
export const handleSubscribeToGlobalLanguageChange = () => {
  return globalStore.SubscribeToGlobalState(
    APP_NAME,
    ({ configuration }: GlobalStoreState) => {
      if (configuration.language !== localStore.getState().config?.language) {
        localStore.dispatch(languageChange(configuration.language));
        try {
          const languageEvent = new CustomEvent("portal-language-changed", {
            bubbles: true,
            detail: { language: configuration.language },
          });
          window.dispatchEvent(languageEvent);
          console.info(`[i18n] Language change dispatched: ${configuration.language}`);
        } catch (error) {
          console.error("[i18n] Failed to dispatch language change event:", error);
        }
      }
    },
  );
};

/**
 * Suscribe el store local a cambios de tenant y país del store global
 */
export const handleSubscribeToGlobalTenantAndCountryChange = () => {
  return globalStore.SubscribeToGlobalState(
    APP_NAME,
    ({ configuration }: GlobalStoreState) => {
      const selectedTenant = configuration.selectedTenant;
      if (!selectedTenant || Object.keys(selectedTenant).length === 0) return;
      try {
        localStore.dispatch(setTenantSelected(selectedTenant));
      } catch (e) {
          // silently ignore — non-critical tenant sync
      }
    },
  );
};

/**
 * Suscribe el store local a cambios del sidebar del store global
 */
export const handleSubscribeToGlobalSidebarChange = () => {
  return globalStore.SubscribeToGlobalState(
    APP_NAME,
    ({ ui }: GlobalStoreState) => {
      if (typeof ui?.sidebarOpen !== "undefined") {
        const eventName = ui.sidebarOpen ? "sidebar-opened" : "sidebar-closed";
        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: { requestOpen: ui.sidebarOpen },
          }),
        );
      }
    },
  );
};
