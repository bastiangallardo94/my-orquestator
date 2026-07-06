import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelect } from './MultiSelect';

interface Option {
  id: string;
  name: string;
}

const options: Option[] = [
  { id: '1', name: 'Option A' },
  { id: '2', name: 'Option B' },
  { id: '3', name: 'Option C' },
];

describe('MultiSelect', () => {
    it('renders with label and options', () => {
        render(
        <MultiSelect<Option>
            label="Test Label"
            options={options}
            optionLabel="name"
            optionKey="id"
            onChange={jest.fn()}
        />
        );

        // use getByLabelText to grab the select by its label
        const select = screen.getByLabelText('Test Label');
        fireEvent.mouseDown(select);

        //expect(screen.getByText('Test Label')).toBeInTheDocument();
        // The select should render menu items
        //fireEvent.mouseDown(screen.getByLabelText('Test Label'));
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
        expect(screen.getByText('Option C')).toBeInTheDocument();
    });

    it('calls onChange when selecting an option', () => {
        const onChange = jest.fn();
        render(
        <MultiSelect<Option>
            label="Test Label"
            options={options}
            optionLabel="name"
            optionKey="id"
            onChange={onChange}
        />
        );

        // open menu
        fireEvent.mouseDown(screen.getByLabelText('Test Label'));
        const optionA = screen.getByText('Option A');
        fireEvent.click(optionA);

        expect(onChange).toHaveBeenCalledWith(true, { id: '1', name: 'Option A' });
    });

    it('calls onChange when deselecting an option', () => {
        const onChange = jest.fn();
        render(
            <MultiSelect<Option>
            label="Test Label"
            options={options}
            optionLabel="name"
            optionKey="id"
            selectedValues={['1']}
            onChange={onChange}
            />
        );

        // open menu
        fireEvent.mouseDown(screen.getByLabelText('Test Label'));

        // select/deselect Option A by role
        const optionA = screen.getByRole('option', { name: 'Option A' });
        fireEvent.click(optionA);

        expect(onChange).toHaveBeenCalledWith(false, { id: '1', name: 'Option A' });
    });

    it('renders selected values in renderValue', () => {
        render(
        <MultiSelect<Option>
            label="Test Label"
            options={options}
            optionLabel="name"
            optionKey="id"
            selectedValues={['1', '2']}
            onChange={jest.fn()}
        />
        );

        // The rendered value should show Option A, Option B
        expect(screen.getByText('Option A, Option B')).toBeInTheDocument();
    });

    it('respects disabled prop', () => {
        render(
        <MultiSelect<Option>
            label="Test Label"
            options={options}
            optionLabel="name"
            optionKey="id"
            disabled
            onChange={jest.fn()}
        />
        );

        const select = screen.getByLabelText('Test Label');
        expect(select).toHaveAttribute('aria-disabled', 'true');
    });
});
