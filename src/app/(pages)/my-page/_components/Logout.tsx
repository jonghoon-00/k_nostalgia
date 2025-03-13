'use client';
import Loading from '@/components/common/Loading';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/useUser';
import api from '@/service/service';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoIosLogOut } from 'react-icons/io';
import Swal from 'sweetalert2';

const Logout = () => {
  const { data: user, isLoading, error } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleClickLogOut = async () => {
    try {
      await api.auth.logOut();
      // 캐시 무효화
      queryClient.invalidateQueries();
      toast({
        variant: 'destructive',
        description: '로그아웃 되었습니다.'
      });
      router.push('/log-in');
    } catch (err) {
      console.log('로그아웃 에러');
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div> Error </div>;

  return (
    <div className="p-4">
      <div
        className="flex items-center py-[3px] mb-[98px] cursor-pointer"
        onClick={handleClickLogOut}
      >
        <IoIosLogOut className="mr-[8px] text-label-normal text-[20px]" />
        <div>로그아웃</div>
      </div>
    </div>
  );
};

export default Logout;
