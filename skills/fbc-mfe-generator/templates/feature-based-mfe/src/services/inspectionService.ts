import { API_ENDPOINTS } from '@shared/constants/apiEndpoints';
import { buildQueryParams } from '@shared/utils/queryParams';
import { AxiosResponse } from 'axios';
import {
	ApproveScheduleRequest, Inspection,
	InspectionCompany,
	InspectionFilters, InspectionPaginatedRequest,
	InspectionsRejectRequest,
	InspectionsResponse,
	InspectionStageType,
	InspectionType, Inspector,
	ScheduleInspectionRequest,
	InspectionStage
} from '../types/inspection.types';
import apiClient from './apiClient';

/**
 * inspectionService
 *
 * Provides methods to interact with Inspections via the BFF (Backend For Frontend).
 * Includes API calls for inspection types, inspection lists, scheduling, and
 * temporary mocked data for resolutions, inspector inspections, and companies.
 */
export const inspectionService = {

	/**
	 * Retrieves all available inspection types.
	 * Example: "FINAL INSPECTION", "INLINE INSPECTION".
	 *
	 * @returns Promise resolving to an array of InspectionType objects.
	 */
	getInspectionTypes: async (): Promise<InspectionType[]> => {
		return await apiClient
			.get<InspectionType[]>(API_ENDPOINTS.GET_INSPECTION_TYPES)
			.then((response: AxiosResponse<InspectionType[]>) => response.data)
			.catch((error) => {
				throw error;
			});
	},

	/**
	 * Retrieves a paginated list of inspections based on filter criteria.
	 *
	 * @param filters - InspectionFilters object containing business unit, country, type, dates, etc.
	 * @param page - Current page number (1-based, converted internally to 0-based).
	 * @param size - Page size (defaults to 10 if not provided).
	 * @returns Promise resolving to an InspectionsResponse with inspection data and pagination info.
	 */
	getInspections: async (filters: InspectionFilters, page: number, size: number): Promise<InspectionsResponse> => {
		const params = buildQueryParams({

			businessUnitCodeList: filters.businessUnit,
			codes: filters.inspectionCodes,
			stages: filters.stages?.join(','),
			countryCode: filters.countryCode,
			inspectionTypeList: filters.inspectionTypeList?.join(','),
			scheduledDate: filters.scheduleDate,
			purchaseOrderLocalCodeList: filters.purchaseOrderLocalCode,
			folderNumberList: filters.folderNumberList?.replace(/\s/g, ''),
			proformaInvoiceList: filters.proformaInvoiceList?.replace(/\s/g, ''),
			inspectorUserIdList: filters.inspectorUserIdList?.replace(/\s/g, ''),
			inspectorCompanyIdList: filters.inspectorCompanyIdList?.replace(/\s/g, ''),
			styles: filters.styles?.replace(/\s/g, ''),
			page: page >= 1 ? page - 1 : 0,
			size: size ? size : 10
		});
		return apiClient
			.get<InspectionsResponse>(`${API_ENDPOINTS.INSPECTIONS_PAGINATED}`, { params })
			.then((response: AxiosResponse<InspectionsResponse>) => response.data)
			.catch((error) => {
				throw error;
			});
	},

	/**
	 * Retrieves a paginated list of inspections based on filter criteria.
	 *
	 * @param request - InspectionPaginatedRequest object containing business unit, country, type, dates, pageSize, etc.
	 * @returns Promise resolving to an InspectionsResponse with inspection data and pagination info.
	 */
	getPaginated: async (request: InspectionPaginatedRequest): Promise<InspectionsResponse> => {
		const params = buildQueryParams({
			businessUnitCodeList: request.businessUnitCodeList?.join(','),
			codes: request.codes?.join(','),
			stages: request.stages?.join(','),
			results: request.results?.join(','),
			countryCode: request.countryCodeList?.join(','),
			inspectionTypeList: request.inspectionTypeList?.join(','),
			scheduledDate: request.scheduledDate,
			purchaseOrderLocalCodeList: request.purchaseOrderLocalCode?.join(','),
			folderNumberList: request.folderNumberList?.join(','),
			proformaInvoiceList: request.proformaInvoiceList?.join(','),
			inspectorUserIdList: request.inspectorUserIdList?.join(','),
			inspectorCompanyIdList: request.inspectorCompanyIdList?.join(','),
			styles: request.styles?.join(','),
			page: request.page,
			size: request.size,
			vendorCorpCode: request.vendorCorpCode
		});
		return apiClient
			.get<InspectionsResponse>(`${API_ENDPOINTS.INSPECTIONS_PAGINATED}`, { params: params })
			.then((response: AxiosResponse<InspectionsResponse>) => response.data)
			.catch((error) => {
				throw error;
			});
	},

	/**
	 * 
	 * @param stageType 'PO' | 'DETAILS' | 'INSPECTION_REQUEST' | 'INSPECTION_RESULT'
	 * @returns la lista de etapas para un tipo de inspección
	 */
	getStages: async (stageType: InspectionStageType): Promise<InspectionStage[]> => {
		const params = {
			type: stageType
		};
		return await apiClient.get<InspectionStage[]>(API_ENDPOINTS.GET_STAGES, { params }).then((res) => res.data);
	},

	/**
	 * Schedules a new inspection.
	 *
	 * @param inspection - ScheduleInspectionRequest object containing inspection details.
	 * @returns Promise resolving to the API response (any type).
	 */
	scheduleInspection: async (inspection: ScheduleInspectionRequest): Promise<any> => {
		try {
			return apiClient.post<any>(API_ENDPOINTS.SCHEDULE_INSPECTION, inspection)
				.then((response: AxiosResponse<any>) => response.data);
		} catch (error) {
			console.error('Error scheduling inspection:', error);
		}
	},

	/**
	 * Retrieves available inspection companies.
	 * Currently returns mocked data with a simulated delay.
	 *
	 * @returns Promise resolving to an array of InspectionCompany.
	 */
	getInspectionCompanies: async (params?: {
		businessUnitCode?: string;
		countryOfDestination?: string;
		inspectionDate?: string;
    tenants?: string;
	}): Promise<InspectionCompany[]> => {
		return await apiClient.get<InspectionCompany[]>(API_ENDPOINTS.INSPECTION_COMPANIES, {
			params: {
				active: 'true',
				...params
			}
		}).then((res) => res.data);
	},

	rejectInspection: async (inspectionId: string, rejectData: InspectionsRejectRequest): Promise<any> => {
		return await apiClient.post<Inspection>(API_ENDPOINTS.REJECT_SCHEDULE.replace('{id}', inspectionId), { ...rejectData });
	},

	cancelSchedule: async (inspectionId: string, rejectData: InspectionsRejectRequest): Promise<any> => {
		return await apiClient.post<Inspection>(API_ENDPOINTS.CANCEL_SCHEDULE.replace('{id}', inspectionId), { ...rejectData });
	},


	getInspectorByFacility: async (id: number): Promise<Inspector[]> => {
		return await apiClient.get<Promise<Inspector[]>>(API_ENDPOINTS.GET_INSPECTOR_BY_FACILITY.replace('{id}', id.toString())).then((res) => res.data);
	},

	approveScheduleInspection: async (inspectionId: number, body: ApproveScheduleRequest) => {
		return await apiClient.post(API_ENDPOINTS.APPROVE_SCHEDULE_INSPECTION.replace('{id}', inspectionId.toString()), body);
	}
};

