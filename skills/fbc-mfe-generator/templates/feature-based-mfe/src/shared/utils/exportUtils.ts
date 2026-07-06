const Papa = require('papaparse');

/**
 * Tipo genérico para datos exportables
 * Representa un objeto con propiedades string indexables
 */
type ExportableData = Record<string, unknown>;

/**
 * Configuración para mapeo de headers en la exportación CSV
 * @property key - Nombre del campo en el objeto original
 * @property header - Nombre de la columna en el CSV exportado
 */
export interface HeaderMapping {
  [key: string]: string;
}

/**
 * Opciones de configuración para la exportación CSV
 */
export interface CsvExportOptions<T = ExportableData> {
  /** Nombre del archivo a descargar (incluye extensión .csv) */
  filename?: string;
  /** Mapeo de campos del objeto a headers del CSV */
  headers?: HeaderMapping;
  /** Delimitador de columnas (default: ',') */
  delimiter?: ',' | ';' | '\t' | '|';
  /** Incluir BOM para compatibilidad con Excel (default: true) */
  includeBOM?: boolean;
  /** Transformador opcional para cada fila antes de exportar */
  // eslint-disable-next-line no-unused-vars
  rowTransformer?: (row: T, index: number) => ExportableData;
}

/**
 * Configuración interna para papaparse
 */
interface PapaParseConfig {
  header: boolean;
  delimiter: string;
  skipEmptyLines: boolean;
  columns?: string[];
}

/**
 * Constantes para la exportación
 */
const CSV_DEFAULTS = {
  FILENAME: 'export.csv',
  DELIMITER: ',',
  MIME_TYPE: 'text/csv;charset=utf-8;',
  BOM: '\uFEFF',
} as const;

/**
 * Exporta un array de objetos a un archivo CSV y lo descarga automáticamente
 * 
 * @description
 * Convierte datos a CSV usando papaparse y descarga automáticamente el archivo.
 * Incluye BOM (\uFEFF) por defecto para compatibilidad con Excel.
 * Permite mapeo de headers personalizado y transformación de datos.
 * 
 * @template T - Tipo de los objetos del array a exportar
 * @param {T[]} data - Array de objetos a exportar
 * @param {CsvExportOptions<T>} options - Opciones de exportación
 * @returns {void}
 * 
 * @example
 * // Exportación básica
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * exportToCsv(users, { filename: 'users.csv' });
 * 
 * @example
 * // Con mapeo de headers
 * exportToCsv(users, { 
 *   filename: 'usuarios.csv',
 *   headers: { id: 'ID', name: 'Nombre' }
 * });
 * 
 * @example
 * // Con transformación de datos
 * exportToCsv(users, {
 *   filename: 'users.csv',
 *   rowTransformer: (user, index) => ({
 *     ...user,
 *     rowNumber: index + 1,
 *     active: user.active ? 'Sí' : 'No'
 *   })
 * });
 */
export function exportToCsv<T extends ExportableData>(
  data: T[],
  options?: CsvExportOptions<T>
): void {
  // Validación de datos
  if (!data || !Array.isArray(data) || data.length === 0) {
    return;
  }

  // Extraer opciones con valores por defecto
  const {
    filename = CSV_DEFAULTS.FILENAME,
    headers,
    delimiter = CSV_DEFAULTS.DELIMITER,
    includeBOM = true,
    rowTransformer,
  } = options ?? {};

  // Preparar datos para exportación
  let exportData: ExportableData[] = data;
  let csvHeaders: string[] = [];

  // Aplicar transformación de filas si existe
  if (rowTransformer) {
    exportData = data.map((item, index) => rowTransformer(item, index));
  }

  // Aplicar mapeo de headers si existe
  if (headers) {
    exportData = exportData.map((item) => {
      const mappedRow: ExportableData = {};
      Object.entries(headers).forEach(([sourceKey, targetHeader]) => {
        mappedRow[targetHeader] = item[sourceKey];
      });
      return mappedRow;
    });
    csvHeaders = Object.values(headers);
  }

  // Configurar papaparse
  const parseConfig: PapaParseConfig = {
    header: true,
    delimiter,
    skipEmptyLines: true,
    ...(csvHeaders.length > 0 && { columns: csvHeaders }),
  };

  // Generar contenido CSV
  const csvContent = Papa.unparse(exportData, parseConfig);

  // Crear y descargar archivo
  downloadCsvFile(csvContent, filename, includeBOM);
}

/**
 * Crea y descarga un archivo CSV
 * 
 * @param {string} content - Contenido del CSV
 * @param {string} filename - Nombre del archivo
 * @param {boolean} includeBOM - Incluir BOM para Excel
 */
function downloadCsvFile(content: string, filename: string, includeBOM: boolean): void {
  const finalContent = includeBOM ? CSV_DEFAULTS.BOM + content : content;
  const blob = new Blob([finalContent], { type: CSV_DEFAULTS.MIME_TYPE });
  const url = URL.createObjectURL(blob);

  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    // Liberar memoria del objeto URL
    URL.revokeObjectURL(url);
  }
}

/**
 * Exporta datos a CSV con delimitador de punto y coma (común en Excel Europa)
 * 
 * @template T - Tipo de los objetos del array
 * @param {T[]} data - Array de objetos a exportar
 * @param {Omit<CsvExportOptions<T>, 'delimiter'>} options - Opciones sin delimiter
 * 
 * @example
 * exportToCsvSemicolon(users, { filename: 'usuarios.csv' });
 */
export function exportToCsvSemicolon<T extends ExportableData>(
  data: T[],
  options?: Omit<CsvExportOptions<T>, 'delimiter'>
): void {
  exportToCsv(data, { ...options, delimiter: ';' });
}
