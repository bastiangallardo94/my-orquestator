import { facilitiesService, GetFacilitiesParams } from './facilitiesService';
import apiClient from './apiClient';
import { Facility } from '../types/facilities';

// Mock the apiClient
jest.mock('./apiClient');

describe('facilitiesService', () => {
	const mockFacilities: Facility[] = [
		{
			id: 1,
			name: 'Facility 1',
			address: 'Address 1',
			zipCode: '12345',
			vendorCorpCode: 'V001',
			countryCode: 'CL',
			latitude: -33.4489,
			longitude: -70.6693
		}
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getFacilities', () => {
		const params: GetFacilitiesParams = {
			countryCode: 'CL',
			vendorCode: 'V001'
		};

		it('should call the correct endpoint with provided parameters', async () => {
			// Arrange
			(apiClient.get as jest.Mock).mockResolvedValue({ data: mockFacilities });

			// Act
			const result = await facilitiesService.getFacilities(params);

			// Assert
			expect(apiClient.get).toHaveBeenCalledWith('/facilities', { params });
			expect(result).toEqual(mockFacilities);
		});

		it('should throw an error and log it when the API call fails', async () => {
			// Arrange
			const mockError = new Error('Network Error');
			(apiClient.get as jest.Mock).mockRejectedValue(mockError);
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

			// Act & Assert
			await expect(facilitiesService.getFacilities(params)).rejects.toThrow('Network Error');
			expect(consoleSpy).toHaveBeenCalledWith('Error fetching facilities:', mockError);

			consoleSpy.mockRestore();
		});

		it('should return an empty array if the API returns no content', async () => {
			// Arrange
			(apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

			// Act
			const result = await facilitiesService.getFacilities(params);

			// Assert
			expect(result).toEqual([]);
		});
	});
});
