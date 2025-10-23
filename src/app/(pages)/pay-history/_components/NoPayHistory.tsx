import NoList from '@/components/common/NoList';
import { usePathname } from 'next/navigation';

const NoPayHistory = () => {
  const pathName = usePathname();
  return (
    <main
      className={`w-full md:w-[60vw] flex flex-col  gap-[16px] min-w-[375px] max-w-[737px] ${
        pathName === '/pay-history' && 'md:mt-10'
      }`}
    >
      <div
        className={`hidden py-10 border-b-8 border-[#F2F2F2] md:flex md:justify-between ${
          pathName === '/my-page' && 'border-none'
        }`}
      >
        <img src="/image/pay_history_tiger.png" alt="주문내역 호랑이 아이콘" />
      </div>
      <div
        className={`my-auto flex gap-4 justify-center items-center flex-col ${
          pathName === '/pay-history' ? 'md:h-[68vh]' : 'mb-[80px]'
        }`}
      >
        <NoList
          message="주문 내역이 없어요"
          linkButton={{
            href: '/local-food',
            label: '특산물 보러 가기'
          }}
        />
      </div>
    </main>
  );
};

export default NoPayHistory;
