/**
 * Modelo de datos para una Inspección.
 * bff/inspections
 */
export interface Inspection {
    id: number;
    countryCode: string;
    countryOfDestination:string;
    countryName: string;
    businessUnitCode: string;
    businessUnitName: string;
    code: string;
    scheduleDate: string;
    stage: InspectionResultStage;
    facility: InspectionFacility;
    type: InspectionType;
    vendorCorpCode: string;
    vendorName: string;
    totalQuantityPo: number;
    totalQuantitySku: number;
    details: InspectionDetails[];
    style?: string;
    inspector?: {
        id: number;
        email: string;
        name: string;
        company: string;
        country: string;
    },
    result?: InspectionResultStage;
    comments?: string;
    inspectionCompany?: InspectionCompany;
};

export interface InspectionDetails {
    id: number;
    sku: string;
    purchaseOrderCode: string;
    purchaseOrderDetail: number;
}

export interface InspectionResultStage {
    id: string;
    name: string;
    active: boolean;
    type: string;
    code: number;
    order: number;
}

/**
 * Estado de una inspección.
 */
export interface InspectionStage {
    id: number;
    name: string;
    code: string;
    active?: boolean;
}

/**
 * Los tipos de InspectionStage que hay en la BD.
 */
export const enum InspectionStageType {
    PO = 'PO',
    DETAILS = 'DETAILS',
    INSPECTION_REQUEST = 'INSPECTION_REQUEST',
    INSPECTION_RESULT = 'INSPECTION_RESULT',
}

export interface InspectionFacility {
    id: number;
    name: string;
    address: string;
    zipCode: string;
    vendorCorpCode: string;
    countryCode: string;
    latitude: number;
    longitude: number;
}

export interface InspectionType {
    id: number;
    name: string;
    description: string;
    active: boolean;
};

export interface InspectionCompany {
    id: number;
    name: string;
    description: string;
    fiscalId: string;
    active: boolean;
    thirdParty: boolean;
}

export interface Inspector {
    id: number;
    name: string;
    mail: string;
    active: boolean;
}
export interface ApproveScheduleRequest {
    inspectionCompanyId: string;
    userInspectionId: string;
    inspectionLevel: string;
    lowerAcceptanceLevel: string;
    higherAcceptanceLevel: string;
    selfInspection: boolean;
}

/**
 * ScheduleInspectionRequest describe el formato del body de la POST request
 * que se le hace al BFF para agendar una nueva inspección.
 */
export interface ScheduleInspectionRequest {
    groupingMode: string; // STYLE o SKU
    countryCode: string;
    businessUnitCode: string;
    inspections: ScheduleInspectionRequestItem[]
}

export interface ScheduleInspectionRequestItem {
    style?: string;
    scheduleDate: string;
    facilityId: number;
    typeId: number;
    details: ScheduleInspectionRequestItemDetails[];
}

export interface ScheduleInspectionRequestItemDetails {
    purchaseOrderDetailId: string;
    purchaseOrderId: string;
}

/**
 * InspectionFilters describe el formato de los filtros requeridos para 
 * buscar inspecciones agendadas.
 */
export interface InspectionFilters {
    businessUnit?: string;
    countryCode?: string;
    inspectionTypeList?: string[];
    scheduleDate?: string;
    inspectorUserIdList?: string;
    inspectorCompanyIdList?: string;
    codes?: string;
    results?: string;
    stages?: number[];
    styles?: string;
    purchaseOrderLocalCode?: number;
    folderNumberList?: string;
    proformaInvoiceList?: string;
    inspectionCodes?: string;
}

/**
 * InspectionPaginatedRequest describe todos los parámetros aceptados por
 * bff/inspections/paginated para obtener lista de Inspecciones.
 */
export interface InspectionPaginatedRequest {
    businessUnitCodeList?: string[];
    countryCodeList?: string[];
    inspectionTypeList?: number[];
    scheduledDate?: string;
    inspectorUserIdList?: number[];
    inspectorCompanyIdList?: number[];
    codes?: string[];
    results?: number[];
    stages?: number[];
    styles?: string[];
    purchaseOrderLocalCode?: string[];
    folderNumberList?: string[];
    proformaInvoiceList?: string[];
    page?: number,
    size?: number
    vendorCorpCode?: string;
}

export interface InspectionsResponse {
    content: Inspection[];
    pageNumber: number;
    totalElements: number;
    pageSize: number;
    limitPage: number;
    totalPages: number;
    numberOfElements: number;
    size: number;
}

export interface InspectionsRejectRequest {
    reasonName: string;
    reasonId: number;
    comment: string;
}

export interface Stage {
    id: number;
    name: string;
    active: boolean;
}

export interface InspectionLevels {
    code: string;
    label: string;
    value: string;
}

export interface AcceptanceLevels {
    code: string;
    label: string;
    value: string;
}

export interface Reason {
    id: number;
    code: string;
    name: string;
}

export interface InspectionDocument {
  id: number;
  active: boolean;
  type: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  access: {
    href: string;
  };
  inspectionId: number;
  createdDate: string;
  lastUpdateDate: string;
}

export interface InspectionResult {
  id?: number;
  stageName?: string;
  comments?: string;
  stageCode: string;
}

export interface InspectionSkuDetail {
  id: number;
  sku: string;
  folder: string;
  purchaseOrderDetail: number;
  documents: InspectionDocument[];
  inspectionId?: string;
  result?: InspectionResult;
}

export interface InspectionSkuDetailsResponse {
  content: InspectionSkuDetail[];
  pageNumber: number;
  totalElements: number;
  pageSize: number;
  limitPage: number;
  totalPages: number;
  numberOfElements: number;
  size: number;
}

