import { renderHook } from '@testing-library/react';
import { useAuditInfo } from './useAuditInfo';

// Mock Redux selector
jest.mock('@infrastructure/store/hooks/useStore', () => ({
  useAppSelector: jest.fn(),
}));

// Mock token utils
jest.mock('@shared/utils/tokenUtils', () => ({
  safeDecodeToken: jest.fn(),
  extractUserInfo: jest.fn(),
}));

import { useAppSelector } from '@infrastructure/store/hooks/useStore';
import { safeDecodeToken, extractUserInfo } from '@shared/utils/tokenUtils';

describe('useAuditInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns userEmail and userName from decoded token', () => {
    (useAppSelector as jest.Mock).mockReturnValue('mock-token');
    (safeDecodeToken as jest.Mock).mockReturnValue({ decoded: true });
    (extractUserInfo as jest.Mock).mockReturnValue({
      email: 'john@example.com',
      name: 'John Doe',
    });

    const { result } = renderHook(() => useAuditInfo());

    expect(useAppSelector).toHaveBeenCalled();
    expect(safeDecodeToken).toHaveBeenCalledWith('mock-token');
    expect(extractUserInfo).toHaveBeenCalledWith({ decoded: true });

    expect(result.current).toEqual({
      userEmail: 'john@example.com',
      userName: 'John Doe',
    });
  });

  it('returns empty strings when user info is missing', () => {
    (useAppSelector as jest.Mock).mockReturnValue('token');
    (safeDecodeToken as jest.Mock).mockReturnValue({});
    (extractUserInfo as jest.Mock).mockReturnValue({});

    const { result } = renderHook(() => useAuditInfo());

    expect(result.current).toEqual({
      userEmail: '',
      userName: '',
    });
  });

  it('memoizes the returned object', () => {
    (useAppSelector as jest.Mock).mockReturnValue('token');
    (safeDecodeToken as jest.Mock).mockReturnValue({});
    (extractUserInfo as jest.Mock).mockReturnValue({
      email: 'a@b.com',
      name: 'Alice',
    });

    const { result, rerender } = renderHook(() => useAuditInfo());

    const first = result.current;

    rerender();

    const second = result.current;

    // Same reference → memoization working
    expect(second).toBe(first);
  });
});
