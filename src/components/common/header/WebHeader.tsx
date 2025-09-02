'use client';

import TitleLogo from '@/components/icons/TitleLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/useUser';
import api from '@/service/service';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ShowSearchCart from './_component/ShowSearchCart';

interface headerNavType {
  path: string;
  pathNaviName: string;
}

const HeaderNav: headerNavType[] = [
  { path: '/', pathNaviName: '홈' },
  { path: 'divider', pathNaviName: '' },
  { path: '/market', pathNaviName: '전통 시장' },
  { path: 'divider', pathNaviName: '' },
  { path: '/local-food', pathNaviName: '특산물' }
];

const HeaderNavPaths = HeaderNav.map((item) => item.path);

const WebHeader = () => {
  const router = useRouter();
  const { data: user } = useUser();
  const pathName = usePathname();
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // 초기화 및 디테일 페이지 포함 경로 설정
  useEffect(() => {
    const targetNavIndex = HeaderNavPaths.findIndex((item) => {
      if (item === '/') {
        return pathName === '/';
      } else {
        return pathName.startsWith(item);
      }
    });

    setCurrentIndex(targetNavIndex);
    setActiveIndex(targetNavIndex);
  }, [pathName]);

  const pageRouting = (index: number) => {
    // 디테일 페이지에서 전체 보드로 이동/그 외의 경우 return
    if (index === currentIndex) {
      // 디테일 페이지일 경우 전체 리스트 페이지로 이동
      if (pathName.startsWith('/market/')) {
        router.push('/market');
      } else if (pathName.startsWith('/local-food/')) {
        router.push('/local-food');
      }
      return;
    }
  };

  const handleNaviBox = (index: number) => {
    if (isLoading) return;

    // 현재 탭 클릭 시
    if (index === currentIndex) {
      pageRouting(index);
      return;
    }
    setIsLoading(true);

    // 홈 = 0 일 때는 무조건 양수 : 4, 2
    // 전통시장 = 2 일 때는 양수 혹은 음수 : -2, 2
    // 특산물 = 4 일 때는 무조건 음수 : -4, -2
    const count = index - currentIndex;

    // 음수 - 역방향 : 특산물일 때 혹은 전통시장에서 홈으로 갈 때 4,3,2,1,0
    if (count < 0) {
      let startIndex = currentIndex;
      const activeInterval = setInterval(() => {
        if (startIndex <= index) {
          router.push(HeaderNav[index].path);
          clearInterval(activeInterval);
          setIsLoading(false);
          setActiveIndex(-1);
        }

        setActiveIndex(startIndex);
        startIndex--;
      }, 200);

      // 양수 - 정방향 : 홈일 때 혹은 전통시장에서 특산물로 갈 때 0,1,2,3,4
    } else {
      let startIndex = currentIndex;
      const activeInterval = setInterval(() => {
        if (startIndex >= index) {
          router.push(HeaderNav[index].path);
          clearInterval(activeInterval);
          setIsLoading(false);
          setActiveIndex(-1);
        }

        setActiveIndex(startIndex);
        startIndex++;
      }, 200);
    }
  };

  const handleClickLogOut = async () => {
    try {
      await api.auth.logOut();
      queryClient.invalidateQueries();
      router.push('/log-in');
    } catch (err) {
      console.log('로그아웃 에러');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[#C8C8C8] bg-normal">
      <div className="flex justify-between flex-1 mx-auto md:mx-3 xl:px-0">
        <div className="flex gap-2 lg:gap-12">
          <div
            className="flex items-center justify-center cursor-pointer pt-[10px] pb-[14px]"
            onClick={() => router.push('/')}
          >
            <TitleLogo />
          </div>
          <nav className="relative flex items-center gap-2 lg:gap-5">
            {HeaderNav.map((item: headerNavType, index: number) => (
              <div
                key={index}
                className="flex flex-row justify-center items-center gap-2 lg:gap-5"
              >
                {item.path === 'divider' ? (
                  <div
                    className={`w-[50px] h-[1px] bg-label-alternative rounded-[0.5px] transition-colors duration-300 lg:w-[72px] ${
                      index === activeIndex
                        ? 'bg-primary-30'
                        : 'bg-label-alternative'
                    }`}
                  >
                    {' '}
                  </div>
                ) : (
                  <div
                    onClick={() => handleNaviBox(index)}
                    className={`py-[15px] px-[20px] text-nowrap cursor-pointer transition-colors duration-300 
                    ${
                      index === activeIndex
                        ? 'text-primary-30'
                        : 'text-label-alternative'
                    }
                    ${
                      pathName === item.path
                        ? 'text-primary-10'
                        : 'text-label-alternative'
                    }
                    `}
                  >
                    {item.pathNaviName}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex gap-5">
          <div className="flex items-center justify-center">
            <ShowSearchCart showSearch={true} showCart={true} />
          </div>
          {user && user?.avatar ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="ring-0 focus:ring-0 focus:outline-none">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image
                    src={user.avatar}
                    alt={`${user.nickname} 이미지`}
                    width={36}
                    height={36}
                    className="w-9 h-9 border rounded-full border-primary-10"
                  />
                  <div className="text-label-strong text-base font-semibold leading-[25.6px] text-nowrap">
                    {user.nickname}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-normal">
                <DropdownMenuItem
                  onClick={() => router.push('/my-page')}
                  className="cursor-pointer"
                >
                  내 프로필
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/my-page/likemarket-page')}
                  className="cursor-pointer"
                >
                  관심 전통시장
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/my-page/coupon-page')}
                  className="cursor-pointer"
                >
                  할인쿠폰
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/pay-history')}
                  className="cursor-pointer"
                >
                  주문 내역
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={() => router.push('/payment')}
                  className="cursor-pointer"
                >
                  고객센터
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleClickLogOut}
                  className="cursor-pointer"
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-3 justify-center items-center">
              <button
                type="button"
                className="bg-primary-20 text-label-light text-nowrap rounded-[10px] px-4 py-[10px] w-[120px] h-10 flex justify-center items-center"
                onClick={() => router.push('/log-in')}
              >
                입장하기
              </button>
              <button
                type="button"
                className="bg-translate border-2 border-primary-20 text-primary-20 text-nowrap rounded-xl px-4 py-3 w-[120px] h-10 flex justify-center items-center"
                onClick={() => router.push('/sign-up')}
              >
                회원가입
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebHeader;
