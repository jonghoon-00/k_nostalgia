import React from 'react';

interface Step {
  label: string;
  type: string;
  title: string;
  key: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex w-[375px] items-center justify-between py-[8px] px-[32px]">
      {steps.map((_, index) => (
        <div
          key={index}
          className={`flex h-[8px] w-[74px] box-border rounded-tl-[4px] rounded-tr-[2px] rounded-br-[2px] rounded-bl-[4px] rounded-full ${
            index < currentStep
              ? 'bg-primary-strong'
              : index === currentStep
              ? 'bg-primary-normal'
              : 'bg-[#F2F2F2]'
          }`}
        ></div>
      ))}
    </div>
  );
};

export default Stepper;
