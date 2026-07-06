import { inspectionDetailService } from './inspectionDetailService';
import ApiClient from './apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

jest.mock('./apiClient');

describe('inspectionDetailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInspectionDetail', () => {
    it('calls ApiClient.get with correct URL and params', async () => {
      const mockResponse = { data: { content: [], totalElements: 0 } };
      (ApiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const filters = { page: 1, size: 10, status: 'PENDING' };
      const result = await inspectionDetailService.getInspectionDetail('INS-001', filters as any);

      expect(ApiClient.get).toHaveBeenCalledWith(
        API_ENDPOINTS.GET_INSPECTIONS_DETAILS.replace('{id}', 'INS-001'),
        {
          params: { ...filters, includeDocuments: true },
        }
      );
      expect(result).toBe(mockResponse);
    });

    it('propagates errors from ApiClient', async () => {
      (ApiClient.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        inspectionDetailService.getInspectionDetail('INS-001', { page: 1, size: 10, status: '' } as any)
      ).rejects.toThrow('Network error');
    });
  });

  describe('getImagesByDetailId', () => {
    it('calls ApiClient.get with correctly interpolated URL', async () => {
      const mockResponse = { data: [] };
      (ApiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      await inspectionDetailService.getImagesByDetailId('INS-001', 'DET-002');

      const expectedUrl = API_ENDPOINTS.GET_IMAGES_BY_INSPECTION_DETAIL_ID
        .replace('{idInspeccion}', 'INS-001')
        .replace('{idDetalle}', 'DET-002');

      expect(ApiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('propagates errors', async () => {
      (ApiClient.get as jest.Mock).mockRejectedValue(new Error('Not found'));

      await expect(
        inspectionDetailService.getImagesByDetailId('INS-001', 'DET-002')
      ).rejects.toThrow('Not found');
    });
  });

  describe('updateInspectionDetail', () => {
    it('calls ApiClient.patch with correct URL and data', async () => {
      const mockResponse = { data: { success: true } };
      (ApiClient.patch as jest.Mock).mockResolvedValue(mockResponse);

      const data = { stageId: 5, comments: 'Looks good' };
      await inspectionDetailService.updateInspectionDetail('INS-001', 'DET-002', data);

      const expectedUrl = API_ENDPOINTS.PATCH_INSPECTION_DETAIL_RESULT
        .replace('{idInspeccion}', 'INS-001')
        .replace('{idDetalle}', 'DET-002');

      expect(ApiClient.patch).toHaveBeenCalledWith(expectedUrl, data);
    });

    it('calls ApiClient.patch without comments when omitted', async () => {
      (ApiClient.patch as jest.Mock).mockResolvedValue({});

      await inspectionDetailService.updateInspectionDetail('INS-001', 'DET-002', { stageId: 3 });

      expect(ApiClient.patch).toHaveBeenCalledWith(
        expect.any(String),
        { stageId: 3 }
      );
    });
  });
});
