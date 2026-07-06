import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableSkeleton } from './TableSkeleton';

// Mock react-loading-skeleton to avoid style injection noise
jest.mock('react-loading-skeleton', () => (props: any) => (
  <div data-testid="skeleton" {...props} />
));

describe('TableSkeleton', () => {
  it('renders 6 skeleton rows', () => {
    render(<TableSkeleton columns={4} />);

    // There should be 6 row containers
    const rows = document.querySelectorAll('.mf-flex.mf-flex-row.mf-mt-2');
    expect(rows.length).toBe(6);
  });

  it('renders the correct number of skeleton columns per row', () => {
    render(<TableSkeleton columns={3} />);

    // Each row should contain 3 skeletons
    const rows = document.querySelectorAll('.mf-flex.mf-flex-row.mf-mt-2');

    rows.forEach(row => {
      const skeletons = row.querySelectorAll('[data-testid="skeleton"]');
      expect(skeletons.length).toBe(3);
    });
  });

  it('renders Skeleton components', () => {
    render(<TableSkeleton columns={2} />);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBe(6 * 2); // 6 rows × 2 columns
  });
});
