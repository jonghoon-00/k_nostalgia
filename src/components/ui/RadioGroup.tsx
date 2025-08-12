import clsx from 'clsx';
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
  labelTextSize?: string;
}

/**
 * 커스텀 라디오 그룹 컴포넌트
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  withDivider = false,
  labelTextSize
}) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option, index) => (
        <div key={option.value}>
          <label
            className={clsx('flex items-center gap-2', 'cursor-pointer w-full')}
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
              className={clsx(
                'mt-1 w-[20px] h-[20px] rounded-full flex items-center justify-center flex-none',
                selectedValue === option.value
                  ? 'bg-primary-20 border-[1px] border-primary-20'
                  : 'border-gray-70 border-[1px]'
              )}
            >
              {selectedValue === option.value && (
                <div className="w-[10px] h-[10px] bg-white rounded-full" />
              )}
            </div>

            {/* label: 문자열은 인라인, ReactNode는 블록 카드 */}
            {typeof option.label === 'string' ? (
              <span
                className={clsx(
                  selectedValue === option.value
                    ? 'text-primary-20'
                    : 'text-label-normal'
                )}
                style={{ fontSize: labelTextSize }}
              >
                {option.label}
              </span>
            ) : (
              <div className="flex-1">{option.label}</div>
            )}
          </label>

          {withDivider && index < options.length - 1 && (
            <hr className="border-gray-90 h-[1px] mt-2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
