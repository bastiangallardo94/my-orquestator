import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Warning from './Warning';
import { StatesType } from '../../../types/states';

describe('Warning', () => {
    const defaultProps = {
        title: 'Warning Title',
        description: 'Warning description here',
        icon: 'warning-icon.svg',
        type: StatesType.WARNING,
    };

    it('renders title and description', () => {
        render(<Warning {...defaultProps} />);
        expect(screen.getByText('Warning Title')).toBeInTheDocument();
        expect(screen.getByText('Warning description here')).toBeInTheDocument();
    });

    it('renders the icon', () => {
        const { container } = render(<Warning {...defaultProps} />);
        expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('renders close button when closeable is true (default)', () => {
        render(<Warning {...defaultProps} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does NOT render close button when closeable is false', () => {
        render(<Warning {...defaultProps} closeable={false} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('hides the alert when close button is clicked', () => {
        render(<Warning {...defaultProps} />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('renders with ERROR type', () => {
        render(<Warning {...defaultProps} type={StatesType.ERROR} />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});
