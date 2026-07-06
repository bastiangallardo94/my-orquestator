import { renderHook } from '@testing-library/react';
import { useTenantParams } from './useTenantParams';

// Mock useAppSelector
jest.mock('@infrastructure/store/hooks/useStore', () => ({
  useAppSelector: jest.fn(),
}));

import { useAppSelector } from '@infrastructure/store/hooks/useStore';

describe('useTenantParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty strings and false when no tenant selected', () => {
    (useAppSelector as jest.Mock).mockReturnValue(undefined);

    const { result } = renderHook(() => useTenantParams());

    expect(result.current.bu).toBe('');
    expect(result.current.country).toBe('');
    expect(result.current.isReady).toBe(false);
    expect(result.current.selectedTenant).toBeUndefined();
  });

  it('returns bu and country when tenant is present', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      commerce: { name: 'Falabella ' },
      country: { name: ' Chile ' },
    });

    const { result } = renderHook(() => useTenantParams());

    expect(result.current.bu).toBe('Falabella'); // trimmed
    expect(result.current.country).toBe('Chile'); // trimmed
    expect(result.current.isReady).toBe(true);
    expect(result.current.selectedTenant).toEqual({
      commerce: { name: 'Falabella ' },
      country: { name: ' Chile ' },
    });
  });

  it('returns empty bu if commerce name missing', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      country: { name: 'Chile' },
    });

    const { result } = renderHook(() => useTenantParams());

    expect(result.current.bu).toBe('');
    expect(result.current.country).toBe('Chile');
    expect(result.current.isReady).toBe(false);
  });

  it('returns empty country if country name missing', () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      commerce: { name: 'Falabella' },
    });

    const { result } = renderHook(() => useTenantParams());

    expect(result.current.bu).toBe('Falabella');
    expect(result.current.country).toBe('');
    expect(result.current.isReady).toBe(false);
  });
});
