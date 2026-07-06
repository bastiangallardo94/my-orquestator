import { useAppSelector } from '@infrastructure/store/hooks';
import { RootState } from '@infrastructure/store/store';
import userService from "@services/userService";

/**
 * useUser Hook
 * 
 * Hook para manejar información del usuario autenticado.
 * Proporciona acceso al usuario actual, tenant, y métodos para actualizar la información.
 */
const useUser = () => {
  // Obtener usuario del store de Redux
  const user = useAppSelector((state: RootState) => state.authentication.user);
  const tenant = useAppSelector((state: RootState) => state.tenant.currentTenant);

  const getUserData = async () => {
    try {
      const response = await userService.getUserInformation();
      window.localStorage.setItem('list_tenant', JSON.stringify(response));
      return response;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  const getBusinessUnitByUser = () => {
    if (window.localStorage.getItem('list_tenant')) {
      const userData = JSON.parse(window.localStorage.getItem('list_tenant') as string);
      return userData.businessUnitList || [];
    } else {
      return [];
    }
  }

  return {
    user,
    tenant,
    getUserData,
    getBusinessUnitByUser
  }
};

export default useUser;
