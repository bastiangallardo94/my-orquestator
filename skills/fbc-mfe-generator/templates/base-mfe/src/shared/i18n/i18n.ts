/**
 * i18n Configuration
 * Configuración de internacionalización con archivos de traducción separados
 */

import globalMaintainerStore from '@infrastructure/store/globalStore';
import { GlobalStoreState } from '@infrastructure/store/states/globalStoreState';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Importar traducciones agregadas desde los índices de módulos
import translationEN from './locales/en';
import translationES from './locales/es';
import translationZH from './locales/zh';

/**
 * Obtener el lenguaje actual del global store o window.localStorage
 */
const getCurrentLanguage = (): string => {
    try {
        // Intentar obtener del global store primero
        const globalLanguage = globalMaintainerStore.GetGlobalState().configuration?.language;
        if (globalLanguage) {
            return globalLanguage;
        }

        // Si no, del window.localStorage
        const storedLanguage = window.localStorage.getItem('portal-language');
        if (storedLanguage) {
            return storedLanguage;
        }

        return 'EN';
    } catch (error) {
        console.error('[{{CSS_PREFIX}}] Could not get language, using default EN', error);
        return 'EN';
    }
};

const currentLanguage = getCurrentLanguage();

// Recursos de traducción organizados por idioma (usando EN, ES, CN en mayúsculas como envía el portal)
const resources = {
    EN: {
        translation: translationEN
    },
    ES: {
        translation: translationES
    },
    CN: {
        translation: translationZH
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: currentLanguage,
        fallbackLng: {
            default: ['EN'],
        },
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
        returnObjects: true,
    })
    .then(() => {

        // Suscribirse a cambios de idioma del global store
        globalMaintainerStore.SubscribeToGlobalState(
            '{{APP_NAME}}',
            ({ configuration }: GlobalStoreState) => {
                if (configuration.language && configuration.language !== i18n.language) {
                    i18n.changeLanguage(configuration.language)
                        .then(() => {
                            window.localStorage.setItem('portal-language', configuration.language);
                        })
                        .catch((error) => {
                            console.error(`❌ [{{CSS_PREFIX}}] Error changing language:`, error);
                        });
                }
            }
        );
    })
    .catch((error) => {
        console.error('❌ [{{CSS_PREFIX}}] Error initializing i18n:', error);
    });

export default i18n;
