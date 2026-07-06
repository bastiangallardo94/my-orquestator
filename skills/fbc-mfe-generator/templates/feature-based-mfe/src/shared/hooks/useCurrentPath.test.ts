import { renderHook, act } from '@testing-library/react';
import { useCurrentPath } from './useCurrentPath';

describe('useCurrentPath', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.pathname
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/initial-path' },
    });

    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original location object
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('initializes with current window.location.pathname', () => {
    const { result } = renderHook(() => useCurrentPath());
    expect(result.current.currentPath).toBe('/initial-path');
  });

  it('updates currentPath when single-spa:routing-event fires', () => {
    const { result } = renderHook(() => useCurrentPath());

    act(() => {
      window.location.pathname = '/new-route';
      window.dispatchEvent(new Event('single-spa:routing-event'));
    });

    expect(result.current.currentPath).toBe('/new-route');
  });

  it('updates currentPath when popstate event fires', () => {
    const { result } = renderHook(() => useCurrentPath());

    act(() => {
      window.location.pathname = '/popstate-route';
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.currentPath).toBe('/popstate-route');
  });

  it('removes event listeners on unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useCurrentPath());

    expect(addSpy).toHaveBeenCalledWith(
      'single-spa:routing-event',
      expect.any(Function)
    );
    expect(addSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      'single-spa:routing-event',
      expect.any(Function)
    );
    expect(removeSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
  });
});
