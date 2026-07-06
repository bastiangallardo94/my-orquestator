import vendorService from './vendorService';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

jest.mock('./apiClient');

describe('VendorService', () => {
  const mockVendors = [
    { id: 1, name: 'Vendor A' },
    { id: 2, name: 'Vendor B' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    vendorService.clearCache();
  });

  describe('getVendors', () => {
    it('calls the API on first request', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockVendors });

      const result = await vendorService.getVendors();

      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.VENDORS);
      expect(result).toEqual(mockVendors);
    });

    it('returns cached data on subsequent calls without hitting the API again', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockVendors });

      await vendorService.getVendors();
      await vendorService.getVendors();

      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });

    it('propagates API errors', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(vendorService.getVendors()).rejects.toThrow('Network error');
    });
  });

  describe('clearCache', () => {
    it('forces a new API call after cache is cleared', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockVendors });

      await vendorService.getVendors();
      vendorService.clearCache();
      await vendorService.getVendors();

      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });
  });
});
