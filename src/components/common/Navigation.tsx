'use client';

import { usePathname, useRouter } from 'next/navigation';
import { IconType } from 'react-icons/lib';
import KNostalgiaIcon1 from '../icons/KNostalgiaIcon1';
import KNostalgiaIcon2 from '../icons/KNostalgiaIcon2';
import { LocalFoodIcon } from '../icons/LocalFoodIcon';
import { MyProfile } from '../icons/MyProfile';
import { TraditionalMarketIcon } from '../icons/TraditionalMarketIcon';

type NaviList = {
  label: string;
  path: string;
  icon: IconType;
  activeIcon: IconType;
};

const naviList: NaviList[] = [
  {
    label: '홈',
    path: '/',
    icon: KNostalgiaIcon1,
    activeIcon: KNostalgiaIcon2 as IconType
  },
  {
    label: '전통 시장',
    path: '/market',
    icon: TraditionalMarketIcon,
    activeIcon: TraditionalMarketIcon
  },
  {
    label: '특산물',
    path: '/local-food',
    icon: LocalFoodIcon,
    activeIcon: LocalFoodIcon
  },
  {
    label: '내 프로필',
    path: '/my-page',
    icon: MyProfile,
    activeIcon: MyProfile
  }
];

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigationClick = (path: string) => {
    router.push(`${path}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t-2 justify-between pt-3 px-5 pb-6 mt-auto bg-normal ">
      {naviList.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col items-center cursor-pointer gap-1 w-[80px] h-[48px] px-2 ${
            pathname === item.path ? 'text-primary-strong' : 'text-black'
          }`}
          onClick={() => handleNavigationClick(item.path)}
        >
          {pathname.includes(item.path) ? (
            <item.activeIcon fill="#9C6D2E" />
          ) : (
            <item.icon />
          )}
          <div className="text-[12px] text-nowrap flex items-center justify-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Navigation;
