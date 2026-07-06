import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorModal } from './ErrorModal';

// Mock icon import
jest.mock('../../assets/images/cancel-icon-modal.svg', () => 'mock-error-icon.svg');

// Mock ErrorContext
jest.mock('../../../context/ErrorContext', () => ({
  useError: jest.fn(),
}));

import { useError } from '../../../context/ErrorContext';

// Mock MUI Dialog components
jest.mock('@mui/material', () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogActions: ({ children }: any) => <div>{children}</div>,
  Button: ({ children, onClick }: any) => (
    <button data-testid="close-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe('ErrorModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when error.isOpen=false', () => {
    (useError as jest.Mock).mockReturnValue({
      error: { isOpen: false },
      hideError: jest.fn(),
    });

    const { container } = render(<ErrorModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when error.isOpen=true', () => {
    (useError as jest.Mock).mockReturnValue({
      error: {
        isOpen: true,
        title: 'Error Title',
        message: 'Something went wrong',
      },
      hideError: jest.fn(),
    });

    render(<ErrorModal />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls hideError when close button is clicked', () => {
    const mockHide = jest.fn();

    (useError as jest.Mock).mockReturnValue({
      error: {
        isOpen: true,
        title: 'Error Title',
        message: 'Something went wrong',
      },
      hideError: mockHide,
    });

    render(<ErrorModal />);

    fireEvent.click(screen.getByTestId('close-button'));

    expect(mockHide).toHaveBeenCalledTimes(1);
  });
});
