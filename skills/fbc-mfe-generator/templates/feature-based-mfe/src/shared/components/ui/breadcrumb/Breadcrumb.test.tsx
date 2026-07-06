import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('returns null when items is empty', () => {
    const { container } = render(<Breadcrumb items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders breadcrumb items', () => {
    const items = [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'Shoes' },
    ];

    render(<Breadcrumb items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Shoes')).toBeInTheDocument();
  });

  it('renders links when url is provided', () => {
    const items = [{ label: 'Home', url: '/' }];

    render(<Breadcrumb items={items} />);

    const link = screen.getByText('Home');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders plain text when url is not provided', () => {
    const items = [{ label: 'Shoes' }];

    render(<Breadcrumb items={items} />);

    const text = screen.getByText('Shoes');
    expect(text.tagName).toBe('SPAN');
  });

  it('renders separators between items but not after the last one', () => {
    const items = [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'Shoes' },
    ];

    render(<Breadcrumb items={items} />);

    const separators = screen.getAllByText('>');
    expect(separators).toHaveLength(2); // one between Home > Products, one between Products > Shoes
  });
});
