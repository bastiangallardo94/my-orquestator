import { buildQueryParams } from '../queryParams';

describe('buildQueryParams', () => {
  it('returns all non-empty params', () => {
    const result = buildQueryParams({ a: 1, b: 'hello', c: true });
    expect(result).toEqual({ a: 1, b: 'hello', c: true });
  });

  it('removes undefined values', () => {
    const result = buildQueryParams({ a: 1, b: undefined });
    expect(result).toEqual({ a: 1 });
  });

  it('removes null values', () => {
    const result = buildQueryParams({ a: 1, b: null });
    expect(result).toEqual({ a: 1 });
  });

  it('removes empty string values', () => {
    const result = buildQueryParams({ a: 1, b: '' });
    expect(result).toEqual({ a: 1 });
  });

  it('returns empty object when all values are falsy', () => {
    const result = buildQueryParams({ a: undefined, b: null, c: '' });
    expect(result).toEqual({});
  });

  it('returns empty object when input is empty', () => {
    const result = buildQueryParams({});
    expect(result).toEqual({});
  });

  it('keeps zero as a valid value', () => {
    const result = buildQueryParams({ page: 0 });
    expect(result).toEqual({ page: 0 });
  });

  it('keeps false as a valid value', () => {
    const result = buildQueryParams({ active: false });
    expect(result).toEqual({ active: false });
  });

  it('keeps arrays as valid values', () => {
    const result = buildQueryParams({ ids: [1, 2, 3] });
    expect(result).toEqual({ ids: [1, 2, 3] });
  });
});
