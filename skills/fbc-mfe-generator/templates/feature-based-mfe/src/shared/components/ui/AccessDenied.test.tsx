import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AccessDenied } from './AccessDenied';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('@mui/material', () => ({
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

describe('AccessDenied', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the access denied title', () => {
        render(<AccessDenied />);
        expect(screen.getByText('common.accessDenied')).toBeInTheDocument();
    });

    it('renders the default message', () => {
        render(<AccessDenied />);
        expect(screen.getByText('common.accessDeniedMessage')).toBeInTheDocument();
    });

    it('renders a custom message when provided', () => {
        render(<AccessDenied message="Custom error message" />);
        expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('renders go back and go home buttons', () => {
        render(<AccessDenied />);
        expect(screen.getByText('common.goBack')).toBeInTheDocument();
        expect(screen.getByText('common.goHome')).toBeInTheDocument();
    });

    it('navigates back when Go Back button is clicked', () => {
        render(<AccessDenied />);
        fireEvent.click(screen.getByText('common.goBack'));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('navigates to /home when Go Home button is clicked', () => {
        render(<AccessDenied />);
        fireEvent.click(screen.getByText('common.goHome'));
        expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('renders required roles when provided', () => {
        render(<AccessDenied requiredRoles={['ADMIN', 'MANAGER']} />);
        expect(screen.getByText('ADMIN')).toBeInTheDocument();
        expect(screen.getByText('MANAGER')).toBeInTheDocument();
    });

    it('renders required roles section label when roles are present', () => {
        render(<AccessDenied requiredRoles={['ADMIN']} />);
        expect(screen.getByText('common.requiredRoles')).toBeInTheDocument();
    });

    it('does NOT render required roles section when no roles are provided', () => {
        render(<AccessDenied />);
        expect(screen.queryByText('common.requiredRoles')).not.toBeInTheDocument();
    });

    it('renders help text at the bottom', () => {
        render(<AccessDenied />);
        expect(screen.getByText('common.accessDeniedHelp')).toBeInTheDocument();
    });
});
