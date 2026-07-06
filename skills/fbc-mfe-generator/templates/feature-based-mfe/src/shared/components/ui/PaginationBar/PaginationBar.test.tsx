import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PaginationBar } from './PaginationBar';

// Mock icons
jest.mock('../../../assets/images/right.svg', () => 'right.svg');
jest.mock('../../../assets/images/left.svg', () => 'left.svg');

describe('PaginationBar', () => {
  const baseProps = {
    page: 1,
    pageSize: 10,
    totalPages: 5,
    totalElements: 42,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders items-per-page dropdown and triggers onPageSizeChange', () => {
    render(<PaginationBar {...baseProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '15' } });

    expect(baseProps.onPageSizeChange).toHaveBeenCalledWith(15);
  });

  it('renders page input and triggers onPageChange', () => {
    render(<PaginationBar {...baseProps} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '3' } });

    expect(baseProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('shows correct range text', () => {
    render(<PaginationBar {...baseProps} />);

    expect(screen.getByText('1-10 of 42')).toBeInTheDocument();
  });

  it('disables prev button on first page', () => {
    render(<PaginationBar {...baseProps} />);

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    expect(prevBtn).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <PaginationBar
        {...baseProps}
        page={5}
      />
    );

    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn).toBeDisabled();
  });

  it('calls onPageChange when clicking next/prev', () => {
    render(<PaginationBar {...baseProps} page={2} />);

    const prevBtn = screen.getByRole('button', { name: /previous/i });
    const nextBtn = screen.getByRole('button', { name: /next/i });

    fireEvent.click(prevBtn);
    expect(baseProps.onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(nextBtn);
    expect(baseProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders correct pagesToShow when on first pages', () => {
    render(<PaginationBar {...baseProps} page={1} />);

    const pageButtons = screen.getAllByRole('button').filter(btn =>
      /^\d+$/.test(btn.textContent || '')
    );

    expect(pageButtons.map(b => b.textContent)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('renders correct pagesToShow when in middle pages', () => {
    render(<PaginationBar {...baseProps} page={3} />);

    const pageButtons = screen.getAllByRole('button').filter(btn =>
      /^\d+$/.test(btn.textContent || '')
    );

    expect(pageButtons.map(b => b.textContent)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('clicking a page button triggers onPageChange', () => {
    render(<PaginationBar {...baseProps} />);

    const page2Btn = screen.getByRole('button', { name: '2' });
    fireEvent.click(page2Btn);

    expect(baseProps.onPageChange).toHaveBeenCalledWith(2);
  });
});
