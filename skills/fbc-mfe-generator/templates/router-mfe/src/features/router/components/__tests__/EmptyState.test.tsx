import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
    it('should render the provided message', () => {
        const testMessage = 'Test empty state message';
        render(<EmptyState message={testMessage} />);
        expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('should render the empty state image', () => {
        render(<EmptyState message="Test message" />);
        const image = screen.getByAltText('Empty state');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src');
    });

    it('should use custom alt text when provided', () => {
        const customAlt = 'Custom alt text';
        render(<EmptyState message="Test message" altText={customAlt} />);
        const image = screen.getByAltText(customAlt);
        expect(image).toBeInTheDocument();
    });

    it('should have correct styling classes', () => {
        const { container } = render(<EmptyState message="Test message" />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('maint-text-center', 'maint-py-12');
    });
});
