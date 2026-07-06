import { render, screen } from '@testing-library/react';
import React from 'react';
import { Loading } from './Loading';

describe('Loading', () => {
    it('renders spinner when isLoading is true', () => {
        const { container } = render(<Loading isLoading={true} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders nothing when isLoading is false', () => {
        const { container } = render(<Loading isLoading={false} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders overlay element when loading', () => {
        const { container } = render(<Loading isLoading={true} />);
        const overlay = container.querySelector('.mf-fixed');
        expect(overlay).toBeInTheDocument();
    });
});
