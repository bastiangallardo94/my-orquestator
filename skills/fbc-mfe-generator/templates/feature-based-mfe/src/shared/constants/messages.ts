// Mensajes de UI reutilizables para tablas y estados
export const UI_MESSAGES = {
    EMPTY_TABLE: "No hay datos disponibles.",
    LOADING: "Cargando datos...",
    LOADING_BRANCHES: "Cargando sucursales...",
};

// Mensajes de errores y estados para API
export const API_MESSAGES = {
    ERROR_GENERIC: "Ocurrió un error al cargar los datos.",
    TIMEOUT: "La solicitud excedió el tiempo de espera.",
    INVALID_JSON: "La respuesta del servidor no es un JSON válido.",
    ERROR_UNKNOWN: "Error desconocido.",
    ERROR_HTTP: (status: number) => `HTTP ${status}`,
};

// Mensajes para descargas
export const DOWNLOAD_MESSAGES = {
    ERROR_DOWNLOAD: "Error al descargar el archivo.",
    TIMEOUT: "La descarga excedió el tiempo de espera.",
};

// Mensajes para exportaciones
export const EXPORT_MESSAGES = {
    EXPORT_SUCCESS: "Datos exportados correctamente.",
    EXPORT_EMPTY: "No hay datos para exportar.",
};
