import apiClient from '@services/apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { InspectionLevels } from '../types/inspection.types';

export const inspectionLevelServices = {

	getInspectionLevels: async  () => {
			return await apiClient.get<InspectionLevels[]>(API_ENDPOINTS.GET_INSPECTION_LEVELS);
	}
}
