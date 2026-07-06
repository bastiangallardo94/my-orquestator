import ApiClient from "../services/apiClient";
import {API_ENDPOINTS} from "../shared/constants/apiEndpoints";
import {InspectionSkuDetailsResponse} from "../types/inspection.types";


export interface InspectionDetailParams {
  page: number;
  size: number;
  status: string;
}

export const inspectionDetailService = {

  getInspectionDetail: async (id: string, filters: InspectionDetailParams) => {
    return await ApiClient.get<InspectionSkuDetailsResponse>(API_ENDPOINTS.GET_INSPECTIONS_DETAILS.replace("{id}", id), {
      params: {
        ...filters,
        includeDocuments: true
      }
    });
  },

  getImagesByDetailId: async (idInspeccion: string, idDetalle: string) => {
    return await ApiClient.get(API_ENDPOINTS.GET_IMAGES_BY_INSPECTION_DETAIL_ID.replace("{idInspeccion}", idInspeccion).replace("{idDetalle}", idDetalle))
  },

  updateInspectionDetail: async (idInspeccion: string, idDetalle: string, data: {
    stageId: number;
    comments?: string;
  }) => {
    return await ApiClient.patch(API_ENDPOINTS.PATCH_INSPECTION_DETAIL_RESULT.replace("{idInspeccion}", idInspeccion).replace('{idDetalle}', idDetalle), data)
  }

}
