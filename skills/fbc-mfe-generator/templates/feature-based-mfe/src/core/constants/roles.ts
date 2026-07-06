/**
 * User Roles Constants
 * Constantes centralizadas para roles de usuario
 * Facilita el mantenimiento y evita errores de tipeo
 */
export const USER_ROLES = {
    // Roles genéricos de usuario
    ADMIN: 'Admin',
    MAINTAINER: 'Maintainer',
    VIEWER: 'Viewer',
    // TODO: Agrega roles específicos de tu aplicación aquí
} as const;

/**
 * Type for user roles
 */
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Helper function to get all available roles
 */
export const getAllUserRoles = (): UserRole[] => {
    return Object.values(USER_ROLES);
};

/**
 * Helper function to check if a user has a specific role
 */
export const hasRole = (userRoles: string[], role: UserRole): boolean => {
    return userRoles.includes(role);
};

/**
 * Helper function to check if a user has any of the specified roles
 */
export const hasAnyRole = (userRoles: string[], roles: UserRole[]): boolean => {
    return roles.some(role => userRoles.includes(role));
};
