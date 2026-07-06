import { render, screen } from '@testing-library/react';
import React from 'react';
import { SummaryBanner } from './SummaryBanner';
import { SummaryItem } from './SummaryBanner.types';

describe('SummaryBanner', () => {
  const items: SummaryItem[] = [
    { label: 'Result', content: 'Pending' },
    { label: 'Inspector', content: 'Jane Doe' },
    { label: 'Company', content: 'Acme Inc.' },
  ];

  it('renders the correct number of summary items', () => {
    render(<SummaryBanner items={items} />);
    const summaryItems = screen.getAllByText(/Pending|Jane Doe|Acme Inc./);
    expect(summaryItems).toHaveLength(3);
  });

  it('renders each label and content', () => {
    render(<SummaryBanner items={items} />);
    expect(screen.getByText('Result')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Inspector')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Acme Inc.')).toBeInTheDocument();
  });
});
