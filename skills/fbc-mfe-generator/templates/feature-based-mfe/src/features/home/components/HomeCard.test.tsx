import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { navigateToUrl } from 'single-spa';
import { HomeCard } from './HomeCard';

jest.mock('single-spa', () => ({
  navigateToUrl: jest.fn(),
}));

// Mock window.location.assign
const mockAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: { assign: mockAssign },
  writable: true,
});

describe('HomeCard', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    path: '/test-path',
  };

  it('renders title, description, and fallback image', () => {
    render(<HomeCard {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Test Title'); // default alt
    expect(img).toHaveAttribute('src'); // fallback icon is used
  });

  it('renders custom image when provided', () => {
    render(<HomeCard {...defaultProps} imageSrc="/custom.png" imageAlt="Custom" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/custom.png');
    expect(img).toHaveAttribute('alt', 'Custom');
  });

  it('calls navigateToUrl when clicked', () => {
    render(<HomeCard {...defaultProps} />);

    fireEvent.click(screen.getByTestId('template-card'), { detail: 1 });


    expect(navigateToUrl).toHaveBeenCalledTimes(1);
    expect(navigateToUrl).toHaveBeenCalledWith('/test-path');
  });

  it('falls back to window.location.assign if navigateToUrl throws', () => {
    (navigateToUrl as jest.Mock).mockImplementation(() => {
      throw new Error('Navigation failed');
    });

    render(<HomeCard {...defaultProps} />);

    fireEvent.click(screen.getByTestId('template-card'), { detail: 1 });

    expect(mockAssign).toHaveBeenCalledWith('/test-path');
  });

  it('navigates when pressing Enter or Space', () => {
    render(<HomeCard {...defaultProps} />);

    const card = screen.getByTestId('template-card');
    fireEvent.keyDown(card, { key: 'Enter' });

    fireEvent.keyDown(card, { key: ' ' });
    expect(navigateToUrl).toHaveBeenCalledTimes(4);

  });

  it('updates hover state on mouse enter/leave (no visual test, but ensures no crash)', () => {
    render(<HomeCard {...defaultProps} />);

    const card = screen.getByTestId('template-card');

    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);

    // No state exposed, so we just ensure no errors occur
    expect(card).toBeInTheDocument();
  });
});
