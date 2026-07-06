/**
 * Converts a string in ALL CAPS to Title Case:
 * First letter of each word capitalized, rest lowercase.
 *
 * @param input - The string to convert
 * @returns The converted string
 */
export function capitalizeWords(input: string): string {
  return input
    .toLowerCase() // make everything lowercase first
    .replace(/\b\w/g, char => char.toUpperCase()); // capitalize first letter of each word
}
