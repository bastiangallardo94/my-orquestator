/**
 * Global State Service
 * Servicio para suscribirse a cambios del estado global compartido entre microfrontends
 */

import globalStore from '@infrastructure/store/globalStore';
import { logInAction } from '@infrastructure/store/reducers/slices/authenticationSlice';
import { languageChange } from '@infrastructure/store/reducers/slices/configSlice';
import { setTenantSelected } from '@infrastructure/store/reducers/slices/tenantSlice';
import { GlobalStoreState } from '@infrastructure/store/states/globalStoreState';
import localStore from '@infrastructure/store/store';

const APP_NAME = process.env.APP_NAME ?? 'importInspection';

/**
 * Suscribe el store local a cambios de autenticación del store global
 */
export const handleSubscribeToGlobalAuthenticationChange = () => {
    return globalStore.SubscribeToGlobalState(
        APP_NAME,
        ({ authentication }: GlobalStoreState) => {
            if (
                authentication.token !==
                localStore.getState().authentication.token
            ) {
                localStore.dispatch(logInAction(authentication));
            }
        }
    );
};

/**
 * Suscribe el store local a cambios de idioma del store global
 */
export const handleSubscribeToGlobalLanguageChange = () => {
    return globalStore.SubscribeToGlobalState(
        APP_NAME,
        ({ configuration }: GlobalStoreState) => {
            if (
                configuration.language !==
                localStore.getState().config?.language
            ) {
                localStore.dispatch(languageChange(configuration.language));

                // Disparar evento personalizado para el sistema de i18n
                try {
                    const languageEvent = new CustomEvent('portal-language-changed', {
                        bubbles: true,
                        detail: { language: configuration.language }
                    });
                    window.dispatchEvent(languageEvent);
                    console.info(`[i18n] Language change dispatched: ${configuration.language}`);
                } catch (error) {
                    console.error('[i18n] Failed to dispatch language change event:', error);
                }
            }
        }
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
                // Sincronizar el tenant seleccionado en el store local del MFE
                localStore.dispatch(setTenantSelected(selectedTenant));
            } catch (e) {
                // silently ignore — tenant sync failure is non-critical
            }
        }
    );
};

/**
 * Suscribe el store local a cambios del sidebar del store global
 */
export const handleSubscribeToGlobalSidebarChange = () => {
    return globalStore.SubscribeToGlobalState(
        APP_NAME,
        ({ ui }: GlobalStoreState) => {
            // Suponiendo que el estado global tiene una propiedad ui.sidebarOpen
            if (typeof ui?.sidebarOpen !== 'undefined') {
                const eventName = ui.sidebarOpen ? 'sidebar-opened' : 'sidebar-closed';
                window.dispatchEvent(new CustomEvent(eventName, { detail: { requestOpen: ui.sidebarOpen } }));
            }
        }
    );
};
