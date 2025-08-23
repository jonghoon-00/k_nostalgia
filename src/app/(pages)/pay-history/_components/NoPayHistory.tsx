import NoList from '@/components/common/NoList';
import clsx from 'clsx';
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
        <NoList message="주문 내역이 없어요" />
        <button
          type="button"
          onClick={() => (window.location.href = '/local-food')}
          className={clsx(
            'h-[48px]',
            'px-[32px] py-[12px] mt-[12px]',
            'rounded-[12px]',
            'text-white font-semibold leading-[140%]',
            'bg-[#9C6D2E]'
          )}
        >
          특산물 보러 가기
        </button>
      </div>
    </main>
  );
};

export default NoPayHistory;
