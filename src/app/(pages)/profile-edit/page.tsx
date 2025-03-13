'use client';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { PiArrowsLeftRight } from 'react-icons/pi';
import { BsCheck2 } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import api from '@/service/service';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';
import { validateNickName } from '@/utils/validate';
import DefaultAppLayout from '@/components/common/DefaultAppLayout';
import { BsChevronRight } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { toast } from '@/components/ui/use-toast';
import useDeviceSize from '@/hooks/useDeviceSize';
import DefaultWebLayout from '@/components/common/DefaultWebLayout';
import useDebounce from '@/hooks/useDebounce';

const EditProfilePage = () => {
  const { data: user, isLoading, error } = useUser();
  const [nickname, setNickname] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [hasNicknameChanged, setHasNicknameChanged] = useState(false);
  const [lengthError, setLengthError] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isDesktop } = useDeviceSize();

  const debounceInput = useDebounce(nickname, 400);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '닉네임을 입력해주세요');
      setPreviewImage(user.avatar || '/image/profile.png');
    }
  }, [user]);

  useEffect(() => {
    const checkNickname = async () => {
      if (debounceInput === '' || !hasNicknameChanged) {
        setErrorMessage('');
        return;
      }

      if (validateNickName(debounceInput)) {
        setIsChecking(true);
        try {
          const isAvailable = await api.auth.checkDuplicate('', debounceInput);
          if (!isAvailable) {
            setErrorMessage('이미 사용 중인 별명입니다.');
          } else {
            setErrorMessage('');
          }
        } catch (error) {
          setErrorMessage('이미 사용중인 별명입니다.');
        } finally {
          setIsChecking(false);
        }
      } else {
        setErrorMessage('닉네임은 12자 이내로 입력해주세요.');
      }
    };

    checkNickname();
  }, [debounceInput, hasNicknameChanged]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value.replace(/\s/g, '');

    if (newNickname.length <= 13) {
      setNickname(newNickname);
      setHasNicknameChanged(true);
      setLengthError('');
    } else {
      setLengthError('닉네임은 12자 이내로 입력해주세요.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditClick = async () => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        description: '가입되지 않은 사용자 입니다.'
      });
      return;
    }

    if (errorMessage || lengthError) {
      toast({
        variant: 'destructive',
        description: '변경한 닉네임을 확인해주세요'
      });
      return;
    }

    updateProfile.mutate({
      userId: user.id,
      nickname,
      avatar: user.avatar || '/image/profile.png'
    });
  };

  const updateProfile = useMutation({
    mutationFn: async ({
      userId,
      nickname,
      avatar
    }: {
      userId: string;
      nickname: string;
      avatar: string;
    }) => {
      const result = await Swal.fire({
        title: '정말로 프로필을 변경하시겠어요?',
        showCancelButton: true,
        cancelButtonColor: '#9C6D2E',
        confirmButtonColor: '#f2f2f2',
        cancelButtonText: '취소하기',
        confirmButtonText: '변경하기',
        customClass: {
          title: 'text-xl mt-10 md:mb-[8px]',
          popup: 'rounded-[16px]',
          actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
          confirmButton:
            'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
          cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
        }
      });

      if (result.isConfirmed) {
        if (editImage) {
          avatar = await api.auth.imageUpload(editImage);
        }
        return api.auth.updateUser(userId, { nickname, avatar });
      } else {
        throw new Error();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        variant: 'destructive',
        description: '프로필 변경이 완료되었습니다.'
      });
      router.push('/my-page');
    },
    onError: (error) => {
      console.error('프로필 업데이트 실패', error);
      toast({
        variant: 'destructive',
        description: '프로필 변경이 취소되었습니다.'
      });
    }
  });

  const isButtonActive =
    !errorMessage && !lengthError && nickname && !isChecking;

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading user data</div>;

  return (
    <>
      {isDesktop ? (
        <DefaultWebLayout>
          <div className="p-6 rounded-lg flex flex-col items-center relative mt-20 md:mt-32 md:min-h-screen">
            <div className="hidden md:flex md:items-center md:justify-center md:absolute md:w-[240px] md:h-[152px] md:-top-9 md:z-10 ">
              <Image
                src="/image/Profile_Adorn.png"
                alt="tiger overlay"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="relative w-[120px] md:w-[168px] md:h-[168px] h-[120px] rounded-full border border-primary-20 flex items-center justify-center">
              {user?.avatar ? (
                <Image
                  src={previewImage ?? '/image/profile.png'}
                  alt="profile"
                  priority
                  width={120}
                  height={120}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Image
                  src={'/image/profile.png'}
                  alt="profile"
                  priority
                  width={120}
                  height={120}
                  className="w-full h-full rounded-full object-cover"
                />
              )}
              <label htmlFor="image-upload" className="cursor-pointer">
                <PiArrowsLeftRight className="absolute right-0 bottom-0 text-[36px] text-label-light rounded-full bg-primary-20" />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="w-full relative mt-4 md:py-3 md:px-4 md:flex md:flex-col md:gap-2 md: items-center md:justify-center">
              <div className="md:relative w-full md:w-[320px] mt-4 md:items-center md:justify-center">
                <label
                  htmlFor="nickname"
                  className="block text-label-normal absolute left-3 top-[-18px]"
                >
                  별명
                </label>
                <input
                  id="nickname"
                  type="text"
                  placeholder="사용할 별명을 입력해주세요"
                  className="block w-full mt-2 p-3 px-3 border bg-white border-primary-20 focus:outline-none focus:ring-primary-20 rounded-xl text-primary-20 pr-10"
                  value={nickname}
                  onChange={handleNicknameChange}
                />
                {nickname && !errorMessage && !isChecking ? (
                  <BsCheck2 className="absolute right-3 top-[52%] md:top-[35%] text-[24px] text-[#755428]" />
                ) : (
                  <CgClose
                    className={`absolute right-3 ${
                      errorMessage || isChecking
                        ? 'top-[52%] md:top-[35%]'
                        : 'top-[50%] md:top-[35%]'
                    } text-[24px] ${
                      errorMessage || isChecking
                        ? 'text-red-500'
                        : 'text-label-assistive'
                    }`}
                  />
                )}
                {errorMessage && (
                  <span className="absolute text-red-500 text-sm ml-2 mt-2">
                    {errorMessage}
                  </span>
                )}
              </div>
            </div>

            <button
              className={`hidden md:flex md:border md:border-[#C8C8C8] ${
                isButtonActive
                  ? 'bg-primary-20 text-label-light'
                  : 'bg-[#F2F2F2] text-[#AFACA7]'
              } md:px-4 md:py-2 md:rounded md:mt-10`}
              onClick={handleEditClick}
              disabled={isChecking}
            >
              수정 완료
            </button>
          </div>
        </DefaultWebLayout>
      ) : (
        <DefaultAppLayout
          showHeader={true}
          showNavigation={true}
          showSearch={false}
          showCart={false}
          showComplete={true}
          onCompleteClick={handleEditClick}
        >
          <div className="p-6 rounded-lg flex flex-col items-center relative mt-32 md:mt-32">
            <div className="flex items-center justify-center absolute w-[240px] h-[152px] -top-9 z-20 ">
              <Image
                src="/image/Profile_Adorn.png"
                alt="tiger overlay"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="relative w-[168px] md:w-[168px] md:h-[168px] h-[168px] rounded-full border border-primary-20 flex items-center justify-center">
              {user?.avatar ? (
                <Image
                  src={previewImage ?? '/image/profile.png'}
                  alt="profile"
                  priority
                  width={120}
                  height={120}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Image
                  src={'/image/profile.png'}
                  alt="profile"
                  priority
                  width={120}
                  height={120}
                  className="w-full h-full rounded-full object-cover"
                />
                // <div className="w-full h-full rounded-full flex items-center justify-center">
                //   <span>프로필 사진</span>
                // </div>
              )}
              <label htmlFor="image-upload" className="cursor-pointer">
                <PiArrowsLeftRight className="absolute right-0 bottom-0 text-[36px] text-label-light rounded-full bg-primary-20" />
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="w-full relative mt-4 md:py-3 md:px-4 md:flex md:flex-col md:gap-2 md: items-center md:justify-center">
              <label htmlFor="nickname" className="block text-label-normal">
                별명
              </label>
              <div className="md:relative">
                <input
                  id="nickname"
                  type="text"
                  placeholder="사용할 별명을 입력해주세요"
                  className="block w-full mt-2 p-3 px-3 border bg-white border-primary-20 focus:outline-none focus:ring-primary-20 rounded-xl text-primary-20 pr-10 md:w-[320px]"
                  value={nickname}
                  onChange={handleNicknameChange}
                />
                {nickname && !errorMessage && !isChecking ? (
                  <BsCheck2 className="absolute right-3 top-[52%] text-[24px] text-[#755428]" />
                ) : (
                  <CgClose
                    className={`absolute right-3 ${
                      errorMessage || isChecking
                        ? 'top-[52%] md:top-[25%]'
                        : 'top-[50%] md:top-[35%]'
                    } text-[24px] ${
                      errorMessage || isChecking
                        ? 'text-red-500'
                        : 'text-label-assistive'
                    }`}
                  />
                )}
                {errorMessage && (
                  <span className="absolute text-red-500 text-sm ml-2 mt-2">
                    {errorMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DefaultAppLayout>
      )}
    </>
  );
};

export default EditProfilePage;
