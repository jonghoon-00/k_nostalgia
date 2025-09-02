import Image from 'next/image';
import CustomerEmail from './CustomerEmail';

const CustomerNoContext = () => {
  return (
    <div>
      <div className="flex justify-center items-center flex-col">
        <Image
          src="/image/StateSad.png"
          alt="우는 호랑이"
          width={114}
          height={97}
          className="w-[114px] h-[97px]"
        />
        <p className="text-[18px] text-label-assistive font-medium">
          등록되지 않은 정보에요.
        </p>
      </div>
      <CustomerEmail />
    </div>
  );
};

export default CustomerNoContext;
