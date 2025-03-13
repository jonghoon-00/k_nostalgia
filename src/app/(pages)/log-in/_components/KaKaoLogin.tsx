import { toast } from '@/components/ui/use-toast';
import api from '@/service/service';
import Image from 'next/image';
import React from 'react';

const KaKaoLogin = () => {
  //카카오로그인
  const handleClickKaKaoLogin = async () => {
    try {
      const socialuser = await api.auth.socialLogin('kakao');

      toast({
        variant: 'destructive',
        description: '로그인 되었습니다.'
      });
    } catch (error) {
      console.error('카카오 로그인 실패', error);
      toast({
        variant: 'destructive',
        description: '로그인 되지 않았습니다. 다시 확인해주세요. '
      });
    }
  };
  return (
    <div className="flex items-center justify-center">
      <div
        onClick={handleClickKaKaoLogin}
        className="flex items-center justify-center w-[320px] h-[48px] px-[88px] py-[12px] bg-[#FEDF32] border-[#FEDF32] rounded-[12px] cursor-pointer xs:w-[516px]"
      >
        <div>
          <Image
            src="/image/KaKaoIcon.png"
            alt="KaKao Logo"
            width={24}
            height={24}
            className="w-[24px] h-[24px] mr-3"
          />
        </div>
        <p className="text-label-strong text-center text-nowrap cursor-pointer">
          {' '}
          카카오로 시작하기{' '}
        </p>
      </div>
    </div>
  );
};

export default KaKaoLogin;
