'use client';
import api from '@/service/service';
import {
  validateEmail,
  validateName,
  validateNickName,
  validatePassword
} from '@/utils/validate';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import Swal from 'sweetalert2';
import SignupForm from './SignUpForm';
import steps from './Step';
import Stepper from './Stepper';
import { toast } from '@/components/ui/use-toast';

type ErrorState = {
  [key: string]: string;
};

type SuccessState = {
  [key: string]: string;
};

const SignUpContainer = () => {
  const [step, setStep] = useState(0);
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
  const [inputStarted, setInputStarted] = useState(false);

  //입력 필드의 변경 사항을 반영
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccesses((prev) => ({ ...prev, [name]: '' }));
    setInputStarted(true);
  };

  useEffect(() => {
    if (step === 1) {
      if (
        userInfo.confirmPassword &&
        userInfo.password !== userInfo.confirmPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다.'
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  }, [userInfo.password, userInfo.confirmPassword, step]);

  const validateStep = () => {
    const currentStep = steps[step];
    const value = userInfo[currentStep.key as keyof typeof userInfo];
    let error = '';
    let success = '';

    if (!value) {
      error = '입력은 필수입니다.';
    } else if (currentStep.key === 'email' && !validateEmail(value)) {
      error = '형식에 맞지 않는 이메일 주소에요.';
    } else if (currentStep.key === 'password') {
      if (!validatePassword(value)) {
        error =
          '영문 대소문자, 숫자와 특수문자를 포함하여 6글자 이상 입력하셔야해요.';
      } else if (value !== userInfo.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다.'
        }));
        return false;
      }
    } else if (currentStep.key === 'name' && !validateName(value)) {
      error = '정확한 이름을 입력해주세요.';
    } else if (currentStep.key === 'nickname' && !validateNickName(value)) {
      error = '별명은 12자 이내로만 입력 가능해요.';
    }

    if (currentStep.key === 'email' && isEmailChecked && errors.email) {
      // 중복 확인이 완료된 이메일 필드에 중복된 이메일 에러가 있는지 체크
      error = errors.email;
    }

    if (
      currentStep.key === 'nickname' &&
      isNicknameChecked &&
      errors.nickname
    ) {
      // 중복 확인이 완료된 닉네임 필드에 중복된 닉네임 에러가 있는지 체크
      error = errors.nickname;
    }
    setErrors((prev) => ({ ...prev, [currentStep.key]: error }));
    setSuccesses((prev) => ({ ...prev, [currentStep.key]: success }));
    return !error;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return; // 유효성 검사 실패 시 함수 종료
    }

    // 이메일 중복 확인이 필요할 경우 추가적인 검사를 진행합니다.
    if (step === 0) {
      if (!isEmailChecked) {
        setErrors((prev) => ({
          ...prev,
          email: '이메일 중복 확인이 필요합니다.'
        }));
        return;
      }
      setStep(1);
    } else if (step === 4) {
      if (!isNicknameChecked) {
        setErrors((prev) => ({
          ...prev,
          nickname: '별명 중복 확인이 필요합니다.'
        }));
        return;
      }
    }

    if (validateStep()) {
      if (step < steps.length - 1) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleEmailCheckDuplicate = async () => {
    const email = userInfo.email.trim();
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '입력은 필수입니다.' }));
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
    if (!validateStep()) {
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

      setStep(0);

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
        description: '회원가입이 불가합니다. 다시 확인해주세요.'
      });
    }
  };

  const handleback = () => {
    if (step === 0) {
      router.push('/log-in');
    } else {
      prevStep();
    }
  };

  return (
    <div className="flex-col items-center justify-center flex">
      <div>
        <div className="w-full bg-normal pt-[20px] px-[12px] pb-2 rounded-md flex justify-between">
          <div className="w-[76px]">
            <GoArrowLeft
              className="flex mt-1 mb-1 ml-1 mr-1 text-[28px] text-[##545454] cursor-pointer"
              onClick={handleback}
            />
          </div>
          <span className="w-1"></span>
        </div>

        <div>
          <Stepper steps={steps} currentStep={step} />
        </div>

        <div>
          <SignupForm
            title={steps[step].title}
            label={steps[step].label}
            placeholder={steps[step].placeholder}
            type={steps[step].type}
            name={steps[step].key}
            value={userInfo[steps[step].key as keyof typeof userInfo]}
            onChange={handleChange}
            error={errors[steps[step].key]}
            successMessage={successes[steps[step].key]}
            onEmailCheckDuplicate={handleEmailCheckDuplicate}
            onNicknameCheckDuplicate={handleNicknameCheckDuplicate}
            isEmailChecked={isEmailChecked}
            isNicknameChecked={isNicknameChecked}
            inputStarted={inputStarted}
          />

          {step === 1 && (
            <SignupForm
              title=""
              label="비밀번호 재확인"
              placeholder="한번 더 입력해주세요"
              type="password"
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 mb-10 flex justify-center">
        <button
          onClick={step === steps.length - 1 ? handleSubmit : nextStep}
          className="w-[320px] h-[48px] py-[12px] px-[16px] bg-primary-strong text-white rounded-xl"
        >
          {step === steps.length - 1 ? '제출' : '확인'}
        </button>
      </div>
    </div>
  );
};

export default SignUpContainer;
