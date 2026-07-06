/**
 * ProtectedRoute Component
 * 
 * Componente de orden superior (HOC) para proteger rutas basándose en roles de usuario.
 * Extrae roles del token JWT y valida permisos antes de renderizar el contenido.
 * 
 * @description
 * - Utiliza `useAppRoles` para extraer roles del JWT almacenado en Redux
 * - Compara roles del usuario con `requiredRoles` de forma case-insensitive
 * - Si el usuario NO tiene permiso:
 *   - Con `showAccessDenied=true` (default): Muestra componente <AccessDenied />
 *   - Con `showAccessDenied=false`: No renderiza nada (null)
 * - Si el usuario SÍ tiene permiso: Renderiza children normalmente
 * 
 * @example
 * // Ruta accesible solo para usuarios con rol específico
 * <Route path="/admin" element={
 *   <ProtectedRoute requiredRoles={['PROVISIONES_CORP_ADMIN']}>
 *     <AdminPanel />
 *   </ProtectedRoute>
 * } />
 * 
 * @example
 * // Ruta accesible para varios roles (OR lógico)
 * <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERVISOR']}>
 *   <ReportsPage />
 * </ProtectedRoute>
 */

import { USER_ROLES } from '@core/constants/roles';
import { AccessDenied } from '@shared/components/ui/AccessDenied';
import { useAppRoles } from '@shared/hooks/useAppRoles';
import React from 'react';

/**
 * Props del componente ProtectedRoute
 */
interface ProtectedRouteProps {
    /** Contenido a renderizar si el usuario tiene permisos */
    children: React.ReactNode;
    /** Array de roles permitidos (el usuario necesita AL MENOS UNO) */
    requiredRoles?: string[];
    /** Array de roles excluidos (si el usuario tiene ALGUNO, se deniega acceso) */
    excludedRoles?: string[];
    /** Mostrar página de "Acceso Denegado" si no tiene permisos (default: true) */
    showAccessDenied?: boolean;
    /** @deprecated Rol de administrador (no se usa, mantener por compatibilidad) */
    adminRole?: string;
    /** @deprecated Rol de usuario (no se usa, mantener por compatibilidad) */
    userRole?: string;
}
export const ProtectedRoute = ({
    children,
    requiredRoles = [USER_ROLES.VIEW],
    excludedRoles = [],
    showAccessDenied = true,
}: ProtectedRouteProps) => {
    // Extraer roles del usuario desde el JWT
    const { roles } = useAppRoles();

    /**
     * Verificación de permisos:
     * - Se comparan los roles del usuario con los roles requeridos
     * - La comparación es case-insensitive (.toUpperCase())
     * - Basta con que el usuario tenga AL MENOS UNO de los roles requeridos (lógica OR)
     * - Si requiredRoles = ['ADMIN', 'USER'] y el usuario tiene ['USER'], se concede acceso
     */
    const hasRequiredRole = requiredRoles.some(requiredRole =>
            roles.some(userRole => userRole.toUpperCase() === requiredRole.toUpperCase())
        );

        const hasExcludedRole = excludedRoles.some(excludedRole =>
            roles.some(userRole => userRole.toUpperCase() === excludedRole.toUpperCase())
        );

    /**
     * Manejo de acceso denegado:
     * - Log de advertencia en consola para debugging
     * - Si showAccessDenied=true: renderiza componente AccessDenied con los roles requeridos
     * - Si showAccessDenied=false: no renderiza nada (útil para ocultar elementos del UI)
     */
    if (!hasRequiredRole || hasExcludedRole) {
        console.error(`Access denied: User does not have required roles: ${requiredRoles.join(', ')}`);

        if (showAccessDenied) {
            return <AccessDenied requiredRoles={requiredRoles} />;
        }

        return null;
    }

    // Usuario autorizado: renderizar contenido protegido
    return <>{children}</>;
};
