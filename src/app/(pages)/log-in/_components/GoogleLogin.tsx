import { toast } from '@/components/ui/use-toast';
import api from '@/service/service';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleLogin = () => {
  const handleClickGoogleLogin = async () => {
    try {
      const socialuser = await api.auth.socialLogin('google');
      toast({
        variant: 'destructive',
        description: '로그인 되었습니다.'
      });
    } catch (error) {
      console.error('구글 로그인 실패', error);
      toast({
        variant: 'destructive',
        description: '로그인에 실패하였습니다. 다시 로그인 해주세요.'
      });
    }
  };
  return (
    <div className="flex items-center justify-center mt-3">
      <div
        onClick={handleClickGoogleLogin}
        className="flex items-center justify-center w-[320px] h-[48px] pl-[88px] pr-[102px] py-[12px] bg-[#FFFFFF] border-[#FEDF32] rounded-[12px] cursor-pointer xs:w-[516px]"
      >
        <FcGoogle className="text-[24px] mr-2" />
        <p className="text-label-strong text-center text-nowrap cursor-pointer">
          {' '}
          구글로 시작하기{' '}
        </p>
      </div>
    </div>
  );
};

export default GoogleLogin;
