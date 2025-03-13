'use client';
import React, { useEffect, useState } from 'react';
import { PiEye, PiEyeSlash } from 'react-icons/pi';

interface SignupFormProps {
  title?: string;
  label: string;
  placeholder: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  successMessage?: string;
  onEmailCheckDuplicate?: () => void;
  onNicknameCheckDuplicate?: () => void;
  isEmailChecked?: boolean;
  isNicknameChecked?: boolean;
  inputStarted?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  title,
  label,
  placeholder,
  type,
  name,
  value,
  onChange,
  error,
  successMessage,
  onEmailCheckDuplicate,
  onNicknameCheckDuplicate,
  isEmailChecked,
  isNicknameChecked
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputStarted, setInputStarted] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (value.trim()) {
      setInputStarted(true);
    } else {
      setInputStarted(false);
    }
  }, [value]);

  return (
    <div className="relative">
      {title && (
        <label className="block text-label-normal text-xl mb-5 ml-8 mt-10 text-left">
          {title}
        </label>
      )}
      <div className="px-4 py-3 gap-2">
        <label className="block text-label-normal mb-2 px-[16px]">
          {label}
        </label>
        <div className="relative flex items-center w-[320px] ml-2">
          <input
            type={
              type === 'password' ? (showPassword ? 'text' : 'password') : type
            }
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`bg-[#FEFEFE] pl-[16px] pr-[44px] py-3 mr-2 border rounded-xl focus:outline-none text-primary-20 ${
              error ? 'border-red-500' : 'border-primary-strong'
            } ${
              name === 'email' || name === 'nickname'
                ? 'w-[246px]'
                : 'w-[320px]'
            }`}
          />
          {(name === 'email' || name === 'nickname') && (
            <button
              type="button"
              className={`w-[66px] h-[50px] text-label-light text-xs px-2 py-1 rounded-[10px] 
              ${
                (isEmailChecked && name === 'email') ||
                (isNicknameChecked && name === 'nickname')
                  ? 'bg-primary-20 hover:bg-primary-10'
                  : inputStarted
                  ? 'bg-primary-20 hover:bg-primary-10'
                  : 'bg-label-disable'
              }`}
              onClick={
                name === 'email'
                  ? onEmailCheckDuplicate
                  : onNicknameCheckDuplicate
              }
            >
              {(isEmailChecked && name === 'email') ||
              (isNicknameChecked && name === 'nickname')
                ? '완료'
                : '중복확인'}
            </button>
          )}
          {type === 'password' && (
            <span
              className="absolute inset-y-0 right-[15px] flex items-center cursor-pointer"
              onClick={handleShowPassword}
            >
              {showPassword ? (
                <PiEyeSlash className="text-[#545454] text-xl" />
              ) : (
                <PiEye className="text-[#545454] text-xl" />
              )}
            </span>
          )}
        </div>
        {name === 'password' && (
          <p
            className={`${
              error ? 'text-red-500' : 'text-label-alternative'
            } text-sm mt-2 px-4`}
          >
            {error ||
              '영문 대소문자, 숫자와 특수문자를 포함하여 6글자 이상 입력해주세요.'}
          </p>
        )}
        {name !== 'password' && error && (
          <p className="text-red-500 text-sm mt-2 px-4">{error}</p>
        )}

        {successMessage && (
          <p className="text-secondary-20 text-sm mt-2 px-4">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
