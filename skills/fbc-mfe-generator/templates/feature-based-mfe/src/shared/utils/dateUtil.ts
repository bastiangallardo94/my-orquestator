export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const year = date.getFullYear();

  const fechaFinal = `${year}-${month}-${day}`;

  return fechaFinal;
};

/**
 * 
 * @param date la fecha que se quiere convertir
 * @returns un string que sigue el formato YYYY-MM-DD
 */
export const formatDateCustom = (date: Date): string  => {
  const year = date.getFullYear();
  // Month is zero-indexed, so add 1 and pad with '0'
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * 
 * @param stringDate el string que se quiere convertir
 * @returns un objeto Date
 */
export const stringToDate = (stringDate: string): Date  => {
  return new Date(stringDate)
}