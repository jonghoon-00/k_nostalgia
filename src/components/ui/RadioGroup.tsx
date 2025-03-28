//
import React from 'react';

interface RadioOption {
  value: any;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue: any;
  onChange: (value: any) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange
}) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer"
        >
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
      ))}
    </div>
  );
};

export default RadioGroup;
