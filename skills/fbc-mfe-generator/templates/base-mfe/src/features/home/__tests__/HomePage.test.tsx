import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../HomePage';

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
  });

  it('displays quick start section', () => {
    render(<HomePage />);
    expect(screen.getByText(/Quick Start/i)).toBeInTheDocument();
  });

  it('displays what\'s included section', () => {
    render(<HomePage />);
    expect(screen.getByText(/What's Included/i)).toBeInTheDocument();
  });
});
