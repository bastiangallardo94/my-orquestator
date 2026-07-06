import { formatDate, formatDateCustom, stringToDate } from '../dateUtil';

describe('formatDate', () => {
  it('formats a standard date correctly', () => {
    const d = new Date(2023, 0, 5); // Jan 5, 2023
    expect(formatDate(d)).toBe('2023-01-05');
  });

  it('pads single-digit month and day', () => {
    const d = new Date(2023, 8, 9); // Sep 9, 2023
    expect(formatDate(d)).toBe('2023-09-09');
  });

  it('handles end of year', () => {
    const d = new Date(2023, 11, 31); // Dec 31, 2023
    expect(formatDate(d)).toBe('2023-12-31');
  });
});

describe('formatDateCustom', () => {
  it('formats date in YYYY-MM-DD format', () => {
    const d = new Date(2024, 6, 15); // Jul 15, 2024
    expect(formatDateCustom(d)).toBe('2024-07-15');
  });

  it('pads month and day correctly', () => {
    const d = new Date(2024, 2, 3); // Mar 3, 2024
    expect(formatDateCustom(d)).toBe('2024-03-03');
  });
});

describe('stringToDate', () => {
  it('converts a valid string to Date', () => {
    const str = '2025-12-19';
    const d = stringToDate(str);
    expect(d).toBeInstanceOf(Date);
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(11); // December is 11
  });

  it('handles ISO string with time', () => {
    const str = '2025-12-19T14:18:00';
    const d = stringToDate(str);
    expect(d.getFullYear()).toBe(2025);
    expect(d.getMonth()).toBe(11);
    expect(d.getDate()).toBe(19);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(18);
  });
});
