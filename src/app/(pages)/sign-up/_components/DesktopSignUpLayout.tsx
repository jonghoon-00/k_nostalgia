'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/service/service';
import {
  validateEmail,
  validateName,
  validateNickName,
  validatePassword
} from '@/utils/validate';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import Swal from 'sweetalert2';
import { toast } from '@/components/ui/use-toast';

type ErrorState = {
  [key: string]: string;
};

type SuccessState = {
  [key: string]: string;
};

const DesktopSignUpLayout = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    name: ''
  });
  const router = useRouter();
  const [errors, setErrors] = useState<ErrorState>({});
  const [successes, setSuccesses] = useState<SuccessState>({});
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [inputStarted, setInputStarted] = useState({
    email: false,
    nickname: false
  });
  const [showPassword, setShowPassword] = useState(false);

  // 입력 필드의 변경 사항을 반영
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccesses((prev) => ({ ...prev, [name]: '' }));
    setInputStarted((prev) => ({ ...prev, [name]: true }));

    // 중복 확인 상태 초기화
    if (name === 'email' && !value) {
      setIsEmailChecked(false);
      setErrors((prev) => ({ ...prev, email: '' }));
      setSuccesses((prev) => ({ ...prev, email: '' }));
    } else if (name === 'nickname' && !value) {
      setIsNicknameChecked(false);
      setErrors((prev) => ({ ...prev, nickname: '' }));
      setSuccesses((prev) => ({ ...prev, nickname: '' }));
    }
  };

  // 이메일 검증 실시간 반영
  useEffect(() => {
    if (
      inputStarted.email &&
      userInfo.email &&
      !validateEmail(userInfo.email)
    ) {
      setErrors((prev) => ({
        ...prev,
        email: '형식에 맞지 않는 이메일 주소에요.'
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  }, [userInfo.email, inputStarted.email]);

  // 비밀번호 검증 실시간 반영
  useEffect(() => {
    if (userInfo.password && validatePassword(userInfo.password)) {
      setSuccesses((prev) => ({
        ...prev,
        password: '올바른 비밀번호입니다.'
      }));
      setErrors((prev) => ({ ...prev, password: '' }));
    } else if (userInfo.password) {
      setErrors((prev) => ({
        ...prev,
        password:
          '영문 대소문자, 숫자와 특수문자를 포함하여 6글자 이상 입력하셔야해요.'
      }));
      setSuccesses((prev) => ({ ...prev, password: '' }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
      setSuccesses((prev) => ({ ...prev, password: '' }));
    }
  }, [userInfo.password]);

  // 이름 검증 실시간 반영
  useEffect(() => {
    if (userInfo.name && !validateName(userInfo.name)) {
      setErrors((prev) => ({
        ...prev,
        name: '정확한 이름을 입력주세요.'
      }));
    } else {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  }, [userInfo.name]);

  useEffect(() => {
    if (
      userInfo.confirmPassword &&
      userInfo.password !== userInfo.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: '비밀번호를 다시 확인해주세요.'
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  }, [userInfo.password, userInfo.confirmPassword]);

  const validateForm = () => {
    const { email, password, confirmPassword, nickname, name } = userInfo;
    let isValid = true;

    // 이메일 검증
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '입력은 필수입니다.' }));
      isValid = false;
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: '형식에 맞지 않는 이메일 주소에요.'
      }));
      isValid = false;
    } else if (isEmailChecked && errors.email) {
      isValid = false;
    }

    // 비밀번호 검증
    if (!password) {
      setErrors((prev) => ({ ...prev, password: '입력은 필수입니다.' }));
      isValid = false;
    } else if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          '영문 대소문자, 숫자와 특수문자를 포함하여 6글자 이상 입력하셔야해요.'
      }));
      isValid = false;
    }

    // 비밀번호 확인
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: '입력은 필수입니다.' }));
      isValid = false;
    } else if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: '비밀번호가 일치하지 않습니다.'
      }));
      isValid = false;
    }

    // 이름 검증
    if (!name) {
      setErrors((prev) => ({ ...prev, name: '입력은 필수입니다.' }));
      isValid = false;
    } else if (!validateName(name)) {
      setErrors((prev) => ({ ...prev, name: '정확한 이름을 입력해주세요.' }));
      isValid = false;
    }

    // 별명 검증
    if (!nickname) {
      setErrors((prev) => ({ ...prev, nickname: '입력은 필수입니다.' }));
      isValid = false;
    } else if (!validateNickName(nickname)) {
      setErrors((prev) => ({
        ...prev,
        nickname: '별명은 12자 이내로만 입력 가능해요.'
      }));
      isValid = false;
    } else if (isNicknameChecked && errors.nickname) {
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, nickname: '' }));
    }

    return isValid;
  };

  useEffect(() => {
    if (userInfo.nickname.length > 12) {
      setErrors((prev) => ({
        ...prev,
        nickname: '별명은 12자 이내로만 입력 가능해요.'
      }));
    } else {
      setErrors((prev) => ({ ...prev, nickname: '' }));
    }
  }, [userInfo.nickname]);

  const handleEmailCheckDuplicate = async () => {
    const email = userInfo.email.trim();
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '입력은 필수입니다.' }));
      setSuccesses((prev) => ({ ...prev, email: '' }));
      setIsEmailChecked(false);
      return;
    }

    try {
      await api.auth.checkDuplicate(email, '');
      setErrors((prev) => ({ ...prev, email: '' }));
      setSuccesses((prev) => ({ ...prev, email: '사용 가능한 이메일입니다.' }));
      setIsEmailChecked(true);
    } catch (error) {
      setErrors((prev) => ({ ...prev, email: '중복된 이메일입니다.' }));
      setSuccesses((prev) => ({ ...prev, email: '' }));
      setIsEmailChecked(false);
    }
  };

  const handleNicknameCheckDuplicate = async () => {
    const nickname = userInfo.nickname.trim();
    if (!nickname) {
      setErrors((prev) => ({ ...prev, nickname: '입력은 필수입니다.' }));
      setSuccesses((prev) => ({ ...prev, nickname: '' }));
      setIsNicknameChecked(false);
      return;
    }

    try {
      await api.auth.checkDuplicate('', nickname);
      setErrors((prev) => ({ ...prev, nickname: '' }));
      setSuccesses((prev) => ({
        ...prev,
        nickname: '사용 가능한 닉네임입니다.'
      }));
      setIsNicknameChecked(true);
    } catch (error) {
      setErrors((prev) => ({ ...prev, nickname: '중복된 닉네임입니다.' }));
      setSuccesses((prev) => ({ ...prev, nickname: '' }));
      setIsNicknameChecked(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.auth.signUp(
        userInfo.email,
        userInfo.password,
        userInfo.nickname,
        userInfo.name
      );

      setUserInfo({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        name: ''
      });

      if (response) {
        await api.auth.logOut();
        toast({
          variant: 'destructive',
          description: '회원가입이 완료되었습니다.'
        });

        router.push('/log-in');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        variant: 'destructive',
        description: '회원가입이 불가합니다.'
      });
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return (
      userInfo.email &&
      userInfo.password &&
      userInfo.confirmPassword &&
      userInfo.nickname &&
      userInfo.name &&
      isEmailChecked &&
      isNicknameChecked &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword &&
      !errors.nickname &&
      !errors.name
    );
  };

  return (
    <>
      <div className="flex flex-col gap-2 h-[630px] w-[90%] overflow-y-scroll">
        {/* 이메일 */}
        <div className="py-3 px-6 mt-8">
          <label className="block text-label-normal mb-2">이메일</label>
          <div className="flex flex-1 items-center mr-2">
            <input
              type="text"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder="이메일을 입력해 주세요"
              className={`bg-[#FEFEFE] border rounded-xl pl-4 pr-3 py-3 w-full text-primary-20 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-primary-strong'
              }`}
            />
            <button
              type="button"
              className={`w-[66px] h-[50px] ml-2 rounded-[10px] ${
                isEmailChecked
                  ? 'bg-primary-10'
                  : inputStarted.email
                  ? 'bg-primary-20 hover:bg-primary-10'
                  : 'bg-label-disable'
              } text-label-light text-xs px-2 py-1`}
              onClick={handleEmailCheckDuplicate}
            >
              {isEmailChecked ? '완료' : '중복확인'}
            </button>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          )}
          {successes.email && (
            <p className="text-secondary-20 text-sm mt-2">{successes.email}</p>
          )}
        </div>

        <div className="px-7">
          <div className="h-[2px] bg-[#E0E0E0] my-8" />
        </div>

        {/* 비밀번호 */}
        <div className="px-6 py-3">
          <label className="text-label-normal p-2">비밀번호</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해 주세요"
              className={`bg-[#FEFEFE] border text-primary-20 rounded-xl pl-4 pr-3 py-3 w-full focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-primary-strong'
              }`}
            />
            <span
              className="absolute inset-y-0 right-[15px] flex items-center cursor-pointer"
              onClick={handleShowPassword}
            >
              {showPassword ? (
                <PiEyeSlash className="text-[#545454] text-2xl p-[2px]" />
              ) : (
                <PiEye className="text-[#545454] text-2xl p-[2px]" />
              )}
            </span>
          </div>
          {!errors.password && (
            <p className="text-label-alternative text-sm mt-2">
              영문 대소문자, 숫자, 특수문자를 포함해 6자리 이상으로
              입력해주세요.
            </p>
          )}
          {errors.password && (
            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mt-6 px-6 py-3">
          <label className="block text-label-normal p-2 ">
            비밀번호 재확인
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleChange}
              placeholder="한번 더 입력해 주세요"
              className={`bg-[#FEFEFE] border text-primary-20 rounded-xl pl-4 pr-3 py-3 w-full focus:outline-none ${
                errors.confirmPassword
                  ? 'border-red-500'
                  : 'border-primary-strong'
              }`}
            />
            <span
              className="absolute inset-y-0 right-[15px] flex items-center cursor-pointer"
              onClick={handleShowPassword}
            >
              {showPassword ? (
                <PiEyeSlash className="text-[#545454] text-2xl p-[2px]" />
              ) : (
                <PiEye className="text-[#545454] text-2xl p-[2px]" />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-2">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="px-7">
          <div className="h-[2px] bg-[#E0E0E0] my-8" />
        </div>

        {/* 이름 */}
        <div className="px-6 py-3">
          <label className="flex text-label-normal mb-2">이름</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="이름"
            className={`bg-[#FEFEFE] border text-primary-20 rounded-xl pl-4 pr-3 py-3 w-full focus:outline-none ${
              errors.name ? 'border-red-500' : 'border-primary-strong'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2">{errors.name}</p>
          )}
        </div>

        <div className="px-7">
          <div className="h-[2px] bg-[#E0E0E0] my-8" />
        </div>

        {/* 별명 */}
        <div className="px-6 py-3 mb-12">
          <label className="block text-label-normal mb-2 ">별명</label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="nickname"
              value={userInfo.nickname}
              onChange={handleChange}
              placeholder="사용할 별명"
              className={`bg-[#FEFEFE] border rounded-xl pl-4 pr-3 py-3 w-full text-primary-20 focus:outline-none ${
                errors.nickname ? 'border-red-500' : 'border-primary-strong'
              }`}
            />
            <button
              type="button"
              className={`w-[66px] h-[50px] ml-2 rounded-[10px] ${
                isNicknameChecked
                  ? 'bg-primary-10'
                  : inputStarted.nickname
                  ? 'bg-primary-20 hover:bg-primary-10'
                  : 'bg-label-disable'
              }  text-label-light text-xs px-2 py-1`}
              onClick={handleNicknameCheckDuplicate}
            >
              {isNicknameChecked ? '완료' : '중복확인'}
            </button>
          </div>
          {errors.nickname && (
            <p className="text-red-500 text-sm mt-2">{errors.nickname}</p>
          )}
          {successes.nickname && (
            <p className="text-secondary-20 text-sm mt-2">
              {successes.nickname}
            </p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 px-6 mt-8 mb-[32px] w-full">
        <button
          type="button"
          className={`w-full rounded-xl ${
            isFormValid()
              ? 'bg-primary-20 hover:bg-primary-10'
              : 'bg-label-disable'
          } text-label-light px-4 py-3  `}
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          회원가입하기
        </button>
      </div>
    </>
  );
};
export default DesktopSignUpLayout;
