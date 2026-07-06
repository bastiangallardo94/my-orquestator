import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { ToastContext } from './toast.context';

describe('ToastContext', () => {
  it('provides default showToast and hideToast methods', () => {
    let capturedContext: any;

    const TestComponent = () => {
      capturedContext = useContext(ToastContext);
      return null;
    };

    render(<TestComponent />);

    expect(capturedContext.showToast).toBeDefined();
    expect(typeof capturedContext.showToast).toBe('function');
    expect(capturedContext.hideToast).toBeDefined();
    expect(typeof capturedContext.hideToast).toBe('function');
  });

  it('default showToast does not throw when called', () => {
    let capturedContext: any;

    const TestComponent = () => {
      capturedContext = useContext(ToastContext);
      return null;
    };

    render(<TestComponent />);

    expect(() =>
      capturedContext.showToast({ message: 'test', status: 'success' })
    ).not.toThrow();
  });

  it('default hideToast does not throw when called', () => {
    let capturedContext: any;

    const TestComponent = () => {
      capturedContext = useContext(ToastContext);
      return null;
    };

    render(<TestComponent />);

    expect(() => capturedContext.hideToast()).not.toThrow();
  });
});
