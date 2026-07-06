import { MenuItemData } from './model/types';

/**
 * Construye un mapa de rutas a ancestros para navegación de menú
 * 
 * @description
 * Recorre recursivamente el árbol de menú y crea un mapa donde cada ruta
 * apunta al array de IDs de sus ancestros. Útil para expandir automáticamente
 * padres cuando se navega a una ruta profunda.
 * 
 * @param {MenuItemData[]} menu - Array de items del menú
 * @returns {Record<string, string[]>} Mapa de ruta -> array de IDs ancestros
 * 
 * @example
 * const menu = [{ id: 'parent', path: '/parent', children: [{ id: 'child', path: '/parent/child' }] }];
 * const ancestors = buildPathAncestors(menu);
 * // ancestors['/parent/child'] => ['parent']
 */
export function buildPathAncestors(menu: MenuItemData[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    function visit(item: MenuItemData, ancestors: string[]) {
        const newAncestors = [...ancestors, item.id];
        if (item.path) {
            result[item.path] = ancestors;
        }
        if (item.children) {
            item.children.forEach(child => visit(child, newAncestors));
        }
    }

    menu.forEach(item => visit(item, []));
    return result;
}

/**
 * Verifica si un item del menú es ancestro de la ruta actual
 * 
 * @description
 * Determina si un item del menú debe marcarse como activo porque
 * uno de sus hijos está en la ruta actual. Usado para resaltar
 * secciones padre cuando una página hija está activa.
 * 
 * @param {MenuItemData} item - Item del menú a verificar
 * @param {string} currentPath - Ruta actual de la aplicación
 * @param {Record<string, string[]>} pathAncestors - Mapa de rutas a ancestros
 * @returns {boolean} true si el item es ancestro de la ruta actual
 * 
 * @example
 * const isActive = isAncestorActive(menuItem, '/parent/child', pathAncestorsMap);
 * // true si menuItem.id está en los ancestros de '/parent/child'
 */
export function isAncestorActive(
    item: MenuItemData,
    currentPath: string,
    pathAncestors: Record<string, string[]>
): boolean {
    const ancestors = pathAncestors[currentPath];
    return ancestors ? ancestors.includes(item.id) : false;
}
