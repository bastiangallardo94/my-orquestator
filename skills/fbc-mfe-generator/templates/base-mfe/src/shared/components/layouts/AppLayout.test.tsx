import { render, screen } from '@testing-library/react';
import React from 'react';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('renders children inside the main container', () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    // Check that the child content is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Check that the main container exists
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();

    // Verify that the main element has the expected classes
    expect(mainElement).toHaveClass('{{CSS_PREFIX}}container');
    expect(mainElement).toHaveClass('{{CSS_PREFIX}}mx-auto');
    expect(mainElement).toHaveClass('{{CSS_PREFIX}}px-4');
    expect(mainElement).toHaveClass('{{CSS_PREFIX}}pb-8');
    expect(mainElement).toHaveClass('{{CSS_PREFIX}}bg-white');
  });

  it('renders the outer div with correct classes', () => {
    const { container } = render(
      <AppLayout>
        <span>Child</span>
      </AppLayout>
    );
    const outerDiv = container.querySelector('div');
    expect(outerDiv).toHaveClass('{{CSS_PREFIX}}bg-white');
    // mf-min-h-screen removed to avoid double scroll in portal
  });
});
