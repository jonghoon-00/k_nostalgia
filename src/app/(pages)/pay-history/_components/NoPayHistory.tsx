//주문 내역이 없을 경우 렌더링되는 컴포넌트
//update : 24.9.5

import Image from 'next/image';
import Link from 'next/link';
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
        <img src="/image/pay_history_tiger.png" alt="복숭아 든 귀여운 호랑이" />
      </div>
      <div
        className={`my-auto flex gap-4 justify-center items-center flex-col ${
          pathName === '/pay-history' ? 'md:h-[68vh]' : 'mb-[80px]'
        }`}
      >
        <Image
          src="/image/StateSad.png"
          alt="우는 호랑이"
          width={114}
          height={97}
          className="w-[114px] h-[97px]"
        />
        <p className="text-[18px] text-[#AFACA7] font-medium">
          주문 내역이 없어요
        </p>
        <Link href={'local-food'}>
          <button className="w-au h-[48px] px-[32px] py-[12px] rounded-[12px] text-white bg-[#9C6D2E] mt-[12px] font-semibold leading-[140%]">
            특산물 보러 가기
          </button>
        </Link>
      </div>
    </main>
  );
};

export default NoPayHistory;
