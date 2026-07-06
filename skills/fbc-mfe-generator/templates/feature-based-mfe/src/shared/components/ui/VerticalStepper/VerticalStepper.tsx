/* eslint-disable no-unused-vars */
import React from 'react';
import './VerticalStepper.scss';
import {useTranslation} from "react-i18next";

export interface VerticalStepperProps {
  steps: StepperStep[];
  activeStep: number;
  setActiveStep: (index: number) => void;
  disableStepClick?: boolean;
}

export interface StepperStep {
  label: string;
  description: string;
  disabled?: boolean;
}

export default function VerticalStepper({
  steps,
  activeStep,
  setActiveStep,
  disableStepClick = false,
}: VerticalStepperProps) {
  return (
    <div className="vertical-stepper">
      {steps.map((step, index) => {

        const {t} = useTranslation();

        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const isDisabled = disableStepClick || step.disabled;

        return (
          <div key={step.label} className={[
              "step",
              isActive ? 'active' : '',
              isCompleted ? 'completed' : '',
              isDisabled ? 'disabled' : '',
              ].join(' ')}>
            <div className="step-left">
              <button
                type="button"
                className='step-number'
                onClick={isDisabled ? undefined : () => setActiveStep(index)}
                disabled={isDisabled}
                aria-current={isActive ? 'step' : undefined}
                aria-disabled={isDisabled ? true : undefined}
              >
                {index + 1}
              </button>
            </div>
            <div className="step-right">
              <div
                className={[
                  'step-label',
                  isActive ? 'active' : '',
                  isCompleted ? 'completed' : '',
                ].join(' ')}
              >
                {t(step.label)}
              </div>
              <div className="step-description">{t(step.description)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
