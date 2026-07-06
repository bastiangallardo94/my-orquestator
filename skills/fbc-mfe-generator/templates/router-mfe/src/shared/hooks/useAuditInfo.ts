import { useAppSelector } from '@infrastructure/store/hooks/useStore';
import { safeDecodeToken, extractUserInfo } from '@shared/utils/tokenUtils';
import { useMemo } from 'react';

/**
 * Hook para obtener información básica de auditoría del usuario autenticado
 * 
 * @description
 * Extrae email y nombre del usuario desde el token JWT almacenado en Redux.
 * Utiliza useMemo para evitar recálculos innecesarios.
 * 
 * @returns {Object} Información de auditoría del usuario
 * @returns {string} userEmail - Email del usuario
 * @returns {string} userName - Nombre completo del usuario
 * 
 * @example
 * const { userEmail, userName } = useAuditInfo();
 * const saveData = async (data) => {
 *   await api.save({ ...data, createdBy: userName, createdByEmail: userEmail });
 * };
 */
export const useAuditInfo = () => {
  const token = useAppSelector(s => s.authentication?.token);
  const decoded = safeDecodeToken(token);
  const user = extractUserInfo(decoded);
  const email = user.email ?? '';
  const name = user.name ?? '';
  return useMemo(() => ({ userEmail: email, userName: name }), [email, name]);
};

export type AuditInfo = ReturnType<typeof useAuditInfo>;
