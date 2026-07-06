import { safeDecodeToken, extractRoles, extractUserInfo } from '../tokenUtils';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn((token: string) => {
    if (token === 'invalid') throw new Error('Invalid token');
    return {
      sub: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      preferred_username: 'testuser',
      given_name: 'Test',
      family_name: 'User',
      realm_access: { roles: ['realm-role'] },
      resource_access: {
        rim: { roles: ['ADMIN', 'USER'] },
        other: { roles: ['OTHER_ROLE'] }
      }
    };
  })
}));

describe('tokenUtils', () => {
  describe('safeDecodeToken', () => {
    it('should decode valid token', () => {
      const result = safeDecodeToken('valid-token');
      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null for invalid token', () => {
      const result = safeDecodeToken('invalid');
      expect(result).toBeNull();
    });

    it('should return null for null/undefined', () => {
      expect(safeDecodeToken(null)).toBeNull();
      expect(safeDecodeToken(undefined)).toBeNull();
    });
  });

  describe('extractRoles', () => {
    it('should extract roles from preferred client', () => {
      const decoded = safeDecodeToken('valid-token');
      const roles = extractRoles(decoded, 'rim');
      expect(roles).toContain('ADMIN');
      expect(roles).toContain('USER');
    });

    it('should include realm roles', () => {
      const decoded = safeDecodeToken('valid-token');
      const roles = extractRoles(decoded, 'rim');
      expect(roles).toContain('realm-role');
    });

    it('should return empty array for null decoded', () => {
      expect(extractRoles(null)).toEqual([]);
    });
  });

  describe('extractUserInfo', () => {
    it('should extract user info from token', () => {
      const decoded = safeDecodeToken('valid-token');
      const info = extractUserInfo(decoded);
      expect(info.userId).toBe('user-123');
      expect(info.email).toBe('test@example.com');
      expect(info.name).toBe('Test User');
      expect(info.username).toBe('testuser');
    });

    it('should return empty values for null decoded', () => {
      const info = extractUserInfo(null);
      expect(info.userId).toBe('');
      expect(info.email).toBe('');
      expect(info.name).toBe('');
      expect(info.username).toBe('');
    });
  });
});
