import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExamplePage } from '../ExamplePage';

// TODO: Update these tests for your actual feature

describe('ExamplePage', () => {
  it('renders without crashing', () => {
    render(<ExamplePage />);
    expect(screen.getByText(/Example Feature Page/i)).toBeInTheDocument();
  });

  // TODO: Add more tests
  // it('handles user interaction', () => { ... });
  // it('displays data correctly', () => { ... });
});
