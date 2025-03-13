import React from 'react';
import Image from 'next/image';
import LoginForm from './LoginForm';
import TitleLogo from '@/components/icons/TitleLogo';

const DesktopLoginLayout = () => {
  return (
    <div className="hidden md:flex bg-primary-20 min-h-screen">
      <div className="bg-normal h-[870px] border my-[32px] rounded-[20px] overflow-hidden flex w-full">
        <div className="w-1/2 bg-normal p-8 flex flex-col justify-center items-center">
          <Image
            src="/image/Banner2.png"
            alt="Login illustration"
            width={556}
            height={888}
            className="w-auto h-[888px] object-cover "
          />
        </div>

        <div className="w-1/2 p-12 flex flex-col items-center justify-center">
          <Image
            src="/image/TitleLogo.png"
            alt="title logo"
            priority
            width={353}
            height={100}
            className="w-[353px] h-[98px] mb-12 mx-auto"
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default DesktopLoginLayout;
