import { NotFoundError } from "../types/api";
import apiClient from "./apiClient";
import { mockUserInfo } from "./_mocks_/mockUserInfo";
import userService from "./userService";
import { API_ENDPOINTS } from "@shared/constants/apiEndpoints";

jest.mock('./apiClient');

describe('userService', () => {
    // Sample mock data that represents what the API should return.
    const mockResponse = mockUserInfo;

    // Reset mocks between tests to prevent test pollution.
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should call UserInformation API', async () => { 
        // Setup: Mock a successful API response
        (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

        await userService.getUserInformation();
        
        expect(apiClient.get).toHaveBeenCalledWith(
            API_ENDPOINTS.USER_INFORMATION
        );
    });

    it('should throw NotFoundError on 404', async () => {
        (apiClient.get as jest.Mock).mockRejectedValue(
            new NotFoundError('Not Found')
        );
        
        await expect(userService.getUserInformation())
            .rejects.toThrow(NotFoundError);
    });
});