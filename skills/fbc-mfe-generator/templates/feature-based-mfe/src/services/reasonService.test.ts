import { reasonService } from './reasonService';
import ApiClient from '@services/apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

jest.mock('@services/apiClient');

describe('reasonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReasonByBuAndType', () => {
    it('calls ApiClient.get with BU and TYPE interpolated in the URL', async () => {
      const mockResponse = { data: [{ id: 1, description: 'Cancel' }] };
      (ApiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      await reasonService.getReasonByBuAndType('SOD', 'CANCEL_SCHEDULED_INSPECTION');

      const expectedUrl = API_ENDPOINTS.GET_REASON_BY_TYPE_AND_BU
        .replace('${BU}', 'SOD')
        .replace('${TYPE}', 'CANCEL_SCHEDULED_INSPECTION');

      expect(ApiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('returns the response from the API', async () => {
      const mockResponse = { data: [{ id: 1, description: 'Reject' }] };
      (ApiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await reasonService.getReasonByBuAndType('SO', 'REJECT_INSPECTION');
      expect(result).toBe(mockResponse);
    });

    it('propagates API errors', async () => {
      (ApiClient.get as jest.Mock).mockRejectedValue(new Error('Service unavailable'));

      await expect(
        reasonService.getReasonByBuAndType('SOD', 'CANCEL_SCHEDULED_INSPECTION')
      ).rejects.toThrow('Service unavailable');
    });
  });
});
