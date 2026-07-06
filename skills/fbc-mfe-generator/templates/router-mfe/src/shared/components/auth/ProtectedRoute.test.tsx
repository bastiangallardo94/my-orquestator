import { render, screen } from '@testing-library/react';
import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';

// Mock AccessDenied component
jest.mock('@shared/components/ui/AccessDenied', () => ({
  AccessDenied: ({ requiredRoles }: any) => (
    <div>AccessDenied for roles: {requiredRoles.join(', ')}</div>
  ),
}));

// Mock useAppRoles
const mockUseAppRoles = jest.fn();
jest.mock('@shared/hooks/useAppRoles', () => ({
  useAppRoles: () => mockUseAppRoles(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {}); // silence warnings
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when user has required role', () => {
    mockUseAppRoles.mockReturnValue({ roles: ['ADMIN'] });

    render(
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders AccessDenied when user lacks required role and showAccessDenied=true', () => {
    mockUseAppRoles.mockReturnValue({ roles: ['USER'] });

    render(
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/AccessDenied for roles: ADMIN/)).toBeInTheDocument();
  });

  it('renders nothing when user lacks required role and showAccessDenied=false', () => {
    mockUseAppRoles.mockReturnValue({ roles: ['USER'] });

    const { container } = render(
      <ProtectedRoute requiredRoles={['ADMIN']} showAccessDenied={false}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('role comparison is case-insensitive', () => {
    mockUseAppRoles.mockReturnValue({ roles: ['admin'] });

    render(
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
