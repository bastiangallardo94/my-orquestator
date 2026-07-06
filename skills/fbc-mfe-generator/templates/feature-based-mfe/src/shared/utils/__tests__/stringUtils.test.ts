import { keepOnlyNumbers } from '../stringUtils';

describe('keepOnlyNumbers', () => {
  it('removes all non-numeric characters', () => {
    expect(keepOnlyNumbers('abc123def456')).toBe('123456');
  });

  it('returns empty string for empty input', () => {
    expect(keepOnlyNumbers('')).toBe('');
  });

  it('returns empty string for null-like falsy input', () => {
    expect(keepOnlyNumbers(null as any)).toBe('');
  });

  it('returns empty string for undefined-like falsy input', () => {
    expect(keepOnlyNumbers(undefined as any)).toBe('');
  });

  it('returns only digits from a phone number format', () => {
    expect(keepOnlyNumbers('+1 (800) 555-1234')).toBe('18005551234');
  });

  it('returns the same string when input is already numeric', () => {
    expect(keepOnlyNumbers('1234567890')).toBe('1234567890');
  });

  it('returns empty string for input with no digits', () => {
    expect(keepOnlyNumbers('abc!@#')).toBe('');
  });

  it('handles spaces correctly', () => {
    expect(keepOnlyNumbers('1 2 3')).toBe('123');
  });
});
