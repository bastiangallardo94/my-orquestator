import { renderHook, act } from '@testing-library/react';
import { useGlobalDrawerState } from './useGlobalDrawerState';

describe('useGlobalDrawerState', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    delete (window as any).GlobalStoreInstance;
  });

  it('hydrates initial state from localStorage', () => {
    window.localStorage.setItem('mf-template-drawer-open', 'true');

    const { result } = renderHook(() => useGlobalDrawerState());

    expect(result.current.isOpen).toBe(true);
  });

  it('uses defaultOpen when no localStorage value', () => {
    const { result } = renderHook(() =>
      useGlobalDrawerState({ defaultOpen: true })
    );

    expect(result.current.isOpen).toBe(true);
  });

  it('setOpen updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useGlobalDrawerState());

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.isOpen).toBe(true);
    expect(window.localStorage.getItem('mf-template-drawer-open')).toBe('true');
  });

  it('toggle flips the state', () => {
    const { result } = renderHook(() => useGlobalDrawerState());

    act(() => {
      result.current.setOpen(false);
    });
    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('forceClose sets state to false', () => {
    const { result } = renderHook(() => useGlobalDrawerState());

    act(() => {
      result.current.setOpen(true);
    });
    act(() => {
      result.current.forceClose();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('responds to GlobalStoreInstance updates', () => {
    const subscribeMock = jest.fn((_ns, cb) => {
      // Immediately simulate a slice update
      cb({ configuration: { openDrawer: true } });
      return jest.fn(); // unsub function
    });
    (window as any).GlobalStoreInstance = {
      SubscribeToGlobalState: subscribeMock,
    };

    const { result } = renderHook(() => useGlobalDrawerState());

    expect(subscribeMock).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(true);
  });
});
