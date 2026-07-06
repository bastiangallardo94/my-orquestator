import { isExtensionAllowed, validateFileSize } from '../fileValidationUtils';

describe('fileValidationUtils', () => {
  describe('isExtensionAllowed', () => {
    it('returns true when allowedExtensions is empty', () => {
      const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
      expect(isExtensionAllowed([], file)).toBe(true);
    });

    it('returns true when file extension is in allowedExtensions', () => {
      const file = new File(['dummy'], 'image.JPG', { type: 'image/jpeg' });
      expect(isExtensionAllowed(['jpg', 'png'], file)).toBe(true);
    });

    it('returns false when file extension is not in allowedExtensions', () => {
      const file = new File(['dummy'], 'document.pdf', { type: 'application/pdf' });
      expect(isExtensionAllowed(['jpg', 'png'], file)).toBe(false);
    });

    it('handles case-insensitive extension comparison', () => {
      const file = new File(['dummy'], 'photo.PnG', { type: 'image/png' });
      expect(isExtensionAllowed(['jpg', 'png'], file)).toBe(true);
    });

    it('returns false when file has no extension', () => {
      const file = new File(['dummy'], 'filename', { type: 'text/plain' });
      expect(isExtensionAllowed(['txt'], file)).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('returns true when file size is under the limit', () => {
      const file = new File(['dummy'], 'small.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 }); // 1 KB
      expect(validateFileSize(file, 1)).toBe(true); // 1 MB limit
    });

    it('returns true when file size is exactly at the limit', () => {
      const file = new File(['dummy'], 'exact.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1 MB
      expect(validateFileSize(file, 1)).toBe(true);
    });

    it('returns false when file size exceeds the limit', () => {
      const file = new File(['dummy'], 'large.txt', { type: 'text/plain' });
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 }); // 2 MB
      expect(validateFileSize(file, 1)).toBe(false);
    });
  });
});
