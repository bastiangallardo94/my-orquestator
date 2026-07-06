/**
 * PrivateRoute Component
 * 
 * Componente de orden superior (HOC) para proteger rutas que requieren autenticación básica.
 * Verifica que el usuario esté autenticado antes de permitir acceso.
 * 
 * @description
 * - Verifica el flag `isLogged` desde el estado de Redux (authentication slice)
 * - No verifica roles específicos (usar `ProtectedRoute` para eso)
 * - Si el usuario NO está autenticado: redirige a la ruta raíz "/"
 * - Si el usuario SÍ está autenticado: renderiza el contenido normalmente
 * 
 * Diferencia con ProtectedRoute:
 * - `PrivateRoute`: Solo verifica autenticación (¿está logged?)
 * - `ProtectedRoute`: Verifica roles específicos (¿tiene permiso X?)
 * 
 * @example
 * // Ruta privada básica (solo requiere login)
 * <Route path="/dashboard" element={
 *   <PrivateRoute>
 *     <DashboardPage />
 *   </PrivateRoute>
 * } />
 * 
 * @example
 * // Combinación: Autenticación + Roles específicos
 * <Route path="/admin" element={
 *   <PrivateRoute>
 *     <ProtectedRoute requiredRoles={['ADMIN']}>
 *       <AdminPanel />
 *     </ProtectedRoute>
 *   </PrivateRoute>
 * } />
 */

import { useAppSelector } from '@infrastructure/store/hooks/useStore';
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Props del componente PrivateRoute
 */
interface PrivateRouteProps {
    /** Contenido a renderizar si el usuario está autenticado */
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    /**
     * Obtener estado de autenticación desde Redux
     * El flag isLogged se actualiza cuando:
     * - El usuario hace login exitosamente
     * - Se detecta un token válido en localStorage al cargar la app
     * - El usuario hace logout (isLogged = false)
     */
    const isLogged = useAppSelector((state) => state.authentication.isLogged);

    /**
     * Redirección si no está autenticado:
     * - Navega a la ruta raíz "/" (típicamente la página de login)
     * - `replace` evita que el usuario pueda volver atrás con el botón del navegador
     */
    if (!isLogged) {
        return <Navigate to="/" replace />;
    }

    // Usuario autenticado: renderizar contenido protegido
    return <>{children}</>;
};
