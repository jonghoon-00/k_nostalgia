import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { BsChevronRight } from 'react-icons/bs';

import { ROUTES } from '@/constants';
import clsx from 'clsx';
import CancelUser, {
  CancelUserHandle
} from '../../my-page/_components/CancelUser';

interface CustomerSidebarProps {
  selected: number;
  setSelected: (id: number) => void;
}
interface MenuItem {
  id: number;
  label: string;
}
type MenuItemList = MenuItem[];

type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  selected,
  setSelected
}) => {
  const router = useRouter();
  const cancelUserRef = useRef<CancelUserHandle>(null);

  const menuItems: MenuItemList = [
    { id: 1, label: '공지사항' },
    { id: 2, label: '자주 묻는 질문' },
    { id: 3, label: '대량 주문 문의' },
    { id: 4, label: '판매자 등록 문의' },
    { id: 5, label: '회원탈퇴' }
  ];
  const routeMap: Record<number, RoutePath> = {
    1: ROUTES.NOTICE,
    2: ROUTES.FAQ
    // 3,4 : 추후에 추가
  };

  const navigateTo = (path: RoutePath) => {
    router.push(path);
  };

  const handleClick = (item: MenuItem) => {
    sessionStorage.setItem('selected_customer_sidebar', `${item.id}`);

    if (item.id === 5) {
      cancelUserRef.current?.handleDeleteUser();
      return;
    }
    setSelected(item.id);

    const path = routeMap[item.id];
    if (path) navigateTo(path);
  };

  return (
    <div className="w-[193px]">
      <div className="border border-[#E0E0E0]">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className={clsx(
              'border-b flex px-5 py-4 justify-between items-center font-medium cursor-pointer',
              selected === item.id && item.id !== 5
                ? 'text-primary-20 bg-[#F2F2F2]'
                : 'text-label-alternative'
            )}
          >
            {item.label}
            <BsChevronRight />
          </div>
        ))}
      </div>
      <CancelUser ref={cancelUserRef} />
    </div>
  );
};

export default CustomerSidebar;
