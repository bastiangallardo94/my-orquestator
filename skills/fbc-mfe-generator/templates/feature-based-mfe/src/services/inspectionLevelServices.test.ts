import { inspectionLevelServices } from './inspectionLevelServices';
import apiClient from '@services/apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

jest.mock('@services/apiClient');

describe('inspectionLevelServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInspectionLevels', () => {
    it('should call apiClient.get with correct endpoint and return data', async () => {
      const mockData = [{ id: 1, description: 'Level 1' }];
      (apiClient.get as jest.Mock).mockResolvedValue(mockData);

      const result = await inspectionLevelServices.getInspectionLevels();

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.GET_INSPECTION_LEVELS);
      expect(result).toEqual(mockData);
    });

    it('should throw an error when apiClient.get fails', async () => {
      const mockError = new Error('Network error');
      (apiClient.get as jest.Mock).mockRejectedValue(mockError);

      await expect(inspectionLevelServices.getInspectionLevels()).rejects.toThrow(mockError);
    });
  });
});
