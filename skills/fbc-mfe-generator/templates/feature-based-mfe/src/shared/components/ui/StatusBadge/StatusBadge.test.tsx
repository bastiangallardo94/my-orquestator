import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('returns "-" directly when status is "-"', () => {
    const { container } = render(<StatusBadge status="-" />);
    expect(container.textContent).toBe('-');
  });

  it('applies approved class for approved-like statuses', () => {
    const statuses = ['Aprobado', 'Approved', 'Released'];

    statuses.forEach(status => {
      render(<StatusBadge status={status} />);
      const el = screen.getByText(status);
      expect(el).toHaveClass('status-badge', 'status-approved');
    });
  });

  it('applies rejected class for rejected-like statuses', () => {
    const statuses = ['Rechazado', 'Rejected', 'Canceled'];

    statuses.forEach(status => {
      render(<StatusBadge status={status} />);
      const el = screen.getByText(status);
      expect(el).toHaveClass('status-badge', 'status-rejected');
    });
  });

  it('applies default class when no rule matches', () => {
    render(<StatusBadge status="Unknown" />);
    const el = screen.getByText('Unknown');
    expect(el).toHaveClass('status-badge');
    expect(el).not.toHaveClass('status-pending', 'status-approved', 'status-rejected');
  });

  it('renders "N/A" when status is empty string', () => {
    render(<StatusBadge status="" />);
    const el = screen.getByText('N/A');
    expect(el).toHaveClass('status-badge');
  });

  it('renders pending class when status contains "pend"', () => {
    render(<StatusBadge status="Pending Approval" />);
    const el = screen.getByText('Pending Approval');
    expect(el).toHaveClass('status-badge', 'status-pending');
  });
});
