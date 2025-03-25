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
            className="hidden"
          />
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
              selectedValue === option.value
                ? 'border-blue-500'
                : 'border-gray-400'
            }`}
          >
            {selectedValue === option.value && (
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
            )}
          </div>
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
