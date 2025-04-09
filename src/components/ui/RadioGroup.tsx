//
import React from 'react';

interface RadioOption {
  value: any;
  label: string | React.ReactNode;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: any;
  onChange: (value: any) => void;
  withDivider?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  withDivider
}) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option, index) => (
        <div key={option.value}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="hidden peer"
            />
            <div
              className={`w-[20px] h-[20px] rounded-full flex items-center justify-center ${
                selectedValue === option.value
                  ? 'bg-primary-20 border-[1px] border-primary-20'
                  : 'border-gray-70 border-[1px]'
              }`}
            >
              {selectedValue === option.value && (
                <div className="w-[10px] h-[10px] bg-white rounded-full" />
              )}
            </div>
            <span
              className={`${
                selectedValue === option.value
                  ? 'text-primary-20'
                  : 'text-label-normal'
              }`}
            >
              {option.label}
            </span>
          </label>
          {withDivider && index < options.length - 1 && (
            <hr className=" border-gray-90 h-[1px]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
