import { API_ENDPOINTS } from "@shared/constants/apiEndpoints";
import { NotFoundError } from "../types/api";
import { mockDestinationCountries } from "./_mocks_/mockDestCountries";
import apiClient from "./apiClient";
import { countryService } from "./countryService";

jest.mock('./apiClient');

describe('countryService', () => {
    // Sample mock data that represents what the API should return.
    // const mockItems = mockPurchaseOrdersData;
    const buParam = "SOD";

    // Reset mocks between tests to prevent test pollution.
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should call Countries API with correct parameters', async () => {
        // Setup: Mock a successful API response
        (apiClient.get as jest.Mock).mockResolvedValue(mockDestinationCountries);

        await countryService.getDestinationCountries(buParam);

        expect(apiClient.get).toHaveBeenCalledWith(
            API_ENDPOINTS.COUNTRIES,
            expect.objectContaining({
                params: expect.objectContaining({
                    businessUnitCodes: buParam,
                    portType: "DESTINY",
                })
            })
        );
    });

    it('should throw NotFoundError on 404', async () => {
        (apiClient.get as jest.Mock).mockRejectedValue(
            new NotFoundError('Not Found')
        );

        await expect(countryService.getDestinationCountries(buParam))
            .rejects.toThrow(NotFoundError);
    });
});