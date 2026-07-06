/**
 * Menu Data
 * Configuración del menú del microfrontend con soporte de i18n
 */

import { ENV } from '../../constants/environment.config';
import { USER_ROLES } from '@core/constants/roles';
import i18n from '../i18n/i18n';
import { MenuItemData } from "./model/types";

/**
 * Función para obtener los datos del menú completo (sin filtros)
 * Se llama cada vez que se renderiza el menú para obtener traducciones actualizadas
 */
export const getMenuData = (): MenuItemData[] => [
    {
        id: 'mf-template',
        label: ENV.COMPACT_MENU_LABEL,
        icon: 'settings',
        children: [
            {
                id: 'mf-template-home',
                label: i18n.t('menuData.home'),
                path: `${ENV.APP_PATH}/home`
                // Sin meta.requiredRoles = disponible para todos
            },
        ]
    }
];

/**
 * Filtra el menú según los roles del usuario
 * @param userRoles - Array de roles del usuario (ej: ['PROVISIONES_CORP_USER'])
 * @returns MenuItemData[] - Menú filtrado mostrando solo items permitidos
 * 
 * @example
 * // Usuario con rol USER
 * const roles = ['PROVISIONES_CORP_USER'];
 * const menu = getMenuDataByRoles(roles);
 * // Resultado: Solo verá Home, Example, About
 * 
 * @example
 * // Usuario con rol ADMIN
 * const roles = ['PROVISIONES_CORP_ADMIN'];
 * const menu = getMenuDataByRoles(roles);
 * // Resultado: Verá todas las opciones incluyendo Admin Panel
 */
export const getMenuDataByRoles = (userRoles: string[]): MenuItemData[] => {
    const allMenu = getMenuData();

    // Si no hay roles, no mostrar nada
    if (!userRoles || userRoles.length === 0) {
        return [];
    }

    // Normalizar roles a uppercase para comparación
    const normalizedUserRoles = userRoles.map(r => r.toUpperCase());

    // Función para verificar si el usuario tiene acceso a un item
    const hasAccess = (item: MenuItemData): boolean => {
        // Si no tiene meta.requiredRoles definido, está disponible para todos
        if (!item.meta?.requiredRoles || item.meta.requiredRoles.length === 0) {
            return true;
        }

        // Verificar si el usuario tiene al menos uno de los roles requeridos
        return item.meta.requiredRoles.some((requiredRole: string) =>
            normalizedUserRoles.includes(requiredRole.toUpperCase())
        );
    };

    // Filtrar menú recursivamente
    const filterMenu = (items: MenuItemData[]): MenuItemData[] => {
        return items
            .filter(hasAccess)
            .map(item => ({
                ...item,
                children: item.children ? filterMenu(item.children) : undefined
            }))
            .filter(item => !item.children || item.children.length > 0); // Remover padres sin hijos
    };

    return filterMenu(allMenu);
};

