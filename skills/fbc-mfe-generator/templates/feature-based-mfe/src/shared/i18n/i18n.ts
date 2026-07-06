/**
 * i18n Configuration
 * Configuración de internacionalización con archivos de traducción separados
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar traducciones desde archivos TypeScript
import translationES from './locales/es/translation';
import translationEN from './locales/en/translation';
import translationZH from './locales/zh/translation';

/**
 * Obtener el lenguaje actual del localStorage o usar inglés por defecto
 */
const getCurrentLanguage = (): string => {
    try {
        const storedLanguage = localStorage.getItem('portal-language');
        if (storedLanguage) {
            return storedLanguage;
        }
        return 'EN';
    } catch (error) {
        console.error('[mf-template] Could not access localStorage, using default EN', error);
        return 'EN';
    }
};

const currentLanguage = getCurrentLanguage();

// Recursos de traducción organizados por idioma
const resources = {
    ES: {
        translation: translationES
    },
    EN: {
        translation: translationEN
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

        // Escuchar cambios de idioma desde el portal global
        window.addEventListener('portal-language-changed', ((event: CustomEvent) => {
            const newLanguage = event.detail?.language;
            if (newLanguage && newLanguage !== i18n.language) {
                i18n.changeLanguage(newLanguage)
                    .then(() => {
                        localStorage.setItem('portal-language', newLanguage);
                    })
                    .catch((error) => {
                        console.error(`❌ [mf-template] Error changing language:`, error);
                    });
            }
        }) as EventListener);

    })
    .catch((error) => {
        console.error('❌ [mf-template] Error initializing i18n:', error);
    });

export default i18n;
