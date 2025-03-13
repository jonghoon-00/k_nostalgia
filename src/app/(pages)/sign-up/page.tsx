import React from 'react';
import SignUpContainer from './_components/SignUpContainer';
import DesktopSignUpLayout from './_components/DesktopSignUpLayout';
import Image from 'next/image';
import TitleLogo from '@/components/icons/TitleLogo';

const SignUpPage = () => {
  return (
    <div className="md:bg-primary-20 md:w-full md:h-screen flex flex-col justify-center">
      {/* 모바일 */}
      <div className="w-full md:hidden">
        <SignUpContainer />
      </div>

      {/* 데스크탑*/}
      <div className="hidden md:flex flex-col items-center flex-1 overflow-hidden py-[72px]">
        <div className="flex w-[80%] h-full bg-normal rounded-[20px] mx-auto">
          <div className="flex-1 flex flex-col justify-center items-center">
            <Image
              src="/image/Tigernew.png"
              alt="호랑이 아이콘"
              width={200}
              height={150}
              className="w-[191px] h-[148px] mb-10"
            />
            <p className="text-2xl text-primary-10">
              향그리움에 오신 걸 환영합니다 :)
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center pb-24">
            <div className="flex pt-[100px] pb-4 items-baseline">
              <TitleLogo />
              <p className="text-2xl text-primary-10 ml-2 font-semibold">
                의 <span className="text-primary-20">가족</span>이 될 준비
                되셨나요?
              </p>
            </div>
            <DesktopSignUpLayout />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
