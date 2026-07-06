/**
 * User Roles Constants
 * Constantes centralizadas para roles de usuario
 * Facilita el mantenimiento y evita errores de tipeo
 */
export const USER_ROLES = {
    // Roles de usuario disponibles
    VIEW: 'View Inspection',
    // EXECUTE_INSPECTION permite al usuario cambiar el status de una inspección
    // y adjuntar toda la información requerida.
    EXECUTE_INSPECTION: 'View Inspection Execution',
    VIEW_INSPECTION_COORDINATION: 'View inspection coordination',
    // REVIEW_INSPECTION permite al usuario mover una Inspección que se encuentra ON HOLD
    // a un estado terminal (APPROVED, APPROVED WITH OBS, REJECTED).
    REVIEW_INSPECTION: 'View Inspection Review',
    // Mantenedor de Documentos
    VIEW_DOCUMENTS:   'View Documents Maintainer',
    UPDATE_DOCUMENTS: 'Update Documents Maintainer',
    // Mantenedor de HS Codes
    VIEW_HSCODES:     'View HsCodes Maintainer',
    UPDATE_HSCODES:   'Update HsCodes Maintainer',
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
 * Helper function to check if a user has View Permission
 */
export const isViewPermission = (permission: string): boolean => {
    return permission === USER_ROLES.VIEW;
};
