import React, { useRef } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import CancelUser, {
  CancelUserHandle
} from '../../my-page/_components/CancelUser';

interface CustomerSidebarProps {
  selected: number;
  setSelected: (id: number) => void;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  selected,
  setSelected
}) => {
  const router = useRouter();
  const cancelUserRef = useRef<CancelUserHandle>(null);

  const menuItems = [
    { id: 1, label: '공지사항' },
    { id: 2, label: '자주 묻는 질문' },
    { id: 3, label: '대량 주문 문의' },
    { id: 4, label: '판매자 등록 문의' },
    { id: 5, label: '회원탈퇴' }
  ];

  const handlegoAnnounce = () => {
    router.push('/customer-service/announcement');
  };

  const handlegoFaq = () => {
    router.push('/customer-service/faq-page');
  };

  const handleCancelClick = () => {
    setSelected(5);
    cancelUserRef.current?.handleDeleteUser();
  };

  return (
    <div className="w-[193px] mb-[208px]">
      <div className="h-[290px] border-[#E0E0E0] border">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelected(item.id);
              if (item.id === 1) handlegoAnnounce();
              if (item.id === 2) handlegoFaq();
              if (item.id === 5) handleCancelClick();
            }}
            className={`h-[58px] border-b flex px-5 py-4 justify-between items-center font-medium cursor-pointer ${
              selected === item.id
                ? 'text-primary-20 bg-[#F2F2F2]'
                : 'text-label-alternative'
            }`}
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
