import { render, screen } from '@testing-library/react';
import React from 'react';
import Tag from './Tag';

describe('Tag', () => {
    it('renders without crashing', () => {
        render(<Tag />);
    });

    it('renders the Pendiente text', () => {
        render(<Tag />);
        expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('applies warning background class', () => {
        const { container } = render(<Tag />);
        expect(container.firstChild).toHaveClass('mf-bg-warning-primary');
    });
});
