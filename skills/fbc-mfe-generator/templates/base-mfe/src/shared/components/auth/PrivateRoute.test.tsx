import { render, screen } from '@testing-library/react';
import React from 'react';
import { PrivateRoute } from './PrivateRoute';

// Mock react-router-dom Navigate
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: any) => <div>Redirected to {to}</div>,
}));

// Mock useAppSelector
const mockUseAppSelector = jest.fn();
jest.mock('@infrastructure/store/hooks/useStore', () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

describe('PrivateRoute', () => {
  it('renders children when user is logged in', () => {
    mockUseAppSelector.mockReturnValue(true); // isLogged = true

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to "/" when user is not logged in', () => {
    mockUseAppSelector.mockReturnValue(false); // isLogged = false

    render(
      <PrivateRoute>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText('Redirected to /')).toBeInTheDocument();
  });
});
