import ApiClient from '@services/apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { Reason } from '../types/inspection.types';

export const reasonService = {
	getReasonByBuAndType: async (bu: string, type: string) => {
		return await ApiClient.get<Reason[]>(API_ENDPOINTS.GET_REASON_BY_TYPE_AND_BU.replace("${BU}", bu).replace("${TYPE}", type));
	}
}
