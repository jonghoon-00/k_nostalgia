//desktop 사이즈의 마이페이지에 들어가는 최상단 이미지 (주문 내역 페이지에서는 사용하지 않음)

import { usePathname, useRouter } from 'next/navigation';
import { BsChevronRight } from 'react-icons/bs';

const TopIconInDesktop = () => {
  const pathName = usePathname();
  const route = useRouter();
  return (
    <figure
      className={`hidden py-10 border-b-8 border-[#F2F2F2] md:flex md:justify-between ${
        pathName === '/my-page' && 'border-none'
      }`}
    >
      <img src="/image/pay_history_tiger.png" alt="복숭아를 든 호랑이 이미지" />
      <div
        className={`flex items-center text-[14px] gap-1 ${
          pathName === '/payment' && 'hidden'
        }`}
      >
        <span
          className="underline cursor-pointer"
          onClick={() => route.push('payment')}
        >
          더보기
        </span>
        <BsChevronRight className=" w-4 h-4 text-[#545454] cursor-pointer" />
      </div>
    </figure>
  );
};

export default TopIconInDesktop;
