import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

// Mock the default icon import
jest.mock('../../assets/images/inspection.svg', () => 'default-icon.svg');

describe('Header', () => {
	it('renders title and description', () => {
		render(
			<Header
				title="Inspection Header"
				description="This is a description"
				imageSrc="/custom-image.png"
				imageAlt="Custom Alt"
			/>
		);

		expect(screen.getByText('Inspection Header')).toBeInTheDocument();
		expect(screen.getByText('This is a description')).toBeInTheDocument();

		const img = screen.getByAltText('Custom Alt');
		expect(img).toHaveAttribute('src', '/custom-image.png');
	});

	it('renders without description when not provided', () => {
		render(
			<Header
				title="Only Title"
				imageSrc="/img.png"
			/>
		);

		expect(screen.getByText('Only Title')).toBeInTheDocument();
		expect(screen.queryByText('This is a description')).not.toBeInTheDocument();
	});

	it('uses default image when imageSrc is not provided', () => {
		render(
			<Header
				title="Default Image Test"
			/>
		);

		const img = screen.getByAltText('Card image');
		expect(img).toHaveAttribute('src', 'default-icon.svg');
	});

	it('renders the horizontal rule', () => {
		const { container } = render(
			<Header
				title="Header With HR"
				imageSrc="/img.png"
			/>
		);

		expect(container.querySelector('hr')).toBeInTheDocument();
	});
});
