import { renderHook, act } from '@testing-library/react';
import useLoading from './useLoading';

describe('useLoading hook', () => {
  it('initially has loading=false and error=null', () => {
    const { result } = renderHook(() => useLoading());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('startLoading sets loading=true', () => {
    const { result } = renderHook(() => useLoading());
    act(() => {
      result.current.startLoading();
    });
    expect(result.current.loading).toBe(true);
  });

  it('endLoading sets loading=false', () => {
    const { result } = renderHook(() => useLoading());
    act(() => {
      result.current.startLoading();
      result.current.endLoading();
    });
    expect(result.current.loading).toBe(false);
  });

  it('setErrorMessage sets error message', () => {
    const { result } = renderHook(() => useLoading());
    act(() => {
      result.current.setErrorMessage('Something went wrong');
    });
    expect(result.current.error).toBe('Something went wrong');
  });

  it('clearError resets error to null', () => {
    const { result } = renderHook(() => useLoading());
    act(() => {
      result.current.setErrorMessage('Error');
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
