import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BasicSelect } from './BasicSelect';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('BasicSelect', () => {
  const options = [
    { id: '1', name: 'Option A' },
    { id: '2', name: 'Option B' },
  ];

  it('renders label and options', () => {
    render(
      <BasicSelect
        label="Test Label"
        options={options}
        optionLabel="name"
        optionKey="id"
        onChange={jest.fn()}
      />
    );

    expect(screen.getAllByText('Test Label').length).toBeGreaterThan(0);

    // Open the select
    fireEvent.mouseDown(screen.getByLabelText('Test Label'));

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('sets initial selectedValue on mount', () => {
    render(
      <BasicSelect
        label="Test Label"
        selectedValue="2"
        options={options}
        optionLabel="name"
        optionKey="id"
        onChange={jest.fn()}
      />
    );

    fireEvent.mouseDown(screen.getByLabelText('Test Label'));

    // The select should show Option B
    const selected = screen.getByRole('option', { selected: true });
    expect(selected).toHaveTextContent('Option B');
  });

  it('calls onChange with selected key', () => {
    const mockChange = jest.fn();

    render(
      <BasicSelect
        label="Test Label"
        options={options}
        optionLabel="name"
        optionKey="id"
        onChange={mockChange}
      />
    );

    fireEvent.mouseDown(screen.getByLabelText('Test Label'));
    fireEvent.click(screen.getByText('Option B'));

    expect(mockChange).toHaveBeenCalledWith('2');
  });

  it('shows error message when error=true', () => {
    render(
      <BasicSelect
        label="Test Label"
        options={options}
        optionLabel="name"
        optionKey="id"
        onChange={jest.fn()}
        error={true}
      />
    );

    expect(screen.getByText('errors.required')).toBeInTheDocument();
  });

  it('disables select when disabled=true', () => {
    render(
      <BasicSelect
        label="Test Label"
        options={options}
        optionLabel="name"
        optionKey="id"
        onChange={jest.fn()}
        disabled={true}
      />
    );

    const select = screen.getByLabelText('Test Label');
    expect(select).toHaveAttribute('aria-disabled', 'true');

  });
});
