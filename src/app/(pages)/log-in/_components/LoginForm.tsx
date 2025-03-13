'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { validateEmail, validatePassword } from '@/utils/validate';
import Link from 'next/link';
import { useLogin, useUser } from '@/hooks/useUser';
import Image from 'next/image';
import KaKaoLogin from './KaKaoLogin';
import GoogleLogin from './GoogleLogin';
import NoLogin from './NoLogin';
import Swal from 'sweetalert2';
import { toast } from '@/components/ui/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const [showPassword, setshowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const isFormFilled = email !== '' && password !== '';
  const { mutate: login } = useLogin();
  const { data: user, isLoading, error } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const checkErrors: { email?: string; password?: string } = {};
    if (!email) {
      checkErrors.email = '이메일을 입력해 주세요.';
    } else if (!validateEmail(email)) {
      checkErrors.email = ' 형식에 알맞지 않은 이메일 주소에요.';
    }
    if (!password) {
      checkErrors.password = '비밀번호를 입력해주세요.';
    } else if (!validatePassword(password)) {
      checkErrors.password =
        ' 영문 대문자, 소문자, 숫자와 !"?&@%$와 같은 특수문자를 포함하여 6글자 이상 입력하셔야해요. ';
    }
    setErrors(checkErrors);
    setLoginError(null);

    // 에러가 없을 때만 로그인 시도
    if (Object.keys(checkErrors).length === 0) {
      login(
        { email, password },
        {
          onSuccess: () => {
            toast({
              variant: 'default',
              description: '로그인이 완료되었습니다.'
            });
            router.push('/');
          },
          onError: () => {
            toast({
              variant: 'destructive',
              description: '가입되지 않은 아이디에요.'
            });
            setLoginError('가입되지 않은 아이디거나 잘못된 비밀번호에요.');
          }
        }
      );
    }
  };

  const handleShowPassword = () => {
    setshowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleLogin} className="max-w-[320px] md:min-w-full">
      <div className="flex flex-col justify-between mt-10">
        <div>
          <div className="mb-4">
            <label className="block text-label-normal mb-2">이메일</label>
            <input
              type="text"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl bg-[##FEFEFE] focus:outline-none focus:border-primary-strong text-primary-20 ${
                errors.email || loginError
                  ? 'border-status-negative'
                  : 'border-label-assistive'
              }`}
            />
            {errors.email && (
              <p className="text-status-negative mt-2 text-sm">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-label-normal mb-2">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl bg-[#FEFEFE] focus:outline-none focus:border-primary-strong text-primary-20 ${
                  errors.password || loginError
                    ? 'border-status-negative'
                    : 'border-label-assistive'
                }`}
              />
              <span
                onClick={handleShowPassword}
                className="absolute w-6 h-6 right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <PiEyeSlash className="text-[#545454] text-xl" />
                ) : (
                  <PiEye className="text-[#545454] text-xl" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="text-status-negative mt-2 text-sm">
                {errors.password}
              </p>
            )}
            {loginError && (
              <p className="text-status-negative mt-2 text-sm">{loginError}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="submit"
            className={`w-full mt-7 py-3 px-4  rounded-xl text-white ${
              isFormFilled
                ? 'bg-primary-strong hover:bg-primary-strong'
                : 'bg-label-disable'
            }`}
          >
            입장하기
          </button>

          <p className="mt-7 text-center text-base text-label-alternative gap-2">
            아직 회원이 아니신가요?{' '}
            <Link href="/sign-up" className="text-label-normal">
              회원가입
            </Link>
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/image/ORdivider.png"
            alt="divider"
            width={520}
            height={20}
            className="w-[350px] h-[20px] mt-8 mb-[39px] xs:w-full"
          />
        </div>

        <KaKaoLogin />
        <GoogleLogin />
        <NoLogin />
      </div>
    </form>
  );
};
export default LoginForm;
