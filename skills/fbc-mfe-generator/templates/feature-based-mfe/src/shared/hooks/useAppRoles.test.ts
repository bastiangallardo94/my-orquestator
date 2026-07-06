import { renderHook } from '@testing-library/react';
import { useAppRoles } from './useAppRoles';

// Mock Redux selector
jest.mock('@infrastructure/store/hooks/useStore', () => ({
  useAppSelector: jest.fn(),
}));

// Mock token utils
jest.mock('../utils/tokenUtils', () => ({
  safeDecodeToken: jest.fn(),
  extractRoles: jest.fn(),
  extractUserInfo: jest.fn(),
  buildAuditStamp: jest.fn(),
}));

import { useAppSelector } from '@infrastructure/store/hooks/useStore';
import {
  safeDecodeToken,
  extractRoles,
  extractUserInfo,
  buildAuditStamp,
} from '../utils/tokenUtils';

describe('useAppRoles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns roles, username, and auditStamp from decoded token', () => {
    // Mock Redux token
    (useAppSelector as jest.Mock).mockReturnValue('mock-token');

    // Mock decoded token
    (safeDecodeToken as jest.Mock).mockReturnValue({ decoded: true });

    // Mock roles
    (extractRoles as jest.Mock).mockReturnValue(['admin', 'user']);

    // Mock user info
    (extractUserInfo as jest.Mock).mockReturnValue({
      name: 'John Doe',
      email: 'john@example.com',
      userId: '123',
    });

    // Mock audit stamp
    (buildAuditStamp as jest.Mock).mockReturnValue({
      userId: '123',
      email: 'john@example.com',
      name: 'John Doe',
      roles: ['admin', 'user'],
    });

    const { result } = renderHook(() => useAppRoles());

    expect(useAppSelector).toHaveBeenCalled();
    expect(safeDecodeToken).toHaveBeenCalledWith('mock-token');
    expect(extractRoles).toHaveBeenCalledWith({ decoded: true }, 'ftp-client');
    expect(extractUserInfo).toHaveBeenCalledWith({ decoded: true });
    expect(buildAuditStamp).toHaveBeenCalledWith(
      { name: 'John Doe', email: 'john@example.com', userId: '123' },
      ['admin', 'user']
    );

    expect(result.current).toEqual({
      roles: ['admin', 'user'],
      username: 'John Doe',
      auditStamp: {
        userId: '123',
        email: 'john@example.com',
        name: 'John Doe',
        roles: ['admin', 'user'],
      },
    });
  });

  it('uses provided clientId when extracting roles', () => {
    (useAppSelector as jest.Mock).mockReturnValue('token');
    (safeDecodeToken as jest.Mock).mockReturnValue({});
    (extractRoles as jest.Mock).mockReturnValue(['viewer']);
    (extractUserInfo as jest.Mock).mockReturnValue({ name: 'Alice' });
    (buildAuditStamp as jest.Mock).mockReturnValue({});

    renderHook(() => useAppRoles('custom-client'));

    expect(extractRoles).toHaveBeenCalledWith({}, 'custom-client');
  });
});
