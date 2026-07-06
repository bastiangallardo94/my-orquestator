/**
 * Constantes de endpoints de API para el módulo de Obsolescencia
 * Estos endpoints son específicos del dominio y no cambian entre ambientes
 */

export const API_ENDPOINTS = {
	USER_INFORMATION: 'user/information',
	COUNTRIES: 'port/countries',
	PURCHASE_ORDERS: 'purchase-orders',
	PURCHASE_ORDER_DETAIL: "purchase-orders/details/grouped",
	GET_INSPECTION_TYPES: 'inspections/types',
	GET_FACILITIES: 'inspections/facilities',
	INSPECTIONS: "/inspections",
	INSPECTIONS_PAGINATED: "/inspections/paginated",
	VENDORS: "/vendors",
	SCHEDULE_INSPECTION: "/inspections",
	GET_REASON_BY_TYPE_AND_BU: "/reason?bussinesUnitCode=${BU}&active=true&types=${TYPE}",
	REJECT_SCHEDULE: "/inspections/{id}/reject",
	CANCEL_SCHEDULE: "/inspections/{id}/cancel",
	GET_STAGES: "/inspections/stages",
	INSPECTION_COMPANIES: "inspection-companies",
	INSPECTION_FORM_TEMPLATE_DOWNLOAD: "/document/template/40/file:download",
	GET_INSPECTION_LEVELS: '/aql/options/inspection-levels',
	GET_ACCEPTANCE_LEVELS: '/aql/options/acceptance-levels',
	GET_INSPECTOR_BY_FACILITY: `inspection-companies/{id}/inspectors`,
	APPROVE_SCHEDULE_INSPECTION: '/inspections/{id}/approve',
  GET_INSPECTIONS_DETAILS: '/inspections/{id}/details/paginated',
  GET_IMAGES_BY_INSPECTION_DETAIL_ID: '/inspections/{idInspeccion}/details/{idDetalle}/documents',
  PATCH_INSPECTION_DETAIL_RESULT: '/inspections/{idInspeccion}/details/{idDetalle}/result',
  CLASSIFY_PO_TEMPLATE_DOWNLOAD: '/inspections/classify-po/template:download',
  CLASSIFY_PO_FILE_UPLOAD: '/inspections/classify-po',
  CLASSIFY_PO_SUMMARY_DOWNLOAD: '/inspections/classify-po/summary:download',
} as const;

/**
 * Tipo para los endpoints disponibles
 */
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];

/**
 * Helper para construir URLs completas de API
 * @param endpoint - El endpoint a utilizar
 * @param baseUrl - La URL base de la API (por defecto usa la variable de entorno)
 * @returns URL completa del endpoint
 */
export const buildApiUrl = (endpoint: ApiEndpoint, baseUrl?: string): string => {
	const base = baseUrl || process.env.API_BASE_URL || 'http://localhost:5000/';
	return `${base.endsWith('/') ? base : base + '/'}${endpoint}`;
};

/**
 * Helper para construir URLs con parámetros de query
 * @param endpoint - El endpoint a utilizar
 * @param params - Parámetros de query
 * @param baseUrl - La URL base de la API
 * @returns URL completa con parámetros
 */
export const buildApiUrlWithParams = (
	endpoint: ApiEndpoint,
	params: Record<string, string | number | boolean>,
	baseUrl?: string
): string => {
	const url = buildApiUrl(endpoint, baseUrl);
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		searchParams.append(key, String(value));
	});

	return `${url}?${searchParams.toString()}`;
};
