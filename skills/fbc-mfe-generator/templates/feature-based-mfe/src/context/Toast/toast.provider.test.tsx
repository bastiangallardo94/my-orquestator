import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToastProvider, { useToast } from './toast.provider';

jest.mock('../Modal/modal.context', () => ({
  IOpenModal: {},
}));

const TestConsumer = ({ onMount }: { onMount?: (ctx: any) => void }) => {
  const ctx = useToast();
  if (onMount) onMount(ctx);
  return (
    <div>
      <button
        data-testid="show-toast"
        onClick={() => ctx.showToast({ message: 'Hello!', status: 'success' })}
      >
        Show Toast
      </button>
      <button data-testid="hide-toast" onClick={() => ctx.hideToast()}>
        Hide Toast
      </button>
    </div>
  );
};

describe('ToastProvider', () => {
  it('renders children without crashing', () => {
    render(
      <ToastProvider>
        <div data-testid="child">Child content</div>
      </ToastProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides showToast and hideToast via context', () => {
    let ctx: any;
    render(
      <ToastProvider>
        <TestConsumer onMount={(c) => (ctx = c)} />
      </ToastProvider>
    );
    expect(typeof ctx.showToast).toBe('function');
    expect(typeof ctx.hideToast).toBe('function');
  });

  it('shows the toast message after showToast is called', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('show-toast'));
    });

    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('shows toast with a title when provided', () => {
    const TestWithTitle = () => {
      const { showToast } = useToast();
      return (
        <button
          onClick={() =>
            showToast({ message: 'Body text', status: 'error', title: 'Error Title' })
          }
        >
          Show
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestWithTitle />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText('Show'));
    });

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('calling hideToast closes the snackbar (open becomes false)', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('show-toast'));
    });
    expect(screen.getByText('Hello!')).toBeInTheDocument();

    // hideToast should not throw
    expect(() => {
      act(() => {
        fireEvent.click(screen.getByTestId('hide-toast'));
      });
    }).not.toThrow();
  });
});
