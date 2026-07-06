/**
 * useAppRoles Hook
 * Hook para obtener roles y datos del usuario desde el token JWT
 */

import { useAppSelector } from '@infrastructure/store/hooks/useStore';
import { safeDecodeToken, extractRoles, extractUserInfo, buildAuditStamp } from '../utils/tokenUtils';

export interface UserRoles {
    roles: string[];
    username?: string;
    auditStamp: {
        userId: string;
        email: string;
        name: string;
        roles: string[];
    };
}

/**
 * Hook para obtener roles y datos del usuario desde el token
 * @param clientId - ID del cliente en Keycloak (por defecto: 'ftp-client')
 */
export function useAppRoles(clientId: string = 'ftp-client'): UserRoles {
    const token = useAppSelector((state) => state.authentication?.token);
    const decoded = safeDecodeToken(token);
    const roles = extractRoles(decoded, clientId);
    const user = extractUserInfo(decoded);

    const auditStamp = buildAuditStamp(user, roles);

    return {
        roles,
        username: user.name,
        auditStamp,
    };
}
