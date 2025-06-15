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
 *
 * @param {string} name - `<input>` 요소 name 속성 (그룹 구분자)
 * @param {RadioOption[]} options - {
  value: any;
  label: string | React.ReactNode;
}[]
 * @param {any} selectedValue - 현재 선택된 값. state
 * @param {(value: any) => void} onChange - 라디오 버튼 선택이 변경되었을 때 호출되는 콜백
 * @param {boolean} [withDivider=false] - 각 옵션 사이에 구분선을 표시할지 여부
 * @param {string} - 라벨 사이즈 텍스트 !! px !!
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
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
          <label className={clsx('flex items-center gap-2 cursor-pointer')}>
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
                'w-[20px] h-[20px] rounded-full flex items-center justify-center',
                selectedValue === option.value
                  ? 'bg-primary-20 border-[1px] border-primary-20'
                  : 'border-gray-70 border-[1px]'
              )}
            >
              {selectedValue === option.value && (
                <div className="w-[10px] h-[10px] bg-white rounded-full" />
              )}
            </div>
            <span
              className={clsx(
                selectedValue === option.value
                  ? 'text-primary-20'
                  : 'text-label-normal',
                `text-[${labelTextSize}] `
              )}
            >
              {option.label}
            </span>
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
