import { inspectionAcceptanceLevelService } from './inspectionAcceptanceLevelService';
import apiClient from '@services/apiClient';
import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';

jest.mock('@services/apiClient');

describe('inspectionAcceptanceLevelService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getInspectionAcceptanceLevels with correct endpoint', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

    await inspectionAcceptanceLevelService.getInspectionAcceptanceLevels();

    expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.GET_ACCEPTANCE_LEVELS);
  });
});
