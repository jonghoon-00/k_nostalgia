import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const NoLogin = () => {
  const router = useRouter();

  const handleNoUserClick = () => {
    document.cookie = 'guest=true; path=/';
    router.push('/');
  };

  return (
    <>
      <div
        onClick={handleNoUserClick}
        className="text-center mt-4 text-label-alternative underline text-nowrap cursor-pointer"
      >
        비회원으로 입장하기
      </div>
    </>
  );
};

export default NoLogin;
