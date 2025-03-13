'use client';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const { data: user, isLoading, error } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }, [queryClient]);

  const handleEditMoveClick = () => {
    router.push('/profile-edit');
  };

  return (
    <div className="p-6 rounded-lg">
      <div className="flex flex-col items-center relative mt-20 md:mt-10">
        <div className="flex absolute w-[169px] h-[107px] -top-10 md:flex md:items-center md:justify-center md:absolute md:w-[240px] md:h-[152px] md:-top-14 md:z-10 ">
          <Image
            src="/image/Profile_Adorn.png"
            alt="tiger overlay"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div className="w-[120px] h-[120px] md:w-[168px] md:h-[168px] rounded-full border border-primary-20">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="profile"
              width={120}
              height={120}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <span> 프로필 사진 </span>
            </div>
          )}
        </div>
        <h2 className="text-xl text-label-strong my-4 relative">
          <span className="relative font-semibold">
            {user?.nickname ?? '설정된 닉네임이 없습니다.'}
            <span
              className="absolute left-0 right-0 bottom-[-1px] h-[10px]"
              style={{ backgroundColor: 'rgba(156, 109, 46, 0.4)' }}
            ></span>
          </span>
          <span className="text-base text-label-normal ml-1">님</span>
        </h2>
        <button
          className="border text-[14px] border-primary-10 text-primary-20 px-4 py-[6px] rounded"
          onClick={handleEditMoveClick}
        >
          프로필 수정
        </button>
      </div>
    </div>
  );
};

export default Profile;
