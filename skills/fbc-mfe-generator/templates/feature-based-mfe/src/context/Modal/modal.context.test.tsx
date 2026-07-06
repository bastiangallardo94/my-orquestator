import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import { ModalContext } from './modal.context';

describe('ModalContext', () => {
	it('should have default values that return null', () => {
		let capturedContext: any;

		const TestComponent = () => {
			capturedContext = useContext(ModalContext);
			return null;
		};

		render(<TestComponent />);

		expect(capturedContext.openModal).toBeDefined();
		expect(capturedContext.closeModal).toBeDefined();
		expect(capturedContext.setModalComponent).toBeDefined();

		// Verify default methods return null as defined in modalMethods
		expect(capturedContext.openModal()).toBeNull();
		expect(capturedContext.closeModal()).toBeNull();
		expect(capturedContext.setModalComponent()).toBeNull();
	});
});
