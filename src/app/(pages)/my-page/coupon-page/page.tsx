import { getCouponImageUrlList } from '@/app/api/coupon/getCouponForServer';
import Image from 'next/image';
import CouponContents from './components/CouponContents';

const CouponPage = async () => {
  const { couponImageUrlList, hasNoList } = await getCouponImageUrlList();

  return (
    <div className=" p-4 bg-normal mt-20">
      <div className="hidden md:mb-[48px] md:flex">
        <Image
          src="/image/Coupon_Tiger2.png"
          alt="마이페이지 쿠폰호랑이"
          width={141}
          height={88}
          className="w-[141px] h-[88px]"
          priority
        />
      </div>

      <>
        <CouponContents
          imageUrlList={couponImageUrlList}
          hasNoList={hasNoList}
        />
      </>
    </div>
  );
};

export default CouponPage;
