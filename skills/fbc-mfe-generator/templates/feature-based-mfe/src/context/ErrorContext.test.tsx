import { renderHook } from '@testing-library/react';
import { act } from 'react';
import React from 'react';
import { ErrorProvider, useError } from './ErrorContext';

describe('ErrorContext', () => {
  it('should provide default error state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorProvider>{children}</ErrorProvider>
    );

    const { result } = renderHook(() => useError(), { wrapper });

    expect(result.current.error).toEqual({
      title: '',
      message: '',
      isOpen: false
    });
  });

  it('should update error state when showError is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorProvider>{children}</ErrorProvider>
    );

    const { result } = renderHook(() => useError(), { wrapper });

    act(() => {
      result.current.showError('Test Title', 'Test Message');
    });

    expect(result.current.error).toEqual({
      title: 'Test Title',
      message: 'Test Message',
      isOpen: true
    });
  });

  it('should close error when hideError is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorProvider>{children}</ErrorProvider>
    );

    const { result } = renderHook(() => useError(), { wrapper });

    act(() => {
      result.current.showError('Oops', 'Something went wrong');
    });

    act(() => {
      result.current.hideError();
    });

    expect(result.current.error).toEqual({
      title: 'Oops',
      message: 'Something went wrong',
      isOpen: false
    });
  });
});
