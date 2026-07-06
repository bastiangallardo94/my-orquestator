import { Facility } from '../types/facilities';
import apiClient from "./apiClient"

export interface GetFacilitiesParams {
    countryCode: string;
    vendorCode: string;
}

export const facilitiesService = {
    getFacilities: async (params: GetFacilitiesParams): Promise<Array<Facility>> => {
        return await apiClient.get<Array<Facility>>('/facilities', { params })
            .then(response => response.data)
            .catch((error) => {
                console.error("Error fetching facilities:", error);
                throw error;
            });
    }
}
