import apiClient from '@services/apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { AcceptanceLevels } from '../types/inspection.types';

export const inspectionAcceptanceLevelService = {
	getInspectionAcceptanceLevels: async () => {
		return await apiClient.get<AcceptanceLevels[]>(API_ENDPOINTS.GET_ACCEPTANCE_LEVELS);
	}
};
