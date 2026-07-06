/**
 * Token Utils
 * Utilidades para decodificar y extraer información del JWT
 */

import { jwtDecode } from 'jwt-decode';

// Tipado del token (Keycloak / OpenID Connect estándar + resource_access)
export interface DecodedAuthToken {
    // Standard JWT claims
    sub?: string; // user id (subject)
    iss?: string; // issuer
    aud?: string | string[]; // audience
    exp?: number; // expiration time (Unix timestamp)
    iat?: number; // issued at (Unix timestamp)
    auth_time?: number; // authentication time
    jti?: string; // JWT ID
    typ?: string; // token type
    azp?: string; // authorized party
    session_state?: string; // session state
    acr?: string; // authentication context class reference
    sid?: string; // session ID
    scope?: string; // scope

    // User profile claims
    email?: string;
    email_verified?: boolean;
    name?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;

    // Keycloak specific claims
    realm_access?: { roles?: string[] };
    resource_access?: Record<string, { roles?: string[] }>;

    // Additional claims
    [key: string]: unknown;
}

export interface ExtractedUserInfo {
    userId: string;
    email: string;
    name: string;
    username: string;
}

export interface ExtractedRoles {
    roles: string[];
}

/**
 * Decodifica de forma segura un token JWT
 * 
 * @description
 * Intenta decodificar un JWT usando jwt-decode. Si falla o el token es null/undefined,
 * retorna null. En desarrollo muestra warning en consola.
 * 
 * @param {string | null | undefined} token - Token JWT a decodificar
 * @returns {DecodedAuthToken | null} Token decodificado o null si falla
 * 
 * @example
 * const decoded = safeDecodeToken(jwtToken);
 */
export function safeDecodeToken(token?: string | null): DecodedAuthToken | null {
    if (!token) return null;
    try {
        return jwtDecode<DecodedAuthToken>(token);
    } catch (e) {
        console.error('[tokenUtils] ❌ Error decodificando token:', e);
    }
    return null;
}

/**
 * Extrae roles del token JWT decodificado
 * 
 * @description
 * Obtiene roles desde múltiples fuentes en orden de prioridad:
 * 1. resource_access del cliente específico (ej: 'rim')
 * 2. realm_access como fallback
 * 3. Otros resource_access disponibles
 * Deduplica roles usando Set.
 * 
 * @param {DecodedAuthToken | null} decoded - Token JWT decodificado
 * @param {string} preferredClient - ID del cliente en Keycloak (default: 'rim')
 * @returns {string[]} Array de roles únicos del usuario
 * 
 * @example
 * const decoded = safeDecodeToken(token);
 * const roles = extractRoles(decoded, 'ftp-client');
 * // ['PROVISIONES_CORP_ADMIN', 'PROVISIONES_CORP_USER']
 */
export function extractRoles(decoded: DecodedAuthToken | null, preferredClient: string = 'ftp-client'): string[] {
    if (!decoded) return [];
    // 1) resource_access para un cliente específico (por defecto 'rim')
    const fromClient = decoded.resource_access?.[preferredClient]?.roles ?? [];
    // 2) roles de realm como fallback
    const fromRealm = decoded.realm_access?.roles ?? [];
    // 3) aplanar cualquier otro resource_access
    const others: string[] = Object.values(decoded.resource_access ?? {})
        .flatMap(r => r.roles ?? []);
    const set = new Set<string>([...fromClient, ...fromRealm, ...others]);
    return Array.from(set);
}

/**
 * Extrae información básica del usuario desde el token JWT
 * 
 * @description
 * Obtiene userId (sub), email y name del token decodificado.
 * Si el token es null o algún campo no existe, retorna strings vacíos.
 * 
 * @param {DecodedAuthToken | null} decoded - Token JWT decodificado
 * @returns {ExtractedUserInfo} Objeto con userId, email y name
 * 
 * @example
 * const decoded = safeDecodeToken(token);
 * const user = extractUserInfo(decoded);
 */
export function extractUserInfo(decoded: DecodedAuthToken | null): ExtractedUserInfo {
    if (!decoded) return { userId: '', email: '', name: '', username: '' };
    return {
        userId: decoded.sub ?? '',
        email: decoded.email ?? '',
        name: decoded.name ?? '',
        username: decoded.preferred_username ?? '',
    };
}

/**
 * Construye un objeto de auditoría completo para logging y trazabilidad
 * 
 * @description
 * Combina información del usuario y roles en un objeto readonly
 * útil para enviar en requests de API o logging de auditoría.
 * 
 * @param {ExtractedUserInfo} user - Información básica del usuario
 * @param {string[]} roles - Array de roles del usuario
 * @returns {Object} Objeto readonly con userId, email, name y roles
 * 
 * @example
 * const user = extractUserInfo(decoded);
 * const roles = extractRoles(decoded);
 * const auditStamp = buildAuditStamp(user, roles);
 * // { userId: '123', email: 'user@example.com', name: 'John Doe', roles: ['ADMIN'] }
 */
export function buildAuditStamp(user: ExtractedUserInfo, roles: string[]) {
    return {
        userId: user.userId,
        email: user.email,
        name: user.name,
        roles,
    } as const;
}
