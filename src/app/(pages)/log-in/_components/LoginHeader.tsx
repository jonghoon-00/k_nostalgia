'use client';
import Image from 'next/image';

const LoginHeader = () => {
  return (
    <div className="mt-[83px]">
      <Image
        src="/image/TitleLogo.png"
        alt="title logo"
        priority
        width={216}
        height={60}
        className="w-[216px] h-[60px] mx-auto"
      />
    </div>
  );
};

export default LoginHeader;
