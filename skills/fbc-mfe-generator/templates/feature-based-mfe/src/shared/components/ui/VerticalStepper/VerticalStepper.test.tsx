import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import VerticalStepper, { StepperStep } from './VerticalStepper';

describe('VerticalStepper', () => {
  const steps: StepperStep[] = [
    { label: 'Step 1', description: 'Description for step 1' },
    { label: 'Step 2', description: 'Description for step 2' },
    { label: 'Step 3', description: 'Description for step 3' },
  ];

  it('renders all step labels and descriptions', () => {
    const mockSetActiveStep = jest.fn();
    render(
      <VerticalStepper
        steps={steps}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Description for step 1')).toBeInTheDocument();
  });

  it('calls setActiveStep with the correct index when a step number is clicked', () => {
    const mockSetActiveStep = jest.fn();
    render(
      <VerticalStepper
        steps={steps}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    fireEvent.click(screen.getByText('2')); // step number button
    expect(mockSetActiveStep).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('3'));
    expect(mockSetActiveStep).toHaveBeenCalledWith(2);
  });

  it('applies active class to the current step', () => {
    const mockSetActiveStep = jest.fn();
    const { container } = render(
      <VerticalStepper
        steps={steps}
        activeStep={1}
        setActiveStep={mockSetActiveStep}
      />
    );

    const activeStep = container.querySelector('.step.active');
    expect(activeStep).toBeTruthy();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('applies completed class to previous steps', () => {
    const mockSetActiveStep = jest.fn();
    const { container } = render(
      <VerticalStepper
        steps={steps}
        activeStep={2}
        setActiveStep={mockSetActiveStep}
      />
    );

    const completedSteps = container.querySelectorAll('.step.completed');
    expect(completedSteps.length).toBe(2); // first two steps completed
  });

  it('does not call setActiveStep when disableStepClick is true', () => {
    const mockSetActiveStep = jest.fn();
    render(
      <VerticalStepper
        steps={steps}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
        disableStepClick={true}
      />
    );

    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    expect(mockSetActiveStep).not.toHaveBeenCalled();
  });

  it('does not call setActiveStep when a step is individually disabled', () => {
    const mockSetActiveStep = jest.fn();
    const disabledSteps: StepperStep[] = [
      { label: 'Step 1', description: 'Description for step 1' },
      { label: 'Step 2', description: 'Description for step 2', disabled: true },
      { label: 'Step 3', description: 'Description for step 3' },
    ];

    render(
      <VerticalStepper
        steps={disabledSteps}
        activeStep={0}
        setActiveStep={mockSetActiveStep}
      />
    );

    fireEvent.click(screen.getByText('2'));
    expect(mockSetActiveStep).not.toHaveBeenCalled();
  });
});
