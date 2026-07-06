import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { AxiosResponse } from 'axios';
import { Country } from '../types/country';
import apiClient from './apiClient';

/**
 * countryService
 *
 * Provides methods to interact with Countries via the BFF for shipment operations.
 * - `getDestinationCountries`: Retrieves a list of destination countries available
 *   for a given business unit. Uses `portType: "DESTINY"` to filter results.
 * - `getOriginCountries`: Retrieves a list of origin countries available
 *   for a given business unit. Uses `portType: "ORIGIN"` to filter results.
 *
 * Both methods build query parameters with the business unit code and port type,
 * call the shared `apiClient`, and return typed arrays of `Country`.
 * Errors are re-thrown so they can be handled by consuming hooks or components.
 */
export const countryService = {
    getDestinationCountries: async (bu: string): Promise<Country[]> => {
        return apiClient.get<Country[]>(`${API_ENDPOINTS.COUNTRIES}`, {
            params: {
                businessUnitCodes: bu,
                portType: "DESTINY",
            }
        })
            .then((response: AxiosResponse<Country[]>) => response.data)
            .catch((error) => {
                throw error;
            });
    },

    getOriginCountries: (bu: string): Promise<Country[]> => {
        return apiClient.get<Country[]>(`${API_ENDPOINTS.COUNTRIES}`, {
            params: {
                businessUnitCodes: bu,
                portType: "ORIGIN",
            }
        })
            .then((response: AxiosResponse<Country[]>) => response.data)
            .catch((error) => {
                throw error;
            });
    },
};


