import { renderHook, act } from '@testing-library/react';
import useUser from './useUser';
import userService from '@services/userService';

jest.mock('@services/userService', () => ({
  __esModule: true,
  default: {
    getUserInformation: jest.fn(),
  },
}));

describe('useUser', () => {
  const mockUserData = { id: '1', name: 'John Doe', email: 'john@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('exposes a getUserData function', () => {
    const { result } = renderHook(() => useUser());
    expect(typeof result.current.getUserData).toBe('function');
  });

  it('fetches user data and stores it in localStorage', async () => {
    (userService.getUserInformation as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.getUserData();
    });

    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    expect(stored).toEqual(mockUserData);
  });

  it('logs an error when the service fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (userService.getUserInformation as jest.Mock).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.getUserData();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching user data:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('does not write to localStorage when the service fails', async () => {
    (userService.getUserInformation as jest.Mock).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.getUserData();
    });

    expect(localStorage.getItem('user')).toBeNull();
  });
});
