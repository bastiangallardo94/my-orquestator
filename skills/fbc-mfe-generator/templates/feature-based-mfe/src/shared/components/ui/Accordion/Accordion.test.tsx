import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Accordion from './Accordion';

jest.mock('@shared/assets/images/chevron-down.svg', () => 'chevron-down');

describe('Accordion', () => {
    const header = <span>Header Content</span>;
    const content = <span>Body Content</span>;

    it('renders the header always', () => {
        render(<Accordion header={header} content={content} />);
        expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('hides content by default (collapsed)', () => {
        const { container } = render(<Accordion header={header} content={content} />);
        const contentWrapper = container.querySelector('.mf-max-h-0');
        expect(contentWrapper).toBeInTheDocument();
    });

    it('expands content when header is clicked', () => {
        const { container } = render(<Accordion header={header} content={content} />);
        const toggle = container.querySelector('.mf-cursor-pointer')!;
        fireEvent.click(toggle);
        expect(screen.getByText('Body Content')).toBeInTheDocument();
        const expandedWrapper = container.querySelector('.mf-max-h-screen');
        expect(expandedWrapper).toBeInTheDocument();
    });

    it('collapses content when header is clicked twice', () => {
        const { container } = render(<Accordion header={header} content={content} />);
        const toggle = container.querySelector('.mf-cursor-pointer')!;
        fireEvent.click(toggle);
        fireEvent.click(toggle);
        const collapsedWrapper = container.querySelector('.mf-max-h-0');
        expect(collapsedWrapper).toBeInTheDocument();
    });

    it('rotates chevron when expanded', () => {
        const { container } = render(<Accordion header={header} content={content} />);
        const toggle = container.querySelector('.mf-cursor-pointer')!;
        fireEvent.click(toggle);
        const chevron = screen.getByAltText('chevron-down');
        expect(chevron).toHaveClass('mf-rotate-180');
    });
});
