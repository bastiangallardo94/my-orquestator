import { USER_ROLES } from '@core/constants/roles';
import { AccessDenied } from '@shared/components/ui/AccessDenied';
import { useAppRoles } from '@shared/hooks/useAppRoles';
import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    showAccessDenied?: boolean;
}

export const ProtectedRoute = ({
    children,
    requiredRoles = [USER_ROLES.VIEW],
    showAccessDenied = true,
}: ProtectedRouteProps) => {
    const { roles } = useAppRoles();

    const hasRequiredRole = requiredRoles.some(requiredRole =>
        roles.some(userRole => userRole.toUpperCase() === requiredRole.toUpperCase())
    );

    if (!hasRequiredRole) {
        console.error(`Access denied: User does not have required roles: ${requiredRoles.join(', ')}`);
        if (showAccessDenied) return <AccessDenied requiredRoles={requiredRoles} />;
        return null;
    }

    return <>{children}</>;
};