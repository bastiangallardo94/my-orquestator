/**
 * isExtensionAllowed
 * @param allowedExtensions a string array of allowed extensions, if the array is empty all extensions are allowed
 * @param file the file whose extension we want to check
 * @returns true if the file's extension is in the allowedExtensions array
 */
export const isExtensionAllowed = (allowedExtensions: string[], file: File): boolean => {
  if (!allowedExtensions || allowedExtensions.length === 0) return true;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.map(e => e.toLowerCase()).includes(ext) : false;
};

/**
 * Validates whether a file complies with the maximum size.
 *
 * @param file - The file to validate
 * @param maxSizeInMB - The maximum size allowed in megabytes
 * @returns true if the file size is within the limit, false otherwise
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // convert MB → bytes
  return file.size <= maxSizeInBytes;
}
