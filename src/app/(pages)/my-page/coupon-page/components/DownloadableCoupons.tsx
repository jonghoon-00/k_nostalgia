// 추후 쿠폰 다운로드 기능이 생기면, 추가 구현 필요
import Image from 'next/image';

const DownloadableCoupons = () => {
  return (
    <div className="flex-col items-center mt-[217px]">
      <Image
        src="/image/StateSad.png"
        alt="다운로드 가능한 쿠폰이 없어요"
        width={114}
        height={97}
        className="w-[114px] h-[97px] mx-auto md:w-[114px] md:h-[97px]"
      />
      <p className="text-label-assistive mt-4">
        {' '}
        다운로드 가능한 쿠폰이 없어요
      </p>
    </div>
  );
};

export default DownloadableCoupons;
